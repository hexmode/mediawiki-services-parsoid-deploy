"use strict";
exports.setup = function(parsoidConfig) {
	parsoidConfig.loadWMF = false;

	parsoidConfig.setMwApi('aawiki', { uri: 'http://aa.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('arwiki', { uri: 'http://aa.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('cawiki', { uri: 'http://aa.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('commonswiki', { uri: 'http://commons.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('dewiki', { uri: 'http://de.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('en_rtlwiki', { uri: 'http://en-rtl.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('enwiki', { uri: 'http://en.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('enwikibooks', { uri: 'http://en.wikibooks.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('enwikinews', { uri: 'http://en.wikinews.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('enwikiquote', { uri: 'http://en.wikiquote.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('enwikisource', { uri: 'http://en.wikisource.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('enwikiversity', { uri: 'http://en.wikiversity.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('enwiktionary', { uri: 'http://en.wikitionary.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('eowiki', { uri: 'http://eo.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('eswiki', { uri: 'http://es.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('fawiki', { uri: 'http://fa.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('hewiki', { uri: 'http://he.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('hiwiki', { uri: 'http://hi.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('jawiki', { uri: 'http://ja.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('kowiki', { uri: 'http://ko.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('labs', { uri: 'http://deployment.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('loginwiki', { uri: 'http://login.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('metawiki', { uri: 'http://meta.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('ruwiki', { uri: 'http://ru.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('simplewiki', { uri: 'http://simple.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('sqwiki', { uri: 'http://sq.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('testwiki', { uri: 'http://test.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('ukwiki', { uri: 'http://uk.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('wikidatawiki', { uri: 'http://wikidata.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('zerowiki', { uri: 'http://zero.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi('zhwiki', { uri: 'http://zh.wikipedia.beta.wmflabs.org/w/api.php' });

	// Use the PHP preprocessor to expand templates via the MW API (default true)
	parsoidConfig.usePHPPreProcessor = true;

	// Use selective serialization (default false)
	parsoidConfig.useSelser = true;

	// allow cross-domain requests to the API (default disallowed)
	//parsoidConfig.allowCORS = '*';
	//
	parsoidConfig.parsoidCacheURI = 'http://10.68.16.145/'; // deployment-parsoidcache01.eqiad.wmflabs

	// parsoidConfig.apiProxyURI = 'http://en.wikipedia.org';

	// Direct logs to logstash via bunyan and gelf-stream.
	var LOGSTASH_HOSTNAME='deployment-logstash1.eqiad.wmflabs';
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
					level: 'debug'
				}
			]
		}
	};

	// Use txstatsd to send Performance Timing information
	parsoidConfig.useDefaultPerformanceTimer = true;
	parsoidConfig.txstatsdHost = 'labmon1001.eqiad.wmnet';
	parsoidConfig.txstatsdPort = 8125;
};
