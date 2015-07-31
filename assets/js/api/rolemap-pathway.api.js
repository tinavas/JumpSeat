"use strict";

/**
 * @class Pathwaymap
 * Start admin namespace
 */
var Rolepath = {

    //Id used for edit
    roleid : null
};


/**
 *  @namespace Rolepath
 *  @class Rolepath.model
 *  Model for Rolepath Object
 */
Rolepath.model = {

    url : "api/pathwayrolemap",

    defaults : function(){
        return {
            "title" : "",
            "description" : ""
        }
    },

    save : function(){
        //Get form data
        var data = $q('form').aeroSerialize();
        Rolepath.api.create(data.pathwayid);
    }
};


/**
 *  @namespace Rolepath
 *  @class Rolepath.api
 *  API REST Services
 */
Rolepath.api = {

    /**
     *  Get all pathways for list
     *  @param function callback
     *  @param id
     */
    getPathways : function(callback){

        if(Rolepath.PATHWAYS){
            callback(Rolepath.PATHWAYS);
            return;
        }

        Aero.send("api/pathway", {}, function(r){
            Rolepath.PATHWAYS = r;
            callback();
        }, "GET");
    },

    /**
     *  Create new rolepath
     *  @param function callback
     *  @param id
     */
    create : function(pathwayid){
        //Call
        var data = {
            "roleid": Rolemap.roleid,
            "pathwayid" : pathwayid
        };

        Aero.send(Rolepath.model.url, data, function(r){
            Rolepath.view.table.ajax.reload();
            $q('.form-wrapper').html("");
        }, "POST");
    },

    /**
     *  Delete rolepath
     *  @param string id
     */
    del : function(pathwayid){

        //Testing
        Aero.log('Deleting with guideid: ' + pathwayid, 'info');
        var data = {
            "roleid": Rolemap.roleid,
            "pathwayid" : pathwayid
        };

        //Call
        Aero.send(Rolepath.model.url, data, function(r){
            Rolepath.view.table.ajax.reload();
            $q('.form-wrapper').html("");
        }, "DELETE");
    }
};
