
/**
 * Filename: js/app/models/GalleryModel
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

    // Gallery Model
    var GalleryModel = Backbone.Model.extend({

      // default url for json
      //url: 'data/GalleryData.json?asdf=asd',

      // Default attributes 
      defaults: function() {
        return {
          page_title: "No Title...",
          page_image_url: "http:",
          vote_count: "10"
        };
      }



    });
     





    // require js: defines function/s to be accessed by require js
    return GalleryModel;

});