
/**
 * Filename: js/app/views/VideoPageView
 *
 * initialises the view
 * 
 */
// 


// require js: defines the required js libraries and app files
define([

  // required libraries
  'jquery',
  'underscore',
  'backbone',

  // state model
  'App.Models.StateModel',

  // state menu model
  'App.Models.StateMenuModel',

  // required views
  'App.Views.VideoPanelView'


  // required collections
  //'App.Collections.HelloWorldCollection'

  // required models  
  //'App.Models.HelloWorldModel'

// require js: defines instances
], function($, _, Backbone, StateModel, StateMenuModel, VideoPanelView){


	var VideoPageView = Backbone.View.extend({

		
	    // binds view to the existing skeleton of the App already present in the HTML.
	    el: $("#video-page"),

      	

	    // at initialization we bind to the relevant events
	    initialize: function() {

	    	
	    	// hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
	    	$(this.el).hide(); 
	    	
	  		// creates an example event listener
	    	this.on('testCall', this.testMethod, this);

		    // initialises the state model/controller
		    App.Models.VideoPanelsStateModel = new StateModel;

      		// initialises the state controller for the menu
      		App.Models.VideoPanelStateMenuModel = new StateMenuModel;


      		// defines videos
      		// vid 1
      		var videoSettingsObj1 = {};
      		videoSettingsObj1.src = [
			        { type: "video/mp4", src: "resources/videos/oceans-clip.mp4" },
			        { type: "video/webm", src: "resources/videos/oceans-clip.webm" },
			        { type: "video/ogg", src: "resources/videos/oceans-clip.ogv" }
			        ];
			videoSettingsObj1.poster = "resources/videos/oceans-clip.png";
			videoSettingsObj1.autoplay = false;
			videoSettingsObj1.parentElement = "#video-page";

			// vid 2
      		var videoSettingsObj2 = {};
      		videoSettingsObj2.src = [
			        { type: "video/mp4", src: "resources/videos/nokia_vid_01.mp4" },
			        { type: "video/webm", src: "resources/videos/nokia_vid_01.webm" },
			        { type: "video/ogg", src: "resources/videos/nokia_vid_01.ogv" }
			        ];
			videoSettingsObj2.poster = "resources/videos/nokia_vid_01.jpg";
			videoSettingsObj2.autoplay = false;
			videoSettingsObj2.parentElement = "#video-page";

			// vid 3
      		var videoSettingsObj3 = {};
      		videoSettingsObj3.src = [
			        { type: "video/mp4", src: "resources/videos/nokia_vid_01.mp4" },
			        { type: "video/webm", src: "resources/videos/nokia_vid_01.webm" },
			        { type: "video/ogg", src: "resources/videos/nokia_vid_01.ogv" }
			        ];
			videoSettingsObj3.poster = "http://video-js.zencoder.com/oceans-clip.png";
			videoSettingsObj3.autoplay = false;
			videoSettingsObj3.parentElement = "#video-page";



      		// creates three panel views
      		App.Views.VideoPanelView1 = new VideoPanelView({el: '#video-panel-1'});
      		App.Views.VideoPanelView2 = new VideoPanelView({el: '#video-panel-2'});
      		App.Views.VideoPanelView3 = new VideoPanelView({el: '#video-panel-3'});

      		App.Views.VideoPanelView1.defineVideoSettingsObj(videoSettingsObj1);
      		App.Views.VideoPanelView2.defineVideoSettingsObj(videoSettingsObj2);
      		App.Views.VideoPanelView3.defineVideoSettingsObj(videoSettingsObj3);

	    },

    	
    	// method for the eventlistener
	    testMethod: function (e) {
	       console.log('VideoPageView testMethod');
	    },
	    

    	// method for the eventlistener
	    initialiseVideoPlayer: function (e) {
	       console.log('VideoPageView testMethod');
	    },


		/*******************
		 * TRANSITION IN/OUT
		 * these are called when the view is routed in / out
		 */
		
    	// transitions the view in
	    transitionIn: function () {	 
	    	// adds eventlisteners     
	    	this.addEventListeners();	

	    	// basic way to display element
	    	$(this.el).show();  	
	    },

    	// removes all eventlisteners
	    transitionOut: function () {	       
	    	// removes eventlisteners    
	    	this.removeEventListeners();	

	    	// removes video players
	    	App.Views.VideoPanelView1.transitionOut();
	    	App.Views.VideoPanelView2.transitionOut();
	    	App.Views.VideoPanelView3.transitionOut();

	    	// basic way to hide element
	    	$(this.el).hide();  	
	    },	    



		/*******************
		 * EVENT LISTENERS
		 * garbage disposal for unneccesary event listeners
		 */
		
    	// adds eventlisteners
	    addEventListeners: function () { 
	    	// adds an example event listener
	    	//this.on('testCall', this.testMethod, this);

	    },

    	// removes eventlisteners
	    removeEventListeners: function () {	       
	    	// removes an event listeners
	    	//this.off('testCall', this.testMethod, this);
	    }
	    

	});




    // require js: defines function/s to be accessed by require js
    return VideoPageView;

});
