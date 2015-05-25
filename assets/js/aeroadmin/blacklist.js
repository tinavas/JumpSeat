"use strict";

/**
 * @class Blacklist
 * Start admin namespace
 */
var Blacklist = {

	//Id used for edit
	id : null,

	init : function(){
		$q('#form-wrapper').html("");
		Blacklist.view.render();

		var options = {
				onDelete : function(ids){
					if(ids.length > 0){
						//Confirm
						Aero.confirm({
							ok : "Delete",
							title : "Deleting URLs",
							msg : "You are about to delete " + ids.length + " items. Are you sure?",
							onConfirm : function(){
								Blacklist.api.del(ids);
							}
						});
					}
				}
		};
		new Utils.menu("#menu", options);
	}
};


/**
 *  @namespace Blacklist
 *  @class Blacklist.model
 *  Model for Blacklist Object
 */
Blacklist.model = {

	url : "api/blacklist",

	defaults : function(){
		return {
			"url" : "",
			"description" : "",
			"active" : true,
			"globPrefix" : false,
			"globSuffix" : false
		}
	},

	validate : function(){
		//Check for required
		var valid = $q('form').isFormValid();
		return valid;
	},

	save : function(){

		//Get form data
		var data = $q('form').aeroSerialize();
		data.active = (data.active) ? true : false;

		//Still need to make booleans false to save properly
		if (!data.globPrefix) data.globPrefix = false;
		if (!data.globSuffix) data.globSuffix = false;

		//Create or update
		if(Blacklist.model.validate()){
			if(Blacklist.id){
				Blacklist.api.update(data, Blacklist.id);
			}else{
				Blacklist.api.create(data);
			}
		}
	}
};

/**
 *  @namespace Blacklist
 *  @class Blacklist.view
 *  UX Views and Event Handlers
 */
Blacklist.view = {

	table : null,

	/**
	 *  Render list view
	 */
	render : function(){

		var url = "blacklist/table";
		var columns = [
		            { "width": "5%",  "sClass" : "center" },
		            { "width": "40%" },
		            { "width": "35%" },
		            { "width": "10%",  "sClass" : "center"},
		            { "width": "10%",  "sClass" : "center"},
		            { "width": "10%", "sClass" : "tright"}
         ];

		this.table = new Utils.datatable(url, columns);
		this.setEvents();
	},

	/**
	 *  Render list view
	 */
	renderForm : function(blacklist){

		var self = this;
		Aero.tpl.get("blacklist-form.html", function(r){

			Blacklist.id = (blacklist) ? blacklist.id : null;
			if(!blacklist) blacklist = {};
			var tpl = _q.template(r);
			//Confirm
			Aero.confirm({
				ok : "save",
				title : "URL information",
				msg : tpl( { blacklist: blacklist }),
				onValidate : function(){
					return Blacklist.model.validate();
				},
				onConfirm : function(){
					Blacklist.model.save();
				}
			});
		});
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

		//Shortcuts
		$q('body').off("keypress.sn").on("keypress.sn", function(e){
			var k = e.keyCode || e.which;
			if(e.target.tagName == "BODY" && k == '78' && e.shiftKey) Blacklist.view.renderForm();
		});

		//Save
		$q('.add').off("click.patha").on("click.patha", function(){
			Blacklist.view.renderForm();
			return false;
		});

		//Delete
		$q('body').off("click.pathd").on("click.pathd", ".delete", function(){
			var id = $q(this).parents('div:eq(0)').data('id');
			var name  = $q(this).parents('tr:eq(0)').find('td:eq(1)').text();
			//Confirm
			Aero.confirm({
				ok : "delete",
				title : name,
				msg : "Are you sure you want to delete this item?",
				onConfirm : function(){
					Blacklist.api.del(id);
				}
			});
			return false;
		});

		//Edit
		$q('body').off("click.pathe").on("click.pathe", ".edit", function(){
			var id = $q(this).parents('div:eq(0)').data('id');

			Blacklist.api.get(function(r){
				Blacklist.view.renderForm(r);
			}, id);
			return false;
		});
	}
};


/**
 *  @namespace Blacklist
 *  @class Blacklist.api
 *  API REST Services
 */
Blacklist.api = {

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback, id){
		//Get by id?
		var data = {};
		if(id) data = { id : id };

		Aero.send(Blacklist.model.url, data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Create new blacklist
	 *  @param function callback
	 *  @param id
	 */
	create : function(data){
		//Call
		Aero.send(Blacklist.model.url, data, function(r){
			Blacklist.view.table.ajax.reload();
		}, "POST");
	},

	/**
	 *  Update blacklist data
	 *  @param string[] data
	 *  @param function callback
	 */
	update : function(data, id, callback){

		data.id = id;

		//Call
		Aero.send(Blacklist.model.url, data, function(r){
			Blacklist.view.table.ajax.reload();
			if(callback) callback(r);
		}, "PUT");
	},

	/**
	 *  Delete blacklist
	 *  @param string id
	 */
	del : function(id){
		//Call
		Aero.send(Blacklist.model.url, { id : id}, function(r){
			Blacklist.view.table.ajax.reload();
		}, "DELETE");
	}
};

$q(function(){
	Blacklist.init();
});
