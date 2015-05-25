<?
/**
*  Model that fetches all data associated with guides
*/
class Guest_Model extends CI_Model
{
	private $collection = null;

	/**
	 * Constructor
	*/
	function __construct()
	{
		// Call the Model constructor
		parent::__construct();
		$this->load->library('mongo_db');
		$this->collection = USERS;

        $this->load->model('user_model');
	}

	/**
	 *  TEST ONLY Login User
	 */
	public function login($username)
    {
        //Guest
        if($username == "guest@jumpseat.io") return;

        //Already logged in?
        if(isset($_SESSION['userid'])) return;

        //Does user already exist?
        $user = $this->mongo_db
            ->where(array('email' => $username))
            ->get($this->collection);

        //Create app user
        if (sizeof($user) <= 0) {
            $user = array(
                "firstname" => "App",
                "lastname" => "User",
                "email" => $username,
                "sysadmin" => false,
                "password" => "password",
                "timeslogin" => 0
            );

            $user['id'] = $this->user_model->create($user);
        } else {
            $user = $user[0];
        }

        $_SESSION['username'] = $user['email'];
        $_SESSION['userid'] = $user['id'];
        $_SESSION['firstname'] = $user['firstname'];
        $_SESSION['lastname'] = $user['lastname'];
        $_SESSION['sysadmin'] = $user['sysadmin'];

        $this->user_model->update_lastlogin($user['id'], $user['timeslogin']);

        return true;
    }
}
