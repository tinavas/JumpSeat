<div id="roleusermap">
	<div class="large-8">
		<h4><?= $lang->usermap ?></h4>
		<p><?= $lang->usermapd ?></p>
	</div>
	<div id="roleUserGroup" style="position:relative;">
		<!-- Menu Bar -->
		<div id="menuUser">
			<a href="#" class="multi disabled small button secondary" data-dropdown="multiUserAction"><?= $lang->multiactions ?></a>
			<ul id="multiUserAction" class="f-dropdown">
				<li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li>
			</ul>

			<a href="#" class="green dark add success small button"><?= $lang->addu ?> <i class="ss-icon">&#x002B;</i></a>
		</div>

		<!-- Form Wrapper -->
		<div class="form-wrapper"></div>

		<!--  Listings -->
		<div id="roleusermaps" class="clearfix">
			<table class="display" cellspacing="0" width="100%">
				<thead>
					<tr>
						<th></th>
						<th>Firstname</th>
						<th>Lastname</th>
						<th>Email</th>
						<th></th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	</div>
</div>