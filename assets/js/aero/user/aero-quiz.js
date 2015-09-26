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
    renderNotification : function($quiz, err, type){

        var msg = "";

        switch(type) {
            case "err":
                msg = '<i class="fa fa fa-warning"></i>Incorrect Answer!';
                if(err && err != "") msg += '<div>' + err + '</div>';
                break;
            case "warn":
                msg = '<i class="fa fa fa-warning"></i>Please select an answer!';
                break;
            case "success":
                msg = '<i class="fa fa-check-square-o"></i> Correct!';
                break;
        }

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
        var count = 0;

        //Check Answers
        $q('#' + step.id).find('input').each(function() {
            if ($q(this).is(':checked')) count = count + 1;
            if ($q(this).data('ans') != $q(this).is(':checked')) valid = false;
        });

        if(count == 0){
            this.renderNotification($q('#' + step.id), null, 'warn');
        }else if(!valid) {
            this.renderNotification($q('#' + step.id), step.errmsg, 'err');
        }else{
            this.renderNotification($q('#' + step.id), null, 'success');
        }

        return valid;
    }
};
