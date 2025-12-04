window["present_pictures_options"] = {
    attributeRenames: new Map([["id", "p_id"]])
}

document.addEventListener("swac_components_complete", async () => {
    setXPProgress();
    initProfilePictureSelection();
    await loadAchievements();
    initPopups();
});

window.addEventListener("group_reload", () => {
    loadProfileInfos();
    loadAchievements();
});

function setXPProgress() {
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
            img.src = `../files/icons/profile/${img.dataset.picture}`
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

function loadProfileInfos() {
    document.getElementById("profile-image").src = `../files/icons/profile/${groupData.picture}`;
    document.getElementById("group_name").textContent = groupData.group_name;
    document.getElementById("streak").textContent = groupData.streak;
}

function setAchievementIcons() {
    let iconImgs = document.querySelectorAll('.achv-icon-img');
    iconImgs.forEach(img => {
        if (img.dataset.image !== "{achievement_image_url}") {
            img.src = `../files/icons/achievements/${img.dataset.image}`;
        }
    });
}

async function loadAchievements() {
    const swacElem = document.getElementById('present-achievements');
    const achievementComp = swacElem.swac_comp;
    if (!swacElem || !achievementComp) return;
    try {
        const response = await fetch("../data/example_achievement_general.json");
        //const response = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/view_group_achievements?storage=gamification&filter=group_id,eq,${group_id}`);
        if (!response.ok) {
            throw new Error('Error getting group info: ' + response.status);
        }
        achievementComp.removeAllData();
        //const data = await response.json().then(data => data.records);
        const data = await response.json()
        achievementComp.addData('view_group_achievements', data);
        setAchievementIcons();

    } catch (error) {
        console.error(error);
    }
}

function initPopups() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('click', async () => {
            loadAchievementPopup(card.dataset.a_id)
        });
    });

    document.getElementById("profile-image").addEventListener("click", () => {
        document.getElementById("profile_popup").style.display = 'block'
    })
    document.getElementById("profile_overlay").addEventListener("click", closePopup)
    document.getElementById("achievement_overlay").addEventListener("click", closePopup)
}

async function loadAchievementPopup(a_id) {
    const imgBoxes = document.querySelectorAll('.img-box');
    const data = await loadAchievementData(a_id);
    for (let i = 0; i < imgBoxes.length; i++) {
        const currentBox = imgBoxes[i];
        const currentXP = currentBox.querySelector('span');
        const currentImg = currentBox.querySelector('img');
        if (!data.tiers[i].achieved) {
            currentImg.src = `../files/icons/achievements/placeholder.png`
            currentXP.textContent = '';
            continue;
        }
        currentImg.src = `../files/icons/achievements/${data.tiers[i].img_url}`
        currentXP.textContent = `${data.tiers[i].reward_xp} XP`
    }

    document.getElementById('achievement_popup_title').textContent = data.achievement_title;
    document.getElementById('achievement_popup_description').textContent = data.description;
    document.getElementById("achievement_popup").style.display = 'block';
}

async function loadAchievementData(a_id) {
    try {
        const response = await fetch("../data/example_achievement_specific.json");
        if (!response.ok) {
            throw new Error('Error getting group info: ' + response.status);
        }
        const data = await response.json();
        return data.find(a => a.achievement_id == a_id);

    } catch (error) {
        console.error(error);
    }
}

function closePopup() {
    document.getElementById("profile_popup").style.display = 'none'
    document.getElementById("achievement_popup").style.display = 'none'
}