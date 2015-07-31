"use strict";

/**
 *  Start the role manager
 */
require([ 'api/roles' ], function() {

    /**
     *  @namespace Roles
     *  @class Roles.view
     *  UX Views and Event Handlers
     */
    Roles.view = {

        /**
         *  Initialize the view
         */
        init : function(){
            Roles.api.get(function(results){
                Roles.view.render(results);
            });
        },

        /**
         *  Render list view
         */
        render : function(roles, callback, noEmpty){
            var $card = null;
            var self = this;

            if(roles.length > 0){
                Aero.tpl.get("roles.html", function(r){

                    //Clear
                    if(!noEmpty) $q('#roles ul').html("");

                    var tpl = _q.template(r);
                    for(var i in roles){
                        $q('#roles ul').append( tpl( { role: roles[i] }));
                    }

                    if(callback) callback();
                    self.setEvents();
                });
            }else{
                //Defaults
                var render = Roles.model.defaults();
                    render.title = "New Role";

                Roles.view.render([render], function(){
                    Roles.view.renderForm(Roles.model.defaults(), $q('.front:last'));
                }, true);
            }
        },

        /**
         *  Render list view
         */
        renderForm : function(role, $el){

            var self = this;
            var $back = $el.parents('.card').find('.back');

            Aero.tpl.get("role-form.html", function(r){

                Roles.id = (role) ? role.id : null;
                if(!role) role = {};

                var tpl = _q.template(r);

                $back.find('.columns').html( tpl( { role: role }));
                Utils.card.flip($el);

                self.setEvents();
            });
        },

        /**
         *  Update card
         */
        updateCard : function(r){

            var $front = $q('.saving');
            var applink = 'role/' + encodeURIComponent(r.title);

            if(r.id) $front.parents('.li:eq(0)').data('id', r.id);
            $front.find('.title').html(r.title);
            $front.find('.description').html(r.description);
            $front.find('.flip-button').attr('href', applink);
        },

        /**
         *  New role card
         */
        newCard : function(){
            //Defaults
            var render = Roles.model.defaults();
                render.title = "New Role";

            Roles.view.render([render], function(){
                Roles.view.renderForm(Roles.model.defaults(), $q('.front:last'));
            }, true);
        },

        /**
         *  Setup all event triggers
         */
        setEvents : function(){
            var self = this;

            //Init cards hover
            Utils.card.setEvents(AeroStep.lang.cardr);

            //Save on enter
            $q('input, textarea').off("keypress.k").on("keypress.k", function(e){
                var k = e.keyCode || e.which;
                if(k == '13'){
                    $q('.saving').removeClass('saving');
                    $q(this).parents('.card').addClass('saving');
                    Roles.model.save();
                    return false;
                }
            });

            //Shortcuts
            $q('body').off("keypress.sn").on("keypress.sn", function(e){
                var k = e.keyCode || e.which;
                if(e.target.tagName == "BODY" && k == '78' && e.shiftKey){
                    self.newCard();
                    return false;
                }
            });

            //New
            $q('.add').off("click.patha").on("click.patha", function(){
                self.newCard();
                return false;
            });

            //Delete
            $q('.delete').off("click.pathd").on("click.pathd", function(){
                var $el = $q(this);
                var id = $el.parents('li:eq(0)').data('id');
                var name = $el.parents('form').find('input:eq(0)').val();

                //Confirm
                Aero.confirm({
                    ok : "delete",
                    title : name,
                    msg : "Are you sure you want to delete this role?",
                    onConfirm : function(){
                        $el.parents('.card').addClass('deleting');
                        Roles.api.del(id);
                    }
                });

                return false;
            });

            //Save
            $q('.save').off("click.paths").on("click.paths", function(){
                $q('.saving').removeClass('saving');
                $q(this).parents('.card').addClass('saving');
                Roles.model.save();
                return false;
            });

            //Edit
            $q('.edit').off("click.pathe").on("click.pathe", function(){
                var id = $q(this).parents('li:eq(0)').data('id');
                var $el = $q(this);

                Roles.api.get(function(r){
                    Roles.view.renderForm(r, $el);
                }, id);
                return false;
            });

            //Cancel
            $q('.cancel').off("click.pathc").on("click.pathc", function(){
                Utils.card.remove($q(this));
                return false;
            });
        }
    };

    //Init
    $q(function(){ Roles.view.init(); });
});
