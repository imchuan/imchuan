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
    $.ajaxSetup({
        contentType: 'application/json;charset=utf-8',
        dataType: 'json'
    });
})(jQuery);