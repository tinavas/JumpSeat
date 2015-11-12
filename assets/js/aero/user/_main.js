"use strict";

/**
 *  Main() function file to setup jumpseat
 *  @author Mike Priest
 */
function AeroMain() {

    //Start the crazies
    $q(function(){
        //Cross domain check
        aeroStorage.getItem('aero:sidebar:cdshost', function(bits){
            if(bits){
                var bitsArr = bits.split("~");

                if(bitsArr[1] != window.location.host){
                    aeroStorage.setItem("aero:session:pause", bitsArr[0]);
                }
            }
            Aero.guide.init();
        }, true);
    });

    //Initialize Pathways
    Aero.pathway.init();
}

//Start
AeroMain();
