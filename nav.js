/* ---------- Navbar layout: Top View (default) or Side View (icon sidebar) ----------
   Sets <html data-nav="top|side">. Every page load starts on Top View, like the theme starts on System.
   Side View only applies on wide screens; phones keep the top bar and its menu button. */
(function () {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll(".navswitch__btn")];
  if (!buttons.length) return;

  function apply(view) {
    root.dataset.nav = view;
    buttons.forEach((b) => {
      const on = b.dataset.navChoice === view;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-checked", on);
    });
  }

  buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.navChoice)));
  apply("top");
})();
