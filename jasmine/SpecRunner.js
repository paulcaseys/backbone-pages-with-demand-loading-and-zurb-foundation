
/**
 * Filename: js/app/AppConfig
 *
 * defines the app paths and initialises the app
 *
 */
//
/*jslint browser: true, devel: true */

// APP STRUCTURE
// defines the app structure
var App = {};
App.Views = {};
App.Models = {};
App.Collections = {};
App.Data = {};





require.config({
  baseUrl: "../../js/",
  urlArgs: 'cb=' + Math.random(),
  paths: {
            // paths to common libraries
            'jquery':       '../resources/js/libs/jquery/jquery-min',
            'backbone':     '../resources/js/libs/backbone/backbone-min',
            'underscore':   '../resources/js/libs/underscore/underscore-min',
            'json':         '../resources/js/libs/json2/json2',

            // testing libraries
            'jasmine':      '../test/libs/jasmine',
            'jasmine-html': '../test/libs/jasmine-html',
            'spec':         '../test/jasmine/spec/',

            // paths to the example model
            'App.Models.ExampleModel':           '../resources/js/app/models/ExampleModel'

  },
  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    }
  }
});


window.store = "TestStore"; // override local storage store name - for testing

require(['underscore', 'jquery', 'jasmine-html'], function(_, $, jasmine){

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [];

  specs.push('spec/models/ExampleModelSpec');
  /*specs.push('spec/views/ClearCompletedSpec');
  specs.push('spec/views/CountViewSpec');
  specs.push('spec/views/FooterViewSpec');
  specs.push('spec/views/MarkAllSpec');
  specs.push('spec/views/NewTaskSpec');
  specs.push('spec/views/TaskListSpec');
  specs.push('spec/views/task/TaskViewSpec');
  specs.push('spec/views/task/ViewTaskViewSpec');
  specs.push('spec/views/task/EditTaskViewSpec');

*/
  $(function(){
    require(specs, function(){
      jasmineEnv.execute();
    });
  });


});
