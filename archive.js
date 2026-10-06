/* ---------- Archive pages (projects.html / certificates.html) ----------
   Also renders the home page's project preview: <div data-archive="projects" data-home="3"> shows the
   first three projects (default Newest order) as Linear cards, without any filter controls.
   Renders cards from data.js and filters them by category, date order, custom date range and year.
   Filter state lives in the URL (?cat=school&year=2024&sort=oldest) so a filtered view can be shared. */
(function () {
  const root = document.querySelector("[data-archive]");
  if (!root) return;
  const type = root.dataset.archive; // "projects" | "certificates"
  const home = Number(root.dataset.home) || 0; // > 0 on the home page preview
  const items = window.PORTFOLIO[type];

  const CATEGORIES = {
    projects: [["all", "All"], ["work", "Work"], ["school", "School"], ["project", "Project"]],
    certificates: [["all", "All"], ["security", "Security"], ["networking", "Networking"], ["development", "Development"]],
  }[type];

  const $ = (sel) => root.querySelector(sel);
  const grid = $(".archive__grid");
  const catBox = $(".archive__cats");
  const yearSel = $(".archive__year");
  const sortSel = $(".archive__sort");
  const range = $(".archive__range");
  const fromIn = $(".archive__from");
  const toIn = $(".archive__to");
  const countEl = $(".archive__count");
  const clearBtn = $(".archive__clear");
  const empty = $(".archive__empty");

  /* ----- Dates: every item becomes a [start, end] span of "YYYY-MM" strings, or null if undated ----- */
  const span = (it) => {
    if (type === "certificates") return it.date ? [it.date.slice(0, 7), it.date.slice(0, 7)] : null;
    return it.start ? [it.start, it.end || it.start] : null;
  };
  const sortKey = (it) => (type === "certificates" ? it.date || "" : it.end || it.start || "");
  const years = [...new Set(items.flatMap((it) => {
    const s = span(it);
    if (!s) return [];
    const out = [];
    for (let y = +s[0].slice(0, 4); y <= +s[1].slice(0, 4); y++) out.push(String(y));
    return out;
  }))].sort().reverse();

  /* ----- State <-> URL ----- */
  const params = new URLSearchParams(home ? "" : location.search); // the home preview always uses the default filters
  const state = {
    cat: CATEGORIES.some(([v]) => v === params.get("cat")) ? params.get("cat") : "all",
    sort: ["newest", "oldest", "custom"].includes(params.get("sort")) ? params.get("sort") : "newest",
    year: years.includes(params.get("year")) ? params.get("year") : null,
    from: /^\d{4}-\d{2}$/.test(params.get("from") || "") ? params.get("from") : "",
    to: /^\d{4}-\d{2}$/.test(params.get("to") || "") ? params.get("to") : "",
    view: "list",
  };
  // Layout (projects page): List unless the URL asks for ?view=linear
  state.view = params.get("view") === "linear" ? "linear" : "list";
  if (state.sort !== "custom") state.from = state.to = "";

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.sort !== "newest") p.set("sort", state.sort);
    if (state.year) p.set("year", state.year);
    if (state.from) p.set("from", state.from);
    if (state.to) p.set("to", state.to);
    if (type === "projects" && state.view !== "list") p.set("view", state.view);
    const q = p.toString();
    history.replaceState(null, "", q ? `?${q}` : location.pathname);
  }

  /* ----- Controls ----- */
  function chip(label, active, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "fchip" + (active ? " is-active" : "");
    b.setAttribute("aria-pressed", active);
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }
  function renderControls() {
    catBox.replaceChildren(...CATEGORIES.map(([v, label]) =>
      chip(label, state.cat === v, () => { state.cat = v; update(); })));
    yearSel.value = state.year || "";
    sortSel.value = state.sort;
    range.hidden = state.sort !== "custom";
    fromIn.value = state.from;
    toIn.value = state.to;
  }

  if (!home) {
    yearSel.append(...years.map((y) => new Option(y, y)));
    yearSel.addEventListener("change", () => {
      state.year = yearSel.value || null;
      if (state.year && state.sort === "custom") { state.sort = "newest"; state.from = state.to = ""; } // a year replaces a custom range
      update();
    });

    sortSel.addEventListener("change", () => {
      state.sort = sortSel.value;
      if (state.sort === "custom") {
        state.year = null; // a custom range replaces the year
        if (!state.from && !state.to) { state.from = years[years.length - 1] + "-01"; state.to = years[0] + "-12"; }
      } else {
        state.from = state.to = "";
      }
      update();
    });
    fromIn.addEventListener("change", () => { state.from = fromIn.value; update(); });
    toIn.addEventListener("change", () => { state.to = toIn.value; update(); });
    clearBtn.addEventListener("click", () => {
      Object.assign(state, { cat: "all", sort: "newest", year: null, from: "", to: "" });
      update();
    });
  }

  /* ----- Filtering ----- */
  function visible() {
    const list = items.filter((it) => {
      if (state.cat !== "all" && it.category !== state.cat) return false;
      const s = span(it);
      if (state.year) {
        if (!s || s[0].slice(0, 4) > state.year || s[1].slice(0, 4) < state.year) return false;
      }
      if (state.sort === "custom" && (state.from || state.to)) {
        if (!s) return false;
        if (state.from && s[1] < state.from) return false;
        if (state.to && s[0] > state.to) return false;
      }
      return true;
    });
    const dir = state.sort === "oldest" ? 1 : -1;
    return list.sort((a, b) => {
      const ka = sortKey(a), kb = sortKey(b);
      if (!ka || !kb) return ka ? -1 : kb ? 1 : 0; // undated items always last
      return ka < kb ? -dir : ka > kb ? dir : 0;
    });
  }

  /* ----- Cards ----- */
  const ICONS = {
    alert: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    hook: '<path d="M12 3v11a4 4 0 1 1-4-4"/><circle cx="12" cy="3" r="1"/>',
    server: '<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01"/>',
    code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  };
  const catLabel = (v) => (CATEGORIES.find(([c]) => c === v) || [, v])[1];

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function link(cls, href, text, external) {
    const a = el("a", cls, text);
    a.href = href;
    if (external) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  function media(it) {
    const clickable = type === "certificates" ? it.gallery != null : !!it.gallery;
    const m = el(clickable ? "button" : "div", "acard__media");
    if (clickable) {
      m.type = "button";
      m.dataset.gallery = type === "certificates" ? "certs" : it.gallery.key;
      m.dataset.start = type === "certificates" ? it.gallery : it.gallery.start;
      m.setAttribute("aria-label", `View images: ${it.title}`);
    }
    if (it.image) {
      const img = el("img");
      img.src = it.image;
      img.alt = it.title;
      img.loading = "lazy";
      m.append(img);
      if (type === "certificates") m.classList.add("acard__media--cert");
    } else if (it.badge) {
      m.classList.add("acard__media--badge");
      m.append(el("span", "cert__level", it.badge));
    } else if (it.visual) {
      m.classList.add("acard__media--visual");
      m.insertAdjacentHTML("beforeend", `<svg viewBox="0 0 24 24">${ICONS[it.visual.icon] || ICONS.code}</svg>`);
      m.append(el("span", "acard__visual-label mono", it.visual.label));
    }
    if (type === "projects") m.append(el("span", "pcard__tagline", catLabel(it.category)));
    if (it.status && it.status !== "Live") m.append(el("span", "acard__status", it.status));
    return m;
  }

  /* ----- Project case cards (image left, details right, four action buttons) ----- */
  const BTN_ICONS = {
    live: '<path d="M7 17 17 7M9 7h8v8"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    shots: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    cert: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 9h10M7 12.5h6"/><path d="m15 17 1 4 1.5-1 1.5 1 1-4"/>',
    verify: '<path d="M12 3 4.5 6v6c0 4.3 3.2 8.1 7.5 9 4.3-.9 7.5-4.7 7.5-9V6z"/><path d="m8.8 12.2 2.3 2.3 4.2-4.4"/>',
    study: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  };
  const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${BTN_ICONS[name]}</svg>`;

  // One action slot: a link/button when available, otherwise a greyed-out, non-interactive label
  function action(opts) {
    let b;
    if (opts.href) {
      b = link("pbtn" + (opts.primary ? " pbtn--primary" : ""), opts.href, "", true);
    } else if (opts.gallery) {
      b = el("button", "pbtn" + (opts.primary ? " pbtn--primary" : ""));
      b.type = "button";
      b.dataset.gallery = opts.gallery.key;
      b.dataset.start = opts.gallery.start;
    } else {
      b = el("span", "pbtn is-disabled");
      b.setAttribute("aria-disabled", "true");
    }
    b.insertAdjacentHTML("afterbegin", svg(opts.icon));
    b.append(el("span", null, opts.label));
    return b;
  }

  function toolChip(name) {
    const chip = el("span", "tool");
    const icon = window.toolIcon ? window.toolIcon(name) : "";
    chip.insertAdjacentHTML("afterbegin", icon || '<span class="tool__dot" aria-hidden="true"></span>');
    chip.append(name);
    return chip;
  }

  // project/01 is the oldest project and the highest number the newest. Sorted by when the work ended
  // (or started); equal dates fall back to data.js order, which lists newer work first.
  const CHRONO = type === "projects"
    ? items.slice().sort((x, y) => {
        const kx = x.end || x.start || "", ky = y.end || y.start || "";
        return kx < ky ? -1 : kx > ky ? 1 : items.indexOf(y) - items.indexOf(x);
      })
    : [];

  function projectCard(it) {
    const no = String(CHRONO.indexOf(it) + 1).padStart(2, "0");
    const c = el("article", "pcase");
    const m = media(it);
    m.classList.add("pcase__media");
    m.querySelector(".pcard__tagline")?.remove(); // the category shows as [tag] in the card header instead
    c.append(m);

    const body = el("div", "pcase__body");
    const top = el("div", "pcase__top");
    const left = el("div", "pcase__id");
    left.append(el("span", "pcase__no mono", `project/${no}`));
    if (it.status === "Live") {
      const live = el("span", "livebadge mono");
      live.append(el("span", "livebadge__dot"), "Live");
      live.title = "Live and running";
      left.append(live);
    }
    top.append(left, el("span", "pcase__tag mono", `[${catLabel(it.category).toLowerCase()}]`));
    body.append(top);
    body.append(el("span", "pcase__cat mono", `${it.org} · ${it.dateLabel}`));
    body.append(el("h3", null, it.title));
    body.append(el("p", "pcase__summary", it.summary));
    const tools = el("div", "pcase__tools");
    it.tags.forEach((t) => tools.append(toolChip(t)));
    body.append(tools);

    const shots = it.gallery && window.LAB_GALLERIES[it.gallery.key] ? window.LAB_GALLERIES[it.gallery.key].shots.length : 0;
    const acts = el("div", "pcase__actions");
    acts.append(
      it.live ? action({ href: it.live, icon: "live", label: "Live Demo", primary: true })
        : it.doc ? action({ href: it.doc, icon: "doc", label: "View Documentation", primary: true })
        : action({ icon: "live", label: "Live Demo — Unavailable" }),
      it.video ? action({ href: it.video, icon: "video", label: "Video Demo" })
        : it.gallery ? action({ gallery: it.gallery, icon: "shots", label: `Screenshots (${shots})` })
        : action({ icon: "video", label: "Video Demo — Unavailable" }),
      it.github && it.github !== "private" ? action({ href: it.github, icon: "github", label: "GitHub" })
        : action({ icon: it.github === "private" ? "lock" : "github", label: it.github === "private" ? "GitHub — Private" : "GitHub — Unavailable" }),
      it.caseStudy ? action({ href: it.caseStudy, icon: "study", label: "View Case Study" })
        : action({ icon: "study", label: "Case Study — Unavailable" })
    );
    body.append(acts);
    c.append(body);
    return c;
  }

  function card(it) {
    if (type === "projects") return projectCard(it);
    const c = el("article", "acard");
    c.append(media(it));
    const body = el("div", "acard__body");
    body.append(el("span", "pcard__meta", type === "certificates" ? `${catLabel(it.category)} · ${it.dateLabel}` : it.dateLabel));
    body.append(el("h3", null, it.title));
    body.append(el("p", "acard__org", type === "certificates" ? it.issuer : it.org));
    if (it.summary) body.append(el("p", "acard__summary", it.summary));
    const tags = el("div", "tags");
    it.tags.forEach((t) => tags.append(el("span", null, t)));
    body.append(tags);

    const acts = el("div", "certcard__actions");
    acts.append(
      it.gallery != null ? action({ gallery: { key: "certs", start: it.gallery }, icon: "cert", label: "View certificate", primary: true })
        : action({ icon: "cert", label: "No image" }),
      it.verify ? action({ href: it.verify, icon: "verify", label: "Verify" })
        : action({ icon: "verify", label: "Verify — Unavailable" })
    );
    body.append(acts);
    if (it.note) body.append(el("span", "certcard__vnote mono", it.note));
    c.append(body);
    return c;
  }

  const viewBtns = [...root.querySelectorAll(".archive__views .viewtoggle__btn")];
  viewBtns.forEach((b) => b.addEventListener("click", () => {
    state.view = b.dataset.view;
    update();
  }));

  function update() {
    if (home) {
      grid.dataset.view = "linear";
      grid.replaceChildren(...visible().slice(0, home).map(card));
      return;
    }
    syncUrl();
    grid.dataset.view = state.view;
    viewBtns.forEach((b) => {
      const on = b.dataset.view === state.view;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-checked", on);
    });
    renderControls();
    const list = visible();
    grid.replaceChildren(...list.map(card));
    countEl.textContent = `Showing ${list.length} of ${items.length}`;
    empty.hidden = list.length > 0;
    const filtered = state.cat !== "all" || state.year || state.sort !== "newest";
    clearBtn.hidden = !filtered;
  }

  update();
})();

/* ---------- Theme toggle for the archive pages (same storage key as the home page) ---------- */
(function () {
  const btn = document.querySelector("[data-archive-page] .themebtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();
