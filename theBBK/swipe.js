"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 24,};
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
				document.jlettvin.swipe.version + '[' + title + ']: ' + msg;
		},

		newswipe: function(el,func) {
			var swipe_det = new Object();
			swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
			var min_x = 30;  //min x swipe for horizontal swipe
			var max_x = 30;  //max x difference for vertical swipe
			var min_y = 50;  //min y swipe for vertical swipe
			var max_y = 60;  //max y difference for horizontal swipe
			var direc = "";
			var ele = el;
			//var ele = document.getElementById(el);
			ele.addEventListener('touchstart',function(e){
				var t = e.touches[0];
				swipe_det.sX = t.screenX; 
				swipe_det.sY = t.screenY;
			},false);
			ele.addEventListener('touchmove',function(e){
				e.preventDefault();
				var t = e.touches[0];
				swipe_det.eX = t.screenX; 
				swipe_det.eY = t.screenY;    
			},false);
			ele.addEventListener('touchend',function(e){
				//horizontal detection
				if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
					if(swipe_det.eX > swipe_det.sX) direc = "r";
					else direc = "l";
				}
				//vertical detection
				else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
					if(swipe_det.eY > swipe_det.sY) direc = "d";
					else direc = "u";
				}

				if (direc != "") {
					if(typeof func == 'function') func(el,direc);
				}
				direc = "";
				swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
			},false);  
			return 'returned from call to new swipe handler installer';
		},

		//function myfunction(el,d) {
			//alert("you swiped on element with id '"+el+"' to "+d+" direction");
		//}

		swipe: function(el, callback) {
			var handleswipe    = callback || function(swipedir){};
			var touchsurface   = el;

			touchsurface.addEventListener('touchstart', function(event) {
				var my = document.jlettvin.swipe;
				var touched = e.touches[0];
				my.swipedir = null;
				my.x0 = touched.screenX;
				my.y0 = touched.screenY;
				my.t0 = new Date().getTime(); // time of first contact
				my.show('init', ' xy0(' + my.x0 + ',' + my.y0 + ')');
				event.preventDefault()
			}, false);

			touchsurface.addEventListener('touchmove', function(event) {
				var my = document.jlettvin.swipe;
				my.show('move', '');
				event.preventDefault(); // prevent scrolling while swiping
			}, false);

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

			return this.version;
		},
	};

})();
