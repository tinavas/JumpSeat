<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Generic ultility functions
 * 
 * @package 	Aero
 * @subpackage	util
 * @category	Library
 * @author		Trevor Dell 
 */
Class Aero_Lib
{
	public function __constructor()
	{
		
	}
	
	/**
	 * Function for logging errors
	 * @param string $msg Error message to log
	 */
	public function error($msg)
	{
		log_message('error', $msg);
		
		$stack_trace = debug_backtrace();
		
		// Remove first element since we don't want to see this function
// 		$stack_trace = array_shift($stack_trace);
		
		log_message('error', 'Stack trace: ' . json_encode($stack_trace));
	}
}