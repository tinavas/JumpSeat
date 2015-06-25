<?
/**
*  Model that fetches all data associated with applications
 *
 * CRUD API services for Aero apps
 *
 * @package		Aero
 * @subpackage	apps
 * @category	REST Controller
 * @author		Trevor Dell
*/
class App_Model extends CI_Model
{
	private $collections = array();

	/**
	 * Constructor
	*/
	function __construct()
	{
		// Call the Model constructor
		parent::__construct();
		$this->load->library('mongo_db');

		//Load from config
		$this->load->config('config', TRUE);

		$this->collections = array(GUIDES, ROLES, ROLEGUIDE, PATHWAY, PATHWAYGUIDE, PATHWAYROLE, PAGEDATA, TRASH, URLS, BLACKLIST, AUDIT, ROLEUSER, VERSIONS);
	}

	/**
	 * Get all apps from mongo
	 * @param array('field' => 'sort type')
	 * @return object[] $apps
	 */
	public function get_all($order = array())
	{
		if (sizeof($order) == 0 )
			$order = array('title' => 'ASC');

		$where = array();

		//Get apps
		$apps = $this->mongo_db
			->where($where)
			->orderBy($order)
			->get(APPS);

		return $apps;
	}

	/**
	 * Get app(s) by id(s)
	 * @param $id string ID of app
	 * @return object Returned app
	 */
	public function get_by_id($id)
	{
		$app = array('_id' => new MongoId($id));

		$app = $this->mongo_db
			->where($app)
			->get(APPS);

		return $app[0];
	}


	/**
	 * Get app(s) by id(s)
	 * @param $id string ID of app
	 * @return object Returned app
	 */
	public function get_by_host($host)
	{
		$app = $this->mongo_db
			->orWhere(array('host' => $host))
			->orWhere(array('aliases' => $host))
			->get(APPS);

		if (sizeof($app) > 0) $app = $app[0];
			return $app;
	}

	/**
	 *  Sanitize collection name
	 */
	public function san_collection_name($host)
	{
		$host = str_replace('.', '_', $host);
		$host = str_replace('://', '_', $host);

		return $host;
	}

	/**
	 * Check if injection should take place on a URL
	 * @param $host Hostname or alias to match
	 * @param $path URL path after hostname
	 * @return object App if injection should take place, false if not
	 */
	public function test_url($host, $path = '')
	{
		if ($path == '/') $path = '';

		//Check for subdomain wildcard
		$info = parse_url($host);
		$info_host = $info['host'];
		$bits = explode('.', $info_host);
		array_shift($bits);
		$wild_d = implode(".", $bits);

		$wild = preg_replace( '/[a-z0-9]+\.'.$wild_d.'/i' , '*.'.$wild_d , $host);

		$app = $this->mongo_db
			->orWhere(array('host' => $host))
			->orWhere(array('aliases' => $host))
			->orWhere(array('aliases' => $wild))
			->get(APPS);

		if (sizeof($app) > 0) $app = $app[0];

		// Check to see if this url is blacklisted
		if (!empty($app))
		{
			$url = $host . $path;
			$convert = $this->san_collection_name($app['host']);
			$this->load->model('blacklist_model', '', FALSE, $convert);
			$match = $this->blacklist_model->match_url($url);

			if ($match)
				return false;
			else
				return $app;
		}
	}

	/**
	 * Create an app object
	 * @param object App object(s)
	 * @return string ID(s)
	*/
	public function create($app = array())
	{
		//Check for existing
		$existing = $this->get_by_host($app['host']);
		if(sizeof($existing) > 0) return false;
		$app['version'] = 0;

		unset($app['id']);

		try
		{
			$id = $this->mongo_db->insert(APPS, (array) $app);
		}
		catch (Exception $e)
		{
			return false;
		}

		//Create roles?
		$host = $this->san_collection_name($app['host']);
		$this->create_default_roles($host);

		return $id->{'$id'};
	}


	/**
	 *  Default roles for new apps
	 */
	protected function create_default_roles($host){

		//Create default roles
		$this->load->model('role_model', '', FALSE, $host);

		//Guest
		$guest = array();
		$guest['title'] = $this->config->item("guest");
		$guest['noEdit'] = true;
		$guest['description'] = "Default role for people with no login";
		$guest['guides'] = array();
		$guest['guides']['read'] = true;
		$guest['pathways'] = array();
		$guest['pathways']['read'] = true;
		$this->role_model->create($guest);

		//Admin
		$admin = json_decode('{"title":"'.$this->config->item("administrator").'","noEdit":true, "description":"Default administrator role","guides":{"read":true,"create":true,"edit":true,"delete":true},"steps":{"read":true,"create":true,"edit":true,"delete":true},"pathways":{"read":true,"create":true,"edit":true,"delete":true,"assignRole":true,"assignGuide":true},"roles":{"read":true,"create":true,"edit":true,"delete":true,"assignGuide":true},"config":{"read":true,"create":true,"edit":true,"delete":true},"analytics":{"read":true}}', true);
		$this->role_model->create($admin);
	}

	/**
	 * Updates an app with new data
	 * @param string ID of app object(s) to update
	 * @param object App(s) to update
	 * @return object Updated app object(s)
	 */
	public function update_by_id($id, $app)
	{
		unset($app['id']);

		//Get current
		$current = $this->get_by_id($id);

		//Don't update empty hosts (active REST)
		if($app['host'] == "") $app['host'] = $current['host'];

		//Do we need to rename collections?
		if($app['host'] != $current['host']){
			try {
                $exists = $this->get_by_host($app['host']);

                if(sizeof($exists) > 0) return false;

				foreach($this->collections as $collection){
					$query = array(
						"renameCollection" => DATABASE . "." . $this->san_collection_name($current['host']) . "_" . $collection,
						"to" => DATABASE . "." . $this->san_collection_name($app['host']) . "_" . $collection,
						"dropTarget" => "true"
					);

					$this->mongo_db->command($query);
				}
			}
			catch (Exception $e) {
			    log_message('error', 'Failed to rename collection: ',  $e->getMessage());
			}
		}

		//Finally Update Apps
		$this->mongo_db
			->where(array('_id' => new MongoId($id)))
			->set( (array) $app )
			->update(APPS);

		return $app;
	}

	/**
	 * Delete app by id
	 * @param string id
	 * @return boolean
	 */
	public function delete_by_id($id)
	{
		try
		{
			$app = $this->mongo_db
				->where(array('_id' => new MongoId($id)))
				->get(APPS);

			if(sizeof($app) > 0){

				//Get host name
				$host = $this->san_collection_name($app[0]['host']);

				$this->mongo_db
					->where(array('_id' => new MongoId($id)))
					->delete(APPS);

				foreach($this->collections as $collection){
					$this->mongo_db->dropCollection(DATABASE, $host . "_" . $collection);
				}
			}
			return true;
		}
		catch (Exception $e)
		{
			return false;
		}
	}

	/**
	 * Deletes multiple apps using an array of ids
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
