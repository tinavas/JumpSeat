<?php
	function check_box($lang, $acl, $title, $type){

		$active = $acl[$title][$type];
		$checked = $active ? "checked" : "";
		$i = $title. "-" .$type;

		return "<div data-key=\"$title\" data-type=\"$type\" class=\"panel-active large-6 columns clearfix\">
					<label class=\"left\">$lang->off</label>
					<fieldset class=\"left small switch round\" tabindex=\"0\" style=\"margin:0em 1em 1em 1em;\">
						<input class=\"acl\" id=\"active$i\" type=\"checkbox\" $checked>
						<label for=\"active$i\"></label>
					</fieldset>
					<label class=\"left\">$lang->on</label>
				</div>";
	}
?>
<div id="permissions" >
	<div class="row">
		<div class="large-8 columns">
			<h4><?= $lang->rolethings ?></h4>
			<p><?= $lang->rolethingsd ?></p>
		</div>
	</div>
	<div class="row permission-set">
		<div class="large-4 columns">
			<h4><i class="aicon-guide"></i><?= $lang->guides; ?></h4>
			<div id="aclGuide" class="row">
				<div class="large-6 columns"><label>View guides</label></div>
				<?= check_box($lang, $permissions, 'guides','read'); ?>

				<div class="large-6 columns"><label>Create guides</label></div>
				<?= check_box($lang, $permissions, 'guides','create'); ?>

				<div class="large-6 columns"><label>Edit other peoples</label></div>
				<?= check_box($lang, $permissions, 'guides','edit'); ?>

				<div class="large-6 columns"><label>Delete other peoples</label></div>
				<?= check_box($lang, $permissions, 'guides','delete'); ?>
			</div>

			<h4><i class="aicon-guide"></i><?= $lang->steps; ?></h4>
			<div class="row">
				<div class="large-6 columns"><label>Create steps</label></div>
				<?= check_box($lang, $permissions, 'steps','create'); ?>

				<div class="large-6 columns"><label>Edit other peoples</label></div>
				<?= check_box($lang, $permissions, 'steps','edit'); ?>

				<div class="large-6 columns"><label>Delete other peoples</label></div>
				<?= check_box($lang, $permissions, 'steps','delete'); ?>
			</div>
		</div>
		<div class="large-4 columns">
			<h4><i class="aicon-pathway"></i><?= $lang->pathways; ?></h4>

			<div class="row" style="margin-bottom:1em;">
				<div class="large-6 columns"><label>View pathways</label></div>
				<?= check_box($lang, $permissions, 'pathways','read'); ?>

				<div class="large-6 columns"><label>Create pathways</label></div>
				<?= check_box($lang, $permissions, 'pathways','create'); ?>

				<div class="large-6 columns"><label>Edit other peoples</label></div>
				<?= check_box($lang, $permissions, 'pathways','edit'); ?>

				<div class="large-6 columns"><label>Delete other peoples</label></div>
				<?= check_box($lang, $permissions, 'pathways','delete'); ?>

				<div class="large-6 columns"><label>Assign Guides</label></div>
				<?= check_box($lang, $permissions, 'pathways','assignGuide'); ?>
			</div>

			<h4><i class="aicon-analytic"></i><?= $lang->analytics; ?></h4>
			<div class="row">
				<div class="large-6 columns"><label>View analytics:</label></div>
				<?= check_box($lang, $permissions, 'analytics','read'); ?>
			</div>
		</div>
		<div class="large-4 columns">
			<h4><i class="aicon-role"></i><?= $lang->roles; ?></h4>

			<div class="row" style="margin-bottom:1em;">
				<div class="large-6 columns"><label>View roles</label></div>
				<?= check_box($lang, $permissions, 'roles','read'); ?>

				<div class="large-6 columns"><label>Create role</label></div>
				<?= check_box($lang, $permissions, 'roles','create'); ?>

				<div class="large-6 columns"><label>Edit other peoples</label></div>
				<?= check_box($lang, $permissions, 'roles','edit'); ?>

				<div class="large-6 columns"><label>Delete other peoples</label></div>
				<?= check_box($lang, $permissions, 'roles','delete'); ?>

				<div class="large-6 columns"><label>Assign Guides</label></div>
				<?= check_box($lang, $permissions, 'roles','assignGuide'); ?>

				<div class="large-6 columns"><label>Assign Pathways</label></div>
				<?= check_box($lang, $permissions, 'pathways','assignRole'); ?>
			</div>

			<h4><i class="aicon-config"></i><?= $lang->config; ?></h4>
			<div class="row">
				<div class="large-6 columns"><label>Dev tools (pagedata/blacklisting):</label></div>
				<?= check_box($lang, $permissions, 'config','read'); ?>
			</div>

		</div>
	</div>
</div>