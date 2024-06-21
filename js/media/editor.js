window['explaincomponent_options'] = {
    componentName: 'Mediaeditor'
};

window['mediaeditor_options'] = {
    showWhenNoData: true,
    usemodal: true,
    plugins: new Map()
};
window['mediaeditor_options'].plugins.set('Mediatags', {
    id: 'Mediatags',
    active: true,
    //TODO move options to plugin
    options: {
        tagsrequestor: {
            fromName: '../data/media/editor/tags_{media.id}.json', // 'tagmedia/listForMedia',
            fromWheres: {
                media_id: '{media.id}'
            }
        },
        tagtypesrequestor: {
            fromName: '../data/media/editor/tagtypes.json', // 'tagtype/listByTargetUseage',
            fromWheres: {
                useage: 'mediaTag'
            }
        }
    }
});
window['mediaeditor_options.plugins'].set('Mediaanalysis', {
    id: 'Mediaanalysis',
    active: true,
    options: {
        analysisrequestor: {
            fromName: '../data/media/editor/analysistags_{media.id}.json' // 'media/getThermalBridges?id={media.id}'
        }
    }
});