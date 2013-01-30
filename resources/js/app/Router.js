
/**
 * Filename: js/app/router
 *
 * routes uris and logs a history
 * 
 */
// 


// require js: defines the required js libraries and app files
define([

  // required libraries
  'jquery',
  'underscore',
  'backbone'

  // required views
  //'App.Views.TodoPageView',
  //'App.Views.ExamplePageView'



// require js: defines instances
], function($, _, Backbone){

    var AppRouter = Backbone.Router.extend({
        routes: {
            "gallery/": "getGallery",
            "help/:id": "getHelp",
            "datavis/": "getDatavis",
            "raphael/": "getRaphael",
            "parallax/:id": "getParallax",
            "example/": "getExample",
            "*actions": "defaultRoute" // Backbone will try match the route above first
        },



        defaultRoute: function(){
            console.log('route: home');
            App.Models.PageStateModel.showView(App.Views.HomePageView);
            App.Models.PageStateMenuModel.selectMenuItem(1, "#menu", "a", ".menu-item-");
        },
        getGallery: function(){
            console.log('route: gallery');
            App.Models.PageStateModel.showView(App.Views.GalleryPageView);
            App.Models.PageStateMenuModel.selectMenuItem(2, "#menu", "a", ".menu-item-");
        },
        getHelp: function(id){
            console.log('route: help '+ id );
            App.Models.PageStateModel.showView(App.Views.HelpPageView);
            App.Models.PageStateMenuModel.selectMenuItem(3, "#menu", "a", ".menu-item-");

            // defines which panel to display 
            App.Models.HelpPanelsStateModel.showView(App.Views["HelpPanelView"+id]);

            // selects a menu item
            App.Models.HelpPanelStateMenuModel.selectMenuItem(id, "#help-page .submenu", "a", ".menu-item-");
            
        },
        getDatavis: function(){
            console.log('route: datavis');
            App.Models.PageStateModel.showView(App.Views.DatavisPageView);
            App.Models.PageStateMenuModel.selectMenuItem(4, "#menu", "a", ".menu-item-");
        },
        getRaphael: function(){
            console.log('route: raphael');
            App.Models.PageStateModel.showView(App.Views.RaphaelPageView);
            App.Models.PageStateMenuModel.selectMenuItem(5, "#menu", "a", ".menu-item-");
        },
        getParallax: function(id){
            console.log('route: raphael');
            App.Models.PageStateModel.showView(App.Views.ParallaxPageView);
            App.Models.PageStateMenuModel.selectMenuItem(6, "#menu", "a", ".menu-item-");

            setTimeout(function() { App.Views.ParallaxPageView.scrollTo(id); },100);

        },
        getExample: function(){
            console.log('route: example');
            App.Models.PageStateModel.showView(App.Views.ExamplePageView);
            App.Models.PageStateMenuModel.selectMenuItem(7, "#menu", "a", ".menu-item-");
        }


    });



  
    


    var initialize = function(){

        // Instantiate the router
        App.Router = new AppRouter;

        // Start Backbone history a necessary step for bookmarkable URL's
        Backbone.history.start();
    };

    // require js: defines function/s to be accessed by require js
    return {
      initialize: initialize
    };


});