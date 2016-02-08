<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | <?= $lang->users; ?></title>
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/lib/foundation/css/foundation.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/aero-admin.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/ss-junior/webfonts/ss-junior.css" />
	<script src="<?= $baseUrl; ?>assets/lib/foundation/js/vendor/modernizr.js"></script>
	<link rel="shortcut icon" href="/assets/images/favicon.ico" />
	<link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon">
</head>
<body>
<? include 'inc/sidebar-home.php'; ?>
<? include 'inc/header.php'; ?>
<div id="screenGuide" class="balloon">
	<div class="row">
		<div class="large-8 columns" style="margin-bottom:2em;">
			<h4><?= $lang->users; ?></h4>
		   	<p><?= $lang->usersd; ?></p>
		</div>
	</div>
	<div class="row">
		<div id="userGroup" class="large-12 columns">
			<!-- Menu Bar -->
			<div id="menu" class="float-menu clearfix">
					<a href="#" class="multi disabled small button secondary" data-dropdown="multiAction"><?= $lang->multiactions; ?></a>
					<ul id="multiAction" class="f-dropdown">
					  	<li><a class="multi-export"><i class="ss-icon">&#xEB01;</i> <?= $lang->export; ?></a></li>
						<li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li>
					</ul>
					<a id="import" href="#"><?= $lang->importu; ?> <i class="ss-icon">&#xEB41;</i></a>
					<a href="#" class="success add small button"><?= $lang->addu; ?> <i class="ss-icon">&#x002B;</i></a>
			</div>

			<!-- Form Wrapper -->
			<div id="form-wrapper"></div>

			<!--  Listings -->
      		<div id="users" class="clearfix">
	      		<table class="display" cellspacing="0" width="100%">
			        <thead>
			            <tr>
			                <th></th>
			                <th><?= $lang->firstname; ?></th>
			                <th><?= $lang->lastname; ?></th>
			                <th><?= $lang->emailaddress; ?></th>
			                <th><?= $lang->created; ?></th>
			                <th><?= $lang->lastlogin; ?></th>
			                <th><?= $lang->sysadmin; ?></th>
			                <th><?= $lang->tools; ?></th>
			            </tr>
			        </thead>
			        <tbody></tbody>
			    </table>
		    </div>
      	</div>
    </div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/views/users<?= MIN ?>.js"></script>
</body>
</html>
