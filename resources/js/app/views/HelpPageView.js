
/**
 * Filename: js/app/views/HelpPageView
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
  'App.Views.HelpPanelView'


  // required collections
  //'App.Collections.HelloWorldCollection'

  // required models
  //'App.Models.HelloWorldModel'

// require js: defines instances
], function($, _, Backbone, StateModel, StateMenuModel, HelpPanelView){


    var HelpPageView = Backbone.View.extend({


        // binds view to the existing skeleton of the App already present in the HTML.
        el: $("#help-page"),



        // at initialization we bind to the relevant events
        initialize: function() {


            // hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
            $(this.el).hide();

            // creates an example event listener
            this.on('testCall', this.testMethod, this);

            // initialises the state model/controller
            App.Models.HelpPanelsStateModel = new StateModel();

            // initialises the state controller for the menu
            App.Models.HelpPanelStateMenuModel = new StateMenuModel();

            // creates three panel views
            App.Views.HelpPanelView1 = new HelpPanelView({el: '#help-panel-1'});
            App.Views.HelpPanelView2 = new HelpPanelView({el: '#help-panel-2'});
            App.Views.HelpPanelView3 = new HelpPanelView({el: '#help-panel-3'});


        },


        // method for the eventlistener
        testMethod: function (e) {
           console.log('HelpPageView testMethod');
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
    return HelpPageView;

});
