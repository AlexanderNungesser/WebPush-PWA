window['example2_options'] = {
    timeToReanswer: 1,
    afterSaveTxt: 'Thank you for your input!'
};
// Immediately call the save function
window['example2_options'].afterInputFunction = function(evt) {
    // Get requestor
    let requestor = document.querySelector('#question_example2');
    requestor.swac_comp.onSend(evt);
};