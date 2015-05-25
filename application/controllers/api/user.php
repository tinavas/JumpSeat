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
    }

 	/**
     *  POST role service call
     */
    function index_post()
    {
    }


    /**
     *  POST role service call
     */
    function index_put()
    {
    }

    /**
     *  Delete a pathwat
     */
    function index_delete()
    {
    }
}