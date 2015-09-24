<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Aero Guides
 *
 * CRUD API services for Aero guides
 *
 * @package		Aero
 * @subpackage	Guides
 * @category	REST Controller
 * @author      Trevor Dell
*/
require APPPATH.'/libraries/REST_Controller.php';

class Trash extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('trash_model', '', FALSE, $this->host);
    }

    /**
     *  GET guide service call
     */
    function index_get()
    {
    	$id = $this->input->get('id');

    	if($id && is_array($id)){
    		$guides = $this->trash_model->get_by_ids($id);
    	}elseif($id){
    		$guides = $this->trash_model->get_by_id($id);
    	}else{
    		$guides = $this->trash_model->get_all();
    	}

    	$this->response($guides, 200);
    }

    /*
     * Restore a guide from trash
     * GET string id Trash ID
     */
    function restore_get()
    {
        $id = $this->input->get('id');

        $guideid = $this->version_model->restore($id);
        $this->response($guideid, 200);
    }

 	/**
     *  POST guide service call
     */
    function index_post()
    {
    	$new = $this->trash_model->restore($this->request_data['id']);

    	$response_code = $new ? 200 : 400;
    	$this->response($new, $response_code);
    }

    /**
     *  POST guide service call
     */
    function index_put()
    {
    	$id = $this->request_data['id'];
    	unset($this->request_data['id']);

    	$guide = $this->guide_model->update_by_id($id, $this->request_data);
		$this->response($guide, 201);
    }

    /**
     *  Delete a guide from trash
     */
    function index_delete()
    {
        $id = $this->delete('id');

        if ($id && is_array($id))
    	    $this->trash_model->delete_by_ids($id);
        else if ($id)
            $this->trash_mode->delete_by_id($id);
        else
            $this->trash_model->empty_trash();

    	$this->response('', 200);
    }

    /**
     *  Get table data for admin
     */
    function table_get()
    {
        $rows["data"] = array();

        //All guides
        $guides = $this->trash_model->get_all();

        //Get person
        $this->load->library('person', array('host' => $this->host));
        $acl = $this->person->acl;
        $user = $this->person->username;

        date_default_timezone_set($this->config->item('timezone'));

        //Build rows
        foreach($guides as $guide)
        {
            $id = $guide['id'];
            $title = $guide['title'];
            $desc = $guide['desc'];
            $creator = $guide['creator'];
            $active = $guide['active'] ? "Yes" : "No";

            $created = explode(" ", date('y-m-d h:i:s', $guide['created']->sec));
            $created = implode(' at ', $created);
            $steps = sizeof($guide['step']);

            // @todo USE ACTUAL HOST
            $first = str_replace("http_", "http://", $this->host);
            $second = str_replace("https_", "https://", $first);
            $host = str_replace("_", ".", $second);

            $tools = "<div class='tools' style='width:240px' data-id='$id'>";

            if($acl['guides']['delete'] || ($creator == $user && $acl['guides']['create'])) {
                $tools .= "<a class='small button success restore'>Restore<i class='ss-icon'>&#x1F4CC;</i></a>";
            }
            if($acl['guides']['delete'] || ($creator == $user && $acl['guides']['create'])){
                $tools .= "<a class='small button alert delete'>Delete <i class='ss-icon'>&#xE0D0;</i></a>";
            }
            $tools .= "</div></li>";

            $row = array(
                "<input type='checkbox' class='select' value='1' data-id='$id' />",
                $title,
                $desc,
                $active,
                $steps,
                $creator . "<br/>" .$created,
                $tools
            );

            array_push($rows['data'], $row);
        }
        $this->response($rows, 200);
    }

}
