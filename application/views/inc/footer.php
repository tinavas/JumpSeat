<div class="footer">
<?= $lang->copy . $this->config->item('version') ?>
</div>

<script>
var AeroStep = {
	baseUrl : '<?= $baseUrl; ?>',
	lang : <?= json_encode($lang); ?>,
	host : '<?= isset($host) ? $host : "" ?>',
	getUsername : function(){
		return '<?= $username ?>';
	},
	debug : <?= ENVIRONMENT == 'development' ? "true":"false" ?>
};
</script>
<script src="<?= $baseUrl; ?>assets/js/third_party/jquery-11.js"></script>
<script src="<?= $baseUrl; ?>assets/js/third_party/jquery-ui.js"></script>
<script src="<?= $baseUrl; ?>assets/js/third_party/underscore.js"></script>
<script src="<?= $baseUrl; ?>assets/lib/foundation/js/foundation.min.js"></script>
<script src="<?= $baseUrl; ?>assets/lib/foundation/js/vendor/placeholder.js"></script>
<script src="<?= $baseUrl; ?>assets/lib/foundation/js/foundation/foundation.dropdown.js"></script>
<script src='<?= $baseUrl; ?>assets/js/third_party/gsap/TweenMax.min.js'></script>
<script>
	$q(document).foundation();
	$q('input, textarea, select').placeholder();
</script>
<script src="<?= $baseUrl; ?>assets/js/aeroadmin/utils<?= MIN ?>.js"></script>
<script src="<?= $baseUrl; ?>assets/js/aero<?= MIN ?>.js"></script>