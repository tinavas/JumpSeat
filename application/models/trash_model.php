<?
/**
 *  Model that handles all guide versioning and trash
 */
class Trash_Model extends CI_Model
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
        $this->trash_collection = $host . "_" . TRASH;

        $this->load->model('guide_model', '', FALSE, $host);
    }

    /** Move a guide (and all it's versions) to the trash
     * @param string $guideid Guide ID
     */
    function trash_guide($guideid)
    {
        $guide = $this->guide_model->get_by_id($guideid);
        unset($guide['id']);
        $guide['versions'] = array();

        $trashid = $this->mongo_db
            ->insert($this->trash_collection, $guide);
        $trashid = $trashid->{'$id'};

        $this->mongo_db
            ->where(array('_id' => new MongoId($guideid)))
            ->delete($this->collection);

        $this->_trash_versions($guideid, $trashid);
    }

    /** Move all the versions of a guide to the trash
     * @param string $guideid Guide ID
     * @param string $trashid Trash ID
     */
    private function _trash_versions($guideid, $trashid)
    {
        $guides = $this->mongo_db
            ->where('guideid', $guideid)
            ->get($this->version_collection);
        unset($guides[0]['id']);
        unset($guides[0]['guideid']);

        $g = $this->mongo_db
            ->where(array('_id' => new MongoId($trashid)))
            ->get($this->trash_collection);

        $t = $this->mongo_db
            ->where(array('_id' => new MongoId($trashid)))
//            ->push('versions', (array)$guides[0])
            ->set('versions', $guides[0])
            ->update($this->trash_collection);
        $tt = $this->mongo_db->lastQuery();

        $this->mongo_db
            ->where('guideid', $guideid)
            ->delete($this->version_collection);
        }

    /** Restore a guide from trash
     * @param $id Trash ID
     */
    function restore($id)
    {
        $guide = $this->mongo_db
            ->where(array('_id' => new MongoId($id)))
            ->get($this->trash_collection);
        $guide = $guide[0];

        $versions = false;
        if (isset($guide['versions']))
        {
            $versions = $guide['versions'];
            unset($guide['versions']);
        }

//        $guideid = $this->guide_model->create($guide);
        $guideid = $this->mongo_db
            ->insert($this->collection, $guide);

        $versions['guideid'] = $guideid;

        $this->load->model('version_model', '', FALSE, $this->host);
        if ($versions)
            $this->version_model->import_versions($versions);

        $this->mongo_db
            ->where(array('_id' => new MongoId($id)))
            ->delete($this->trash_collection);
    }

    /** Get all guides in the trash
     * @return [] guide
     */
    function get_all()
    {
        $guides = $this->mongo_db
            ->select(array(), array('versions'))
            ->get($this->trash_collection);

        return $guides;
    }

    function delete_by_id($id)
    {
        $this->mongo_db
            ->where(array('_id' => new MongoId($id)))
            ->delete($this->trash_collection);
    }

    function delete_by_ids($ids)
    {
        foreach ($ids as $id)
            $this->delete_by_id($id);
    }

    function empty_trash()
    {
        $this->mongo_db->dropCollection('aero',$this->trash_collection);
    }
}
