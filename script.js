const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Preloader: count up, glowing seam, panes split open ---------- */
const preloader = document.querySelector(".preloader");
const loadCount = document.getElementById("loadCount");
document.body.classList.add("is-loading");

function finishLoading() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");
  startTyping();
}

if (reduceMotion) {
  preloader.classList.add("is-done");
  finishLoading();
} else {
  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(100, n + Math.ceil(Math.random() * 9));
    loadCount.textContent = n;
    if (n === 100) {
      clearInterval(tick);
      preloader.classList.add("is-cracking");
      setTimeout(() => preloader.classList.add("is-open"), 550);
      setTimeout(finishLoading, 800);
      setTimeout(() => preloader.classList.add("is-done"), 1800);
    }
  }, 45);
}

/* ---------- Typewriter role ---------- */
const typed = document.getElementById("typed");
const roles = ["Backend Developer", "IT Specialist", "Automation Engineer", "Website Migration Specialist", "SOC Analyst (Tier 1)", "AI & Python Enthusiast"];

function startTyping() {
  if (reduceMotion) { typed.textContent = roles[0]; return; }
  let r = 0, i = 0, deleting = false;
  (function step() {
    const word = roles[r];
    typed.textContent = word.slice(0, i);
    if (!deleting && i < word.length) { i++; setTimeout(step, 70); }
    else if (!deleting) { deleting = true; setTimeout(step, 1600); }
    else if (i > 0) { i--; setTimeout(step, 35); }
    else { deleting = false; r = (r + 1) % roles.length; setTimeout(step, 300); }
  })();
}

/* ---------- Theme toggle (default dark, remembered) ---------- */
document.querySelector(".themebtn").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ---------- Mobile menu ---------- */
const menuBtn = document.querySelector(".menubtn");
const navLinks = document.querySelector(".topbar__links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Scroll: progress bar, sticky nav, timeline fill ---------- */
const topbar = document.querySelector(".topbar");
const progress = document.querySelector(".progress");
const timeline = document.querySelector(".timeline");
const timelineFill = document.querySelector(".timeline__fill");

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  topbar.classList.toggle("is-stuck", scrollY > 30);

  const rect = timeline.getBoundingClientRect();
  const p = (innerHeight * 0.6 - rect.top) / rect.height;
  timelineFill.style.transform = `scaleY(${Math.max(0, Math.min(1, p))})`;
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Active nav link ---------- */
const links = [...document.querySelectorAll(".topbar__links a")];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("section[id]").forEach((s) => navObserver.observe(s));

/* ---------- Scroll reveal + count-up stats ---------- */
function countUp(el) {
  const to = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.dec || "0", 10);
  const start = performance.now();
  const dur = 1600;
  (function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (to * eased).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (t < 1) requestAnimationFrame(frame);
  })(start);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      e.target.querySelectorAll(".count").forEach(countUp);
      revealObserver.unobserve(e.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Marquee: duplicate items for a seamless loop ---------- */
const track = document.querySelector(".marquee__track");
track.innerHTML += track.innerHTML;
track.querySelectorAll(".marquee__item").forEach((el, i, all) => {
  if (i >= all.length / 2) el.setAttribute("aria-hidden", "true");
});

/* ---------- Pointer effects (desktop only) ---------- */
if (finePointer && !reduceMotion) {
  // Cursor spotlight
  addEventListener("pointermove", (e) => {
    root.style.setProperty("--mx", e.clientX + "px");
    root.style.setProperty("--my", e.clientY + "px");
  }, { passive: true });

  // 3D tilt with glare
  document.querySelectorAll(".tilt").forEach((el) => {
    const max = el.classList.contains("portrait") ? 10 : 5;
    if (!el.classList.contains("portrait")) el.classList.add("tilt-glare");
    el.addEventListener("pointermove", (e) => {
      if (el.classList.contains("reveal") && !el.classList.contains("is-in")) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.transition = "transform 0.15s ease-out";
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-4px)`;
      el.style.setProperty("--gx", x * 100 + "%");
      el.style.setProperty("--gy", y * 100 + "%");
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "";
      el.style.transform = "";
    });
  });

  // Magnetic buttons
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.3}px)`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
  });
}

/* ---------- Draggable floating chips (spring back when released) ---------- */
document.querySelectorAll(".floatchip").forEach((chip) => {
  let sx = 0, sy = 0;
  chip.addEventListener("pointerdown", (e) => {
    chip.setPointerCapture(e.pointerId);
    chip.classList.add("is-dragging");
    chip.style.transition = "opacity .6s, border-color .2s";
    sx = e.clientX; sy = e.clientY;
  });
  chip.addEventListener("pointermove", (e) => {
    if (!chip.classList.contains("is-dragging")) return;
    chip.style.transform = `translate(${e.clientX - sx}px, ${e.clientY - sy}px) rotate(${(e.clientX - sx) * 0.08}deg)`;
  });
  const release = () => {
    if (!chip.classList.contains("is-dragging")) return;
    chip.classList.remove("is-dragging");
    chip.style.transition = "transform .7s cubic-bezier(.34,1.56,.64,1), opacity .6s, border-color .2s";
    chip.style.transform = "";
  };
  chip.addEventListener("pointerup", release);
  chip.addEventListener("pointercancel", release);
});

/* ---------- Copy email ---------- */
const toast = document.querySelector(".toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("is-show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("is-show"), 2000);
}
document.querySelectorAll(".copybtn").forEach((btn) =>
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      showToast("Email copied to clipboard ✓");
    } catch (e) {
      location.href = "mailto:" + btn.dataset.copy;
    }
  })
);

/* ---------- About me: cross-fade between web migration and cybersecurity on a loop ---------- */
const aboutSwitch = document.querySelector(".aboutswitch");
if (aboutSwitch) {
  const tabs = [...aboutSwitch.querySelectorAll(".aboutswitch__tab")];
  const slides = [...aboutSwitch.querySelectorAll(".aboutslide")];
  const bars = tabs.map((t) => t.querySelector(".aboutswitch__bar"));
  const interval = Number(aboutSwitch.dataset.interval) || 9000;
  const TICK = 100;
  let current = 0, elapsed = 0;

  function showAbout(i) {
    current = (i + slides.length) % slides.length;
    elapsed = 0;
    tabs.forEach((t, j) => {
      const on = j === current;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      bars[j].style.transform = "scaleX(0)";
    });
    slides.forEach((s, j) => {
      s.classList.toggle("is-active", j === current);
      s.setAttribute("aria-hidden", j !== current);
    });
    slides[current].querySelectorAll(".count").forEach(countUp);
  }

  tabs.forEach((t, i) => t.addEventListener("click", () => showAbout(i)));

  // Hold the timer while the reader hovers or focuses inside (so text never changes mid-read),
  // and while the section is off screen (so visitors arrive at the start of a cycle)
  const hold = { hover: false, focus: false, offscreen: true };
  const paused = () => hold.hover || hold.focus || hold.offscreen;
  aboutSwitch.addEventListener("mouseenter", () => { hold.hover = true; });
  aboutSwitch.addEventListener("mouseleave", () => { hold.hover = false; });
  aboutSwitch.addEventListener("focusin", () => { hold.focus = true; });
  aboutSwitch.addEventListener("focusout", (e) => { hold.focus = aboutSwitch.contains(e.relatedTarget); });
  new IntersectionObserver(([e]) => { hold.offscreen = !e.isIntersecting; }, { threshold: 0.3 }).observe(aboutSwitch);

  // The active tab's bar fills as the timer runs; when it is full, move to the next slide
  setInterval(() => {
    if (paused()) return;
    elapsed += TICK;
    bars[current].style.transform = `scaleX(${Math.min(1, elapsed / interval)})`;
    if (elapsed >= interval) showAbout(current + 1);
  }, TICK);
}

/* ---------- Skills view switcher: normal / compact / list (remembered per visitor) ---------- */
const skillGrid = document.querySelector(".bento[data-view]");
const viewBtns = [...document.querySelectorAll(".viewtoggle__btn")];
if (skillGrid && viewBtns.length) {
  function setView(view, animate) {
    const apply = () => {
      skillGrid.dataset.view = view;
      viewBtns.forEach((b) => {
        const on = b.dataset.view === view;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-checked", on);
      });
      skillGrid.classList.remove("is-switching");
    };
    if (!animate || reduceMotion) return apply();
    skillGrid.classList.add("is-switching");
    setTimeout(apply, 220);
  }

  viewBtns.forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.view === skillGrid.dataset.view) return;
      setView(b.dataset.view, true);
      try { localStorage.setItem("skillsView", b.dataset.view); } catch (e) {}
    })
  );

  let saved = null;
  try { saved = localStorage.getItem("skillsView"); } catch (e) {}
  if (viewBtns.some((b) => b.dataset.view === saved)) setView(saved, false);
}
