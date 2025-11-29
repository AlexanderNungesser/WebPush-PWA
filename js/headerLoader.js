window.addEventListener('group_reload', () => {
    setGroupInfo();
});

async function setGroupInfo() {
    const groupDisplay = document.getElementById("header_logo");
    groupDisplay.src = `../content/profile/${groupData.picture}`;

    const streakDisplay = document.getElementById("streak")
    streakDisplay.textContent = groupData.streak
}
