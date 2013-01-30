
/**
 * Filename: js/app/collections/ExampleCollection
 *
 * collection of models
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
  //'App.Collections.ExampleCollection',

  // required models  
  //'App.Models.ExampleModel',

  // required views
  //'App.Views.ExamplePageView',



// require js: defines the 
], function($, _, Backbone){

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var ExampleCollection = Backbone.Collection.extend({

    
    // Reference to this collection's model.
    //model: TodoModel,
    inititlaize: function () {
      //this.model = ExampleModel;
    }

 
  });






    // require js: defines function/s to be accessed by require js
    return ExampleCollection;

});