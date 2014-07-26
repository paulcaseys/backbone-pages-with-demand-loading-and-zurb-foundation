
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
  'backbone',

  // required collections
  //'App.Collections.ExampleCollection',

  // required models
  'App.Models.GalleryModel'

  // required views
  //'App.Views.ExamplePageView',



// require js: defines the
], function($, _, Backbone, GalleryModel){

  // Todo Collection
  // ---------------

  var GalleryCollection = Backbone.Collection.extend({

    model: GalleryModel,
    dataLoaded: null,

    loadLatest: function () {
        var me = this;

        // loads the feature items
        var CosmosItems = new GalleryModel();
        CosmosItems.url = "http://cosmosis-api.com/api/service/data/format/jsonp/?project_name=SummerAtTarget&project_password=6CB4816A23A965B5DFD58E45F4C23&table=unique_references&batch=1&batchSize=6&whereConditionArray=project_id||9&select=*&orderBy=vote_count||desc&callback=?";
        CosmosItems.type = 'GET';
        CosmosItems.dataType = 'jsonp';
        CosmosItems.fetch({success: onDataLoadComplete});

        function onDataLoadComplete(response, dataResponse) {
          me.dataLoaded = dataResponse;
          App.Views.GalleryPageView.addContentFromFeed();
        }


    }


  });






    // require js: defines function/s to be accessed by require js
    return GalleryCollection;

});