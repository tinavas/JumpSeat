/**
 *  Utility for Searchable Dropdown
 */
(function ( $q ) {

    $q.fn.searchable = function( options ) {

        var _this = this;

        // Set Option Defaults
        var settings = $.extend({
            api : "",
            method : "",
            value : ""
        }, options );

        return this.css({});
    };

}( $q ));
