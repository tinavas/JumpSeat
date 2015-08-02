"use strict";

/**
 * Element Selector Object
 * @author Mike Priest
 * @type {{options: {onStart: Function, callback: Function}, init: Function, destroy: Function, latch: Function, get: Function, getElementByPos: Function, scrollOffset: Function, setEvents: Function}}
 */
Aero.picker = {

    /**
     *  Save
     */
    options : {
        onStart : function(){
            Aero.log("Starting picker", "info");
        },
        callback : function(path){
            Aero.log("Starting picker path:" + path, "info");
        }
    },

    /**
     *  Initialize
     */
    init : function(options) {
        var self = this;
        var $picker = $q('.aero-picker');
        var settings = $q.extend({}, this.options, options);
        settings.onStart();

        if ($picker.length == 0) {

            $picker = $q('<div class="aero-picker" style="border:0.2em dashed #0599c3; position: fixed; top: 0; left: 0; height: 100%; width: 100%; z-index:999999999999;"></div>');
            $q('body').append($picker);

            $picker
                .on('mousemove.aeroPicker', function(e) { self.latch(e); })
                .on('mouseup.aeroPicker', function(e) { settings.callback(self.get(e)); });
        }
    },

    /**
     *  Destroy the picker picker
     */
    destroy : function() {
        $q('.aero-picker').remove();
        $q('*').off('.aeroPicker');
    },

    /**
     *  Latch picker onto element
     */
    latch : function(e){

        var self = this;
        var $el = this.getElementByPos(e.pageX, e.pageY);

        if($el.length > 0){

            var isFrame = false;
            var $picker = $q('.aero-picker');
            var offset = this.scrollOffset($el);
            var top = offset.top;
            var left = offset.left;
            var height = $el.outerHeight();
            var width = $el.outerWidth();

            if($el.prop('tagName') == "IFRAME"){

                //It's a frame!
                isFrame = true;

                var iframe= $el.get(0);
                var i= $el.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;
                var $frameEl = $q(i.document.elementFromPoint(e.pageX - left, e.pageY - top));
                var iOffset = $frameEl.offset();
            }

            $el.trigger('mouseover');
            $el.trigger('mouseenter');

            if(isFrame) {
                top = top + iOffset.top;
                left = left + iOffset.left;
                height = $frameEl.outerHeight();
                width = $frameEl.outerWidth();
            }

            if (height > 0 && width > 0) {
                $picker.css({
                    height: height + "px",
                    width: width + "px",
                    top: top + "px",
                    left: left + "px"
                });
            }
        }
    },

    /**
     *  Get full path of element
     */
    get : function(e) {
        var self = this;
        var $el = self.getElementByPos(e.pageX, e.pageY);

        //@todo display different path options in location
        return $el.getSelector()[0];
    },

    /**
     *  Get element by x-y position
     */
    getElementByPos : function(x, y) {

        $q('.aero-picker').hide();

        x -= $q(document).scrollLeft();
        y -= $q(document).scrollTop();

        var eel = document.elementFromPoint(x, y);

        $q('.aero-picker').show();

        return $q(eel);
    },

    /**
     *  Get scroll offset
     */
    scrollOffset : function($el) {
        var offset = $el.offset();
        offset.top  -= $q(document).scrollTop();
        offset.left -= $q(document).scrollLeft();

        return offset;
    },

    /**
     *  Create events
     */
    setEvents : function(){
        var self = this;

        $q("body")
            .on("mousemove.aeroPicker", "*", function(e) {
                self.latch(e);
            });

        //Shortcuts
        $q(document).keyup(function(e) {
            if (e.keyCode == 27){
                self.destroy();
                Aero.view.sidebar.show(false, 0);
            }
        });
    }
};
