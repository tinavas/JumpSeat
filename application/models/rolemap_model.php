<?
/**
*  Model that fetches all data associated with tours
*/
class RoleMap_Model extends CI_Model
{
	private $collection = null;
	private $guide_collection = null;
	private $role_collection = null;
	private $host = null;

	/**
	 * Constructor
	*/
	function __construct($host)
	{
		// Call the Model constructor
		parent::__construct();
		$this->load->library('mongo_db');

		//Load from config
		$this->load->config('config', TRUE);
		$this->host = $host;
		$this->collection = $host . "_" . ROLEGUIDE;
		$this->guide_collection = $host . "_" . GUIDES;
		$this->role_collection = $host . "_" . ROLES;
	}

	/**
	 * Does a guide relationship already exist
	 * @param string $roleid
	 * @param string $guideid
	 * @return boolean map exists
	 */
	public function map_exists($roleid, $guideid)
	{
		//Get roles
		$role_map = $this->mongo_db
			->select(array('guideid'))
			->where(array('roleid' => $roleid, 'guideid' => $guideid))
			->get($this->collection);
	
	
		return (sizeof($role_map) > 0);
	}
	
	
	/**
	 * Get list of guides by role id
	 * @param array $id id
	 * @return array $role
	 */
	public function get_by_role($roleid)
	{
		$guides = array();
		$whereIds = array();
		$roles = array();

		//Get roles
		$role_map = $this->mongo_db
			->select(array('guideid'))
			->where(array('roleid' => $roleid))
			->get($this->collection);

		if(sizeof($role_map) > 0)
		{
			foreach ($role_map as $role)
			{
				array_push($whereIds, array('_id' => new MongoId($role['guideid'])));
			}

			$roles = $this->mongo_db
				->select(array('title', 'desc', 'step'))
				->orWhere($whereIds)
				->get($this->guide_collection);
		}

		return $roles;
	}


	/**
	 * Get list of roles by guide id
	 * @param array $id id
	 * @return array $guide
	 */
	public function get_by_guide($guideid)
	{
		$guides = array();
		$whereIds = array();
		$roles = array();

		//Get pathways
		$role_map = $this->mongo_db
			->select(array('roleid'))
			->where(array('guideid' => $guideid))
			->get($this->collection);

		if(sizeof($role_map) > 0)
		{
			foreach ($role_map as $role)
			{
				array_push($whereIds, array('_id' => new MongoId($role['roleid'])));
			}

			$roles = $this->mongo_db
				->select(array('title'))
				->orWhere($whereIds)
				->get($this->role_collection);
		}

		return $roles;
	}


	/**
	 * Count guides for a given role
	 * @param array $id id
	 * @return array $guide
	 */
	public function count_guides($roleid)
	{
		//Get pathways
		$count = $this->mongo_db
			->where(array('roleid' => $roleid))
			->count($this->collection);

		return $count;
	}


	/**
	 * Create a new association (role to guide)
	 * @param string $roleid
	 * @param string $guideid
	 * @return string $if
	 */
	public function create($roleid, $guideid)
	{
		$map['roleid'] = $roleid;
		$map['guideid'] = $guideid;

		if(!$this->map_exists($roleid, $guideid)){
			try
			{
				$id = $this->mongo_db->insert($this->collection, $map );
				
				$this->load->model('guide_model', '', FALSE, $this->host);
				$this->guide_model->update_cache();
				
				return $id->{'$id'};
			}
			catch (Exception $e)
			{
				return false;
			}
		}
		return false;
	}


	/**
	 * Delete role association to guide
	 * @param string $roleid
	 * @param string $guideid
	 * @return boolean
	 */
	public function delete($roleid, $guideid)
	{
		try
		{
			if(is_string($guideid)){

				//Delete one
				$this->mongo_db
					->where(array('roleid' => $roleid, 'guideid' => $guideid))
					->delete($this->collection);
				
				$this->load->model('guide_model', '', FALSE, $this->host);
				$this->guide_model->update_cache();

				return true;

			}else{

				//Delete multi
				foreach ($guideid as $i)
				{
					if (!$this->delete($roleid, $i))
					{
						return false;
					}
				}
				return true;
			}
		}
		catch (Exception $e)
		{
			return false;
		}
	}
}