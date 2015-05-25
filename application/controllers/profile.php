<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Profile extends CI_Controller {

	public $data = array();

	/**
	 * Constructor
	*/
	function __construct()
	{
		parent::__construct();
		$this->lang->load('aero', $this->config->item('language'));
		$this->data['lang'] = (object) $this->lang->language;

		if (!isset($_SESSION['username'])){
			header("Location: /login");
			exit;
		}
	}

	public function index($userid)
	{
		$this->load->library('person', array('userid' => $userid));

		$this->data['userid'] = $this->person->id;
		$this->data['username'] = $this->person->username;
		$this->data['email'] = $this->person->username;
		$this->data['firstname'] = $this->person->firstname;
		$this->data['lastname'] = $this->person->lastname;
		
		$this->data['acl'] = $_SESSION['acl'];
		$this->data['baseUrl'] = base_url();
		$this->data['guide_count'] = 20;
		$this->data['host'] = $userid;
		
		//Can't edit others profiles
		if($userid != $_SESSION['userid']){
			$this->load->view('noaccess_view', $this->data);
		}else{
			$this->load->view('profile_view', $this->data);
		}
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */