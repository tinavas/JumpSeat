<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Analytics extends CI_Controller {

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

	public function index($host)
	{
		$this->load->library('person', array('host' => $host));

		$this->data['username'] = $this->person->username;
		$this->data['acl'] = $_SESSION['acl'];
		$this->data['baseUrl'] = base_url();
		$this->data['guide_count'] = 20;
		$this->data['host'] = $host;

		$this->load->model('guide_model', '', FALSE, $host);
		$this->data['guide_count'] = $this->guide_model->get_count();

		$this->load->model('analytics_model', '', FALSE, $host);
		$this->data['user_count'] = $this->analytics_model->get_user_count();

		$this->load->model('pathway_model', '', FALSE, $host);
		$this->data['path_count'] = $this->pathway_model->get_count();

		$this->load->model('role_model', '', FALSE, $host);
		$this->data['role_count'] = $this->role_model->get_count();

		$this->load->view('analytics_view', $this->data);
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */