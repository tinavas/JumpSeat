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

class URL extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('url_model');
    }

    /**
     *  GET guide service call
     */
    function index_get()
    {

    }

 	/**
     *  POST guide service call
     */
    function index_post()
    {

    }


    /**
     *  POST guide service call
     */
    function index_put()
    {

    }

    /**
     *  Delete a guide
     */
    function index_delete()
    {

    }

}