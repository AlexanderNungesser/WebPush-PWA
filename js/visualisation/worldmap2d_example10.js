/* 
 * Configuration script for worldmap2d_example10
 */

var worldmap2d_example10_options = {
    datasources: new Map([
        ['../../data/visualisation/worldmap2d/tbl_observedobject.json', {
            datacapsule: {
                fromName: '../../data/visualisation/worldmap2d/tbl_observedobject.json',
            },
            latitudeAttr: 'tbl_location.coordinates[0]',
            longitudeAttr: 'tbl_location.coordinates[1]',
        }],
    ]),
    zoom: 18,
    showTimedDataAtOnce: true,
    clusterMarkers: true,
    maxZoom: 18,
};


//add plugin to the worldmap2d component
worldmap2d_example10_options.plugins = new Map();
worldmap2d_example10_options.plugins.set('ToggleClickInteractionButton', {
    id: 'toggleclickinteractionbutton',
    active: true
});
worldmap2d_example10_options.plugins.set('CreateMeasurementModal', {
    id: 'createmeasurementmodal',
    active: true
});

var createmeasurementmodal_worldmap2d_example10_options = {
    typeDatasource: '../../data/visualisation/worldmap2d/tbl_observedobject_type.json',
    datacapsuleLoad: worldmap2d_example10_options.datasources.get('../../data/visualisation/worldmap2d/tbl_observedobject.json').datacapsule,
    // createOoWithLocation: {
    //     fromName: 'observedobject/createWithLocation',
    //     responseIdAttr: 'ooId',
    //     ooName: 'ooName',
    //     ooDescription: 'ooDescription',
    //     ooType: 'ooType',
    //     ooCompleted: 'ooCompleted',
    //     ooCollection: 'ooCollection',
    //     locLatitude: 'locLatitude',
    //     locLongitude: 'locLongitude',
    //     locName: 'locName',
    //     locDescription: 'locDescription',
    // }
}


worldmap2d_example10_options.plugins.set('MapPinModal', {
    id: 'mappinmodal',
    active: true
});

var mappinmodal_worldmap2d_example10_options = {
    table_names : {
        locations_table: {
            table_name: 'tbl_location',
            idAttr: 'id',
            geojsonattr: 'coordinates',
        },
        oo_table: {
            table_name: 'tbl_observedobject',
            idAttr: 'id',
            completed: 'completed',
        },
        file_table: {
            table_name: 'tbl_file',
            idAttr: 'id'
        },
        file_join_oo_table: {
            table_name: 'tbl_file_join_oo',
            idAttr: 'id',
            file_id: 'file_id',
            oo_id: 'oo_id'
        },
        uploadfile_options : {
            uploadTargetURL: '/SmartFile/smartfile/file/map_pictures_Gewaesser',
            docroot: '../../../'
        }
    },
}

worldmap2d_example10_options.plugins.set('Help', {
    id: 'help',
    active: true
});

