<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Aero roles
 *
 * CRUD API services for Aero roles
 *
 * @package		Aero
 * @subpackage	roles
 * @category	REST Controller
 * @author		Mike Priest
*/
require APPPATH.'/libraries/REST_Controller.php';

class Role extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();

        $this->load->model('role_model', '', FALSE, $this->host);
    }

    /**
     *  GET role service call
     */
    function index_get()
    {
    	$id = $this->input->get('id');
    	$title = $this->input->get('title');
    	$count = $this->input->get('count');
    	$select = $this->input->get('select') ? $this->input->get('select') : array();

    	if($id){
			$role = $this->role_model->get_by_id($id);
		}elseif($title){
			$role = $this->role_model->get_by_title($title);
		}else{
    		$role = $this->role_model->get_all($select, $count);
		}
    	$this->response($role, 200);
    }


    /**
     *  GET role service call
     */
    function permission_get()
    {
    	$title = $this->input->get('title');

    	if($title){
    		$role = $this->role_model->get_by_title($title, true);
    		$this->response($role, 200);
    	}else{
    		$this->response("Missing role title", 404);
    	}
    }


    /**
     *  GET permissions for a set of roles
     */
    function acl_get()
    {
    	$roles = $this->input->get('roles');

    	if($roles){
    		$acl = $this->role_model->get_acl($roles, true);
    		$this->response($acl, 200);
    	}else{
    		$this->response("Missing roles", 404);
    	}
    }


 	/**
     *  POST role service call
     */
    function index_post()
    {
    	$new = $this->role_model->create($this->request_data);

    	$response_code = $new ? 200 : 400;
    	$this->response($new, $response_code);
    }


    /**
     *  POST role service call
     */
    function permission_put()
    {
    	$id = $this->request_data['id'];
    	unset($this->request_data['id']);

    	$role = $this->role_model->get_by_id($id, true);

    	//Were not updating these
    	unset($role["id"]);
		unset($role["title"]);
		unset($role["description"]);

		//Merge changes
		$merged = array_replace_recursive((array) $role, (array) $this->request_data);

		//Update permissions
    	$new = $this->role_model->update_by_id($id, $merged);

    	$response_code = $new ? 200 : 400;
    	$this->response($new, $response_code);
    }


    /**
     *  POST role service call
     */
    function index_put()
    {
    	$id = $this->request_data['id'];
    	unset($this->request_data['id']);

    	$new = $this->role_model->update_by_id($id, $this->request_data);

    	$response_code = $new ? 200 : 400;
    	$this->response($new, $response_code);
    }


    /**
     *  Delete a pathwat
     */
    function index_delete()
    {
    	$guide = $this->role_model->delete_by_id($this->delete('id'));
    	$this->response($guide, 200);
    }
}