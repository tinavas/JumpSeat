<?php defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH.'/libraries/REST_Controller.php';

/**
 * Controller for uploading pagedata for import
 *
 * @package		Aero
 * @subpackage	export
 * @category	REST Controller
 * @author		Trevor Dell
*/
class Import_Pagedata extends REST_Controller
{
	private $model_name = '';
	private $collection = '';

	function __construct()
	{
		parent::__construct();

		$this->host = str_replace(".", "_", $_POST['host']);
		$this->host = str_replace('://', '_', $this->host);

		$this->collection = $this->host .'_pagedata';
		$this->load->model('pagedata_model', '', FALSE, $this->host);
	}

	/**
	 * Imports the pagedata that were uploaded by user
	 */
	public function index_post()
	{
		$verifyToken = md5('unique_salt' . $_POST['timestamp']);

		if (!empty($_FILES) && (strcmp($_POST['token'], $verifyToken) == 0))
		{
			$pagedata = file_get_contents($_FILES['Filedata']['tmp_name']);
			$pagedata = json_decode($pagedata);

			foreach ($pagedata as $p)
			{
				try {
					$this->pagedata_model->create((array) $p);
				}
				catch(Exception $e){
					log_message('error', 'ZZT: Error importing pagedata: ' . json_encode($p) );
				}
			}
		}

		$this->response(true, 200);
	}
}
?>