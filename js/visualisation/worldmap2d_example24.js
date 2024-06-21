/* 
 * Configuration script for worldmap2d_example15
 */
window['worldmap2d_example24_options'] = {
    zoom: 17,
    modelFiles: [
        {
            url: '../../data/worldmap2d/example23/gemeinden_nrw.geojson',
            name: 'Gemeinden NRW 1',
            datadescription: '#wordldmap2d_datadescription_example23',
            datacaptionProperty: 'GEN',
            fillColorProperty: 'destatis.population',
            fillColor: '0x67ADDFFF',
            outlineColorProperty: 'BEZ',
            outlineColor: 'blue',
            outlineWidth: 2,
            swac_from: '2023-02-01T09:03:00',   // Show from this timepoint
            swac_until: '2023-02-01T09:06:00',  // Show until this timepoint
            zoomTo: true
        },
        {
            url: '../../data/worldmap2d/example23/gemeinden_nrw.geojson',
            name: 'Gemeinden NRW 2',
            datadescription: '#wordldmap2d_datadescription_example23',
            datacaptionProperty: 'GEN',
            fillColorProperty: 'destatis.population_m',
            fillColor: '0x67ADDFFF',
            outlineColorProperty: 'BEZ',
            outlineColor: 'blue',
            outlineWidth: 2,
            swac_from: '2023-02-01T09:07:00',   // Show from this timepoint
            swac_until: '2023-02-01T09:10:00',  // Show until this timepoint
            zoomTo: true
        }
    ],
    plugins: new Map()
};
window['worldmap2d_example24_options'].plugins.set('Timeline', {
    id: 'Timeline',
    active: true
});

window['Timeline_worldmap2d_example24_options'] = {
    tsAttr: 'measuredate', // Name of the attribute that contains time data
    startTS: new Date('2023-02-01T08:59:00'),   // Timepoint to start timeline with
    endTS: new Date('2023-02-01T09:15:00'),     // Timepoint to end timeline with
    animationStepSize: 60,                      // Every animation step is 60 seconds father
    animationSpeed: 1000,                       // Every second a new animation step
    animationTimeRange: 30                      // Show data from 30 seconds before and after the animation time point
};