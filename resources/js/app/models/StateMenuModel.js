
/**
 * Filename: js/app/models/StateMenuModel
 *
 * manages the menu items
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


    // defines model
    var StateMenuModel = Backbone.Model.extend({

      /**
       * selects a menu item and clears the selction of the other menu items in that container
       * @param  {[int]}    itemNumber                  the number of the menu item you want to select
       * @param  {[string]} container                   the id or class of the 
       * @param  {[string]} selectionGroup              the group of items that the class is associated with (usually "a" or "li" )
       * @param  {[string]} uiniqueSelectionClassForId  the class that the itemNumber will be appended to (eg: "menu-item-")
       */
      
      // Example of defining it (only do this once)
      // App.Models.PageStateMenuModel = new StateMenuModel;
      // 
      // Example of calling it 
      // App.Models.PageStateMenuModel.selectMenuItem(3, "#menu", "a", ".menu-item-");
      // 
      // To clear all active states: call an itemNumber that does not exist
      // App.Models.PageStateMenuModel.selectMenuItem(10000000000, "#menu", "a", ".menu-item-");
      // 
      // Example of what the final selection looks like
      // $("#menu a.menu-item-"+itemNumber).addClass('active');
      
      selectMenuItem: function(itemNumber, container, selectionGroup, uiniqueSelectionClassForId){
        
        // selects a menu item
        $(container+" "+selectionGroup).removeClass('active');

        //checks if the assigned element actually exists
        if($(container+" "+selectionGroup+""+uiniqueSelectionClassForId+""+itemNumber).length === 0){
          // NO ELEMENT EXISTS!!
          console.log("CLEARING ALL MENU ACTIVE STATES in selectMenuItem(); : possible error : no element at $("+container+" "+selectionGroup+""+uiniqueSelectionClassForId+""+itemNumber+");");
        } else {
          // ELEMENT EXISTS
          $(container+" "+selectionGroup+""+uiniqueSelectionClassForId+""+itemNumber).addClass('active');
        }
        

        
      }
      
    });
     





    // require js: defines function/s to be accessed by require js
    return StateMenuModel;

});