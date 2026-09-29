/* ---------- "Ask about Hans" chat widget ----------
   Sends the conversation to /api/chat (Claude, via a Vercel function). If that endpoint is
   missing or not configured (local preview, no API key), it answers from the offline notes below. */
(function () {
  const fab = document.querySelector(".chatfab");
  const panel = document.querySelector(".chat");
  if (!fab || !panel) return;

  const log = panel.querySelector(".chat__log");
  const form = panel.querySelector(".chat__form");
  const input = panel.querySelector(".chat__input");
  const sendBtn = panel.querySelector(".chat__send");
  const suggestions = panel.querySelector(".chat__suggest");
  const EMAIL = "hanswernerhuyo@gmail.com";

  const history = []; // { role: "user" | "assistant", content }
  let live = true;    // flips to false after the API reports it is unavailable
  let busy = false;

  /* Offline answers: first rule whose pattern matches the question wins */
  const OFFLINE = [
    [/^\s*(hi|hello|hey|yo|good (morning|afternoon|evening)|kumusta|musta|maayong (buntag|hapon|gabii)|magandang (umaga|hapon|gabi))\W*$/i,
      "Hi! I can tell you about Hans's experience, projects, skills, security labs and certificates. What would you like to know?"],
    [/ionos|migrat|website admin|current job|recent job|latest job|trabaho karon/i,
      "At IONOS Philippines (Sep 2025 - Feb 2026) Hans migrated 4,000+ websites from legacy platforms to IONOS infrastructure in 3.5 months, at 3 full-site migrations a day, with no data loss. The work covered DNS, SSL, hosting and email (IMAP/POP3)."],
    [/lifewood|intern|scrap/i,
      "As an IT intern at Lifewood Data Technology (Jan - Apr 2025) Hans wrote web scraping scripts, used AI tools and prompt engineering to speed up data processing, and managed large genealogy datasets."],
    [/cert|nse|fortinet|cisco|udemy|huawei|accenture|course|sertipiko/i,
      "Hans holds Fortinet NSE 1 and NSE 2 (Certified in Cybersecurity), Cisco Network Defense, Fortinet Cybersecurity and Cloud Fundamentals, Huawei HCIA-Datacom, Accenture Back End Development (138 h), and Udemy courses in Java, Spring Boot, Docker, JUnit, Git and Maven."],
    [/splunk|wireshark|nmap|kali|soc\b|security|cyber|incident|triage|attack|lab/i,
      "Hans is training as a Tier 1 SOC analyst:\n- Splunk: a SOC dashboard, detections and a scheduled alert on BOTS v2, plus alert triage\n- Wireshark: traffic analysis and cleartext credential exposure\n- Nmap on Kali Linux: enumeration and NSE vuln scans\n- An incident report mapped to MITRE ATT&CK\nSee the Projects section for screenshots and full write-ups."],
    [/project|proyekto|capstone|citu|secure|face|opencv|built/i,
      "- CITU-Secure (2024): a campus visitor management system; Hans built the backend for visitor tracking\n- Real-Time Face Recognition (2023-2024): OpenCV + Python; Hans built the backend and collected training data"],
    [/speak|english|filipino|cebuano|tagalog/i,
      "Hans is fluent in English, Filipino and Cebuano."],
    [/skill|stack|tech|language(s)? (do|does)|program|python|java|react|know|kasanayan|kahibalo|kaya/i,
      "Java, Python, React.js, HTML/CSS, web scraping and n8n workflow automation; DNS/SSL, hosting and email protocols; prompt engineering and OpenCV; Splunk, Wireshark, Nmap and Kali Linux; plus WordPress, Photoshop and Git."],
    [/experience|work(ed)? (history|at)|job|career|background|trabaho|karanasan|kasinatian/i,
      "- IONOS Philippines: Website Administration, migrated 4,000+ websites (Sep 2025 - Feb 2026)\n- Lifewood Data Technology: IT Intern, web scraping and AI-assisted data work (Jan - Apr 2025)"],
    [/school|stud(y|ied)|educat|degree|universit|college|cit-?u|eskwela|skwelahan|nag-aral|paaralan/i,
      "Hans studied at Cebu Institute of Technology - University (CIT-U) in Cebu City, 2019-2025."],
    [/where|locat|based|live|cebu|remote|saan|asa|taga/i,
      "Hans is based in Mandaue City, Cebu, Philippines."],
    [/hire|availab|open to|role|looking|position|salary|rate/i,
      `Hans is open to Backend Developer and IT Specialist roles, and is training toward Tier 1 SOC analyst work. For availability or pay, email Hans at ${EMAIL}.`],
    [/resume|résumé|\bcv\b|curriculum/i,
      "You can view or download Hans's résumé from the Résumé button at the top of the page or in the Contact section."],
    [/contact|email|reach|message|touch|call|phone|linkedin|kontak|kontakon|makontak/i,
      `The quickest way to reach Hans is email: ${EMAIL}.`],
  ];
  const offlineAnswer = (q) =>
    (OFFLINE.find(([re]) => re.test(q)) || [null,
      `I'm not sure about that one. Try asking about Hans's experience, projects, skills, security labs or certificates, or email Hans at ${EMAIL}.`])[1];

  /* Render a reply as text: "- " lines become a list, the email becomes a link. Never uses innerHTML. */
  function addText(parent, text) {
    const parts = text.split(EMAIL);
    parts.forEach((part, i) => {
      parent.append(part);
      if (i < parts.length - 1) {
        const a = document.createElement("a");
        a.href = "mailto:" + EMAIL;
        a.textContent = EMAIL;
        parent.append(a);
      }
    });
  }
  function renderReply(el, text) {
    let list = null;
    text.split("\n").forEach((line) => {
      const bullet = line.match(/^\s*[-•*]\s+(.*)/);
      if (bullet) {
        if (!list) { list = document.createElement("ul"); el.append(list); }
        const li = document.createElement("li");
        addText(li, bullet[1].replace(/\*\*/g, ""));
        list.append(li);
      } else if (line.trim()) {
        list = null;
        const p = document.createElement("p");
        addText(p, line.replace(/\*\*/g, ""));
        el.append(p);
      }
    });
  }

  function addMessage(role, text, note) {
    const msg = document.createElement("div");
    msg.className = `chat__msg chat__msg--${role}`;
    if (role === "user") msg.textContent = text;
    else renderReply(msg, text);
    if (note) {
      const small = document.createElement("span");
      small.className = "chat__note";
      small.textContent = note;
      msg.append(small);
    }
    log.append(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  }

  function showTyping() {
    const t = document.createElement("div");
    t.className = "chat__msg chat__msg--assistant chat__typing";
    t.setAttribute("aria-label", "Typing");
    t.innerHTML = "<span></span><span></span><span></span>";
    log.append(t);
    log.scrollTop = log.scrollHeight;
    return t;
  }

  async function askLive() {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-12) }),
    });
    if (r.ok) return (await r.json()).reply;
    if (r.status === 429) return "You're sending messages quickly. Please wait a minute and try again.";
    const err = new Error("unavailable");
    err.permanent = r.status === 404 || r.status === 503 || r.status === 405;
    throw err;
  }

  async function ask(question) {
    question = question.trim().slice(0, 600);
    if (!question || busy) return;
    busy = true;
    sendBtn.disabled = true;
    suggestions.hidden = true;
    addMessage("user", question);
    history.push({ role: "user", content: question });
    const typing = showTyping();

    let reply, note = null;
    if (live) {
      try {
        reply = await askLive();
      } catch (e) {
        if (e.permanent) live = false;
        reply = offlineAnswer(question);
        note = "Quick answer from Hans's portfolio (live AI is offline)";
      }
    } else {
      await new Promise((r) => setTimeout(r, 450)); // brief pause so the reply doesn't feel abrupt
      reply = offlineAnswer(question);
    }

    typing.remove();
    addMessage("assistant", reply, note);
    history.push({ role: "assistant", content: reply });
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  }

  /* Open / close */
  function setOpen(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", open);
    fab.classList.toggle("is-open", open);
    if (open) setTimeout(() => input.focus(), 50);
  }
  fab.addEventListener("click", () => setOpen(panel.hidden));
  panel.querySelector(".chat__close").addEventListener("click", () => { setOpen(false); fab.focus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); fab.focus(); } });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = "";
    ask(q);
  });
  suggestions.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => ask(b.textContent)));
})();
