"use strict";

/**
 * Media View for Tip Media
 * @author
 * @type {{render: Function}}
 */
Aero.view.media = {

    /**
     * Template for answer
     * @param answer
     * @returns {string}
     */
    tpl : function(url, size){

        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        var height = size ? (size * 0.6) + "px" : "100%";

        if (match && match[2].length == 11) {
            return '<iframe width="100%" height="'+height+'" src="//www.youtube.com/embed/' + match[2] + '" frameborder="0" allowfullscreen></iframe>';
        } else {
            return 'error';
        }
    },

    /**
     * Render the Quiz
     * @param answers
     * @param layout
     * @returns {string}
     */
    render : function(step){

        //Render Videos
        if(step.youtube){
            return this.tpl(step.youtube, step.size);
        }else if(step.embed){
            return step.embed;
        }
    }
};
