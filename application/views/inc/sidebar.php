<?  $links = array('home', 'analytics', 'guides', 'pathways', 'roles', 'blacklist', 'config'); ?>
<div id="sidebar">
	<ul>
		<? foreach($links as $link){
			$aclL = $link;

			if($link == "pagedata" || $link == "blacklist") $aclL = "config";
			if($link == "home" || $acl[$aclL]['read'])
			{
				$label = $lang->{$link};
				$href = ($link == "home") ? "/apps" : "/app/$host/$link";
				$active = (strpos($_SERVER['REQUEST_URI'],substr($link, 0, -1)) !== false) ? "active" : "";
				echo "<li class=\"$active $link\"><a data-title=\"$label\" href=\"$href\"><span></span></a></li>";
			}
		 } ?>
	</ul>
</div>
