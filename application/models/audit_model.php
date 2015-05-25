<?
/**
*  Model that stores and fetches audit data
 *
 * CRUD API services for Aero AUDIT
 *
 * @package		Aero
 * @subpackage	audit
 * @category	REST Controller
 * @author		Trevor Dell
*/
class Audit_Model extends CI_Model
{
	private $collections = array();
	private $collection = null;
	private $host = null;

	/**
	 * Constructor
	*/
	function __construct($host)
	{
		// Call the Model constructor
		parent::__construct();
		$this->load->library('aero_lib');
		$this->load->library('mongo_db');

		//Load from config
		$this->load->config('config', TRUE);
		$this->host = $host;
		$this->collection = $host . "_" . AUDIT;
	}

	/**
	 * Get entry by id
	 * @param $id string ID of entry
	 * @return object Returned entry
	 */
	public function get_by_id($id)
	{
		try
		{
			$entry = array('_id' => new MongoId($id));

			$entry = $this->mongo_db
				->where($entry)
				->get($this->collection);

			return $entry[0];
		}
		catch (Exception $e)
		{
			$this->aero_lib->error($e->getMessage());
			return false;
		}
	}

	/**
	 * Get entries by ids
	 * @param string[] $ids ID of entry
	 * @return object[] Returned entries
	 */
	public function get_by_ids($ids)
	{
		foreach ($ids as $id)
		{
			if (!$this->get_by_id($id))
			{
				return false;
			}
		}
		return true;
	}

	/* Get all audit info about a user
	 * @param string $user User name
	 * @return Audit_objects[]
	 */
	public function get_by_user($user)
	{
		try
		{
			$entries = $this->mongo_db
				->where(array('user' => $user))
				->get($this->collection);

			return $entries;
		}
		catch (Exception $e)
		{
			$this->aero_lib->error($e->getMessage());
			return false;
		}
	}


	/**
	 * Get entry(s) by id(s)
	 * @param $id string ID of entry
	 * @return object Returned entry
	 */
	public function get_by_host($host)
	{
		log_message('debug', 'Aero: lookup ' . $host);

		$where = array('host' => $host);

		$entry = $this->mongo_db
			->where($where)
			->get($this->collection);

		if(sizeof($entry) > 0){
			return $entry[0];
		}else{
			return $entry;
		}
	}

	/**
	 * Create an audit entry
	 * @param object Audit object(s)
	 * @return string ID(s)
	*/
	public function create($entry = array())
	{
		try
		{
			$id = $this->mongo_db->insert($this->collection, (array) $entry);
		}
		catch (Exception $e)
		{
			$this->aero_lib->error($e->getMessage());
			return false;
		}

		return $id->{'$id'};
	}

	/**
	 * Updates an entry with new data
	 * @param string ID of audit object(s) to update
	 * @return object Updated audit entry object(s)
	 */
	public function update_by_id($id, $entry)
	{
		try
		{
			$this->mongo_db
			->where(array('_id' => new MongoId($id)))
			->set( (array) $entry )
			->update($this->collection);

			return $entry;
		}
		catch (Exception $e)
		{
			$this->aero_lib->error($e->getMessage());
		    return false;
		}
	}

	/**
	 * Delete entry by id
	 * @param string id
	 * @return boolean
	 */
	public function delete_by_id($id)
	{
		try
		{
			$this->mongo_db
				->where(array('_id' => new MongoId($id)))
				->delete($this->collection);

			return true;
		}
		catch (Exception $e)
		{
			$this->aero_lib->error($e->getMessage());
			return false;
		}
	}

	/**
	 * Deletes multiple AUDIT using an array of ids
	 *
	 * @param array guide ids
	 * @return boolean
	 */
	function delete_by_ids($ids)
	{
		// @TODO: Make this a single Mongo query
		foreach ($ids as $id)
		{
			if (!$this->delete_by_id($id))
			{
				return false;
			}
		}
		return true;
	}
}