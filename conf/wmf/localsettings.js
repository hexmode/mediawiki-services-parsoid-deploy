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

	// Direct logs to logstash via bunyan and gelf-stream.
	var LOGSTASH_HOSTNAME='logstash1003.eqiad.wmnet';
	var LOGSTASH_PORT=12201;
	parsoidConfig.loggerBackend = {
		name: ':Logger.bunyan/BunyanLogger',
		options: {
			// No need to do any log suppression here -- we are doing that filtering
			// in ParsoidLogger already. So, we will enable most permissive level here
			// to replicate all log entries to both streams. If we want to redirect
			// different levels to different targets, we can use different levels at that time.
			name: 'parsoid',
			streams: [
				{
					path: '/srv/log/parsoid/parsoid.log',
					level: 'debug'
				},
				{
					type: 'raw',
					stream: require('gelf-stream').forBunyan(LOGSTASH_HOSTNAME, LOGSTASH_PORT),
					level: 'warn'
				}
			]
		}
	};

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
