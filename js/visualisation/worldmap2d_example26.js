var worldmap2d_example26_options = {
    zoom: 10,
    modelFiles: [
        {
            name: 'myapicall',
            url: 'https://api.openweathermap.org/data/2.5/box/city?bbox={lon-left},{lat-bottom},{lon-right},{lat-top},{zoom}&appid=e73cd8846a9717b9dae144bd44694677',
            type: 'geojson',
            transformer: 'OpenWeatherMapTransformer',
            datacaptionProperty: 'name',
            iconBasePath: 'https://openweathermap.org/img/wn/{iconProp}@2x.png',
            iconProperty: 'weather_icon',
            iconRotateProperty: 'wind_deg',
            iconAnimationName: 'worldmap2d_moveanimation',
            iconAnimationSpeed: '30 - {wind_speed}/2'
        }

    ]
};