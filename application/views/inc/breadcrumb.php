<div class="breadcrumb">
	<a href="/apps"><?= $lang->home; ?></a>
	<?
		if(isset($host)){
			echo " > <a href=\"/app/$host/guides\">$host</a>";
		}
	?>
	<?
		if(isset($view)){
			$label = $lang->{$view};
			if($view == "pathwaymap") $view = 'pathways';
			if($view == "rolemap") $view = 'roles';
			echo " > <a href=\"/app/$host/$view\">$label</a>";
		}
	?>
	<?
		if(isset($id)){
			echo " > $id";
		}
	?>
	<hr/>
</div>