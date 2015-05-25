<?php defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH.'/libraries/REST_Controller.php';

/**
 * Controller for uploading users for import
 *
 * @package		Aero
 * @subpackage	export
 * @category	REST Controller
 * @author		Trevor Dell
*/
class Import_User extends REST_Controller
{
	private $model_name = '';
	private $collection = '';

	function __construct()
	{
		parent::__construct();

		$this->host = str_replace(".", "_", $_POST['host']);
		$this->host = str_replace('://', '_', $this->host);

		$this->collection = $this->host .'_' . GUIDES;
		$this->load->model('user_model', '', FALSE, $this->host);
	}

	/**
	 * Imports the users that were uploaded by user
	 */
	public function index_post()
	{
		$verifyToken = md5('unique_salt' . $_POST['timestamp']);

		if (!empty($_FILES) && (strcmp($_POST['token'], $verifyToken) == 0))
		{
			$users = file_get_contents($_FILES['Filedata']['tmp_name']);
			$users = json_decode($users);

			foreach ($users as $user)
			{
				try {
					$this->user_model->create((array) $user);
				}
				catch(Exception $e){
					log_message('error', 'ZZT: Error importing user: ' . json_encode($user) );
				}
			}
		}

		$this->response(true, 200);
	}
}
?>