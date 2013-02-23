
/**
 * Filename: js/app/views/GalleryPageView
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
  'cosmosimageloader',

  // required collections
  'App.Collections.GalleryCollection',

  // required models
  'App.Models.GalleryModel'

// require js: defines instances
], function($, _, Backbone, CosmosImageLoader, GalleryCollection, GalleryModel){


  var GalleryPageView = Backbone.View.extend({


        // binds view to the existing skeleton of the App already present in the HTML.
        el: $("#gallery-page"),

        // target for gallery
        galleryItemsTarget: $('#gallery-items-target'),

        // at initialization we bind to the relevant events
        initialize: function() {

        // hides the element until App.Models.StateModel.showView(WheteverView) calls the transitionIn() function
        $(this.el).hide();

        // creates an example event listener
        this.on('testCall', this.testMethod, this);

        },

        // addes content from the correlating model, when it is loaded
        addContentFromFeed: function() {

            // ewmoving notification
            this.galleryItemsTarget.html('');

            // defines the current collection
            var curCollection = App.Collections.GalleryCollection;

            // loops through collection
            for (var i=0; i < curCollection.dataLoaded.length; i++) {
                curCollection.dataLoaded[i].id = i;
                var curObj = curCollection.dataLoaded[i];
                this.createItem(curObj);

            }

        },

        // creates an item on the page
        createItem: function (curObj) {
            //console.log(curObj.page_title);
            // <img src="'+curObj.page_image_url+'">
            this.galleryItemsTarget.append('<div class="four columns"><div class="panel"><a href="'+curObj.detail_Gen1+'" target="_blank"> <h6>'+curObj.page_title+'</h6><div class="image-target-image-container image-loader-target-'+curObj.id+'"></div></a></div></div>');
            var _il1 = new Cosmos.Utils.ImageLoaderWithRescaleSlideShow('.image-loader-target-'+curObj.id, [{"img":curObj.page_image_url}], 1000, 1000, "rescaleEnabled", "centreEnabled", "elementResizeListenerEnabled");

        },


        // method for the eventlistener
        testMethod: function (e) {
            console.log('GalleryPageView testMethod');
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

            // loading notification
            this.galleryItemsTarget.html('<div class="four columns"><br>Loading...</div>');

            //loads the collection
            App.Collections.GalleryCollection.loadLatest();


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
    return GalleryPageView;

});
