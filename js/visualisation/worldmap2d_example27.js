/* 
 * Configuration script for worldmap2d_example27
 */
var worldmap2d_example27_options = {
    modelFiles: [
        {
            url: '../../data/visualisation/worldmap2d/example27/polygon1.geojson',
            name: 'Polygon 1'
        },
        {
            url: '../../data/visualisation/worldmap2d/example27/polygon2.geojson',
            name: 'Polygon 2'
        },
        {
            url: '../../data/visualisation/worldmap2d/example27/polygon3.geojson',
            name: 'Polygon 3'
        },
        {
            url: '../../data/visualisation/worldmap2d/example27/polygon4.geojson',
            name: 'Polygon 4'
        },
        {
            url: '../../data/visualisation/worldmap2d/example27/polygon5.geojson',
            name: 'Polygon 5'
        }
    ],
    plugins: new Map()
};

worldmap2d_example27_options.plugins.set('Interpolator', {id: 'Interpolator', active: true});

window["Interpolator_worldmap2d_example27_options"] = {
    attrsShown: ['temp', 'cloudy']
};