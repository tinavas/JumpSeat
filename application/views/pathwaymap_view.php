<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | <?= $lang->pathwaymap ?></title>
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
<div class="balloon">
	<div class="row">
		<div class="large-12 columns">
	        <h4 class="inner-title" id="pathwaytitle" data-title="<?= $id ?>"><a href="/app/<?= $host ?>/pathways"><?= $lang->pathways ?></a><i class="ss-icon">&#x25BB;</i><?= $id ?></h4>
	        <span class="description"></span>
			<div id="guides">
				<div class="large-8">
					<p><?= $lang->pathwaysd ?></p>
				</div>
				<!-- Menu Bar -->
				<div id="menu">
					<? if($acl['pathways']['assignGuide']){ ?><a href="#" class="add dark yellow small button"><?= $lang->assocg; ?> <i class="ss-icon">&#x002B;</i></a><? } ?>
				</div>

				<!--  Form Wrapper -->
				<div class="form-wrapper"></div>

				<!-- Listing Wrapper -->
				<div id="pathwaymaps" class="row boxed">
					<ul></ul>
				</div>
		     </div>
		</div>
	</div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/views/pathwaymap<?= MIN ?>.js"></script>
</body>
</html>
