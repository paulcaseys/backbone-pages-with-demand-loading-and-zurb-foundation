
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
  'backbone'//,
  //'raphael'

  // required collections
  //'App.Collections.HelloWorldCollection'

  // required models  
  //'App.Models.HelloWorldModel'

// require js: defines instances
], function($, _, Backbone){


	var RaphaelPageView = Backbone.View.extend({

		
	    // binds view to the existing skeleton of the App already present in the HTML.
	    el: $("#raphael-page"),

	    // at initialization we bind to the relevant events
	    initialize: function() {
	    	
	    	// hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
	    	$(this.el).hide(); 
	    	
	  		// creates an example event listener
	    	this.on('testCall', this.testMethod, this);

	    },

    	
    	// method for the eventlistener
	    testMethod: function (e) {
	       console.log('RaphaelPageView testMethod');
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
            //console.log(Raphael);

            
             // Grab the data
                var data = [],
                    axisx = [],
                    axisy = [],
                    table = $("#for-chart");
                $("tbody td", table).each(function (i) {
                    data.push(parseFloat($(this).text(), 10));
                });
                table.hide();
                $("tbody th", table).each(function () {
                    axisy.push($(this).text());
                });
                $("tfoot th", table).each(function () {
                    axisx.push($(this).text());
                });

                this.raph = Raphael("chart", width, height);

                                // Draw
                var width = 470,
                    height = 200,
                    leftgutter = 60,
                    rightgutter = 20,
                    bottomgutter = 20,
                    topgutter = 40,
                    //r = Raphael("chart", width, height),
                    txt = {"font": '10px Arial', stroke: "none", fill: "#555"},
                    X = (width - leftgutter -rightgutter) / axisx.length,
                    Y = (height - bottomgutter +topgutter) / axisy.length,
                    color = $("#chart").css("color");
                    max = Math.round(X / 2) - 1;
                // r.rect(0, 0, width, height, 5).attr({fill: "#000", stroke: "none"});
                for (var i = 0, ii = axisx.length; i < ii; i++) {
                    this.raph.text(leftgutter + X * (i + 0.5), 240, axisx[i]).attr(txt);
                }
                for (var i = 0, ii = axisy.length; i < ii; i++) {
                    this.raph.text(20, Y * (i + 0.5), axisy[i]).attr(txt);
                }
                var o = 0;
                for (var i = 0, ii = axisy.length; i < ii; i++) {
                    for (var j = 0, jj = axisx.length; j < jj; j++) {
                        var R = data[o] && Math.min(Math.round(Math.sqrt(data[o] / Math.PI) * 4), max);
                        if (R) {
                            (function (dx, dy, R, value) {

                                var color = "hsb(" + [(1 - R / max / 2) * 0.9,  0.5, 0.85] + ")";
                                var dt = App.Views.RaphaelPageView.raph.circle(dx + 60 + R, dy + 10, R*1.5).attr({stroke: "none", fill: color});
                                if (R < 6) {
                                    var bg = App.Views.RaphaelPageView.raph.circle(dx + 60 + R, dy + 10, 6).attr({stroke: "none", fill: "#000", opacity: 0.4}).hide();
                                }
                                var lbl = App.Views.RaphaelPageView.raph.text(dx + 60 + R, dy + 10, data[o]).attr({"font": '10px Arial', stroke: "none", fill: "#fff"}).hide();
                                var dot = App.Views.RaphaelPageView.raph.circle(dx + 60 + R, dy + 10, max).attr({stroke: "none", fill: "#000", opacity: 0});
                                // animate in
                                dt.attr('transform', "s0 0");
                                dt.animate({'transform':"s1 1"}, 1000*j, "elastic");
                                dot[0].onmouseover = function () {
                                    if (bg) {
                                        bg.show();
                                    } else {
                                        var clr = Raphael.rgb2hsb(color);
                                        clr.b = 0.5;
                                        //dt.attr("fill", Raphael.hsb2rgb(clr).hex);
                                        dt.animate({ fill: Raphael.hsb2rgb(clr).hex, opacity: 0.95}, 500, 'easeOutCirc');
                                    }
                                    lbl.show();
                                };
                                dot[0].onmouseout = function () {
                                    if (bg) {
                                        bg.hide();
                                    } else {
                                        dt.animate({ fill: color, opacity: 1}, 500, 'easeOutQuad');
                                        //dt.attr("fill", color);
                                    }
                                    lbl.hide();
                                };
                            })(leftgutter + X * (j + 0.5) - 60 - R, Y * (i + 0.5) - 10, R, data[o]);
                        }
                        o++;
                    }
                }


	    },

    	// removes all eventlisteners
	    transitionOut: function () {	       
	    	// removes eventlisteners    
	    	this.removeEventListeners();	

	    	// basic way to hide element
	    	$(this.el).hide();  

            // removes raph when leaving page
            App.Views.RaphaelPageView.raph.clear();
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
    return RaphaelPageView;

});
