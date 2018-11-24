"use strict";

(function() {
	const version = {major: 0, minor: 0, build: 18,};

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.swipe = document.jlettvin.swipe || {
		version: version,  // this javascript code version

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
				document.getElementById('swipe').innerHTML += '<br />init';
				var touchobj = e.changedTouches[0]
				swipedir = 'none'
				dist = 0
				x0 = touchobj.pageX
				y0 = touchobj.pageY
				startTime = new Date().getTime() // time of first contact
				event.preventDefault()
			}, false);

			touchsurface.addEventListener('touchmove', function(event) {
				document.getElementById('swipe').innerHTML += '<br />move';
				event.preventDefault() // prevent scrolling while swiping
			}, false);

			touchsurface.addEventListener('touchend', function(event) {
				document.getElementById('swipe').innerHTML += '<br />fini';
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

			return 'returned from call to old swipe handler installer';
		},
	};

})();
