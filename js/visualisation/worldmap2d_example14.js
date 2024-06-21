/* 
 * Configuration script for worldmap2d_example13
 */
window['worldmap2d_example14_options'] = {
    zoom: 17,
    datadescription: '#wordldmap2d_datadescription_example14',
    plugins: new Map()
};
window['worldmap2d_example14_options'].plugins.set('DataShowModal', {
    id: 'DataShowModal',
    active: true
});
window["DataShowModal_worldmap2d_example14_options"] = {
    attrsShown: ['measuredate', 'pm10', 'pm25', 'temperature','latitude'],
    attrsFormat: new Map()
};
// Formating instructions for values
window["DataShowModal_worldmap2d_example14_options"].attrsFormat.set('measuredate','datetime');

window["wordldmap2d_datadescription_example14_options"] = {
    visuAttribute: 'pm10',
    predefinedColors: ['#2A81CB', '#2AAD27', '#3D3D3D', '#7B7B7B', '#9C2BCB', '#CAC428', '#CB2B3E', '#CB8427', 'FFD326'],
};