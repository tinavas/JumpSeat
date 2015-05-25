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

class PageData extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('pagedata_model', '', FALSE, $this->host);
    }

    /**
     *  GET pagedata service call
     */
    function index_get()
    {
    	$pagedata = null;
    	$id = $this->get('id') ? $this->get('id') : null;

    	if ($id && is_array($id))
    	{
    		$pagedata = $this->pagedata_model->get_by_ids($id);
    	}
    	elseif ($id)
    	{
			$pagedata = $this->pagedata_model->get_by_id($id);
    	}
    	else
    	{
			$pagedata = $this->pagedata_model->get_all();
    	}

    	if ($pagedata === false)
    	{
    		$this->response("MongoDB returned an error.", 400);
    	}
    	else
    	{
    		$this->response($pagedata, 200);
    	}
    }


    /**
     *  GET basic configuration
     */
    function basic_get()
    {
    	$pagedata = $this->pagedata_model->get_basic();
    	$this->response($pagedata, 200);
    }

    /**
     *  Get table data for admin
     */
    function table_get()
    {
    	$rows["data"] = array();

    	//All urls
    	$urls = $this->pagedata_model->get_all();

    	//Build rows
    	foreach($urls as $url)
    	{
    		$id = $url['id'];
    		$desc = isset($url['description']) ? $url['description'] : "";
    		$prop = $url['prop'];
    		$value = $url['value'];

    		if($prop != "username" && $prop != "require" && $prop != "roles" && $prop != "fire" ){
	    		$row = array(
	    				"<input type='checkbox' class='select' value='1' data-id='$id' />",
	    				$desc,
	    				$prop,
	    				$value,
	    				"<div class='tools' style='width:215px'; data-id='$id'><a class='small button orange light edit'>Edit <i class='ss-icon'>&#x270E;</i></a><a class='small button alert delete'>Delete <i class='ss-icon'>&#xE0D0;</i></a></div></li>"
	    		);
	    		array_push($rows['data'], $row);
    		}
    	}
    	$this->response($rows, 200);
    }

 	/**
     *  POST pagedata service call
     */
    function index_post()
    {
    	$new = $this->pagedata_model->create($this->request_data);
    	$this->response($new, 200);
    }


    /**
     *  POST pagedata service call
     */
    function index_put()
    {
    	if(!isset($this->request_data['id'])){

    		$response = '';
    		$datas = $this->request_data['data'];

    		foreach($datas as $data){
				$url = $this->pagedata_model->update_by_id($data['id'], $data);
    		}

    		$this->response($response, 200);
    	}else{
    		$url = $this->pagedata_model->update_by_id($this->request_data['id'], $this->request_data);
    	}

    	$this->response($url, 200);
    }

    /**
     *  Delete a pagedata
     */
    function index_delete()
    {
    	$url = $this->pagedata_model->delete_by_id($this->delete('id'));
    	$this->response($url, 200);
    }

}
