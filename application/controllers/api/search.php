<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Aero Guides
 *
 * CRUD API services for Aero guides
 *
 * @package		Aero
 * @subpackage	Guides
 * @category	REST Controller
 * @author		Mike Priest
*/
require APPPATH.'/libraries/REST_Controller.php';

class Search extends REST_Controller
{
	private $collection = null;

	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('search_model', '', FALSE, $this->host);
    }

    /**
     *  GET guide service call
     */
    function index_get()
    {
    	$term = $this->input->get('term');

    	$guides = $this->search_model->get_by_term($term);
    	$this->response($guides, 200);
    }
}