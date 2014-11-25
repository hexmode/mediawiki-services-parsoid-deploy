"use strict";
exports.setup = function( parsoidConfig ) {
	// Map from DB name to API URL
	var dbname,
		interwikiMap = {
			'testwiki': 'http://test.wikipedia.org/w/api.php',
			'test2wiki': 'http://test2.wikipedia.org/w/api.php',

			'foundationwiki': 'http://wikimediafoundation.org/w/api.php',
			'metawiki': 'http://meta.wikimedia.org/w/api.php',
			'wikidatawiki': 'http://www.wikidata.org/w/api.php',
			'incubatorwiki': 'http://incubator.wikimedia.org/w/api.php',
			'outreachwiki': 'http://outreach.wikimedia.org/w/api.php',
			'sewikimedia': 'http://se.wikimedia.org/w/api.php',
			'wikimania2014wiki': 'http://wikimania2014.wikimedia.org/w/api.php',
			'wikimania2015wiki': 'http://wikimania2015.wikimedia.org/w/api.php',
			'species': 'http://species.wikimedia.org/w/api.php'
		},

		privateInterwikiMap = {
			'boardwiki': 'https://board.wikimedia.org/w/api.php',
			'collabwiki': 'https://collab.wikimedia.org/w/api.php',
			'legalteamwiki': 'https://legalteam.wikimedia.org/w/api.php',
			'officewiki': 'https://office.wikimedia.org/w/api.php',
			'otrs_wikiwiki': 'https://otrs-wiki.wikimedia.org/w/api.php',
			'wikimaniateamwiki': 'https://wikimaniateam.wikimedia.org/w/api.php',

			'labswiki': 'https://wikitech.wikimedia.org/w/api.php' // Not private but can't use proxy
	};

	for ( dbname in interwikiMap ) {
		parsoidConfig.setInterwiki( dbname, interwikiMap[dbname] );
	}

	for ( dbname in privateInterwikiMap ) {
		// Disable proxying for special wikis
		// TODO: See if we can go direct for some of those too
		parsoidConfig.setInterwiki( dbname, privateInterwikiMap[dbname], null );
	}

	parsoidConfig.usePHPPreProcessor = true;
	parsoidConfig.useSelser = true;
	// parsoid cache url
	parsoidConfig.parsoidCacheURI = 'http://10.2.2.29/';

	// Use the API backends directly without hitting the text varnishes.
	// API requests are not cacheable anyway.
	parsoidConfig.defaultAPIProxyURI = 'http://10.2.2.22';

	// Allow cors as we are only running on non-sensitive domains
	parsoidConfig.allowCORS = '*';

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
};
