<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = "login";
$route['template'] = "template";
$route['404_override'] = '';

$route['example'] = "welcome";
$route['apps'] = "app/index";
$route['app/users'] = "app/users";
$route['app/(.+)/pathways'] = "app/section/$1/pathways";
$route['app/(.+)/pathway/(.+)'] = "app/subsection/$1/$2/pathwaymap";
$route['app/(.+)/guides'] = "app/section/$1/guides";
$route['app/(.+)/roles'] = "app/section/$1/roles";
$route['app/(.+)/role/(.+)'] = "app/subsection/$1/$2/rolemap";
$route['app/(.+)/config'] = "app/section/$1/pagedata";
$route['app/(.+)/security'] = "app/section/$1/security";
$route['app/(.+)/blacklist'] = "app/section/$1/blacklist";
$route['(.+)/profile'] = "profile/index/$1";
$route['app/(.+)/analytics'] = "analytics/index/$1";
$route['app/(.+)/versions/(.+)'] = "app/subsection/$1/$2/versions";
$route['app/(.+)/trash'] = "app/section/$1/trash";

//Custom for screenshot apps
$route['app/(.+)/features'] = "app/section/$1/features";
$route['app/(.+)/features/(.+)'] = "app/subsection/$1/$2/pages";

//Screenshot app
$route['iapp/(.+)'] = "iapp/feature/$1/$2";

/* End of file routes.php */
/* Location: ./application/config/routes.php */
