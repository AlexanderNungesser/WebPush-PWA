import WebPush from './../../SWAC/swac/WebPush.js';

const API_BASE = `${window.location.origin}/SmartDataAirquality/smartdata/records`;
const STORAGE = `storage=gamification`;
const LEADERBOARD_URL = `${window.location.origin}/WebPush-PWA/sites/leaderboard.html`;

let navigated = false;
function navigateOnce(url) {
  if (navigated) return;
  navigated = true;
  window.location.assign(url);
}

async function init() {
    document.getElementById("retry-popup").style.display = "none";

    document.getElementById("allow").addEventListener('click', handlePermissionClick, { once: true });
    document.getElementById("deny").addEventListener('click', handlePermissionClick, { once: true });
    document.getElementById("loginForm").addEventListener("submit", (event) => { login(event) });

    loadGroups();

    if (Notification.permission === "granted") {
        checkSubscription();
    } else if (Notification.permission === "denied") {
        showError("You have denied notification permissions. Please enable them in your browser settings to use this app.");
    } else {
        document.getElementById("popup").style.display = 'block'
    }
}

async function handlePermissionClick() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("✅ User agreed to notifications");
            checkSubscription();
        } else if (permission === "denied") {
            console.log("❌ User disagreed to notifications");
            showError("You have denied notification permissions. Please enable them in your browser settings to use this app.");
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
        showError("Could not subscribe to notifications.");
        return;
    }
    const response = await fetch(`${API_BASE}/group_member/?${STORAGE}&filter=member_id,eq,${id}`);
    if (!response.ok) {
        showError("Error checking group membership: " + response.status);
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

    if (!("Notification" in window)) return null;
    if (Notification.permission !== "granted") return null;

    try {
        const webpush = new WebPush();
        const data = await webpush.subscribe();
        const id = data?.id ?? null;
        if (id) localStorage.setItem("user_member_id", id);
        return id;
    } catch (e) {
        console.log("Push subscription failed (continuing without push): " + e);
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
    const member_id = localStorage.getItem("user_member_id");
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

async function showError(errorMessage) {
    document.getElementById("loading_screen").classList.add("hidden");
    const retryPopup = document.getElementById("retry-popup");
    retryPopup.querySelector("p").textContent = errorMessage;
    retryPopup.style.display = "block";
    const retryButton = document.getElementById("retry");
    retryButton.addEventListener("click", () => {
        retryPopup.style.display = "none";
        location.reload();
    });
}

document.addEventListener('swac_components_complete', init);
