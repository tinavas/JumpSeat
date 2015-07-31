"use strict";

/**
 * @class Roles
 * Start admin namespace
 */
var Roles = {

    //Id used for edit
    id : null
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
