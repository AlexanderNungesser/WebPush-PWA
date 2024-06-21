/* 
 * Configuration script for worldmap2d_example6
 */
var worldmap2d_example8_options = {
    zoom: 18,
    showTimedDataAtOnce: true,
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
