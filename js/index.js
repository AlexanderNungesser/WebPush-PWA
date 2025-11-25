import WebPush from './../SWAC/swac/WebPush.js';

document.addEventListener('DOMContentLoaded', async (event) => {
    const webpush = new WebPush();

    document.getElementById("permission_container").style.display = 'block';

    const handlePermissionClick = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("✅ Nutzer hat Benachrichtigungen erlaubt");
                const res = await webpush.subscribe();
                console.log("Subscription result:", res);
            } else {
                console.log("❌ Nutzer hat abgelehnt oder Dialog geschlossen");
            }
        } catch (err) {
            console.error("Fehler bei Permission/Subscription:", err);
        } finally {
            document.getElementById("permission_container").style.display = 'none';
        }
    };

    document.getElementById("allow").addEventListener('click', handlePermissionClick);
    document.getElementById("deny").addEventListener('click', handlePermissionClick);

    document.getElementById("send_btn").addEventListener('click', async () => {
        console.log("Send Test Notification Button pressed");
        const res = await webpush.send();
        console.log("Send result:", res);
    });
});
