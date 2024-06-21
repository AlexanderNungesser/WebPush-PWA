window.onload = function () {
    let btn = document.getElementById('adddatafromref');
    btn.addEventListener('click', function (evt) {
        evt.preventDefault();
        let req = document.getElementById('present_from_reference');
        req.swac_comp.addDataFromReference("ref://../../data/exampledata_list.json?filter=id,gt,3&filter=id,lt,7&storage=smartmonitoring");
    });

    let btn2 = document.getElementById('adddatafromjsobj');
    btn2.addEventListener('click', function (evt) {
        evt.preventDefault();
        let req = document.getElementById('present_from_jsobjects');
        let datasets = [{
                name: 'Testvalue 1',
                value: 12.2
            },
            {
                name: 'Testvalue 2',
                value: 24.4
            }];
        req.swac_comp.addData('myCustomSource', datasets);
    });
};