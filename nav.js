/* ---------- Navbar settings (gear menu) ----------
   - Navigation: Top View (default) or Side View (icon sidebar)  -> <html data-nav="top|side">
   - Hover top bar: Off (default) or On (the bar hides until you point at the screen edge) -> <html data-navhover="off|on">
   Every page load starts on Top / Off, like the theme starts on System. Works on every device:
   with a mouse the bar reappears at the screen edge; on touch screens it hides while scrolling down
   and comes back when scrolling up. */
(function () {
  const root = document.documentElement;
  const topbar = document.querySelector(".topbar");
  const gear = document.querySelector(".settings__btn");
  const panel = document.querySelector(".settings__panel");
  if (!topbar || !gear || !panel) return;
  const navButtons = [...panel.querySelectorAll(".navswitch__btn")];
  const hoverToggle = panel.querySelector(".settings__toggle");

  /* ----- Settings panel ----- */
  const setPanel = (open) => {
    panel.hidden = !open;
    gear.setAttribute("aria-expanded", open);
    gear.classList.toggle("is-open", open);
    if (!open) maybeHide();
  };
  gear.addEventListener("click", (e) => { e.stopPropagation(); setPanel(panel.hidden); });
  document.addEventListener("click", (e) => { if (!panel.hidden && !panel.contains(e.target)) setPanel(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setPanel(false); gear.focus(); } });

  /* ----- Navigation: Top / Side ----- */
  function setView(view) {
    root.dataset.nav = view;
    navButtons.forEach((b) => {
      const on = b.dataset.navChoice === view;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-checked", on);
    });
  }
  navButtons.forEach((b) => b.addEventListener("click", () => setView(b.dataset.navChoice)));

  /* ----- Hover top bar: hide until the pointer reaches the top (or left) edge ----- */
  const hotzone = document.createElement("div");
  hotzone.className = "navhotzone";
  hotzone.setAttribute("aria-hidden", "true");
  document.body.appendChild(hotzone);

  const peek = () => topbar.classList.add("is-peek");
  function maybeHide() {
    // stay visible while the settings panel is open or keyboard focus is inside the bar
    if (!panel.hidden || topbar.matches(":focus-within") || topbar.matches(":hover")) return;
    topbar.classList.remove("is-peek");
  }
  hotzone.addEventListener("mouseenter", peek);
  topbar.addEventListener("mouseleave", () => setTimeout(maybeHide, 250));
  topbar.addEventListener("focusin", peek);
  topbar.addEventListener("focusout", () => setTimeout(maybeHide, 0));

  function setHover(on) {
    root.dataset.navhover = on ? "on" : "off";
    hoverToggle.setAttribute("aria-checked", on);
    if (!on) topbar.classList.remove("is-scrollhidden");
    if (on) topbar.classList.add("is-peek"); // stays shown while the settings are open, hides once you move away
  }
  hoverToggle.addEventListener("click", () => setHover(root.dataset.navhover !== "on"));

  // Touch screens / phones: hide on scroll down, show on scroll up
  const touchMode = () => window.matchMedia("(hover: none), (max-width: 760px)").matches;
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (root.dataset.navhover === "on" && touchMode() && panel.hidden) {
      if (y > lastY + 6 && y > 80) topbar.classList.add("is-scrollhidden");
      else if (y < lastY - 6 || y <= 80) topbar.classList.remove("is-scrollhidden");
    } else {
      topbar.classList.remove("is-scrollhidden");
    }
    lastY = y;
  }, { passive: true });

  setView("top");
  setHover(false);
})();
