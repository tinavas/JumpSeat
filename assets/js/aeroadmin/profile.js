"use strict";

/**
 * @class User
 * Start admin namespace
 */
var User = {
	id : $q('.main-title').text()
};


/**
 *  @namespace User
 *  @class User.model
 *  Model for User Object
 */
User.model = {

	url : "api/users",

	validate : function(){
		//Check for required
		var error = [];
		var valid = $q('form').isFormValid();
		var password = $q('input[name="password"]');
		var passwordv = $q('.passwordv').val();

		if(password.val() != "" && $q('.password-verdict').text() == "Weak"){
			valid = false;
			error.push('Password is too weak');
		}

		if(password.val() != passwordv){
			valid = false;
			error.push('Password and Confirm Password don\'t match');
		}

		if(!valid){
			//Already error box?
			if($q('.aero-error-box').length == 0) $q('form').prepend('<div class="aero-error-box"><ul></ul></div>');

			for(var i in error){
				$q('.aero-error-box ul').append('<li>'+error[i]+'</li>');
			}
		}

		return valid;
	},

	save : function(){

		//Get form data
		var data = $q('form').aeroSerialize();

		//Create or update
		if(User.id){
			User.api.update(data, User.id);
		}
	}
};

/**
 *  @namespace User
 *  @class User.view
 *  UX Views and Event Handlers
 */
User.view = {

	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

	    var options = {
	        onKeyUp: function (evt) {
	            $q(evt.target).pwstrength("outputErrorList");
	        }
	    };
	    $q('input[name="password"]').pwstrength(options);

		//Save
		$q('.save').off("click.patha").on("click.patha", function(){
			if(User.model.validate()){
				User.model.save();
			}
			return false;
		});

		//Save
		$q('.cancel').off("click.patha").on("click.patha", function(){
			history.go(-1);
			return false;
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
	 *  Update user data
	 *  @param string[] data
	 *  @param function callback
	 */
	update : function(data, id, callback){

		data.id = User.id

		//Call
		Aero.send(User.model.url, data, function(r){
			Utils.message(AeroStep.lang.success, 'success', 600);
			if(callback) callback(r);
		}, "PUT");
	}
};

$q(function(){
	User.view.setEvents();
});
