<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Aero apps
 *
 * CRUD API services for Aero apps
 *
 * @package		Aero
 * @subpackage	apps
 * @category	REST Controller
 * @author		Trevor Dell
*/
require APPPATH.'/libraries/REST_Controller.php';

class Analytics extends REST_Controller
{
	function __construct()
	{
		// Construct our parent class
		parent::__construct();
		$this->load->model('analytics_model', '', FALSE, $this->host);
	}

	function guide_count_get()
	{
		$this->response($this->analytics_model->guide_count(), 200);
	}

	function user_count_get()
	{
		$this->response($this->analytics_model->user_count(), 200);
	}

	function guide_users_get()
	{
		$this->response($this->analytics_model->guide_users(), 200);
	}

	function completed_started_get()
	{
		$this->response($this->analytics_model->completed_started(), 200);
	}

	function user_stats_get()
	{
		$this->response($this->analytics_model->user_stats($this->input->get('user')), 200);
	}

	function times_taken_get()
	{
		$this->response($this->analytics_model->times_taken(), 200);
	}

	function guide_times_get()
	{
		$this->response($this->analytics_model->guide_times($this->input->get('guideid')), 200);
	}
}
