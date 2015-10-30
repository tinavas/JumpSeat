"use strict";

/**
 * @class App
 * Start admin namespace
 */
var App = {

    //Id used for edit
    id: null
};


/**
 *  @namespace App
 *  @class App.model
 *  Model for App Object
 */
App.model = {

    url: "api/apps",

    defaults: function () {
        return {
            title: "",
            description: "",
            active: true
        }
    },

    validate: function () {

        //Check for required
        var valid = $q('.saving form').isFormValid();
        var $host = $q('.saving input[name="host"]');

        //Validate URL

        var regex = new RegExp(
            "^" +
                // protocol identifier
            "(?:(?:https?|ftp)://)" +
                // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
                // IP address exclusion
                // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broacast addresses
                // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
                // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                // TLD identifier (Commented line below so it allows hostnames without a domain)
            //"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                // TLD may end with dot
            "\\.?" +
            ")" +
                // port number
            "(?::\\d{2,5})?" +
                // resource path
            "(?:[/?#]\\S*)?" +
            "$", "i"
        );

        var validUrl = regex.test($host.val());

        if ($host.val() != IAPP && !validUrl) {
            valid = false;
            $host.addClass('aero-require-error');
        }

        return valid;
    },

    save: function ($el) {

        var $form = $el.parents('.card').find('form');
        //Get form data
        var data = $form.aeroSerialize();
        data.active = (data.active) ? true : false;
        data.aliases = [];

        //Remove trailing slash
        data.host = data.host.replace(/\/$/, '');

        $q('.alias-input').each(function () {
            var alias = $q(this).val();
            if (alias) {
                alias = alias.replace(/\/$/, '');
                data.aliases.push(alias);
            }
        });

        //Create or update
        if (App.model.validate()) {
            if (App.id) {
                App.api.update(data, App.id);
            } else {
                App.api.create(data);
            }
        }
    }
};


/**
 *  @namespace App
 *  @class App.api
 *  API REST Services
 */
App.api = {

    /**
     *  Get all or by id
     *  @param function callback
     *  @param id
     */
    get: function (callback, id) {
        //Get by id?
        var data = {};
        if (id) data = {id: id};

        Aero.send(App.model.url, data, function (r) {
            if (callback) callback(r);
        }, "GET");
    },

    /**
     *  Create new app
     *  @param function callback
     *  @param id
     */
    create: function (data, callback) {

        //Call
        Aero.send(App.model.url, data, function (r) {

            if (r) {
                data.id = r;
                App.view.updateCard(data);
                Utils.card.flip($q('.saving form'), true, function () {
                    $q('.saving form').remove();
                    $q('.saving').removeClass('saving');
                    if (callback) callback(r);
                });
            } else {
                App.view.renderIssue();
            }

        }, "POST");
    },

    /**
     *  Update app data
     *  @param string[] data
     *  @param function callback
     */
    update: function (data, id, callback) {

        data.id = id;

        //Call
        Aero.send(App.model.url, data, function (r) {

            if (r) {
                App.view.updateCard(r);
                Utils.card.flip($q('.saving form'), true, function () {
                    $q('.saving').removeClass('saving');
                    if (callback) callback(r);
                });
            } else {
                App.view.renderIssue();
            }

        }, "PUT");
    },

    /**
     *  Delete app
     *  @param string id
     */
    del: function (id) {
        //Call
        Aero.send(App.model.url, {id: id}, function (r) {
            Utils.card.remove($q('.deleting'));
        }, "DELETE");
    }
};

