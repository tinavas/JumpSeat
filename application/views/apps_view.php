<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<title>JumpSeat | <?= $lang->apps; ?></title>
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/lib/foundation/css/foundation.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/aero-admin.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/ss-junior/webfonts/ss-junior.css" />
	<script src="<?= $baseUrl; ?>assets/lib/foundation/js/vendor/modernizr.js"></script>
	<link rel="shortcut icon" href="/assets/images/favicon.ico" />
	<link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon">
	<script type="application/javascript">
		var IAPP = "<?= IAPP; ?>";
	</script>
</head>
<body id="app">
<? include 'inc/header.php'; ?>
<? include 'inc/sidebar-home.php'; ?>
<div id="appScreen" class="balloon" style="padding-bottom:0;">
	<div class="row">
		<div class="large-8 columns">
			<h4><?= $lang->apps; ?></h4>
			<p><?= $lang->appsd; ?></p>
			<? if($is_admin){ ?><a href="#" class="add success small button"><?= $lang->appsa; ?> <i class="ss-icon">&#x002B;</i></a><? } ?>
			<div id="form-wrapper" class="columns large-3"></div>
      	</div>
	</div>
	<div class="row">
		<div class="large-12 columns" style="margin-bottom:1em">
			<hr style="margin-top:0;" />
			<!-- <h4><?= $lang->appsc; ?></h4>  -->
		</div>
	</div>
    <div id="apps" class="row"><ul class="clearfix"></ul></div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/views/apps<?= MIN ?>.js"></script>
</body>
</html>
