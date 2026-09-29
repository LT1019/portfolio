/* ---------- "Ask about Hans" chat widget ----------
   Sends the conversation to /api/chat (Claude, via a Vercel function). If that endpoint is
   missing or not configured (local preview, no API key), it answers with chat-offline.js. */
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

  /* Offline answers live in chat-offline.js (English, Tagalog and Cebuano) */
  const offlineAnswer = (q) => window.HansOffline.answer(q);

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
