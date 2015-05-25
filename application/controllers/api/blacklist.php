<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Aero PageData
 *
 * CRUD API services for Aero pagedata
 *
 * @package		Aero
 * @subpackage	pagedata
 * @category	REST Controller
 * @author		Mike Priest
*/
require APPPATH.'/libraries/REST_Controller.php';

class Blacklist extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('blacklist_model', '', false, $this->host);
    }

    /**
     *  GET pagedata service call
     */
    function index_get()
    {
    	$blacklist_obj = null;
    	$url = $this->get('url');
    	$id = $this->get('id');

    	if ($url)
    	{
    		$blacklist_obj = $this->blacklist_model->match_url($url);
    	}
    	elseif($id){
    		$blacklist_obj = $this->blacklist_model->get_by_id($id);
    	}
    	else
    	{
    		$blacklist_obj = $this->blacklist_model->get_all();
    	}

    	if (isset($blacklist_obj))
    		$this->response($blacklist_obj, 200);
    	else
    		$this->response("MongoDB returned an error.", 400);
    }

    /**
     *  Get table data for admin
     */
    function table_get()
    {
    	$rows["data"] = array();

    	//All guides
    	$guides = $this->blacklist_model->get_all();

    	//Build rows
    	foreach($guides as $guide)
    	{
    		$id = $guide['id'];
    		$title = $guide['url'];
    		$desc = $guide['description'];
    		$prefix = isset($guide['globPrefix']) && $guide['globPrefix'] ? "Yes" : "No";
    		$suffix = isset($guide['globSuffix']) && $guide['globSuffix']  ? "Yes" : "No";

    		$row = array(
    				"<input type='checkbox' class='select' value='1' data-id='$id' />",
    				$title,
    				$desc,
    				$prefix,
    				$suffix,
    				"<div class='tools' style='width:170px' data-id='$id'><a class='purple light small button secondary edit'>Edit</a><a class='small button alert delete'>Delete</a></div></li>"
    		);

    		array_push($rows['data'], $row);
    	}
    	$this->response($rows, 200);
    }

 	/**
     *  POST pagedata service call
     */
    function index_post()
    {
    	$success = $this->blacklist_model->create($this->request_data);
    	$this->response($success, 200);
    }


    /**
     *  POST pagedata service call
     */
    function index_put()
    {
		$data = $this->blacklist_model->update_by_id($this->request_data['id'], $this->request_data);
		$this->response($data, 200);
    }

    /**
     *  Delete a pagedata
     */
    function index_delete()
    {
    	$success = $this->blacklist_model->delete_by_id($this->delete('id'));
    	$this->response($success, 200);
    }

}