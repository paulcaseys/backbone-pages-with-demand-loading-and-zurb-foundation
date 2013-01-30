
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
  'backbone'

  // required collections
  //'App.Collections.HelloWorldCollection'

  // required models  
  //'App.Models.HelloWorldModel'

// require js: defines instances
], function($, _, Backbone){


	var HelpPanelView = Backbone.View.extend({

		
	    // binds view to the existing skeleton of the App already present in the HTML.
	    el: $("#help-panel-1"),

	    // at initialization we bind to the relevant events
	    initialize: function() {
	    	
	    	// hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
	    	$(this.el).hide(); 
	    	
	  		// creates an example event listener
	    	this.on('testCall', this.testMethod, this);

	    },

    	
    	// method for the eventlistener
	    testMethod: function (e) {
	       console.log('HelpPanelView testMethod');
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
