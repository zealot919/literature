/*

The "TruncateURI" function of the plugin identifies when the URI is too long and truncates it to a reasonable length.
This is to correct an issue in IE (char limit of 2048) where the hit to Webtrends is truncated due to long URIs

To use this plugin:
#1 In the inline html or webtrends.load.js file, add a call to the plugin:

        plugins:{
            truncateURI:{src:"truncateURI.js"}
        }

*/

(function() {
	TruncateURI= {
		truncateURI:function(dcsObject, options) {

			var charLimit = 150;

			//look for a click event object
			var el = options['element'];

			//don't worry about truncating click events
			//WT.es truncation happen during page load & persists to click event
			//downloads & offsite link clicks don't need truncation & multitrack clicks manually setting URI

			//on regular page load event, just modify the Webtrends parameters
			if (!el && dcsObject.DCS.dcsuri.length > charLimit) {
				//truncate
				dcsObject.DCS.dcsuri = dcsObject.DCS.dcsuri.substring(0,charLimit);

				//truncate the URI in WT.es
				//EXAMPLE: WT.es=search.proquest.com/index.html
				//WT.es is changed on page load, which persists for all subsequent click events
				var startURI = dcsObject.WT.es.indexOf("/");
				dcsObject.WT.es = dcsObject.WT.es.substring(0, startURI+charLimit);
			}

		},

		doWork: function(dcs, options) {
			dcs.addTransform(TruncateURI.truncateURI, 'all');
		}
	}
})();

Webtrends.registerPlugin("truncateURI",TruncateURI.doWork);