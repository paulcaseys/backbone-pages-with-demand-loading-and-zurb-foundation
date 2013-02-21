
/**
 * Filename: js/app/models/ConfigModel
 *
 * config model
 *
 */
//


// require js: defines the required js libraries and app files
define([

  // required libraries
  'jquery',
  'underscore',
  'backbone',
  'modernizr'


// require js: defines instances
], function($, _, Backbone){

    // Todo Model
    // ----------
    // Our basic **Todo** model has `title`, `order`, and `done` attributes.
    var ConfigModel = Backbone.Model.extend({


        // default values
        defaults: function() {


          this.body = $('body');
          this.html = $('html');
          this.touch = false;
          this.videoType = 'mp4';

          // checks modernizr for video
          if (Modernizr.video.h264) {
            this.videoType = 'mp4';
          } else if (Modernizr.video.webm){
            this.videoType = 'webm';
          } else if (Modernizr.video.ogg){
            this.videoType = 'ogv';
          }

          // detects if touchscreen
          this.touch = 'ontouchstart' in document.documentElement;

          // detects the type of events to bind
          this.eventType = this.touch ? 'touchend' : 'click';

          // defines a null object to bind to events
          this.eventObj = {};

          this.bodyId = this.body.attr('id');
          this.imgRatioNum = 1600/950;
          this.videoRatioNum = 640/360;
          this.headerOffset = 45;
          this.scrollToOffset = 100;

          // defines the window dimensions
          this.defineWindowDimensions();

          // triggered when browser is resized
          $(window).resize(this.defineWindowDimensions);

          // debugging console for IE
          this.debug = $("<div style='padding:10px;background:#FFF;position:fixed;top:0;left:0;color:#000;font-size:12px;z-index:999'>");

          /* DEBUGGING CONSOLE for old browsers
          // copy + paste the details below
          -----------------------------------
          $('html').append(App.Models.ConfigModel.debug);
          App.Models.ConfigModel.debug.html('- test debug <br>');
          App.Models.ConfigModel.debug.append('- line two <br>');
          App.Models.ConfigModel.debug.append('- another line <br>');
          */

        },

        // defines the window dimensions
        defineWindowDimensions: function() {
          this.windowHeight = $(window).height();
          this.windowWidth = $(window).width();
          this.browserRatioNum = this.windowWidth/this.windowHeight;

        }



    });






    // require js: defines function/s to be accessed by require js
    return ConfigModel;

});