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

class Versions extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('guide_model', '', FALSE, $this->host);
        $this->load->model('version_model', '', FALSE, $this->host);
    }

    /**
     *  GET guide service call
     */
    function index_get()
    {
    	$id = $this->input->get('id');

        $guides = $this->version_model->get_all($id);

    	$this->response($guides, 200);
    }

    /**
     *  PUT Restore an older version
     */
    function index_put()
    {
        $id = $this->request_data['id'];
        $version = $this->request_data['version'];

        $guide = $this->version_model->restore_version($id, $version);
        $this->response($guide, 200);
    }

    /**
     *  Permanently delete a version, or move all of them to trash
     * GET string id Guide ID
     * GET string version Version number, or left out to move all versions to trash
     */
    function index_delete()
    {
        $id = $this->delete('id');
        $version = $this->delete('id');

        if (!isset($version))
            $this->version_model->trash_versions($id);
        else
            $this->version_model->delete($id, $this->delete('version'));

        $this->response('', 200);
    }


    function current_version_get()
    {
        $id = $this->input->get('id');

        $version = $this->version_model->get_current_version($id);
        $this->response(array('version' => $version), 200);

    }

    /**
     *  Get table data for admin
     */
    function table_get()
    {
        $id = $this->input->get('id');
    	$rows["data"] = array();

    	//All versions
        $versions = $this->version_model->get_all($id);

    	//Get person
    	$this->load->library('person', array('host' => $this->host));
		$acl = $this->person->acl;
		$user = $this->person->username;

    	date_default_timezone_set($this->config->item('timezone'));

    	//Build rows
    	foreach($versions[0]['versions'] as $guide)
    	{
	    	$title = $guide['title'];
	    	$desc = $guide['desc'];
	    	$active = $guide['active'] ? "Yes" : "No";
            $modifier = '';
            $modified = '';

            if (isset($guide['modifier']))
                $modifier = $guide['modifier'];
            else
                $modifier = $guide['creator'];


            if (isset($guide['modified']->sec))
            {
                $modified = explode(" ", date('y-m-d h:i:s', $guide['modified']->sec));
                $modified = implode(' at ', $modified);
            }
            else
            {
                $modified = explode(" ", date('y-m-d h:i:s', $guide['created']->sec));
                $modified = implode(' at ', $modified);
            }


	    	$steps = sizeof($guide['step']);
            $version = $guide['version'];

	    	//@todo USE ACTUAL HOST
	    	$first = str_replace("http_", "http://", $this->host);
			$second = str_replace("https_", "https://", $first);
			$host = str_replace("_", ".", $second);

            $tools = "<div class='tools' style='width:240px' data-id='$version'>";

            if($acl['guides']['edit'] || ($modifier == $user && $acl['guides']['create'])){
    			$tools .= "<a class='small button success restore'>Restore<i class='ss-icon'>&#x1F4CC;</i></a>";
    		}
    		if($acl['guides']['delete'] || ($modifier == $user && $acl['guides']['create'])){
    			$tools .= "<a class='small button alert delete'>Delete <i class='ss-icon'>&#xE0D0;</i></a>";
    		}
    		$tools .= "</div></li>";


    		$row = array(
    				"<input type='checkbox' class='select' value='1' data-id='$id' />",
                    $version,
    				$desc,
    				$steps,
    				$modifier . "<br/>" .$modified,
    				$tools
    		);

    		array_push($rows['data'], $row);
    	}
    	$this->response($rows, 200);
    }
}