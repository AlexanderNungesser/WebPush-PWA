document.addEventListener('swac_components_complete', () => {
    setGroupInfo();
});

async function setGroupInfo() {
    try {
        const group_id = localStorage.getItem("user_group_id");
        const response = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/groups/${group_id}?storage=gamification`);

        if (!response.ok) {
            throw new Error('Error setting group header: ' + response.status);
        }

        const data = await response.json();


        const groupDisplay = document.getElementById("group");
        groupDisplay.textContent = data.records[0].name;

        const streakDisplay = document.getElementById("streak")
        streakDisplay.textContent = data.records[0].streak

    } catch (error) {
        console.error(error);
    }
}
