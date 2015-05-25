<?
/**
*  Model that fetches all data associated with tours
*/
class Pagedata_Model extends CI_Model
{
	public $host;
	public $collection;
	public $defaults = array("username", "roles", "require", "fire");


	/**
	 * Constructor
	*/
	function __construct($host)
	{
		// Call the Model constructor
		parent::__construct();
		$this->load->library('mongo_db');

		$this->host = str_replace('.', '_', $host);
		$this->host = str_replace('://', '_', $host);
		$this->collection = $this->host . "_" . PAGEDATA;

		//Load from config
		$this->load->config('config', TRUE);
		$this->mongo_db->addIndex($this->collection, array("active" => 1, "title" => 1));

	}


	/**
	 * Get all PAGEDATA from mongo
	 * @param array $order_by order of tours
	 * @return array $PAGEDATA
	*/
	public function get_all($order = array())
	{
		if (sizeof($order) == 0 ) $order = array('host' => 'ASC');
		$data = array();
		$where = array();

		try
		{
			//Get PAGEDATA
			$pagedata = $this->mongo_db
				->where($where)
				->orderBy($order)
				->get($this->collection);

			//Get or set defaults
			if(sizeof($pagedata) > 0){
				$data = $pagedata;
			}else{
				$data = $this->set_defaults();
			}

			return $data;
		}
		catch (Exception $e)
		{
			return false;
		}
	}


	/**
	 * Set default config
	 * @return array $pagedata
	 */
	public function set_defaults()
	{
		$datas = array();

		//Create defaults
		foreach($this->defaults as $default){

			$data['type'] = 'js';
			$data['prop'] = $default;
			$data['value'] = '';
			$data['id'] = $this->create($data);

			array_push($datas, $data);
		}

		log_message('error', 'Aero: Default page data created:' . json_encode($datas) );

		return $datas;
	}

	/**
	 * Get pagedata by id
	 * @param array $id string
	 * @return array $pagedata
	 */
	public function get_by_id($id)
	{
		$where = array('_id' => new MongoId($id));

		$pagedata = $this->mongo_db
			->where($where)
			->get($this->collection);

		return $pagedata[0];
	}

	/**
	 * Get pagedata by ids
	 * @param string[] $ids Requested IDs
	 * @return string[] Pagedata
	 */
	public function get_by_ids($ids)
	{
		$data = array();
		foreach ($ids as $id)
		{
			$guide = $this->get_by_id($id);
			array_push($data, $guide);
		}
		return $data;
	}


	/**
	 * Get pagedata by id
	 * @param array $id string
	 * @return array $pagedata
	 */
	public function get_basic()
	{
		$pagedata = $this->mongo_db
			->select(array('prop', 'value'))
			->orWhere(array('prop' => 'username'))
			->orWhere(array('prop' => 'roles'))
			->orWhere(array('prop' => 'require'))
            ->orWhere(array('prop' => 'fire'))
			->get($this->collection);

		return $pagedata;
	}


	/**
	 * Get all PAGEDATA from mongo
	 * @param array $order_by order of tours
	 * @return array $PAGEDATA
	 */
	public function create($pagedata)
	{
		unset($pagedata['id']);

		try
		{
			$id = $this->mongo_db->insert($this->collection, (array) $pagedata );
		}
		catch (Exception $e)
		{
			return false;
		}

		return $id->{'$id'};
	}

	/**
	 * Updates a pagedata with new data
	 */
	public function update_by_id($id, $pagedata)
	{
		unset($pagedata['id']);

		$this->mongo_db
			->where(array('_id' => new MongoId($id)))
			->set( (array) $pagedata )
			->update($this->collection);

		return $pagedata;
	}

	/**
	 * Delete pagedata by id
	 * @param string id or string[] id
	 * @return boolean
	 */
	public function delete_by_id($id)
	{
		try
		{
			if (is_array($id))
			{
				$this->delete_by_ids($id);
				return true;
			}

			$this->mongo_db
				->where(array('_id' => new MongoId($id)))
				->delete($this->collection);

			return true;
		}
		catch (Exception $e)
		{
			return false;
		}
	}

	/**
	 * Deletes multiple PAGEDATA using an array of ids
	 *
	 * @param array pagedata ids
	 * @return boolean
	 */
	private function delete_by_ids($ids)
	{
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
