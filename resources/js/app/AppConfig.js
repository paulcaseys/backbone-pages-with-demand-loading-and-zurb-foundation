
/**
 * Filename: js/app/AppConfig
 *
 * defines the app paths and initialises the app
 * 
 */
// 

// APP STRUCTURE
// defines the app structure
var App = {};
App.Views = {};
App.Models = {};
App.Data = {};


// DATA SERVICES
// define data service paths
App.Data.GalleryData = 'resources/data/GalleryData.json' + '?ver=' + ((new Date()).getTime());


// CONSOLE FIX
// Avoid `console` errors in browsers that lack a console (from html5 boilerplate)
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



// APP CONFIG
requirejs.config({

	// defines paths that are used across the app
	paths: {

		// paths to common libraries
		'jquery': 		'resources/js/libs/jquery/jquery-min',
		'backbone': 	'resources/js/libs/backbone/backbone-min',
		'underscore': 	'resources/js/libs/underscore/underscore-min',
		'json': 		'resources/js/libs/json2/json2',

		// jquery easing
		'jquery.easing': 'resources/js/libs/jquery/jquery.easing',

		// raphael 
		'raphael': 	'resources/js/libs/raphael/raphael.min',

		// waypoints (scrolling)
		'waypoints': 	'resources/js/libs/waypoints/waypoints.min',

		// fixie (lorem ipsum generator)
		'fixie': 	'resources/js/libs/fixie/fixie.min',

		// modernizr (html5 conditional and tag correction)
		'modernizr': 	'resources/js/libs/modernizr/modernizr.min',

		// cosmos image loading (image loading and rescaler)
		'cosmosimageloader': 	'resources/js/libs/cosmos/cosmos-image-loader.1.01',
		
		// paths to app initialiser
		'AppInit': 								'resources/js/app/AppInit',

		// paths to app router (routes hash URIs)
		'App.Router': 						'resources/js/app/Router',

		// paths to the config model (for constants)
		'App.Models.ConfigModel': 			'resources/js/app/models/ConfigModel',

		// paths to state PAGE/PANEL model (tells which state to transition to)
		'App.Models.StateModel': 			'resources/js/app/models/StateModel',

		// paths to state MENU model (tells which menu item to select)
		'App.Models.StateMenuModel': 			'resources/js/app/models/StateMenuModel',

		// paths to views
		'App.Views.HomePageView': 			'resources/js/app/views/HomePageView',
		'App.Views.GalleryPageView': 		'resources/js/app/views/GalleryPageView',
		'App.Views.HelpPageView': 			'resources/js/app/views/HelpPageView',
		'App.Views.HelpPanelView': 			'resources/js/app/views/HelpPanelView',
		'App.Views.RaphaelPageView': 		'resources/js/app/views/RaphaelPageView',
		'App.Views.ParallaxPageView': 		'resources/js/app/views/ParallaxPageView',
		'App.Views.ExamplePageView': 		'resources/js/app/views/ExamplePageView',

		// paths to collections
		//'App.Collections.ExampleCollection': 	'resources/js/app/collections/ExampleCollection',

		// paths to models
		//'App.Models.ExampleModel': 			'resources/js/app/models/ExampleModel'
		'App.Models.GalleryModel': 			'resources/js/app/models/GalleryModel'

	},

	// dependancies for certain javascript files
	shim: {
    'underscore': {
    	exports: '_'
    },
    'backbone': {
    	deps: ["underscore", "jquery"],
    	exports: "Backbone"
    },
    'kendo.console': {
    	deps: ["jquery"]
    },
    'waypoints': {
    	deps: ["jquery"]
    },
    'modernizr': {
    	deps: ["jquery"]
    },
    'jquery.easing': {
    	deps: ["jquery"]
    },
    'raphael': {
    	deps: ["jquery"],
    	exports: "raphael"
    },
    'cosmosimageloader': {
    	deps: ["jquery"],
    	exports: "cosmosimageloader"
    }
  },
	

	// the duration that require.js should wait before abandoning the load 
	waitSeconds: 30,

	// prevents caching during development (remove data and time for live app)
	urlArgs: 'ver=5' + ((new Date()).getTime())

});





requirejs([

	// Load our app module and pass it to our definition function
	'AppInit'

	
], function(AppInit){
	// dependencies are now loaded
	// initialises app
	AppInit.initialize();


});