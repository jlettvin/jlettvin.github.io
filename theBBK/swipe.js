"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 44,};
	const verstr  = '' + version.major + '.' + version.minor + '.' + version.build;
	const scale = 1.5;

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.swipe = document.jlettvin.swipe || {
		version: verstr,  // this javascript code version
		direction: null,
		xyt0 : [0,0,0],
		xyt1 : [0,0,0],
		xytd : [0,0,0],
		at: 1000, // maximum time for swipe
		threshold: 100 * scale, // required min distance considered swipe
		restraint:  80 * scale, // maximum perpendicular distance

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		show: function(title, msg) {
			document.getElementById('swipe').innerHTML += '<br />swipe v' +
				document.jlettvin.swipe.version + ' [' + title + ']: ' + msg;
		},

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		strxyt: function(title, xyt) {
			return title + ': (' + xyt[0] + ',' + xyt[1] + ',' + xyt[2] + ')';
		},

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		fillxyt: function(name, xyt) {
			var my = document.jlettvin.swipe;
			var finger = event.touches[0];
			xyt[0] = finger.screenX;
			xyt[1] = finger.screenY;
			xyt[2] = new Date().getTime();
			my.show('fill', my.strxyt(name, xyt));
		},

		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		swipe: function(el, callback) {
			var handleswipe    = callback || function(swipedir){};
			var touchsurface   = el;

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchstart', function(event) {
				var my = document.jlettvin.swipe;
				my.show('init', 'begins');
				my.fillxyt('xyt0', my.xyt0);
				my.show('init', 'returns');
				event.preventDefault()
			}, false);

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchmove', function(event) {
				event.preventDefault(); // prevent scrolling while swiping
			}, false);

			//-------------------------------------------------------------------
			touchsurface.addEventListener('touchend', function(event) {
				var my = document.jlettvin.swipe;
				my.show('fini', 'begins');

				my.show('fini', '@');
				my.fillxyt('xyt1', my.xyt1);

				my.show('fini', 'A');

				my.xytd[0] = my.xyt1[0] - my.xyt0[0];  // horizontal swipe
				my.xytd[1] = my.xyt1[1] - my.xyt0[1];  //   vertical swipe
				my.xytd[2] = my.xyt1[2] - my.xyt0[2];  //       time difference
				my.show('fini', 'B');

				my.show('fini', 'C');
				var ax = Math.abs(dx);
				var ay = Math.abs(dy);

				my.show('fini', 'D');
				my.show('fini', my.strxyt('diff', my.xytd));

				// meet first condition for swipe
				if (my.xytd[2] > my.at) {
					my.show('fini', 'dt excess: ', '' + my.xytd[2] + ' > ' + my.at);
				} else {
					// meet 2nd condition for horizontal swipe
					if (ax >= my.threshold && ay <= my.restraint) {
						my.show('fini', 'x satisfied');
						handleswipe((my.xytd[0] < 0)? 'SwipeLeft' : 'SwipeRight');
					}
					// meet 2nd condition for vertical swipe
					else if (my.xytd[1] >= my.threshold && ax <= my.restraint) {
						my.show('fini', 'y satisfied');
						handleswipe((my.xytd[1] < 0)? 'SwipeUp' : 'SwipeDown');
					}
					else {
						my.show('fini', 'inadequate' +
							my.strxyt('xyt0', my.xyt0),
							my.strxyt('xyt1', my.xyt1),
							my.strxyt('dxyt', my.xytd),
							' axy(' + ax + ',' + ay + ')' +
							' T:' + my.threshold +
							' R:' + my.restraint);
					}
				}
				my.show('fini', 'returns');
				event.preventDefault();
			}, false);
			//-------------------------------------------------------------------
		},
		//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	};

})();
