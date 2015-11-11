"use strict";

/**
 * @class Pathwaymap
 * Start admin namespace
 */
var RoleUserMap = {

    //Id used for edit
    roleid : null,
    initialized : false
};


/**
 *  @namespace RoleUserMap
 *  @class RoleUserMap.model
 *  Model for RoleUserMap Object
 */
RoleUserMap.model = {

    url : "api/roleusermap",

    defaults : function(){
        return {
            "title" : "",
            "description" : ""
        }
    },

    save : function(){
        //Get form data
        var data = $q('form').aeroSerialize();
        RoleUserMap.api.create(data.userid);
    }
};


/**
 *  @namespace RoleUserMap
 *  @class RoleUserMap.api
 *  API REST Services
 */
RoleUserMap.api = {

    /**
     *  Get all or by id
     *  @param function callback
     *  @param id
     */
    get : function(callback, id){
        //Get by id?
        var data = {};
        data.roleid = Rolemap.roleid;

        Aero.send(RoleUserMap.model.url + "/by_role", data, function(r){
            if(callback) callback(r);
        }, "GET");
    },

    /**
     *  Get all users for list
     *  @param function callback
     *  @param id
     */
    getUsers : function(callback){

        if(RoleUserMap.USERS){
            callback(RoleUserMap.USERS);
            return;
        }

        Aero.send("api/users", { select : ['email', 'firstname', 'lastname' ]}, function(r){
            RoleUserMap.USERS = r;
            callback();
        }, "GET");
    },

    /**
     *  Create new roleusermap
     *  @param function callback
     *  @param id
     */
    create : function(userid){

        //Testing
        Aero.log('Associating with userid: ' + userid, 'info');

        //Call
        var data = {
            "roleid": Rolemap.roleid,
            "userid" : userid
        };

        Aero.send(RoleUserMap.model.url, data, function(r){
            if(r) RoleUserMap.view.table.ajax.reload();
        }, "POST");
    },

    /**
     *  Delete roleusermap
     *  @param string id
     */
    del : function(userid){

        //Testing
        Aero.log('Deleting with userid: ' + userid, 'info');
        var data = {
            "roleid": Rolemap.roleid,
            "userid" : userid
        };

        //Call
        Aero.send(RoleUserMap.model.url, data, function(r){
            RoleUserMap.view.table.ajax.reload();
        }, "DELETE");
    }
};
