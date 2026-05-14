const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    const menuIsOpen = navMenu.classList.contains("active");
    hamburger.setAttribute("aria-expanded", menuIsOpen);
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
    });
});
