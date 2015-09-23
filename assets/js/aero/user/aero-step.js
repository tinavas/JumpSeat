"use strict";

/**
 * Step Model
 * @author Mike Priest
 * @type {{url: string, defaults: Function, update: Function, validate: Function}}
 */
Aero.model.step = {

	/**
	 *  Services URI
	 */
	url : "api/steps",

	/**
	 *  @function defaults object for steps
	 *  @param {integer} i step index
	 *  @param {function} callback function
	 */
	defaults : function(i){
		var next = i + 1;
		if(Aero.tip._guide.step) next = (i === Aero.tip._guide.step.length - 1) ? -1 : i + 1;

		return {
			loc: "",
			tries: 3,
			position: "bottom",
			id: "astep-" + i,
			next: next,
			prev: i - 1
		}
	},

	update : function(guide){

		//Update ls
		aeroStorage.getItem('aero:session:index', function(index){

			var ls = JSON.parse(aeroStorage.getItem('aero:guides'));

			//Index Int
			index = parseInt(index);

			//Merge new object
			ls[index] = guide;

			//Update local storage
			aeroStorage.setItem('aero:guides', JSON.stringify(ls));
            aeroStorage.setItem('aero:session', JSON.stringify(ls[index]), function(){}, true);

			//Set session
			Aero.tip.setGuide(guide.id);
			Aero.view.step.render(ls[index]);

		}, true);
	},

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

			//Switch Tab?
			var $tabC = $q('.aero-require-error:eq(0)').parents('.aero-tab-content:eq(0)');
			if($tabC){
				$tabC.parent().find('a[href="#' + $tabC.attr('id') + '"]').click();
			}
		}

		return valid;
	}
};

/**
 * Step View
 * @author Mike Priest
 * @type {{render: Function, renderShare: Function, setState: Function, setEvents: Function}}
 */
Aero.view.step = {

	/**
	 *  Render steps in the menu list
	 */
	render : function(guide){

		var self = this;

		Aero.tpl.get("sidebar-steps.html", function(r){

			aeroStorage.getItem('aero:sidebar:open', function(s){

				//Remove duplicates
				$q('#aeroStepbar').remove();

				var tpl = _q.template(r);
				$q('body').append( tpl( { sidebar: s, g : guide }));
				$q('#aeroGuidebar').remove();

				$q('#aero-tab').css("top", aeroStorage.getItem("aero:session:tab") + "px");
				self.setEvents();
				Aero.view.sidebar.setScrollable();

			}, true);
		});

		Aero.view.sidebar.setEvents();
	},

	/**
	 *  Render sharing link tooltip
	 */
	renderShare : function(url){
		$q('body').append('<div class="aero-share-tip"><span></span><input type="text" value="'+url+'" /></div>');
		$q('.aero-share-tip input').select();
	},

	/**
	 *  Set sidebar UI
	 */
	setState : function(i, state){
		if(!i) i = Aero.tip._current;

		if(state){
			$q('.aero-steps li:eq('+i+')').addClass('aero-' + state);
		}else{
			var $li = $q('.aero-steps li:eq('+i+')');

			$li.addClass('aero-active');
			$li.removeClass('aero-forward aero-missing');
			aeroStorage.removeItem("aero:session:forward", function(){}, true);
		}
	},

	/**
	 *  Set event handlers
	 */
	setEvents : function(){

		var self = this;

		if(AeroStep.admin){
            $q('body').off("click.sa").on("click.sa", ".aero-steps li > a", function(){
                Aero.tip.jumpTo($q('.aero-steps li').index($q(this).parent()));
            });
        }

		$q('body').off("click.sas").on("click.sas", "a.aero-stop", function(){
			Aero.tip.stop();
		});

		$q('body').off("click.ashare").on("click.ashare", "a.aero-share", function(){
			self.renderShare(Aero.host + $q(this).data('link'));
			return false;
		});

		$q(document).click(function(evt){
			if($q(evt.target).hasClass('aero-share-tip') || $q(evt.target).parent().hasClass('aero-share-tip')) return;
			$q('.aero-share-tip').remove();
		});

		//If admin
		if(AeroStep.admin) setTimeout('if(Aero.view.step.admin) Aero.view.step.admin.renderSortable();', 100);
	}
};

/**
 * Step Object
 * @author Mike Priest
 * @type {{get: Function, add: Function, update: Function, moveIndex: Function, destroy: Function}}
 */
Aero.step = {

	/**
	 * @function Get step data
	 * @param {integer} i Step number
     * @returns {object} step object
	 */
	get : function(i){
        try {
            //Extend defaults with user options
            var model = new Aero.model.step.defaults(i);
            return $q.extend({}, model, Aero.tip._guide.step[i]);
        }catch(err){
            AeroStep.session.destroy();
            location.reload(true);
        }
	},

	/**
	 * @function Add a new step
	 * @param {object} step object
     * @param {function} callback function
	 */
	add : function(step, callback){

		//Actions
		step.id = Aero.tip._guide.id;
		step.insertAt = Aero.tip._current;

		Aero.send(Aero.model.step.url, step, function(r){

			//Update ls
			Aero.model.step.update(r);

			var next = Aero.tip._current + 1;
			var jump = Aero.tip._guide.step.length == 0 ? 0 : next;

			//Move to new step
			Aero.tip.jumpTo(jump);

			if(callback) callback(r);
		}, "POST");
	},


	/**
	 * @function Add a new step
	 * @param {object} step object
     * @param {function} callback function
	 */
	update : function(index, step, callback){

		//Actions
		step.id = Aero.tip._guide.id;
		step.index = index;

		Aero.send(Aero.model.step.url, step, function(r){

			//Update ls
			Aero.model.step.update(r);
			Aero.tip.show();

			if(callback) callback(r);
		}, "PUT");
	},

	/**
	 * @function Move steps to new indexes
	 * @param {integer} from Step number
     * @param {integer} to Step number
	 */
	moveIndex : function(from, to){

		Aero.send(Aero.model.step.url + "/move", { id: Aero.tip._guide.id, from: from, to:to }, function(r){
			Aero.model.step.update(r);
		}, "PUT");
	},

	/**
	 * @function Delete a step
	 * @param {integer} i Step number
	 * @param {function} callback function
	 */
	destroy : function(i, callback){

		Aero.send(Aero.model.step.url, { id: Aero.tip._guide.id, index:i}, function(r){

			//Update ls
			Aero.model.step.update(r);

			//Deleted current step? then move next
			if(i == Aero.tip._current) Aero.tip.next();

			if(callback) callback(r);
		}, "DELETE");
	}
};
