import WebPush from './../../SWAC/swac/WebPush.js';

const API_BASE = `${window.location.origin}/SmartDataAirquality/smartdata/records`;
const STORAGE = `storage=gamification`;
const LEADERBOARD_URL = `./sites/leaderboard.html`;

let permissionState = null;

let navigated = false;
function navigateOnce(url) {
  if (navigated) return;
  navigated = true;
  window.location.assign(url);
}

async function init() {
    setuptUI();

    document.getElementById("allow").addEventListener('click', (event) => { 
        event.preventDefault();
        event.stopPropagation();
        Notification.requestPermission().then((permission) => { 
            onPermissionResult(permission); 
        }).catch((err) => {
            console.error("Error requesting permission:", err);
        });
    }, { once: true });
    document.getElementById("deny").addEventListener('click', (event) => { 
        event.preventDefault();
        event.stopPropagation();
        Notification.requestPermission().then((permission) => { 
            onPermissionResult(permission); 
        }).catch((err) => {
            console.error("Error requesting permission:", err);
        });
    }, { once: true });
    document.getElementById("loginForm").addEventListener("submit", async (event) => { await login(event) }, { once: true });

    loadGroups();

    if (!("Notification" in window)) {
        await showError("Notifications not supported", "This browser does not support notifications. You cannot use this app.");
        return;
    }

    if (Notification.permission === "granted") {
        permissionState = "granted";
        await checkSubscription();
    } else if (Notification.permission === "denied") {
        permissionState = "denied";
        await showError("Notifications are turned off", "To get important updates from this app, notifications need to be enabled. You can turn them on anytime in your device settings.");
    } else {
        permissionState = "default";
        document.getElementById("popup").style.display = 'block'
    }
}

function onPermissionResult(permission) {
    try {
        if (permission === "granted") {
            permissionState = "granted";
            console.log("✅ User agreed to notifications");
            checkSubscription();
        } else if (permission === "denied") {
            permissionState = "denied";
            console.log("❌ User disagreed to notifications");
            showError("Notifications are turned off", "To get important updates from this app, notifications need to be enabled. You can turn them on anytime in your device settings.");
        }
    } catch (err) {
        console.error("Error at permission/subscription:", err);
    } finally {
        document.getElementById("popup").style.display = 'none';
    }
}

async function checkSubscription() {
    const id = await ensureMemberId();
    if (!id) {
        await showError("Subscription failed", "Could not subscribe to notifications. You cannot use this app.");
        return;
    }
    const response = await fetch(`${API_BASE}/group_member/?${STORAGE}&filter=member_id,eq,${id}`);
    if (!response.ok) {
        await showError("Error checking group membership", "Status: " + response.status + " Check your network connection and try again.");
        return;
    }
    const data = await response.json();

    if (data.records.length == 0) {
        document.getElementById("loginform_wrapper").classList.remove("hidden");
        document.getElementById("loading_screen").classList.add("hidden");
    } else {
        localStorage.setItem("user_group_id", data.records[0].group_id);
        navigateOnce(LEADERBOARD_URL);
    }
}

async function ensureMemberId() {
    const member_id = localStorage.getItem("user_member_id");
    if (member_id) return member_id;

    try {
        const webpush = new WebPush();
        const data = await webpush.subscribe();
        const id = data?.id ?? null;
        if (id) localStorage.setItem("user_member_id", id);
        return id;
    } catch (e) {
        console.log("Push subscription failed: " + e);
        return null;
    }
}

async function loadGroups() {
    const sel = document.getElementById("selectGroup");
    try {
        const response = await fetch(`${API_BASE}/group?${STORAGE}`);

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
    const form = event.target;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const formData = new FormData(form)
    const member_id = await ensureMemberId();
    if (!member_id) return;
    localStorage.setItem("user_group_id", formData.get("group"));
    try {
        const res1 = await fetch(`${API_BASE}/group_member?${STORAGE}`, {
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

        const res2 = await fetch(`${API_BASE}/member/${member_id}?${STORAGE}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.get("username") })
        });
        if (!res2.ok) {
            throw new Error(`PUT /member: ${res2.status} ${res2.statusText}`);
        }

        navigateOnce(LEADERBOARD_URL);

    } catch (error) {
        console.error("Error processing login: ", error)
    }
}

async function syncPermissionState() {
  if (Notification.permission !== permissionState) {
    permissionState = Notification.permission;
    console.log("Permission changed:", permissionState);
    await init();
  }
}

async function showError(title, message) {
    document.getElementById("loading_screen").classList.add("hidden");
    const errorPopup = document.getElementById("error_popup");
    errorPopup.querySelector("h1").textContent = title;
    errorPopup.querySelector("p").textContent = message;
    errorPopup.style.display = "block";
    const instructionsButton = document.getElementById("show_instructions");
    instructionsButton.onclick = () => {
        errorPopup.style.display = "none";
        document.getElementById("instruction_popup").style.display = "block";
    };
    const closeButton = document.getElementById("Close");
    closeButton.onclick = () => {
        document.getElementById("instruction_popup").style.display = "none";
        showError(title, message);
    };

    const reloadButton = document.getElementById("reload");
    reloadButton.onclick = () => {
        errorPopup.style.display = "none";
        location.reload();
    };
}

function setuptUI() {
    document.getElementById("loginform_wrapper").classList.add("hidden");
    document.getElementById("loading_screen").classList.remove("hidden");
    document.getElementById("popup").style.display = "none";
    document.getElementById("error_popup").style.display = "none";
    document.getElementById("instruction_popup").style.display = "none";
}

document.addEventListener('swac_components_complete', async () => await init());
window.addEventListener("focus", async () => await syncPermissionState());
document.addEventListener("visibilitychange", async () => {
  if (!document.hidden) await syncPermissionState();
});

