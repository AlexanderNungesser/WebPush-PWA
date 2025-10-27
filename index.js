import WebPush from './../SWAC/swac/WebPush.js';

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("Loaded");
    document.getElementById("subscribe_btn").addEventListener('click', async () => {
        console.log("Button pressed");
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            console.log("✅ Nutzer hat Benachrichtigungen erlaubt");
            const webpush = new WebPush();
            webpush.subscribe();
        } else {
            console.log("❌ Nutzer hat abgelehnt oder Dialog geschlossen");
        }
    });
});
