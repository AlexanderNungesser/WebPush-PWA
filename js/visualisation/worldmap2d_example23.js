var worldmap2d_example23_options = {
    zoom: 10,
    modelFiles: [
        {
            url: '../../data/worldmap2d/example23/gemeinden_nrw.geojson',
            name: 'Gemeinden NRW',
            datadescription: '#wordldmap2d_datadescription_example23',  // Id of the datadescription component
            datacaptionProperty: 'GEN', // Name of the properties attribute that contains the caption for that area
            fillColorProperty: 'destatis.population',   // Name of the properties attribute that contains the value to distinguish between area colors
            fillColor: '0x67ADDFFF',    // Default color of models (white if no setting is given)
            outlineColorProperty: 'BEZ',   // Name of the properties attribute that contains the value to distinguish between border colours
            outlineColor: 'blue',       // Default color of models border (black if no setting is given)
            outlineWidth: 2, // Width of the outline (1 if no setting is given)
            zoomTo: true
        }
    ]
};