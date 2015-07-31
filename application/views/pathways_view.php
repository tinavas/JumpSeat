<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | <?= $lang->pathways; ?></title>
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
<div id="screenPathway" class="balloon">
	<div class="row">
		<div class="large-8 columns">
		   	<h4><?= $lang->pathways ?></h4>
			<p><?= $lang->pathd; ?></p>
		</div>
	</div>
	<div class="row">
		<div id="pathGroup" class="large-12 columns">
			<!-- Menu Bar -->
			<div id="menu">
				<? if($acl['pathways']['create']){ ?><a href="#" class="add yellow dark small button"><?= $lang->addp; ?> <i class="ss-icon">&#x002B;</i></a><? } ?>
			</div>

    		<!-- Form Wrapper -->
			<div id="form-wrapper"></div>

			<!-- Listings -->
      		<div id="pathways" class="row boxed"><ul></ul></div>
      	</div>
    </div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/views/pathway<?= MIN ?>.js"></script>
</body>
</html>
