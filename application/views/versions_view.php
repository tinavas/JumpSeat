<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | <?= $lang->guides; ?></title>
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
<div id="screenGuide" class="balloon">
	<div class="row">
		<div class="large-8 columns" style="margin-bottom:2em;">
			<h4 id="version" data-versionid="<?= $id ?>"><?= $lang->versions; ?></h4>
		   	<p><?= $lang->versionsd; ?></p>
		</div>
	</div>
	<div class="row">
		<div id="guideGroup" class="large-12 columns">
			<!-- Menu Bar -->
			<div id="menu" class="float-menu clearfix">
					<a href="#" class="multi disabled small button secondary" data-dropdown="multiAction"><?= $lang->multiactions; ?></a>
					<ul id="multiAction" class="f-dropdown">
						<? if($acl['guides']['create']){ ?>
                            <li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li>
                        <? } ?>
					</ul>
			</div>

			<!-- Form Wrapper -->
			<div id="form-wrapper"></div>

			<!--  Listings -->
      		<div id="<?= $id ?>" class="clearfix">
	      		<table class="display" cellspacing="0" width="100%">
			        <thead>
			            <tr>
			                <th></th>
                            <th>Version</th>
			                <th>Description</th>
			                <th class="center">Steps</th>
                            <th>Modified</th>
			                <th></th>
			            </tr>
			        </thead>
			        <tbody></tbody>
			    </table>
		    </div>
      	</div>
    </div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/third_party/uploadify/jquery.uploadify.min.js"></script>
<script src="<?= $baseUrl; ?>assets/js/aeroadmin/versions<?= MIN ?>.js"></script>
<script src="<?= $baseUrl; ?>assets/js/aeroadmin/export<?= MIN ?>.js"></script>

<!-- NEED THIS EXTRA JQUERY :S -->
<script src="<?= $baseUrl; ?>assets/js/third_party/jquery-10.2.js"></script>
<script src="<?= $baseUrl; ?>assets/js/third_party/datatable/datatable.js"></script>
</body>
</html>
