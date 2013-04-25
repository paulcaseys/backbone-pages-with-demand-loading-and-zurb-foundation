Zurb Foundation and Backbone.js boilerplate
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
        App.Models.HelpPanelStateMenuModel.selectMenuItem(id, "#submenu-wrapper", "a", ".menu-item-");

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

`resources/js/app/models/` contains models. Each backbone model should contain default values.

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
      $("#parallax-page #submenu-wrapper a").on(App.Models.ConfigModel.eventType, App.Models.ConfigModel.eventObj, submenuHandler);


old browser debugging example:
copy the following to display a visual debug panel to the page (for old browsers that do not support console.log)

          $('html').append(App.Models.ConfigModel.debug);
          App.Models.ConfigModel.debug.html('- test debug <br>');
          App.Models.ConfigModel.debug.append('- line two <br>');
          App.Models.ConfigModel.debug.append('- another line <br>');


# Video-js

Incorparated into this backbone boilerplate is Video.js. Video.js is a JavaScript and library that creates a HTML5 video player (with a light-weight flash-fallback for older browsers).

There are `videoSettingsObj` objects in the VideoPageView file, which defines the video paths and poster images.

Video-js overview
http://videojs.com/

Video-js javascript API details
https://github.com/zencoder/video-js/blob/master/docs/api.md


# Previewing the app

You need to run Chrome with the `--disable-web-security` argument to stop it blocking cross-origin requests. On a Mac, run:

    open -a 'Google Chrome' --args --disable-web-security


# Installing the Zurb Foundation Compass Gem

To create your first project using our Compass extension, you'll need to have the zurb-foundation gem installed. This will install Foundation and all necessary dependencies. Here's the command that will do this for you:

    sudo gem install zurb-foundation

you will also need to use install an old foundation gem

    gem install zurb-foundation --version 3.2.5

or

    gem install zurb-foundation --version 4.0.7

you can test which versions of foundation you have installed by running

    gem list

note that a `Gemfile` exists in your project root. this file informs the project which version of zurb foundation to reference. more information can be found at http://stackoverflow.com/questions/15175775/how-can-i-specify-framework-version-in-compass-create


# Compiling css with compass

You may be used to simply running compass with

    compass watch

this method will still work if you only have one version of zurb foundation installed,

however, if you have multiple versions, you should run the following command

    bundle exec compass watch


# Compiling the app javascript into one file
To compile the javascript, you must have `node`, `uglify.js` and `r.js` installed.

## Installing compile frameworks

1. Install node from http://nodejs.org/download/ and follow the prompts

2. Add the correct path (using terminal)
`export "PATH=$PATH:/usr/local/bin"`

3. Install uglify
`sudo npm -g install uglify-js`

4. install r.js
`sudo npm install -g requirejs`

More r.js details can be found at: https://github.com/jrburke/r.js/

If you have not used r.js before, a good resource to learn can be found at:
http://www.svlada.com/blog/2012/07/02/require-js-optimization-part2/#t0

Now you have everything installed, ready to compile the JavaScript!

## Compiling and minifying
One simple command

`r.js -o build-compiles-javascript.js`

This will compile everything listed in the `resources/js/app/AppConfig.js` inside `require(['file1', 'file2', 'etc'])`

It will compile and minify the file into `resources/js/compiled/AppConfig.min.js`



# Browser compatibility

This framework supports IE8 and above. If IE7 support is important for your users / customers, you can use Foundation 2.2.1, which supports IE7. http://foundation.zurb.com/files/foundation-download-2.2.1.zip


# Validation

The document was successfully checked as HTML5. This means that the resource in question identified itself as "HTML5" and that we successfully performed a formal validation of it.

http://validator.w3.org/check?uri=http%3A%2F%2Fpaulcasey.net%2Fclients%2Fnine%2Fnokia%2Fhtml5%2F


# .htaccess file

Meta tags containing X-UA-Compatible do not pass strict validation. `index.html` contains the following line

    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

This meta tag can be removed and replaced with the following code in you `.htaccess` file.

    <FilesMatch "\.(htm|html|php)$">
        <IfModule mod_headers.c>
            BrowserMatch MSIE ie
            Header set X-UA-Compatible "IE=Edge,chrome=1" env=ie
        </IfModule>
    </FilesMatch>

depending on your hosting solution, you may also require the following MIME types

    AddType application/vnd.ms-fontobject .eot
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType application/x-font-woff .woff



# Behaviour-Driven Development testing

If you choose to run Behaviour-Driven Development testing, I have included jasmine.js files in
in `test/`

More information on BDD and jasmine.js can be viewed at http://pivotal.github.com/jasmine/

A helpful walk-through is described here
http://kilon.org/blog/2012/08/testing-backbone-requirejs-applications-with-jasmine/
