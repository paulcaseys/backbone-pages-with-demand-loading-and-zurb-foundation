
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
  //'App.Collections.HelloWorldCollection'

  // required models  
  'App.Models.GalleryModel'

// require js: defines instances
], function($, _, Backbone, CosmosImageLoader, GalleryModel){


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

      // loops through the JSON array
      onDataLoadComplete: function (response, dataResponse) {
        //console.log(response);
        //console.log(dataResponse[0].page_title);
        
        // clears the target 
        App.Views.GalleryPageView.galleryItemsTarget.html('');

        // loops through the dataResponse array
        for (var i = 0; i < dataResponse.length; i++) {
          dataResponse[i].id = i;
          App.Views.GalleryPageView.createItem(dataResponse[i]);
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

        // loads the gallery items
        var GItems = new GalleryModel;
        //GItems.url = App.Data.GalleryData;
        GItems.url = "http://cosmos.is/api/service/data/format/jsonp/?project_name=SummerAtTarget&project_password=6CB4816A23A965B5DFD58E45F4C23&table=unique_references&batch=1&batchSize=6&whereConditionArray=project_id||9&select=*&orderBy=vote_count||desc&callback=?"
        GItems.type = 'GET';
        GItems.dataType = 'jsonp';
        GItems.fetch({success: this.onDataLoadComplete});

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
