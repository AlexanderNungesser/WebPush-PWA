document.addEventListener("swac_components_complete", () => {
    setPlaceHolderImages("../content/logo_round.png");
})

function setPlaceHolderImages(path) {
    const images = document.querySelectorAll("td img");

    for (let img of images) {
        if (!img.getAttribute("src")) {
            img.src = path;
        }
    }
}
