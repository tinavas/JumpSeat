var iCrossChild = {
    x : 0,
    y : 0,

    /**
     * Get cursor position
     */
    getElementByPos : function(x, y) {

        x -= $(document).scrollLeft();
        y -= $(document).scrollTop();

        var eel = document.elementFromPoint(x, y);

        return $(eel);
    },

    /**
     *  Get element positioning
     */
    latch : function(e) {

        var options = {};
        var self = this;
        var $el = this.getElementByPos(e.pageX, e.pageY);

        if($el.length > 0){

            var offset = $el.offset();
            offset.top  -= $(document).scrollTop();
            offset.left -= $(document).scrollLeft();

            var top = offset.top;
            var left = offset.left;
            var height = $el.outerHeight();
            var width = $el.outerWidth();

            if (height > 0 && width > 0) {
                options = {
                    height: height + "px",
                    width: width + "px",
                    top: top + "px",
                    left: left + "px"
                };
            }
        }

        return options;
    },

    /**
     *  Set Events
     */
    setEvents : function(){
        $('body').on('mousemove', function(e) {
            iCrossChild.x = e.pageX;
            iCrossChild.y = e.pageY;
        });
    }
};

//Receive
window.onmessage = function(e){
    if(e.data == "get"){
        window.parent.postMessage(iCrossChild.latch(), "*");
    }
};

$('body').on('mousemove', function(e) {
    window.parent.postMessage(iCrossChild.latch(e), "*");
});
