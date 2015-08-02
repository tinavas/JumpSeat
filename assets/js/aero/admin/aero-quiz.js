"use strict";

/**
 * View for Admin Quiz Screen
 * @author Mike Priest
 * @type {{render: Function, renderAnswer: Function, setEvents: Function}}
 */
Aero.view.step.admin.quiz = {

    /**
     *  Render initial
     */
    render : function(){
        this.setEvents();
    },

    /**
     * * Create a new answer
     * @param answer object
     * @param isAppend append to ux
     */
    renderAnswer : function(answer, isReturn){
        if(answer.title != "") {

            var isCorrect = answer.correct ? "aero-checked" : "";
            var checkIcon = answer.correct ? "fa-check-square-o" : "fa-square-o";
            var tpl = '<li class="clearfix"><a class="aero-btn-grey aero-answer-delete"><i class="fa fa-times"></i></a><a class="aero-btn-grey aero-answer-check '+ isCorrect +'"><i class="fa '+ checkIcon +'"></i></a><span>' + answer.title + '</span></li>';

            if(!isReturn) {
                $q('.aero-answer-list ul').append($q(tpl));
                $q('.aero-answer').val("");
            }else{
                return tpl;
            }
        }
    },

    /**
     *
     * @param data
     */
    collectAnswers : function(){

        var answers = [];

        $q('.aero-answer-list li').each(function(){
            var answer = {
                title : $q(this).find('span').text(),
                correct : $q(this).find('.aero-answer-check').hasClass('aero-checked')
            };

            answers.push(answer);

            console.log($q(this).find('.aero-answer-check'));
        });

        console.log(answers);

        return answers;
    },

    /**
     *  Set UX Events
     */
    setEvents : function(){

        var _this = this;

        $q('.aero-answer-list ul').sortable();

        //New Answer
        $q('body').off('click.qaa').on('click.qaa', '.aero-answer-add', function(){
            var answer = {
                title : $q(this).val(),
                correct : false
            };

            _this.renderAnswer(answer);
        });

        //Check Answer
        $q('body').off('click.qaa').on('click.qaa', '.aero-answer-check', function(){
            var $i = $q(this).find('i');

            if($i.hasClass('fa-square-o')) {
                $q(this).addClass('aero-checked');
                $i.attr('class', $i.attr('class').replace('-square', '-check-square'));
            }else{
                $q(this).removeClass('aero-checked');
                $i.attr('class', $i.attr('class').replace('-check-square', '-square'));
            }
        });

        //Shortcut Keys
        $q('body').off('keydown.qkp').on('keydown.qkp', '.aero-answer', function(e) {

            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == '13') {

                var answer = {
                    title : $q(this).val(),
                    correct : false
                };

                _this.renderAnswer(answer);
                return false;
            }
        });

        //Delete
        $q('body').off('click.qd').on('click.qd', '.aero-answer-delete', function(e) {
            $q(this).parents('li:eq(0)').remove();
        });
    }
};
