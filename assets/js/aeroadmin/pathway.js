"use strict";

/**
 * @class Pathway
 * Start admin namespace
 */
var Pathway = {

	//Id used for edit
	id : null,

	init : function(){
		Pathway.api.get(function(results){
			Pathway.view.render(results);
		});
	}
};


/**
 *  @namespace Pathway
 *  @class Pathway.model
 *  Model for Pathway Object
 */
Pathway.model = {

	url : "api/pathway",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	},

	validate : function(){
		//Check for required
		var valid = $q('form').isFormValid();

		return valid;
	},

	save : function(){
		//Get form data
		var data = $q('.saving form').aeroSerialize();

		//Create or update
		if(Pathway.model.validate()){
			if(Pathway.id){
				Pathway.api.update(data, Pathway.id);
			}else{
				Pathway.api.create(data);
			}
		}
	}
};

/**
 *  @namespace Pathway
 *  @class Pathway.view
 *  UX Views and Event Handlers
 */
Pathway.view = {

	/**
	 *  Render list view
	 */
	render : function(pathways, callback, noEmpty){
		var $card = null;
		var self = this;

		if(pathways.length > 0){
			Aero.tpl.get("pathways.html", function(r){

				//Clear
				if(!noEmpty) $q('#pathways ul').html("");

				var tpl = _q.template(r);
				for(var i in pathways){
					$q('#pathways ul').append( tpl( { pathway: pathways[i] }));
				}

				if(callback) callback();
				self.setEvents();
			});
		}else{
			//Defaults
			var render = Pathway.model.defaults();
				render.title = "New Pathway";

			Pathway.view.render([render], function(){
				Pathway.view.renderForm(Pathway.model.defaults(), $q('.front:last'));
			}, true);
		}
	},

	/**
	 *  Render list view
	 */
	renderForm : function(pathway, $el){

		var self = this;
		var $back = $el.parents('.card').find('.back');

		Aero.tpl.get("pathway-form.html", function(r){

			Pathway.id = (pathway) ? pathway.id : null;
			if(!pathway) pathway = {};

			var tpl = _q.template(r);

			$back.find('.columns').html( tpl( { pathway: pathway }));
			Utils.card.flip($el);

			self.setEvents();
		});
	},

	/**
	 *  Update card
	 */
	updateCard : function(r){

		var $front = $q('.saving');
		var applink = 'pathway/' + encodeURIComponent(r.title);

		if(r.id) $front.parents('.li:eq(0)').data('id', r.id);
		$front.find('.title').html(r.title);
		$front.find('.description').html(r.description);
		$front.find('.flip-button').attr('href', applink);
	},

	/**
	 *  New pathway card
	 */
	newCard : function(){

		//Defaults
		var render = Pathway.model.defaults();
			render.title = "New Pathway";

		Pathway.view.render([render], function(){
			Pathway.view.renderForm(Pathway.model.defaults(), $q('.front:last'));
		}, true);
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

		var self = this;

		//Init cards hover
		Utils.card.setEvents(AeroStep.lang.cardr);

		//Save on enter
		$q('input, textarea').off("keypress.k").on("keypress.k", function(e){
			var k = e.keyCode || e.which;
			if(k == '13'){
				$q('.saving').removeClass('saving');
				$q(this).parents('.card').addClass('saving');
				Pathway.model.save();
				return false;
			}
		});

		//Shortcuts
		$q('body').off("keypress.sn").on("keypress.sn", function(e){
			var k = e.keyCode || e.which;
			if(e.target.tagName == "BODY" &&  k == '78' && e.shiftKey){
				self.newCard();
				return false;
			}
		});

		//New
		$q('.add').off("click.patha").on("click.patha", function(){
			self.newCard();
			return false;
		});

		//Delete
		$q('.delete').off("click.pathd").on("click.pathd", function(){
			var $el = $q(this);
			var id = $el.parents('li:eq(0)').data('id');
			var name = $el.parents('form').find('input:eq(0)').val();

			//Confirm
			Aero.confirm({
				ok : "delete",
				title : name,
				msg : "Are you sure you want to delete this item?",
				onConfirm : function(){
					$el.parents('.card').addClass('deleting');
					Pathway.api.del(id);
				}
			});

			return false;
		});

		//Save
		$q('.save').off("click.paths").on("click.paths", function(){
			$q('.saving').removeClass('saving');
			$q(this).parents('.card').addClass('saving');
			Pathway.model.save();
			return false;
		});

		//Edit
		$q('.edit').off("click.pathe").on("click.pathe", function(){
			var id = $q(this).parents('li:eq(0)').data('id');
			var $el = $q(this);

			Pathway.api.get(function(r){
				Pathway.view.renderForm(r, $el);
			}, id);
			return false;
		});

		//Cancel
		$q('.cancel').off("click.pathc").on("click.pathc", function(){
			Utils.card.remove($q(this));
			return false;
		});
	}
};


/**
 *  @namespace Pathway
 *  @class Pathway.api
 *  API REST Services
 */
Pathway.api = {

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback, id){
		//Get by id?
		var data = {};
			data.count = true;
		if(id)
			data.id = id;

		Aero.send(Pathway.model.url, data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	getByTitle : function(title, callback){
		//Get by id?
		var data = {};
			data.title = title;

		Aero.send(Pathway.model.url, data, function(r){
			if(callback) callback(r);
		}, "GET");
	},


	/**
	 *  Create new pathway
	 *  @param function callback
	 *  @param id
	 */
	create : function(data, callback){

		//Call
		Aero.send(Pathway.model.url, data, function(r){
			data.id = r;

			Pathway.view.updateCard(data);
			Utils.card.flip($q('.saving form'), true, function(){
				$q('.saving form').remove();
				$q('.saving').removeClass('saving');
				if(callback) callback(r);
			});
		}, "POST");
	},

	/**
	 *  Update pathway data
	 *  @param string[] data
	 *  @param function callback
	 */
	update : function(data, id, callback){

		data.id = id;

		//Call
		Aero.send(Pathway.model.url, data, function(r){

			Pathway.view.updateCard(r);
			Utils.card.flip($q('.saving form'), true, function(){
				$q('.saving').removeClass('saving');
				if(callback) callback(r);
			});
		}, "PUT");
	},

	/**
	 *  Delete pathway
	 *  @param string id
	 */
	del : function(id){

		//Call
		Aero.send(Pathway.model.url, { id : id}, function(r){
			Utils.card.remove($q('.deleting'));
		}, "DELETE");
	}
};
