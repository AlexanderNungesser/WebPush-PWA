var worldmap2d_example22_options = {
    zoom: 10
};

let modelFile = {
    url: '../../data/worldmap2d/example23/gemeinden_nrw.geojson',
    name: 'My Geojson'
};

document.addEventListener('uiComplete', function () {
    let addBtn = document.querySelector('.worldmap2d_example22_add');
    addBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        console.log('TEST');
        document.querySelector('#worldmap2d_example22').swac_comp.loadModelFile(modelFile);
    });

    let remBtn = document.querySelector('.worldmap2d_example22_rem');
    remBtn.addEventListener('click', function (evt) {
        evt.preventDefault();
        document.querySelector('#worldmap2d_example22').swac_comp.removeModelFile(modelFile.name);
    });
});
