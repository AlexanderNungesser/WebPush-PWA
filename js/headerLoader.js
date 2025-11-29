window.addEventListener('group_reload', () => {
    setGroupInfo();
});

async function setGroupInfo() {
    const groupDisplay = document.getElementById("group");
    groupDisplay.textContent = groupData.group_name;

    const streakDisplay = document.getElementById("streak")
    streakDisplay.textContent = groupData.streak
}
