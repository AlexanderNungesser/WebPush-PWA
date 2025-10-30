import WebPush from './../SWAC/swac/WebPush.js';

document.addEventListener('DOMContentLoaded', async (event) => {
    const webpush = new WebPush();

    document.getElementById("subscribe_btn").addEventListener('click', async () => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("✅ Nutzer hat Benachrichtigungen erlaubt");
            const res = await webpush.subscribe();
            console.log("Subscription result:", res);
        } else {
            console.log("❌ Nutzer hat abgelehnt oder Dialog geschlossen");
        }
    });

    document.getElementById("send_btn").addEventListener('click', async () => {
        console.log("Send Test Notification Button pressed");
        webpush.send();
    });
});
