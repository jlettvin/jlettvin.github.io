"use strict";

(function() {

	// Re-use or build namespace
	document.jlettvin = document.jlettvin || {};
	document.jlettvin.slides = document.jlettvin.slides || {
		display: document.getElementsByTagName("article")[0],
		buttons: document.getElementsByTagName("nav")[0],
		section: document.getElementsByTagName("section"),
		showing: 0,

		// Function to show current slide
		redisplay: function (event) {
			var slides = document.jlettvin.slides;  // Needed for context
			slides.showing = parseInt(this.innerHTML.substr(5)) - 1;
			slides.go(0);
		},

		// Function to fill the article with the currently chosen section
		go: function(dir) {
			if (-1 <= dir && dir <= 1) {
				var change = this.showing + dir;
				if (0 <= change && change < this.counted) {
					this.showing = change;
					var slide = change + 1;
					var target = this.display;
					var source = this.section[this.showing];
					target.innerHTML = '<summary>Slide' + slide + '</summary>' +
						source.innerHTML;
				}
			}
		},

		main: function() {
			// Count the sections
			this.counted = this.section.length;

			// Accumulate the slides for display
			for (var N = this.counted, n = 0; n < N; ++n) {
				var section = this.section[n];
				var help    = section.getElementsByTagName("summary")[0];
				var button  = document.createElement("button");
				var abbr    = document.createElement("abbr");

				abbr.setAttribute("title", help.innerHTML);
				button.innerHTML = 'Slide' + (n + 1);
				button.onclick = this.redisplay;
				abbr.appendChild(button);
				this.buttons.appendChild(abbr);
			}

			// Attach functions to keyboard input
			var slides  = this;  // Needed for context
			document.addEventListener('keyup', function(event) {
				switch(event.code) {
					case 'PageUp'  : case 'ArrowLeft' : slides.go(-1); break;
					case 'PageDown': case 'ArrowRight': slides.go(+1); break;
				}
			});

			this.go(0);
		},
	};

	// Display first page on initial visit or refresh
	document.jlettvin.slides.main();

})();
