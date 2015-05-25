<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: tdell
 * Date: 24/03/15
 * Time: 11:56 AM
 */
require APPPATH.'/libraries/REST_Controller.php';

class Emailer extends REST_Controller
{

    function index_get()
    {

        $url = base_url() .'assets/lib/email/send.php';
        $data = array(
            'email' => $this->get('email'),
            'subject' => $this->get('subject'),
            'body' => $this->get('body')
        );

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $response = curl_exec($ch);
        curl_close($ch);


    }
}
