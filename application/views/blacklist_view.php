<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | Welcome</title>
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
<div id="screenURL" class="balloon">
	<div class="row">
		<div class="large-8 columns">
			<h4><?= $lang->blacklist; ?></h4>
		   	<p><?= $lang->blacklistd; ?></p>
		</div>
	</div>
	<div class="row">
		<div id="blacklistGroup" class="large-12 columns">
			<!-- Menu Bar -->
			<div id="menu" class="float-menu clearfix">
				<a href="#" class="multi disabled small button secondary" data-dropdown="multiAction"><?= $lang->multiactions; ?></a>
				<ul id="multiAction" class="f-dropdown">
					<li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li>
				</ul>

				<a href="#" class="add purple dark small button"><?= $lang->addurl; ?> <i class="ss-icon">&#x002B;</i></a>
			</div>

			<!-- Form Wrapper -->
			<div id="form-wrapper"></div>

      		<!--  Listings -->
      		<div id="blacklist" class="clearfix">
	      		<table class="display" cellspacing="0" width="100%">
			        <thead>
			            <tr>
			                <th><input type="checkbox" class="select-all" /></th>
			                <th><?= $lang->url; ?></th>
			                <th><?= $lang->description; ?></th>
			                <th><?= $lang->prefix; ?></th>
			                <th><?= $lang->suffix; ?></th>
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
<script src="<?= $baseUrl; ?>assets/js/views/blacklist<?= MIN ?>.js"></script>
</body>
</html>
