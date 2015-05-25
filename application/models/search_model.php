<?
/**
*  Model that fetches all data associated with tours
*/
class Search_Model extends CI_Model
{
	private $collection = null;
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
		$this->collection = $host . "_" . GUIDES;
		
		
		//Ensure full text enabled
		$this->mongo_db->_connection->admin->command(
				array(
						"setParameter" => 1,
						"textSearchEnabled" => true
				));
		
		//Ensure index
		$this->mongo_db->_dbhandle->{$this->collection}->ensureIndex(
				array( 'title' => 'text' ),
				array( 'name' => 'title_text', 'weights' => array( 'title' => 100 ))
		);
	}


	/**
	 * Get by name
	 * @param array $order_by order of tours
	 * @return array $guides
	 */
	public function get_by_term($term)
	{
		$results = array();

		//Search
		$score = $this->mongo_db->_connection->aero->command(
			array( 'text' => $this->collection, 'search' => $term )
		);

		//Grab results
		foreach($score['results'] as $r)
		{
			array_push($results, $r['obj']);
		}

		return $this->mongo_db->switchId($results);
		
	}
}