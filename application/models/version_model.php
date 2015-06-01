<?
/**
 *  Model that handles all guide versioning and trash
 */
class Version_Model extends CI_Model
{
    private $collection = null;
    private $host = null;

    /**
     * Constructor
     * @param string $host App were working with
     */
    function __construct($host)
    {
        // Call the Model constructor
        parent::__construct();
        $this->load->library('mongo_db');

        //Load from config
        $this->load->config('config', TRUE);
        $this->host = $host;

        $this->collection = $host . "_" . GUIDES;
        $this->version_collection = $host . "_" . VERSIONS;
    }

    /** Create the first version
     * @param string $guideid Guide ID
     * @param [] $guide Guide object
     * @return string Version ID
     */
    function create($guideid, $guide)
    {
        try {
            if (!isset($guide['step']))
                $guide['step'] = array();

            $new_version = array(
                "guideid" => $guideid,
                'current' => 1,
                "versions" => array($guide)
            );

            $versionid = $this->mongo_db
                ->insert($this->version_collection, (array)$new_version);

            return $versionid;
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }
    }

    /** Guide was updated, so create a new version
     * @param string $guideid Guide ID
     * @param [] $guide Guide object
     * @return bool Success
     */
    function update($guideid, $guide)
    {
        try
        {
            // Need to get old guide data to store all fields in versioning
            $old_guide = $this->mongo_db
                ->where(array('_id' => new MongoId($guideid)))
                ->get($this->collection);
            $guide = array_merge($old_guide[0], $guide);
            unset($guide['id']);

            // Check if there is any previous versions, and create if necessary
            if ($this->_is_empty($guideid))
            {
                $success = $this->create($guideid, $guide);
                return $success;
            }

            // Find out what version number to create
            $current = $this->get_current_version($guideid) + 1;
            $guide['version'] = $current;

            // Create new version in guides array
            return $this->mongo_db
                ->where(array('guideid' => $guideid))
                ->push('versions', $guide)
                ->set(array("current" => $current))
                ->update($this->version_collection);
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }


    }

    /**
     * Remove a specific version
     * @param string $guideid Guide ID
     * @param string[] $versions Version number, or array of numbers
     * @return bool Success
     */
    function delete($guideid, $versions)
    {
        try
        {
            $guides = $this->mongo_db
                ->where('guideid', $guideid)
                ->get($this->version_collection);
            // TODO: where was this ID set
            unset($guides[0]['id']);

            // Convert to single element array if a string, to pass to foreach
            if (!is_array($versions))
                $versions = array($versions);

            foreach ($guides[0]['versions'] as $key => $value) {
                foreach ($versions as $version) {
                    if ($value['version'] == $version)
                        unset($guides[0]['versions'][$key]);
                }
            }

            return $this->mongo_db
                ->where('guideid', $guideid)
                ->set('versions', array_values($guides[0]['versions']))
                ->update($this->version_collection);
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }

        /**
         * This should work!!!
         * http://stackoverflow.com/questions/29705173/unable-to-get-mongodbs-runcommand-to-successfully-execute-an-update-pull-on-su

        $select = array('guideid' => $guideid);

        $update = array(
        '$pull' => array(
        "versions" => array(
        "version" => $version
        )
        )
        );

        $query = array(
        'update' => $this->version_collection,
        'updates' => array(
        array(
        'q'=> $select,
        'u' => $update
        )
        )
        );

        $tt = json_encode($query);
        $execute = $this->mongo_db->_dbhandle->command($query);

        $t = $this->mongo_db->lastQuery();
         */
    }

    /** Get all versions for a specific guide
     * @param string $guideid Guide ID
     * @return [] versions
     */
    function get_all($guideid)
    {
        try
        {
            $versions = $this->mongo_db
                ->where(array('guideid' => $guideid))
                ->get($this->version_collection);

            return $versions;
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }
    }


    /**
     * Restore an older version
     * @param string $trashid Trash ID
     * @param int $version Version number
     * @return bool Success
     */
    function restore($trashid, $version)
    {

        // TODO: Clean this up, quick fix for ESP training

//        $guide = false;
//        if (
//        $guide = $this->get_version($trashid, $version) &&
//            $this->guide_model->update_by_id($trashid, $guide) &&
//            $this->set_current_version($trashid, $version)
//        )
//            return true;
//        else
//            return false;
        $guide = $this->get_version($trashid, $version);
        $this->guide_model->update_by_id($trashid, $guide);

        return true;

    }

    /**
     * Get a specific version
     * @param string $guideid Guide ID
     * @param int $version
     * @return version[] Version
     */
    function get_version($guideid, $version)
    {
        try
        {
            $guide = $this->mongo_db
                ->select(array('versions.$'))
                ->where('versions.version', (int)$version)
                ->where('guideid', $guideid)
                ->get($this->version_collection);

            $version = $guide[0]['versions'][0];
            return $version ? $version : false;
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }
    }

    /**
     * Get current version number
     * @param string $guideid Guide ID
     * @return int
     */
    function get_current_version($guideid)
    {
        $version = $this->mongo_db
            ->where(array('guideid' => $guideid))
            ->select(array('current'), array('guides'))
            ->get($this->version_collection);

        return $version[0]['current'];
    }

    function set_current_version($guideid, $version)
    {
        try {
            return $this->mongo_db
                ->where('guideid', $guideid)
                ->set('current', $version)
                ->update($this->version_collection);
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }
    }

    /**
     * Bring in all versions for a guide at once
     * (Needed for restoring a guide from trash)
     * @param version[] $versions Array of versions
     * @return bool Success
     */
    function import_versions($versions)
    {
        try
        {
            $this->mongo_db
                ->insert($this->version_collection, $versions);
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }
    }

    /**
     * Checks to see if any versions exist
     * @return bool True if no versions for that guide
     */
    private function _is_empty($guideid)
    {
        try
        {
            $count = $this->mongo_db
                ->where(array('guideid' => $guideid))
                ->count($this->version_collection);
            return $count > 0 ? false : true;
        }
        catch (Exception $e)
        {
            log_message('error', $e->getMessage());
            return false;
        }
    }
}
