"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 18,};

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.swipe = document.jlettvin.swipe || {
		version: version,  // this javascript code version

		swipe: function(el, callback) {
			var handleswipe    = callback || function(swipedir){};
			var touchsurface   = el;

			const threshold    = 150; // required min distance considered swipe
			const restraint    = 100; // maximum perpendicular distance
			const allowedTime  = 300; // maximum time for swipe

			var swipedir;
			var x0;
			var y0;
			var dx;
			var dy;
			var elapsedTime;
			var startTime;

			touchsurface.addEventListener('touchstart', function(event) {
				var touchobj = e.changedTouches[0]
				swipedir = 'none'
				dist = 0
				x0 = touchobj.pageX
				y0 = touchobj.pageY
				startTime = new Date().getTime() // time of first contact
				event.preventDefault()
			}, false);

			touchsurface.addEventListener('touchmove', function(event) {
				event.preventDefault() // prevent scrolling while swiping
			}, false);

			touchsurface.addEventListener('touchend', function(event) {
				var touchobj = event.changedTouches[0]
				dx = touchobj.pageX - x0 // horizontal swipe displacement
				dy = touchobj.pageY - y0 // vertical   swipe displacement
				elapsedTime = new Date().getTime() - startTime // elapsed time
				// meet first condition for awipe
				if (elapsedTime <= allowedTime) {
					var adx = Math.abs(dx);
					var ady = Math.abs(dy);
					// meet 2nd condition for horizontal swipe
					if (adx >= threshold && ady <= restraint) {
						// if dist traveled is negative, it indicates left swipe
						swipedir = (dx < 0)? 'SwipeLeft' : 'SwipeRight'
					}
					// meet 2nd condition for vertical swipe
					else if (ady >= threshold && adx <= restraint) {
						// if dist traveled is negative, it indicates up swipe
						swipedir = (dy < 0)? 'SwipeUp' : 'SwipeDown';
					}
				}
				handleswipe(swipedir)
				event.preventDefault()
			}, false);

			return 'returned from call to swipe handler installer';
		},
	};

})();
