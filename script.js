// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => navLinks.classList.remove("open"))
);

// Dark mode (remembers the visitor's choice, defaults to system setting)
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-btn");
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(saved || (prefersDark ? "dark" : "light"));

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.innerHTML = theme === "dark" ? "&#9728;" : "&#9790;";
}

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});
