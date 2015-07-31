"use strict";

/**
 * @class Pathwaymap
 * Start admin namespace
 */
var Rolemap = {

    //Id used for edit
    roleid : null,
    initialized : false
};

/**
 *  @namespace Rolemap
 *  @class Rolemap.model
 *  Model for Rolemap Object
 */
Rolemap.model = {

    url : "api/rolemap",

    defaults : function(){
        return {
            "title" : "",
            "description" : ""
        }
    },

    save : function(){
        //Get form data
        var data = $q('form').aeroSerialize();
        Rolemap.api.create(data.guideid);
    }
};

/**
 *  @namespace Rolemap
 *  @class Rolemap.api
 *  API REST Services
 */
Rolemap.api = {

    /**
     *  Get all or by id
     *  @param function callback
     *  @param id
     */
    get : function(callback, id){
        //Get by id?
        var data = {};
        data.roleid = Rolemap.roleid;

        Aero.send(Rolemap.model.url + "/by_role", data, function(r){
            if(callback) callback(r);
        }, "GET");
    },

    /**
     *  Get all guides for list
     *  @param function callback
     *  @param id
     */
    getPathways : function(callback){

        if(Rolemap.GUIDES){
            callback(Rolemap.GUIDES);
            return;
        }

        Aero.send("api/guides", {}, function(r){
            Rolemap.GUIDES = r;
            callback();
        }, "GET");
    },


    /**
     *  Update permissions
     *  @param object data
     */
    putPermission : function(data){

        data.id = Rolemap.roleid;
        Aero.send("api/role/permission", data, function(r){
        }, "PUT");
    },


    /**
     *  Create new rolemap
     *  @param function callback
     *  @param id
     */
    create : function(guideid){

        //Testing
        Aero.log('Associating with guideid: ' + guideid, 'info');

        //Call
        var data = {
            "roleid": Rolemap.roleid,
            "guideid" : guideid
        };

        Aero.send(Rolemap.model.url, data, function(r){
            if(r) Rolemap.view.table.ajax.reload();
        }, "POST");
    },

    /**
     *  Delete rolemap
     *  @param string id
     */
    del : function(guideid){

        //Testing
        Aero.log('Deleting with guideid: ' + guideid, 'info');
        var data = {
            "roleid": Rolemap.roleid,
            "guideid" : guideid
        };

        //Call
        Aero.send(Rolemap.model.url, data, function(r){
            Rolemap.view.table.ajax.reload();
        }, "DELETE");
    }
};
