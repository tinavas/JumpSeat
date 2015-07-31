<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | Analytics</title>
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/lib/foundation/css/foundation.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/aero-admin.css" />
	<link rel="stylesheet" href="<?= $baseUrl; ?>assets/css/ss-junior/webfonts/ss-junior.css" />
	<script src="<?= $baseUrl; ?>assets/lib/foundation/js/vendor/modernizr.js"></script>
	<link rel="shortcut icon" href="/assets/images/favicon.ico" />
	<link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon">
</head>
<body>
<div id="profileView">
<? include 'inc/sidebar.php'; ?>
<? include 'inc/header.php'; ?>
<div class="balloon">
	<div class="row">
		<div id="roleGroup" class="large-12 columns">
			<div class="aero-modal row" style="position:static">
				<div class="columns small-12 medium-4 large-4">
					<h4><?= $lang->profilec; ?></h4>

					<form class="form">

						<label><?= $lang->firstname; ?></label>
						<input name="firstname" type="text" class="aero-required" placeholder="<?= $lang->firstnamep; ?>" value="<?= $firstname; ?>">

						<label><?= $lang->lastname; ?></label>
						<input name="lastname" type="text" class="aero-required" placeholder="<?= $lang->lastnamep; ?>" value="<?= $lastname; ?>">

						<label><?= $lang->email; ?></label>
						<input name="email" type="text" class="aero-required" placeholder="<?= $lang->emailp; ?>" value="<?= $email; ?>">

						<h5 style="padding-top:1em;"><?= $lang->passwordc; ?></h5>

						<label><?= $lang->passwordc; ?></label>
						<input name="password" type="password" class="" placeholder="<?= $lang->passwordp; ?>" value="">

						<label><?= $lang->passwordv; ?></label>
						<input type="password" class="passwordv" placeholder="<?= $lang->passwordvp; ?>" value="">

						<a href="#" class="success save small button"><?= $lang->save; ?></a>
						<a href="#" class="secondary cancel small button"><?= $lang->cancel; ?></a>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
</div>
<? include 'inc/footer.php'; ?>
<script src="/assets/js/views/profile<?= MIN ?>.js"></script>

</body>
</html>
