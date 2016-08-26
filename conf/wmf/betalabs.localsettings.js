"use strict";
exports.setup = function(parsoidConfig) {
	parsoidConfig.loadWMF = false;

	parsoidConfig.setMwApi({ prefix: 'aawiki', uri: 'http://aa.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'arwiki', uri: 'http://ar.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'cawiki', uri: 'http://ca.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'commonswiki', uri: 'http://commons.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'dewiki', uri: 'http://de.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'en_rtlwiki', uri: 'http://en-rtl.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwiki', uri: 'http://en.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwikibooks', uri: 'http://en.wikibooks.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwikinews', uri: 'http://en.wikinews.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwikiquote', uri: 'http://en.wikiquote.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwikisource', uri: 'http://en.wikisource.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwikiversity', uri: 'http://en.wikiversity.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwikivoyage', uri: 'http://en.wikivoyage.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'enwiktionary', uri: 'http://en.wikitionary.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'eowiki', uri: 'http://eo.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'eswiki', uri: 'http://es.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'fawiki', uri: 'http://fa.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'hewiki', uri: 'http://he.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'hiwiki', uri: 'http://hi.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'jawiki', uri: 'http://ja.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'kowiki', uri: 'http://ko.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'labs', uri: 'http://deployment.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'loginwiki', uri: 'http://login.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'metawiki', uri: 'http://meta.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'nlwiki', uri: 'http://nl.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'ruwiki', uri: 'http://ru.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'simplewiki', uri: 'http://simple.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'sqwiki', uri: 'http://sq.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'testwiki', uri: 'http://test.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'ukwiki', uri: 'http://uk.wikipedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'wikidatawiki', uri: 'http://wikidata.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'zerowiki', uri: 'http://zero.wikimedia.beta.wmflabs.org/w/api.php' });
	parsoidConfig.setMwApi({ prefix: 'zhwiki', uri: 'http://zh.wikipedia.beta.wmflabs.org/w/api.php' });
	// the production enwiki: a work-around to be able to use the labs parsoid instance from RESTBase
	parsoidConfig.setMwApi({ prefix: 'enwikiprod', uri: 'https://en.wikipedia.org/w/api.php' });

	// Use the PHP preprocessor to expand templates via the MW API (default true)
	parsoidConfig.usePHPPreProcessor = true;

	// Communicate with the ParsoidBatchAPI extension on the MW API side (default false)
	parsoidConfig.useBatchAPI = true;

	// Use selective serialization (default false)
	parsoidConfig.useSelser = true;

	// allow cross-domain requests to the API (default disallowed)
	//parsoidConfig.allowCORS = '*';

	// parsoidConfig.apiProxyURI = 'http://en.wikipedia.org';

	// Sample verbose logs
	parsoidConfig.loggerSampling = [
		['warning/dsr/inconsistent', 5],
		['warning/empty/li', 10],
		['warning/empty/tr', 10],
		[/^warning\/empty\//, 10],
	];
};
