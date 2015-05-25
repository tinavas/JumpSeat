<?  $links = array('home', 'analytics', 'guides', 'pathways', 'roles', 'blacklist', 'config');
	$bits = explode("/", $_SERVER['REQUEST_URI']);
?>
<div id="sidebar">
	<ul>
		<? foreach($links as $link){
				$aclL = $link;
				if($link == "pagedata" || $link == "blacklist") $aclL = "config";
				if($link == "home" || $acl[$aclL]['read'])
				{
					$label = $lang->{$link};
					$href = ($link == "home") ? "/apps" : "/app/$host/$link";
					$active = (end($bits) == $link) ? "active" : "";
					echo "<li class=\"$active $link\"><a data-title=\"$label\" href=\"$href\"><span></span></a></li>";
				}
		 } ?>
	</ul>
</div>