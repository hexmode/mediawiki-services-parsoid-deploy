"use strict";
exports.setup = function( parsoidConfig ) {
	parsoidConfig.loadWMF = true;
	parsoidConfig.usePHPPreProcessor = true;

	// Communicate with the ParsoidBatchAPI extension on the MW API side (default false)
	parsoidConfig.useBatchAPI = true;

	parsoidConfig.useSelser = true;

	// Use the API backends directly without hitting the text varnishes.
	// API requests are not cacheable anyway.
	parsoidConfig.defaultAPIProxyURI = 'http://api.svc.eqiad.wmnet';

	// Allow cors as we are only running on non-sensitive domains
	parsoidConfig.allowCORS = '*';

	// RESTBase uses 2 minutes timeouts for the first request
	// and a higher value subsequently.
	//
	// Set a 3 minute timeout so that RESTBase retries have
	// a chance of succeeding.
	parsoidConfig.timeouts.request = 3*60*1000; // 3 minutes

	// Bump default resource limits.
	// With node v4, we have a wider margin.
	parsoidConfig.limits.wt2html.maxWikitextSize = 1250000;
	parsoidConfig.limits.wt2html.maxListItems = 50000;
	parsoidConfig.limits.wt2html.maxTableCells = 50000;

	// Sample these verbose logs to prevent overwhelm
	// 1% and 2% for empty/tr and empty/li is based on
	// seeing the volume in rt-testing.
	parsoidConfig.loggerSampling = [
		['warning/dsr/inconsistent', 5],
		['warning/empty/li', 1],
		['warning/empty/tr', 0],
		[/^warning\/empty\//, 5],
	];

	// Use txstatsd for Performance Timing information
	parsoidConfig.useDefaultPerformanceTimer = true;
	parsoidConfig.txstatsdHost = 'statsd.eqiad.wmnet';
	parsoidConfig.txstatsdPort = 8125;
};
