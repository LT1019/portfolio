(function () {
/* ---------- Screenshot / certificate lightbox (shared by every page) ----------
   Any element with data-gallery="<key from labs.js>" opens it; data-start picks the first image.
   Uses event delegation so cards rendered later (archive pages) work too. */
const lightbox = document.querySelector(".lightbox");
if (lightbox && window.LAB_GALLERIES) {
  const lbImg = lightbox.querySelector(".lightbox__img");
  const lbCap = lightbox.querySelector(".lightbox__cap");
  const lbTitle = lightbox.querySelector(".lightbox__title");
  const lbCount = lightbox.querySelector(".lightbox__count");
  let gallery = null, index = 0;

  const src = (g, i) => g.shots[i].src || `${g.dir}${String(i + 1).padStart(2, "0")}.webp`;
  const cap = (g, i) => g.shots[i].cap || g.shots[i];

  function show(i) {
    const n = gallery.shots.length;
    index = (i + n) % n;
    lbImg.src = src(gallery, index);
    lbImg.alt = cap(gallery, index);
    lbCap.textContent = cap(gallery, index);
    lbCount.textContent = `${index + 1} / ${n}`;
    new Image().src = src(gallery, (index + 1) % n); // preload the next shot
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gallery]");
    if (!btn || !window.LAB_GALLERIES[btn.dataset.gallery]) return;
    gallery = window.LAB_GALLERIES[btn.dataset.gallery];
    lbTitle.textContent = gallery.title;
    show(Number(btn.dataset.start || 0));
    lightbox.showModal();
  });

  lightbox.querySelector(".lightbox__nav--prev").addEventListener("click", () => show(index - 1));
  lightbox.querySelector(".lightbox__nav--next").addEventListener("click", () => show(index + 1));
  lightbox.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
  // Close when the backdrop (the dialog element itself) is clicked
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe between screenshots on touch screens
  let touchX = null;
  lbImg.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lbImg.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}
})();
