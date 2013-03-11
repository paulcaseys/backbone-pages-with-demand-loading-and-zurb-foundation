
// require js: defines the required js libraries and app files
define([

  // required libraries
  'jquery',
  'underscore',
  'backbone',

  // example model
  'App.Models.ExampleModel'


// require js: defines instances
], function($, _, Backbone, ExampleModel){



    beforeEach(function () {
        me = this;
        me.mockData = { title: 'Foo Bar', timestamp: new Date().getTime() };
        App.Models.ExampleModel = new ExampleModel();

    });




  describe('JavaScript addition operator', function () {
      it('example model has a default value', function () {
          expect(App.Models.ExampleModel.defaults).not.toBe(null);
      });
  });


});