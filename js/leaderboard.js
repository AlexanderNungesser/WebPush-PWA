document.addEventListener("swac_components_complete", () => {
    setPlaceHolderImages("../content/logo_round.png");
    highlightOwnGroup();
})

function setPlaceHolderImages(path) {
    const images = document.querySelectorAll("td img");

    for (let img of images) {
        if (!img.getAttribute("src")) {
            img.src = path;
        }
    }
}

async function highlightOwnGroup() {
    try {
        const group_id = localStorage.getItem("user_group_id");
        const response = await fetch(`${window.location.origin}/SmartDataAirquality/smartdata/records/groups/${group_id}?storage=gamification`);

        if (!response.ok) {
            throw new Error('Error setting group header: ' + response.status);
        }

        const data = await response.json();

        const name = data.records[0].name;

        const rows = document.querySelectorAll("tr");
        for (const row of rows) {
            const nameCell = row.querySelector("td:nth-child(2)");
            if (!nameCell) continue;

            if (nameCell.textContent.trim() === name) {
                row.classList.add("highlight");
                break;
            }
        }

    } catch (error) {
        console.error(error);
    }
}
