"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 27,};
	const verstr  = '' + version.major + '.' + version.minor + '.' + version.build;

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.swipe = document.jlettvin.swipe || {
		version: verstr,  // this javascript code version
		direction: null,
		x0: null,
		y0: null,
		dt: null,
		t0: null,
		at: 1000, // maximum time for swipe
		threshold: 150, // required min distance considered swipe
		restraint: 100, // maximum perpendicular distance
		show: function(title, msg) {
			document.getElementById('swipe').innerHTML += '<br />' +
				document.jlettvin.swipe.version + ' [' + title + ']: ' + msg;
		},

		swipe: function(el, callback) {
			var handleswipe    = callback || function(swipedir){};
			var touchsurface   = el;

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchstart', function(event) {
				var my = document.jlettvin.swipe;

				var touched = event.touches[0];
				my.swipedir = null;
				my.x0 = touched.screenX;
				my.y0 = touched.screenY;
				my.t0 = new Date().getTime(); // time of first contact
				my.show('init', ' xy0(' + my.x0 + ',' + my.y0 + ')');
				event.preventDefault()
			}, false);

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchmove', function(event) {
				var my = document.jlettvin.swipe;
				my.show('move', '');
				event.preventDefault(); // prevent scrolling while swiping
			}, false);

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchend', function(event) {
				var my = document.jlettvin.swipe;
				var touched = event.touches[0];
				var why = 'unknown';
				var x = touched.screenX;
				var y = touched.screenY;
				var dx = x - my.x0; // horizontal swipe displacement
				var dy = y - my.y0; // vertical   swipe displacement
				var adx = Math.abs(dx);
				var ady = Math.abs(dy);

				var dt = new Date().getTime() - my.t0 // elapsed time
				// meet first condition for swipe
				if (dt > my.at) {
					my.show('fini', 'dt too large: ', '' + dt + ' > ' + my.at);
				} else {
					// meet 2nd condition for horizontal swipe
					if (adx >= my.threshold && ady <= my.restraint) {
						my.show('fini', 'adequate x');
						// if dist traveled is negative, it indicates left swipe
						my.swipedir = (dx < 0)? 'SwipeLeft' : 'SwipeRight'
					}
					// meet 2nd condition for vertical swipe
					else if (ady >= my.threshold && adx <= my.restraint) {
						my.show('fini', 'adequate y');
						// if dist traveled is negative, it indicates up swipe
						my.swipedir = (dy < 0)? 'SwipeUp' : 'SwipeDown';
					}
					else {
						my.show('fini', 'inadequate' +
							' xy(' + x + ',' + y + ')' +
							' xy0(' + my.x0 + ','     + my.y0 + ')' +
							' dxy(' + dx + ',' + dy + ')' +
							' abs(' + adx + ',' + ady + ')' +
							' T:' + my.threshold +
							' R:' + my.restraint);
						my.swipedir = null;
					}
				}
				if(my.swipedir != null) handleswipe(my.swipedir)
				event.preventDefault()
			}, false);
			//-------------------------------------------------------------------
		},
	};

})();
