"use strict";

/**
 * @class Pathway
 * Start admin namespace Pathway.init
 */
var Pathway = {

    //Id used for edit
    id: null
};


/**
 *  @namespace Pathway
 *  @class Pathway.model
 *  Model for Pathway Object
 */
Pathway.model = {

    url: "api/pathway",

    defaults: function () {
        return {
            "title": "",
            "description": ""
        }
    },

    validate: function () {
        //Check for required
        var valid = $q('form').isFormValid();

        return valid;
    },

    save: function () {
        //Get form data
        var data = $q('.saving form').aeroSerialize();

        //Create or update
        if (Pathway.model.validate()) {
            if (Pathway.id) {
                Pathway.api.update(data, Pathway.id);
            } else {
                Pathway.api.create(data);
            }
        }
    }
};

/**
 *  @namespace Pathway
 *  @class Pathway.api
 *  API REST Services
 */
Pathway.api = {

    /**
     *  Get all or by id
     *  @param function callback
     *  @param id
     */
    get: function (callback, id) {
        //Get by id?
        var data = {};
        data.count = true;
        if (id)
            data.id = id;

        Aero.send(Pathway.model.url, data, function (r) {
            if (callback) callback(r);
        }, "GET");
    },

    /**
     *  Get all or by id
     *  @param function callback
     *  @param id
     */
    getByTitle: function (title, callback) {
        //Get by id?
        var data = {};
        data.title = title;

        Aero.send(Pathway.model.url, data, function (r) {
            if (callback) callback(r);
        }, "GET");
    },


    /**
     *  Create new pathway
     *  @param function callback
     *  @param id
     */
    create: function (data, callback) {

        //Call
        Aero.send(Pathway.model.url, data, function (r) {
            data.id = r;

            Pathway.view.updateCard(data);
            Utils.card.flip($q('.saving form'), true, function () {
                $q('.saving form').remove();
                $q('.saving').removeClass('saving');
                if (callback) callback(r);
            });
        }, "POST");
    },

    /**
     *  Update pathway data
     *  @param string[] data
     *  @param function callback
     */
    update: function (data, id, callback) {

        data.id = id;

        //Call
        Aero.send(Pathway.model.url, data, function (r) {

            Pathway.view.updateCard(r);
            Utils.card.flip($q('.saving form'), true, function () {
                $q('.saving').removeClass('saving');
                if (callback) callback(r);
            });
        }, "PUT");
    },

    /**
     *  Delete pathway
     *  @param string id
     */
    del: function (id) {

        //Call
        Aero.send(Pathway.model.url, {id: id}, function (r) {
            Utils.card.remove($q('.deleting'));
        }, "DELETE");
    }
};
