exports.setup = function( parsoidConfig ) {
        // Map from DB name to API URL
        var dbname, interwikiMap = {
                'testwiki': 'http://test.wikipedia.org/w/api.php',
                'test2wiki': 'http://test2.wikipedia.org/w/api.php',

                'sewikimedia': 'http://se.wikimedia.org/w/api.php',

                'boardwiki': 'https://board.wikimedia.org/w/api.php',
                'collabwiki': 'https://collab.wikimedia.org/w/api.php',
                'officewiki': 'https://office.wikimedia.org/w/api.php',
                'wikimaniateamwiki': 'https://wikimaniateam.wikimedia.org/w/api.php',

                'labswiki': 'https://wikitech.wikimedia.org/w/api.php'
        };

        for ( dbname in interwikiMap ) {
                // Disable proxying for special wikis
                // TODO: See if we can go direct for some of those too
                parsoidConfig.setInterwiki( dbname, interwikiMap[dbname], null );
        }

        // tyv and min wikis are missing from the list of known wikipedias
        // in mediawiki.ParsoidConfig.js.  So, adding it here explicitly.
        parsoidConfig.setInterwiki('tyvwiki', 'http://tyv.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('minwiki', 'http://min.wikipedia.org/w/api.php');

        // The following wikis with a hyphen in wikiname aren't probably handled
        // by Parsoid: "-" should be converted to "_" in ParsoidConfig. But, for today,
        // we'll add the following wikis to get VE unbroken on these.
        parsoidConfig.setInterwiki('bat_smgwiki', 'http://bat-smg.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('be_x_oldwiki', 'http://be-x-old.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('cbk_zamwiki', 'http://cbk-zam.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('fiu_vrowiki', 'http://fiu-vro.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('map_bmswiki', 'http://map-bms.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('nds_nlwiki', 'http://nds-nl.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('roa_rupwiki', 'http://roa-rup.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('roa_tarawiki', 'http://roa-tara.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('zh_classicalwiki', 'http://zh-classical.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('zh_min_nanwiki', 'http://zh-min-nan.wikipedia.org/w/api.php');
        parsoidConfig.setInterwiki('zh_yuewiki', 'http://zh-yue.wikipedia.org/w/api.php');

        parsoidConfig.usePHPPreProcessor = true;
        parsoidConfig.useSelser = true;
        // parsoid cache url
        parsoidConfig.parsoidCacheURI = 'http://10.2.2.29/';

        // Use the API backends directly without hitting the text varnishes.
        // API requests are not cacheable anyway.
        parsoidConfig.defaultAPIProxyURI = 'http://10.2.2.22';
};
