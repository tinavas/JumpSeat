"use strict";

/**
 * Quiz View
 * @author
 * @type {{render: Function}}
 */
Aero.view.quiz = {

    /**
     * Template for answer
     * @param answer
     * @returns {string}
     */
    tpl : function(answer){
        return '<li class="clearfix"><label><input data-ans="'+answer.correct+'" type="checkbox" value="1"/>'+answer.title+'</label></li>';
    },

    /**
     * Render the Quiz
     * @param answers
     * @param layout
     * @returns {string}
     */
    render : function(answers, layout){

        layout = layout ? layout : "";
        var quiz = '<div class="aero-quiz aero-quiz-'+layout+'"><ul class="clearfix">';

        //Add Answers
        for(var i in answers){
            if(!$q.isFunction(answers[i])) {
                quiz += this.tpl(answers[i]);
            }
        }
        quiz += '</ul></div>';

        return quiz;
    },

    /**
     * Render a notification
     * @param type
     */
    renderNotification : function($quiz, type){

        var msg = type == "warn" ? '<i class="fa fa fa-warning"></i>Incorrect Answer!' : '<i class="fa fa-check-square-o"></i> Correct!';
        $q('.aero-msg').remove();
        $quiz.find('.aero-tip-body').prepend('<div class="aero-msg aero-'+ type +'">'+msg+'</div>');
    },

    /**
     * Validate the Quiz
     * @param step
     * @returns {boolean}
     */
    validate : function(step){

        var valid = true;

        //Check Answers
        $q('#' + step.id).find('input').each(function() {
            if ($q(this).data('ans') != $q(this).is(':checked')) valid = false;
        });

        if(!valid) {
            this.renderNotification($q('#' + step.id), 'warn');
        }else{
            this.renderNotification($q('#' + step.id), 'success');
        }

        return valid;
    }
};
