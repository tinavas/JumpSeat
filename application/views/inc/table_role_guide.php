<div id="rolemap">
	<div class="large-8">
		<h4><?= $lang->pathguide ?></h4>
		<p><?= $lang->pathguided ?></p>
	</div>
	<div id="roleGuideGroup" style="position:relative;">
		<!-- Menu Bar -->
		<div id="menu">
			<a href="#" class="multi disabled small button secondary" data-dropdown="multiAction"><?= $lang->multiactions ?></a>
			<ul id="multiAction" class="f-dropdown">
				<? if($acl['roles']['assignGuide']){ ?><li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li><? } ?>
			</ul>

			<? if($acl['roles']['assignGuide']){ ?><a href="#" class="green dark add success small button"><?= $lang->assocg ?> <i class="ss-icon">&#x002B;</i></a><? } ?>
		</div>

		<!-- Form Wrapper -->
		<div class="form-wrapper"></div>

		<!--  Listings -->
		<div id="rolemaps" class="clearfix">
			<table class="display" cellspacing="0" width="100%">
				<thead>
					<tr>
						<th></th>
						<th>Guide</th>
						<th>Description</th>
						<th class="center">Steps</th>
						<th></th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	</div>
</div>