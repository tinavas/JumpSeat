<? $debug = (ENVIRONMENT == "development") ? true : false; ?>
if(!AeroStep){
	/**
	*	Configuration
	*/
	var AeroStep = {
		cache : <?= $cache; ?>,
		lang : <?= $lang; ?>,
		debug : <?= $debug ? "true":"false" ?>,
		admin : <?= $admin ? "true" : "false" ?>,
		baseUrl : "<?= base_url(); ?>",
		host : "<?= $app; ?>",
		<? if ($require != ""){ ?>
			required : {
				ready : function(){
					return <?= $require; ?>;
				}
			},
		<? } ?>

		/**
		*	 Get the username
		*/
		getUsername : (function(){
			var user = "<?= $username; ?>";
			if(user == "") user = "guest@jumpseat.io";

			//Use metadata?
			if(AeroStep.data.username) user = AeroStep.data.username();

			//Has session?
			var ls = localStorage.getItem('aero:username');

			if(ls != user){
				//Clear aero
				AeroStep.session.destroy('aero:');
			}

			//Save current user
			localStorage.setItem('aero:username', user);

			return user;
		}),


        /**
        *   Get URL Parameter Value
        */
        getUrlParam : function(name){

            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

        },

		/**
		*   Get the current URL with replacement
		*/
		getSubURL : function(url){
			if(!url) url = window.location.href;

			try {
				var urls = AeroStep.data;

				if(urls){
					for(var i in urls){
                        for(var j in urls[i]){
                            if(urls[i][j]['regex']){
                                var reg = new RegExp(urls[i][j]['regex'].replace(/\//g, '\/'), "i");
                                url = url.replace(reg, (eval(urls[i][j]['value'])));
                            }
                        }
					}
				}
			}catch(err){
				Aero.log('Problem with URL Sub: ' + err, 'error');
			}

			return url;
		},

		config : {
			"baseUrl" : "<?= base_url(); ?>",
			"paths": {
				"jquery": "assets/js/third_party/jquery",
				"underscore": "assets/js/third_party/underscore",
				"aero" : "assets/js/aero/user/aero",
                "aero-main" : "assets/js/aero/user/_main",
                "aero-guide" : "assets/js/aero/user/aero-guide",
				"aero-pathway" : "assets/js/aero/user/aero-pathway",
                "aero-quiz" : "assets/js/aero/user/aero-quiz",
				"aero-media" : "assets/js/aero/user/aero-media",
				"aero-step" : "assets/js/aero/user/aero-step",
				"aero-tip" : "assets/js/aero/user/aero-tip",
				"aero-audit" : "assets/js/aero/user/aero-audit"
				<? if($admin){ ?>
                    ,"aero-admin-main" : "assets/js/aero/admin/_main"
                    ,"aero-admin" : "assets/js/aero/admin/aero-admin"
                    ,"aero-admin-guide" : "assets/js/aero/admin/aero-guide"
                    ,"aero-admin-step" : "assets/js/aero/admin/aero-step"
                    ,"aero-admin-pathway" : "assets/js/aero/admin/aero-pathway"
                    ,"aero-admin-quiz" : "assets/js/aero/admin/aero-quiz"
                    ,"aero-admin-role" : "assets/js/aero/admin/aero-role"
                    ,"aero-admin-picker" : "assets/js/aero/admin/aero-picker"
                    ,"aero-admin-quiz" : "assets/js/aero/admin/aero-quiz"
                    ,"aero-editor" : "assets/js/third_party/editor/aero-editor"
				<? } ?>
				<? if($debug){ ?>,"aero-test" : "assets/js/_test/services"<? } ?>
			},
			"shim": {
                "jquery": {				"exports": "$q" }
                ,"underscore": {		"exports": "_q" }
                ,"aero" : {			 	"deps" : ["jquery", "underscore"] }
                ,"aero-main" : {     	"deps" : ["aero", "aero-tip", "aero-pathway", "aero-guide"] }
                ,"aero-guide" : {		"deps" : ["aero", "aero-tip", "aero-pathway"] }
                ,"aero-pathway" : { 	"deps" : ["aero"] }
                ,"aero-quiz" : { 	    "deps" : ["aero"] }
				,"aero-media" : { 	    "deps" : ["aero"] }
                ,"aero-step" : {    	"deps" : ["aero"] }
                ,"aero-audit" : {    	"deps" : ["aero"] }
				,"aero-admin-quiz" : {  "deps" : ["aero", "aero-admin", "aero-admin-step"] }
                ,"aero-tip": { 			"deps" : ["aero", "aero-step", "aero-audit"] }
            <? if($debug){ ?>
                ,"aero-test": { "deps": ["aero"] }
            <? } ?>
            <? if($admin){ ?>
                ,"aero-admin" : { 		"deps": ["aero"] }
                ,"aero-admin-guide" : { "deps": ["aero", "aero-guide", "aero-admin"] }
                ,"aero-admin-step" : {  "deps": ["aero", "aero-step", "aero-admin"] }
                ,"aero-admin-pathway" :{"deps": ["aero", "aero-admin"] }
                ,"aero-admin-role" : { 	"deps": ["aero", "aero-admin"] }
                ,"aero-admin-picker" : {"deps": ["aero", "aero-admin"] }
                ,"aero-admin-quiz" : { 	"deps": ["aero", "aero-admin", "aero-admin-guide", "aero-admin-step"] }
                ,"aero-admin-main": { 	"deps": ["aero", "aero-step", "aero-guide", "aero-admin-guide","aero-admin-step","aero-admin-pathway","aero-admin-role","aero-admin-picker","aero-admin-quiz"] }
                ,"aero-editor": { 		"deps": ["jquery"] }
            <? } ?>
			},
			"lib_list" : [
				"jquery", "underscore", "aero", "aero-main", "aero-guide", "aero-pathway", "aero-step", "aero-tip", "aero-audit", "aero-quiz", "aero-media"
                <? if($debug){ ?>,"aero-test"<? } ?>
                <? if($admin){ ?>,"aero-admin","aero-admin-guide","aero-admin-step","aero-admin-pathway","aero-admin-role","aero-admin-picker","aero-admin-quiz","aero-admin-main","aero-editor"<? } ?>
			],
			"css": [
				"assets/css/aero.css",
                <? if($admin){ ?>"assets/js/third_party/editor/ui/trumbowyg.min.css",<? } ?>
				"assets/css/font-awesome.min.css"
			]
		},

		require : function(callback){

			var s = document.createElement('script');
				s.src = this.baseUrl + "assets/js/third_party/require.js";
				s.async = true;
				s.onreadystatechange = s.onload = function() {
					var state = s.readyState;
					if (!callback.done && (!state || /loaded|complete/.test(state))) {
						callback.done = true;
						callback();
					}
			};

			document.getElementsByTagName('body')[0].appendChild(s);
		},

		loadCss : function(){
			var css_list = this.config.css;

			for (i = 0; i < css_list.length; i++) {
				var link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";

				link.href = this.baseUrl + css_list[i];
				if(css_list[i].indexOf("//") >= 0){
					link.href = css_list[i];
				}

				var ext = css_list[i].substr(css_list[i].length - 4);
				if (ext != ".css") link.href += ".css";
				document.getElementsByTagName("head")[0].appendChild(link);
			}
		}
	};

	try {
		AeroStep.data = {
			<?= $pagedata; ?>
		}
	}catch(err){
		console.log('%c Pagedata is broken: '+err, 'background: red; color: #fff');
	}

    try {
       <?= (isset($fire)) ? $fire : ""; ?>
    }catch(err){
        console.log('%c Fire is broken: '+err, 'background: red; color: #fff');
    }

	AeroStep.session = {
		destroy : function(key){

			if(Aero && Aero.audit && Aero.audit.enabled) Aero.audit.save();

			if(!key) key = "aero:session";
			var reg = new RegExp("^" + key, "i");

			//Clear session
			Object.keys(localStorage)
		      .forEach(function(key){
		           if (reg.test(key)) {
		               localStorage.removeItem(key);
		           }
		       });
		 }
	};

	AeroStep.init = function(callback, require){
	    var timer = null;
		if(!require){ callback(); return; }

		function wait(){
	        timer = window.setInterval(function(){
	            try {
	                if(require.ready()){
						if(AeroStep.debug) console.log("Found required metadata");
						callback();

	                    clearInterval(timer);
	                }else{
						if(AeroStep.debug) console.log("Observing for required...");
					}
	            }catch(err){
	                if(AeroStep.debug) console.log("Observing for required...");
	            }
	        }, 500);
		}
	    wait();
	};

	AeroStep.ready = function(callback, required){
	     new AeroStep.init(callback, required);
	};

	//Load on ready
	AeroStep.ready(function(){
		AeroStep.require(function(){
			AeroStep.loadCss();
			aerorequirejs.config(AeroStep.config);
			aerorequirejs(AeroStep.config.lib_list);
		});
	}, AeroStep.required);
}
