###JUMPSEAT PROJECT OVERVIEW

Latest Version: 1.1.0.3

JumpSeat is an Interactive Learning Management System (ILMS) that enables businesses to create step-by-step
task guidance over any web-based application. This proactive learning platform enables businesses to become more agile,
whilst reducing costs of training and support.

Please note that the open-source version is unsupported. Use at your own risk. If you require support or hosting, please
visit our website http://jumpseat.io for pricing.

####DOCUMENTATION
All administrative and installation documentation is available @ http://wiki.jumpseat.io


###BROWSER SUPPORT
JumpSeat currently supports the following browsers:

 1. Internet Explorer 10+ (9 works but is not supported)
 2. Firefox
 3. Chrome
 4. Safari

####BROWSER PLUGIN
Courtesy of CrossRider.com

In order to create your own browser plugin, follow these simple steps.

 1. Create an account @ http://crossrider.com
 2. Create a browser extension and give it a title/description
 3. Edit the code and open extension.js
 4. Paste the extension.js code and make changes to your DNS
 5. Save the file and click sync with production in the header
 6. Click the "Settings" menu item to reveal the general settings
 7. Click "Download Links" from the side menu
 8. Download your new plugin!

####EXTENSION.JS
````
/************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our docs site: http://docs.crossrider.com
*************************************************************************************/

appAPI.ready(function($) {
     appAPI.dom.addRemoteJS({
        url: "https://YOURDOMAINHERE/aerospace",
        additionalAttributes: {charset: "UTF-8"},
        callback: function() {
        }
     });
});
````

###LICENSE

JumpSeat is released under the GNU Affero General Public License. This Free Software Foundation license is fairly new, and thus we wanted to talk about how this license differs from GPL.
Our goal with using AGPL is to preserve the concept of copyleft with JumpSeat. With traditional GPL, copyleft was associated with the concept of distribution of software.  The problem is that nowadays,
distribution of software is rare: things tend to run in the cloud. AGPL fixes this “loophole” in GPL by saying that if you use the software over a network, you are bound by the copyleft.
Other than that, the license is virtually the same as GPL v3.

To say this another way: if you modify the core source code, the goal is that you have to contribute those modifications back to the community.
See LICENCE file under the root directory for details.
