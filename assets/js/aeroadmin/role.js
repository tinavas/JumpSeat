"use strict";

/**
 * @class Roles
 * Start admin namespace
 */
var Roles = {

	//Id used for edit
	id : null,

	init : function(){
		Roles.api.get(function(results){
			Roles.view.render(results);
		});
	}
};

/**
 *  @namespace Roles
 *  @class Roles.model
 *  Model for Roles Object
 */
Roles.model = {

	url : "api/role",

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
		if(Roles.model.validate()){
			if(Roles.id){
				Roles.api.update(data, Roles.id);
			}else{
				Roles.api.create(data);
			}
		}
	}
};

/**
 *  @namespace Roles
 *  @class Roles.view
 *  UX Views and Event Handlers
 */
Roles.view = {

	/**
	 *  Render list view
	 */
	render : function(roles, callback, noEmpty){
		var $card = null;
		var self = this;

		if(roles.length > 0){
			Aero.tpl.get("roles.html", function(r){

				//Clear
				if(!noEmpty) $q('#roles ul').html("");

				var tpl = _q.template(r);
				for(var i in roles){
					$q('#roles ul').append( tpl( { role: roles[i] }));
				}

				if(callback) callback();
				self.setEvents();
			});
		}else{
			//Defaults
			var render = Roles.model.defaults();
				render.title = "New Role";

			Roles.view.render([render], function(){
				Roles.view.renderForm(Roles.model.defaults(), $q('.front:last'));
			}, true);
		}
	},

	/**
	 *  Render list view
	 */
	renderForm : function(role, $el){

		var self = this;
		var $back = $el.parents('.card').find('.back');

		Aero.tpl.get("role-form.html", function(r){

			Roles.id = (role) ? role.id : null;
			if(!role) role = {};

			var tpl = _q.template(r);

			$back.find('.columns').html( tpl( { role: role }));
			Utils.card.flip($el);

			self.setEvents();
		});
	},

	/**
	 *  Update card
	 */
	updateCard : function(r){

		var $front = $q('.saving');
		var applink = 'role/' + encodeURIComponent(r.title);

		if(r.id) $front.parents('.li:eq(0)').data('id', r.id);
		$front.find('.title').html(r.title);
		$front.find('.description').html(r.description);
		$front.find('.flip-button').attr('href', applink);
	},

	/**
	 *  New role card
	 */
	newCard : function(){
		//Defaults
		var render = Roles.model.defaults();
			render.title = "New Role";

		Roles.view.render([render], function(){
			Roles.view.renderForm(Roles.model.defaults(), $q('.front:last'));
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
				Roles.model.save();
				return false;
			}
		});

		//Shortcuts
		$q('body').off("keypress.sn").on("keypress.sn", function(e){
			var k = e.keyCode || e.which;
			if(e.target.tagName == "BODY" && k == '78' && e.shiftKey){
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
				msg : "Are you sure you want to delete this role?",
				onConfirm : function(){
					$el.parents('.card').addClass('deleting');
					Roles.api.del(id);
				}
			});

			return false;
		});

		//Save
		$q('.save').off("click.paths").on("click.paths", function(){
			$q('.saving').removeClass('saving');
			$q(this).parents('.card').addClass('saving');
			Roles.model.save();
			return false;
		});

		//Edit
		$q('.edit').off("click.pathe").on("click.pathe", function(){
			var id = $q(this).parents('li:eq(0)').data('id');
			var $el = $q(this);

			Roles.api.get(function(r){
				Roles.view.renderForm(r, $el);
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
 *  @namespace Roles
 *  @class Roles.api
 *  API REST Services
 */
Roles.api = {

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

		Aero.send(Roles.model.url, data, function(r){
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

		Aero.send(Roles.model.url, data, function(r){
			if(callback) callback(r);
		}, "GET");
	},


	/**
	 *  Create new role
	 *  @param function callback
	 *  @param id
	 */
	create : function(data, callback){

		//Call
		Aero.send(Roles.model.url, data, function(r){
			data.id = r;
			Roles.view.updateCard(data);
			Utils.card.flip($q('.saving form'), true, function(){
				$q('.saving form').remove();
				$q('.saving').removeClass('saving');
				if(callback) callback(r);
			});
		}, "POST");
	},

	/**
	 *  Update role data
	 *  @param string[] data
	 *  @param function callback
	 */
	update : function(data, id, callback){

		data.id = id;

		//Call
		Aero.send(Roles.model.url, data, function(r){
			Roles.view.updateCard(r);
			Utils.card.flip($q('.saving form'), true, function(){
				$q('.saving').removeClass('saving');
				if(callback) callback(r);
			});
		}, "PUT");
	},

	/**
	 *  Delete role
	 *  @param string id
	 */
	del : function(id){

		//Call
		Aero.send(Roles.model.url, { id : id}, function(r){
			Utils.card.remove($q('.deleting'));
		}, "DELETE");
	}
};
