//___________SIDEBAR-BUTTON-METHODS_________
const openBtn = document.getElementById("openMenuBtn");
const closeBtn = document.getElementById("closeMenuBtn");
const outerBackGround = document.querySelector(".side-bar-outer-bg");
const sideBar = document.querySelector(".sidebar");

function toggleClass() {
    sideBar.classList.toggle("sidebar-open");
}

openBtn.addEventListener("click", () => {
    toggleClass()
    outerBackGround.style.opacity = 0.8;
    outerBackGround.style.pointerEvents = "auto";
});
closeBtn.addEventListener("click", () => {
    toggleClass()
    outerBackGround.style.opacity = 0;
    outerBackGround.style.pointerEvents = "none";
});