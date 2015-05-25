/**
 *  @class Step object
 *  @author Mike Priest
 */
"use strict";

/**
 *  Model definition
 */
Aero.model.pathway = {

	/**
	 *  Services URL
	 */
	url : "api/pathway"
};

/**
 *  View definition
 */
Aero.view.pathway = {

	/**
	 *  Render steps in the menu list
	 */
	render : function(pathways, index){

		try {
			var title = pathways[index].title;
			var id = pathways[index].id;

			//Render pathway guides
			if(index == 0){
				Aero.guide.getAll(function(guides){
					Aero.view.guide.render(guides);
				});
			}else{
				Aero.pathway.getGuides(id, function(guides){
					guides[0].path = title;
					guides[0].pathid = id;
					Aero.view.guide.render(guides);
				});
			}

			localStorage.setItem("aero:pathway", index);
			localStorage.setItem("aero:pathway:name", title);

			return true;
		} catch(err){
			return false;
		}
	},


	/**
	 *  Set event handlers
	 */
	setEvents : function(){
		var self = this;

		$q('body').off('click.aeropath').on('click.aeropath', '.aero-carousel a:not(".aero-share")', function(){

			var isPrev = $q(this).hasClass('aero-left');
			Aero.pathway.get(function(r){

				var id = null;
				var ls = localStorage.getItem("aero:pathway");
				var size = r.length - 1;
				var index = ls ? ls : 0;

				//Navigate
				if(isPrev) index--; else index++;
				if(index < 0) index = size;
				if(index > size) index = 0;

				self.render(r, index);
			});
			return false;
		});
	}
};

/**
 *  View definition
 */
Aero.pathway = {

	/**
	 *  Initialize
	 */
	init: function(){
		Aero.view.pathway.setEvents();
	},

	/**
	 *  Get pathways
	 */
	get : function(callback, id){

		//Cache
		if(Aero.constants.PATHWAYS){
			callback(Aero.constants.PATHWAYS);
			return;
		}

		var data = {};
			data.dropEmpty = true;
			data.count = true;
			data.select = ['title'];
		if(id) data = { id : id };

		Aero.send(Aero.model.pathway.url, data, function(r){
			r.unshift({ 'title': AeroStep.lang.allguides });

			Aero.constants.PATHWAYS = r;
			if(callback) callback(r);
		}, "GET");
	},


	/**
	 *  Get guides for pathway
	 */
	getGuides : function(pathwayid, callback){

		//Setup once
		if(!Aero.constants.pathway) Aero.constants.pathway = {};

		//Already exists
		if(Aero.constants.pathway && Aero.constants.pathway[pathwayid]){
			callback(Aero.constants.pathway[pathwayid]);
			return;
		}

		//Call server
		Aero.send("api/pathwaymap/by_pathway", { active : true, pathwayid : pathwayid }, function(r){
			Aero.constants.pathway[pathwayid] = r;
			if(callback) callback(r);
		}, "GET");
	}
};

Aero.pathway.init();
