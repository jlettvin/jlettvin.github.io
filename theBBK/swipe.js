"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 21,};

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.swipe = document.jlettvin.swipe || {
		version: version,  // this javascript code version
		direction: null,
		x0: null,
		y0: null,
		elapsedTime: null,
		startTime: null,
		threshold: 150, // required min distance considered swipe
		restraint: 100, // maximum perpendicular distance
		allowedTime: 1000, // maximum time for swipe

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


			var x;
			var y;
			var dx;
			var dy;

			touchsurface.addEventListener('touchstart', function(event) {
				var touchobj = e.touches[0];
				document.jlettvin.swipe.swipedir = null;
				dist = 0;
				document.jlettvin.swipe.x0 = touchobj.screenX;
				document.jlettvin.swipe.y0 = touchobj.screenY;
				document.jlettvin.swipe.startTime = new Date().getTime(); // time of first contact
				document.getElementById('swipe').innerHTML += '<br />init: ' +
					//' xy0(' + document.jlettvin.swipe.x0 +
					//','     + document.jlettvin.swipe.y0 + ')'
					''
					;
				event.preventDefault()
			}, false);

			touchsurface.addEventListener('touchmove', function(event) {
				document.getElementById('swipe').innerHTML += '<br />move';
				event.preventDefault(); // prevent scrolling while swiping
			}, false);

			touchsurface.addEventListener('touchend', function(event) {
				var touchobj = event.touches[0];
				var why = 'unknown';
				x = touchobj.screenX;
				y = touchobj.screenY;
				dx = touchobj.screenX - document.jlettvin.swipe.x0; // horizontal swipe displacement
				dy = touchobj.screenY - document.jlettvin.swipe.y0; // vertical   swipe displacement
				document.jlettvin.swipe.elapsedTime = new Date().getTime() -
					document.jlettvin.swipe.startTime // elapsed time
				// meet first condition for awipe
				if (document.jlettvin.swipe.elapsedTime >
					document.jlettvin.swipe.allowedTime) {
					why = '' +
						'dt ' + document.jlettvin.swipe.elapsedTime +
						' > ' + document.jlettvin.swipe.allowedTime;
				} else {
					var adx = Math.abs(dx);
					var ady = Math.abs(dy);
					// meet 2nd condition for horizontal swipe
					if (adx >= document.jlettvin.swipe.threshold && ady <= document.jlettvin.swipe.restraint) {
						why = 'X';
						// if dist traveled is negative, it indicates left swipe
						document.jlettvin.swipe.swipedir = (dx < 0)? 'SwipeLeft' : 'SwipeRight'
					}
					// meet 2nd condition for vertical swipe
					else if (ady >= document.jlettvin.swipe.threshold && adx <= document.jlettvin.swipe.restraint) {
						why = 'Y';
						// if dist traveled is negative, it indicates up swipe
						document.jlettvin.swipe.swipedir = (dy < 0)? 'SwipeUp' : 'SwipeDown';
					}
					else {
						why = 'neither' +
							' xy(' + x + ',' + y + ')' +
							' xy0(' + document.jlettvin.swipe.x0 +
							','     + document.jlettvin.swipe.y0 + ')' +
							' dxy(' + dx + ',' + dy + ')' +
							' abs(' + adx + ',' + ady + ')' +
							' T:' + document.jlettvin.swipe.threshold +
							' R:' + document.jlettvin.swipe.restraint
							;
						document.jlettvin.swipe.swipedir = null;
					}
				}
				document.getElementById('swipe').innerHTML += '<br />fini: ' +
					document.jlettvin.swipe.version.toString() + ' ' +
					why + '...' +
					document.jlettvin.swipe.swipedir;
				if(document.jlettvin.swipe.swipedir != null) handleswipe(document.jlettvin.swipe.swipedir)
				event.preventDefault()
			}, false);

			return 'returned from call to old swipe handler installer';
		},
	};

})();
