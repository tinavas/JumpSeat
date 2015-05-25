"use strict";

/**
 * @class User
 * Start admin namespace
 */
var User = {

	//Id used for edit
	id : null,

	init : function(){
		$q('#form-wrapper').html("");
		User.view.render();

		//New Menu
		var options = {
				onDelete : function(ids){
					if(ids.length > 0){
						//Confirm
						Aero.confirm({
							ok : "Delete",
							title : "Deleting",
							msg : "You are about to delete <strong>"+ ids.length +"</strong> user(s)</strong>?",
							onConfirm : function(){
								User.api.del(ids);
							}
						});
					}
				},
				onExport : function(ids){
					Utils._export("user", ids);
				},
				onClone : function(ids){
					User.api.clone(ids);
				}
		};
		new Utils.menu("#menu", options);
	}
};


/**
 *  @namespace User
 *  @class User.model
 *  Model for User Object
 */
User.model = {

	url : "api/users",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	},

	validate : function(){

		//Check for required
		var error = [];
		var valid = $q('form').isFormValid();
		var password = $q('input[name="password"]');
		var passwordv = $q('.passwordv');

		if(password.val() != "" && $q('.password-verdict').text() == "Weak"){
			valid = false;
			password.addClass('aero-require-error');
			error.push('Password is too weak');
		}

		if(password.val() != passwordv.val()){
			valid = false;
			passwordv.addClass('aero-require-error');
			error.push('Password and Confirm Password don\'t match');
		}

		if(!valid){
			//Already error box?
			if($q('.aero-error-box').length == 0) $q('form').prepend('<div class="aero-error-box"><ul></ul></div>');

			for(var i in error){
				$q('.aero-error-box ul').append('<li>'+error[i]+'</li>');
			}

			if($q('#panel2-1 .aero-require-error').length == 0) $q('.tabs li:eq(1) a').click();
		}

		return valid;
	},

	save : function(){

		//Get form data
		var data = $q('form').aeroSerialize();
			data.sysadmin = (data.sysadmin) ? true : false;

		//Create or update
		if(User.id){
			User.api.update(data, User.id);
		}else{
			User.api.create(data);
		}
	}
};

/**
 *  @namespace User
 *  @class User.view
 *  UX Views and Event Handlers
 */
User.view = {

	table : null,

	/**
	 *  Render list view
	 */
	render : function(){

		var url = "users/table";
		var columns = [
		       { "width": "3%",  "sClass" : "center" },
		       { "width": "10%" },
		       { "width": "10%" },
		       { "width": "15%" },
		       { "width": "5%" },
		       { "width": "13%" },
		       { "width": "5%", "sClass" : "center"},
		       { "width": "5%", "sClass" : "tright"}
		 ];

		this.table = new Utils.datatable(url, columns);
		this.setEvents();
	},

	/**
	 *  Render list view
	 */
	renderForm : function(user){

		Aero.tpl.get("user-form.html", function(r){

			User.id = (user) ? user.id : null;
			if(!user) user = {};

			//Get load tpl
			var tpl = _q.template(r);

			//Confirm
			Aero.confirm({
				ok : "save",
				title : "User Information",
				msg : tpl( { user: user }),
				onValidate : function(){
					return User.model.validate();
				},
				onConfirm : function(){
					User.model.save();
				}
			});

			$q(document).foundation();

			//PWD Strength
			var options = {
		        onKeyUp: function (evt) {
		            $q(evt.target).pwstrength("outputErrorList");
		        }
		    };
		    $q('input[name="password"]').pwstrength(options);
		});
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function() {

        //Shortcuts
        $q('body').off("keypress.sn").on("keypress.sn", function (e) {
            var k = e.keyCode || e.which;
            if (e.target.tagName == "BODY" && k == '78' && e.shiftKey) User.view.renderForm();
        });

        //Save
        $q('.add').off("click.patha").on("click.patha", function () {
            User.view.renderForm();
            return false;
        });

        //Delete
        $q('body').off("click.pathd").on("click.pathd", ".delete", function () {
            var id = $q(this).parents('div:eq(0)').data('id');
            var name = $q(this).parents('tr').find('td:eq(1)').text();
            //Confirm
            Aero.confirm({
                ok: "Delete",
                title: name,
                msg: "Are you sure you want to delete this?",
                onConfirm: function () {
                    User.api.del(id);
                }
            });
            return false;
        });

        //Edit
        $q('body').off("click.pathe").on("click.pathe", ".edit", function () {
            var id = $q(this).parents('div:eq(0)').data('id');

            User.api.get(function (r) {
                User.view.renderForm(r);
            }, id);
            return false;
        });

        //Disable password if email user is selected and vice versa
        $q('body').on('change', '#emailuser', function () {
            var self = this;
            $q('input[type=password]').each(function () {
                if ($q(self).is(':checked')) {
                    $q(this).prop('disabled', true);
                } else {
                    $q(this).prop('disabled', false);
                }
            });
        });
    }
};


/**
 *  @namespace User
 *  @class User.api
 *  API REST Services
 */
User.api = {

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback, id){
		//Get by id?
		var data = {};
		if(id) data = { id : id };

		Aero.send(User.model.url, data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Create new user
	 *  @param function callback
	 *  @param id
	 */
	create : function(data){
		//Call
		Aero.send(User.model.url, data, function(){
			User.view.table.ajax.reload();
		}, "POST");
	},


	/**
	 *  Clone
	 *  @param function callback
	 *  @param id
	 */
	clone : function(id){
		//Call
		Aero.send(User.model.url + "/clone", { id : id }, function(){
			User.view.table.ajax.reload();
		}, "POST");
	},

	/**
	 *  Update user data
	 *  @param string[] data
	 *  @param function callback
	 */
	update : function(data, id, callback){

		data.id = id;

		//Call
		Aero.send(User.model.url, data, function(r){
			User.view.table.ajax.reload();
			if(callback) callback(r);
		}, "PUT");
	},

	/**
	 *  Delete user
	 *  @param string id
	 */
	del : function(id){
		//Call
		Aero.send(User.model.url, { id : id}, function(){
			User.view.table.ajax.reload();
		}, "DELETE");
	}
};

$q(function(){
	User.init();

	//Chrome cache issue
	setTimeout(function () {
		//New Import
		new Utils._import("#import", { uploader : '/api/import_user', width:177 }, function(){
			User.view.table.ajax.reload();
		});
	}, 0);
});
