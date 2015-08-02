"use strict";

/**
 *  Main() function file to setup jumpseat
 *  @author Mike Priest
 */
function AeroMain() {

    //Start the crazies
    $q(function(){ Aero.guide.init(); });

    //Initialize Pathways
    Aero.pathway.init();
}

//Start
AeroMain();
