window["present_pictures_options"] = {
    attributeRenames: new Map([["id", "p_id"]])
}

document.addEventListener("swac_components_complete", () => {
    setXPprogress();
    initProfilePictureSelection();
    document.getElementById("profile-image").addEventListener("click", openPopup)
    document.getElementById("popup-overlay").addEventListener("click", closePopup)
});

window.addEventListener("group_reload", () => {
    loadProfilePicture();
});

function setXPprogress() {
    const progressValue = 69;

    const circle = document.querySelector('.progress-ring__progress');
    const radius = parseFloat(circle.getAttribute('r'));
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference}`;

    const offset = circumference - (progressValue / 100) * circumference;
    circle.style.strokeDashoffset = offset;

}

function initProfilePictureSelection() {
    const pictures = document.querySelectorAll(".uk-card img");
    pictures.forEach(img => {
        if (img.dataset.picture != "{picture}") {
            img.src = `../content/profile/${img.dataset.picture}`
            img.addEventListener("click", () => { selectProfilePicture(img.dataset.p_id) })
        }
    });
}

async function selectProfilePicture(id) {
    try {
        const res = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/group/${group_id}?storage=gamification`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ picture_id: id })
        });
        if (!res.ok) {
            throw new Error(`PUT /group: ${res.status} ${res.statusText}`);
        }
        window.dispatchEvent(new Event("group_changed"));
    }
    catch {
        console.error(error);
    }
    closePopup();
}

function loadProfilePicture() {
    document.getElementById("profile-image").src = `../content/profile/${groupData.picture}`
}

function openPopup() {
    document.getElementById("popup").style.display = 'block'
}

function closePopup() {
    document.getElementById("popup").style.display = 'none'
}