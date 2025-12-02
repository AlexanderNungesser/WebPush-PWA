window.addEventListener('group_reload', () => {
    setGroupInfo();
});

async function setGroupInfo() {
    const groupDisplay = document.getElementById("header_logo");
    groupDisplay.src = `../files/icons/profile/${groupData.picture}`;

    const streakDisplay = document.getElementById("header_streak")
    streakDisplay.textContent = groupData.streak
}
