import WebPush from './../../SWAC/swac/WebPush.js';

document.addEventListener('DOMContentLoaded', async (event) => {
    const webpush = new WebPush();

    document.getElementById("send_btn").addEventListener('click', async () => {
        console.log("Send Test Notification Button pressed");
        const res = await webpush.send();
        console.log("Send result:", res);
    });
});
