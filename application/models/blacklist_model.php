<?
/**
*  Model that fetches all data associated with tours
*/
class Blacklist_Model extends CI_Model
{
	public $host;
	public $collection;

	/**
	 * Constructor
	*/
	function __construct($host)
	{
		// Call the Model constructor
		parent::__construct();
		$this->load->library('mongo_db');

		$this->collection = $host . "_" . BLACKLIST;
		$this->host = $host;

		//Load from config
		$this->load->config('config', TRUE);

	}

	/**
	 * Matches the passed URL to the blacklist URL collection
	 * Supports wildcard matching prefix/suffix
	 * @param string $url URL
	 * @return boolean URL blackisted or not
	 */
	public function match_url($url)
	{
		try
		{
			$url = $this->sanitize_url($url);
			// Get list of blacklist URLs
			$urls = $this->mongo_db->get($this->collection);

			foreach ($urls as $u)
			{
				// Exact string match
				if (!$u['globPrefix'] && !$u['globSuffix'])
					if (strcmp($url, $u['url']) == 0)
						return true;
					else
						return false;

				$regex = preg_quote($u['url']);

				// Set prefix wildcard search
				if ($u['globPrefix'])
				{
					if
						(substr($regex, 0, 8) == 'http\://')  $regex = substr($regex, 0, 8) .'.*'. substr($regex, 8);
					elseif
						(substr($regex, 0, 9) == 'https\://') $regex = substr($regex, 0, 9) .'.*'. substr($regex, 9);
				}

				// Set suffix wildcard search
				if ($u['globSuffix']) $regex = $regex . '.*';

				// Perform URL match
				$match = preg_match('!' . $regex . '!', $url);
				if ($match) return true;
			}

			// URL not blacklisted
			return false;

		}
		catch (Exception $e)
		{
			return false;
		}
	}

	/**
	 * Get url by id from mongo
	 * @return array $guides
	 */
	public function get_by_id($id)
	{
		//Get guides
		$url = $this->mongo_db
			->where(array('_id' => new MongoId($id)))
			->get($this->collection);

		return $url[0];
	}


	/**
	 * Get all
	 * @param unknown $order
	 * @return boolean|unknown
	 */
	public function get_all($order = array())
	{
		if (sizeof($order) == 0 )
			$order = array('host' => 'ASC');

		$urls = null;
		$where = array();

		//Get URLs
		try
		{
		$urls = $this->mongo_db
			->where($where)
			->orderBy($order)
			->get($this->collection);
		}
		catch (Exception $e)
		{
			log_message('error', __CLASS__ . '->' . __FUNCTION__ .  '(): ' . $e->getMessage());
			return false;
		}

		return $urls;
	}

	/**
	 * Get all PAGEDATA from mongo
	 * @param array $order_by order of tours
	 * @return array $PAGEDATA
	 */
	public function create($data)
	{
		unset($data['id']);

		try
		{
			$data['url'] = $this->sanitize_url($data['url']);
			$id = $this->mongo_db->insert($this->collection, (array) $data );
		}
		catch (Exception $e)
		{
			log_message('error', $e->getMessage());
			return false;
		}

		return $id->{'$id'};
	}

	/**
	 * Updates a guide with new data
	 */
	public function update_by_id($id, $data)
	{
		unset($data['id']);

		try
		{
			$data['url'] = $this->sanitize_url($data['url']);

			$this->mongo_db
				->where(array('_id' => new MongoId($id)))
				->set( (array) $data )
				->update($this->collection);

			return $data;
		}
		catch (Exception $e)
		{
			return false;
		}
	}

	/**
	 * Delete guide by id
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
	 * @param array guide ids
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

	/**
	 * Sanitize URL (lowercase hostname, remove http(s) and trailing slash)
	 * @param string $url URL
	 * @return string $url Cleaned up URL
	 */
	private function sanitize_url($url)
	{
		// Change hostname to lowercase
		$parts = parse_url($url, PHP_URL_HOST);
		$hostname = $parts;
		$index = strpos($url, $hostname);
		$hostname = strtolower($hostname);
		substr_replace($url, $hostname, $index);

		// Remove trailing slash if there is one
		$url = preg_replace('!/$!', '', $url);

		return $url;
	}
}