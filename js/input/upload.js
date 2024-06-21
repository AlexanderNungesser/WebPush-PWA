var explaincomponent_options = {
    componentName: 'Upload'
};

window['upload_example1_options'] = {
    uploadTargetURL: '../../data/input/upload/exampletarget.json' // This is the url where files should be send to
};

window['upload_example2_options'] = {
    uploadTargetURL: '../../data/input/upload/exampletarget.json',
    dataComponents: [
        {
            selector: '#example2_select',
            sendAttribute: 'selection',
            required: true,
            requiredMessage: 'Please choose a target',
            requiredGt: 0,
            requiredGtMessage: 'The target must be greater than 0.'
        },
        {
            selector: '#example2_name'
        },
        {
            selector: '#example2_email'
        },
        {
            selector: '#example2_message'
        }
    ]
};

window['upload_example3_options'] = {
    uploadTargetURL: 'http://localhost/media/upload.php',
    uploadresultcollection: 'upload_result', // Name of the target where to save data. If omitted the save button is not displayed.
    definitions: new Map()
};
window['upload_example3_options'].definitions.set("upload_result", [
    {
        name: 'id',
        type: 'int8',
        isNullable: false,
        isIdentity: true,
        isAutoIncrement: true,
        defaultvalue: 'nextval()',
        generated: true
    }, {
        name: 'filename',
        type: 'varchar',
        generated: true
    },{
        name: 'title',
        type: 'varchar',
        isNullable: false
    },
    {
        name: 'year',
        type: 'int4'
    }
]);