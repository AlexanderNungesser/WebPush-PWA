let serviceworker_version = 'a4';
// Import configuration
self.importScripts('configuration.js');
//import localforage lib, this libs provides an api for easy key-value indexedDB access
self.importScripts('/SWAC/swac/libs/localforage/localforage.min.js');

// Configuration storage
self.config = {};

self.precachedfiles = [];
self.precachedcomponents = [];

/**
 * event listener for the install event
 */
self.addEventListener('install', function (evt) {
    console.log('SWAC serviceworker is installing...');

    // Precache SWAC needed files
    precacheFiles([
        'configuration.js',
        '/favicon.ico',
        '/SWAC/swac/swac.js',
        '/SWAC/swac/libs/uikit/js/uikit.min.js',
        '/SWAC/swac/libs/uikit/css/uikit.min.css',
        '/SWAC/swac/libs/uikit/js/uikit-icons.min.js',
        '/SWAC/swac/Msg.js',
        '/SWAC/swac/Language.js',
        '/SWAC/swac/ViewHandler.js',
        '/SWAC/swac/OnlineReactions.js',
        '/SWAC/swac/Reactions.js',
        '/SWAC/swac/Reactions.js',
        '/SWAC/swac/Model.js',
        '/SWAC/swac/ComponentHandler.js',
        '/SWAC/swac/Remote.js',
        '/SWAC/swac/WatchableSet.js',
        '/SWAC/swac/WatchableSource.js',
        '/SWAC/swac/swac.css',
        '/SWAC/swac/langs/de.js',
        '/SWAC/swac/langs/en.js',
        '/SWAC/swac/offline/sites/offline.html',
        '/SWAC/swac/offline/js/offline.js',
        '/SWAC/swac/offline/js/offlineComp.js',
        '/SWAC/swac/offline/data/offline.json',
        '/SWAC/swac/offline/content/offline.avif',
        '/SWAC/swac/offline/content/offline.webp',
        '/SWAC/swac/offline/content/offline.png',
        '/SWAC/swac/offline/content/offline.jpg'
    ]);
});

/*
 * Caches the files given.
 *
 * @param {String[]} files contains the paths to the files
 * @param {boolean} if set to true
 */
function precacheFiles(files) {
    console.log('ServiceWorker: precacheFiles()', files);

    return new Promise((resolve, reject) => {
        //Open cache to put files into
        caches.open('swac_sw_cache_' + serviceworker_version).then(function (cache) {
            let cacheProms = [];
            for (let curFile of files) {
                // Jump over undefined (maybe deactivated) file entries
                if (!curFile || self.precachedfiles.includes(curFile))
                    continue;
                console.log('ServiceWorker: Precache file', curFile);

                let request = new Request(curFile);
                let fileCacheProm = cache.add(curFile);
                cacheProms.push(fileCacheProm);
                fileCacheProm.then(function (res) {
                    self.precachedfiles.push(curFile);
                    let storedate = new Date().getTime();
                    //safe url of request with timestamp of current date in indexedDB
                    localforage.setItem(request.url.toString(), storedate);
                    // Inform program
                    sendMessageToPages('{"type":"cached","url":"' + request.url + '"}', false);
                });
                fileCacheProm.catch(function (error) {
                    console.error('ServiceWorker: Could not precache file >' + curFile + '<: ' + error);
                });
            }
            Promise.all(cacheProms).then(function () {
                resolve();
            }).catch(function (error) {
                console.error('ServiceWorker: Error while precacheing: ' + error);
                reject();
            });
        }).catch(function (error) {
            console.error('ServiceWorker: Error while precacheing: ' + error);
        });
    });
}

async function checkPrecacheFile(msg) {
    console.log('ServiceWorker: checkPrecacheFile() >' + msg.url + '<');
    let c = await caches.open('swac_sw_cache_' + serviceworker_version);

    let request = new Request(msg.url);
    let responseFromCache = await c.match(request);
    if (responseFromCache) {
        sendMessageToPages('{"type":"cached","url":"' + msg.url + '","setid": ' + msg.setid + '}', false);
    } else {
        sendMessageToPages('{"type":"notcached","url":"' + msg.url + '","setid": ' + msg.setid + '}', false);
    }
}

/**
 * Precaches a complete SWAC component for offline use
 *
 * @param {String} componentName Components name
 * @returns {undefined}
 */
async function precacheComponent(componentName) {
    if (self.precachedcomponents.includes(componentName))
        return;
    self.precachedcomponents.push(componentName);
    console.log('ServiceWorker: precacheComponent()', componentName);
    let component_root = '/SWAC/swac/components/' + componentName + '/';
    let component_url = component_root + componentName + '.js';
    // Include main script
    try {
        // Get component code for analysis
        let resp = await fetch(component_url);
        let compCode = await resp.text();
        // Initilise array for found styles and dependencies
        let prefiles = [];

        // Component class
        prefiles.push(component_url + '?ver=' + self.config.swac_version);

        // Find templates
        let tplMatches = compCode.match(/this.desc.templates([\s\S]*?);/g);
        if (tplMatches) {
            let tplInst;
            for (let curMatch of tplMatches) {
                let parts = curMatch.split('=');
                eval('tplInst = ' + parts[1]);
                prefiles.push(component_root + tplInst.name + '.html');
                if (tplInst.style)
                    prefiles.push(component_root + tplInst.style + '.css');
            }
        }

        // Find dependencies
        compCode = compCode.replace('SWAC.config.swac_root', '/SWAC/swac/');
        let depMatches = compCode.match(/this.desc.depends([\s\S]*?);/g);
        if (depMatches) {
            let depInst;
            for (let curMatch of depMatches) {
                let parts = curMatch.split('=');
                eval('depInst = ' + parts[1]);
                prefiles.push(depInst.path);
            }
        }

        // Add language file
        let activeLang = navigator.language || navigator.userLanguage;
        let bindStrPos = activeLang.indexOf('-');
        if (bindStrPos > 0) {
            activeLang = activeLang.substring(0, bindStrPos);
        }
        prefiles.push(component_root + 'langs/' + activeLang + '.js');
        precacheFiles(prefiles);
    } catch (e) {
        console.error('ServiceWorker: Failed to precache component >' + componentName + '<:', e);
    }
}

function precacheSWACVersion(version) {
    precacheFiles([
        '/SWAC/swac/langs/de.js?vers=' + version,
        '/SWAC/swac/langs/en.js?vers=' + version
    ]);
}

async function precachePage(url, level = 0, basePath) {
    console.log('ServiceWorker: precachePage()', url);
    // Get page content
    if (basePath)
        url = basePath + '/' + url;
    const response = await fetch(url);
    if (response.status >= 400) {
        console.error('ServiceWorker: Could not precache page >' + url + '< HTTP status: ' + response.status);
        return;
    }

    let absBaseDir;
    if (url.startsWith('http://') || url.startsWith('https://'))
        absBaseDir = url.substring(0, url.lastIndexOf('/')) + '/';
    else if (basePath)
        absBaseDir = basePath + '/' + url.substring(0, url.lastIndexOf('/')) + '/';
    else {
        console.err('ServiceWorker: Could not get absBaseDir for >' + url + '<');
    }

    const content = await response.text();

    // Search urls and cache refered contents
    try {
        let urlMatches = content.match(/(src|href)="[/]?([^"]+)"/g);

        let urls = [url];
        for (let curMatch of urlMatches) {
            let url = curMatch.replace('href="', '').replace('src="', '').replace('"', '');
            // Exclude urls with placeholders from cacheing
            if (url.includes('{') && url.includes('}'))
                continue;
            // Exclude site references, http urls and SWAC internal urls from caching
            if (url.startsWith('#') || url.startsWith('https://') || url.startsWith('http://') || url.startsWith('/SWAC/swac/'))
                continue;
            // Do not precache big files automatically
            if (url.endsWith('.mp3')) {
                continue;
            }

            try {
                url = new URL(url, absBaseDir).href;
            } catch (err) {
                console.error("ServiceWorker: Error parsing url: >" + url + '<', err);
                return null;
            }

            if (url.endsWith('.html') && level === 0) {
                precachePage(url, level + 1);
                continue;
            } else if (url.endsWith('.html')) {
                // Do not load sub sub pages
                continue;
            }
            // Add url to list of precache urls
            urls.push(url);
        }
        // precache files
        precacheFiles(urls);
    } catch (e) {
        console.error('ServiceWorker: Error precaching page >' + url + '<', e);
    }

    // Search components and precache them
    let swaMatches = content.match(/swa="[/]?([^"]+)"/g);
    for (let curSWA of swaMatches) {
        try {
            curSWA = curSWA.replace('swa="', '').replace('"', '');
            // Get datasource clause
            let fromPos = curSWA.indexOf(' FROM ');

            if (fromPos > 0) {
                let curSWAName = curSWA.substring(0, fromPos);
                try {
                    precacheComponent(curSWAName);
                } catch (e) {
                    console.error('ServiceWorker: Error precaching component >' + curSWAName + '< for page >' + url + '<', e);
                }

                let fromSub = curSWA.substring(fromPos + 6);
                let fromEndPos = fromSub.indexOf(' ');
                if (fromEndPos < 0)
                    fromEndPos = fromSub.length;
                let curSWAFrom = fromSub.substring(0, fromEndPos);
                let curSource;
                // Check if is absolute url
                if (curSWAFrom.startsWith('/') || url.startsWith('https://') || url.startsWith('http://')) {
                    // Absolute URLs are not searched in datasources
                    precacheFiles([curSource]);
                    continue;
                }

                // Check if datasource is available
                if (!curSWAFrom.startsWith('../')) {
                    for (let curSourceTpl of SWAC_config.datasources) {
                        let testurl = curSourceTpl.url.replace('[fromName]', curSWAFrom);
                        if (curSourceTpl.interfaces && curSourceTpl.interfaces.get) {
                            testurl = testurl.replace('[iface]', curSourceTpl.interfaces.get);
                        }
                        let resp = await fetch(testurl, {method: "HEAD"});
                        if (resp.status < 400) {
                            curSource = testurl;
                            break;
                        }
                    }
                }

                // If there are no sources or they are not matching try plain url
                if (!curSource) {
                    if (basePath !== '')
                        curSWAFrom = basePath + '/' + curSWAFrom;
                    curSource = curSWAFrom;
                }

                let resp = await fetch(curSource, {method: "HEAD"});
                if (resp.status < 400) {
                    precacheFiles([curSource]);
                } else {
                    console.warn('ServiceWorker: Do not precache source >' + curSource + '< for page >' + url + '< maybe a variable or is not found.');
                }
            }
        } catch (e) {
            console.error('TEST ERROR ', e);
        }

}
}

function precacheFilesFromConfig(files) {
    console.log('ServiceWorker: Try to cache files from configuration', files);
    // Cache files from configuration
    if (files && files.length > 0) {
        console.log('ServiceWorker: Cache files from configuration', files);
        precacheFiles(files);
    } else {
        console.log('ServiceWorker: There are no files in configuration.js to precache.');
    }
}

/**
 * event listener for the activate event, in this event the cache is cleand from
 * files older then DELETIONTIME
 */
self.addEventListener('activate', function (evt) {
    console.log('Serviceworker activate', evt);
    clients.claim();
    // Clear outdated caches
    caches.keys().then(function (names) {
        for (let name of names) {
            if (name !== 'swac_sw_cache_' + serviceworker_version)
                caches.delete(name);
        }
    });
});

/**
 * EventListener for the fetch event, provides a response to the request either
 * from network of cache, then updates the cache and then safes the cache date
 */
self.addEventListener('fetch', function (evt) {
    console.log('ServiceWorker: Fetch >' + evt.request.url + '<');

    // Do not cache POST requests
    if (evt.request.method === 'POST')
        return;
    try {
        // Determine fetch mode
        let fetchMode = 'network';
        if (Date.now() - this.failedNetworkTime < 5000) {
            fetchMode = 'cache';
        }
        if (evt.request.url.endsWith('.mp3')) {
            fetchMode = 'cache';
        }

        let o;
        if (fetchMode === 'cache') {
            o = firstFromCacheThenNetwork(evt.request);
        } else {
            o = firstFromNetworkThenCache(evt.request);
        }

        try {
            evt.respondWith(o);
        } catch (e) {
            console.error('Errror respondWith for ' + evt.request.url);
        }
    } catch (e) {
        console.error('ServiceWorker: Error handling fetch: ' + e);
    }
});

/**
 * Tries to get the request from cache first, if this fails tries to geht the
 * request from networt if this fails too a fallback will be delivered.
 *
 * @param {HTTPRequest} request
 * @returns {unresolved}
 */
async function firstFromCacheThenNetwork(request) {
    console.log('ServiceWorker: firstFromCacheThenNetwork() >' + request.url + '<');
    let c = await caches.open('swac_sw_cache_' + serviceworker_version);

    let responseFromCache = await c.match(request);
    if (responseFromCache) {
        console.log('ServiceWorker: got >' + request.url + '< from cache.');
        return responseFromCache;
    }

    try {
        const responseFromNetwork = await fetch(request.clone());
        // Cache file if status ok
        if (responseFromNetwork.ok) {
            console.log('ServiceWorker: got >' + request.url + '< fresh from network with stauts: ' + responseFromNetwork.status);
            if (responseFromNetwork.status !== 206)
                putToCache(request, responseFromNetwork.clone());
            return responseFromNetwork;
        } else if (responseFromNetwork.type === 'opaque') {
            console.log('ServiceWorker: Got opaque response for >' + request.url + '<.');
            return responseFromNetwork;
        }
    } catch (err) {
        console.log('ServiceWorker: Did not found >' + request.url + '< from cache or network. Try use fallback.');
        const responseFromFallback = await useFallback(request);
        if (responseFromFallback)
            return responseFromFallback;
    }

    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    console.log('ServiceWorker: Did not found >' + request.url + '< from cache or network. And there is no fallback.');
    return new Response('Network error happened', {
        status: 408,
        headers: {'Content-Type': 'text/plain'}
    });
}

/**
 * Tries to get the request from network if this fails tries to get the request
 * from cache, if this fails too a fallback will be delivered
 *
 * @param {HTTPRequest} request
 * @returns {unresolved}
 */
async function firstFromNetworkThenCache(request) {
    console.log('ServiceWorker: firstFromNetworkThenCache() >' + request.url + '<');

    try {
        const responseFromNetwork = await fetch(request.clone());
        console.log('ServiceWorker: got >' + request.url + '< fresh from network with status: ' + responseFromNetwork.status);
        if (responseFromNetwork.status !== 206)
            putToCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (err) {
        console.log('ServiceWorker: Could not get >' + request.url + '< from network try from cache.');
        this.failedNetworkTime = Date.now();
        let c = await caches.open('swac_sw_cache_' + serviceworker_version);
        let responseFromCache = await c.match(request);
        if (responseFromCache) {
            console.log('ServiceWorker: got >' + request.url + '< from cache instead of network.');
            return responseFromCache;
        }
        console.log('ServiceWorker: Did not found >' + request.url + '< from cache or network.');
        // Use fallback
        const responseFromFallback = await useFallback(request);
        if (responseFromFallback)
            return responseFromFallback;

        // when even the fallback response is not available,
        // there is nothing we can do, but we must always
        // return a Response object
        return new Response('Network error happened', {
            status: 408,
            headers: {'Content-Type': 'text/plain'}
        });
    }
}

/**
 * Safes the requests response in the service worker cache
 *
 * @param {Request} request Original Request to cache answer for
 * @param {Response} response Response of the request to put in cache
 * @returns {Promise}  Promise that resolves with void
 */
async function putToCache(request, response) {
    console.log('ServiceWorker: putToCache() >' + request.url + '<');
    let c = await caches.open('swac_sw_cache_' + serviceworker_version);
    //get current date
    var d1 = new Date();
    //safe url of request with timestamp of current date
    localforage.setItem(request.url.toString(), d1.getTime());
    await c.put(request, response);
    // Inform program
    sendMessageToPages('{"type":"cached","url":"' + request.url + '"}', false);
}

/**
 * provides a fallback html site from the service worker cache
 *
 * @param {HTTPRequest} request Request that can't be fullfilled
 * @returns {Promise} Promise that resolves to the first Response that
 *  matches the request or to undefined if no match is found
 */
async function useFallback(request) {
    console.log('ServiceWorker: useFallback() for >' + request.url + '<');
    let plainURL;
    let paramStartPos = request.url.indexOf('?');
    if (paramStartPos > 0) {
        plainURL = request.url.substring(0, paramStartPos);
    } else {
        plainURL = request.url;
    }

    // Determine which fallback should be used
    let fallbackURL;
    if (plainURL.endsWith('.html')) {
        fallbackURL = '/SWAC/swac/offline/sites/offline.html';
    } else if (plainURL.includes('swac/components')) {
        fallbackURL = '/SWAC/swac/offline/js/offlineComp.js';
    } else if (plainURL.endsWith('.js')) {
        fallbackURL = '/SWAC/swac/offline/js/offline.js';
    } else if (plainURL.endsWith('.json')) {
        fallbackURL = '/SWAC/swac/offline/data/offline.json';
    } else if (plainURL.endsWith('.avif')) {
        fallbackURL = '/SWAC/swac/offline/content/offline.avif';
    } else if (plainURL.endsWith('.webp')) {
        fallbackURL = '/SWAC/swac/offline/content/offline.webp';
    } else if (plainURL.endsWith('.png')) {
        fallbackURL = '/SWAC/swac/offline/content/offline.png';
    } else if (plainURL.endsWith('.jpg')) {
        fallbackURL = '/SWAC/swac/offline/content/offline.jpg';
    } else {
        // Other data resources
        for (let curSource of SWAC_config.datasources) {
            let curSourceMain = curSource.url.replace('[fromName]', '');
            if (request.url.includes(curSourceMain)) {
                fallbackURL = '/SWAC/swac/offline/offline.json';
                break;
            }
        }
    }
    // No html, js, json or registerd datasource requested
    if (!fallbackURL) {
        fallbackURL = '/SWAC/swac/offline/offline.html';
    }
    var fallbackRequest = new Request(fallbackURL);

    let c = await caches.open('swac_sw_cache_' + serviceworker_version);
    let response = await c.match(fallbackRequest);
    if (response)
        console.log('ServiceWorker: Delivering fallback: >' + fallbackURL + '< for request >' + request.url + '<');
    return response;
}

/**
 * Sends a message to the open pages
 *
 * @param {String} msg  Message to send
 * @param {bollean} toFocused If true (default) message is only send to active tab
 * @returns {undefined}
 */
function sendMessageToPages(msg, toFocused = true) {
    console.log('ServiceWorker: sendMessageToPages', msg);
    // Get available clients (pages)
    clients.matchAll({
        includeUncontrolled: true
    }).then(function (clients) {
        for (let curClient of clients) {
            if (!toFocused || curClient.focused) {
                console.log('ServiceWorker: Send message >' + msg + '< to >' + curClient.url + '<', curClient);
                curClient.postMessage(msg);
            }
        }
    });
}

/**
 * Called when a push notification is coming in
 * 
 * @param {PushNotificationEvent} evt Event with push notification data
 */
self.addEventListener('push', function (evt) {
    console.log('ServicewWrker: Recived push message', evt);
    // Show notification to user
    var options = event.data.json();
    evt.waitUntil(self.registration.showNotification(options.title, options));
});

// Below for future use
self.addEventListener('notificationclick', function (evt) {
    console.log('Serviceworker notificationclick event!');
});

self.addEventListener('notificationclose', function (evt) {
    console.log('Serviceworker notificationclose event!');
});

self.addEventListener('sync', function (evt) {
    console.log('Serviceworker sync event!');
});

self.addEventListener('canmakepayment', function (evt) {
    console.log('Serviceworker canmakepayment event!');
});

self.addEventListener('paymentrequest', function (evt) {
    console.log('Serviceworker paymentrequest event!');
});

self.addEventListener('message', function (evt) {
    console.log('ServiceWorker: Recived message: ' + evt.data);
    let msgdata;
    try {
        msgdata = JSON.parse(evt.data);
    } catch (e) {
        console.error('ServiceWorker: Error parsing message', e);
    }

    try {
        switch (msgdata.action) {
            case 'setAppRoot':
                self.config.app_root = msgdata.value;
                break;
            case 'setCacheFiles':
                precacheFilesFromConfig(msgdata.value);
                break;
            case 'cacheSWACVersion':
                self.config.swac_version = msgdata.value;
                precacheSWACVersion(msgdata.value);
                break;
            case 'cacheEnterPage':
                precachePage(msgdata.value);
                break;
            case 'checkCacheFile':
                checkPrecacheFile(msgdata);
                break;
            case 'cacheFile':
                precacheFiles([msgdata.value]);
                break;
            default:
                console.log('ServiceWorker: Unknown message action >' + msgdata.action + '<');
        }
    } catch (e) {
        console.error('ServiceWorker: Error executing message action:', e);
    }
});

self.addEventListener('messageerror', function (evt) {
    console.log('Serviceworker messageerror event!');
}
);