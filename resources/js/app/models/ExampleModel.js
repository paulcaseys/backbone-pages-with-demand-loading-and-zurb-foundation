
/**
 * Filename: js/app/models/ExampleModel
 *
 * example model
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

    // Todo Model
    // ----------
    // Our basic **Todo** model has `title`, `order`, and `done` attributes.
    var ExampleModel = Backbone.Model.extend({

      // Default attributes for the todo item.
      defaults: function() {
        return {
          personName: "No Name...",
          order: 1,
          done: false
        };
      }

    });
     





    // require js: defines function/s to be accessed by require js
    return ExampleModel;

});