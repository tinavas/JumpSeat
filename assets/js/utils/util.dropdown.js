/**
 *  Utility for Searchable Dropdown
 */
(function ( $q ) {

    //@todo move into searchable dropdown
    $q.fn.searchable = function( options ) {

        var _this = this;

        // Set Option Defaults
        var settings = $.extend({
            api : "",
            method : "",
            value : ""
        }, options );

        _this.append('<option value="">- Select a User -</option>');
        _this.append('<option value="guest@jumpseat.io">Guest Users</option>');

        User.api.get(function(users){

            for(var i in users){
                _this.append('<option value="'+users[i].email+'">'+users[i].firstname +' '+ users[i].lastname + " (" + users[i].email + ")" +'</option>');
            }
        });

        return this;
    };

}( $q ));
