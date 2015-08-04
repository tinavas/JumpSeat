/**
 *  Export Utility
 */
Utils._export = function(model, ids){
	//Send user to download url
	window.location = "/export?host=" + Aero.host + "&model=" + model + "&ids=" + ids;
};

/**
 *  Import Utility
 */
Utils._import = function(buttonid, options, callback){

	if($q('#SWFUpload_0').length) return;
	var $el = $q(buttonid);

	var settings = {
		'buttonImage' : '',
		'swf'			: '/assets/js/third_party/uploadify/uploadify.swf',
		'buttonClass'	: 'secondary small button',
		'buttonText'	: $el.html(),
		'width'			: 150,
		'height'		: 42,
		'multi'			: false,
		'onUploadStart'	: function(){
			$el.uploadify('settings', 'formData', {
				'timestamp'		: '<? echo time(); ?>',
				'token'			: '<? echo md5("unique_salt" . time()); ?>',
				'host'			: Aero.host
			});
		},

		'onUploadSuccess' : function(){
			if (callback) callback();
		},

		'onUploadError' : function(){
			alert("Error importing tours.")
		}
	};

	//Extend options with defaults
	if (options) $q.extend(settings, options);

	//Init uploadify
    $el.uploadify(settings);
};
