jQuery(function(){
    (function($){

        //Setup Login Button
        var hostname = appAPI.db.get('hostname');
        if(hostname && hostname !== ""){
            $('button').addClass('btn-half');
            $('#login').show();
        }

        //On save
        $('#login').on('click', function(){
            var win = window.open($('#hostname').val(), '_blank');
            if(win){
                //Browser has allowed it to be opened
                win.focus();
            }else{
                //Broswer has blocked it
                alert('Please allow popups for this site');
            }
        });

        //On save
        $('#save').on('click', function(){
            appAPI.db.set('hostname', $('#hostname').val());
            appAPI.browserAction.closePopup();
        });

        //On enter key
        $('#hostname').on('keyup', function(e){
            if(e.which == 13) {
                appAPI.db.set('hostname', $('#hostname').val());
                appAPI.browserAction.closePopup();
                return false;
            }
        });

    })(jQuery);
});
