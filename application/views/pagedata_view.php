<!doctype html>
<html class="no-js" lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>JumpSeat | <?= $lang->config; ?></title>
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
<div id="screenData" class="balloon">
	<div class="row">
		<div class="large-8 columns" style="margin-bottom:0.5em;">
			<h4><?= $lang->config; ?></h4>
		</div>
	</div>
	<div class="row">
		<div id="dataGroup" class="large-12 columns">
			<ul class="tabs" data-tab>
				<li class="tab-title active"><a href="#panel1"><?= $lang->urlsubstitution; ?></a></li>
				<li class="tab-title"><a href="#panel2"><?= $lang->basicconf; ?></a></li>
			</ul>
			<div class="tabs-content">
				<div class="content active" id="panel1">

					<div class="row">
			    		<div class="large-7 columns">
							<h4><?= $lang->urlsubstitution; ?></h4>
				   			<p><?= $lang->configd; ?></p>
				   		</div>
				   	</div>
				   	<div class="row">
				   		<div id="pagedataGroup" class="large-12 columns" style="position:relative">
							<!-- Menu Bar -->
							<div id="menu" class="float-menu clearfix">
								<a href="#" class="multi disabled small button secondary" data-dropdown="multiAction"><?= $lang->multiactions; ?></a>
								<ul id="multiAction" class="f-dropdown">
								  	<li><a class="multi-export"><i class="ss-icon">&#xEB01;</i> <?= $lang->export; ?></a></li>
								  	<li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li>
								</ul>
								<a href="#" id="import"><?= $lang->importc; ?> <i class="ss-icon">&#xEB41;</i></a>
								<a href="#" class="orange light add success small button"><?= $lang->addd; ?> <i class="ss-icon">&#x002B;</i></a>
							</div>
							<div id="form-wrapper"></div>

				      		<!--  Listings -->
				      		<div id="pagedata" class="clearfix">
					      		<table class="display" cellspacing="0" width="100%">
							        <thead>
							            <tr>
							                <th></th>
							                <th>Description</th>
							                <th>Replace</th>
							                <th>With</th>
							                <th></th>
							            </tr>
							        </thead>
							        <tbody></tbody>
							    </table>
						    </div>
						</div>
					</div>
				</div>

				<div class="content" id="panel2">
					<div id="config">
			    		<div class="row">
				    		<div class="large-7 columns">
								<h4><?= $lang->basicconf; ?></h4>
					   			<p><?= $lang->basicconfigd; ?></p>
					   		</div>
					   	</div>
			    		<div class="row">
				    		<div class="large-5 columns">

								<div class="item">
									<input type="hidden" id="requireid" value="0" />
									<label><?= $lang->required; ?></label>
									<textarea class="require" type="text" placeholder="<?= $lang->requiredhelp; ?>"></textarea>
								</div>
								<div class="item">
									<input type="hidden" id="usernameid" value="0" />
									<label><?= $lang->username; ?></label>
									<textarea class="username" type="text" placeholder="<?= $lang->usernamehelp; ?>"></textarea>
								</div>
								<div class="item">
									<input type="hidden" id="roleid" value="0" />
									<label><?= $lang->roles; ?></label>
									<textarea class="roles" type="text" placeholder="<?= $lang->roleshelp; ?>"></textarea>
								</div>
                                <div class="item">
                                    <input type="hidden" id="fireid" value="0" />
                                    <label><?= $lang->fire; ?></label>
                                    <textarea class="fire" type="text" placeholder="<?= $lang->firehelp; ?>"></textarea>
                                </div>
								<a href="#" class="orange light save-config small button"><?= $lang->save; ?></a>
							</div>
						</div>
					</div>
		      	</div>
	      	</div>
      	</div>
    </div>
</div>
<? include 'inc/footer.php'; ?>
<script src="<?= $baseUrl; ?>assets/js/third_party/uploadify/jquery.uploadify.min.js"></script>
<script src="<?= $baseUrl; ?>assets/js/aeroadmin/pagedata<?= MIN ?>.js"></script>
<script src="<?= $baseUrl; ?>assets/js/aeroadmin/export<?= MIN ?>.js"></script>

<!-- NEED THIS EXTRA JQUERY :S -->
<script src="<?= $baseUrl; ?>assets/js/third_party/jquery-10.2.js"></script>
<script src="<?= $baseUrl; ?>assets/js/third_party/datatable/datatable.js"></script>
</body>
</html>
