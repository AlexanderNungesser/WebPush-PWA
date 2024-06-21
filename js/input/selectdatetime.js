var explaincomponent_options = {
    componentName: 'Selectdatetime'
};

selectdatetime_example2_options = {
    timepicker: false
};

selectdatetime_example3_options = {
    datepicker: false
};

selectdatetime_example4_options = {
    actualTimeForEmpty: true,
    reloadInterval: 5
};

window.onload = function () {
    let example5Btn = document.querySelector('#selectdatetime_example5btn');
    // Avoid error if example is commented out
    if (!example5Btn)
        return;
    example5Btn.addEventListener('click', function (evt) {
        let dtElem = document.querySelector('#selectdatetime_example5');
        console.log(dtElem.swac_comp.data);

        // For example static implemented with given name of source and hardcoded dateset id (1)
        alert('The actual inputted date / time is: ' + dtElem.swac_comp.data['../../data/selectdatetime/exampleDatetimes.json'].getSet(1).datetime);
    });
};