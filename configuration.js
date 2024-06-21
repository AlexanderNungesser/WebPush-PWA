/* 
 * This is the main configuration file for SWAC documentation.
 * 
 * You should only change values in these file for your setup. No need to
 * modify other files.
 */

var SWAC_config = {
    lang: 'de',
    notifyDuration: 5000,
    offlineNotify: true,
    debugmode: true,
    debug: '',
    app_root: '/SWACdoc',
    globalparams: {
        exampleglobal: 2
    },
    startuptests: [
        //'/test.txt'
    ],
    datasources: [
        // Use files in the directory as datasource
        {
            url: "/SWACdoc/data/[fromName]"
        },
        // Used for SmartData REST data sources
//        {
//            url: "/SmartData/smartdata/[iface]/[fromName]?storage=smartmonitoring",
//            interfaces: {
//                get: ['GET', 'records'],
//                list: ['GET', 'records'],
//                defs: ['GET', 'collection'],
//                cdefs: ['POST', 'collection'],
//                create: ['POST', 'records'],
//                update: ['PUT', 'records'],
//                delete: ['DELETE', 'records']
//            }
//        }
    ],
    // Activate for corsavoid mode, see documentation for details
//    corsavoidurl: 'http://localhost:8080/SmartFile/smartfile/file/download?filespace=map_pictures_Gewaesser&url=%url%',
    intallable: true,
    progressive: {
        active: false,
        supportpush: false,
        // Add custom files here that are not cached automatically
        cachefiles: [
            '/SWAC/jpars/Jpars.html'
        ]
    },
    onlinereactions: [
//    {
//      path: SWAC_config.swac_root + '/swac/components/Upload/UploadOnReact.js',
//      config: {}
//    }
    ]
};

/**
 * Options for swac_user component
 * Used on every page
 */
var user_options = {
    loginurl: '../data/userinterface//user/exampleuserdata.json',
    afterLoginLoc: '../sites/user_example1.html',
    afterLogoutLoc: '../sites/user.html',
    loggedinRedirects: new Map()
};
user_options.loggedinRedirects.set('user_example3.html', '../sites/user_example2.html');

// Links for footer navigation
var footerlinks = [
    {id: 1, rfrom: "*", rto: "datenschutz.html", name: "Datenschutzerklärung"},
    {id: 2, rfrom: "*", rto: "impressum.html", name: "Impressum"},
    {id: 3, rfrom: "*", rto: "haftung.html", name: "Haftungsausschluss"},
    {id: 4, rfrom: "*", rto: "http://git01-ifm-min.ad.fh-bielefeld.de/scl/2015_03_SCL_SmartMonitoring_Frontend/wikis/home", name: "Über SmartMonitoring"}
];

var swac_devhelper_options = {
    showNoDataInfo: false
};
