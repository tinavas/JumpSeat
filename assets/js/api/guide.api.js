"use strict";

/**
 * @class Guide
 * Start admin namespace
 */
var Guide = {

    //Id used for edit
    id : null
};


/**
 *  @namespace Guide
 *  @class Guide.model
 *  Model for Guide Object
 */
Guide.model = {

    url : "api/guides",

    defaults : function(){
        return {
            "title" : "",
            "description" : ""
        }
    },

    validate : function(){
        //Check for required
        return $q('form').isFormValid();
    },

    save : function(){

        //Get form data
        var data = $q('form').aeroSerialize();
            data.active = (data.active) ? true : false;

        //Create or update
        if(Guide.id){
            Guide.api.update(data, Guide.id);
        }else{
            Guide.api.create(data);
        }
    },

    replaceProp : function(ids, preview){

        var data = $q('form').aeroSerialize();
            data.case = (data.case) ? true : false;
            data.preview = preview ? true : false;

        Guide.api.replaceProp(ids, data, function(r){
            console.log(r);
        });
    }
};


/**
 *  @namespace Guide
 *  @class Guide.api
 *  API REST Services
 */
Guide.api = {

    /**
     *  Get all or by id
     *  @param function callback
     *  @param id
     */
    get : function(callback, id){
        //Get by id?
        var data = {};
        if(id) data = { id : id };

        Aero.send(Guide.model.url, data, function(r){
            if(callback) callback(r);
        }, "GET");
    },

    /**
     *  Create new guide
     *  @param function callback
     *  @param id
     */
    create : function(data){
        //Call
        Aero.send(Guide.model.url, data, function(){
            Guide.view.table.ajax.reload();
        }, "POST");
    },


    /**
     *  Clone
     *  @param function callback
     *  @param id
     */
    clone : function(id){
        //Call
        Aero.send(Guide.model.url + "/clone", { id : id }, function(){
            Guide.view.table.ajax.reload();
        }, "POST");
    },

    /**
     *  Update guide data
     *  @param string[] data
     *  @param function callback
     */
    update : function(data, id, callback){

        data.id = id;

        //Call
        Aero.send(Guide.model.url, data, function(r){
            Guide.view.table.ajax.reload();
            if(callback) callback(r);
        }, "PUT");
    },

    /**
     *  Find and Replace Properties
     *  @param string[] data
     *  @param function callback
     */
    replaceProp : function(id, data, callback){

        data.id = id;

        //Call
        Aero.send(Guide.model.url + "/replace", data, function(r){
            if(callback) callback(r);
        }, "PUT");
    },

    /**
     *  Delete guide
     *  @param string id
     */
    del : function(id){
        //Call
        Aero.send(Guide.model.url, { id : id}, function(){
            Guide.view.table.ajax.reload();
        }, "DELETE");
    }
};
