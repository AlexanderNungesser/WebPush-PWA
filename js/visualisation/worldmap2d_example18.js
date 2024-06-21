/* 
 * Configuration script for worldmap2d_example18
 */

var worldmap2d_example18_options = {
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
worldmap2d_example18_options.plugins = new Map();
worldmap2d_example18_options.plugins.set('ToggleClickInteractionButton', {
    id: 'toggleclickinteractionbutton',
    active: true
});

worldmap2d_example18_options.plugins.set('Help', {
    id: 'help',
    active: true
});

