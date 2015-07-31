"use strict";

/**
 * @class Pagedata
 * Start admin namespace
 */
var Pagedata = {

    //Id used for edit
    id : null
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
