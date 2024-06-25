/* 
 * Configuration script for worldmap2d_example29
 */

window['worldmap2d_example29_options'] = {
    zoom: 16,
    plugins: new Map()
};

window['worldmap2d_example29_options'].plugins.set('CreateObjectModal', {
    id: 'CreateObjectModal',
    active: true
});

window['CreateObjectModal_worldmap2d_example29_options'] = {
    objectRequestor: {
        fromName: 'visualisation/worldmap2d/tbl_observedobject.json'
    },
    locationRequestor: {
        fromName: 'visualisation/worldmap2d/tbl_location.json'
    },
    joinRequestor: {
        fromName: 'visualisation/worldmap2d/tbl_location_join_oo.json'
    },
    typesRequestor: {
        fromName: 'visualisation/worldmap2d/tbl_observedobject_type.json'
    },
    parentRequestor: {
        fromName: 'visualisation/worldmap2d/tbl_observedobject.json'
    }
};