import WebPush from './../../SWAC/swac/WebPush.js';

document.addEventListener('swac_components_complete', async (event) => {
    askNotificationPermission();
    loadGroups();
    document.getElementById("loginForm").addEventListener("submit", (event) => { login(event) })
});


function askNotificationPermission() {
    if (Notification.permission === "granted") {
        checkSubscription();
        return;
    }
    document.getElementById("permission_popup").style.display = 'block'
    document.getElementById("allow").addEventListener('click', handlePermissionClick);
    document.getElementById("deny").addEventListener('click', handlePermissionClick);
}

async function handlePermissionClick() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("✅ User agreed to notifications");
            checkSubscription();
        } else {
            console.log("❌ User disagreed to notifications");
        }
    } catch (err) {
        console.error("Error at permission/subscription:", err);
    } finally {
        document.getElementById("permission_popup").style.display = 'none';
    }
}

async function checkSubscription() {
    const webpush = new WebPush();
    const id = await webpush.subscribe().then(data => data.id);
    localStorage.setItem("user_member_id", id);
    const response = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/group_member/?storage=gamification&filter=member_id,eq,${id}`);
    if (!response.ok) {
        throw new Error("Serverfehler: " + response.status);
    }
    const data = await response.json();
    if (data.records.length == 0) {
        document.getElementById("loginform_wrapper").classList.remove("hidden");
        document.getElementById("loading_screen").classList.add("hidden");
    } else {
        localStorage.setItem("user_group_id", data.records[0].id);
        window.location.assign(`${window.location.origin}/WebPush-PWA/sites/leaderboard.html`);
    }
}

async function loadGroups() {
    const sel = document.getElementById("selectGroup");
    try {
        const response = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/groups?storage=gamification`);

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        for (const group of data.records) {
            const opt = document.createElement("option");
            opt.value = group.id;
            opt.textContent = group.name;
            sel.appendChild(opt);
        }

    } catch (error) {
        console.error("Error loading groups:", error);
    }
}

async function login(event) {
    event.preventDefault();
    const formData = new FormData(event.target)
    const member_id = localStorage.getItem("user_member_id");
    localStorage.setItem("user_group_id", formData.get("group"));
    try {
        const res1 = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/group_member?storage=gamification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                member_id: member_id,
                group_id: formData.get("group")
            })
        });
        if (!res1.ok) {
            throw new Error(`POST /group_member: ${res1.status} ${res1.statusText}`);
        }

        const res2 = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/member/${member_id}?storage=gamification`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.get("username") })
        });
        if (!res2.ok) {
            throw new Error(`PUT /member: ${res2.status} ${res2.statusText}`);
        }

        window.location.assign(`${window.location.origin}/WebPush-PWA/sites/leaderboard.html`);

    } catch (error) {
        console.error("Error processing login: ", error)
    }
}