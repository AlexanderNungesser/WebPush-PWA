
document.addEventListener("swac_components_complete", () => {
    setXPprogress();
    initProfilePictures();
    document.getElementById("profile-image").addEventListener("click", openPopup)
    document.getElementById("popup-overlay").addEventListener("click", closePopup)
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

function initProfilePictures() {
    const pictures = document.querySelectorAll(".uk-card img");
    console.log(pictures)
    pictures.forEach(img => {
        if (img.dataset.picture != "{picture}") {
            img.src = `../content/profile/${img.dataset.picture}`
            img.addEventListener("click", () => { selectProfilePicture(img.src) })
        }
    });
}
function selectProfilePicture(src) {
    document.getElementById("profile-image").src = src;
    closePopup();
}
function openPopup() {
    document.getElementById("popup").style.display = 'block'
}

function closePopup() {
    document.getElementById("popup").style.display = 'none'
}