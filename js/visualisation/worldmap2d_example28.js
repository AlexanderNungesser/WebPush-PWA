/* 
 * Configuration script for worldmap2d_example99
 */

window['worldmap2d_example28_options'] = {
    zoom: 16,
    plugins: new Map()
};

window['worldmap2d_example28_options'].plugins.set('AreaMarker', {
    id: 'AreaMarker',
    active: true
});

window['AreaMarker_worldmap2d_example28_options'] = {
    datasources: new Map([
        ['tbl_area_view', {
            datacapsule: {
                fromName: 'tbl_area',
                fromWheres: {
                    join: 'tbl_location_join_oo_a,tbl_location'
                },
                idAttr: "id"
            },
        }],
        ['tbl_area', {
            datacapsule: {
                fromName: 'tbl_area'
            },
        }],
        ['tbl_location_join_oo_a', {
            datacapsule: {
                fromName: 'tbl_location_join_oo_a',
                idAttr: 'id'
            },
        }],
        ['tbl_location', {
            datacapsule: {
                fromName: 'tbl_location',
                idAttr: 'id'
            },
        }]
    ]),
};