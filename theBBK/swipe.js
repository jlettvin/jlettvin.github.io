"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 34,};
	const verstr  = '' + version.major + '.' + version.minor + '.' + version.build;
	const scale = 1.5;

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.swipe = document.jlettvin.swipe || {
		version: verstr,  // this javascript code version
		direction: null,
		xyt0 : [0,0,0],
		dt: null,
		at: 1000, // maximum time for swipe
		threshold: 100 * scale, // required min distance considered swipe
		restraint:  80 * scale, // maximum perpendicular distance

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		show: function(title, msg) {
			document.getElementById('swipe').innerHTML += '<br />' +
				document.jlettvin.swipe.version + ' [' + title + ']: ' + msg;
		},

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		strxyt: function(title, xyt) {
			return title + ': (' + xyt[0] + ',' + xyt[1] + ',' + xyt[2] + ')';
		},

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		fillxyt: function(title, name, xyt) {
			var my = document.jlettvin.swipe;
			var finger = event.touches[0];
			xyt = [finger.screenX, finger.screenY, new Date().getTime()];
			my.show(title, my.strxyt(name, my.xyt0));
		},

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		swipe: function(el, callback) {
			var handleswipe    = callback || function(swipedir){};
			var touchsurface   = el;

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchstart', function(event) {
				var my = document.jlettvin.swipe;
				fillxyt('init', 'xyt0', my.xyt0);
				event.preventDefault()
			}, false);

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchmove', function(event) {
				var xyt;
				fillxyt('move', 'xyt', my.xyt0);
				event.preventDefault(); // prevent scrolling while swiping
			}, false);

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchend', function(event) {
				xyt1;
				fillxyt('calc', 'xyt1', xyt1);

				var dx = xyt1[0] - my.xyt0[0]; // horizontal swipe displacement
				var dy = xyt1[1] - my.xyt0[1]; // vertical   swipe displacement
				var dt = xyt1[2] - my.xyt0[2]; // elapsed    time
				var dxyt = [dx, dy, dt];

				var ax = Math.abs(dx);
				var ay = Math.abs(dy);

				var my = document.jlettvin.swipe;

				// meet first condition for swipe
				if (dt > my.at) {
					my.show('fini', 'dt excess: ', '' + dt + ' > ' + my.at);
				} else {
					// meet 2nd condition for horizontal swipe
					if (ax >= my.threshold && ay <= my.restraint) {
						my.show('fini', 'x satisfied');
						handleswipe((dx < 0)? 'SwipeLeft' : 'SwipeRight');
					}
					// meet 2nd condition for vertical swipe
					else if (ay >= my.threshold && ax <= my.restraint) {
						my.show('fini', 'y satisfied');
						handleswipe((dy < 0)? 'SwipeUp' : 'SwipeDown');
					}
					else {
						my.show('fini', 'inadequate' +
							strxyt('xyt0', my.xyt0),
							strxyt('xyt1', xyt1),
							strxyt('dxyt', dxyt),
							' axy(' + ax + ',' + ay + ')' +
							' T:' + my.threshold +
							' R:' + my.restraint);
					}
				}
				event.preventDefault();
			}, false);
			//-------------------------------------------------------------------
		},
		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	};

})();
