/**
 *  @class Guide object
 *  @author Mike Priest
 */
"use strict";

/**
 *  @namespace Aero.model for guide
 */
Aero.model.guide = {

	/**
	 *  Services URL
	 */
	url : "api/guides",
	urlSearch: "api/search",

	/**
	 *  Default model
	 *  Used so we don't have to store all value in the DB
	 */
	defaults : function(){

		return {
			"title": "",
			"active": false,
			"steps" : []
		}
	},

	/**
	 *  Get guide from the model by id
	 */
	byId : function(id, callback){
		Aero.guide.getAll(function(guides){
			$q.each(guides, function(i, guide){

				if(guide && (id == guide.id)){
					callback(guides[i]);
					localStorage.setItem('aero:session:index', i);
				}
			})
		});
	},

	/**
	 *  Update our model/view
	 */
	update : function(callback, newid){
		Aero.guide.getAll(function(r){
			Aero.view.guide.render(r);
			if(callback) callback(newid);
		}, true);
	},

	/**
	 *  Validate our forms
	 */
	validate : function(){

		//Validate
		var valid = $q('form').isFormValid();

		//Check content
		if($q('#aeroEditor').trumbowyg('html').replace(/<br>/g, '') == ""){
			valid = false;
			$q('.trumbowyg-editor').addClass('aero-require-error');
		}

		//Add messaging
		if(!valid){
			$q('#aeroSection0 p:first').after('<div class="aero-error-box">'+AeroStep.lang.requirede+'</div>');
		}

		return valid;
	}
};

/**
 *  @namespace Aero.view for guide
 */
Aero.view.guide = {

	/**
	 *  @function sidebar view
	 *  @param {array} guides
	 *  @param {function} callback function
	 */
	render : function(guides, callback, search){
		var self = this;

		//Cleanup stuff
        $q('.aero-restrict').remove();
		if(!search) self.clearSearch();

		Aero.tpl.get("sidebar-guides.html", function(r){
			var s = localStorage.getItem('aero:sidebar:open');

			//Remove duplicates
			$q('#aeroGuidebar').remove();

			var tpl = _q.template(r);
			$q('body').append( tpl( { sidebar: s, guides: guides }));
			$q('#aeroStepbar').remove();

			$q('#aero-tab').css("top", localStorage.getItem("aero:session:tab") + "px");
			self.setEvents();
			Aero.view.sidebar.setEvents();
			Aero.view.sidebar.setScrollable();

            //Notify of new guides
            var diff = parseInt($q('body').data('newguides'));
            if(diff > 0){
                Aero.view.sidebar.notify(diff);
            }
		});
	},

    /**
     *  @function restrict a guide
     *  @param guide with restrictions
     */
    renderRestrict : function(guide){

        var _this = this;

        if(guide.isComplete || !guide.restrict || guide.restrict.length == 0) return;

        function renderBox(step, loc, color){

            var $el, $box;
            $el = $q(loc);

            if($el.length > 0) {
                //Setup Box
                $box = $q('<a />')
                    .addClass('aero-restrict')
                    .css({
                        'background-color': color,
                        'cursor': 'pointer',
                        'opacity': 0.5
                    })
                    .data('loc', loc)
                    .data('guideid', guide.id)
                    .data('step', parseInt(step));

                $q('body').append($box);

                _this.positionRestrict($box);
            }
        }

        for(var j in guide.restrict) {
            j = parseInt(j.replace('s', ''));

            if (guide.step.length > 0) {
                renderBox(j, guide.step[j].loc, guide.step[j].restrictColor);
            }
        }
    },

    /**
     *  @function restrict a guide
     *  @param guide with restrictions
     */
    positionRestrict : function($box){

        var $el = $q($box.data('loc'));

        //Setup Box
        $box.css({
            'width' : $el.outerWidth(),
            'height' : $el.outerHeight(),
            'top' : $el.offset().top,
            'left' : $el.offset().left,
            'position' : 'absolute',
            'z-index' : 99
        });
    },

	/**
	 *  @function search
	 *  @param {array} guides
	 *  @param {function} callback function
	 */
	search : function(term){
		var self = this;

		$q('.aero-search i').switchClass( "fa-search", "fa-times", 0);
		$q('.aero-search a').switchClass( "aero-search-btn", "aero-search-clear", 0);

		Aero.guide.getByTerm(term, function(r){
			r.search = term;
			self.render(r, function(){}, true);
		});
	},

	/**
	 *  @function search reset ui
	 */
	clearSearch : function(){
		if($q('.aero-search-clear').length > 0){
			$q('.aero-search i').switchClass( "fa-times", "fa-search", 0);
			$q('.aero-search a').switchClass( "aero-search-clear", "aero-search-btn", 0);
			$q('.aero-search').removeClass('aero-active');
			$q('input[name=aero_search]').val(AeroStep.lang.search);
		}
	},

	/**
	 *  @function setEvents on the guide view
	 */
	setEvents: function(){
		var self = this;

		//Start a guide
		$q('body').off('click.aeroStart').on('click.aeroStart', '.aero-guides ul li > a', function(){
			var id = $q(this).parents('li:eq(0)').data('guideid');
			Aero.tip.start(id);
		});

		//Search active placeholder
		$q('body').off('click.apF').on('focus.apF', '.aero-sidebar input[name=aero_search]', function(){
			$q(this).parents("div:eq(0)").addClass('aero-active');
			if($q(this).val() == AeroStep.lang.search) $q(this).val("");
		});
		$q('body').off('click.apB').on('blur.apB', '.aero-sidebar input[name=aero_search]', function(){
			if($q(this).val() == ""){
				$q(this).parents("div:eq(0)").removeClass('aero-active');
				$q(this).val(AeroStep.lang.search);
			}
		});

		//Perform search
		$q('body').off('click.aS').on('click.aS', '.aero-search a.aero-search-btn', function(){
			self.search($q('input[name=aero_search]').val());
		});
		$q('body').off('keypress.asK').on('keypress.asK', '.aero-sidebar input[name=aero_search]', function(e){
			var code = e.keyCode || e.which;
			 if(code == 13){
				self.search($q(this).val());
			}
		});

		//Clear search
		$q('body').off('click.asC').on('click.asC', '.aero-search-clear', function(){
			Aero.guide.getAll(function(guides){
				self.render(guides);
			});
			return false;
		});

        //Restrict Start
        $q('body').off('click.asr').on('click.asr', '.aero-restrict', function(){

            var _this = $q(this);

            Aero.confirm({
                ok : AeroStep.lang.ok,
                title : AeroStep.lang.restrictt,
                msg : AeroStep.lang.restrictb,
                onConfirm : function(){
                    Aero.tip.start(_this.data('guideid'));
                }
            });
        });
	}
};

/**
 * @namespace Aero.guide
 * Guide object
 */
Aero.guide = {

	/**
	 * @function Initialize the sidebar as guide listing
	 * @param {function} callback function
	 */
	init : function(){
		var self = this;

		//Check for ended guide
		var end = localStorage.getItem('aero:session:end');
		if(end) Aero.tip.sayCongrats();

		self.getAll(function(guides){

			var ls = localStorage.getItem("aero:session");
			var hasLink = window.location.hash.indexOf('guideid=') != -1;

			if(ls){
				//Session start
				var guide = JSON.parse(ls);
				Aero.tip.start(guide.id, parseInt(localStorage.getItem("aero:session:current")));

			}else if(hasLink){
				//URL link start
				var id = window.location.hash.split("=").slice(-1)[0];
				Aero.tip.start(id);
				window.location.hash = window.location.hash.split('guideid')[0];
			}else{
				//Render guide sidebar
				var index = localStorage.getItem("aero:pathway");
				if(index && index != "0"){
					Aero.pathway.get(function(r){
						var t = Aero.view.pathway.render(r, parseInt(index));
						if(!t) Aero.view.guide.render(guides);
					});
				}else{
					Aero.view.guide.render(guides);
				}
			}
		});
	},

	/**
	 *  @function autoStart a guide based on URL or any page
	 *  @param guide to start
	 */
	autoStart : function(guide){

        //Check restrict
        Aero.view.guide.renderRestrict(guide);

        if(!guide.auto) return;

        if(!guide.isComplete && !AeroStep.admin && guide.step.length > 0){

            var isStart = false;

            //Start on any page?
            if(guide.autoPage){
                isStart = true;
            }else{
                //Check current page matches first step URL
                if(guide.step.length > 0 && window.location.pathname == guide.step[0].url){
                    isStart = true;
                }
            }

            if(isStart) Aero.tip.start(guide.id);
		}
	},

	/**
	 *  @function update local storage data
	 */
	updateCache : function(guides){
		localStorage.setItem('aero:guides', JSON.stringify(guides));
	},

	/**
	 * @function Get all the guides in the system
	 * @param {function} callback function
	 */
	getAll : function(callback, force){

		//Get cache
        var oldData = null;
        var ls = localStorage.getItem('aero:guides');
		var cache = localStorage.getItem('aero:cache');
		if(!cache) cache = AeroStep.cache;
			cache = parseInt(cache);

		//Clear cache
		if(cache != AeroStep.cache) {
            oldData = JSON.parse(ls);
            localStorage.removeItem('aero:guides');

            //Clear cache
            ls = null;
        }

		//Local or Server storage loader
		if(!ls || force){

			Aero.log("Loading from SS", "success");
			Aero.send(Aero.model.guide.url, { enduser: Aero.constants.USERNAME }, function(guides){

                //Notify of new
                if(oldData) {
                    var diff = guides.length - oldData.length;
                    if (diff > 0) $q('body').data('newguides', diff);
                }

				localStorage.setItem('aero:cache', AeroStep.cache);
				localStorage.setItem('aero:guides', JSON.stringify(guides));
				if(callback) callback(guides);
			});
		}else{
			Aero.log("Loading from LS", "success");
			callback(JSON.parse(ls));
		}
	},

	/**
	 *  Get a guide by id
	 */
	get : function(id, callback){
		Aero.send(Aero.model.guide.url, { id : id }, function(guide){
			if(callback) callback(guide);
		});
	},


	/**
	 *  Get a guide by id
	 */
	getByTerm : function(term, callback){
		Aero.send(Aero.model.guide.urlSearch, { term : term }, function(guide){
			if(callback) callback(guide);
		});
	},

	/**
	 * @function Create a new guide
	 * @param {object} guide data
	 * @param {function} callback function
	 */
	create : function(guide, callback){
		Aero.send(Aero.model.guide.url, guide, function(r){
			Aero.model.guide.update(callback, r);
		}, "POST");
	},

	/**
	 * @function Update guide data
	 * @param {object} guide data
	 * @param {function} callback function
	 */
	update : function(guide, callback){
		Aero.send(Aero.model.guide.url, guide, function(){
			Aero.model.guide.update();
			if(callback) callback();
		}, "PUT");
	},

	/**
	 * @function Delete a guide
	 * @param {integer} id
	 */
	destroy : function(id){
		Aero.send(Aero.model.guide.url, { id : id }, function(){
			Aero.model.guide.update();
		}, "DELETE");
	}
};

/**
 * Controls events for the guides and steps sidebars
 */
Aero.view.sidebar = {

	/**
	 *  @function setScrollable area
	 */
	setScrollable : function(){
		var w = $q(window).height() - ($q('.aero-head').outerHeight() + $q('.aero-foot').outerHeight());
		var t = $q('.aero-guide-title').outerHeight();
		var a = $q('.aero-add-step').length > 0 ? $q('.aero-add-step').outerHeight() : 0;

		$q('.aero-guides, .aero-steps').height(w - (t + a));
	},

	/**
	 *  @function show sidebar
	 *  @param boolean store
	 *  @param integer time
	 */
	show : function(store, time){

		if(!time) time - 750;

		$q('.aero-sidebar')
            .stop()
			.animate({ right: "-50px" }, time, 'easeInOutBack', function() {})
			.addClass('open');

		if(store) localStorage.setItem('aero:sidebar:open', 1);
	},

	/**
	 *  @function hide sidebar
	 *  @param boolean store
	 */
	hide : function(store){
        $q('.aero-sidebar')
            .stop()
			.animate({ right: -($q('.aero-sidebar').outerWidth(true)) }, 300, 'swing', function() {})
			.removeClass('open');

		//Close admin windows
		if($q('.aero-admin-wrapper').length){
			$q('.aero-admin-wrapper').remove();
			$q('#aero-tab').css('left', '-44px');
		}
		$q('.aero-blanket, .aero-edit-active').remove();
		if(store)  localStorage.setItem('aero:sidebar:open', 0);
	},

    /**
     *  @function notify user of new guides
     *  @param integer total
     */
    notify : function(total){
        $q('#aero-tab').prepend('<span class="aero-not">'+$q('body').data('newguides')+'</span>');
    },

	/**
	 *  @function setEvents
	 */
	setEvents : function(){
		var self = this;
		var sizing;

		//Resize window reposition
		window.onresize = function(){
			clearTimeout(sizing);
			sizing = setTimeout(function(){
				self.setScrollable();

                //Reposition overlays
                var $ar = $q('.aero-restrict');
                if($ar.length == 0) return;

                $ar.each(function(){
                    Aero.view.guide.positionRestrict($q(this));
                });

			}, 100);
		};

		//Tab click
		$q('body').off("click.atc").on("click.atc", "#aero-tab a", function(){
			if($q('.aero-sidebar').hasClass('open')){
				self.hide(true);
			}else{
				self.show(true);
			}
		});

		//Tab drag
		$q('#aero-tab').draggable({
			axis: "y",
			distance: 10,
			stop: function( event, ui ) {
				localStorage.setItem("aero:session:tab", ui.offset.top);
			}
		});

		$q(window).off('hashchange.hashn').on('hashchange.hashn', function() {
			Aero.hashChange = true;
			AeroStep.ready(function(){
				setTimeout(function(){
					Aero.hashChange = false;
					Aero.guide.init();
				},500);
			}, AeroStep.required);
		});
	}
};

//Start the crazies
$q(function(){ Aero.guide.init(); });
