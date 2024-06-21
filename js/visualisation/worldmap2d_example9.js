/* 
 * Configuration script for worldmap2d_example9
 */

var worldmap2d_example9_options = {
    zoom: 20,
    showTimedDataAtOnce: true,
    customIconOptions: {
        iconSize: [60, 60],
        shadowUrl: '../../swac/libs/leaflet/images/marker-shadow.png',
        shadowSize: [60, 60],
        shadowAnchor: [20, 60],
        iconAnchor: [30, 56]
    },
    customIconVisited: {
        iconUrl: '../../swac/libs/leaflet/images/marker_icon_custom_visited.svg'
    },
    customIconUnvisited: {
        iconUrl: '../../swac/libs/leaflet/images/marker_icon_custom_unvisited.svg'
    },
    clusterMarkers: true,
    maxZoom: 18,

    datasources: new Map([
        ['../../data/visualisation/worldmap2d/tbl_observedobject.json', {
            datacapsule: {
                fromName: '../../data/visualisation/worldmap2d/tbl_observedobject.json',
            },
            latitudeAttr: 'tbl_location.coordinates[0]',
            longitudeAttr: 'tbl_location.coordinates[1]',
        }],
    ]),

};

worldmap2d_example9_options.plugins = new Map();
worldmap2d_example9_options.plugins.set('FilterMeasurementPoints', {
    id: 'filtermeasurementpoints',
    active: true
});
worldmap2d_example9_options.plugins.set('Help', {
    id: 'help',
    active: true
});

var filtermeasurementpoints_worldmap2d_example9_options = {
    typeDatasource: '../../data/visualisation/worldmap2d/tbl_observedobject_type.json'
}




