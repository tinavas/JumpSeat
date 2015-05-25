<div class="clearfix">
	<!-- Menu Bar -->
	<div id="userMenu" class="right">
		<a href="#" class="multi small button secondary" data-dropdown="userAction">
			<span style="padding-right: 0.4em;">
				<svg version="1.1"
					 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
					 x="0px" y="0px" width="13.5px" height="14.5px" viewBox="0 0 13.5 14.5" enable-background="new 0 0 13.5 14.5"
					 xml:space="preserve">
				<defs>
				</defs>
				<g>
					<path fill="none" stroke="#009DCD" stroke-miterlimit="10" d="M5.1,7.9v1.8l-3.3,1.2c-0.8,0.3-1.3,1-1.3,1.9V14H13v-1.2
						c0-0.8-0.5-1.6-1.3-1.9L8.4,9.7V7.8"/>
					<ellipse fill="none" stroke="#009DCD" stroke-miterlimit="10" cx="6.7" cy="4.4" rx="3.3" ry="3.9"/>
					<path fill="none" stroke="#009DCD" stroke-miterlimit="10" d="M9.9,4.1c-0.1,0-0.2,0-0.3,0C8.5,4.3,7.8,3.9,7.2,2.8
						C6.8,3.6,5.6,4.1,4.7,4.1C4.2,4.1,3.8,4,3.4,3.8"/>
				</g>
				</svg>
			</span>

			<span class="name"><?= $username ?></span><i class="arrow ss-icon">&#xF501;</i>
		</a>
		<ul id="userAction" class="f-dropdown">
			<li><a href="/<?= $_SESSION['userid'] ?>/profile"><i class="ss-write"></i> <?= $lang->profilec ?></a></li>
		  	<li><a href="/login"><i class="ss-lock"></i> <?= $lang->logout ?></a></li>
		</ul>
	</div>

	<div class="logo">
		<div <?= (isset($host)) ? 'class="left"' : '' ?>><h2 class="main-title"><img style="height:25px" src="/assets/images/jumpseat.png" /></h2></div>
		<div>
			<? if(isset($host)){
				$first = str_replace("http_", "http://", $host);
				$second = str_replace("https_", "https://", $first);
				$hostName = str_replace("_", ".", $second);
				echo "<h2 class=\"main-title\" id=\"hostName\">$hostName</h2>";
			} ?>
		</div>
	</div>
</div>