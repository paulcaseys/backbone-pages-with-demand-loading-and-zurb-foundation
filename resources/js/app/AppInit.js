
/**
 * Filename: js/app/AppInit
 *
 * initialises the views
 * 
 */
// 


// require js: defines the required js libraries and app files
define([

  // required libraries
  'jquery',
  'underscore',
  'backbone',

  // required app router
  'App.Router',

  // required models
  'App.Models.ConfigModel',
  'App.Models.StateModel',
  'App.Models.StateMenuModel',

  // required views
  'App.Views.HomePageView',
  'App.Views.GalleryPageView',
  'App.Views.HelpPageView',
  'App.Views.RaphaelPageView',
  'App.Views.ParallaxPageView',
  'App.Views.ExamplePageView'



// require js: defines instances
], function($, _, Backbone, Router, ConfigModel, StateModel, StateMenuModel, HomePageView, GalleryPageView, HelpPageView, RaphaelPageView, ParallaxPageView, ExamplePageView){


    

    // initialises various  app views
    var initialize = function(){

      // initialises the app configuration (eg: App.Models.ConfigModel.browserRatioNum)
      App.Models.ConfigModel = new ConfigModel;
      
      // initialises the state controller
      App.Models.PageStateModel = new StateModel;

      // initialises the state controller for the menu
      App.Models.PageStateMenuModel = new StateMenuModel;

      // initialises the views onto the page
      App.Views.HomePageView = new HomePageView;
      App.Views.GalleryPageView = new GalleryPageView;
      App.Views.HelpPageView = new HelpPageView;
      App.Views.RaphaelPageView = new RaphaelPageView;
      App.Views.ParallaxPageView = new ParallaxPageView;
      App.Views.ExamplePageView = new ExamplePageView;

      // initialises the router
      Router.initialize();

      // calls eventlisteners in the view, as an example
      App.Views.HomePageView.trigger("testCall");
      App.Views.GalleryPageView.trigger("testCall");
      App.Views.HelpPageView.trigger("testCall");
      App.Views.RaphaelPageView.trigger("testCall");
      App.Views.ParallaxPageView.trigger("testCall");
      App.Views.ExamplePageView.trigger("testCall");

      // hides the loading div (if it exists)
      if ($("#loading-page").length > 0){
        $("#loading-page").hide();
      }
      

    };
  

    

    // require js: defines function/s to be accessed by require js
    return {
      initialize: initialize
    };


});
