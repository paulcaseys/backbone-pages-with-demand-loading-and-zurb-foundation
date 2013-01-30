A Backbone.js base
==================================================

Using common PureMVC and Gaia framework conventions. A good starting point for backbone.js projects.

* Most of the functionality is in `resources/js/app`
* Third-party libraries are in `resources/js/libs`
* Entrypoint is `index.html`



Script overview
-------------

`resources/js/libs/require/require.js`
require.js is loaded first. It is a JavaScript file loader library. More information: http://requirejs.org/

`resources/js/app/AppConfig.js`
Configures the backbone app, then loads AppInit.js

`resources/js/app/AppInit.js`
Where the views and router are initialised

`resources/js/app/Router.js`
Where the '#hash' URIs are routed 

`resources/js/app/models/StateModel.js`
This model defines the state of views. 

`resources/js/app/models/ConfigModel.js`
Configures variable global settings, based on browser and device (such as windowHeight, touch, videoType, etc)

Create a new state instance by: `App.Models.PageStateModel = new StateModel;`

Change the view of this instance can be done by `App.Models.PageStateModel.showView(App.Views.HomePageView);`

You can make as many state instances as you like, so this model can be used to control the state of smaller panels inside a view. 




# Views and how they are controlled

For example, the `HelpPageView` contains 3x panels

		// creates three panel views
		App.Views.HelpPanelView1 = new HelpPanelView({el: '#help-panel-1'});
		App.Views.HelpPanelView2 = new HelpPanelView({el: '#help-panel-2'});
		App.Views.HelpPanelView3 = new HelpPanelView({el: '#help-panel-3'});

And I create a StateModel, to define the state 

		// initialises the state model/controller
		App.Models.HelpPanelsStateModel = new StateModel;

Then I can control the state in the Router.js

        // defines which panel to display 
        App.Models.HelpPanelsStateModel.showView(App.Views["HelpPanelView"+id]);


# Views: consistent transitionIn transitionOut

Each View has a `transitionIn()` and `transitionOut()` method

`transitionIn()` displays the page: this is automatically called by the state model when the state is updated
`transitionOut()` hides the page that was previously displayed: this is automatically called by the state model when the state is updated

We can add much nicer transitions. i am just using show() and hide() for the moment, but a 'transition' could be scrolling from one part of the page to another, it could be fading, or sliding, or whatever. It is VERY flexible.


# Menus and how they are controlled

We can create menu systems that are quick to select an item as "selected"

First I create the StateMenuModel

        // initialises the state controller for the menu
        App.Models.HelpPanelStateMenuModel = new StateMenuModel;

Then I can control the state in the Router.js

        // selects a menu item
        App.Models.HelpPanelStateMenuModel.selectMenuItem(id, "#submenu", "a", ".menu-item-");

To clear all active states: call an itemNumber that does not exist, eg:
        
        // clears all active states
        App.Models.PageStateMenuModel.selectMenuItem(10000000000, "#menu", "a", ".menu-item-");

details about each parameter:

        /**
       * selects a menu item and clears the selction of the other menu items in that container
       * @param  {[int]}    itemNumber                  the number of the menu item you want to select
       * @param  {[string]} container                   the id or class of the 
       * @param  {[string]} selectionGroup              the group of items that the class is associated with (usually "a" or "li" )
       * @param  {[string]} uiniqueSelectionClassForId  the class that the itemNumber will be appended to (eg: "menu-item-")
       */



# Models with on demand JSON

`resources/js/app/AppConfig.js` is where to define the paths to services

`resources/js/app/models/` contains models. Each backbone model should contain default valuse. 

Then in your view can demand a service request. 

        // loads the gallery items
        var GItems = new GalleryModel;
        GItems.url = App.Data.GalleryData;
        GItems.type = 'GET';
        GItems.dataType = 'jsonp';
        GItems.fetch({success: this.onDataLoadComplete}); 

On success, your model will store the data and call the correlating method

      onDataLoadComplete: function (response, dataResponse) {
        //console.log(response);
        //console.log(dataResponse[0].page_title);
        
        // clears the target 
        App.Views.GalleryPageView.galleryItemsTarget.html('');

        // loops through the dataResponse array
        for (var i = 0; i < dataResponse.length; i++) {
          App.Views.GalleryPageView.createItem(dataResponse[i]);
        }
      }




# ConfigModel

this defines 
- app constants
- device details (such as: is it a touch screen?),
- browser width/height details
- page ratio details
- html5 video support details
- debugging console for old browsers

eventType example: 
the `eventType` is automatically configured in the `ConfigModel` (the eventType depends on the device `touchstart` : `click`)

        // submenu clicking
      $("#parallax-page #submenu a").on(App.Models.ConfigModel.eventType, App.Models.ConfigModel.eventObj, submenuHandler);


old browser debugging example: 
copy the following to display a visual debug panel to the page (for old browsers that do not support console.log)

          $('html').append(App.Models.ConfigModel.debug);
          App.Models.ConfigModel.debug.html('- test debug <br>');
          App.Models.ConfigModel.debug.append('- line two <br>');
          App.Models.ConfigModel.debug.append('- another line <br>');



# Previewing the app

You need to run Chrome with the `--disable-web-security` argument to stop it blocking cross-origin requests. On a Mac, run:

    open -a 'Google Chrome' --args --disable-web-security