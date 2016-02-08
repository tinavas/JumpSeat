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
			<h4><?= $lang->guides; ?></h4>
		   	<p><?= $lang->guidesd; ?></p>
		</div>
	</div>
	<div class="row">
		<div id="guideGroup" class="large-12 columns">
			<!-- Menu Bar -->
			<div id="menu" class="float-menu clearfix">
					<a href="#" class="multi disabled small button secondary" data-dropdown="multiAction"><?= $lang->multiactions; ?></a>
					<ul id="multiAction" class="f-dropdown">
                        <? if($acl['guides']['create']){ ?><li><a class="multi-clone"><i class="ss-icon">&#xEC00;</i> <?= $lang->clone; ?></a></li><? } ?>
					  	<? if($acl['guides']['read']){ ?><li><a class="multi-export"><i class="ss-icon">&#xEB01;</i> <?= $lang->export; ?></a></li><? } ?>
						<? if($acl['guides']['create']){ ?><li><a class="multi-find"><i class="ss-icon">&#xE010;</i> <?= $lang->afindr; ?></a></li><? } ?>
						<? if($acl['guides']['create']){ ?><li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li><? } ?>
					</ul>
					<? if($acl['guides']['create']){ ?>
						<a id="import" href="#"><?= $lang->importg; ?> <i class="ss-icon">&#xEB41;</i></a>
                        <a href="#" class="success trash small button"><?= $lang->trash; ?> <i class="ss-icon">&#xE0D0;</i></a>
						<a href="#" class="success add small button"><?= $lang->addg; ?> <i class="ss-icon">&#x002B;</i></a>
                        <? if($host == IAPP){ ?>
							<a href="features" class="success small button"><?= $lang->features; ?> <i class="ss-icon">&#x002B;</i></a>
						<? } ?>
					<? } ?>
			</div>

			<!-- Form Wrapper -->
			<div id="form-wrapper"></div>

			<!--  Listings -->
      		<div id="guides" class="clearfix">
	      		<table class="display" cellspacing="0" width="100%">
			        <thead>
			            <tr>
			                <th><input type="checkbox" class="select-all" /></th>
			                <th><?= $lang->name; ?></th>
			                <th><?= $lang->description; ?></th>
			                <th><?= $lang->active; ?></th>
			                <th class="center"><?= $lang->steps; ?></th>
			                <th><?= $lang->version; ?></th>
                            <th><?= $lang->creator; ?></th>
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
<script src="<?= $baseUrl; ?>assets/js/views/guides<?= MIN ?>.js"></script>

</body>
</html>
