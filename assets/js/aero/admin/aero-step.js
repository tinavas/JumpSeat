"use strict";

/**
 * Admin View for Steps
 * @author Mike Priest
 * @type {{addNav: Function, destroyNav: Function, save: Function, initPicker: Function, renderSortable: Function, setEvents: Function}}
 */
Aero.view.step.admin = {

    /**
     *  Delete nav item
     */
    addNav : function(){
        $q('.aero-nav-item:first').clone().append('<a class="aero-del-nav">X</a>').insertAfter('.aero-nav-item:last');
    },

    /**
     *  Delete nav item
     */
    destroyNav : function($this){
        if($q('.aero-nav-item'))
            $this.parents('.aero-nav-item').remove();
    },

    /**
     *  Save step data
     */
    save : function(){
        var index = parseInt($q('.aero-step-index').val());
        var data = $q('#editStepFrm').aeroSerialize();
        data.id = Aero.view.admin.guideid;
        data.body = $q('#aeroEditor').trumbowyg('html');
        data.nav = {};
        data.branch = $q('#aeroBranch').val() != "" ? $q('#aeroBranch').val() : null;

        if(Aero.host != location.protocol+'//'+window.location.host) data.cds = location.protocol+'//'+window.location.host;

        //Check for custom size and move into size prop
        if(data.size_custom != "" && !isNaN(data.size_custom + "")){
            data.size = data.size_custom + '';
        }
        //Not an actual prop
        delete data.size_custom;

        //Collect Quiz Data
        var quizData = Aero.view.step.admin.quiz.collectAnswers();
        data.answers = (quizData.length > 0) ? quizData : null;

        //Grab nav
        $q('.aero_nav_when').each(function(){
            if($q(this).val() != ""){
                data.nav[$q(this).val()] = $q(this).parent().find('.aero_nav_to').val();
            }
        });

        //Switch hide dropdown to boolean props
        if(data.nav.length == 0) delete data.nav;
        if(data.hide){ data[data.hide] = true; delete data.hide; }

        //Switch checkboxes to boolean
        data.showTitle = (data.showTitle == "1") ? true : null;
        data.sidebar = (data.sidebar == "1") ? true : null;
        data.multi = (data.multi == "1") ? true : null;
        data.isRestrict = (data.isRestrict == "1") ? true : null;

        //Clean data for empty props
        data = _q.pick(data,_q.identity);

        //Update or create step
        if($q('.aero-editing-step').hasClass('aero-add-step')){
            Aero.step.add(data);
            $q('.aero-helper').remove();
        }else{
            Aero.step.update(index, data);
        }
        Aero.view.admin.close();
    },

    /**
     *  Picker Button Start
     */
    initPicker : function(){

        Aero.picker.init({
            onStart : function(){
                Aero.tip.hide();
                Aero.view.sidebar.hide();
            },
            callback: function(path){
                Aero.view.sidebar.show(false, 0);
                Aero.picker.destroy();

                var index = (Aero.tip._guide.step.length > 0) ? Aero.tip._current + 1 : 0;
                var nav = [];
                var title = "";
                var body = "";
                var text = "";

                //Auto populate buttons
                var tag = $q(path).prop('tagName').toLowerCase();
                var contains = ['button', 'a'];
                if($q.inArray(tag, contains) > -1){
                    text = $q.trim($q(path).text());
                    body = "Click " + text;
                    title = text;

                    nav = { click : "-1" };
                }

                //Auto populate for forms
                contains = ['input', 'select', 'textarea'];
                if($q.inArray(tag, contains) > -1){

                    text = $q.trim($q(path).parent().find('label:eq(0)').text());

                    var lbl = $q("label[for='"+$q(path).attr('id')+"']");
                    if(lbl.length > 0) text = lbl.text().replace('*', '');
                    body = "Enter " + text;
                    title = text;

                    nav = { blur : "-1" };
                }

                var url = document.URL;
                var full = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
                url = url.replace(full, '');

                //Remove trailing slash and slash with empty #
                if(!url.match(/#\/$/)){
                    var sl = /(\/$|\/#$|#$)/;
                    url = url.replace(sl, "");
                }

                if (tag == "a"){
                    //Auto check page unload
                    var ahref = $q(path).attr('href');
                    if (ahref != "javascript://" && ahref != "#") nav = {unload: 1};
                }

                //Step settings
                var settings = {
                    id : null,
                    title: title,
                    body: body,
                    url: url,
                    isAdd: true,
                    index: index,
                    loc : path,
                    nav : nav,
                    loss : 'ignore'
                };

                Aero.view.admin.render("step", $q.extend(Aero.model.step.defaults(), settings));
            }
        });
        Aero.picker.setEvents();
    },

    /**
     *  Create draggable
     */
    renderSortable : function(){

        //Drag order
        $q('.aero-steps ul')
            .sortable({
                placeholder: "aero-helper-dropable",
                update: function(event, ui) {
                    Aero.step.moveIndex(Aero.moveFrom, ui.item.index());
                    Aero.moveFrom = null;
                },
                start: function(event, ui) {
                    Aero.moveFrom = ui.item.index();
                }
            })
            .disableSelection();
    },

    /**
     *  Set event handlers
     */
    setEvents : function(){

        var self = this;

        //Delete
        $q('body').off("click.aroSD").on("click.aroSD", ".aero-steps ul li a.aero-delete", function(){
            var index = $q( ".aero-steps li" ).index( $q(this).parents('li:eq(0)') );
            Aero.confirm({
                ok : "Delete",
                title : "Step delete",
                msg : "Are you sure you want to delete this step?",
                onConfirm : function(){
                    Aero.step.destroy(index);
                }
            });
            return false;
        });


        //Edit
        $q('body').off("click.aeroSEdit").on("click.aeroSEdit", ".aero-steps ul li a.aero-edit", function(){
            var $li = $q(this).parents('li:eq(0)');
            Aero.index = $q('.aero-steps li').index($li);
            Aero.view.admin.edit($q(this));
            return false;
        });

        //Save on enter
        $q('body').off("keypress.ssa").on("keypress.ssa", '#editStepFrm input:not(.aero-input-label)', function(e){
            var k = e.keyCode || e.which;
            if(k == '13'){
                if(Aero.model.step.validate()){
                    self.save();
                }
                return false;
            }
        });

        //Save
        $q('body').off("click.aeroSSave").on("click.aeroSSave", ".aero-editing-step .aero-btn-save", function(){
            if(Aero.model.step.validate()){
                self.save();
                return false;
            }
        });

        //Aero Tabs
        $q('body').off("click.aeroTab").on("click.aeroTab", ".aero-tab a", function(){
            var activeC = 'aero-tab-active';
            var $section = $q(this).parents('.aero-section');

            $section.find('.' + activeC).removeClass(activeC);
            $section.find($q(this).attr('href')).addClass(activeC);
            $q(this).addClass(activeC);

            if($q(this).attr('id')=="aero-section-quiz")
                Aero.view.step.admin.quiz.render();

            return false;
        });

        //Add nav
        $q('body').off("click.aeroNAdd").on("click.aeroNAdd", ".aero-editing-step .aero-add-nav", function(){
            self.addNav();
            return false;
        });

        //Remove nav
        $q('body').off("click.aeroNDel").on("click.aeroNDel", ".aero-editing-step .aero-del-nav", function(){
            self.destroyNav($q(this));
            return false;
        });

        //Change size
        $q('body').off("change.ssC").on("change.ssC", ".aero-section select[name='aero_size']", function(){
            $q('.aero-custom-size').hide();
            $q('.aero-custom-size input').val("");

            if($q(this).val() == "custom") $q('.aero-custom-size').show();
        });

        //Change exception type
        $q('body').off("change.seC").on("change.seC", ".aero-section select[name='aero_miss']", function(){
            $q('.aero-alert-edit, .aero-skip-edit').hide();
            $q('input[name="aero_alert"], input[name="aero_alertContent"]').val("");
            if($q(this).val() == "alert") $q('.aero-alert-edit').show();
            if($q(this).val() == "skipto") $q('.aero-skip-edit').show();
        });

        //Change exception type
        $q('body').off("change.seL").on("change.seL", ".aero-section select[name='aero_loss']", function(){
            $q('.aero-loss-alert-edit, .aero-loss-skip-edit').hide();
            $q('input[name="aero_lossalert"], input[name="aero_lossalertContent"]').val("");
            if($q(this).val() == "alert") $q('.aero-loss-alert-edit').show();
            if($q(this).val() == "skipto") $q('.aero-loss-skip-edit').show();
        });

        //Change exception type
        $q('body').off("change.lut").on("change.lut", ".aero-section input[name='aero_locText']", function(){

            var query, nQuery, $el, tag, bits;

            query = $q("input[name='aero_loc']").val();
            $el = $q( query );
            tag = $el.prop("tagName");

            //Check to see if we have a button or anchor
            if(tag != "A" && tag != "BUTTON" && tag != "LABEL") return;

            //Break up current query
            bits = query.split(">");
            bits = bits.slice(0, -1);

            if($q(this).is(':checked')){
                nQuery = bits.join(">") + "> "+ tag.toLowerCase() + ":contains('" + $el.text().trim() + "')";
            }else{
                nQuery = bits.join(">") + "> "+ tag.toLowerCase() + ":eq(" + $q(bits.join(">") + "> "+ tag.toLowerCase()).index($el) + ")";
            }

            $q("input[name='aero_loc']").val(nQuery);
        });

        //Add step
        $q('body')
            .on("mouseup", "a.aero-btn-picker", function() {
                $q('.aero-play-icon').remove();
                self.initPicker();
            })
            .on("click", "a.aero-btn-picker", function() {
                return false;
            });
    }
};
