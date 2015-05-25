<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Aero pathways
 *
 * CRUD API services for Aero pathways
 *
 * @package		Aero
 * @subpackage	pathways
 * @category	REST Controller
 * @author		Mike Priest
*/
require APPPATH.'/libraries/REST_Controller.php';

class PathwayMap extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();

        $this->load->model('pathwaymap_model', '', FALSE, $this->host);
    }

    /**
     *  GET pathway mapping by guide
     */
    function by_role_get()
    {
    	$map = $this->pathwaymap_model->get_by_role($this->input->get('role'));
    	$this->response($map, 200);
    }

    /**
     *  GET pathway mapping by pathway
     */
    function by_pathway_get()
    {
    	$active = $this->input->get('active');
    	
    	$map = $this->pathwaymap_model->get_by_pathway($this->input->get('pathwayid'), $this->input->get('guideData'), $active);
    	$this->response($map, 200);
    }

    /**
     *  GET pathway mapping by pathway
     */
    function by_guide_get()
    {
    	$map = $this->pathwaymap_model->get_by_guide($this->input->get('guideid'));
    	$this->response($map, 200);
    }


    /**
     *  Update pathway indexes
     */
    function indexes_put()
    {
    	$map = $this->pathwaymap_model->update_indexes($this->request_data['pathwayid'], $this->request_data['guides']);
    	$this->response($map, 200);
    }

    
 	/**
     *  POST pathway service call
     */
    function index_post()
    {
    	$new = $this->pathwaymap_model->create($this->request_data['pathwayid'], $this->request_data['guideid']);
    	$this->response($new, 200);
    }
    

    /**
     *  DELETE association between guide and pathway
     */
    function index_delete()
    {

    	$del = $this->pathwaymap_model->delete($this->delete('pathwayid'), $this->delete('guideid'));

    	$response_code = $del ? 200 : 400;
    	$this->response($del, $response_code);
    }
}