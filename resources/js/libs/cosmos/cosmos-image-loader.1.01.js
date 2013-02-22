/*
cosmos-image-loader plugin v1.01
---
http://github.com/paulcaseys/ImageLoaderWithRescaleSlideShow
http://paulcasey.net
@paulcaseys
*/

if (!window.Cosmos) {
    window.Cosmos = {};
}

if (!window.Cosmos.Utils) {
    window.Cosmos.Utils = {};
}

// CONSOLE FIX
// Avoid `console` errors in browsers that lack a console (from html5 boilerplate)
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



$(document).ready(function(){ 
});

Cosmos.Utils.ImageLoaderWithRescaleSlideShow = function(theTargetElement, theImageArray, theIntervalSpeed, theFadeSpeed, theRescale, theCentre, theElementResizeListener, varObj) {
	
	var me = this;

	$(theTargetElement).data("theTargetElement", theTargetElement);
	$(theTargetElement).data("theImageArray", theImageArray);
	$(theTargetElement).data("theImageArrayLength", theImageArray.length);
	$(theTargetElement).data("theIntervalSpeed", theIntervalSpeed);
	$(theTargetElement).data("theFadeSpeed", theFadeSpeed);
	$(theTargetElement).data("theRescale", theRescale);
	$(theTargetElement).data("theCentre", theCentre);
	$(theTargetElement).data("theElementResizeListener", theElementResizeListener);

	varObj = typeof varObj !== 'undefined' ? varObj : new Object();	
	varObj.success = typeof varObj.success !== 'undefined' ? varObj.success : '';	
	varObj.change = typeof varObj.change !== 'undefined' ? varObj.change : '';	
	varObj.error = typeof varObj.error !== 'undefined' ? varObj.error : '';			

	$(theTargetElement).data("varObj", varObj);
	

	$(theTargetElement).data("theCurrentImageId", 0);


	$(theTargetElement).css('overflow', "hidden");



	for (var i=0; i<theImageArray.length; i++) {
		$(theTargetElement).append('<div class="imageLoaderInnerContainer imageLoaderInnerContainer'+i+'"> </div>');
		if(theImageArray[i]["background-color"]){
			$(theTargetElement+" .imageLoaderInnerContainer"+i).css({"background-color":theImageArray[i]["background-color"]});
		}
		$(theTargetElement+" .imageLoaderInnerContainer"+i).append($('<img>', {
	    	src:   theImageArray[i].img,
	    	'class': 'appendedImage appendedImage'+i,
	    	'style': '-ms-interpolation-mode: bicubic;', // smooths image in older v\versions of IE, may cause a slight edge
	    	'data-imgId': i
	    }));
	}



	$(theTargetElement +' .appendedImage').hide();

	$(theTargetElement +' .appendedImage').imagesLoaded(function( $images, $proper, $broken ) {
		
		if($broken.length > 0){
			console.log('ERROR in ImageLoaderWithRescaleSlideShow(): ' + $broken.length + ' broken image "'+this.attr('src')+'"' );			
			if(varObj.error !== ''){
				varObj.error($(theTargetElement));
			}	
		}
		if($proper.length > theImageArray.length-1){
			
			// ALL LOADED
			
			// positions the image
			Cosmos.Utils.PositionImage(theTargetElement, varObj);

			$(theTargetElement +' .imageLoaderInnerContainer').hide();
			$(theTargetElement +' .appendedImage').show();

			if(theImageArray.length > 1){
				// MULTIPLE IMAGES
				Cosmos.Utils.PlaySlideshow(theTargetElement, varObj);
				me.slideshowInterval = setInterval(function() { Cosmos.Utils.PlaySlideshow(theTargetElement, varObj); }, theIntervalSpeed+theFadeSpeed);

			} else {
				// ONE IMAGE
				Cosmos.Utils.DisplayImage(theTargetElement, 0, theFadeSpeed, varObj);
			}	


			// re-positions image/s if the div is re-sized 
			if(theElementResizeListener == "elementResizeListenerEnabled") {
				$(theTargetElement).resize(function(e){
					Cosmos.Utils.PositionImage($(theTargetElement).data("theTargetElement"), varObj);
				});
			}

			// triggers event listeners
			$(theTargetElement).trigger('IMAGE_LOADED');
			
			if(varObj.success !== ''){
				varObj.success($(theTargetElement));
			}			

		}
    });



};

Cosmos.Utils.PlaySlideshow = function(theTargetElement, varObj) {

	//var theTargetElement = 	$(theTargetElementRef).data("theTargetElement");
	var theImageArray = 		$(theTargetElement).data("theImageArray");
	var theImageArrayLength = 	parseInt($(theTargetElement).data("theImageArrayLength"), 10);
	var theIntervalSpeed = 		$(theTargetElement).data("theIntervalSpeed");
	var theFadeSpeed = 			$(theTargetElement).data("theFadeSpeed");
	var theRescale = 			$(theTargetElement).data("theRescale");
	var theCentre = 			$(theTargetElement).data("theCentre");


	var theTargetImageId = parseInt($(theTargetElement).data("theCurrentImageId"), 10);

	// displays the image
	Cosmos.Utils.DisplayImage(theTargetElement, theTargetImageId, theFadeSpeed, varObj);

	// defines the next image
	var theCurrentImageId = 0;
	if(theTargetImageId+1 < theImageArrayLength) {
		theCurrentImageId = theTargetImageId+1;
	}

	$(theTargetElement).data("theCurrentImageId", theCurrentImageId);

};



Cosmos.Utils.DisplayImage = function(theTargetElement, theTargetImageId, theFadeSpeed, varObj) {

	// loops through all the images
	var index_highest = 0;   
	$(theTargetElement+" .imageLoaderInnerContainer").each(function() {
	    // always use a radix when using parseInt
	    var index_current = parseInt($(this).css("zIndex"), 10);
	    if(index_current > index_highest) {
	        index_highest = index_current;
	    }
	});

	var curImage = theTargetElement + " .imageLoaderInnerContainer"+theTargetImageId;
	var curImageSrc = $(curImage+" img").attr("src");

	$(theTargetElement).data("curImage", curImage);
	$(theTargetElement).data("curImageSrc", curImageSrc);
	$(theTargetElement).data("curImageId", theTargetImageId);

	if(varObj){
		if(varObj.change !== ''){
			varObj.change($(theTargetElement));
		}
	}
	

	$(curImage).css({"z-index":index_highest+1, "display": "none"});
	$(curImage).fadeIn(theFadeSpeed);
};

Cosmos.Utils.PositionImage = function(theTargetElement, varObj) {
	

	$(theTargetElement).css({"text-align":"left"});
	$(theTargetElement+" .imageLoaderInnerContainer").css({"overflow":"hidden", "position":"absolute", "width":$(theTargetElement).width(), "height":$(theTargetElement).height()});


	//var theTargetElement = 	$(theTargetElementRef).data("theTargetElement");
	var theImageArray = 	$(theTargetElement).data("theImageArray");
	var theIntervalSpeed = 	$(theTargetElement).data("theIntervalSpeed");
	var theFadeSpeed = 		$(theTargetElement).data("theFadeSpeed");
	var theRescale = 		$(theTargetElement).data("theRescale");
	var theCentre = 		$(theTargetElement).data("theCentre");

	// loops through all the images
	$(theTargetElement+" img").each(function(index) {

		var curImage =			$(this);

		// get target properties 
		var targetWidth = parseInt($(theTargetElement).width(), 10);
		var targetHeight = parseInt($(theTargetElement).height(), 10);
		var targetAspect = targetWidth / targetHeight;

		// Get image properties.		
		var imgWidth = parseInt(curImage.width(), 10);
		var imgHeight = parseInt(curImage.height(), 10);
		var imgAspect = imgWidth / imgHeight;

		// overrides any max widths in the stylesheet
		curImage.css({"max-width": "none"});
		curImage.css({"max-height": "none"});

		// crops and rescales the image
		if(theRescale == "rescaleEnabled"){

			imgHeight = targetHeight;
			imgWidth = Math.round(imgHeight * imgAspect);
			curImage.css({"width": imgWidth, "height": targetHeight +"px"});
			
			if((targetHeight * imgAspect) < targetWidth){
				imgWidth = targetWidth;
				imgHeight = Math.round(imgWidth / imgAspect);
				curImage.css({"width": targetWidth +"px","height":imgHeight});
			}

		} else if (theRescale == "rescaleInnerEnabled"){

			curImage.css({"height": targetHeight +"px", "width": "auto"});
			imgHeight = targetHeight;
			imgWidth = Math.round(imgHeight * imgAspect);
			
			if((targetHeight * imgAspect) > targetWidth){
				curImage.css({"width": targetWidth +"px","height":"auto"});
				imgWidth = targetWidth;
				imgHeight = Math.round(imgWidth / imgAspect);
			}

		}

		// centers the image
		if (theCentre == "centreEnabled") {
			curImage.css({"margin-left": Math.round((targetWidth - imgWidth) / 2) +"px"});			
			curImage.css({"margin-top": Math.round((targetHeight - imgHeight) / 2) +"px"});
			
		} else if (theCentre == "topAlignEnabled") {

			curImage.css({"margin-left": Math.round((targetWidth - imgWidth) / 2) +"px"});			
			curImage.css({"margin-top": "0px"});

		}



	});
}


/*!
 * jQuery imagesLoaded plugin v2.1.0
 * http://github.com/desandro/imagesloaded
 *
 * MIT License. by Paul Irish et al.
 */

/*jshint curly: true, eqeqeq: true, noempty: true, strict: true, undef: true, browser: true */
/*global jQuery: false */

;(function($, undefined) {
'use strict';

// blank image data-uri bypasses webkit log warning (thx doug jones)
var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

$.fn.imagesLoaded = function( callback ) {
	var $this = this,
		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
		hasNotify = $.isFunction(deferred.notify),
		$images = $this.find('img').add( $this.filter('img') ),
		loaded = [],
		proper = [],
		broken = [];

	// Register deferred callbacks
	if ($.isPlainObject(callback)) {
		$.each(callback, function (key, value) {
			if (key === 'callback') {
				callback = value;
			} else if (deferred) {
				deferred[key](value);
			}
		});
	}

	function doneLoading() {
		var $proper = $(proper),
			$broken = $(broken);

		if ( deferred ) {
			if ( broken.length ) {
				deferred.reject( $images, $proper, $broken );
			} else {
				deferred.resolve( $images );
			}
		}

		if ( $.isFunction( callback ) ) {
			callback.call( $this, $images, $proper, $broken );
		}
	}

	function imgLoaded( img, isBroken ) {
		// don't proceed if BLANK image, or image is already loaded
		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
			return;
		}

		// store element in loaded images array
		loaded.push( img );

		// keep track of broken and properly loaded images
		if ( isBroken ) {
			broken.push( img );
		} else {
			proper.push( img );
		}

		// cache image and its state for future calls
		$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

		// trigger deferred progress method if present
		if ( hasNotify ) {
			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
		}

		// call doneLoading and clean listeners if all images are loaded
		if ( $images.length === loaded.length ){
			setTimeout( doneLoading );
			$images.unbind( '.imagesLoaded' );
		}
	}

	// if no images, trigger immediately
	if ( !$images.length ) {
		doneLoading();
	} else {
		$images.bind( 'load.imagesLoaded error.imagesLoaded', function( event ){
			// trigger imgLoaded
			imgLoaded( event.target, event.type === 'error' );
		}).each( function( i, el ) {
			var src = el.src;

			// find out if this image has been already checked for status
			// if it was, and src has not changed, call imgLoaded on it
			var cached = $.data( el, 'imagesLoaded' );
			if ( cached && cached.src === src ) {
				imgLoaded( el, cached.isBroken );
				return;
			}

			// if complete is true and browser supports natural sizes, try
			// to check for image status manually
			if ( el.complete && el.naturalWidth !== undefined ) {
				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
				return;
			}

			// cached images don't fire load sometimes, so we reset src, but only when
			// dealing with IE, or image is complete (loaded) and failed manual check
			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
			if ( el.readyState || el.complete ) {
				el.src = BLANK;
				el.src = src;
			}
		});
	}

	return deferred ? deferred.promise( $this ) : $this;
};

})(jQuery);


/*!
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
// 
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
// 
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
// 
// About: Release History
// 
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // A jQuery object containing all non-window elements to which the resize
  // event is bound.
  var elems = $([]),
    
    // Extend $.resize if it already exists, otherwise create it.
    jq_resize = $.resize = $.extend( $.resize, {} ),
    
    timeout_id,
    
    // Reused strings.
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';
  
  // Property: jQuery.resize.delay
  // 
  // The numeric interval (in milliseconds) at which the resize event polling
  // loop executes. Defaults to 250.
  
  jq_resize[ str_delay ] = 250;
  
  // Property: jQuery.resize.throttleWindow
  // 
  // Throttle the native window object resize event to fire no more than once
  // every <jQuery.resize.delay> milliseconds. Defaults to true.
  // 
  // Because the window object has its own resize event, it doesn't need to be
  // provided by this plugin, and its execution can be left entirely up to the
  // browser. However, since certain browsers fire the resize event continuously
  // while others do not, enabling this will throttle the window resize event,
  // making event behavior consistent across all elements in all browsers.
  // 
  // While setting this property to false will disable window object resize
  // event throttling, please note that this property must be changed before any
  // window object resize event callbacks are bound.
  
  jq_resize[ str_throttle ] = true;
  
  // Event: resize event
  // 
  // Fired when an element's width or height changes. Because browsers only
  // provide this event for the window element, for other elements a polling
  // loop is initialized, running every <jQuery.resize.delay> milliseconds
  // to see if elements' dimensions have changed. You may bind with either
  // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
  // 
  // Usage:
  // 
  // > jQuery('selector').bind( 'resize', function(e) {
  // >   // element's width or height has changed!
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * The polling loop is not created until at least one callback is actually
  //   bound to the 'resize' event, and this single polling loop is shared
  //   across all elements.
  // 
  // Double firing issue in jQuery 1.3.2:
  // 
  // While this plugin works in jQuery 1.3.2, if an element's event callbacks
  // are manually triggered via .trigger( 'resize' ) or .resize() those
  // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
  // events system. This is not an issue when using jQuery 1.4+.
  // 
  // > // While this works in jQuery 1.4+
  // > $(elem).css({ width: new_w, height: new_h }).resize();
  // > 
  // > // In jQuery 1.3.2, you need to do this:
  // > var elem = $(elem);
  // > elem.css({ width: new_w, height: new_h });
  // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
  // > elem.resize();
      
  $.event.special[ str_resize ] = {
    
    // Called only when the first 'resize' event callback is bound per element.
    setup: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will bind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Add this element to the list of internal elements to monitor.
      elems = elems.add( elem );
      
      // Initialize data store on the element.
      $.data( this, str_data, { w: elem.width(), h: elem.height() } );
      
      // If this is the first element added, start the polling loop.
      if ( elems.length === 1 ) {
        loopy();
      }
      return '';
    },
    
    // Called only when the last 'resize' event callback is unbound per element.
    teardown: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will unbind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Remove this element from the list of internal elements to monitor.
      elems = elems.not( elem );
      
      // Remove any data stored on the element.
      elem.removeData( str_data );
      
      // If this is the last element removed, stop the polling loop.
      if ( !elems.length ) {
        clearTimeout( timeout_id );
      }
      return '';
    },
    
    // Called every time a 'resize' event callback is bound per element (new in
    // jQuery 1.4).
    add: function( handleObj ) {
      // Since window has its own native 'resize' event, return false so that
      // jQuery doesn't modify the event object. Unless, of course, we're
      // throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var old_handler;
      
      // The new_handler function is executed every time the event is triggered.
      // This is used to update the internal element data store with the width
      // and height when the event is triggered manually, to avoid double-firing
      // of the event callback. See the "Double firing issue in jQuery 1.3.2"
      // comments above for more information.
      
      function new_handler( e, w, h ) {
        var elem = $(this),
          data = $.data( this, str_data );
        
        // If called from the polling loop, w and h will be passed in as
        // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
        // those values will need to be computed.
        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();
        
        old_handler.apply( this, arguments );
      }
      
      // This may seem a little complicated, but it normalizes the special event
      // .add method between jQuery 1.4/1.4.1 and 1.4.2+
      if ( $.isFunction( handleObj ) ) {
        // 1.4, 1.4.1
        old_handler = handleObj;
        return new_handler;
      } else {
        // 1.4.2+
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
      return '';
    }
    
  };
  
  function loopy() {
    
    // Start the polling loop, asynchronously.
    timeout_id = window[ str_setTimeout ](function(){
      
      // Iterate over all elements to which the 'resize' event is bound.
      elems.each(function(){
        var elem = $(this),
          width = elem.width(),
          height = elem.height(),
          data = $.data( this, str_data );
        
        // If element size has changed since the last time, update the element
        // data store and trigger the 'resize' event.
        if ( width !== data.w || height !== data.h ) {
          elem.trigger( str_resize, [ data.w = width, data.h = height ] );
        }
        
      });
      
      // Loop.
      loopy();
      
    }, jq_resize[ str_delay ] );
    
  }
  
})(jQuery,this);