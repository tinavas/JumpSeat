"use strict";

/**
 * @class Pathwaymap
 * Start admin namespace
 */
var Pathwaymap = {

	//Id used for edit
	pathwayid : null,

	init : function(){
		$q('#guides .form-wrapper').html("");
		Pathwaymap.api.get(function(results){
			Pathwaymap.view.render(results);
		});
	}
};


/**
 *  @namespace Pathwaymap
 *  @class Pathwaymap.model
 *  Model for Pathwaymap Object
 */
Pathwaymap.model = {

	url : "api/pathwaymap",

	defaults : function(){
		return {
			"title" : "",
			"description" : ""
		}
	},

	save : function(){
		//Get form data
		var data = $q('.aero-modal form').aeroSerialize();
		Pathwaymap.api.create(data.guideid);
	}
};

/**
 *  @namespace Pathwaymap
 *  @class Pathwaymap.view
 *  UX Views and Event Handlers
 */
Pathwaymap.view = {

	/**
	 *  Render list view
	 */
	render : function(pathwaymaps){

		var self = this;
		Aero.tpl.get("pathwaymaps.html", function(r){

			//Clear
			$q('#pathwaymaps').html("");

			var tpl = _q.template(r);
			$q('#pathwaymaps').append( tpl( { pathwaymaps: pathwaymaps }));

			self.setEvents();
		});
	},

	/**
	 *  Render list view
	 */
	renderForm : function(){

		var self = this;
		Aero.tpl.get("pathwaymap-form.html", function(r){
			Pathwaymap.api.getGuides(function(){

				var tpl = _q.template(r);
				Aero.confirm({
					title : "Add guide",
					msg : tpl( { guides: Pathwaymap.GUIDES }),
					onConfirm : function(){
						Pathwaymap.model.save();
					}
				});
			});
		});
	},


	/**
	 *  Setup all event triggers
	 */
	setEvents : function(){

		//See Modal for Save and Cancel
        //Shortcuts
        $q('body').off("keypress.sn").on("keypress.sn", function(e){
            var k = e.keyCode || e.which;
            if(e.target.tagName == "BODY" && k == '78' && e.shiftKey) Pathwaymap.view.renderForm();
        });

		//Sortable indexing
		if(!$q('#pathwaymaps ul').hasClass()){
			$q('#pathwaymaps ul').sortable({
				distance: 10,
				forcePlaceholderSize: true,
				placeholder: {
			        element: function() {
			            return $q("<li class='helper-card-droppable columns large-offset-4 large-4'><div></div></li>");
			        },
			        update: function() {
			            return;
			        }
			    },
				items: "li:not(.ui-state-disabled)",
				update: function( event, ui ) {
					Pathwaymap.api.updateIndex();
				}
			});
		}

		//Add
		$q('#guides .add').off("click.ag").on("click.ag", function(){
			Pathwaymap.view.renderForm();
			return false;
		});

		//Delete
		$q('#guides .delete').off("click.pathd").on("click.pathd", function(){
			var id = $q(this).parents('li:eq(0)').data('id');

			//Confirm
			Aero.confirm({
				title : "Unlink Guide",
				msg : "Are you sure you want to remove this guide from the pathway?",
				onConfirm : function(){
					Pathwaymap.api.del(id);
				}
			});
			return false;
		});
	}
};


/**
 *  @namespace Pathwaymap
 *  @class Pathwaymap.api
 *  API REST Services
 */
Pathwaymap.api = {

	/**
	 *  Get all or by id
	 *  @param function callback
	 *  @param id
	 */
	get : function(callback, id){
		//Get by id?
		var data = {};
			data.pathwayid = Pathwaymap.pathwayid;
			data.guideData = ['title', 'step'];

		Aero.send(Pathwaymap.model.url + "/by_pathway", data, function(r){
			if(callback) callback(r);
		}, "GET");
	},

	/**
	 *  Get all guides for list
	 *  @param function callback
	 *  @param id
	 */
	getGuides : function(callback){

		if(Pathwaymap.GUIDES){
			callback(Pathwaymap.GUIDES);
			return;
		}

		Aero.send("api/guides", {}, function(r){
			Pathwaymap.GUIDES = r;
			callback();
		}, "GET");
	},


	/**
	 *  Create new pathwaymap
	 *  @param function callback
	 *  @param id
	 */
	create : function(guideid){

		//Testing
		Aero.log('Associating with guideid: ' + guideid, 'info');

		//Call
		var data = {
			"pathwayid": Pathwaymap.pathwayid,
			"guideid" : guideid
		};

		Aero.send(Pathwaymap.model.url, data, function(r){
			if(r){
				Pathwaymap.init();
			}else{
				Utils.message("That guide is already in this pathway", "warn");
			}
		}, "POST");
	},


	/**
	 *  Update indexes
	 */
	updateIndex : function(){
		var data = {};
			data.guides = {};
			data.pathwayid = Pathwaymap.pathwayid;
		var $li = $q('#pathwaymaps li');

		$li.each(function(){
			 if($q(this).data('id')){
				 data.guides[$q(this).data('id')] = $li.index($q(this));
			 }
		});

		//Call
		Aero.send(Pathwaymap.model.url + "/indexes", data, function(r){
			Pathwaymap.init();
		}, "PUT");
	},

	/**
	 *  Delete pathwaymap
	 *  @param string id
	 */
	del : function(guideid){

		Aero.log('Deleting with guideid: ' + guideid, 'info');
		var data = {
			"pathwayid": Pathwaymap.pathwayid,
			"guideid" : guideid
		};

		//Call
		Aero.send(Pathwaymap.model.url, data, function(r){
			Pathwaymap.init();
		}, "DELETE");
	}
};

$q(function(){
	//Start the UX
	Pathway.api.getByTitle(decodeURIComponent($q('#pathwaytitle').data('title')), function(r){
		$q('.description').html(r.description);
		Pathwaymap.pathwayid = r.id;
		Pathwaymap.init();
	});
});
