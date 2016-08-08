/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.3
 *
 */
(function ($) {

  $.fn.extend({
    slimScroll: function (options) {

      var defaults = {
        // width in pixels of the visible scroll area
        width: 'auto',
        // height in pixels of the visible scroll area
        height: '250px',
        // width in pixels of the scrollbar and rail
        size: '7px',
        // scrollbar color, accepts any hex/color value
        color: '#000',
        // scrollbar position - left/right
        position: 'right',
        // distance in pixels between the side edge and the scrollbar
        distance: '1px',
        // default scroll position on load - top / bottom / $('selector')
        start: 'top',
        // sets scrollbar opacity
        opacity: .4,
        // enables always-on mode for the scrollbar
        alwaysVisible: false,
        // check if we should hide the scrollbar when user is hovering over
        disableFadeOut: false,
        // sets visibility of the rail
        railVisible: false,
        // sets rail color
        railColor: '#333',
        // sets rail opacity
        railOpacity: .2,
        // whether  we should use jQuery UI Draggable to enable bar dragging
        railDraggable: true,
        // defautlt CSS class of the slimscroll rail
        railClass: 'slimScrollRail',
        // defautlt CSS class of the slimscroll bar
        barClass: 'slimScrollBar',
        // defautlt CSS class of the slimscroll wrapper
        wrapperClass: 'slimScrollDiv',
        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll: false,
        // scroll amount applied to each mouse wheel step
        wheelStep: 20,
        // scroll amount applied when user is using gestures
        touchScrollStep: 200,
        // sets border radius
        borderRadius: '7px',
        // sets border radius of the rail
        railBorderRadius: '7px'
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function () {

        var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
                barHeight, percentScroll, lastScroll,
                divS = '<div></div>',
                minBarHeight = 30,
                releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
          // start from last bar position
          var offset = me.scrollTop();

          // find bar and rail
          bar = me.parent().find('.' + o.barClass);
          rail = me.parent().find('.' + o.railClass);

          getBarHeight();

          // check if we should scroll existing instance
          if ($.isPlainObject(options))
          {
            // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
            if ('height' in options && options.height == 'auto') {
              me.parent().css('height', 'auto');
              me.css('height', 'auto');
              var height = me.parent().parent().height();
              me.parent().css('height', height);
              me.css('height', height);
            }

            if ('scrollTo' in options)
            {
              // jump to a static point
              offset = parseInt(o.scrollTo);
            }
            else if ('scrollBy' in options)
            {
              // jump by value pixels
              offset += parseInt(o.scrollBy);
            }
            else if ('destroy' in options)
            {
              // remove slimscroll elements
              bar.remove();
              rail.remove();
              me.unwrap();
              return;
            }

            // scroll content by the given offset
            scrollContent(offset, false, true);
          }

          return;
        }
        else if ($.isPlainObject(options))
        {
          if ('destroy' in options)
          {
            return;
          }
        }

        // optionally set height to the parent's height
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

        // wrap content
        var wrapper = $(divS)
                .addClass(o.wrapperClass)
                .css({
                  position: 'relative',
                  overflow: 'hidden',
                  width: o.width,
                  height: o.height
                });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height,
          //Fix for IE10
          "-ms-touch-action": "none"
        });

        // create scrollbar rail
        var rail = $(divS)
                .addClass(o.railClass)
                .css({
                  width: o.size,
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
                  'border-radius': o.railBorderRadius,
                  background: o.railColor,
                  opacity: o.railOpacity,
                  zIndex: 90
                });

        // create scrollbar
        var bar = $(divS)
                .addClass(o.barClass)
                .css({
                  background: o.color,
                  width: o.size,
                  position: 'absolute',
                  top: 0,
                  opacity: o.opacity,
                  display: o.alwaysVisible ? 'block' : 'none',
                  'border-radius': o.borderRadius,
                  BorderRadius: o.borderRadius,
                  MozBorderRadius: o.borderRadius,
                  WebkitBorderRadius: o.borderRadius,
                  zIndex: 99
                });

        // set position
        var posCss = (o.position == 'right') ? {right: o.distance} : {left: o.distance};
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable) {
          bar.bind("mousedown", function (e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('top'));
            pageY = e.pageY;

            $doc.bind("mousemove.slimscroll", function (e) {
              currTop = t + e.pageY - pageY;
              bar.css('top', currTop);
              scrollContent(0, bar.position().top, false);// scroll content
            });

            $doc.bind("mouseup.slimscroll", function (e) {
              isDragg = false;
              hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).bind("selectstart.slimscroll", function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.hover(function () {
          showBar();
        }, function () {
          hideBar();
        });

        // on bar over
        bar.hover(function () {
          isOverBar = true;
        }, function () {
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function () {
          isOverPanel = true;
          showBar();
          hideBar();
        }, function () {
          isOverPanel = false;
          hideBar();
        });

        if (window.navigator.msPointerEnabled) {          
          // support for mobile
          me.bind('MSPointerDown', function (e, b) {
            if (e.originalEvent.targetTouches.length)
            {
              // record where touch started
              touchDif = e.originalEvent.targetTouches[0].pageY;
            }
          });

          me.bind('MSPointerMove', function (e) {
            // prevent scrolling the page if necessary
            e.originalEvent.preventDefault();
            if (e.originalEvent.targetTouches.length)
            {
              // see how far user swiped
              var diff = (touchDif - e.originalEvent.targetTouches[0].pageY) / o.touchScrollStep;
              // scroll content
              scrollContent(diff, true);
              touchDif = e.originalEvent.targetTouches[0].pageY;
              
            }
          });
        } else {
          // support for mobile
          me.bind('touchstart', function (e, b) {
            if (e.originalEvent.touches.length)
            {
              // record where touch started
              touchDif = e.originalEvent.touches[0].pageY;
            }
          });

          me.bind('touchmove', function (e) {
            // prevent scrolling the page if necessary
            if (!releaseScroll)
            {
              e.originalEvent.preventDefault();
            }
            if (e.originalEvent.touches.length)
            {
              // see how far user swiped
              var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
              // scroll content
              scrollContent(diff, true);
              touchDif = e.originalEvent.touches[0].pageY;
            }
          });
        }

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom')
        {
          // scroll content to bottom
          bar.css({top: me.outerHeight() - bar.outerHeight()});
          scrollContent(0, true);
        }
        else if (o.start !== 'top')
        {
          // assume jQuery selector
          scrollContent($(o.start).position().top, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) {
            bar.hide();
          }
        }

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) {
            return;
          }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) {
            delta = -e.wheelDelta / 120;
          }
          if (e.detail) {
            delta = e.detail / 3;
          }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) {
            e.preventDefault();
          }
          if (!releaseScroll) {
            e.returnValue = false;
          }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({top: delta + 'px'});
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({top: offsetTop + 'px'});
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false);
            this.addEventListener('mousewheel', _onWheel, false);
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({height: barHeight + 'px'});

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({display: display});
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
              var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
              me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if (barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true, true).fadeIn('fast');
          if (o.railVisible) {
            rail.stop(true, true).fadeIn('fast');
          }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function () {
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  $.fn.extend({
    slimscroll: $.fn.slimScroll
  });

})(jQuery);

;(function (win) {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	/*if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}*/

	win.FastClick = FastClick;
}(window));

/*!
 * iCheck v1.0.1, http://git.io/arlzeA
 * =================================
 * Powerful jQuery and Zepto plugin for checkboxes and radio buttons customization
 *
 * (c) 2013 Damir Sultanov, http://fronteed.com
 * MIT Licensed
 */

(function($) {

  // Cached vars
  var _iCheck = 'iCheck',
    _iCheckHelper = _iCheck + '-helper',
    _checkbox = 'checkbox',
    _radio = 'radio',
    _checked = 'checked',
    _unchecked = 'un' + _checked,
    _disabled = 'disabled',
    _determinate = 'determinate',
    _indeterminate = 'in' + _determinate,
    _update = 'update',
    _type = 'type',
    _click = 'click',
    _touch = 'touchbegin.i touchend.i',
    _add = 'addClass',
    _remove = 'removeClass',
    _callback = 'trigger',
    _label = 'label',
    _cursor = 'cursor',
    _mobile = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);

  // Plugin init
  $.fn[_iCheck] = function(options, fire) {

    // Walker
    var handle = 'input[type="' + _checkbox + '"], input[type="' + _radio + '"]',
      stack = $(),
      walker = function(object) {
        object.each(function() {
          var self = $(this);

          if (self.is(handle)) {
            stack = stack.add(self);
          } else {
            stack = stack.add(self.find(handle));
          }
        });
      };

    // Check if we should operate with some method
    if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(options)) {

      // Normalize method's name
      options = options.toLowerCase();

      // Find checkboxes and radio buttons
      walker(this);

      return stack.each(function() {
        var self = $(this);

        if (options == 'destroy') {
          tidy(self, 'ifDestroyed');
        } else {
          operate(self, true, options);
        }
          // Fire method's callback
        if ($.isFunction(fire)) {
          fire();
        }
      });

    // Customization
    } else if (typeof options == 'object' || !options) {

      // Check if any options were passed
      var settings = $.extend({
          checkedClass: _checked,
          disabledClass: _disabled,
          indeterminateClass: _indeterminate,
          labelHover: true,
          aria: false
        }, options),

        selector = settings.handle,
        hoverClass = settings.hoverClass || 'hover',
        focusClass = settings.focusClass || 'focus',
        activeClass = settings.activeClass || 'active',
        labelHover = !!settings.labelHover,
        labelHoverClass = settings.labelHoverClass || 'hover',

        // Setup clickable area
        area = ('' + settings.increaseArea).replace('%', '') | 0;

      // Selector limit
      if (selector == _checkbox || selector == _radio) {
        handle = 'input[type="' + selector + '"]';
      }
        // Clickable area limit
      if (area < -50) {
        area = -50;
      }
        // Walk around the selector
      walker(this);

      return stack.each(function() {
        var self = $(this);

        // If already customized
        tidy(self);

        var node = this,
          id = node.id,

          // Layer styles
          offset = -area + '%',
          size = 100 + (area * 2) + '%',
          layer = {
            position: 'absolute',
            top: offset,
            left: offset,
            display: 'block',
            width: size,
            height: size,
            margin: 0,
            padding: 0,
            background: '#fff',
            border: 0,
            opacity: 0
          },

          // Choose how to hide input
          hide = _mobile ? {
            position: 'absolute',
            visibility: 'hidden'
          } : area ? layer : {
            position: 'absolute',
            opacity: 0
          },

          // Get proper class
          className = node[_type] == _checkbox ? settings.checkboxClass || 'i' + _checkbox : settings.radioClass || 'i' + _radio,

          // Find assigned labels
          label = $(_label + '[for="' + id + '"]').add(self.closest(_label)),

          // Check ARIA option
          aria = !!settings.aria,

          // Set ARIA placeholder
          ariaID = _iCheck + '-' + Math.random().toString(36).replace('0.', ''),

          // Parent & helper
          parent = '<div class="' + className + '" ' + (aria ? 'role="' + node[_type] + '" ' : ''),
          helper;

        // Set ARIA "labelledby"
        if (label.length && aria) {
          label.each(function() {
            parent += 'aria-labelledby="';

            if (this.id) {
              parent += this.id;
            } else {
              this.id = ariaID;
              parent += ariaID;
            }

            parent += '"';
          });
        }
          // Wrap input
        parent = self.wrap(parent + '/>')[_callback]('ifCreated').parent().append(settings.insert);

        // Layer addition
        helper = $('<ins class="' + _iCheckHelper + '"/>').css(layer).appendTo(parent);

        // Finalize customization
        self.data(_iCheck, {o: settings, s: self.attr('style')}).css(hide);
        !!settings.inheritClass && parent[_add](node.className || '');
        !!settings.inheritID && id && parent.attr('id', _iCheck + '-' + id);
        parent.css('position') == 'static' && parent.css('position', 'relative');
        operate(self, true, _update);

        // Label events
        if (label.length) {
          label.on(_click + '.i mouseover.i mouseout.i ' + _touch, function(event) {
            var type = event[_type],
              item = $(this);

            // Do nothing if input is disabled
            if (!node[_disabled]) {

              // Click
              if (type == _click) {
                if ($(event.target).is('a')) {
                  return;
                }
                operate(self, false, true);

              // Hover state
              } else if (labelHover) {

                // mouseout|touchend
                if (/ut|nd/.test(type)) {
                  parent[_remove](hoverClass);
                  item[_remove](labelHoverClass);
                } else {
                  parent[_add](hoverClass);
                  item[_add](labelHoverClass);
                }
              }
                if (_mobile) {
                event.stopPropagation();
              } else {
                return false;
              }
            }
          });
        }
          // Input events
        self.on(_click + '.i focus.i blur.i keyup.i keydown.i keypress.i', function(event) {
          var type = event[_type],
            key = event.keyCode;

          // Click
          if (type == _click) {
            return false;

          // Keydown
          } else if (type == 'keydown' && key == 32) {
            if (!(node[_type] == _radio && node[_checked])) {
              if (node[_checked]) {
                off(self, _checked);
              } else {
                on(self, _checked);
              }
            }
              return false;

          // Keyup
          } else if (type == 'keyup' && node[_type] == _radio) {
            !node[_checked] && on(self, _checked);

          // Focus/blur
          } else if (/us|ur/.test(type)) {
            parent[type == 'blur' ? _remove : _add](focusClass);
          }
        });

        // Helper events
        helper.on(_click + ' mousedown mouseup mouseover mouseout ' + _touch, function(event) {
          var type = event[_type],

            // mousedown|mouseup
            toggle = /wn|up/.test(type) ? activeClass : hoverClass;

          // Do nothing if input is disabled
          if (!node[_disabled]) {

            // Click
            if (type == _click) {
              operate(self, false, true);

            // Active and hover states
            } else {

              // State is on
              if (/wn|er|in/.test(type)) {

                // mousedown|mouseover|touchbegin
                parent[_add](toggle);

              // State is off
              } else {
                parent[_remove](toggle + ' ' + activeClass);
              }
                // Label hover
              if (label.length && labelHover && toggle == hoverClass) {

                // mouseout|touchend
                label[/ut|nd/.test(type) ? _remove : _add](labelHoverClass);
              }
            }
              if (_mobile) {
              event.stopPropagation();
            } else {
              return false;
            }
          }
        });
      });
    } else {
      return this;
    }
  };

  // Do something with inputs
  function operate(input, direct, method) {
    var node = input[0],
      state = /er/.test(method) ? _indeterminate : /bl/.test(method) ? _disabled : _checked,
      active = method == _update ? {
        checked: node[_checked],
        disabled: node[_disabled],
        indeterminate: input.attr(_indeterminate) == 'true' || input.attr(_determinate) == 'false'
      } : node[state];

    // Check, disable or indeterminate
    if (/^(ch|di|in)/.test(method) && !active) {
      on(input, state);

    // Uncheck, enable or determinate
    } else if (/^(un|en|de)/.test(method) && active) {
      off(input, state);

    // Update
    } else if (method == _update) {

      // Handle states
      for (var state in active) {
        if (active[state]) {
          on(input, state, true);
        } else {
          off(input, state, true);
        }
      }
    } else if (!direct || method == 'toggle') {

      // Helper or label was clicked
      if (!direct) {
        input[_callback]('ifClicked');
      }
        // Toggle checked state
      if (active) {
        if (node[_type] !== _radio) {
          off(input, state);
        }
      } else {
        on(input, state);
      }
    }
  }
    // Add checked, disabled or indeterminate state
  function on(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== true) {

      // Toggle assigned radio buttons
      if (!keep && state == _checked && node[_type] == _radio && node.name) {
        var form = input.closest('form'),
          inputs = 'input[name="' + node.name + '"]';

        inputs = form.length ? form.find(inputs) : $(inputs);

        inputs.each(function() {
          if (this !== node && $(this).data(_iCheck)) {
            off($(this), state);
          }
        });
      }
        // Indeterminate state
      if (indeterminate) {

        // Add indeterminate state
        node[state] = true;

        // Remove checked state
        if (node[_checked]) {
          off(input, _checked, 'force');
        }
          // Checked or disabled state
      } else {

        // Add checked or disabled state
        if (!keep) {
          node[state] = true;
        }
          // Remove indeterminate state
        if (checked && node[_indeterminate]) {
          off(input, _indeterminate, false);
        }
      }
        // Trigger callbacks
      callbacks(input, checked, state, keep);
    }
      // Add proper cursor
    if (node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'default');
    }
      // Add state class
    parent[_add](specific || option(input, state) || '');

    // Set ARIA attribute
    disabled ? parent.attr('aria-disabled', 'true') : parent.attr('aria-checked', indeterminate ? 'mixed' : 'true');

    // Remove regular state class
    parent[_remove](regular || option(input, callback) || '');
  }
    // Remove checked, disabled or indeterminate state
  function off(input, state, keep) {
    var node = input[0],
      parent = input.parent(),
      checked = state == _checked,
      indeterminate = state == _indeterminate,
      disabled = state == _disabled,
      callback = indeterminate ? _determinate : checked ? _unchecked : 'enabled',
      regular = option(input, callback + capitalize(node[_type])),
      specific = option(input, state + capitalize(node[_type]));

    // Prevent unnecessary actions
    if (node[state] !== false) {

      // Toggle state
      if (indeterminate || !keep || keep == 'force') {
        node[state] = false;
      }
        // Trigger callbacks
      callbacks(input, checked, callback, keep);
    }
      // Add proper cursor
    if (!node[_disabled] && !!option(input, _cursor, true)) {
      parent.find('.' + _iCheckHelper).css(_cursor, 'pointer');
    }
      // Remove state class
    parent[_remove](specific || option(input, state) || '');

    // Set ARIA attribute
    disabled ? parent.attr('aria-disabled', 'false') : parent.attr('aria-checked', 'false');

    // Add regular state class
    parent[_add](regular || option(input, callback) || '');
  }
    // Remove all traces
  function tidy(input, callback) {
    if (input.data(_iCheck)) {

      // Remove everything except input
      input.parent().html(input.attr('style', input.data(_iCheck).s || ''));

      // Callback
      if (callback) {
        input[_callback](callback);
      }
        // Unbind events
      input.off('.i').unwrap();
      $(_label + '[for="' + input[0].id + '"]').add(input.closest(_label)).off('.i');
    }
  }
    // Get some option
  function option(input, state, regular) {
    if (input.data(_iCheck)) {
      return input.data(_iCheck).o[state + (regular ? '' : 'Class')];
    }
  }
    // Capitalize some string
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
    // Executable handlers
  function callbacks(input, checked, callback, keep) {
    if (!keep) {
      if (checked) {
        input[_callback]('ifToggled');
      }
        input[_callback]('ifChanged')[_callback]('if' + capitalize(callback));
    }
  }
})(window.jQuery || window.Zepto);

//TODO: move arrow styles and button click code into configurable items, with defaults matching the existing code

/*!
* Timepicker Component for Twitter Bootstrap
*
* Copyright 2013 Joris de Wit
*
* Contributors https://github.com/jdewit/bootstrap-timepicker/graphs/contributors
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/
(function($, window, document, undefined) {
  'use strict';

  // TIMEPICKER PUBLIC CLASS DEFINITION
  var Timepicker = function(element, options) {
    this.widget = '';
    this.$element = $(element);
    this.defaultTime = options.defaultTime;
    this.disableFocus = options.disableFocus;
    this.isOpen = options.isOpen;
    this.minuteStep = options.minuteStep;
    this.modalBackdrop = options.modalBackdrop;
    this.secondStep = options.secondStep;
    this.showInputs = options.showInputs;
    this.showMeridian = options.showMeridian;
    this.showSeconds = options.showSeconds;
    this.template = options.template;
    this.appendWidgetTo = options.appendWidgetTo;
	this.upArrowStyle = options.upArrowStyle;
	this.downArrowStyle = options.downArrowStyle;
	this.containerClass = options.containerClass;

    this._init();
  };

  Timepicker.prototype = {

    constructor: Timepicker,

    _init: function() {
      var self = this;

      if (this.$element.parent().hasClass('input-append') || this.$element.parent().hasClass('input-prepend')) {
		if (this.$element.parent('.input-append, .input-prepend').find('.add-on').length) {
			this.$element.parent('.input-append, .input-prepend').find('.add-on').on({
			  'click.timepicker': $.proxy(this.showWidget, this)
			});		
		} else {
			this.$element.closest(this.containerClass).find('.add-on').on({
			  'click.timepicker': $.proxy(this.showWidget, this)
			});		
		}
		
        this.$element.on({
          'focus.timepicker': $.proxy(this.highlightUnit, this),
          'click.timepicker': $.proxy(this.highlightUnit, this),
          'keydown.timepicker': $.proxy(this.elementKeydown, this),
          'blur.timepicker': $.proxy(this.blurElement, this)
        });
      } else {
        if (this.template) {
          this.$element.on({
            'focus.timepicker': $.proxy(this.showWidget, this),
            'click.timepicker': $.proxy(this.showWidget, this),
            'blur.timepicker': $.proxy(this.blurElement, this)
          });
        } else {
          this.$element.on({
            'focus.timepicker': $.proxy(this.highlightUnit, this),
            'click.timepicker': $.proxy(this.highlightUnit, this),
            'keydown.timepicker': $.proxy(this.elementKeydown, this),
            'blur.timepicker': $.proxy(this.blurElement, this)
          });
        }
      }

      if (this.template !== false) {
        this.$widget = $(this.getTemplate()).prependTo(this.$element.parents(this.appendWidgetTo)).on('click', $.proxy(this.widgetClick, this));
      } else {
        this.$widget = false;
      }

      if (this.showInputs && this.$widget !== false) {
        this.$widget.find('input').each(function() {
          $(this).on({
            'click.timepicker': function() { $(this).select(); },
            'keydown.timepicker': $.proxy(self.widgetKeydown, self)
          });
        });
      }

      this.setDefaultTime(this.defaultTime);
    },

    blurElement: function() {
      this.highlightedUnit = undefined;
      this.updateFromElementVal();
    },

    decrementHour: function() {
      if (this.showMeridian) {
        if (this.hour === 1) {
          this.hour = 12;
        } else if (this.hour === 12) {
          this.hour--;

          return this.toggleMeridian();
        } else if (this.hour === 0) {
          this.hour = 11;

          return this.toggleMeridian();
        } else {
          this.hour--;
        }
      } else {
        if (this.hour === 0) {
          this.hour = 23;
        } else {
          this.hour--;
        }
      }
      this.update();
    },

    decrementMinute: function(step) {
      var newVal;

      if (step) {
        newVal = this.minute - step;
      } else {
        newVal = this.minute - this.minuteStep;
      }

      if (newVal < 0) {
        this.decrementHour();
        this.minute = newVal + 60;
      } else {
        this.minute = newVal;
      }
      this.update();
    },

    decrementSecond: function() {
      var newVal = this.second - this.secondStep;

      if (newVal < 0) {
        this.decrementMinute(true);
        this.second = newVal + 60;
      } else {
        this.second = newVal;
      }
      this.update();
    },

    elementKeydown: function(e) {
      switch (e.keyCode) {
      case 9: //tab
        this.updateFromElementVal();

        switch (this.highlightedUnit) {
        case 'hour':
          e.preventDefault();
          this.highlightNextUnit();
          break;
        case 'minute':
          if (this.showMeridian || this.showSeconds) {
            e.preventDefault();
            this.highlightNextUnit();
          }
          break;
        case 'second':
          if (this.showMeridian) {
            e.preventDefault();
            this.highlightNextUnit();
          }
          break;
        }
        break;
      case 27: // escape
        this.updateFromElementVal();
        break;
      case 37: // left arrow
        e.preventDefault();
        this.highlightPrevUnit();
        this.updateFromElementVal();
        break;
      case 38: // up arrow
        e.preventDefault();
        switch (this.highlightedUnit) {
        case 'hour':
          this.incrementHour();
          this.highlightHour();
          break;
        case 'minute':
          this.incrementMinute();
          this.highlightMinute();
          break;
        case 'second':
          this.incrementSecond();
          this.highlightSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          this.highlightMeridian();
          break;
        }
        break;
      case 39: // right arrow
        e.preventDefault();
        this.updateFromElementVal();
        this.highlightNextUnit();
        break;
      case 40: // down arrow
        e.preventDefault();
        switch (this.highlightedUnit) {
        case 'hour':
          this.decrementHour();
          this.highlightHour();
          break;
        case 'minute':
          this.decrementMinute();
          this.highlightMinute();
          break;
        case 'second':
          this.decrementSecond();
          this.highlightSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          this.highlightMeridian();
          break;
        }
        break;
      }
    },

    formatTime: function(hour, minute, second, meridian) {
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;

      return hour + ':' + minute + (this.showSeconds ? ':' + second : '') + (this.showMeridian ? ' ' + meridian : '');
    },

    getCursorPosition: function() {
      var input = this.$element.get(0);

      if ('selectionStart' in input) {// Standard-compliant browsers

        return input.selectionStart;
      } else if (document.selection) {// IE fix
        input.focus();
        var sel = document.selection.createRange(),
          selLen = document.selection.createRange().text.length;

        sel.moveStart('character', - input.value.length);

        return sel.text.length - selLen;
      }
    },

    getTemplate: function() {
      var template,
        hourTemplate,
        minuteTemplate,
        secondTemplate,
        meridianTemplate,
        templateContent;

      if (this.showInputs) {
        hourTemplate = '<input type="text" name="hour" class="bootstrap-timepicker-hour form-control" maxlength="2"/>';
        minuteTemplate = '<input type="text" name="minute" class="bootstrap-timepicker-minute form-control" maxlength="2"/>';
        secondTemplate = '<input type="text" name="second" class="bootstrap-timepicker-second form-control" maxlength="2"/>';
        meridianTemplate = '<input type="text" name="meridian" class="bootstrap-timepicker-meridian form-control" maxlength="2"/>';
      } else {
        hourTemplate = '<span class="bootstrap-timepicker-hour"></span>';
        minuteTemplate = '<span class="bootstrap-timepicker-minute"></span>';
        secondTemplate = '<span class="bootstrap-timepicker-second"></span>';
        meridianTemplate = '<span class="bootstrap-timepicker-meridian"></span>';
      }

      templateContent = '<table>'+
         '<tr>'+
           '<td><a href="#" data-action="incrementHour"><i class="' + this.upArrowStyle + '"></i></a></td>'+
           '<td class="separator">&nbsp;</td>'+
           '<td><a href="#" data-action="incrementMinute"><i class="' + this.upArrowStyle + '"></i></a></td>'+
           (this.showSeconds ?
             '<td class="separator">&nbsp;</td>'+
             '<td><a href="#" data-action="incrementSecond"><i class="' + this.upArrowStyle + '"></i></a></td>'
           : '') +
           (this.showMeridian ?
             '<td class="separator">&nbsp;</td>'+
             '<td class="meridian-column"><a href="#" data-action="toggleMeridian"><i class="' + this.upArrowStyle + '"></i></a></td>'
           : '') +
         '</tr>'+
         '<tr>'+
           '<td>'+ hourTemplate +'</td> '+
           '<td class="separator">:</td>'+
           '<td>'+ minuteTemplate +'</td> '+
           (this.showSeconds ?
            '<td class="separator">:</td>'+
            '<td>'+ secondTemplate +'</td>'
           : '') +
           (this.showMeridian ?
            '<td class="separator">&nbsp;</td>'+
            '<td>'+ meridianTemplate +'</td>'
           : '') +
         '</tr>'+
         '<tr>'+
           '<td><a href="#" data-action="decrementHour"><i class="' + this.downArrowStyle + '"></i></a></td>'+
           '<td class="separator"></td>'+
           '<td><a href="#" data-action="decrementMinute"><i class="' + this.downArrowStyle + '"></i></a></td>'+
           (this.showSeconds ?
            '<td class="separator">&nbsp;</td>'+
            '<td><a href="#" data-action="decrementSecond"><i class="' + this.downArrowStyle + '"></i></a></td>'
           : '') +
           (this.showMeridian ?
            '<td class="separator">&nbsp;</td>'+
            '<td><a href="#" data-action="toggleMeridian"><i class="' + this.downArrowStyle + '"></i></a></td>'
           : '') +
         '</tr>'+
       '</table>';

      switch(this.template) {
      case 'modal':
        template = '<div class="bootstrap-timepicker-widget modal hide fade in" data-backdrop="'+ (this.modalBackdrop ? 'true' : 'false') +'">'+
          '<div class="modal-header">'+
            '<a href="#" class="close" data-dismiss="modal">×</a>'+
            '<h3>Pick a Time</h3>'+
          '</div>'+
          '<div class="modal-content">'+
            templateContent +
          '</div>'+
          '<div class="modal-footer">'+
            '<a href="#" class="btn btn-primary" data-dismiss="modal">OK</a>'+
          '</div>'+
        '</div>';
        break;
      case 'dropdown':
        template = '<div class="bootstrap-timepicker-widget dropdown-menu">'+ templateContent +'</div>';
        break;
      }

      return template;
    },

    getTime: function() {
      return this.formatTime(this.hour, this.minute, this.second, this.meridian);
    },

    hideWidget: function() {
      if (this.isOpen === false) {
        return;
      }

                        if (this.showInputs) {
                                this.updateFromWidgetInputs();
                        }

      this.$element.trigger({
        'type': 'hide.timepicker',
        'time': {
          'value': this.getTime(),
          'hours': this.hour,
          'minutes': this.minute,
          'seconds': this.second,
          'meridian': this.meridian
        }
      });

      if (this.template === 'modal' && this.$widget.modal) {
        this.$widget.modal('hide');
      } else {
        this.$widget.removeClass('open');
      }

      $(document).off('mousedown.timepicker');

      this.isOpen = false;
    },

    highlightUnit: function() {
      this.position = this.getCursorPosition();
      if (this.position >= 0 && this.position <= 2) {
        this.highlightHour();
      } else if (this.position >= 3 && this.position <= 5) {
        this.highlightMinute();
      } else if (this.position >= 6 && this.position <= 8) {
        if (this.showSeconds) {
          this.highlightSecond();
        } else {
          this.highlightMeridian();
        }
      } else if (this.position >= 9 && this.position <= 11) {
        this.highlightMeridian();
      }
    },

    highlightNextUnit: function() {
      switch (this.highlightedUnit) {
      case 'hour':
        this.highlightMinute();
        break;
      case 'minute':
        if (this.showSeconds) {
          this.highlightSecond();
        } else if (this.showMeridian){
          this.highlightMeridian();
        } else {
          this.highlightHour();
        }
        break;
      case 'second':
        if (this.showMeridian) {
          this.highlightMeridian();
        } else {
          this.highlightHour();
        }
        break;
      case 'meridian':
        this.highlightHour();
        break;
      }
    },

    highlightPrevUnit: function() {
      switch (this.highlightedUnit) {
      case 'hour':
        this.highlightMeridian();
        break;
      case 'minute':
        this.highlightHour();
        break;
      case 'second':
        this.highlightMinute();
        break;
      case 'meridian':
        if (this.showSeconds) {
          this.highlightSecond();
        } else {
          this.highlightMinute();
        }
        break;
      }
    },

    highlightHour: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'hour';

                        if ($element.setSelectionRange) {
                                setTimeout(function() {
                                        $element.setSelectionRange(0,2);
                                }, 0);
                        }
    },

    highlightMinute: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'minute';

                        if ($element.setSelectionRange) {
                                setTimeout(function() {
                                        $element.setSelectionRange(3,5);
                                }, 0);
                        }
    },

    highlightSecond: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'second';

                        if ($element.setSelectionRange) {
                                setTimeout(function() {
                                        $element.setSelectionRange(6,8);
                                }, 0);
                        }
    },

    highlightMeridian: function() {
      var $element = this.$element.get(0);

      this.highlightedUnit = 'meridian';

                        if ($element.setSelectionRange) {
                                if (this.showSeconds) {
                                        setTimeout(function() {
                                                $element.setSelectionRange(9,11);
                                        }, 0);
                                } else {
                                        setTimeout(function() {
                                                $element.setSelectionRange(6,8);
                                        }, 0);
                                }
                        }
    },

    incrementHour: function() {
      if (this.showMeridian) {
        if (this.hour === 11) {
          this.hour++;
          return this.toggleMeridian();
        } else if (this.hour === 12) {
          this.hour = 0;
        }
      }
      if (this.hour === 23) {
        this.hour = 0;

        return;
      }
      this.hour++;
      this.update();
    },

    incrementMinute: function(step) {
      var newVal;

      if (step) {
        newVal = this.minute + step;
      } else {
        newVal = this.minute + this.minuteStep - (this.minute % this.minuteStep);
      }

      if (newVal > 59) {
        this.incrementHour();
        this.minute = newVal - 60;
      } else {
        this.minute = newVal;
      }
      this.update();
    },

    incrementSecond: function() {
      var newVal = this.second + this.secondStep - (this.second % this.secondStep);

      if (newVal > 59) {
        this.incrementMinute(true);
        this.second = newVal - 60;
      } else {
        this.second = newVal;
      }
      this.update();
    },

    remove: function() {
      $('document').off('.timepicker');
      if (this.$widget) {
        this.$widget.remove();
      }
      delete this.$element.data().timepicker;
    },

    setDefaultTime: function(defaultTime){
      if (!this.$element.val()) {
        if (defaultTime === 'current') {
          var dTime = new Date(),
            hours = dTime.getHours(),
            minutes = Math.floor(dTime.getMinutes() / this.minuteStep) * this.minuteStep,
            seconds = Math.floor(dTime.getSeconds() / this.secondStep) * this.secondStep,
            meridian = 'AM';

          if (this.showMeridian) {
            if (hours === 0) {
              hours = 12;
            } else if (hours >= 12) {
              if (hours > 12) {
                hours = hours - 12;
              }
              meridian = 'PM';
            } else {
              meridian = 'AM';
            }
          }

          this.hour = hours;
          this.minute = minutes;
          this.second = seconds;
          this.meridian = meridian;

          this.update();

        } else if (defaultTime === false) {
          this.hour = 0;
          this.minute = 0;
          this.second = 0;
          this.meridian = 'AM';
        } else {
          this.setTime(defaultTime);
        }
      } else {
        this.updateFromElementVal();
      }
    },

    setTime: function(time) {
      var arr,
        timeArray;

      if (this.showMeridian) {
        arr = time.split(' ');
        timeArray = arr[0].split(':');
        this.meridian = arr[1];
      } else {
        timeArray = time.split(':');
      }

      this.hour = parseInt(timeArray[0], 10);
      this.minute = parseInt(timeArray[1], 10);
      this.second = parseInt(timeArray[2], 10);

      if (isNaN(this.hour)) {
        this.hour = 0;
      }
      if (isNaN(this.minute)) {
        this.minute = 0;
      }

      if (this.showMeridian) {
        if (this.hour > 12) {
          this.hour = 12;
        } else if (this.hour < 1) {
          this.hour = 12;
        }

        if (this.meridian === 'am' || this.meridian === 'a') {
          this.meridian = 'AM';
        } else if (this.meridian === 'pm' || this.meridian === 'p') {
          this.meridian = 'PM';
        }

        if (this.meridian !== 'AM' && this.meridian !== 'PM') {
          this.meridian = 'AM';
        }
      } else {
        if (this.hour >= 24) {
          this.hour = 23;
        } else if (this.hour < 0) {
          this.hour = 0;
        }
      }

      if (this.minute < 0) {
        this.minute = 0;
      } else if (this.minute >= 60) {
        this.minute = 59;
      }

      if (this.showSeconds) {
        if (isNaN(this.second)) {
          this.second = 0;
        } else if (this.second < 0) {
          this.second = 0;
        } else if (this.second >= 60) {
          this.second = 59;
        }
      }

      this.update();
    },

    showWidget: function() {
      if (this.isOpen) {
        return;
      }

      if (this.$element.is(':disabled')) {
        return;
      }

      var self = this;
      $(document).on('mousedown.timepicker', function (e) {
        // Clicked outside the timepicker, hide it
        if ($(e.target).closest('.bootstrap-timepicker-widget').length === 0) {
          self.hideWidget();
        }
      });

      this.$element.trigger({
        'type': 'show.timepicker',
        'time': {
          'value': this.getTime(),
          'hours': this.hour,
          'minutes': this.minute,
          'seconds': this.second,
          'meridian': this.meridian
        }
      });

      if (this.disableFocus) {
        this.$element.blur();
      }

      this.updateFromElementVal();

      if (this.template === 'modal' && this.$widget.modal) {
        this.$widget.modal('show').on('hidden', $.proxy(this.hideWidget, this));
      } else {
        if (this.isOpen === false) {
          this.$widget.addClass('open');
        }
      }

      this.isOpen = true;
    },

    toggleMeridian: function() {
      this.meridian = this.meridian === 'AM' ? 'PM' : 'AM';
      this.update();
    },

    update: function() {
      this.$element.trigger({
        'type': 'changeTime.timepicker',
        'time': {
          'value': this.getTime(),
          'hours': this.hour,
          'minutes': this.minute,
          'seconds': this.second,
          'meridian': this.meridian
        }
      });

      this.updateElement();
      this.updateWidget();
    },

    updateElement: function() {
      this.$element.val(this.getTime()).change();
    },

    updateFromElementVal: function() {
                        var val = this.$element.val();

                        if (val) {
                                this.setTime(val);
                        }
    },

    updateWidget: function() {
      if (this.$widget === false) {
        return;
      }

      var hour = this.hour < 10 ? '0' + this.hour : this.hour,
          minute = this.minute < 10 ? '0' + this.minute : this.minute,
          second = this.second < 10 ? '0' + this.second : this.second;

      if (this.showInputs) {
        this.$widget.find('input.bootstrap-timepicker-hour').val(hour);
        this.$widget.find('input.bootstrap-timepicker-minute').val(minute);

        if (this.showSeconds) {
          this.$widget.find('input.bootstrap-timepicker-second').val(second);
        }
        if (this.showMeridian) {
          this.$widget.find('input.bootstrap-timepicker-meridian').val(this.meridian);
        }
      } else {
        this.$widget.find('span.bootstrap-timepicker-hour').text(hour);
        this.$widget.find('span.bootstrap-timepicker-minute').text(minute);

        if (this.showSeconds) {
          this.$widget.find('span.bootstrap-timepicker-second').text(second);
        }
        if (this.showMeridian) {
          this.$widget.find('span.bootstrap-timepicker-meridian').text(this.meridian);
        }
      }
    },

    updateFromWidgetInputs: function() {
      if (this.$widget === false) {
        return;
      }
      var time = $('input.bootstrap-timepicker-hour', this.$widget).val() + ':' +
        $('input.bootstrap-timepicker-minute', this.$widget).val() +
        (this.showSeconds ? ':' + $('input.bootstrap-timepicker-second', this.$widget).val() : '') +
        (this.showMeridian ? ' ' + $('input.bootstrap-timepicker-meridian', this.$widget).val() : '');

      this.setTime(time);
    },

    widgetClick: function(e) {
      e.stopPropagation();
      e.preventDefault();

      var action = $(e.target).closest('a').data('action');
      if (action) {
        this[action]();
      }
    },

    widgetKeydown: function(e) {
      var $input = $(e.target).closest('input'),
          name = $input.attr('name');

      switch (e.keyCode) {
      case 9: //tab
        if (this.showMeridian) {
          if (name === 'meridian') {
            return this.hideWidget();
          }
        } else {
          if (this.showSeconds) {
            if (name === 'second') {
              return this.hideWidget();
            }
          } else {
            if (name === 'minute') {
              return this.hideWidget();
            }
          }
        }

        this.updateFromWidgetInputs();
        break;
      case 27: // escape
        this.hideWidget();
        break;
      case 38: // up arrow
        e.preventDefault();
        switch (name) {
        case 'hour':
          this.incrementHour();
          break;
        case 'minute':
          this.incrementMinute();
          break;
        case 'second':
          this.incrementSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          break;
        }
        break;
      case 40: // down arrow
        e.preventDefault();
        switch (name) {
        case 'hour':
          this.decrementHour();
          break;
        case 'minute':
          this.decrementMinute();
          break;
        case 'second':
          this.decrementSecond();
          break;
        case 'meridian':
          this.toggleMeridian();
          break;
        }
        break;
      }
    }
  };


  //TIMEPICKER PLUGIN DEFINITION
  $.fn.timepicker = function(option) {
    var args = Array.apply(null, arguments);
    args.shift();
    return this.each(function() {
      var $this = $(this),
        data = $this.data('timepicker'),
        options = typeof option === 'object' && option;

      if (!data) {
        $this.data('timepicker', (data = new Timepicker(this, $.extend({}, $.fn.timepicker.defaults, options, $(this).data()))));
      }

      if (typeof option === 'string') {
        data[option].apply(data, args);
      }
    });
  };

  $.fn.timepicker.defaults = {
    defaultTime: 'current',
    disableFocus: false,
    isOpen: false,
    minuteStep: 15,
    modalBackdrop: false,
    secondStep: 15,
    showSeconds: false,
    showInputs: true,
    showMeridian: true,
    template: 'dropdown',
    appendWidgetTo: '.bootstrap-timepicker',
	upArrowStyle: 'glyphicon glyphicon-chevron-up',
	downArrowStyle: 'glyphicon glyphicon-chevron-down',
	containerClass: 'bootstrap-timepicker'
  };

  $.fn.timepicker.Constructor = Timepicker;

})(jQuery, window, document);

/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * version: 1.6.0
 * https://github.com/wenzhixin/bootstrap-table/
 */

!function ($) {
    'use strict';

    // TOOLS DEFINITION
    // ======================

    var cellHeight = 37; // update css if changed
    var cachedWidth = null;

    // it only does '%s', and return '' when arguments are undefined
    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    var getPropertyFromOther = function (list, from, to, value) {
        var result = '';
        $.each(list, function (i, item) {
            if (item[from] === value) {
                result = item[to];
                return false;
            }
            return true;
        });
        return result;
    };

    var getFieldIndex = function (columns, field) {
        var index = -1;

        $.each(columns, function (i, column) {
            if (column.field === field) {
                index = i;
                return false;
            }
            return true;
        });
        return index;
    };
    var getScrollBarWidth = function () {
        if (cachedWidth === null) {
            var inner = $('<p/>').addClass('fixed-table-scroll-inner'),
                outer = $('<div/>').addClass('fixed-table-scroll-outer'),
                w1, w2;

            outer.append(inner);
            $('body').append(outer);

            w1 = inner[0].offsetWidth;
            outer.css('overflow', 'scroll');
            w2 = inner[0].offsetWidth;

            if (w1 === w2) {
                w2 = outer[0].clientWidth;
            }

            outer.remove();
            cachedWidth = w1 - w2;
        }
        return cachedWidth;
    };

    var calculateObjectValue = function (self, name, args, defaultValue) {
        if (typeof name === 'string') {
            // support obj.func1.func2
            var names = name.split('.');

            if (names.length > 1) {
                name = window;
                $.each(names, function (i, f) {
                    name = name[f];
                });
            } else {
                name = window[name];
            }
        }
        if (typeof name === 'object') {
            return name;
        }
        if (typeof name === 'function') {
            return name.apply(self, args);
        }
        return defaultValue;
    };

    var escapeHTML = function (text) {
        if (typeof text === 'string') {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        return text;
    };

    // BOOTSTRAP TABLE CLASS DEFINITION
    // ======================

    var BootstrapTable = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
    };

    BootstrapTable.DEFAULTS = {
        classes: 'table table-hover',
        height: undefined,
        undefinedText: '-',
        sortName: undefined,
        sortOrder: 'asc',
        striped: false,
        columns: [],
        data: [],
        method: 'get',
        url: undefined,
        cache: false,
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        ajaxOptions: {},
        queryParams: function (params) {
            var defaultParams = {
                sortName: params.sort,
                order: params.order,
                size: params.limit,
                page: params.offset / params.limit || 1
            };
            return defaultParams;
        },
        queryParamsType: 'limit', // undefined
        responseHandler: function (res) {
            return res;
        },
        pagination: true,
        sidePagination: 'server', // client or server
        totalRows: 0, // server side need to set
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        paginationHAlign: 'right', //right, left
        paginationVAlign: 'bottom', //bottom, top, both
        paginationDetailHAlign: 'left', //right, left
        search: false,
        searchAlign: 'right',
        selectItemName: 'btSelectItem',
        showHeader: true,
        showFooter: false,
        showColumns: false,
        showPaginationSwitch: false,
        showRefresh: false,
        showToggle: false,
        buttonsAlign: 'right',
        smartDisplay: true,
        minimumCountColumns: 1,
        idField: undefined,
        uniqueId: undefined,
        cardView: false,
        trimOnSearch: true,
        clickToSelect: true,
        singleSelect: false,
        toolbar: undefined,
        toolbarAlign: 'left',
        checkboxHeader: true,
        sortable: true,
        maintainSelected: false,
        searchTimeOut: 500,
        keyEvents: false,
        searchText: '',
        iconSize: undefined,
        iconsPrefix: 'glyphicon', // glyphicon of fa (font awesome)
        icons: {
            paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
            paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
            refresh: 'glyphicon-refresh icon-refresh',
            toggle: 'glyphicon-list-alt icon-list-alt',
            columns: 'glyphicon-th icon-th'
        },

        rowStyle: function (row, index) {
            return {};
        },

        rowAttributes: function (row, index) {
            return {};
        },

        onAll: function (name, args) {
            return false;
        },
        onClickRow: function (item, $element) {
            return false;
        },
        onDblClickRow: function (item, $element) {
            return false;
        },
        onSort: function (name, order) {
            return false;
        },
        onCheck: function (row) {
            return false;
        },
        onUncheck: function (row) {
            return false;
        },
        onCheckAll: function () {
            return false;
        },
        onUncheckAll: function () {
            return false;
        },
        onLoadSuccess: function (data) {
            return false;
        },
        onLoadError: function (status) {
            return false;
        },
        onColumnSwitch: function (field, checked) {
            return false;
        },
        onColumnSearch: function (field, text) {
            return false;
        },
        onPageChange: function (number, size) {
            return false;
        },
        onSearch: function (text) {
            return false;
        },
        onPreBody: function (data) {
            return false;
        },
        onPostBody: function () {
            return false;
        },
        onPostHeader: function () {
            return false;
        }
    };

    BootstrapTable.LOCALES = [];

    BootstrapTable.LOCALES['en-US'] = {
        formatLoadingMessage: function () {
            return 'Loading, please wait...';
        },
        formatRecordsPerPage: function (pageNumber) {
            return sprintf('%s records per page', pageNumber);
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return sprintf('Showing %s to %s of %s rows', pageFrom, pageTo, totalRows);
        },
        formatSearch: function () {
            return 'Search';
        },
        formatNoMatches: function () {
            return 'No matching records found';
        },
        formatPaginationSwitch: function () {
            return 'Hide/Show pagination';
        },
        formatRefresh: function () {
            return 'Refresh';
        },
        formatToggle: function () {
            return 'Toggle';
        },
        formatColumns: function () {
            return 'Columns';
        },
        formatAllRows: function () {
            return 'All';
        }
    };
    BootstrapTable.LOCALES['zh-CN'] = {
        formatLoadingMessage: function () {
            return '正在努力地加载数据中，请稍候……';
        },
        formatRecordsPerPage: function (pageNumber) {
            return '每页显示 ' + pageNumber + ' 条记录';
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录';
        },
        formatSearch: function () {
            return '搜索';
        },
        formatNoMatches: function () {
            return '没有找到匹配的记录';
        },
        formatPaginationSwitch: function () {
            return '隐藏/显示分页';
        },
        formatRefresh: function () {
            return '刷新';
        },
        formatToggle: function () {
            return '切换';
        },
        formatColumns: function () {
            return '列';
        },
        formatAllRows: function () {
            return '全部';
        }
    };

    $.extend(BootstrapTable.DEFAULTS, BootstrapTable.LOCALES['zh-CN']);

    BootstrapTable.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        checkboxEnabled: true,
        field: undefined,
        title: undefined,
        'class': undefined,
        align: undefined, // left, right, center
        halign: undefined, // left, right, center
        falign: undefined, // left, right, center
        valign: undefined, // top, middle, bottom
        width: undefined,
        sortable: true,
        order: 'asc', // asc, desc
        visible: true,
        switchable: true,
        clickToSelect: true,
        formatter: undefined,
        footerFormatter: undefined,
        events: undefined,
        sorter: undefined,
        cellStyle: undefined,
        searchable: true,
        cardVisible: true,
        filterControl: undefined // edit, todo: select, todo: date
    };

    BootstrapTable.EVENTS = {
        'all.bs.table': 'onAll',
        'click-row.bs.table': 'onClickRow',
        'dbl-click-row.bs.table': 'onDblClickRow',
        'sort.bs.table': 'onSort',
        'check.bs.table': 'onCheck',
        'uncheck.bs.table': 'onUncheck',
        'check-all.bs.table': 'onCheckAll',
        'uncheck-all.bs.table': 'onUncheckAll',
        'load-success.bs.table': 'onLoadSuccess',
        'load-error.bs.table': 'onLoadError',
        'column-switch.bs.table': 'onColumnSwitch',
        'column-search.bs.table': 'onColumnSearch',
        'page-change.bs.table': 'onPageChange',
        'search.bs.table': 'onSearch',
        'pre-body.bs.table': 'onPreBody',
        'post-body.bs.table': 'onPostBody',
        'post-header.bs.table': 'onPostHeader'
    };

    BootstrapTable.prototype.init = function () {
        this.initContainer();
        this.initTable();
        this.initHeader();
        this.initData();
        this.initFooter();
        this.initToolbar();
        this.initPagination();
        this.initBody();
        this.initServer();
        this.initKeyEvents();
    };

    BootstrapTable.prototype.initContainer = function () {
        this.$container = $([
            '<div class="bootstrap-table">',
            '<div class="fixed-table-toolbar"></div>',
            this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination" style="clear: both;"></div>' :
                '',
            '<div class="fixed-table-container">',
            '<div class="fixed-table-header"><table></table></div>',
            '<div class="fixed-table-body">',
            '<div class="fixed-table-loading">',
            this.options.formatLoadingMessage(),
            '</div>',
            '</div>',
            '<div class="fixed-table-footer"><table><tr></tr></table></div>',
            this.options.paginationVAlign === 'bottom' || this.options.paginationVAlign === 'both' ?
                '<div class="fixed-table-pagination"></div>' :
                '',
            '</div>',
            '</div>'].join(''));

        this.$container.insertAfter(this.$el);
        this.$container.find('.fixed-table-body').append(this.$el);
        this.$container.after('<div class="clearfix"></div>');
        this.$loading = this.$container.find('.fixed-table-loading');

        this.$el.addClass(this.options.classes);
        if (this.options.striped) {
            this.$el.addClass('table-striped');
        }
    };

    BootstrapTable.prototype.initTable = function () {
        var that = this,
            columns = [],
            data = [];

        this.$header = this.$el.find('thead');
        if (!this.$header.length) {
            this.$header = $('<thead></thead>').appendTo(this.$el);
        }
        if (!this.$header.find('tr').length) {
            this.$header.append('<tr></tr>');
        }
        this.$header.find('th').each(function () {
            var column = $.extend({}, {
                title: $(this).html(),
                'class': $(this).attr('class')
            }, $(this).data());

            columns.push(column);
        });
        this.options.columns = $.extend(true, [], columns, this.options.columns);
        $.each(this.options.columns, function (i, column) {
            that.options.columns[i] = $.extend({}, BootstrapTable.COLUMN_DEFAULTS,
                {field: i}, column); // when field is undefined, use index instead
        });

        // if options.data is setting, do not process tbody data
        if (this.options.data.length) {
            return;
        }

        this.$el.find('tbody tr').each(function () {
            var row = {};

            // save tr's id and class
            row._id = $(this).attr('id');
            row._class = $(this).attr('class');

            $(this).find('td').each(function (i) {
                var field = that.options.columns[i].field;

                row[field] = $(this).html();
                // save td's id and class
                row['_' + field + '_id'] = $(this).attr('id');
                row['_' + field + '_class'] = $(this).attr('class');
                row['_' + field + '_data'] = $(this).data();
            });
            data.push(row);
        });
        this.options.data = data;
    };

    BootstrapTable.prototype.initHeader = function () {
        var that = this,
            visibleColumns = [],
            html = [],
            addedFilterControl = false,
            timeoutId = 0;

        this.header = {
            fields: [],
            styles: [],
            classes: [],
            formatters: [],
            events: [],
            sorters: [],
            cellStyles: [],
            clickToSelects: [],
            searchables: []
        };

        $.each(this.options.columns, function (i, column) {
            var text = '',
                halign = '', // header align style
                align = '', // body align style
                style = '',
                class_ = sprintf(' class="%s"', column['class']),
                order = that.options.sortOrder || column.order,
                searchable = true,
                unitWidth = 'px',
                isVisible = 'hidden';

            if (!column.visible) {
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            if (column.width !== undefined) {
                if (typeof column.width === 'string') {
                    if (column.width.indexOf('%') > -1) {
                        unitWidth = '%'
                    }
                    column.width = column.width.replace('%', '').replace('px', '');
                }
            }

            halign = sprintf('text-align: %s; ', column.halign ? column.halign : column.align);
            align = sprintf('text-align: %s; ', column.align);
            style = sprintf('vertical-align: %s; ', column.valign);
            style += sprintf('width: %s'+ unitWidth +'; ', column.checkbox || column.radio ? 36 : column.width);

            visibleColumns.push(column);
            that.header.fields.push(column.field);
            that.header.styles.push(align + style);
            that.header.classes.push(class_);
            that.header.formatters.push(column.formatter);
            that.header.events.push(column.events);
            that.header.sorters.push(column.sorter);
            that.header.cellStyles.push(column.cellStyle);
            that.header.clickToSelects.push(column.clickToSelect);
            that.header.searchables.push(column.searchable);

            html.push('<th',
                column.checkbox || column.radio ?
                    sprintf(' class="bs-checkbox %s"', column['class'] || '') :
                    class_,
                sprintf(' style="%s"', halign + style),
                '>');

            html.push(sprintf('<div class="th-inner %s">', that.options.sortable && column.sortable ?
                'sortable' : ''));

            text = column.title;
            if (that.options.sortName === column.field && that.options.sortable && column.sortable) {
                text += that.getCaretHtml();
            }

            if (column.checkbox) {
                if (!that.options.singleSelect && that.options.checkboxHeader) {
                    text = '<input name="btSelectAll" type="checkbox" />';
                }
                that.header.stateField = column.field;
            }
            if (column.radio) {
                text = '';
                that.header.stateField = column.field;
                that.options.singleSelect = true;
            }

            html.push(text);
            html.push('</div>');
            html.push('<div class="fht-cell"></div>');

            html.push('<div style="margin: 0px 2px 2px 2px;" class="filterControl">');

            if (column.filterControl && column.searchable) {
                addedFilterControl = true;
                isVisible = 'visible'
            }

            if (column.filterControl !== undefined) {
                switch (column.filterControl.toLowerCase()) {
                    case 'input' :
                        html.push(sprintf('<input type="text" class="form-control" style="width: 100%; visibility: %s">', isVisible));
                        break;
                    case 'select':
                        html.push(sprintf('<select class="%s form-control" style="width: 100%; visibility: %s"></select>',
                            column.field, isVisible))
                        break;
                }
            } else {
                html.push('<div style="height: 34px;"></div>');
            }

            html.push('</div>');

            html.push('</th>');
        });

        this.$header.find('tr').html(html.join(''));
        this.$header.find('th').each(function (i) {
            $(this).data(visibleColumns[i]);
        });
        this.$container.off('click', '.th-inner').on('click', '.th-inner', function (event) {
            if (that.options.sortable && $(this).parent().data().sortable) {
                that.onSort(event);
            }
        });

        if (!this.options.showHeader || this.options.cardView) {
            this.$header.hide();
            this.$container.find('.fixed-table-header').hide();
            this.$loading.css('top', 0);
        } else {
            this.$header.show();
            this.$container.find('.fixed-table-header').show();
            this.$loading.css('top', cellHeight + 'px');
        }

        this.$selectAll = this.$header.find('[name="btSelectAll"]');
        this.$container.off('click', '[name="btSelectAll"]')
            .on('click', '[name="btSelectAll"]', function () {
                var checked = $(this).prop('checked');
                that[checked ? 'checkAll' : 'uncheckAll']();
            });

        if (addedFilterControl) {
            this.$header.off('keyup', 'input').on('keyup' , 'input', function (event) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    that.onColumnSearch(event);
                }, that.options.searchTimeOut);
            });

            this.$header.off('change', 'select').on('change' , 'select', function (event) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function () {
                    that.onColumnSearch(event);
                }, that.options.searchTimeOut);
            });
        } else {
            this.$header.find('.filterControl').hide();
        }
    };

    BootstrapTable.prototype.initFooter = function () {
        this.$footer =  this.$container.find('.fixed-table-footer');
        if (!this.options.showFooter || this.options.cardView) {
            this.$footer.hide();
        } else {
            this.$footer.show();
        }
    };

    /**
     * @param data
     * @param type: append / prepend
     */
    BootstrapTable.prototype.initData = function (data, type) {
        if (type === 'append') {
            this.data = this.data.concat(data);
        } else if (type === 'prepend') {
            this.data = [].concat(data).concat(this.data);
        } else {
            this.data = data || this.options.data;
        }
        this.options.data = this.data;

        if (this.options.sidePagination === 'server') {
            return;
        }
        this.initSort();
    };

    BootstrapTable.prototype.initSort = function () {
        var that = this,
            name = this.options.sortName,
            order = this.options.sortOrder === 'desc' ? -1 : 1,
            index = $.inArray(this.options.sortName, this.header.fields);

        if (index !== -1) {
            this.data.sort(function (a, b) {
                var aa = a[name],
                    bb = b[name],
                    value = calculateObjectValue(that.header, that.header.sorters[index], [aa, bb]);

                if (value !== undefined) {
                    return order * value;
                }

                if (value !== undefined) {
                    return order * value;
                }

                // Fix #161: undefined or null string sort bug.
                if (aa === undefined || aa === null) {
                    aa = '';
                }
                if (bb === undefined || bb === null) {
                    bb = '';
                }

                // IF both values are numeric, do a numeric comparison
                if ($.isNumeric(aa) && $.isNumeric(bb)) {
                    // Convert numerical values form string to float.
                    aa = parseFloat(aa);
                    bb = parseFloat(bb);
                    if (aa < bb) {
                        return order * -1;
                    }
                    return order;
                }

                if (aa === bb) {
                    return 0;
                }

                // If value is not a string, convert to string
                if (typeof aa !== 'string') {
                    aa = aa.toString();
                }

                if (aa.localeCompare(bb) === -1) {
                    return order * -1;
                }

                return order;
            });
        }
    };

    BootstrapTable.prototype.onSort = function (event) {
        var $this = $(event.currentTarget).parent(),
            $this_ = this.$header.find('th').eq($this.index());

        this.$header.add(this.$header_).find('span.order').remove();

        if (this.options.sortName === $this.data('field')) {
            this.options.sortOrder = this.options.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.options.sortName = $this.data('field');
            this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';
        }
        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder)
            .find('.th-inner').append(this.getCaretHtml());

        if (this.options.sidePagination === 'server') {
            this.initServer();
            return;
        }

        this.initSort();
        this.initBody();
    };

    BootstrapTable.prototype.initToolbar = function () {
        var that = this,
            html = [],
            timeoutId = 0,
            $keepOpen,
            $search,
            switchableCount = 0;

        this.$toolbar = this.$container.find('.fixed-table-toolbar').html('');

        if (typeof this.options.toolbar === 'string') {
            $(sprintf('<div class="bars pull-%s"></div>', this.options.toolbarAlign))
                .appendTo(this.$toolbar)
                .append($(this.options.toolbar));
        }

        // showColumns, showToggle, showRefresh
        html = [sprintf('<div class="columns columns-%s btn-group pull-%s">',
            this.options.buttonsAlign, this.options.buttonsAlign)];

        if (typeof this.options.icons === 'string') {
            this.options.icons = calculateObjectValue(null, this.options.icons);
        }

        if (this.options.showPaginationSwitch) {
            html.push(sprintf('<button class="btn btn-default" type="button" name="paginationSwitch" title="%s">',
                this.options.formatPaginationSwitch()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.paginationSwitchDown),
                '</button>');
        }

        if (this.options.showRefresh) {
            html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="refresh" title="%s">',
                this.options.formatRefresh()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.refresh),
                '</button>');
        }

        if (this.options.showToggle) {
            html.push(sprintf('<button class="btn btn-default' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + '" type="button" name="toggle" title="%s">',
                this.options.formatToggle()),
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.toggle),
                '</button>');
        }

        if (this.options.showColumns) {
            html.push(sprintf('<div class="keep-open btn-group" title="%s">',
                this.options.formatColumns()),
                '<button type="button" class="btn btn-default' + (this.options.iconSize == undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">');

            $.each(this.options.columns, function (i, column) {
                if (column.radio || column.checkbox) {
                    return;
                }

                if (that.options.cardView && (!column.cardVisible)) {
                    return;
                }

                var checked = column.visible ? ' checked="checked"' : '';

                if (column.switchable) {
                    html.push(sprintf('<li>' +
                        '<label><input type="checkbox" data-field="%s" value="%s"%s> %s</label>' +
                        '</li>', column.field, i, checked, column.title));
                    switchableCount++;
                }
            });
            html.push('</ul>',
                '</div>');
        }

        html.push('</div>');

        // Fix #188: this.showToolbar is for extentions
        if (this.showToolbar || html.length > 2) {
            this.$toolbar.append(html.join(''));
        }

        if (this.options.showPaginationSwitch) {
            this.$toolbar.find('button[name="paginationSwitch"]')
                .off('click').on('click', $.proxy(this.togglePagination, this));
        }

        if (this.options.showRefresh) {
            this.$toolbar.find('button[name="refresh"]')
                .off('click').on('click', $.proxy(this.refresh, this));
        }

        if (this.options.showToggle) {
            this.$toolbar.find('button[name="toggle"]')
                .off('click').on('click', function () {
                    that.toggleView();
                });
        }

        if (this.options.showColumns) {
            $keepOpen = this.$toolbar.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
                $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (event) {
                event.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function () {
                var $this = $(this);

                that.toggleColumn($this.val(), $this.prop('checked'), false);
                that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
            });
        }

        if (this.options.search) {
            html = [];
            html.push(
                '<div class="pull-' + this.options.searchAlign + ' search">',
                sprintf('<input class="form-control' + (this.options.iconSize === undefined ? '' : ' input-' + this.options.iconSize) + '" type="text" placeholder="%s">',
                    this.options.formatSearch()),
                '</div>');

            this.$toolbar.append(html.join(''));
            $search = this.$toolbar.find('.search input');
            $search.off('keyup').on('keyup', function (event) {
                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    that.onSearch(event);
                }, that.options.searchTimeOut);
            });

            if (this.options.searchText !== '') {
                $search.val(this.options.searchText);
                clearTimeout(timeoutId); // doesn't matter if it's 0
                timeoutId = setTimeout(function () {
                    $search.trigger('keyup');
                }, that.options.searchTimeOut);
            }
        }
    };

    BootstrapTable.prototype.onSearch = function (event) {
        var text = $.trim($(event.currentTarget).val());

        // trim search input
        if (this.options.trimOnSearch && $(event.currentTarget).val() !== text) {
            $(event.currentTarget).val(text);
        }

        if (text === this.searchText) {
            return;
        }
        this.searchText = text;

        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
        this.trigger('search', text);
    };

    BootstrapTable.prototype.onColumnSearch = function (event, isSelectControl) {
        var text = $.trim($(event.currentTarget).val());
        var $field = $(event.currentTarget).parent().parent().data('field')

        // trim search input
        //$(event.currentTarget).val(text);

        if ($.isEmptyObject(this.filterColumnsPartial)) {
            this.filterColumnsPartial = {};
        }
        if (text) {
            this.filterColumnsPartial[$field] = text;
        } else {
            delete this.filterColumnsPartial[$field];
        }

        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
        /* this.trigger('column-search', $field, text); */
    };

    BootstrapTable.prototype.initSearch = function () {
        var that = this;

        if (this.options.sidePagination !== 'server') {
            var s = this.searchText && this.searchText.toLowerCase();
            var f = $.isEmptyObject(this.filterColumns) ? null : this.filterColumns;
            var fp = $.isEmptyObject(this.filterColumnsPartial) ? null: this.filterColumnsPartial;

            // Check filter
            this.data = f ? $.grep(this.options.data, function (item, i) {
                for (var key in f) {
                    if (item[key] !== f[key]) {
                        return false;
                    }
                }
                return true;
            }) : this.options.data;

            //Check partial colum filter
            this.data = fp ? $.grep(this.data, function (item, i) {
                for (var key in fp) {
                    var fval = fp[key].toLowerCase();
                    var value = item[key];
                    value = calculateObjectValue(that.header,
                        that.header.formatters[$.inArray(key, that.header.fields)],
                        [value, item, i], value);

                    if (! ($.inArray(key, that.header.fields) !== -1 &&
                        (typeof value === 'string' || typeof value === 'number') &&
                        (value + '').toLowerCase().indexOf(fval) !== -1)) {
                        return false;
                    }
                }
                return true;
            }) : this.data;

            this.data = s ? $.grep(this.data, function (item, i) {
                for (var key in item) {
                    key = $.isNumeric(key) ? parseInt(key, 10) : key;
                    var value = item[key];

                    // Fix #142: search use formated data
                    value = calculateObjectValue(that.header,
                        that.header.formatters[$.inArray(key, that.header.fields)],
                        [value, item, i], value);

                    var index = $.inArray(key, that.header.fields);
                    if (index !== -1 && that.header.searchables[index] &&
                        (typeof value === 'string' ||
                            typeof value === 'number') &&
                        (value + '').toLowerCase().indexOf(s) !== -1) {
                        return true;
                    }
                }
                return false;
            }) : this.data;
        }
    };

    BootstrapTable.prototype.initPagination = function () {
        this.$pagination = this.$container.find('.fixed-table-pagination');

        if (!this.options.pagination) {
            this.$pagination.hide();
            return;
        } else {
            this.$pagination.show();
        }

        var that = this,
            html = [],
            $allSelected = false,
            i, from, to,
            $pageList,
            $first, $pre,
            $next, $last,
            $number,
            data = this.getData();

        if (this.options.sidePagination !== 'server') {
            this.options.totalRows = data.length;
        }

        this.totalPages = 0;
        if (this.options.totalRows) {
            if (this.options.pageSize === this.options.formatAllRows()) {
                this.options.pageSize = this.options.totalRows;
                $allSelected = true;
            } else if (this.options.pageSize === this.options.totalRows) {
                // Fix #667 Table with pagination, multiple pages and a search that matches to one page throws exception
                var pageLst = typeof this.options.pageList === 'string' ?
                    this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').toLowerCase().split(',') :
                    this.options.pageList;
                if (pageLst.indexOf(this.options.formatAllRows().toLowerCase()) > -1) {
                    $allSelected = true;
                }
            }

            this.totalPages = ~~((this.options.totalRows - 1) / this.options.pageSize) + 1;

            this.options.totalPages = this.totalPages;
        }
        if (this.totalPages > 0 && this.options.pageNumber > this.totalPages) {
            this.options.pageNumber = this.totalPages;
        }

        this.pageFrom = (this.options.pageNumber - 1) * this.options.pageSize + 1;
        this.pageTo = this.options.pageNumber * this.options.pageSize;
        if (this.pageTo > this.options.totalRows) {
            this.pageTo = this.options.totalRows;
        }

        html.push(
            '<div class="pull-' + this.options.paginationDetailHAlign + ' pagination-detail">',
            '<span class="pagination-info">',
            this.options.formatShowingRows(this.pageFrom, this.pageTo, this.options.totalRows),
            '</span>');

        html.push('<span class="page-list">');

        var pageNumber = [
                /*sprintf('<span class="btn-group %s">', this.options.paginationVAlign === 'top' || this.options.paginationVAlign === 'both' ?
                    'dropdown' : 'dropup'),*/
                sprintf('<span class="btn-group">'),
                '<button type="button" class="btn btn-default ' + (this.options.iconSize === undefined ? '' : ' btn-' + this.options.iconSize) + ' dropdown-toggle" data-toggle="dropdown">',
                '<span class="page-size">',
                $allSelected ? this.options.formatAllRows() : this.options.pageSize,
                '</span>',
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu" role="menu">'],
            pageList = this.options.pageList;

        if (typeof this.options.pageList === 'string') {
            var list = this.options.pageList.replace('[', '').replace(']', '').replace(/ /g, '').split(',');

            pageList = [];
            $.each(list, function (i, value) {
                pageList.push(value.toUpperCase() === that.options.formatAllRows().toUpperCase() ?
                                that.options.formatAllRows() : +value);
            });
        }

        $.each(pageList, function (i, page) {
            if (!that.options.smartDisplay || i === 0 || pageList[i - 1] <= that.options.totalRows) {
                var active;
                if ($allSelected) {
                    active = page === that.options.formatAllRows() ? ' class="active"' : '';
                } else{
                    active = page === that.options.pageSize ? ' class="active"' : '';
                }
                pageNumber.push(sprintf('<li%s><a href="javascript:void(0)">%s</a></li>', active, page));
            }
        });
        pageNumber.push('</ul></span>');

        html.push(this.options.formatRecordsPerPage(pageNumber.join('')));
        html.push('</span>');

        // Fixed #611 vertical-align between pagination block and pagination-detail block. Remove class pagination.
        html.push('</div>',
            '<div class="pull-' + this.options.paginationHAlign + '">',
            '<ul class="pagination' + (this.options.iconSize === undefined ? '' : ' pagination-' + this.options.iconSize) + '">',
            '<li class="page-first"><a href="javascript:void(0)">&lt;&lt;</a></li>',
            '<li class="page-pre"><a href="javascript:void(0)">&lt;</a></li>');

        if (this.totalPages < 5) {
            from = 1;
            to = this.totalPages;
        } else {
            from = this.options.pageNumber - 2;
            to = from + 4;
            if (from < 1) {
                from = 1;
                to = 5;
            }
            if (to > this.totalPages) {
                to = this.totalPages;
                from = to - 4;
            }
        }
        for (i = from; i <= to; i++) {
            html.push('<li class="page-number' + (i === this.options.pageNumber ? ' active' : '') + '">',
                '<a href="javascript:void(0)">', i, '</a>',
                '</li>');
        }

        html.push(
            '<li class="page-next"><a href="javascript:void(0)">&gt;</a></li>',
            '<li class="page-last"><a href="javascript:void(0)">&gt;&gt;</a></li>',
            '</ul>',
            '</div>');

        this.$pagination.html(html.join(''));

        $pageList = this.$pagination.find('.page-list a');
        $first = this.$pagination.find('.page-first');
        $pre = this.$pagination.find('.page-pre');
        $next = this.$pagination.find('.page-next');
        $last = this.$pagination.find('.page-last');
        $number = this.$pagination.find('.page-number');

        if (this.options.pageNumber <= 1) {
            $first.addClass('disabled');
            $pre.addClass('disabled');
        }
        if (this.options.pageNumber >= this.totalPages) {
            $next.addClass('disabled');
            $last.addClass('disabled');
        }
        if (this.options.smartDisplay) {
            if (this.totalPages <= 1) {
                this.$pagination.find('div.pagination').hide();
            }
            if (pageList.length < 2 || this.options.totalRows <= pageList[0]) {
                this.$pagination.find('span.page-list').hide();
            }

            // when data is empty, hide the pagination
            this.$pagination[this.getData().length ? 'show' : 'hide']();
        }
        if ($allSelected) {
            this.options.pageSize = this.options.formatAllRows();
        }
        $pageList.off('click').on('click', $.proxy(this.onPageListChange, this));
        $first.off('click').on('click', $.proxy(this.onPageFirst, this));
        $pre.off('click').on('click', $.proxy(this.onPagePre, this));
        $next.off('click').on('click', $.proxy(this.onPageNext, this));
        $last.off('click').on('click', $.proxy(this.onPageLast, this));
        $number.off('click').on('click', $.proxy(this.onPageNumber, this));
    };

    BootstrapTable.prototype.updatePagination = function (event) {
        // Fix #171: IE disabled button can be clicked bug.
        if (event && $(event.currentTarget).hasClass('disabled')) {
            return;
        }

        if (!this.options.maintainSelected) {
            this.resetRows();
        }

        this.initPagination();
        if (this.options.sidePagination === 'server') {
            this.initServer();
        } else {
            this.initBody();
        }

        this.trigger('page-change', this.options.pageNumber, this.options.pageSize);
    };

    BootstrapTable.prototype.onPageListChange = function (event) {
        var $this = $(event.currentTarget);

        $this.parent().addClass('active').siblings().removeClass('active');
        this.options.pageSize = $this.text().toUpperCase() === this.options.formatAllRows().toUpperCase() ?
                                    this.options.formatAllRows() : +$this.text();
        this.$toolbar.find('.page-size').text(this.options.pageSize);

        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageFirst = function (event) {
        this.options.pageNumber = 1;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPagePre = function (event) {
        this.options.pageNumber--;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageNext = function (event) {
        this.options.pageNumber++;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageLast = function (event) {
        this.options.pageNumber = this.totalPages;
        this.updatePagination(event);
    };

    BootstrapTable.prototype.onPageNumber = function (event) {
        if (this.options.pageNumber === +$(event.currentTarget).text()) {
            return;
        }
        this.options.pageNumber = +$(event.currentTarget).text();
        this.updatePagination(event);
    };

    BootstrapTable.prototype.initBody = function (fixedScroll) {
        var that = this,
            html = [],
            data = this.getData();

        this.trigger('pre-body', data);

        this.$body = this.$el.find('tbody');
        if (!this.$body.length) {
            this.$body = $('<tbody></tbody>').appendTo(this.$el);
        }

        //Fix #389 Bootstrap-table-flatJSON is not working

        if (!this.options.pagination || this.options.sidePagination === 'server') {
            this.pageFrom = 1;
            this.pageTo = data.length;
        }

        for (var i = this.pageFrom - 1; i < this.pageTo; i++) {
            var key,
                item = data[i],
                style = {},
                csses = [],
                attributes = {},
                htmlAttributes = [];

            style = calculateObjectValue(this.options, this.options.rowStyle, [item, i], style);

            if (style && style.css) {
                for (key in style.css) {
                    csses.push(key + ': ' + style.css[key]);
                }
            }

            attributes = calculateObjectValue(this.options,
                this.options.rowAttributes, [item, i], attributes);

            if (attributes) {
                for (key in attributes) {
                    htmlAttributes.push(sprintf('%s="%s"', key, escapeHTML(attributes[key])));
                }
            }

            html.push('<tr',
                sprintf(' %s', htmlAttributes.join(' ')),
                sprintf(' id="%s"', $.isArray(item) ? undefined : item._id),
                sprintf(' class="%s"', style.classes || ($.isArray(item) ? undefined : item._class)),
                sprintf(' data-index="%s"', i),
                sprintf(' data-unique-id="%s"', item[this.options.uniqueId]),
                '>'
            );

            if (this.options.cardView) {
                html.push(sprintf('<td colspan="%s">', this.header.fields.length));
            }

            $.each(this.header.fields, function (j, field) {
                var text = '',
                    value = item[field],
                    type = '',
                    cellStyle = {},
                    id_ = '',
                    class_ = that.header.classes[j],
                    data_ = '',
                    column = that.options.columns[getFieldIndex(that.options.columns, field)];

                style = sprintf('style="%s"', csses.concat(that.header.styles[j]).join('; '));

                value = calculateObjectValue(that.header,
                    that.header.formatters[j], [value, item, i], value);

                // handle td's id and class
                if (item['_' + field + '_id']) {
                    id_ = sprintf(' id="%s"', item['_' + field + '_id']);
                }
                if (item['_' + field + '_class']) {
                    class_ = sprintf(' class="%s"', item['_' + field + '_class']);
                }
                cellStyle = calculateObjectValue(that.header,
                    that.header.cellStyles[j], [value, item, i], cellStyle);
                if (cellStyle.classes) {
                    class_ = sprintf(' class="%s"', cellStyle.classes);
                }
                if (cellStyle.css) {
                    var csses_ = [];
                    for (var key in cellStyle.css) {
                        csses_.push(key + ': ' + cellStyle.css[key]);
                    }
                    style = sprintf('style="%s"', csses_.concat(that.header.styles[j]).join('; '));
                }

                if (item['_' + field + '_data'] && !$.isEmptyObject(item['_' + field + '_data'])) {
                    $.each(item['_' + field + '_data'], function (k, v) {
                        // ignore data-index
                        if (k === 'index') {
                            return;
                        }
                        data_ += sprintf(' data-%s="%s"', k, v);
                    });
                }

                if (column.checkbox || column.radio) {
                    type = column.checkbox ? 'checkbox' : type;
                    type = column.radio ? 'radio' : type;

                    text = [that.options.cardView ?
                        '<div class="card-view">' : '<td class="bs-checkbox">',
                        '<input' +
                            sprintf(' data-index="%s"', i) +
                            sprintf(' name="%s"', that.options.selectItemName) +
                            sprintf(' type="%s"', type) +
                            sprintf(' value="%s"', item[that.options.idField]) +
                            sprintf(' checked="%s"', value === true ||
                                (value && value.checked) ? 'checked' : undefined) +
                            sprintf(' disabled="%s"', !column.checkboxEnabled ||
                                (value && value.disabled) ? 'disabled' : undefined) +
                            ' />',
                        that.options.cardView ? '</div>' : '</td>'].join('');
                } else {
                    value = typeof value === 'undefined' || value === null ?
                        that.options.undefinedText : value;

                    text = that.options.cardView ?
                        ['<div class="card-view">',
                            that.options.showHeader ? sprintf('<span class="title" %s>%s</span>', style,
                                getPropertyFromOther(that.options.columns, 'field', 'title', field)) : '',
                            sprintf('<span class="value">%s</span>', value),
                            '</div>'].join('') :
                        [sprintf('<td%s %s %s %s>', id_, class_, style, data_),
                            value,
                            '</td>'].join('');

                    if (column.filterControl !== undefined && column.filterControl.toLowerCase() === 'select'
                        && column.searchable) {

                        var selectControl = $('.' + column.field),
                            iOpt = 0,
                            exitsOpt = false,
                            options;
                        if (selectControl !== undefined) {
                            options = selectControl.get(0).options;

                            if (options.length === 0) {

                                //Added the default option
                                selectControl.append($("<option></option>")
                                    .attr("value", '')
                                    .text(''));

                                selectControl.append($("<option></option>")
                                    .attr("value",value)
                                    .text(value));
                            } else {
                                for (; iOpt < options.length; iOpt++ ) {
                                    if (options[iOpt].value === value) {
                                        exitsOpt = true;
                                        break;
                                    }
                                }

                                if (!exitsOpt) {
                                    selectControl.append($("<option></option>")
                                        .attr("value",value)
                                        .text(value));
                                }
                            }
                        }
                    }

                    // Hide empty data on Card view when smartDisplay is set to true.
                    if (that.options.cardView && that.options.smartDisplay && value === '') {
                        text = '';
                    }
                }

                html.push(text);
            });

            if (this.options.cardView) {
                html.push('</td>');
            }

            html.push('</tr>');
        }

        // show no records
        if (!html.length) {
            html.push('<tr class="no-records-found">',
                sprintf('<td colspan="%s">%s</td>', this.header.fields.length, this.options.formatNoMatches()),
                '</tr>');
        }

        this.$body.html(html.join(''));

        if (!fixedScroll) {
            this.scrollTo(0);
        }

        // click to select by column
        this.$body.find('> tr > td').off('click').on('click', function () {
            var $tr = $(this).parent();
            that.trigger('click-row', that.data[$tr.data('index')], $tr);
            // if click to select - then trigger the checkbox/radio click
            if (that.options.clickToSelect) {
                if (that.header.clickToSelects[$tr.children().index($(this))]) {
                    $tr.find(sprintf('[name="%s"]',
                        that.options.selectItemName))[0].click(); // #144: .trigger('click') bug
                }
            }
        });
        this.$body.find('tr').off('dblclick').on('dblclick', function () {
            that.trigger('dbl-click-row', that.data[$(this).data('index')], $(this));
        });

        this.$selectItem = this.$body.find(sprintf('[name="%s"]', this.options.selectItemName));
        this.$selectItem.off('click').on('click', function (event) {
            event.stopImmediatePropagation();

            var checked = $(this).prop('checked'),
                row = that.data[$(this).data('index')];

            row[that.header.stateField] = checked;
            that.trigger(checked ? 'check' : 'uncheck', row);

            if (that.options.singleSelect) {
                that.$selectItem.not(this).each(function () {
                    that.data[$(this).data('index')][that.header.stateField] = false;
                });
                that.$selectItem.filter(':checked').not(this).prop('checked', false);
            }

            that.updateSelected();
        });

        $.each(this.header.events, function (i, events) {
            if (!events) {
                return;
            }
            // fix bug, if events is defined with namespace
            if (typeof events === 'string') {
                events = calculateObjectValue(null, events);
            }
            for (var key in events) {
                that.$body.find('tr').each(function () {
                    var $tr = $(this),
                        $td = $tr.find(that.options.cardView ? '.card-view' : 'td').eq(i),
                        index = key.indexOf(' '),
                        name = key.substring(0, index),
                        el = key.substring(index + 1),
                        func = events[key];

                    $td.find(el).off(name).on(name, function (e) {
                        var index = $tr.data('index'),
                            row = that.data[index],
                            value = row[that.header.fields[i]];

                        func.apply(this, [e, value, row, index]);
                    });
                });
            }
        });

        this.updateSelected();
        this.resetView();

        this.trigger('post-body');
    };

    BootstrapTable.prototype.initServer = function (silent, query) {
        var that = this,
            data = {},
            params = {
                pageSize: this.options.pageSize === this.options.formatAllRows() ? this.options.totalRows : this.options.pageSize,
                pageNumber: this.options.pageNumber,
                searchText: this.searchText,
                sortName: this.options.sortName,
                sortOrder: this.options.sortOrder
            };

        if (!this.options.url) {
            return;
        }

        if (this.options.queryParamsType === 'limit') {
            params = {
                search: params.searchText,
                sort: params.sortName,
                order: params.sortOrder
            };
            if (this.options.pagination) {
                params.limit = this.options.pageSize === this.options.formatAllRows() ?
                    this.options.totalRows : this.options.pageSize;
                params.offset = this.options.pageSize === this.options.formatAllRows() ?
                    0 : this.options.pageSize * (this.options.pageNumber - 1);
            }
        }

        if (!($.isEmptyObject(this.filterColumnsPartial))) {
            params['filter'] = JSON.stringify(this.filterColumnsPartial, null);
        }

        data = calculateObjectValue(this.options, this.options.queryParams, [params], data);

        $.extend(data, query || {});

        // false to stop request
        if (data === false) {
            return;
        }

        if (!silent) {
            this.$loading.show();
        }

        $.ajax($.extend({}, calculateObjectValue(null, this.options.ajaxOptions), {
            type: this.options.method,
            url: this.options.url,
            data: this.options.contentType === 'application/json' && this.options.method === 'post' ?
                JSON.stringify(data) : data,
            cache: this.options.cache,
            contentType: this.options.contentType,
            dataType: this.options.dataType,
            success: function (res) {
                res = calculateObjectValue(that.options, that.options.responseHandler, [res], res);

                that.load(res);
                that.trigger('load-success', res);
            },
            error: function (res) {
                that.trigger('load-error', res.status);
            },
            complete: function () {
                if (!silent) {
                    that.$loading.hide();
                }
            }
        }));
    };

    BootstrapTable.prototype.initKeyEvents = function () {
      if (this.options.keyEvents) {
          var that = this;
          $(document).off('keypress').on('keypress', function (e) {
              var $search = that.$toolbar.find('.search input'),
                  $refresh = that.$toolbar.find('button[name="refresh"]'),
                  $toggle= that.$toolbar.find('button[name="toggle"]'),
                  $paginationSwitch = that.$toolbar.find('button[name="paginationSwitch"]');
              switch (e.keyCode) {
                  case 115://s
                  case 83://S
                      if (!that.options.search) {
                          return;
                      }

                      if(document.activeElement === $search.get(0)){
                          return true;
                      }
                      $search.focus();
                      return false;
                  case 114: //r
                  case 82: //R
                      if (!that.options.showRefresh) {
                          return;
                      }

                      if(document.activeElement === $search.get(0)){
                          return true;
                      }
                      $refresh.click();
                      return false;
                  case 116: //t
                  case 84: //T
                      if (!that.options.showToggle) {
                          return;
                      }

                      if(document.activeElement === $search.get(0)){
                          return true;
                      }

                      $toggle.click();
                      return false;
                  case 112: //p
                  case 80: //p
                      if (!that.options.showPaginationSwitch) {
                          return;
                      }

                      if(document.activeElement === $search.get(0)){
                          return true;
                      }

                      $paginationSwitch.click();
                      return false;

              }
          });
      }
    };

    BootstrapTable.prototype.getCaretHtml = function () {
        return ['<span class="order' + (this.options.sortOrder === 'desc' ? '' : ' dropup') + '">',
            '<span class="caret" style="margin: 10px 5px;"></span>',
            '</span>'].join('');
    };

    BootstrapTable.prototype.updateSelected = function () {
        var checkAll = this.$selectItem.filter(':enabled').length ===
            this.$selectItem.filter(':enabled').filter(':checked').length;

        this.$selectAll.add(this.$selectAll_).prop('checked', checkAll);

        this.$selectItem.each(function () {
            $(this).parents('tr')[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
        });
    };

    BootstrapTable.prototype.updateRows = function (checked) {
        var that = this;

        this.$selectItem.each(function () {
            that.data[$(this).data('index')][that.header.stateField] = checked;
        });
    };

    BootstrapTable.prototype.resetRows = function () {
        var that = this;

        $.each(this.data, function (i, row) {
            that.$selectAll.prop('checked', false);
            that.$selectItem.prop('checked', false);
            row[that.header.stateField] = false;
        });
    };

    BootstrapTable.prototype.trigger = function (name) {
        var args = Array.prototype.slice.call(arguments, 1);

        name += '.bs.table';
        this.options[BootstrapTable.EVENTS[name]].apply(this.options, args);
        this.$el.trigger($.Event(name), args);

        this.options.onAll(name, args);
        this.$el.trigger($.Event('all.bs.table'), [name, args]);
    };

    BootstrapTable.prototype.resetHeader = function () {
        this.$el.css('margin-top', -this.$header.height());
        // fix #61: the hidden table reset header bug.
        // fix bug: get $el.css('width') error sometime (height = 500)
        clearTimeout(this.timeoutId_);
        this.timeoutId_ = setTimeout($.proxy(this.fitHeader, this), this.$el.is(':hidden') ? 100 : 0);
        return;
    };

    BootstrapTable.prototype.fitHeader = function () {
        var that = this,
            $fixedHeader,
            $fixedBody,
            scrollWidth;

        if (that.$el.is(':hidden')) {
            that.timeoutFooter_ = setTimeout($.proxy(that.fitHeader, that), 100);
            return;
        }
        $fixedHeader = that.$container.find('.fixed-table-header'),
        $fixedBody = that.$container.find('.fixed-table-body'),
        scrollWidth = that.$el.width() > $fixedBody.width() ? getScrollBarWidth() : 0;

        that.$header_ = that.$header.clone(true, true);
        that.$selectAll_ = that.$header_.find('[name="btSelectAll"]');
        $fixedHeader.css({
            'margin-right': scrollWidth
        }).find('table').css('width', that.$el.css('width'))
            .html('').attr('class', that.$el.attr('class'))
            .append(that.$header_);

        // fix bug: $.data() is not working as expected after $.append()
        that.$header.find('th').each(function (i) {
            that.$header_.find('th').eq(i).data($(this).data());
        });

        that.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
            that.$header_.find('div.fht-cell').eq(i).width($(this).innerWidth());
        });
        // horizontal scroll event
        // TODO: it's probably better improving the layout than binding to scroll event
        $fixedBody.off('scroll').on('scroll', function () {
            $fixedHeader.scrollLeft($(this).scrollLeft());
        });
        that.trigger('post-header');
    };

    BootstrapTable.prototype.resetFooter = function () {
        var that = this,
            data = that.getData(),
            html = [];

        if (!this.options.showFooter || this.options.cardView) { //do nothing
            return;
        }

        $.each(this.options.columns, function (i, column) {
            var falign = '', // footer align style
                style  = '',
                class_ = sprintf(' class="%s"', column['class']);

            if (!column.visible) {
                return;
            }

            if (that.options.cardView && (!column.cardVisible)) {
                return;
            }

            falign = sprintf('text-align: %s; ', column.falign ? column.falign : column.align);
            style = sprintf('vertical-align: %s; ', column.valign);

            html.push('<td', class_, sprintf(' style="%s"', falign + style), '>');


            html.push(calculateObjectValue(column, column.footerFormatter, [data], '&nbsp;') || '&nbsp;');
            html.push('</td>');
        });

        this.$footer.find('tr').html(html.join(''));
        clearTimeout(this.timeoutFooter_);
        this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this),
            this.$el.is(':hidden') ? 100: 0);
    };

    BootstrapTable.prototype.fitFooter = function () {
        var that = this,
            $fixedBody,
            $footerTd,
            elWidth,
            scrollWidth;

        clearTimeout(this.timeoutFooter_);
        if (this.$el.is(':hidden')) {
            this.timeoutFooter_ = setTimeout($.proxy(this.fitFooter, this), 100);
            return;
        }

        $fixedBody  = this.$container.find('.fixed-table-body');
        elWidth     = this.$el.css('width');
        scrollWidth = elWidth > $fixedBody.width() ? getScrollBarWidth() : 0;

        this.$footer.css({
            'margin-right': scrollWidth
        }).find('table').css('width', elWidth)
            .attr('class', this.$el.attr('class'));

        $footerTd = this.$footer.find('td');

        $fixedBody.find('tbody tr:first-child:not(.no-records-found) > td').each(function(i) {
            $footerTd.eq(i).outerWidth($(this).outerWidth());
        });
    };

    BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
        if (index === -1) {
            return;
        }
        this.options.columns[index].visible = checked;
        this.initHeader();
        this.initSearch();
        this.initPagination();
        this.initBody();

        if (this.options.showColumns) {
            var $items = this.$toolbar.find('.keep-open input').prop('disabled', false);

            if (needUpdate) {
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    BootstrapTable.prototype.toggleRow = function (index, isIdField, visible) {
        if (index === -1) {
           return;
        }

        $(this.$body[0]).children().filter(sprintf( isIdField ? '[value="%s"]' : '[data-index="%s"]', index))
            [visible ? 'show' : 'hide']();
     };

    // PUBLIC FUNCTION DEFINITION
    // =======================

    BootstrapTable.prototype.resetView = function (params) {
        var that = this,
            padding = 0,
            $tableContainer = that.$container.find('.fixed-table-container');

        if (params && params.height) {
            this.options.height = params.height;
        }

        this.$selectAll.prop('checked', this.$selectItem.length > 0 &&
            this.$selectItem.length === this.$selectItem.filter(':checked').length);

        if (this.options.height) {
            var toolbarHeight = +this.$toolbar.children().outerHeight(true),
                paginationHeight = +this.$pagination.children().outerHeight(true),
                height = this.options.height - toolbarHeight - paginationHeight;

            $tableContainer.css('height', height + 'px');
        }

        if (this.options.cardView) {
            // remove the element css
            that.$el.css('margin-top', '0');
            $tableContainer.css('padding-bottom', '0');
            return;
        }

        if (this.options.showHeader && this.options.height) {
            this.$container.find('.fixed-table-header').show();
            this.resetHeader();
            padding += cellHeight;
        } else {
            this.$container.find('.fixed-table-header').hide();
            this.trigger('post-header');
        }

        if (this.options.showFooter) {
            this.resetFooter();
            if (this.options.height) {
                padding += cellHeight;
            }
        }

        $tableContainer.css('padding-bottom', padding + 'px');
    };

    BootstrapTable.prototype.getData = function () {
        return (this.searchText
            || !$.isEmptyObject(this.filterColumns)
            || !$.isEmptyObject(this.filterColumnsPartial)) ? this.data : this.options.data;
    };

    BootstrapTable.prototype.load = function (data) {
        var fixedScroll = false;

        // #431: support pagination
        if (this.options.sidePagination === 'server') {
            this.options.totalRows = data.total;
            fixedScroll = data.fixedScroll;
            data = data.rows;
        } else if (!$.isArray(data)) { // support fixedScroll
            fixedScroll = data.fixedScroll;
            data = data.data;
        }

        this.initData(data);
        this.initSearch();
        this.initPagination();
        this.initBody(fixedScroll);
    };

    BootstrapTable.prototype.append = function (data) {
        this.initData(data, 'append');
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.prepend = function (data) {
        this.initData(data, 'prepend');
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.remove = function (params) {
        var len = this.options.data.length,
            i, row;

        if (!params.hasOwnProperty('field') || !params.hasOwnProperty('values')) {
            return;
        }

        for (i = len - 1; i >= 0; i--) {
            row = this.options.data[i];

            if (!row.hasOwnProperty(params.field)) {
                continue;
            }
            if ($.inArray(row[params.field], params.values) !== -1) {
                this.options.data.splice(i, 1);
            }
        }

        if (len === this.options.data.length) {
            return;
        }

        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.insertRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        this.data.splice(params.index, 0, params.row);
        this.initSearch();
        this.initPagination();
        this.initBody(true);
    };

    BootstrapTable.prototype.updateRow = function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        $.extend(this.data[params.index], params.row);
        this.initBody(true);
    };

    BootstrapTable.prototype.showRow = function (params) {
        if (!params.hasOwnProperty('index')) {
            return;
        }

        this.toggleRow(params.index, params.isIdField === undefined ? false : true, true);
    };

    BootstrapTable.prototype.hideRow = function (params) {
        if (!params.hasOwnProperty('index')) {
            return;
        }

        this.toggleRow(params.index, params.isIdField === undefined ? false : true, false);
    };

    BootstrapTable.prototype.getRowsHidden = function (show) {
        var rows = $(this.$body[0]).children().filter(':hidden'),
            i = 0;
        if (show) {
            for (; i < rows.length; i++) {
                $(rows[i]).show();
            }
        }
        return rows;
    }

    BootstrapTable.prototype.mergeCells = function (options) {
        var row = options.index,
            col = $.inArray(options.field, this.header.fields),
            rowspan = options.rowspan || 1,
            colspan = options.colspan || 1,
            i, j,
            $tr = this.$body.find('tr'),
            $td = $tr.eq(row).find('td').eq(col);

        if (row < 0 || col < 0 || row >= this.data.length) {
            return;
        }

        for (i = row; i < row + rowspan; i++) {
            for (j = col; j < col + colspan; j++) {
                $tr.eq(i).find('td').eq(j).hide();
            }
        }

        $td.attr('rowspan', rowspan).attr('colspan', colspan).show();
    };

    BootstrapTable.prototype.getOptions = function () {
        return this.options;
    };

    BootstrapTable.prototype.getSelections = function () {
        var that = this;

        return $.grep(this.data, function (row) {
            return row[that.header.stateField];
        });
    };

    BootstrapTable.prototype.checkAll = function () {
        this.checkAll_(true);
    };

    BootstrapTable.prototype.uncheckAll = function () {
        this.checkAll_(false);
    };

    BootstrapTable.prototype.checkAll_ = function (checked) {
        var rows;
        if (!checked) {
            rows = this.getSelections();
        }
        this.$selectItem.filter(':enabled').prop('checked', checked);
        this.updateRows(checked);
        this.updateSelected();
        if (checked) {
            rows = this.getSelections();
        }
        this.trigger(checked ? 'check-all' : 'uncheck-all', rows);
    };

    BootstrapTable.prototype.check = function (index) {
        this.check_(true, index);
    };

    BootstrapTable.prototype.uncheck = function (index) {
        this.check_(false, index);
    };

    BootstrapTable.prototype.check_ = function (checked, index) {
        this.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
        this.data[index][this.header.stateField] = checked;
        this.updateSelected();
        this.trigger(checked ? 'check' : 'uncheck', this.data[index]);
    };

    BootstrapTable.prototype.checkBy = function (obj) {
        this.checkBy_(true, obj);
    };

    BootstrapTable.prototype.uncheckBy = function (obj) {
        this.checkBy_(false, obj);
    };

    BootstrapTable.prototype.checkBy_ = function (checked, obj) {
        if (!obj.hasOwnProperty('field') || !obj.hasOwnProperty('values')) {
            return;
        }

        var that = this;
        $.each(this.options.data, function (index, row) {
            if (!row.hasOwnProperty(obj.field)) {
                return false;
            }
            if ($.inArray(row[obj.field], obj.values) !== -1) {
                that.$selectItem.filter(sprintf('[data-index="%s"]', index)).prop('checked', checked);
                row[that.header.stateField] = checked;
                that.trigger(checked ? 'check' : 'uncheck', row);
            }
        });
        this.updateSelected();
    };

    BootstrapTable.prototype.destroy = function () {
        this.$el.insertBefore(this.$container);
        $(this.options.toolbar).insertBefore(this.$el);
        this.$container.next().remove();
        this.$container.remove();
        this.$el.html(this.$el_.html())
            .css('margin-top', '0')
            .attr('class', this.$el_.attr('class') || ''); // reset the class
    };

    BootstrapTable.prototype.showLoading = function () {
        this.$loading.show();
    };

    BootstrapTable.prototype.hideLoading = function () {
        this.$loading.hide();
    };

    BootstrapTable.prototype.togglePagination = function () {
        this.options.pagination = !this.options.pagination;
        var button = this.$toolbar.find('button[name="paginationSwitch"] i');
        if (this.options.pagination) {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchDown);
        } else {
            button.attr("class", this.options.iconsPrefix + " " + this.options.icons.paginationSwitchUp);
        }
        this.updatePagination();
    };

    BootstrapTable.prototype.refresh = function (params) {
        if (params && params.url) {
            this.options.url = params.url;
            this.options.pageNumber = 1;
        }
        this.initServer(params && params.silent, params && params.query);
    };

    BootstrapTable.prototype.showColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), true, true);
    };

    BootstrapTable.prototype.hideColumn = function (field) {
        this.toggleColumn(getFieldIndex(this.options.columns, field), false, true);
    };

    BootstrapTable.prototype.filterBy = function (columns) {
        this.filterColumns = $.isEmptyObject(columns) ? {} : columns;
        this.options.pageNumber = 1;
        this.initSearch();
        this.updatePagination();
    };

    BootstrapTable.prototype.scrollTo = function (value) {
        var $tbody = this.$container.find('.fixed-table-body');
        if (typeof value === 'string') {
            value = value === 'bottom' ? $tbody[0].scrollHeight : 0;
        }
        if (typeof value === 'number') {
            $tbody.scrollTop(value);
        }
    };

    BootstrapTable.prototype.selectPage = function (page) {
        if (page > 0 && page <= this.options.totalPages) {
            this.options.pageNumber = page;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.prevPage = function () {
        if (this.options.pageNumber > 1) {
            this.options.pageNumber--;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.nextPage = function () {
        if (this.options.pageNumber < this.options.totalPages) {
            this.options.pageNumber++;
            this.updatePagination();
        }
    };

    BootstrapTable.prototype.toggleView = function () {
        this.options.cardView = !this.options.cardView;
        this.initHeader();
        // Fixed remove toolbar when click cardView button.
        //that.initToolbar();
        this.initBody();
    };

    // BOOTSTRAP TABLE PLUGIN DEFINITION
    // =======================

    var allowedMethods = [
        'getOptions',
        'getSelections', 'getData',
        'load', 'append', 'prepend', 'remove',
        'insertRow', 'updateRow',
        'showRow', 'hideRow', 'getRowsHidden',
        'mergeCells',
        'checkAll', 'uncheckAll',
        'check', 'uncheck',
        'checkBy', 'uncheckBy',
        'refresh',
        'resetView',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn',
        'filterBy',
        'scrollTo',
        'selectPage', 'prevPage', 'nextPage',
        'togglePagination',
        'toggleView'
    ];

    $.fn.bootstrapTable = function (option, _relatedTarget) {
        var value;

        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.table'),
                options = $.extend({}, BootstrapTable.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }

                if (!data) {
                    return;
                }

                value = data[option](_relatedTarget);

                if (option === 'destroy') {
                    $this.removeData('bootstrap.table');
                }
            }

            if (!data) {
                $this.data('bootstrap.table', (data = new BootstrapTable(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.bootstrapTable.Constructor = BootstrapTable;
    $.fn.bootstrapTable.defaults = BootstrapTable.DEFAULTS;
    $.fn.bootstrapTable.columnDefaults = BootstrapTable.COLUMN_DEFAULTS;
    $.fn.bootstrapTable.locales = BootstrapTable.LOCALES;
    $.fn.bootstrapTable.methods = allowedMethods;

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
        $('[data-toggle="table"]').bootstrapTable();
    });

}(jQuery);

/**
 @Name : layDate v1.1 日期控件
 需配置config.path路径
 */

;
!function (win) {

//全局配置，如果采用默认均不需要改动
    var config = {
        path: '', //laydate所在路径
        defSkin: 'default', //初始化皮肤
        format: 'YYYY-MM-DD', //日期格式
        min: '1900-01-01 00:00:00', //最小日期
        max: '2099-12-31 23:59:59', //最大日期
        isv: false
    };

    var Dates = {}, doc = document, creat = 'createElement', byid = 'getElementById', tags = 'getElementsByTagName';
    var as = ['laydate_box', 'laydate_void', 'laydate_click', 'LayDateSkin', 'skins/', '/laydate.css'];


//主接口
    win.laydate = function (options) {
        options = options || {};
        try {
            as.event = win.event ? win.event : laydate.caller.arguments[0];
        } catch (e) {
        }
        ;
        Dates.run(options);
        return laydate;
    };

    laydate.v = '1.1';

//获取组件存放路径
    Dates.getPath = (function () {
        var js = document.scripts, jsPath = js[js.length - 1].src;
        return config.path ? config.path : jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
    }());

    Dates.use = function (lib, id) {
        var link = doc[creat]('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = Dates.getPath + lib + as[5];
        id && (link.id = id);
        doc[tags]('head')[0].appendChild(link);
        link = null;
    };

    Dates.trim = function (str) {
        str = str || '';
        return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
    };

//补齐数位
    Dates.digit = function (num) {
        return num < 10 ? '0' + (num | 0) : num;
    };

    Dates.stopmp = function (e) {
        e = e || win.event;
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        return this;
    };

    Dates.each = function (arr, fn) {
        var i = 0, len = arr.length;
        for (; i < len; i++) {
            if (fn(i, arr[i]) === false) {
                break
            }
        }
    };

    Dates.hasClass = function (elem, cls) {
        elem = elem || {};
        return new RegExp('\\b' + cls + '\\b').test(elem.className);
    };

    Dates.addClass = function (elem, cls) {
        elem = elem || {};
        Dates.hasClass(elem, cls) || (elem.className += ' ' + cls);
        elem.className = Dates.trim(elem.className);
        return this;
    };

    Dates.removeClass = function (elem, cls) {
        elem = elem || {};
        if (Dates.hasClass(elem, cls)) {
            var reg = new RegExp('\\b' + cls + '\\b');
            elem.className = elem.className.replace(reg, '');
        }
        return this;
    };

//清除css属性
    Dates.removeCssAttr = function (elem, attr) {
        var s = elem.style;
        if (s.removeProperty) {
            s.removeProperty(attr);
        } else {
            s.removeAttribute(attr);
        }
    };

//显示隐藏
    Dates.shde = function (elem, type) {
        elem.style.display = type ? 'none' : 'block';
    };

//简易选择器
    Dates.query = function (node) {
        if (node && node.nodeType === 1) {
            if (node.tagName.toLowerCase() !== 'input') {
                throw new Error('选择器elem错误');
            }
            return node;
        }

        var node = (Dates.trim(node)).split(' '), elemId = doc[byid](node[0].substr(1)), arr;
        if (!elemId) {
            return;
        } else if (!node[1]) {
            return elemId;
        } else if (/^\./.test(node[1])) {
            var find, child = node[1].substr(1), exp = new RegExp('\\b' + child + '\\b');
            arr = []
            find = doc.getElementsByClassName ? elemId.getElementsByClassName(child) : elemId[tags]('*');
            Dates.each(find, function (ii, that) {
                exp.test(that.className) && arr.push(that);
            });
            return arr[0] ? arr : '';
        } else {
            arr = elemId[tags](node[1]);
            return arr[0] ? elemId[tags](node[1]) : '';
        }
    };

//事件监听器
    Dates.on = function (elem, even, fn) {
        elem.attachEvent ? elem.attachEvent('on' + even, function () {
            fn.call(elem, win.even);
        }) : elem.addEventListener(even, fn, false);
        return Dates;
    };

//阻断mouseup
    Dates.stopMosup = function (evt, elem) {
        if (evt !== 'mouseup') {
            Dates.on(elem, 'mouseup', function (ev) {
                Dates.stopmp(ev);
            });
        }
    };

    Dates.run = function (options) {
        var S = Dates.query, elem, devt, even = as.event, target;
        try {
            target = even.target || even.srcElement || {};
        } catch (e) {
            target = {};
        }
        elem = options.elem ? S(options.elem) : target;
        if (even && target.tagName) {
            if (!elem || elem === Dates.elem) {
                return;
            }
            Dates.stopMosup(even.type, elem);
            Dates.stopmp(even);
            Dates.view(elem, options);
            Dates.reshow();
        } else {
            devt = options.event || 'click';
            Dates.each((elem.length | 0) > 0 ? elem : [elem], function (ii, that) {
                Dates.stopMosup(devt, that);
                Dates.on(that, devt, function (ev) {
                    Dates.stopmp(ev);
                    if (that !== Dates.elem) {
                        Dates.view(that, options);
                        Dates.reshow();
                    }
                });
            });
        }
    };

    Dates.scroll = function (type) {
        type = type ? 'scrollLeft' : 'scrollTop';
        return doc.body[type] | doc.documentElement[type];
    };

    Dates.winarea = function (type) {
        return document.documentElement[type ? 'clientWidth' : 'clientHeight']
    };

//判断闰年
    Dates.isleap = function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

//检测是否在有效期
    Dates.checkVoid = function (YY, MM, DD) {
        var back = [];
        YY = YY | 0;
        MM = MM | 0;
        DD = DD | 0;
        if (YY < Dates.mins[0]) {
            back = ['y'];
        } else if (YY > Dates.maxs[0]) {
            back = ['y', 1];
        } else if (YY >= Dates.mins[0] && YY <= Dates.maxs[0]) {
            if (YY == Dates.mins[0]) {
                if (MM < Dates.mins[1]) {
                    back = ['m'];
                } else if (MM == Dates.mins[1]) {
                    if (DD < Dates.mins[2]) {
                        back = ['d'];
                    }
                }
            }
            if (YY == Dates.maxs[0]) {
                if (MM > Dates.maxs[1]) {
                    back = ['m', 1];
                } else if (MM == Dates.maxs[1]) {
                    if (DD > Dates.maxs[2]) {
                        back = ['d', 1];
                    }
                }
            }
        }
        return back;
    };

//时分秒的有效检测
    Dates.timeVoid = function (times, index) {
        if (Dates.ymd[1] + 1 == Dates.mins[1] && Dates.ymd[2] == Dates.mins[2]) {
            if (index === 0 && (times < Dates.mins[3])) {
                return 1;
            } else if (index === 1 && times < Dates.mins[4]) {
                return 1;
            } else if (index === 2 && times < Dates.mins[5]) {
                return 1;
            }
        } else if (Dates.ymd[1] + 1 == Dates.maxs[1] && Dates.ymd[2] == Dates.maxs[2]) {
            if (index === 0 && times > Dates.maxs[3]) {
                return 1;
            } else if (index === 1 && times > Dates.maxs[4]) {
                return 1;
            } else if (index === 2 && times > Dates.maxs[5]) {
                return 1;
            }
        }
        if (times > (index ? 59 : 23)) {
            return 1;
        }
    };

//检测日期是否合法
    Dates.check = function () {
        var reg = Dates.options.format.replace(/YYYY|MM|DD|hh|mm|ss/g, '\\d+\\').replace(/\\$/g, '');
        var exp = new RegExp(reg), value = Dates.elem[as.elemv];
        var arr = value.match(/\d+/g) || [], isvoid = Dates.checkVoid(arr[0], arr[1], arr[2]);
        if (value.replace(/\s/g, '') !== '') {
            if (!exp.test(value)) {
                Dates.elem[as.elemv] = '';
                Dates.msg('日期不符合格式，请重新选择。');
                return 1;
            } else if (isvoid[0]) {
                Dates.elem[as.elemv] = '';
                Dates.msg('日期不在有效期内，请重新选择。');
                return 1;
            } else {
                isvoid.value = Dates.elem[as.elemv].match(exp).join();
                arr = isvoid.value.match(/\d+/g);
                if (arr[1] < 1) {
                    arr[1] = 1;
                    isvoid.auto = 1;
                } else if (arr[1] > 12) {
                    arr[1] = 12;
                    isvoid.auto = 1;
                } else if (arr[1].length < 2) {
                    isvoid.auto = 1;
                }
                if (arr[2] < 1) {
                    arr[2] = 1;
                    isvoid.auto = 1;
                } else if (arr[2] > Dates.months[(arr[1] | 0) - 1]) {
                    arr[2] = 31;
                    isvoid.auto = 1;
                } else if (arr[2].length < 2) {
                    isvoid.auto = 1;
                }
                if (arr.length > 3) {
                    if (Dates.timeVoid(arr[3], 0)) {
                        isvoid.auto = 1;
                    }
                    ;
                    if (Dates.timeVoid(arr[4], 1)) {
                        isvoid.auto = 1;
                    }
                    ;
                    if (Dates.timeVoid(arr[5], 2)) {
                        isvoid.auto = 1;
                    }
                    ;
                }
                if (isvoid.auto) {
                    Dates.creation([arr[0], arr[1] | 0, arr[2] | 0], 1);
                } else if (isvoid.value !== Dates.elem[as.elemv]) {
                    Dates.elem[as.elemv] = isvoid.value;
                }
            }
        }
    };

//生成日期
    Dates.months = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    Dates.viewDate = function (Y, M, D) {
        var S = Dates.query, log = {}, De = new Date();
        Y < (Dates.mins[0] | 0) && (Y = (Dates.mins[0] | 0));
        Y > (Dates.maxs[0] | 0) && (Y = (Dates.maxs[0] | 0));

        De.setFullYear(Y, M, D);
        log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];

        Dates.months[1] = Dates.isleap(log.ymd[0]) ? 29 : 28;

        De.setFullYear(log.ymd[0], log.ymd[1], 1);
        log.FDay = De.getDay();

        log.PDay = Dates.months[M === 0 ? 11 : M - 1] - log.FDay + 1;
        log.NDay = 1;

        //渲染日
        Dates.each(as.tds, function (i, elem) {
            var YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
            elem.className = '';
            if (i < log.FDay) {
                elem.innerHTML = DD = i + log.PDay;
                Dates.addClass(elem, 'laydate_nothis');
                MM === 1 && (YY -= 1);
                MM = MM === 1 ? 12 : MM - 1;
            } else if (i >= log.FDay && i < log.FDay + Dates.months[log.ymd[1]]) {
                elem.innerHTML = DD = i - log.FDay + 1;
                if (i - log.FDay + 1 === log.ymd[2]) {
                    Dates.addClass(elem, as[2]);
                    log.thisDay = elem;
                }
            } else {
                elem.innerHTML = DD = log.NDay++;
                Dates.addClass(elem, 'laydate_nothis');
                MM === 12 && (YY += 1);
                MM = MM === 12 ? 1 : MM + 1;
            }

            if (Dates.checkVoid(YY, MM, DD)[0]) {
                Dates.addClass(elem, as[1]);
            }

            Dates.options.festival && Dates.festival(elem, MM + '.' + DD);
            elem.setAttribute('y', YY);
            elem.setAttribute('m', MM);
            elem.setAttribute('d', DD);
            YY = MM = DD = null;
        });

        Dates.valid = !Dates.hasClass(log.thisDay, as[1]);
        Dates.ymd = log.ymd;

        //锁定年月
        as.year.value = Dates.ymd[0] + '年';
        as.month.value = Dates.digit(Dates.ymd[1] + 1) + '月';

        //定位月
        Dates.each(as.mms, function (i, elem) {
            var getCheck = Dates.checkVoid(Dates.ymd[0], (elem.getAttribute('m') | 0) + 1);
            if (getCheck[0] === 'y' || getCheck[0] === 'm') {
                Dates.addClass(elem, as[1]);
            } else {
                Dates.removeClass(elem, as[1]);
            }
            Dates.removeClass(elem, as[2]);
            getCheck = null
        });
        Dates.addClass(as.mms[Dates.ymd[1]], as[2]);

        //定位时分秒
        log.times = [
            Dates.inymd[3] | 0 || 0,
            Dates.inymd[4] | 0 || 0,
            Dates.inymd[5] | 0 || 0
        ];
        Dates.each(new Array(3), function (i) {
            Dates.hmsin[i].value = Dates.digit(Dates.timeVoid(log.times[i], i) ? Dates.mins[i + 3] | 0 : log.times[i] | 0);
        });

        //确定按钮状态
        Dates[Dates.valid ? 'removeClass' : 'addClass'](as.ok, as[1]);
    };

//节日
    Dates.festival = function (td, md) {
        var str;
        switch (md) {
            case '1.1':
                str = '元旦';
                break;
            case '3.8':
                str = '妇女';
                break;
            case '4.5':
                str = '清明';
                break;
            case '5.1':
                str = '劳动';
                break;
            case '6.1':
                str = '儿童';
                break;
            case '9.10':
                str = '教师';
                break;
            case '10.1':
                str = '国庆';
                break;
        }
        ;
        str && (td.innerHTML = str);
        str = null;
    };

//生成年列表
    Dates.viewYears = function (YY) {
        var S = Dates.query, str = '';
        Dates.each(new Array(14), function (i) {
            if (i === 7) {
                str += '<li ' + (parseInt(as.year.value) === YY ? 'class="' + as[2] + '"' : '') + ' y="' + YY + '">' + YY + '年</li>';
            } else {
                str += '<li y="' + (YY - 7 + i) + '">' + (YY - 7 + i) + '年</li>';
            }
        });
        S('#laydate_ys').innerHTML = str;
        Dates.each(S('#laydate_ys li'), function (i, elem) {
            if (Dates.checkVoid(elem.getAttribute('y'))[0] === 'y') {
                Dates.addClass(elem, as[1]);
            } else {
                Dates.on(elem, 'click', function (ev) {
                    Dates.stopmp(ev).reshow();
                    Dates.viewDate(this.getAttribute('y') | 0, Dates.ymd[1], Dates.ymd[2]);
                });
            }
        });
    };

//初始化面板数据
    Dates.initDate = function () {
        var S = Dates.query, log = {}, De = new Date();
        var ymd = Dates.elem[as.elemv].match(/\d+/g) || [];
        if (ymd.length < 3) {
            ymd = Dates.options.start.match(/\d+/g) || [];
            if (ymd.length < 3) {
                ymd = [De.getFullYear(), De.getMonth() + 1, De.getDate()];
            }
        }
        Dates.inymd = ymd;
        Dates.viewDate(ymd[0], ymd[1] - 1, ymd[2]);
    };

//是否显示零件
    Dates.iswrite = function () {
        var S = Dates.query, log = {
            time: S('#laydate_hms')
        };
        Dates.shde(log.time, !Dates.options.istime);
        Dates.shde(as.oclear, !('isclear' in Dates.options ? Dates.options.isclear : 1));
        Dates.shde(as.otoday, !('istoday' in Dates.options ? Dates.options.istoday : 1));
        Dates.shde(as.ok, !('issure' in Dates.options ? Dates.options.issure : 1));
    };

//方位辨别
    Dates.orien = function (obj, pos) {
        var tops, rect = Dates.elem.getBoundingClientRect();
        obj.style.left = rect.left + (pos ? 0 : Dates.scroll(1)) + 'px';
        if (rect.bottom + obj.offsetHeight / 1.5 <= Dates.winarea()) {
            tops = rect.bottom - 1;
        } else {
            tops = rect.top > obj.offsetHeight / 1.5 ? rect.top - obj.offsetHeight + 1 : Dates.winarea() - obj.offsetHeight;
        }
        obj.style.top = tops + (pos ? 0 : Dates.scroll()) + 'px';
    };

//吸附定位
    Dates.follow = function (obj) {
        if (Dates.options.fixed) {
            obj.style.position = 'fixed';
            Dates.orien(obj, 1);
        } else {
            obj.style.position = 'absolute';
            Dates.orien(obj);
        }
    };

//生成表格
    Dates.viewtb = (function () {
        var tr, view = [], weeks = ['日', '一', '二', '三', '四', '五', '六'];
        var log = {}, table = doc[creat]('table'), thead = doc[creat]('thead');
        thead.appendChild(doc[creat]('tr'));
        log.creath = function (i) {
            var th = doc[creat]('th');
            th.innerHTML = weeks[i];
            thead[tags]('tr')[0].appendChild(th);
            th = null;
        };

        Dates.each(new Array(6), function (i) {
            view.push([]);
            tr = table.insertRow(0);
            Dates.each(new Array(7), function (j) {
                view[i][j] = 0;
                i === 0 && log.creath(j);
                tr.insertCell(j);
            });
        });

        table.insertBefore(thead, table.children[0]);
        table.id = table.className = 'laydate_table';
        tr = view = null;
        return table.outerHTML.toLowerCase();
    }());

//渲染控件骨架
    Dates.view = function (elem, options) {
        var S = Dates.query, div, log = {};
        options = options || elem;

        Dates.elem = elem;
        Dates.options = options;
        Dates.options.format || (Dates.options.format = config.format);
        Dates.options.start = Dates.options.start || '';
        Dates.mm = log.mm = [Dates.options.min || config.min, Dates.options.max || config.max];
        Dates.mins = log.mm[0].match(/\d+/g);
        Dates.maxs = log.mm[1].match(/\d+/g);

        as.elemv = /textarea|input/.test(Dates.elem.tagName.toLocaleLowerCase()) ? 'value' : 'innerHTML';

        if (!Dates.box) {
            div = doc[creat]('div');
            div.id = as[0];
            div.className = as[0];
            div.style.cssText = 'position: absolute;';
            div.setAttribute('name', 'laydate-v' + laydate.v);

            div.innerHTML = log.html = '<div class="laydate_top">'
            + '<div class="laydate_ym laydate_y" id="laydate_YY">'
            + '<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>'
            + '<input id="laydate_y" readonly><label></label>'
            + '<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>'
            + '<div class="laydate_yms">'
            + '<a class="laydate_tab laydate_chtop"><cite></cite></a>'
            + '<ul id="laydate_ys"></ul>'
            + '<a class="laydate_tab laydate_chdown"><cite></cite></a>'
            + '</div>'
            + '</div>'
            + '<div class="laydate_ym laydate_m" id="laydate_MM">'
            + '<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>'
            + '<input id="laydate_m" readonly><label></label>'
            + '<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>'
            + '<div class="laydate_yms" id="laydate_ms">' + function () {
                var str = '';
                Dates.each(new Array(12), function (i) {
                    str += '<span m="' + i + '">' + Dates.digit(i + 1) + '月</span>';
                });
                return str;
            }() + '</div>'
            + '</div>'
            + '</div>'

            + Dates.viewtb

            + '<div class="laydate_bottom">'
            + '<ul id="laydate_hms">'
            + '<li class="laydate_sj">时间</li>'
            + '<li><input readonly>:</li>'
            + '<li><input readonly>:</li>'
            + '<li><input readonly></li>'
            + '</ul>'
            + '<div class="laydate_time" id="laydate_time"></div>'
            + '<div class="laydate_btn">'
            + '<a id="laydate_clear">清空</a>'
            + '<a id="laydate_today">今天</a>'
            + '<a id="laydate_ok">确认</a>'
            + '</div>'
            + (config.isv ? '<a href="http://sentsin.com/layui/laydate/" class="laydate_v" target="_blank">laydate-v' + laydate.v + '</a>' : '')
            + '</div>';
            doc.body.appendChild(div);
            Dates.box = S('#' + as[0]);
            Dates.events();
            div = null;
        } else {
            Dates.shde(Dates.box);
        }
        Dates.follow(Dates.box);
        options.zIndex ? Dates.box.style.zIndex = options.zIndex : Dates.removeCssAttr(Dates.box, 'z-index');
        Dates.stopMosup('click', Dates.box);

        Dates.initDate();
        Dates.iswrite();
        Dates.check();
    };

//隐藏内部弹出元素
    Dates.reshow = function () {
        Dates.each(Dates.query('#' + as[0] + ' .laydate_show'), function (i, elem) {
            Dates.removeClass(elem, 'laydate_show');
        });
        return this;
    };

//关闭控件
    Dates.close = function () {
        Dates.reshow();
        Dates.shde(Dates.query('#' + as[0]), 1);
        Dates.elem = null;
    };

//转换日期格式
    Dates.parse = function (ymd, hms, format) {
        ymd = ymd.concat(hms);
        format = format || (Dates.options ? Dates.options.format : config.format);
        return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function (str, index) {
            ymd.index = ++ymd.index | 0;
            return Dates.digit(ymd[ymd.index]);
        });
    };

//返回最终日期
    Dates.creation = function (ymd, hide) {
        var S = Dates.query, hms = Dates.hmsin;
        var getDates = Dates.parse(ymd, [hms[0].value, hms[1].value, hms[2].value]);
        Dates.elem[as.elemv] = getDates;
        if (!hide) {
            Dates.close();
            typeof Dates.options.choose === 'function' && Dates.options.choose(getDates);
        }
    };

//事件
    Dates.events = function () {
        var S = Dates.query, log = {
            box: '#' + as[0]
        };

        Dates.addClass(doc.body, 'laydate_body');

        as.tds = S('#laydate_table td');
        as.mms = S('#laydate_ms span');
        as.year = S('#laydate_y');
        as.month = S('#laydate_m');

        //显示更多年月
        Dates.each(S(log.box + ' .laydate_ym'), function (i, elem) {
            Dates.on(elem, 'click', function (ev) {
                Dates.stopmp(ev).reshow();
                Dates.addClass(this[tags]('div')[0], 'laydate_show');
                if (!i) {
                    log.YY = parseInt(as.year.value);
                    Dates.viewYears(log.YY);
                }
            });
        });

        Dates.on(S(log.box), 'click', function () {
            Dates.reshow();
        });

        //切换年
        log.tabYear = function (type) {
            if (type === 0) {
                Dates.ymd[0]--;
            } else if (type === 1) {
                Dates.ymd[0]++;
            } else if (type === 2) {
                log.YY -= 14;
            } else {
                log.YY += 14;
            }
            if (type < 2) {
                Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
                Dates.reshow();
            } else {
                Dates.viewYears(log.YY);
            }
        };
        Dates.each(S('#laydate_YY .laydate_tab'), function (i, elem) {
            Dates.on(elem, 'click', function (ev) {
                Dates.stopmp(ev);
                log.tabYear(i);
            });
        });


        //切换月
        log.tabMonth = function (type) {
            if (type) {
                Dates.ymd[1]++;
                if (Dates.ymd[1] === 12) {
                    Dates.ymd[0]++;
                    Dates.ymd[1] = 0;
                }
            } else {
                Dates.ymd[1]--;
                if (Dates.ymd[1] === -1) {
                    Dates.ymd[0]--;
                    Dates.ymd[1] = 11;
                }
            }
            Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
        };
        Dates.each(S('#laydate_MM .laydate_tab'), function (i, elem) {
            Dates.on(elem, 'click', function (ev) {
                Dates.stopmp(ev).reshow();
                log.tabMonth(i);
            });
        });

        //选择月
        Dates.each(S('#laydate_ms span'), function (i, elem) {
            Dates.on(elem, 'click', function (ev) {
                Dates.stopmp(ev).reshow();
                if (!Dates.hasClass(this, as[1])) {
                    Dates.viewDate(Dates.ymd[0], this.getAttribute('m') | 0, Dates.ymd[2]);
                }
            });
        });

        //选择日
        Dates.each(S('#laydate_table td'), function (i, elem) {
            Dates.on(elem, 'click', function (ev) {
                if (!Dates.hasClass(this, as[1])) {
                    Dates.stopmp(ev);
                    Dates.creation([this.getAttribute('y') | 0, this.getAttribute('m') | 0, this.getAttribute('d') | 0]);
                }
            });
        });

        //清空
        as.oclear = S('#laydate_clear');
        Dates.on(as.oclear, 'click', function () {
            Dates.elem[as.elemv] = '';
            Dates.close();
        });

        //今天
        as.otoday = S('#laydate_today');
        Dates.on(as.otoday, 'click', function () {
            //var now = new Date();
            //Dates.creation([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
            //修复点击今天不能显示时分秒的问题
            var getDates = laydate.now(0, Dates.options.format);
            Dates.elem[as.elemv] = getDates;
            Dates.close();
            typeof Dates.options.choose === 'function' && Dates.options.choose(getDates);
        });

        //确认
        as.ok = S('#laydate_ok');
        Dates.on(as.ok, 'click', function () {
            if (Dates.valid) {
                Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]]);
            }
        });

        //选择时分秒
        log.times = S('#laydate_time');
        Dates.hmsin = log.hmsin = S('#laydate_hms input');
        log.hmss = ['小时', '分钟', '秒数'];
        log.hmsarr = [];

        //生成时分秒或警告信息
        Dates.msg = function (i, title) {
            var str = '<div class="laydte_hsmtex">' + (title || '提示') + '<span>×</span></div>';
            if (typeof i === 'string') {
                str += '<p>' + i + '</p>';
                Dates.shde(S('#' + as[0]));
                Dates.removeClass(log.times, 'laydate_time1').addClass(log.times, 'laydate_msg');
            } else {
                if (!log.hmsarr[i]) {
                    str += '<div id="laydate_hmsno" class="laydate_hmsno">';
                    Dates.each(new Array(i === 0 ? 24 : 60), function (i) {
                        str += '<span>' + i + '</span>';
                    });
                    str += '</div>'
                    log.hmsarr[i] = str;
                } else {
                    str = log.hmsarr[i];
                }
                Dates.removeClass(log.times, 'laydate_msg');
                Dates[i === 0 ? 'removeClass' : 'addClass'](log.times, 'laydate_time1');
            }
            Dates.addClass(log.times, 'laydate_show');
            log.times.innerHTML = str;
        };

        log.hmson = function (input, index) {
            var span = S('#laydate_hmsno span'), set = Dates.valid ? null : 1;
            Dates.each(span, function (i, elem) {
                if (set) {
                    Dates.addClass(elem, as[1]);
                } else if (Dates.timeVoid(i, index)) {
                    Dates.addClass(elem, as[1]);
                } else {
                    Dates.on(elem, 'click', function (ev) {
                        if (!Dates.hasClass(this, as[1])) {
                            input.value = Dates.digit(this.innerHTML | 0);
                        }
                    });
                }
            });
            Dates.addClass(span[input.value | 0], 'laydate_click');
        };

        //展开选择
        Dates.each(log.hmsin, function (i, elem) {
            Dates.on(elem, 'click', function (ev) {
                Dates.stopmp(ev).reshow();
                Dates.msg(i, log.hmss[i]);
                log.hmson(this, i);
            });
        });

        Dates.on(doc, 'mouseup', function () {
            var box = S('#' + as[0]);
            if (box && box.style.display !== 'none') {
                Dates.check() || Dates.close();
            }
        }).on(doc, 'keydown', function (event) {
            event = event || win.event;
            var codes = event.keyCode;

            //如果在日期显示的时候按回车
            if (codes === 13 && Dates.elem) {
                Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]]);
            }
        });
    };

    /*Dates.init = (function () {
        Dates.use('need');
        Dates.use(as[4] + config.defSkin, as[3]);
        Dates.skinLink = Dates.query('#' + as[3]);
    }());*/

//重置定位
    laydate.reset = function () {
        (Dates.box && Dates.elem) && Dates.follow(Dates.box);
    };

//返回指定日期
    laydate.now = function (timestamp, format) {
        var De = new Date((timestamp | 0) ? function (tamp) {
            return tamp < 86400000 ? (+new Date + tamp * 86400000) : tamp;
        }(parseInt(timestamp)) : +new Date);
        return Dates.parse(
            [De.getFullYear(), De.getMonth() + 1, De.getDate()],
            [De.getHours(), De.getMinutes(), De.getSeconds()],
            format
        );
    };

//皮肤选择
    laydate.skin = function (lib) {
        Dates.skinLink.href = Dates.getPath + as[4] + lib + as[5];
    };

}(window);

/*!

 @Name：layer v2.0 弹层组件
 @Author：贤心
 @Site：http://layer.layui.com
 @License：LGPL
        
 */

;!function(window, undefined){
"use strict";

var $, win, ready = {
    getPath: function(){
        var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
        if(script.getAttribute('merge')) return;
        return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
    }(),
    
    //屏蔽Enter触发弹层
    enter: function(e){
        if(e.keyCode === 13) e.preventDefault();
    },
    config: {}, end: {},
    btn: ['&#x786E;&#x5B9A;','&#x53D6;&#x6D88;'],
    
    //五种原始层模式
    type: ['dialog', 'page', 'iframe', 'loading', 'tips']
};

//默认内置方法。
var layer = {
    v: '2.0',
    ie6: !!window.ActiveXObject&&!window.XMLHttpRequest,
    index: 0,
    path: ready.getPath,
    config: function(options, fn){
        var item = 0;
        options = options || {};
        layer.cache = ready.config = $.extend(ready.config, options);
        layer.path = ready.config.path || layer.path;
        typeof options.extend === 'string' && (options.extend = [options.extend]);
        layer.use('skin/layer.css', (options.extend && options.extend.length > 0) ? (function loop(){
            var ext = options.extend;
            layer.use(ext[ext[item] ? item : item-1], item < ext.length ? function(){
                ++item; 
                return loop;
            }() : fn);
        }()) : fn);
        return this;
    },
    
    //载入配件
    use: function(module, fn, readyMethod){
        var i = 0, head = $('head')[0];
        var module = module.replace(/\s/g, '');
        var iscss = /\.css$/.test(module);
        var node = document.createElement(iscss ? 'link' : 'script');
        var id = 'layui_layer_' + module.replace(/\.|\//g, '');
        if(!layer.path) return;
        if(iscss){
            node.rel = 'stylesheet';
        }
        node[iscss ? 'href' : 'src'] = /^http:\/\//.test(module) ? module : layer.path + module;
        node.id = id;
        if(!$('#'+ id)[0]){
            head.appendChild(node);
        }
        //轮询加载就绪
        ;(function poll() {
            ;(iscss ? parseInt($('#'+id).css('width')) === 1989 : layer[readyMethod||id]) ? function(){
                fn && fn();
                try { iscss || head.removeChild(node); } catch(e){};
            }() : setTimeout(poll, 100);
        }());
        return this;
    },
    
    ready: function(path, fn){
        var type = typeof path === 'function';
        if(type) fn = path;
        layer.config($.extend(ready.config, function(){
           return type ? {} : {path: path};
        }()), fn);
        return this;
    },
    
    //各种快捷引用
    alert: function(content, options, yes){
        var type = typeof options === 'function';
        if(type) yes = options;
        return layer.open($.extend({
            content: content,
            yes: yes
        }, type ? {} : options));
    }, 
    
    confirm: function(content, options, yes, cancel){ 
        var type = typeof options === 'function';
        if(type){
            cancel = yes;
            yes = options;
        }
        return layer.open($.extend({
            content: content,
            btn: ready.btn,
            yes: yes,
            cancel: cancel
        }, type ? {} : options));
    },
    
    msg: function(content, options, end){ //最常用提示层
        var type = typeof options === 'function', rskin = ready.config.skin;
        var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '')||'layui-layer-msg';
        var shift = doms.anim.length - 1;
        if(type) end = options;
        return layer.open($.extend({
            content: content,
            time: 3000,
            shade: false,
            skin: skin,
            title: false,
            closeBtn: false,
            btn: false,
            end: end
        }, (type && !ready.config.skin) ? {
            skin: skin + ' layui-layer-hui',
            shift: shift
        } : function(){
           options = options || {};
           if(options.icon === -1 || options.icon === undefined && !ready.config.skin){
               options.skin = skin + ' ' + (options.skin||'layui-layer-hui');
           }
           return options;
        }()));  
    },
    
    load: function(icon, options){
        return layer.open($.extend({
            type: 3,
            icon: icon || 0,
            shade: 0.01
        }, options));
    }, 
    
    tips: function(content, follow, options){
        return layer.open($.extend({
            type: 4,
            content: [content, follow],
            closeBtn: false,
            time: 3000,
            maxWidth: 210
        }, options));
    }
};

var Class = function(setings){    
    var that = this;
    that.index = ++layer.index;
    that.config = $.extend({}, that.config, ready.config, setings);
    that.creat();
};

Class.pt = Class.prototype;

//缓存常用字符
var doms = ['layui-layer', '.layui-layer-title', '.layui-layer-main', '.layui-layer-dialog', 'layui-layer-iframe', 'layui-layer-content', 'layui-layer-btn', 'layui-layer-close'];
doms.anim = ['layui-anim', 'layui-anim-01', 'layui-anim-02', 'layui-anim-03', 'layui-anim-04', 'layui-anim-05', 'layui-anim-06'];

//默认配置
Class.pt.config = {
    type: 0,
    shade: 0.3,
    fix: true,
    move: doms[1],
    title: '&#x4FE1;&#x606F;',
    offset: 'auto',
    area: 'auto',
    closeBtn: 1,
    time: 0, //0表示不自动关闭
    zIndex: 19891014, 
    maxWidth: 360,
    shift: 0,
    icon: -1,
    scrollbar: true, //是否允许浏览器滚动条
    tips: 2
};

//容器
Class.pt.vessel = function(conType, callback){
    var that = this, times = that.index, config = that.config;
    var zIndex = config.zIndex + times, titype = typeof config.title === 'object';
    var ismax = config.maxmin && (config.type === 1 || config.type === 2);
    var titleHTML = (config.title ? '<div class="layui-layer-title" style="'+ (titype ? config.title[1] : '') +'">' 
        + (titype ? config.title[0] : config.title) 
    + '</div>' : '');
    
    config.zIndex = zIndex;
    callback([
        //遮罩
        config.shade ? ('<div class="layui-layer-shade" id="layui-layer-shade'+ times +'" times="'+ times +'" style="'+ ('z-index:'+ (zIndex-1) +'; background-color:'+ (config.shade[1]||'#000') +'; opacity:'+ (config.shade[0]||config.shade) +'; filter:alpha(opacity='+ (config.shade[0]*100||config.shade*100) +');') +'"></div>') : '',
        
        //主体
        '<div class="'+ doms[0] +' '+ (doms.anim[config.shift]||'') + (' layui-layer-'+ready.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? ' layui-layer-border' : '') + ' ' + (config.skin||'') +'" id="'+ doms[0] + times +'" type="'+ ready.type[config.type] +'" times="'+ times +'" showtime="'+ config.time +'" conType="'+ (conType ? 'object' : 'string') +'" style="z-index: '+ zIndex +'; width:'+ config.area[0] + ';height:' + config.area[1] + (config.fix ? '' : ';position:absolute;') +'">'
            + (conType && config.type != 2 ? '' : titleHTML)
            +'<div class="layui-layer-content'+ ((config.type == 0 && config.icon !== -1) ? ' layui-layer-padding' :'') + (config.type == 3 ? ' layui-layer-loading'+config.icon : '') +'">'
                + (config.type == 0 && config.icon !== -1 ? '<i class="layui-layer-ico layui-layer-ico'+ config.icon +'"></i>' : '')
                + (config.type == 1 && conType ? '' : (config.content||''))
            +'</div>'
            + '<span class="layui-layer-setwin">'+ function(){
                var closebtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : '';
                config.closeBtn && (closebtn += '<a class="layui-layer-ico '+ doms[7] +' '+ doms[7] + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2')) +'" href="javascript:;"></a>');
                return closebtn;
            }() + '</span>'
            + (config.btn ? function(){
                var button = '';
                typeof config.btn === 'string' && (config.btn = [config.btn]);
                for(var i = 0, len = config.btn.length; i < len; i++){
                    button += '<a class="'+ doms[6] +''+ i +'">'+ config.btn[i] +'</a>'
                }
                return '<div class="'+ doms[6] +'">'+ button +'</div>'
            }() : '')
        +'</div>'
    ], titleHTML);
    return that;
};

//创建骨架
Class.pt.creat = function(){
    var that = this, config = that.config, times = that.index, nodeIndex;
    var content = config.content, conType = typeof content === 'object';
    
    if(typeof config.area === 'string'){
        config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
    }
    
    switch(config.type){
        case 0:
            config.btn = ('btn' in config) ? config.btn : ready.btn[0];
            layer.closeAll('dialog');
        break;
        case 2:
            var content = config.content = conType ? config.content : [config.content||'http://sentsin.com?from=layer', 'auto'];
            config.content = '<iframe scrolling="'+ (config.content[1]||'auto') +'" allowtransparency="true" id="'+ doms[4] +''+ times +'" name="'+ doms[4] +''+ times +'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + config.content[0] + '"></iframe>';
        break;
        case 3:
            config.title = false;
            config.closeBtn = false;
            config.icon === -1 && (config.icon === 0);
            layer.closeAll('loading');
        break;
        case 4:
            conType || (config.content = [config.content, 'body']);
            config.follow = config.content[1];
            config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';
            config.title = false;
            config.shade = false;
            config.fix = false;
            config.tips = typeof config.tips === 'object' ? config.tips : [config.tips, true];
            config.tipsMore || layer.closeAll('tips');
        break;
    }
    
    //建立容器
    that.vessel(conType, function(html, titleHTML){
        $('body').append(html[0]);
        conType ? function(){
            (config.type == 2 || config.type == 4) ? function(){
                $('body').append(html[1]);
            }() : function(){
                if(!content.parents('.'+doms[0])[0]){
                    content.show().addClass('layui-layer-wrap').wrap(html[1]);
                    $('#'+ doms[0] + times).find('.'+doms[5]).before(titleHTML);
                }
            }();
        }() : $('body').append(html[1]);
        that.layero = $('#'+ doms[0] + times);
        config.scrollbar || doms.html.css('overflow', 'hidden').attr('layer-full', times);
    }).auto(times);

    config.type == 2 && layer.ie6 && that.layero.find('iframe').attr('src', content[0]);
    $(document).off('keydown', ready.enter).on('keydown', ready.enter);

    //坐标自适应浏览器窗口尺寸
    config.type == 4 ? that.tips() : that.offset();
    if(config.fix){
        win.on('resize', function(){
            that.offset();
            (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(times);
            config.type == 4 && that.tips();
        });
    }
    
    config.time <= 0 || setTimeout(function(){
        layer.close(that.index)
    }, config.time);
    that.move().callback();
};

//自适应
Class.pt.auto = function(index){
    var that = this, config = that.config, layero = $('#'+ doms[0] + index);
    if(config.area[0] === '' && config.maxWidth > 0){
        //为了修复IE7下一个让人难以理解的bug
        if(/MSIE 7/.test(navigator.userAgent) && config.btn){
            layero.width(layero.innerWidth());
        }
        layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
    }
    var area = [layero.innerWidth(), layero.innerHeight()];
    var titHeight = layero.find(doms[1]).outerHeight() || 0;
    var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
    function setHeight(elem){
        elem = layero.find(elem);
        elem.height(area[1] - titHeight - btnHeight - 2*(parseFloat(elem.css('padding'))|0));
    }
    switch(config.type){
        case 2: 
            setHeight('iframe');
        break;
        default:
            if(config.area[1] === ''){
                if(config.fix && area[1] >= win.height()){
                    area[1] = win.height();
                    setHeight('.'+doms[5]);
                }
            } else {
                setHeight('.'+doms[5]);
            }
        break;
    }
    return that;
};

//计算坐标
Class.pt.offset = function(){
    var that = this, config = that.config, layero = that.layero;
    var area = [layero.outerWidth(), layero.outerHeight()];
    var type = typeof config.offset === 'object';
    that.offsetTop = (win.height() - area[1])/2;
    that.offsetLeft = (win.width() - area[0])/2;
    if(type){
        that.offsetTop = config.offset[0];
        that.offsetLeft = config.offset[1]||that.offsetLeft;
    } else if(config.offset !== 'auto'){
        that.offsetTop = config.offset;
        if(config.offset === 'rb'){ //右下角
            that.offsetTop = win.height() - area[1];
            that.offsetLeft = win.width() - area[0];
        }
    }
    if(!config.fix){
        that.offsetTop = /%$/.test(that.offsetTop) ? 
            win.height()*parseFloat(that.offsetTop)/100
        : parseFloat(that.offsetTop);
        that.offsetLeft = /%$/.test(that.offsetLeft) ? 
            win.width()*parseFloat(that.offsetLeft)/100
        : parseFloat(that.offsetLeft);
        that.offsetTop += win.scrollTop();
        that.offsetLeft += win.scrollLeft();
    }
    layero.css({top: that.offsetTop, left: that.offsetLeft});
};

//Tips
Class.pt.tips = function(){
    var that = this, config = that.config, layero = that.layero;
    var layArea = [layero.outerWidth(), layero.outerHeight()], follow = $(config.follow);
    if(!follow[0]) follow = $('body');
    var goal = {
        width: follow.outerWidth(),
        height: follow.outerHeight(),
        top: follow.offset().top,
        left: follow.offset().left
    }, tipsG = layero.find('.layui-layer-TipsG');
    
    var guide = config.tips[0];
    config.tips[1] || tipsG.remove();
    
    goal.autoLeft = function(){
        if(goal.left + layArea[0] - win.width() > 0){
            goal.tipLeft = goal.left + goal.width - layArea[0];
            tipsG.css({right: 12, left: 'auto'});
        } else {
            goal.tipLeft = goal.left;
        };
    };
    
    //辨别tips的方位
    goal.where = [function(){ //上                
        goal.autoLeft();
        goal.tipTop = goal.top - layArea[1] - 10;
        tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color', config.tips[1]);
    }, function(){ //右
        goal.tipLeft = goal.left + goal.width + 10;
        goal.tipTop = goal.top;
        tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color', config.tips[1]); 
    }, function(){ //下
        goal.autoLeft();
        goal.tipTop = goal.top + goal.height + 10;
        tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color', config.tips[1]);
    }, function(){ //左
        goal.tipLeft = goal.left - layArea[0] - 10;
        goal.tipTop = goal.top;
        tipsG.removeClass('layui-layer-TipsR').addClass('layui-layer-TipsL').css('border-bottom-color', config.tips[1]);
    }];
    goal.where[guide-1]();
    
    /* 8*2为小三角形占据的空间 */
    if(guide === 1){
        goal.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && goal.where[2]();
    } else if(guide === 2){
        win.width() - (goal.left + goal.width + layArea[0] + 8*2) > 0 || goal.where[3]()
    } else if(guide === 3){
        (goal.top - win.scrollTop() + goal.height + layArea[1] + 8*2) - win.height() > 0 && goal.where[0]();
    } else if(guide === 4){
       layArea[0] + 8*2 - goal.left > 0 && goal.where[1]()
    }

    layero.find('.'+doms[5]).css({
        'background-color': config.tips[1], 
        'padding-right': (config.closeBtn ? '30px' : '')
    });
    layero.css({left: goal.tipLeft, top: goal.tipTop});
}

//拖拽层
Class.pt.move = function(){
    var that = this, config = that.config, conf = {
        setY: 0,
        moveLayer: function(){
            var layero = conf.layero, mgleft = parseInt(layero.css('margin-left'));
            var lefts = parseInt(conf.move.css('left'));
            mgleft === 0 || (lefts = lefts - mgleft);
            if(layero.css('position') !== 'fixed'){
                lefts = lefts - layero.parent().offset().left;
                conf.setY = 0;
            }
            layero.css({left: lefts, top: parseInt(conf.move.css('top')) - conf.setY});
        }
    };
    
    var movedom = that.layero.find(config.move);
    config.move && movedom.attr('move', 'ok');
    movedom.css({cursor: config.move ? 'move' : 'auto'});
    
    $(config.move).on('mousedown', function(M){    
        M.preventDefault();
        if($(this).attr('move') === 'ok'){
            conf.ismove = true;
            conf.layero = $(this).parents('.'+ doms[0]);
            var xx = conf.layero.offset().left, yy = conf.layero.offset().top, ww = conf.layero.outerWidth() - 6, hh = conf.layero.outerHeight() - 6;
            if(!$('#layui-layer-moves')[0]){
                $('body').append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:'+ xx +'px; top:'+ yy +'px; width:'+ ww +'px; height:'+ hh +'px; z-index:2147483584"></div>');
            }
            conf.move = $('#layui-layer-moves');
            config.moveType && conf.move.css({visibility: 'hidden'});
           
            conf.moveX = M.pageX - conf.move.position().left;
            conf.moveY = M.pageY - conf.move.position().top;
            conf.layero.css('position') !== 'fixed' || (conf.setY = win.scrollTop());
        }
    });
    
    $(document).mousemove(function(M){
        if(conf.ismove){
            var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
            M.preventDefault();

            //控制元素不被拖出窗口外
            if(!config.moveOut){
                conf.setY = win.scrollTop();
                var setRig = win.width() - conf.move.outerWidth(), setTop = conf.setY;               
                offsetX < 0 && (offsetX = 0);
                offsetX > setRig && (offsetX = setRig); 
                offsetY < setTop && (offsetY = setTop);
                offsetY > win.height() - conf.move.outerHeight() + conf.setY && (offsetY = win.height() - conf.move.outerHeight() + conf.setY);
            }
            
            conf.move.css({left: offsetX, top: offsetY});    
            config.moveType && conf.moveLayer();
            
            offsetX = offsetY = setRig = setTop = null;
        }                                                 
    }).mouseup(function(){
        try{
            if(conf.ismove){
                conf.moveLayer();
                conf.move.remove();
                config.moveEnd && config.moveEnd();
            }
            conf.ismove = false;
        }catch(e){
            conf.ismove = false;
        }
    });
    return that;
};

Class.pt.callback = function(){
    var that = this, layero = that.layero, config = that.config;
    that.openLayer();
    if(config.success){
        if(config.type == 2){
            layero.find('iframe')[0].onload = function(){
                this.className = '';
                config.success(layero, that.index);
            };
        } else {
            config.success(layero, that.index);
        }
    }
    layer.ie6 && that.IE6(layero);
    
    //按钮
    layero.find('.'+ doms[6]).children('a').on('click', function(){
        var index = $(this).index();
        config['btn'+(index+1)] && config['btn'+(index+1)](that.index, layero);
        if(index === 0){
            config.yes ? config.yes(that.index, layero) : layer.close(that.index);
        } else if(index === 1){
            cancel();
        } else {
            config['btn'+(index+1)] || layer.close(that.index);
        }
    });
    
    //取消
    function cancel(){
        var close = config.cancel && config.cancel(that.index);
        close === false || layer.close(that.index);
    }
    
    //右上角关闭回调
    layero.find('.'+ doms[7]).on('click', cancel);
    
    //点遮罩关闭
    if(config.shadeClose){
        $('#layui-layer-shade'+ that.index).on('click', function(){
            layer.close(that.index);
        });
    } 
    
    //最小化
    layero.find('.layui-layer-min').on('click', function(){
        layer.min(that.index, config);
        config.min && config.min(layero);
    });
    
    //全屏/还原
    layero.find('.layui-layer-max').on('click', function(){
        if($(this).hasClass('layui-layer-maxmin')){
            layer.restore(that.index);
            config.restore && config.restore(layero);
        } else {
            layer.full(that.index, config);
            config.full && config.full(layero);
        }
    });

    config.end && (ready.end[that.index] = config.end);
};

//for ie6 恢复select
ready.reselect = function(){
    $.each($('select'), function(index , value){
        var sthis = $(this);
        if(!sthis.parents('.'+doms[0])[0]){
            (sthis.attr('layer') == 1 && $('.'+doms[0]).length < 1) && sthis.removeAttr('layer').show(); 
        }
        sthis = null;
    });
}; 

Class.pt.IE6 = function(layero){
    var that = this, _ieTop = layero.offset().top;
    
    //ie6的固定与相对定位
    function ie6Fix(){
        layero.css({top : _ieTop + (that.config.fix ? win.scrollTop() : 0)});
    };
    ie6Fix();
    win.scroll(ie6Fix);

    //隐藏select
    $('select').each(function(index , value){
        var sthis = $(this);
        if(!sthis.parents('.'+doms[0])[0]){
            sthis.css('display') === 'none' || sthis.attr({'layer' : '1'}).hide();
        }
        sthis = null;
    });
};

//需依赖原型的对外方法
Class.pt.openLayer = function(){
    var that = this;
    
    //置顶当前窗口
    layer.zIndex = that.config.zIndex;
    layer.setTop = function(layero){
        var setZindex = function(){
            layer.zIndex++;
            layero.css('z-index', layer.zIndex + 1);
        };
        layer.zIndex = parseInt(layero[0].style.zIndex);
        layero.on('mousedown', setZindex);
        return layer.zIndex;
    };
};

ready.record = function(layero){
    var area = [
        layero.outerWidth(),
        layero.outerHeight(),
        layero.position().top, 
        layero.position().left + parseFloat(layero.css('margin-left'))
    ];
    layero.find('.layui-layer-max').addClass('layui-layer-maxmin');
    layero.attr({area: area});
};

ready.rescollbar = function(index){
    if(doms.html.attr('layer-full') == index){
        if(doms.html[0].style.removeProperty){
            doms.html[0].style.removeProperty('overflow');
        } else {
            doms.html[0].style.removeAttribute('overflow');
        }
        doms.html.removeAttr('layer-full');
    }
};

/*! 内置成员 */

//获取子iframe的DOM
layer.getChildFrame = function(selector, index){
    index = index || $('.'+doms[4]).attr('times');
    return $('#'+ doms[0] + index).find('iframe').contents().find(selector);    
};

//得到当前iframe层的索引，子iframe时使用
layer.getFrameIndex = function(name){
    return $('#'+ name).parents('.'+doms[4]).attr('times');
};

//iframe层自适应宽高
layer.iframeAuto = function(index){
    if(!index) return;
    var heg = layer.getChildFrame('body', index).outerHeight();
    var layero = $('#'+ doms[0] + index);
    var titHeight = layero.find(doms[1]).outerHeight() || 0;
    var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
    layero.css({height: heg + titHeight + btnHeight});
    layero.find('iframe').css({height: heg});
};

//重置iframe url
layer.iframeSrc = function(index, url){
    $('#'+ doms[0] + index).find('iframe').attr('src', url);
};

//设定层的样式
layer.style = function(index, options){
    var layero = $('#'+ doms[0] + index), type = layero.attr('type');
    var titHeight = layero.find(doms[1]).outerHeight() || 0;
    var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
    if(type === ready.type[1] || type === ready.type[2]){
        layero.css(options);
        if(type === ready.type[2]){
            layero.find('iframe').css({
                height: parseFloat(options.height) - titHeight - btnHeight
            });
        }
    }
};

//最小化
layer.min = function(index, options){
    var layero = $('#'+ doms[0] + index);
    var titHeight = layero.find(doms[1]).outerHeight() || 0;
    ready.record(layero);
    layer.style(index, {width: 180, height: titHeight, overflow: 'hidden'});
    layero.find('.layui-layer-min').hide();
    layero.attr('type') === 'page' && layero.find(doms[4]).hide();
    ready.rescollbar(index);
};

//还原
layer.restore = function(index){
    var layero = $('#'+ doms[0] + index), area = layero.attr('area').split(',');
    var type = layero.attr('type');
    layer.style(index, {
        width: parseFloat(area[0]), 
        height: parseFloat(area[1]), 
        top: parseFloat(area[2]), 
        left: parseFloat(area[3]),
        overflow: 'visible'
    });
    layero.find('.layui-layer-max').removeClass('layui-layer-maxmin');
    layero.find('.layui-layer-min').show();
    layero.attr('type') === 'page' && layero.find(doms[4]).show();
    ready.rescollbar(index);
};

//全屏
layer.full = function(index){
    var layero = $('#'+ doms[0] + index), timer;
    ready.record(layero);
    if(!doms.html.attr('layer-full')){
        doms.html.css('overflow','hidden').attr('layer-full', index);
    }
    clearTimeout(timer);
    timer = setTimeout(function(){
        var isfix = layero.css('position') === 'fixed';
        layer.style(index, {
             top: isfix ? 0 : win.scrollTop(),
             left: isfix ? 0 : win.scrollLeft(),
             width: win.width(),
             height: win.height()
        });
        layero.find('.layui-layer-min').hide();
    }, 100);
};

//改变title
layer.title = function(name, index){
    var title = $('#'+ doms[0] + (index||layer.index)).find(doms[1]);
    title.html(name);
};

//关闭layer总方法
layer.close = function(index){
    var layero = $('#'+ doms[0] + index), type = layero.attr('type');
    if(!layero[0]) return;
    if(type === ready.type[1] && layero.attr('conType') === 'object'){
        layero.children(':not(.'+ doms[5] +')').remove();
        for(var i = 0; i < 2; i++){
            layero.find('.layui-layer-wrap').unwrap().hide();
        }
    } else {
        //低版本IE 回收 iframe
        if(type === ready.type[2]){
            try {
                var iframe = $('#'+doms[4]+index)[0];
                iframe.contentWindow.document.write('');
                iframe.contentWindow.close();
                layero.find('.'+doms[5])[0].removeChild(iframe);
            } catch(e){}
        }
        layero[0].innerHTML = '';
        layero.remove();
    }
    $('#layui-layer-moves, #layui-layer-shade' + index).remove();
    layer.ie6 && ready.reselect();
    ready.rescollbar(index);
    $(document).off('keydown', ready.enter);
    typeof ready.end[index] === 'function' && ready.end[index]();
    delete ready.end[index]; 
};

//关闭所有层
layer.closeAll = function(type){
    $.each($('.'+doms[0]), function(){
        var othis = $(this);
        var is = type ? (othis.attr('type') === type) : 1;
        is && layer.close(othis.attr('times'));
        is = null;
    });
};

//主入口
ready.run = function(){
    $ = jQuery; 
    win = $(window);
    doms.html = $('html');
    layer.open = function(deliver){
        var o = new Class(deliver);
        return o.index;
    };
};

/*'function' === typeof define ? define(function(){
    ready.run();
    return layer;
}) : function(){
   window.layer = layer;
   ready.run();
   layer.use('skin/layer.css');
}();*/
    window.layer = layer;
    ready.run();

}(window);
/*! AdminLTE app.js
 * ================
 * Main JS application file for AdminLTE v2. This file
 * should be included in all pages. It controls some layout
 * options and implements exclusive AdminLTE plugins.
 *
 * @Author  Almsaeed Studio
 * @Support <http://www.almsaeedstudio.com>
 * @Email   <support@almsaeedstudio.com>
 * @version 2.3.0
 * @license MIT <http://opensource.org/licenses/MIT>
 */

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
    throw new Error("AdminLTE requires jQuery");
}

/* AdminLTE
 *
 * @type Object
 * @description $.AdminLTE is the main object for the template's app.
 *              It's used for implementing functions and options related
 *              to the template. Keeping everything wrapped in an object
 *              prevents conflict with other plugins and is a better
 *              way to organize our code.
 */
$.AdminLTE = {};

/* --------------------
 * - AdminLTE Options -
 * --------------------
 * Modify these options to suit your implementation
 */
$.AdminLTE.options = {
    //Add slimscroll to navbar menus
    //This requires you to load the slimscroll plugin
    //in every page before app.js
    navbarMenuSlimscroll: true,
    navbarMenuSlimscrollWidth: "3px", //The width of the scroll bar
    navbarMenuHeight: "200px", //The height of the inner menu
    //General animation speed for JS animated elements such as box collapse/expand and
    //sidebar treeview slide up/down. This options accepts an integer as milliseconds,
    //'fast', 'normal', or 'slow'
    animationSpeed: 500,
    //Sidebar push menu toggle button selector
    sidebarToggleSelector: "[data-toggle='offcanvas']",
    //Activate sidebar push menu
    sidebarPushMenu: true,
    //Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
    sidebarSlimScroll: true,
    //Enable sidebar expand on hover effect for sidebar mini
    //This option is forced to true if both the fixed layout and sidebar mini
    //are used together
    sidebarExpandOnHover: false,
    //BoxRefresh Plugin
    enableBoxRefresh: true,
    //Bootstrap.js tooltip
    enableBSToppltip: true,
    BSTooltipSelector: "[data-toggle='tooltip']",
    //Enable Fast Click. Fastclick.js creates a more
    //native touch experience with touch devices. If you
    //choose to enable the plugin, make sure you load the script
    //before AdminLTE's app.js
    enableFastclick: true,
    //Control Sidebar Options
    enableControlSidebar: true,
    controlSidebarOptions: {
        //Which button should trigger the open/close event
        toggleBtnSelector: "[data-toggle='control-sidebar']",
        //The sidebar selector
        selector: ".control-sidebar",
        //Enable slide over content
        slide: true
    },
    //Box Widget Plugin. Enable this plugin
    //to allow boxes to be collapsed and/or removed
    enableBoxWidget: true,
    //Box Widget plugin options
    boxWidgetOptions: {
        boxWidgetIcons: {
            //Collapse icon
            collapse: 'fa-minus',
            //Open icon
            open: 'fa-plus',
            //Remove icon
            remove: 'fa-times'
        },
        boxWidgetSelectors: {
            //Remove button selector
            remove: '[data-widget="remove"]',
            //Collapse button selector
            collapse: '[data-widget="collapse"]'
        }
    },
    //Direct Chat plugin options
    directChat: {
        //Enable direct chat by default
        enable: true,
        //The button to open and close the chat contacts pane
        contactToggleSelector: '[data-widget="chat-pane-toggle"]'
    },
    //Define the set of colors to use globally around the website
    colors: {
        lightBlue: "#3c8dbc",
        red: "#f56954",
        green: "#00a65a",
        aqua: "#00c0ef",
        yellow: "#f39c12",
        blue: "#0073b7",
        navy: "#001F3F",
        teal: "#39CCCC",
        olive: "#3D9970",
        lime: "#01FF70",
        orange: "#FF851B",
        fuchsia: "#F012BE",
        purple: "#8E24AA",
        maroon: "#D81B60",
        black: "#222222",
        gray: "#d2d6de"
    },
    //The standard screen sizes that bootstrap uses.
    //If you change these in the variables.less file, change
    //them here too.
    screenSizes: {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200
    }
};

/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements AdminLTE's
 * functions and plugins as specified by the
 * options above.
 */
$(function () {
    "use strict";

    //Fix for IE page transitions
    $("body").removeClass("hold-transition");

    //Extend options if external options exist
    if (typeof AdminLTEOptions !== "undefined") {
        $.extend(true,
            $.AdminLTE.options,
            AdminLTEOptions);
    }

    //Easy access to options
    var o = $.AdminLTE.options;

    //Set up the object
    _init();

    //Activate the layout maker
    $.AdminLTE.layout.activate();

    //Enable sidebar tree view controls
    $.AdminLTE.tree('.sidebar');

    //Enable control sidebar
    if (o.enableControlSidebar) {
        $.AdminLTE.controlSidebar.activate();
    }

    //Add slimscroll to navbar dropdown
    if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
        $(".navbar .menu").slimscroll({
            height: o.navbarMenuHeight,
            alwaysVisible: false,
            size: o.navbarMenuSlimscrollWidth
        }).css("width", "100%");
    }

    //Activate sidebar push menu
    if (o.sidebarPushMenu) {
        $.AdminLTE.pushMenu.activate(o.sidebarToggleSelector);
    }

    //Activate Bootstrap tooltip
    if (o.enableBSToppltip) {
        $('body').tooltip({
            selector: o.BSTooltipSelector
        });
    }

    //Activate box widget
    if (o.enableBoxWidget) {
        $.AdminLTE.boxWidget.activate();
    }

    //Activate fast click
    if (o.enableFastclick && typeof FastClick != 'undefined') {
        FastClick.attach(document.body);
    }

    //Activate direct chat widget
    if (o.directChat.enable) {
        $(document).on('click', o.directChat.contactToggleSelector, function () {
            var box = $(this).parents('.direct-chat').first();
            box.toggleClass('direct-chat-contacts-open');
        });
    }

    /*
     * INITIALIZE BUTTON TOGGLE
     * ------------------------
     */
    $('.btn-group[data-toggle="btn-toggle"]').each(function () {
        var group = $(this);
        $(this).find(".btn").on('click', function (e) {
            group.find(".btn.active").removeClass("active");
            $(this).addClass("active");
            e.preventDefault();
        });

    });
});

/* ----------------------------------
 * - Initialize the AdminLTE Object -
 * ----------------------------------
 * All AdminLTE functions are implemented below.
 */
function _init() {
    'use strict';
    /* Layout
     * ======
     * Fixes the layout height in case min-height fails.
     *
     * @type Object
     * @usage $.AdminLTE.layout.activate()
     *        $.AdminLTE.layout.fix()
     *        $.AdminLTE.layout.fixSidebar()
     */
    $.AdminLTE.layout = {
        activate: function () {
            var _this = this;
            _this.fix();
            _this.fixSidebar();
            $(window, ".wrapper").resize(function () {
                _this.fix();
                _this.fixSidebar();
            });
        },
        fix: function () {
            //Get window height and the wrapper height
            var neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
            var window_height = $(window).height();
            var sidebar_height = $(".sidebar").height();
            //Set the min-height of the content and sidebar based on the
            //the height of the document.
            if ($("body").hasClass("fixed")) {
                $(".content-wrapper, .right-side").css('min-height', window_height - $('.main-footer').outerHeight());
            } else {
                var postSetWidth;
                if (window_height >= sidebar_height) {
                    $(".content-wrapper, .right-side").css('min-height', window_height - neg);
                    postSetWidth = window_height - neg;
                } else {
                    $(".content-wrapper, .right-side").css('min-height', sidebar_height);
                    postSetWidth = sidebar_height;
                }

                //Fix for the control sidebar height
                var controlSidebar = $($.AdminLTE.options.controlSidebarOptions.selector);
                if (typeof controlSidebar !== "undefined") {
                    if (controlSidebar.height() > postSetWidth)
                        $(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
                }

            }
        },
        fixSidebar: function () {
            //Make sure the body tag has the .fixed class
            if (!$("body").hasClass("fixed")) {
                if (typeof $.fn.slimScroll != 'undefined') {
                    $(".sidebar").slimScroll({destroy: true}).height("auto");
                }
                return;
            } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
                window.console.error("Error: the fixed layout requires the slimscroll plugin!");
            }
            //Enable slimscroll for fixed layout
            if ($.AdminLTE.options.sidebarSlimScroll) {
                if (typeof $.fn.slimScroll != 'undefined') {
                    //Destroy if it exists
                    $(".sidebar").slimScroll({destroy: true}).height("auto");
                    //Add slimscroll
                    $(".sidebar").slimscroll({
                        height: ($(window).height() - $(".main-header").height()) + "px",
                        color: "rgba(0,0,0,0.2)",
                        size: "3px"
                    });
                }
            }
        }
    };

    /* PushMenu()
     * ==========
     * Adds the push menu functionality to the sidebar.
     *
     * @type Function
     * @usage: $.AdminLTE.pushMenu("[data-toggle='offcanvas']")
     */
    $.AdminLTE.pushMenu = {
        activate: function (toggleBtn) {
            //Get the screen sizes
            var screenSizes = $.AdminLTE.options.screenSizes;

            //Enable sidebar toggle
            $(toggleBtn).on('click', function (e) {
                e.preventDefault();

                //Enable sidebar push menu
                if ($(window).width() > (screenSizes.sm - 1)) {
                    if ($("body").hasClass('sidebar-collapse')) {
                        $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
                    } else {
                        $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    }
                }
                //Handle sidebar push menu for small screens
                else {
                    if ($("body").hasClass('sidebar-open')) {
                        $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
                    } else {
                        $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
                    }
                }
            });

            $(".content-wrapper").click(function () {
                //Enable hide menu when clicking on the content-wrapper on small screens
                if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
                    $("body").removeClass('sidebar-open');
                }
            });

            //Enable expand on hover for sidebar mini
            if ($.AdminLTE.options.sidebarExpandOnHover
                || ($('body').hasClass('fixed')
                && $('body').hasClass('sidebar-mini'))) {
                this.expandOnHover();
            }
        },
        expandOnHover: function () {
            var _this = this;
            var screenWidth = $.AdminLTE.options.screenSizes.sm - 1;
            //Expand sidebar on hover
            $('.main-sidebar').hover(function () {
                if ($('body').hasClass('sidebar-mini')
                    && $("body").hasClass('sidebar-collapse')
                    && $(window).width() > screenWidth) {
                    _this.expand();
                }
            }, function () {
                if ($('body').hasClass('sidebar-mini')
                    && $('body').hasClass('sidebar-expanded-on-hover')
                    && $(window).width() > screenWidth) {
                    _this.collapse();
                }
            });
        },
        expand: function () {
            $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
        },
        collapse: function () {
            if ($('body').hasClass('sidebar-expanded-on-hover')) {
                $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
            }
        }
    };

    /* Tree()
     * ======
     * Converts the sidebar into a multilevel
     * tree view menu.
     *
     * @type Function
     * @Usage: $.AdminLTE.tree('.sidebar')
     */
    $.AdminLTE.tree = function (menu) {
        var _this = this;
        var animationSpeed = $.AdminLTE.options.animationSpeed;
        $(document).on('click', menu + ' li a', function (e) {
            //Get the clicked link and the next element
            var $this = $(this);
            var checkElement = $this.next();

            //Check if the next element is a menu and is visible
            if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
                //Close the menu
                checkElement.slideUp(animationSpeed, function () {
                    checkElement.removeClass('menu-open');
                    //Fix the layout in case the sidebar stretches over the height of the window
                    //_this.layout.fix();
                });
                checkElement.parent("li").removeClass("active");
            }
            //If the menu is not visible
            else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
                //Get the parent menu
                var parent = $this.parents('ul').first();
                //Close all open menus within the parent
                var ul = parent.find('ul:visible').slideUp(animationSpeed);
                //Remove the menu-open class from the parent
                ul.removeClass('menu-open');
                //Get the parent li
                var parent_li = $this.parent("li");

                //Open the target menu and add the menu-open class
                checkElement.slideDown(animationSpeed, function () {
                    //Add the class active to the parent li
                    checkElement.addClass('menu-open');
                    parent.find('li.active').removeClass('active');
                    parent_li.addClass('active');
                    //Fix the layout in case the sidebar stretches over the height of the window
                    _this.layout.fix();
                });
            }
            //if this isn't a link, prevent the page from being redirected
            if (checkElement.is('.treeview-menu')) {
                e.preventDefault();
            }
        });
    };

    /* ControlSidebar
     * ==============
     * Adds functionality to the right sidebar
     *
     * @type Object
     * @usage $.AdminLTE.controlSidebar.activate(options)
     */
    $.AdminLTE.controlSidebar = {
        //instantiate the object
        activate: function () {
            //Get the object
            var _this = this;
            //Update options
            var o = $.AdminLTE.options.controlSidebarOptions;
            //Get the sidebar
            var sidebar = $(o.selector);
            //The toggle button
            var btn = $(o.toggleBtnSelector);

            //Listen to the click event
            btn.on('click', function (e) {
                e.preventDefault();
                //If the sidebar is not open
                if (!sidebar.hasClass('control-sidebar-open')
                    && !$('body').hasClass('control-sidebar-open')) {
                    //Open the sidebar
                    _this.open(sidebar, o.slide);
                } else {
                    _this.close(sidebar, o.slide);
                }
            });

            //If the body has a boxed layout, fix the sidebar bg position
            var bg = $(".control-sidebar-bg");
            _this._fix(bg);

            //If the body has a fixed layout, make the control sidebar fixed
            if ($('body').hasClass('fixed')) {
                _this._fixForFixed(sidebar);
            } else {
                //If the content height is less than the sidebar's height, force max height
                if ($('.content-wrapper, .right-side').height() < sidebar.height()) {
                    _this._fixForContent(sidebar);
                }
            }
        },
        //Open the control sidebar
        open: function (sidebar, slide) {
            //Slide over content
            if (slide) {
                sidebar.addClass('control-sidebar-open');
            } else {
                //Push the content by adding the open class to the body instead
                //of the sidebar itself
                $('body').addClass('control-sidebar-open');
            }
        },
        //Close the control sidebar
        close: function (sidebar, slide) {
            if (slide) {
                sidebar.removeClass('control-sidebar-open');
            } else {
                $('body').removeClass('control-sidebar-open');
            }
        },
        _fix: function (sidebar) {
            var _this = this;
            if ($("body").hasClass('layout-boxed')) {
                sidebar.css('position', 'absolute');
                sidebar.height($(".wrapper").height());
                $(window).resize(function () {
                    _this._fix(sidebar);
                });
            } else {
                sidebar.css({
                    'position': 'fixed',
                    'height': 'auto'
                });
            }
        },
        _fixForFixed: function (sidebar) {
            sidebar.css({
                'position': 'fixed',
                'max-height': '100%',
                'overflow': 'auto',
                'padding-bottom': '50px'
            });
        },
        _fixForContent: function (sidebar) {
            $(".content-wrapper, .right-side").css('min-height', sidebar.height());
        }
    };

    /* BoxWidget
     * =========
     * BoxWidget is a plugin to handle collapsing and
     * removing boxes from the screen.
     *
     * @type Object
     * @usage $.AdminLTE.boxWidget.activate()
     *        Set all your options in the main $.AdminLTE.options object
     */
    $.AdminLTE.boxWidget = {
        selectors: $.AdminLTE.options.boxWidgetOptions.boxWidgetSelectors,
        icons: $.AdminLTE.options.boxWidgetOptions.boxWidgetIcons,
        animationSpeed: $.AdminLTE.options.animationSpeed,
        activate: function (_box) {
            var _this = this;
            if (!_box) {
                _box = document; // activate all boxes per default
            }
            //Listen for collapse event triggers
            $(_box).on('click', _this.selectors.collapse, function (e) {
                e.preventDefault();
                _this.collapse($(this));
            });

            //Listen for remove event triggers
            $(_box).on('click', _this.selectors.remove, function (e) {
                e.preventDefault();
                _this.remove($(this));
            });
        },
        collapse: function (element) {
            var _this = this;
            //Find the box parent
            var box = element.parents(".box").first();
            //Find the body and the footer
            var box_content = box.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
            if (!box.hasClass("collapsed-box")) {
                //Convert minus into plus
                element.children(":first")
                    .removeClass(_this.icons.collapse)
                    .addClass(_this.icons.open);
                //Hide the content
                box_content.slideUp(_this.animationSpeed, function () {
                    box.addClass("collapsed-box");
                });
            } else {
                //Convert plus into minus
                element.children(":first")
                    .removeClass(_this.icons.open)
                    .addClass(_this.icons.collapse);
                //Show the content
                box_content.slideDown(_this.animationSpeed, function () {
                    box.removeClass("collapsed-box");
                });
            }
        },
        remove: function (element) {
            //Find the box parent
            var box = element.parents(".box").first();
            box.slideUp(this.animationSpeed);
        }
    };
}

/* ------------------
 * - Custom Plugins -
 * ------------------
 * All custom plugins are defined below.
 */

/*
 * BOX REFRESH BUTTON
 * ------------------
 * This is a custom plugin to use with the component BOX. It allows you to add
 * a refresh button to the box. It converts the box's state to a loading state.
 *
 * @type plugin
 * @usage $("#box-widget").boxRefresh( options );
 */
(function ($) {

    "use strict";

    $.fn.boxRefresh = function (options) {

        // Render options
        var settings = $.extend({
            //Refresh button selector
            trigger: ".refresh-btn",
            //File source to be loaded (e.g: ajax/src.php)
            source: "",
            //Callbacks
            onLoadStart: function (box) {
                return box;
            }, //Right after the button has been clicked
            onLoadDone: function (box) {
                return box;
            } //When the source has been loaded

        }, options);

        //The overlay
        var overlay = $('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');

        return this.each(function () {
            //if a source is specified
            if (settings.source === "") {
                if (window.console) {
                    window.console.log("Please specify a source first - boxRefresh()");
                }
                return;
            }
            //the box
            var box = $(this);
            //the button
            var rBtn = box.find(settings.trigger).first();

            //On trigger click
            rBtn.on('click', function (e) {
                e.preventDefault();
                //Add loading overlay
                start(box);

                //Perform ajax call
                box.find(".box-body").load(settings.source, function () {
                    done(box);
                });
            });
        });

        function start(box) {
            //Add overlay and loading img
            box.append(overlay);

            settings.onLoadStart.call(box);
        }

        function done(box) {
            //Remove overlay and loading img
            box.find(overlay).remove();

            settings.onLoadDone.call(box);
        }

    };

})(jQuery);

/*
 * EXPLICIT BOX ACTIVATION
 * -----------------------
 * This is a custom plugin to use with the component BOX. It allows you to activate
 * a box inserted in the DOM after the app.js was loaded.
 *
 * @type plugin
 * @usage $("#box-widget").activateBox();
 */
(function ($) {

    'use strict';

    $.fn.activateBox = function () {
        $.AdminLTE.boxWidget.activate(this);
    };

})(jQuery);

/*
 * TODO LIST CUSTOM PLUGIN
 * -----------------------
 * This plugin depends on iCheck plugin for checkbox and radio inputs
 *
 * @type plugin
 * @usage $("#todo-widget").todolist( options );
 */
(function ($) {

    'use strict';

    $.fn.todolist = function (options) {
        // Render options
        var settings = $.extend({
            //When the user checks the input
            onCheck: function (ele) {
                return ele;
            },
            //When the user unchecks the input
            onUncheck: function (ele) {
                return ele;
            }
        }, options);

        return this.each(function () {

            if (typeof $.fn.iCheck != 'undefined') {
                $('input', this).on('ifChecked', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    settings.onCheck.call(ele);
                });

                $('input', this).on('ifUnchecked', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    settings.onUncheck.call(ele);
                });
            } else {
                $('input', this).on('change', function () {
                    var ele = $(this).parents("li").first();
                    ele.toggleClass("done");
                    if ($('input', ele).is(":checked")) {
                        settings.onCheck.call(ele);
                    } else {
                        settings.onUncheck.call(ele);
                    }
                });
            }
        });
    };
}(jQuery));
/*
 * 全局设置
 */
(function ($) {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $.ajaxSetup({
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        }
    });

    /*$.ajaxSetup({
        contentType: 'application/json;charset=utf-8',
        dataType: 'json'
    });*/

})(jQuery);