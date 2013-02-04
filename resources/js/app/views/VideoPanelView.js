
/**
 * Filename: js/app/views/HelpPanelView
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
  'videojs'

  // required collections
  //'App.Collections.HelloWorldCollection'

  // required models  
  //'App.Models.HelloWorldModel'

// require js: defines instances
], function($, _, Backbone){


	var HelpPanelView = Backbone.View.extend({

		
	    // binds view to the existing skeleton of the App already present in the HTML.
	    el: $("#video-panel-1"),

	    // binds view to the existing skeleton of the App already present in the HTML.
	    videoSettingsObj: {},

	    // binds view to the existing skeleton of the App already present in the HTML.
	    myPlayer: $("#video-panel-1"),

	    // at initialization we bind to the relevant events
	    initialize: function() {
	    	
	    	// hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
	    	$(this.el).hide(); 
	    	
	  		// creates an example event listener
	    	this.on('testCall', this.testMethod, this);

	    },

    	
    	// method for the eventlistener
	    testMethod: function (e) {
	       console.log('VideoPanelView testMethod');
	    },
	    
    	// creates video element
	    defineVideoSettingsObj: function (obj) {
	    	this.videoSettingsObj = obj;
	    },

    	// creates video element
	    createVideoElement: function () {
	    	console.log('creating video');

	    	var me = this;

	    	this.removeVideoElement();

	    	
			//console.log(me.videoSettingsObj);

		    var videoElement = 'video-player';

	    	if(!$(me.videoSettingsObj.parentElement+" #video-player").length){

	    		// VIDEO PLAYER SET UP THE FIRST TIME
	    		
	    		_V_.options.flash.swf = "resources/js/libs/video-js/video-js.swf";
	    		$(me.videoSettingsObj.parentElement+" #video-panel").html(
				    '<video id="video-player" class="video-js vjs-default-skin" controls preload="none" data-setup="{}" poster="'+me.videoSettingsObj.poster+'" >' +
				    '</video>');

	    		if (!$('html').is('.lt-ie9')) {
		    		$(me.videoSettingsObj.parentElement+" #video-panel").hide();
		    	}
			    _V_(videoElement).ready(function(){
			    	
			    	me.myPlayer = this;

			    	me.myPlayer.src(me.videoSettingsObj.src);

				    setTimeout(function() {me.resizeVideoJS(); }, 500); 

				    window.onresize = me.resizeVideoJS; // Call the function on resize

				    if(me.videoSettingsObj.autoplay) setTimeout(function() {me.myPlayer.play(); }, 500);
					
			  	});


	    	} else {

	    		// VIDEO PLAYER SET UP THE SECOND TIME

	    		$(me.videoSettingsObj.parentElement+" #video-panel").hide();

			    me.myPlayer = _V_(videoElement);

		    	me.myPlayer.src(me.videoSettingsObj.src);
				
				setTimeout(function() { me.resizeVideoJS(); }, 500); 

		    	// change poster
		    	$(me.videoSettingsObj.parentElement+' #'+videoElement+' .vjs-poster').attr("src", me.videoSettingsObj.poster);
				
				me.myPlayer.posterImage.show(); 
						

				if(me.videoSettingsObj.autoplay) setTimeout(function() {me.myPlayer.play(); }, 500);


	    	}
	    	
		
	    },

    	// resizes video element
	    resizeVideoJS: function () {
	    	var me = this;

		    var videoElement = 'video-player';

    		$("#video-panel").show();

		    // set the size
		    var aspectRatio = 9/16; // Make up an aspect ratio

	    	if($('#'+videoElement).is(':hidden')){
	    		$('#'+videoElement).show();
	    	}

	    	// Get the parent element's actual width
	    	var width = $("#video-panel").width();

	    	me.myPlayer = _V_(videoElement);

	        // Set width to fill parent element, Set height
	    	me.myPlayer.width(width).height( width * aspectRatio );
	    },



    	// removes video element
	    removeVideoElement: function () {


	    	if($('#video-player').length){
	    		_V_('video-player').pause();
	    		if (App.Models.ConfigModel.touch !== true) {
		    		$(".vjs-big-play-button").show();
		    	}
	    	}
	    	
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

	    	// creates the video element
	    	this.createVideoElement();	


	    },

    	// removes all eventlisteners
	    transitionOut: function () {	       
	    	// removes eventlisteners    
	    	this.removeEventListeners();	

	    	// removes the video element
	    	this.removeVideoElement();

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
    return HelpPanelView;

});
