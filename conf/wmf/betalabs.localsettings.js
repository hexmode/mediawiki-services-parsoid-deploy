"use strict";
exports.setup = function( parsoidConfig ) {
	parsoidConfig.loadWMF = false;

	parsoidConfig.setInterwiki( 'aawiki', 'http://aa.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'arwiki', 'http://aa.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'cawiki', 'http://aa.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'commonswiki', 'http://commons.wikimedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'dewiki', 'http://de.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'en_rtlwiki', 'http://en-rtl.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'enwiki', 'http://en.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'enwikibooks', 'http://en.wikibooks.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'enwikinews', 'http://en.wikinews.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'enwikiquote', 'http://en.wikiquote.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'enwikisource', 'http://en.wikisource.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'enwikiversity', 'http://en.wikiversity.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'enwiktionary', 'http://en.wikitionary.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'eowiki', 'http://eo.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'eswiki', 'http://es.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'fawiki', 'http://fa.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'hewiki', 'http://he.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'hiwiki', 'http://hi.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'jawiki', 'http://ja.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'kowiki', 'http://ko.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'labs', 'http://deployment.wikimedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'loginwiki', 'http://login.wikimedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'metawiki', 'http://meta.wikimedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'ruwiki', 'http://ru.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'simplewiki', 'http://simple.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'sqwiki', 'http://sq.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'testwiki', 'http://test.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'ukwiki', 'http://uk.wikipedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'wikidatawiki', 'http://wikidata.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'zerowiki', 'http://zero.wikimedia.beta.wmflabs.org/w/api.php' );
	parsoidConfig.setInterwiki( 'zhwiki', 'http://zh.wikipedia.beta.wmflabs.org/w/api.php' );

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
