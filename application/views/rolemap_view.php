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
<div id="screenRoles" class="balloon">
	<div class="row">
		<div id="roleGroup" class="large-12 columns">
		   	<h4 class="inner-title" id="roletitle" data-title="<?= $id ?>"><a href="/app/<?= $host ?>/roles"><?= $lang->roles ?></a><i class="ss-icon">&#x25BB;</i><?= $id ?></h4>
		    <span data-id="<?= $objid; ?>" class="description"><?= $objdesc; ?></span>

			<ul class="tabs" data-tab>
				<li class="tab-title active"><a href="#panel1"><?= $lang->pathways ?></a></li>
				<li class="tab-title"><a href="#panel2"><?= $lang->guides ?></a></li>
				<li class="tab-title"><a href="#panel3"><?= $lang->users ?></a></li>
				<li class="tab-title"><a href="#panel4"><?= $lang->permissions ?></a></li>
			</ul>
			<div class="tabs-content">
				<div class="content active" id="panel1">
					<? include 'inc/table_role_path.php'; ?>
				</div>
				<div class="content" id="panel2">
					<? include 'inc/table_role_guide.php'; ?>
				</div>
				<div class="content" id="panel3">
					<? include 'inc/table_role_user.php'; ?>
				</div>
				<div class="content" id="panel4">
					<? include 'inc/permissions.php'; ?>
				</div>
			</div>
    	</div>
    </div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/views/rolemap<?= MIN ?>.js"></script>
<script src="<?= $baseUrl; ?>assets/js/views/rolemappathway<?= MIN ?>.js"></script>
<script src="<?= $baseUrl; ?>assets/js/views/roleusermap<?= MIN ?>.js"></script>
</body>
</html>
