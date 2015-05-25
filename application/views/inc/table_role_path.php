<div id="rolepath">
	<div class="large-8">
		<h4><?= $lang->pathmap ?></h4>
		<p><?= $lang->pathmapd ?></p>
	</div>

	<div id="rolepathGroup" style="position: relative;">
		<!-- Menu Bar -->
		<div id="menuPath">
			<a href="#" class="multi disabled small button secondary" data-dropdown="multiActionPath"><?= $lang->multiactions ?></a>
			<ul id="multiActionPath" class="f-dropdown">
				<? if($acl['pathways']['assignRole']){ ?><li><a class="multi-delete"><i class="ss-icon">&#xE0D0;</i> <?= $lang->delete; ?></a></li><? } ?>
			</ul>

			<? if($acl['pathways']['assignRole']){ ?><a href="#" class="green dark add success small button"><?= $lang->assocp ?> <i class="ss-icon">&#x002B;</i></a><? } ?>
		</div>

		<!-- Form Wrapper -->
		<div class="form-wrapper"></div>

		<!--  Listings -->
		<div id="rolemaps" class="clearfix">
			<table class="display" cellspacing="0" width="100%">
				<thead>
					<tr>
						<th></th>
						<th>Pathway name</th>
						<th>Description</th>
						<th>Guides</th>
						<th></th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	</div>
</div>