<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | <?= $lang->roles; ?></title>
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/lib/foundation/css/foundation.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/aero-admin.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/ss-junior/webfonts/ss-junior.css" />
	<script src="<?= $baseUrl; ?>assets/lib/foundation/js/vendor/modernizr.js"></script>
	<link rel="shortcut icon" href="/assets/images/favicon.ico" />
	<link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon">
</head>
<body>
<? include 'inc/sidebar.php'; ?>
<? include 'inc/header.php'; ?>
<div id="screenRoles" class="balloon">
	<div class="row">
		<div class="large-8 columns">
		   	<h4><?= $lang->roles ?></h4>
			<p><?= $lang->roled; ?></p>
		</div>
	</div>
	<div class="row">
		<div id="roleGroup" class="large-12 columns">
			<!-- Menu Bar -->
			<div id="menu">
				<? if($acl['roles']['create']){ ?><a href="#" class="add dark green small button"><?= $lang->addr; ?> <i class="ss-icon">&#x002B;</i></a><? } ?>
			</div>

			<!-- Form Wrapper -->
			<div id="form-wrapper"></div>

			<!--  Listings -->
      		<div id="roles" class="row boxed"><ul></ul></div>
      	</div>
    </div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/aeroadmin/role<?= MIN ?>.js"></script>
<script> $q(function(){ Roles.init(); }); </script>
</body>
</html>