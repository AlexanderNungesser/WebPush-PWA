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
    const group_id = localStorage.getItem("user_group_id")

    const rows = document.querySelectorAll("tr");
    for (const row of rows) {
        if (row.dataset.g_id == group_id) {
            row.classList.add("highlight");
            break;
        }
    }

}
