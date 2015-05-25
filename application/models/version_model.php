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
     */
    function create($guideid, $guide)
    {
        if (!isset($guide['step']))
            $guide['step'] = array();

        $new_version = array(
            "guideid" => $guideid,
            'current'   => 1,
            'latest'    => 1,
            "versions" => array($guide)
            );

        $this->mongo_db->insert($this->version_collection, (array) $new_version);
    }

    /** Guide was updated, so create a new version
     * @param string $guideid Guide ID
     * @param [] $guide Guide object
     */
    function update($guideid, $guide)
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
            $this->create($guideid, $guide);
            return;
        }

        // Find out what version number to create
        $current = $this->get_current_version($guideid) + 1;
        $guide['version'] = $current;

        // Create new version in guides array
        $t = $this->mongo_db
            ->where(array('guideid' => $guideid))
            ->push('versions', $guide)
            ->set(array(
                "current" => $current,
                "latest" => $current
            ))
            ->update($this->version_collection);
    }

    /** Remove a specific version
     * @param string $guideid Guide ID
     * @param string $version Version number
     */
    function delete($guideid, $version)
    {
        $guides = $this->mongo_db
            ->where('guideid', $guideid)
            ->get($this->version_collection);
        // TODO: where was this ID set
        unset($guides[0]['id']);

        foreach ($guides[0]['versions'] as $key => $value)
        {
            if ($value['version'] == $version)
                unset($guides[0]['versions'][$key]);
        }

        $this->mongo_db
            ->where('guideid', $guideid)
            ->set('versions', array_values($guides[0]['versions']))
            ->update($this->version_collection);

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
        $versions = $this->mongo_db
            ->where(array('guideid' => $guideid))
            ->get($this->version_collection);

            $t = $this->mongo_db->lastQuery();
            return $versions;
    }


    /** Switch to a specific version
     * @param string $guideid Guide ID
     * @param int $version Version number
     */
    function use_version($guideid, $version)
    {
        $guide = $this->get_version($guideid, $version);
        $this->guide_model->update_without_version($guideid, $guide);
        $this->set_current_version($guideid, $version);
    }

    /** Get a specific version
     * @param string $guideid Guide ID
     * @param int $version
     * @return [] guide
     */
    function get_version($guideid, $version)
    {
        $guide = $this->mongo_db
            ->select(array('versions.$'))
            ->where('versions.version', (int)$version)
            ->where('guideid', $guideid)
            ->get($this->version_collection);

        return $guide[0]['versions'][0];
    }

    /** Get both current and latest version numbers
     * @param string $guideid
     * @return array
     */
    function get_version_numbers($guideid)
    {
        $versions = $this->mongo_db
            ->where(array('guideid' => $guideid))
            ->select(array(), array('guides'))
            ->get($this->version_collection);

        $data = array();
        $data['current'] = $versions[0]['current'];
        $data['latest'] = $versions[0]['latest'];

        return $data;
    }

    /** Get current version number
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
        $this->mongo_db
            ->where('guideid', $guideid)
            ->set('current', $version)
            ->update($this->version_collection);
    }

    /** Bring in all versions for a guide at once
     * @param $versions Array of versions
     */
    function import_versions($versions)
    {
        $this->mongo_db
            ->insert($this->version_collection, $versions);
    }

    /** Checks to see if any versions exist
     * @return bool
     */
    private function _is_empty($guideid)
    {
        $count = $this->mongo_db
            ->where(array('guideid' => $guideid))
            ->count($this->version_collection);
        return $count > 0 ? false : true;
    }
}
