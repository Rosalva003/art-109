const lightbox = document.getElementById("work-lightbox");
const lightboxImg = document.getElementById("work-lightbox-img");
const lightboxCaption = document.getElementById("work-lightbox-caption");
const closeBtn = lightbox.querySelector(".work-lightbox__close");
const backdrop = lightbox.querySelector(".work-lightbox__backdrop");
const triggers = document.querySelectorAll(".work-trigger");

let lastFocus = null;

function openLightbox(trigger) {
    const src = trigger.dataset.src;
    const caption = trigger.dataset.caption || "";
    const alt = trigger.querySelector("img")?.alt || caption;

    lastFocus = trigger;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption;

    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "";
    lightboxCaption.textContent = "";

    if (lastFocus) {
        lastFocus.focus();
        lastFocus = null;
    }
}

triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
});

closeBtn.addEventListener("click", closeLightbox);
backdrop.addEventListener("click", closeLightbox);

document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden && e.key === "Escape") {
        closeLightbox();
    }
});
