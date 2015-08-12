"use strict";
exports.setup = function( parsoidConfig ) {
	parsoidConfig.loadWMF = true;
	parsoidConfig.usePHPPreProcessor = true;
	parsoidConfig.useSelser = true;
	// parsoid cache url
	parsoidConfig.parsoidCacheURI = 'http://10.2.2.29/';

	// Use the API backends directly without hitting the text varnishes.
	// API requests are not cacheable anyway.
	parsoidConfig.defaultAPIProxyURI = 'http://10.2.2.22';

	// Allow cors as we are only running on non-sensitive domains
	parsoidConfig.allowCORS = '*';

	parsoidConfig.setMwApi( 'labswiki', {
		uri: 'https://wikitech.wikimedia.org/w/api.php',
		proxy: { uri: null }
	} );

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
					stream: process.stdout,
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

	// Use txstatsd for Performance Timing information
	parsoidConfig.useDefaultPerformanceTimer = true;
	parsoidConfig.txstatsdHost = 'statsd.eqiad.wmnet';
	parsoidConfig.txstatsdPort = 8125;
};
