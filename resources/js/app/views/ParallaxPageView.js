
/**
 * Filename: js/app/views/ParallaxPageView
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

  // state menu model
  'App.Models.StateMenuModel',

  // loads waypoints (scrolling)
  'waypoints',

  // loads fixie (for lorem ipsum generation)
  'fixie',

  // loads jquery easing (for better animations)
  'jquery.easing',
  'foundationtopbar',
  'foundationapp',

  // tweenlite
  'tweenlite'


  // required collections
  //'App.Collections.HelloWorldCollection'

  // required models  
  //'App.Models.HelloWorldModel'

// require js: defines instances
], function($, _, Backbone, StateMenuModel){


	var ParallaxPageView = Backbone.View.extend({

		
	    // binds view to the existing skeleton of the App already present in the HTML.
	    el: $("#parallax-page"),

	    // at initialization we bind to the relevant events
	    initialize: function() {
	    	
	    	// hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
	    	$(this.el).hide(); 
	    	
	  		// creates an example event listener
	    	this.on('testCall', this.testMethod, this);

      		// initialises the state controller for the menu
      		App.Models.ParallaxPageStateMenuModel = new StateMenuModel;

		
	    },

    	
    	// method for the eventlistener
	    testMethod: function (e) {
	       console.log('ParallaxPageView testMethod');
	    },
	    

	    // scrolls to an element id, determines the yOffset
	    scrollTo: function (id) {	

	    	var scrollOffset = App.Models.ConfigModel.scrollToOffset;
			var scrollElement = 'html, body';

			$target = $("*[data-value='" + id +"']");

			if($target.length === 0){
				console.log('ERROR: could not find element: [data-value='+ id + ']');
				
			} else {
				var targetValue = $target.offset().top - scrollOffset;
				$(scrollElement).stop().animate({
					'scrollTop': targetValue
				}, 600, 'easeInOutCirc', function() {
					//$(scrollElement).css('scrollTop', targetValue);
				});
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
	    	
	    	var me = this;

	    	// submenu clicking
			$("#parallax-page .signup").on("click", App.Models.ConfigModel.eventObj, signupHandler);
			function signupHandler(){
				me.scrollTo("signup");
			}
	    	
	    	// submenu clicking
			$("#parallax-page .submenu-wrapper a").on("click", App.Models.ConfigModel.eventObj, submenuHandler);
			
			// clears the selected items
			App.Models.ParallaxPageStateMenuModel.selectMenuItem('null', "#parallax-page .submenu-wrapper", "a", ".menu-item-");


			function submenuHandler(){

				if($(this).data('clickvalue')){
					var targetId = $(this).data('clickvalue');
					App.Views.ParallaxPageView.scrollTo(targetId);

					// updates the uri hash, but does not route
					App.Router.navigate("/parallax/"+targetId, { trigger: false });
				}				

				$("#parallax-page .expanded").removeClass('expanded');
			}
			

			// checks if the device is a touch screen
			if (App.Models.ConfigModel.touch === true) {
				// IS A TOUCH SCREEN
				// change styles here
				//$('#parallax-page .submenu').parent().addClass('sticky');
				var thisCorrectsJSLint = null;

				$('#parallax-page .submenu-wrapper').addClass('sticky');
				$('#parallax-page .submenu-placeholder').addClass('sticky');

			} else {
				// IS NOT A TOUCH SCREEN
				// regular waypoint settings
				
				// waypoont throttle
		    	$.waypoints.settings.scrollThrottle = 30;

		    	// SECTION WAYPOINT
		    	// determines which section the waypoint is at	
		    	$('#parallax-page .waypoint-section').waypoint(function(e, direction) {
		    		var $active = $(this);

		    		// defines the previous section if scrolling up
					if (direction === 'up') {
						if($active.prev().attr("class") === "waypoint-section"){
							// has not reached top
							$active = $active.prev();
						} else {
							// has reached top
							$active.end();
						}						
					}

					if (!$active.length) $active.end();

					var sectionValue = $active.data('value');

					App.Models.ParallaxPageStateMenuModel.selectMenuItem(sectionValue, "#parallax-page .submenu-wrapper", "a", ".menu-item-");

					// updates the uri hash, but does not route
					//App.Router.navigate("/parallax/"+sectionValue, { trigger: false });
				   
				}, {
				   offset: "25%", 
				   onlyOnScroll: true
				});

		    	// MODEUL WAYPOINTS
		    	// determines which modules to display	
				$('#parallax-page .waypoint-module').waypoint(function(e, direction) {
					//console.log($(this).hasClass('item-1'));

		    		// item
					if($(this).hasClass('item-1')){
						if (direction === 'down') {
							TweenLite.to($("#parallax-page .item-1 .inner-item-1"), 1.5, {css:{"width":"100%",	"height":"100%"}, 	ease:Power4.easeInOut});
						} else {
							TweenLite.to($("#parallax-page .item-1 .inner-item-1"), 1.5, {css:{"width":"0%",	"height":"0%"}, 	ease:Power4.easeInOut});
						}												
					}

		    		// item
					if($(this).hasClass('item-2')){
						if (direction === 'down') {
							TweenLite.to($("#parallax-page .item-2 .inner-item-1"), 1.5, {css:{autoAlpha:1}, 	ease:Power4.easeInOut});
						} else {
							TweenLite.to($("#parallax-page .item-2 .inner-item-1"), 1.5, {css:{autoAlpha:0}, 	ease:Power4.easeInOut});
						}												
					}

				   
				}, {
				   offset: "75%", 
				   onlyOnScroll: true
				});


				
				// anchor smooth scrolling
				var scrollElement = 'html, body';
				$('html, body').each(function () {
					var initScrollTop = $(this).attr('scrollTop');
					$(this).attr('scrollTop', initScrollTop + 1);
					if ($(this).attr('scrollTop') == initScrollTop + 1) {
						scrollElement = this.nodeName.toLowerCase();
						$(this).attr('scrollTop', initScrollTop);
						return false;
					}   
				});

				
				// clears sticky class
				$('#parallax-page .submenu-wrapper').removeClass('sticky');
				$('#parallax-page .submenu-placeholder').removeClass('sticky');
				

		    	// SUBMENU WAYPOINT
		    	// determines the subenu stickiness
				$('#parallax-page .submenu-wrapper').waypoint(function(event, direction) {
					
					// fixes browser resize bug
					if(direction == "up" && $(document).scrollTop() < $('#parallax-page .submenu-placeholder').position().top+30){
						$(this).toggleClass('sticky', direction === "down");
						$("#parallax-page .submenu-placeholder").toggleClass('sticky', direction === "down");
					}
					if(direction == "down"){
						$(this).toggleClass('sticky', direction === "down");
						$("#parallax-page .submenu-placeholder").toggleClass('sticky', direction === "down");
					}					
					event.stopPropagation();
				});

			}
			
			
	    },

    	// removes eventlisteners
	    removeEventListeners: function () {	       
	    	// removes an event listeners
	    	
	    	
	    	// removes submenu nav event
	    	$("#parallax-page .submenu-wrapper a").off();
			
			// checks if the device is a touch screen
			if (App.Models.ConfigModel.touch === true){
				// IS A TOUCH SCREEN
				var thisCorrectsJSLint = null;
			} else {
				// IS NOT A TOUCH SCREEN
	    		$('#parallax-page .waypoint-section').waypoint('destroy');
	    		$('#parallax-page .submenu-wrapper').waypoint('destroy');
	    	}
	    }

	});




    // require js: defines function/s to be accessed by require js
    return ParallaxPageView;

});
