
/**
 * Filename: js/app/views/DatavisPageView
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

  'kendo.console',
  'kendo.dataviz'

  // required collections
  //'App.Collections.HelloWorldCollection'

  // required models  
  //'App.Models.HelloWorldModel'

// require js: defines instances
], function($, _, Backbone){


	var DatavisPageView = Backbone.View.extend({

		
	    // binds view to the existing skeleton of the App already present in the HTML.
	    el: $("#datavis-page"),

	    // at initialization we bind to the relevant events
	    initialize: function() {
	    	
	    	// hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
	    	$(this.el).hide(); 
	    	
	  		// creates an example event listener
	    	this.on('testCall', this.testMethod, this);

	    },

    	
    	// method for the eventlistener
	    testMethod: function (e) {
	       console.log('DatavisPageView testMethod');
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



            
	    	$("#chart-kendo").kendoChart({
                        theme: $(document).data("kendoSkin") || "default",
                        title: {
                            text: "Break-up of Spain Electricity Production for 2008"
                        },
                        legend: {
                            position: "bottom",
                            labels: {
                                template: "#= text # (#= value #%)"
                            }
                        },
                        seriesDefaults: {
                            labels: {
                                visible: true,
                                position: "outsideEnd",
                                format: "{0}%"
                            }
                        },
                        series: [{
                            type: "donut",
                            data: [{
                                category: "Hydro",
                                value: 22
                            }, {
                                category: "Solar",
                                value: 2
                            }, {
                                category: "Nuclear",
                                value: 49
                            }, {
                                category: "Wind",
                                value: 27
                            }]
                        }],
                        tooltip: {
                            visible: true,
                            format: "{0}%"
                        }
                    });


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
    return DatavisPageView;

});
