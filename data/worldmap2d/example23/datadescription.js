/* 
 * Datasource for the datadescription component example
 */

var worldmap2d_datadescription_example23 = {
    BEZ: {
        txt_title: 'Bezeichnung',
        txt_desc: 'Stadt oder Gemeinde',
        txt_uknw: 'unknown',
        col: '#7B7B7B',
        values: {
            'Stadt': {
                txt: 'Stadt',
                col: '#FF7F50'
            },
            'Gemeinde': {
                txt: 'Gemeinde',
                col: '#7FFFD4'
            }
        }
    },
    'destatis.population': {
        txt_title: 'Bevölkerung',
        txt_desc: 'Anzahl Einwohner',
        txt_uknw: 'unknown',
        col: '#7B7B7B',
        calcmode: '<',
        values: {
            '250000': {
                txt: 'unter 250.000 Einwohner',
                col: '#2AAD27'
            },
            '500000': {
                txt: '250.000 bis 500.000 Einwohner',
                col: '#FFD326'
            },
            '1000000': {
                txt: '500.000 bis 1.000.000 Einwohner',
                col: '#CB2B3E'
            }
        }
    }
};
