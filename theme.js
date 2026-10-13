/* ---------- Theme: System (default), Light or Dark ----------
   The choice is stored as localStorage "theme" = "system" | "light" | "dark". "System" follows the
   device's light/dark setting and updates live if it changes. The inline script in each page's <head>
   applies the theme before first paint; this file wires up the switch in the navbar. */
(function () {
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const buttons = [...document.querySelectorAll(".themeswitch__btn")];
  const metaColor = document.querySelector('meta[name="theme-color"]');

  let pref = "system";
  try { pref = localStorage.getItem("theme") || "system"; } catch (e) {}
  if (!["system", "light", "dark"].includes(pref)) pref = "system";

  function apply() {
    const resolved = pref === "system" ? (media.matches ? "dark" : "light") : pref;
    root.dataset.theme = resolved;
    root.dataset.themePref = pref;
    if (metaColor) metaColor.content = resolved === "dark" ? "#08090c" : "#f7f8fa";
    buttons.forEach((b) => {
      const on = b.dataset.themeChoice === pref;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-checked", on);
    });
  }

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      pref = b.dataset.themeChoice;
      try { localStorage.setItem("theme", pref); } catch (e) {}
      apply();
    })
  );

  // Follow the device while on "System"
  const onSystemChange = () => { if (pref === "system") apply(); };
  if (media.addEventListener) media.addEventListener("change", onSystemChange);
  else if (media.addListener) media.addListener(onSystemChange);

  apply();
})();
