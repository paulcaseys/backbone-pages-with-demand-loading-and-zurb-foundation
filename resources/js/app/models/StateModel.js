
/**
 * Filename: js/app/models/StateModel
 *
 * manages the views
 * 
 */
// 


// require js: defines the required js libraries and app files
define([

  // required libraries
  'jquery',
  'underscore',
  'backbone'

// require js: defines instances
], function($, _, Backbone){

    // defines model
    var StateModel = Backbone.Model.extend({

      
      showView: function(view){
        // checks if there was a previous view
        if(this.currentView != undefined){
            // removes the previous view
            this.currentView.transitionOut();
        }
        // defines the new view
        this.currentView = view;

        // transitions the new view in
        this.currentView.transitionIn();


        
      }
      
    });
     





    // require js: defines function/s to be accessed by require js
    return StateModel;

});