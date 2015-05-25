"use strict";

/**
 * @class Pagedata
 * Start admin namespace
 */
var Pagedata = {

	//Id used for edit
	id : null,

	init : function(){

		$q('#form-wrapper').html("");
		Pagedata.view.render();
		Pagedata.view.renderBasic();

		//New Menu
		var options = {
				onDelete : function(ids){
					if(ids.length > 0){
						//Confirm
						Aero.confirm({
							ok : "delete",
							title : "Deleting items",
							msg : "Your about to delete " + ids.length + " items. Are you sure?",
							onConfirm : function(){
								Pagedata.api.del(ids);
							}
						});
					}
				},
				onExport : function(ids){
					Utils._export("pagedata", ids);
				}
		};
		new Utils.menu("#menu", options);
	}
};


/**
 *  @namespace Pagedata
 *  @class Pagedata.model
 *  Model for Pagedata Object
 */
Pagedata.model = {

	url : "api/pagedata",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	},

	saveConfig : function(){
		var data = [];
		var datas = {};

		$q('#config .item').each(function(){
			var $id = $q(this).find('input[type=hidden]');

			if($id.length){
				var s = {
					id: $id.val(),
					type: 'js',
					prop: $q(this).find('textarea').attr('class'),
					value: $q(this).find('textarea').val()
				}
				data.push(s);
			}
		});

		datas.data = data;
		Pagedata.api.updateBasic(datas);
	},

	validate : function(){
		//Check for required
		var valid = $q('form').isFormValid();

		return valid;
	},

	save : function(){

		//Get form data
		var data = $q('form').aeroSerialize();

		//Create or update
		if(Pagedata.model.validate()){
			if(Pagedata.id){
				Pagedata.api.update(data, Pagedata.id);
			}else{
				Pagedata.api.create(data);
			}
		}
	}
};

/**
 *  @namespace Pagedata
 *  @class Pagedata.view
 *  UX Views and Event Handlers
 */
Pagedata.view = {

	table : null,

	/**
	 *  Render list view
	 */
	render : function(){

		var url = "pagedata/table";
		var columns = [
		            { "width": "5%",  "sClass" : "center" },
		            { "width": "30%" },
		            { "width": "50%" },
		            { "width": "5%",  "sClass" : "center"},
		            { "width": "10%", "sClass" : "tright"}
         ];

		this.table = new Utils.datatable(url, columns);
		this.setEvents();
	},

	/**
	 *  Render basic form data
	 */
	renderBasic : function(){

		//Get Basic info
		Pagedata.api.getBasic(function(r){

			//Render
			for(var i in r){
				if(r[i].prop == "username"){
				 	$q('.username').val(r[i].value); $q('#usernameid').val(r[i].id);
				}else if(r[i].prop == "roles"){
					$q('.roles').val(r[i].value); $q('#roleid').val(r[i].id);
				}else if(r[i].prop == "require"){
					$q('.require').val(r[i].value); $q('#requireid').val(r[i].id);
                }else if(r[i].prop == "fire"){
                    $q('.fire').val(r[i].value); $q('#fireid').val(r[i].id);
                }
			}
		});
	},

	/**
	 *  Render list view
	 */
	renderForm : function(pagedata){

		Aero.tpl.get("pagedata-form.html", function(r){

			Pagedata.id = (pagedata) ? pagedata.id : null;
			if(!pagedata) pagedata = {};
			var tpl = _q.template(r);

			//Confirm
			Aero.confirm({
				ok : "save",
				title : "URL information",
				msg : tpl( { pagedata: pagedata }),
				onValidate : function(){
					return Pagedata.model.validate();
				},
				onConfirm : function(){
					Pagedata.model.save();
				}
			});
		});
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

		//Save on enter
		$q('#form-wrapper').off("keypress.key").on("keypress.key", function(e){
			var k = e.keyCode || e.which;
			if(k == '13') Pagedata.model.save();
		});

		//Shortcuts
		$q('body').off("keypress.sn").on("keypress.sn", function(e){
			var k = e.keyCode || e.which;
			if(e.target.tagName == "BODY" && k == '78' && e.shiftKey) Pagedata.view.renderForm();
		});

		//Add
		$q('.add').off("click.patha").on("click.patha", function(){
			Pagedata.view.renderForm();
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
				msg : "Are you sure you want to delete this?",
				onConfirm : function(){
					Pagedata.api.del(id);
				}
			});
			return false;
		});

		//Save
		$q('.save').off("click.paths").on("click.paths", function(){
			Pagedata.model.save();
			return false;
		});

		//Save
		$q('.save-config').off("click.cpaths").on("click.cpaths", function(){
			Pagedata.model.saveConfig();
			return false;
		});

		//Edit
		$q('body').off("click.pathe").on("click.pathe", ".edit", function(){
			var id = $q(this).parents('div:eq(0)').data('id');

			Pagedata.api.get(function(r){
				Pagedata.view.renderForm(r);
			}, id);

			return false;
		});

		//Cancel
		$q('.cancel').off("click.pathc").on("click.pathc", function(){
			$q('#form-wrapper').html("");
			return false;
		});
	}
};


/**
 *  @namespace Pagedata
 *  @class Pagedata.api
 *  API REST Services
 */
Pagedata.api = {

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback, id){
		//Get by id?
		var data = {};
		if(id) data = { id : id };

		Aero.send(Pagedata.model.url, data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	getBasic : function(callback){
		Aero.send(Pagedata.model.url + "/basic", {}, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Create new pagedata
	 *  @param function callback
	 *  @param id
	 */
	create : function(data){
		//Call
		Aero.send(Pagedata.model.url, data, function(){
			Pagedata.view.table.ajax.reload();
			$q('#form-wrapper').html("");
		}, "POST");
	},

	/**
	 *  Update pagedata data
	 *  @param string[] data
	 *  @param function callback
	 */
	update : function(data, id, callback){
		data.id = id;

		//Call
		Aero.send(Pagedata.model.url, data, function(r){
			Pagedata.view.table.ajax.reload();
			$q('#form-wrapper').html("");
            Utils.message(AeroStep.lang.success, 'success', 600);
			if(callback) callback(r);
		}, "PUT");
	},


	/**
	 *  Update pagedata data
	 *  @param string[] data
	 *  @param function callback
	 */
	updateBasic : function(data, callback){
		//Call
		Aero.send(Pagedata.model.url, data, function(r){
			Pagedata.view.table.ajax.reload();
			$q('#form-wrapper').html("");
            Utils.message(AeroStep.lang.success, 'success', 600);
			if(callback) callback(r);
		}, "PUT");
	},

	/**
	 *  Delete pagedata
	 *  @param string id
	 */
	del : function(id){
		//Call
		Aero.send(Pagedata.model.url, { id : id }, function(){
			Pagedata.view.table.ajax.reload();
			$q('#form-wrapper').html("");
		}, "DELETE");
	}
};

$q(function(){
	Pagedata.init();

	//Chrome cache issue
	setTimeout(function () {
		//New import
		new Utils._import("#import", { uploader : '/api/import_pagedata', width:170, height:42 }, function(){
			Pagedata.view.table.ajax.reload();
		});
	}, 0);
});
