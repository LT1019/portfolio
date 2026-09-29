/* ---------- "Ask about Hans" offline answers ----------
   Used when the live AI (/api/chat) isn't available. Scores the question against intents with
   keywords in English, Tagalog and Cebuano (plus greetings/thanks in many languages), tolerates
   small typos, and replies in English, Tagalog or Cebuano to match the visitor.
   window.HansOffline.answer(question) -> reply text */
(function () {
  const EMAIL = "hanswernerhuyo@gmail.com";

  /* ----- Text helpers ----- */
  const normalize = (s) =>
    String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC")
      .replace(/[^a-z0-9぀-ヿ㐀-鿿가-힯-]+/g, " ").trim();

  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diag = prev[0];
      prev[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = prev[j];
        prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
        diag = tmp;
      }
    }
    return prev[b.length];
  }

  // keyword forms: "word" (exact, or 1 typo if 5+ letters), "pref*" (prefix), "two words" / non-Latin (substring)
  function hits(keywords, text, tokens) {
    let n = 0;
    for (const k of keywords) {
      if (k.endsWith("*")) {
        const p = k.slice(0, -1);
        if (tokens.some((t) => t.startsWith(p))) n++;
      } else if (k.includes(" ") || /[^\x00-\x7f]/.test(k)) {
        if ((" " + text + " ").includes(/[^\x00-\x7f]/.test(k) ? k : " " + k + " ")) n++;
      } else if (tokens.includes(k) || (k.length >= 5 && tokens.some((t) => t.length >= 4 && editDistance(t, k) <= 1))) {
        n++;
      }
    }
    return n;
  }

  /* ----- Language of the visitor (en / tl / ceb) ----- */
  const CEB = ["kinsa", "unsa", "unsay", "asa", "kanus-a", "giunsa", "unsaon", "pila", "nimo", "imong", "iyang", "karon", "dili", "naa", "ug", "og", "nga", "bahin", "man", "diay", "kang", "daghang", "nagtuon", "nagpuyo", "maayong", "sapayan", "kaayo", "ana", "mao"];
  const TL = ["sino", "ano", "anong", "saan", "kailan", "paano", "ilan", "kaniya", "ba", "po", "mga", "ng", "nang", "tungkol", "meron", "mayroon", "gusto", "kay", "nag-aral", "nakatira", "magandang", "anuman", "talaga", "siya", "yung", "yan", "ito"];
  function detectLang(tokens) {
    const c = tokens.filter((t) => CEB.includes(t)).length;
    const t = tokens.filter((x) => TL.includes(x)).length;
    if (c === 0 && t === 0) return tokens.includes("salamat") ? "tl" : "en";
    return c >= t ? "ceb" : "tl"; // Cebu-based site: a tie goes to Cebuano
  }

  /* ----- Intents: keywords + answers in en / tl / ceb ----- */
  const INTENTS = [
    { id: "greet", small: true, kw: ["hi", "hello", "hey", "yo", "helo", "hola", "bonjour", "ciao", "hallo", "salut", "ola", "namaste", "kumusta", "kamusta", "musta", "maayong buntag", "maayong hapon", "maayong gabii", "magandang umaga", "magandang hapon", "magandang gabi", "good morning", "good afternoon", "good evening", "konnichiwa", "annyeong", "nihao", "こんにちは", "안녕", "你好"],
      a: { en: "Hi! Ask me anything about Hans: experience, projects, skills, certificates, or how to reach Hans.",
           tl: "Kumusta! Magtanong ka tungkol kay Hans: karanasan, mga proyekto, skills, mga sertipiko, o kung paano makontak si Hans.",
           ceb: "Kumusta! Pangutana bahin kang Hans: kasinatian, mga proyekto, skills, mga sertipiko, o unsaon pagkontak kang Hans." } },
    { id: "thanks", small: true, kw: ["thanks", "thank", "thx", "ty", "salamat", "daghang salamat", "arigato", "arigatou", "gracias", "merci", "danke", "obrigado", "obrigada", "grazie", "xiexie", "kamsahamnida", "gomawo", "terima kasih", "shukran", "ありがとう", "감사", "고마워", "谢谢", "謝謝"],
      a: { en: "You're welcome! Anything else you'd like to know about Hans?",
           tl: "Walang anuman! May iba ka pa bang gustong malaman tungkol kay Hans?",
           ceb: "Walay sapayan! Naa pa bay gusto nimong mahibaloan bahin kang Hans?" } },
    { id: "bye", small: true, kw: ["bye", "goodbye", "paalam", "babay", "adios", "sayonara", "see you", "ingat", "later"],
      a: { en: `Thanks for stopping by! For anything else, email Hans at ${EMAIL}.`,
           tl: `Salamat sa pagbisita! Para sa iba pang tanong, i-email si Hans sa ${EMAIL}.`,
           ceb: `Salamat sa pagbisita! Para sa ubang pangutana, i-email si Hans sa ${EMAIL}.` } },
    { id: "bot", kw: ["are you", "you real", "robot", "bot", "chatbot", "ikaw ba", "ikaw si", "tawo ka", "tao ka", "sino ka", "kinsa ka", "who are you"],
      a: { en: `I'm an AI assistant for Hans's portfolio, not Hans. For anything personal, email Hans at ${EMAIL}.`,
           tl: `Isa akong AI assistant para sa portfolio ni Hans, hindi si Hans mismo. Para sa personal na tanong, i-email si Hans sa ${EMAIL}.`,
           ceb: `Usa ko ka AI assistant para sa portfolio ni Hans, dili si Hans mismo. Para sa personal nga pangutana, i-email si Hans sa ${EMAIL}.` } },
    { id: "who", kw: ["who", "kinsa", "sino", "about hans", "tell me about", "introduce", "introduction", "summary", "overview", "background"],
      a: { en: "Hans Werner A. Huyo is a Backend Developer and IT Specialist from Cebu and a graduate of CIT-U. Hans migrated 4,000+ websites at IONOS, builds automation with Python and n8n, and is training as a Tier 1 SOC analyst.",
           tl: "Si Hans Werner A. Huyo ay isang Backend Developer at IT Specialist mula sa Cebu, at nagtapos sa CIT-U. Nag-migrate si Hans ng mahigit 4,000 na website sa IONOS, gumagawa ng automation gamit ang Python at n8n, at nagsasanay bilang Tier 1 SOC analyst.",
           ceb: "Si Hans Werner A. Huyo usa ka Backend Developer ug IT Specialist gikan sa Cebu, ug graduate sa CIT-U. Nag-migrate si Hans og kapin 4,000 ka website sa IONOS, nagbuhat og automation gamit ang Python ug n8n, ug nagbansay isip Tier 1 SOC analyst." } },
    { id: "ionos", w: 2, kw: ["ionos", "migrat*", "website admin*", "4000", "4,000"],
      a: { en: "At IONOS Philippines (Sep 2025 – Feb 2026) Hans migrated 4,000+ websites to IONOS infrastructure in 3.5 months, at 3 full-site migrations a day, with no data loss. The work covered DNS, SSL, hosting and email (IMAP/POP3).",
           tl: "Sa IONOS Philippines (Set 2025 – Peb 2026), nag-migrate si Hans ng mahigit 4,000 na website sa loob ng 3.5 buwan, 3 buong site bawat araw, nang walang nawalang data. Kasama rito ang DNS, SSL, hosting at email.",
           ceb: "Sa IONOS Philippines (Sep 2025 – Peb 2026), nag-migrate si Hans og kapin 4,000 ka website sulod sa 3.5 ka bulan, 3 ka tibuok site kada adlaw, nga walay nawala nga data. Apil niini ang DNS, SSL, hosting ug email." } },
    { id: "lifewood", w: 2, kw: ["lifewood", "intern*", "ojt", "genealogy"],
      a: { en: "As an IT intern at Lifewood Data Technology (Jan – Apr 2025), Hans wrote web scraping scripts, used AI tools and prompt engineering to speed up data processing, and managed large genealogy datasets.",
           tl: "Bilang IT intern sa Lifewood Data Technology (Ene – Abr 2025), gumawa si Hans ng mga web scraping script, gumamit ng AI at prompt engineering para mapabilis ang data processing, at nag-manage ng malalaking genealogy dataset.",
           ceb: "Isip IT intern sa Lifewood Data Technology (Ene – Abr 2025), naghimo si Hans og mga web scraping script, migamit og AI ug prompt engineering aron mapaspas ang data processing, ug nag-manage og dagkong genealogy dataset." } },
    { id: "experience", kw: ["experience", "experiences", "work", "worked", "working", "job", "jobs", "career", "employ*", "company", "companies", "trabaho", "nagtrabaho", "karanasan", "kasinatian", "kompanya"],
      a: { en: "- IONOS Philippines (Sep 2025 – Feb 2026): Website Administration, migrated 4,000+ websites\n- Lifewood Data Technology (Jan – Apr 2025): IT Intern, web scraping and AI-assisted data work",
           tl: "- IONOS Philippines (Set 2025 – Peb 2026): Website Administration, nag-migrate ng mahigit 4,000 na website\n- Lifewood Data Technology (Ene – Abr 2025): IT Intern, web scraping at data work gamit ang AI",
           ceb: "- IONOS Philippines (Sep 2025 – Peb 2026): Website Administration, nag-migrate og kapin 4,000 ka website\n- Lifewood Data Technology (Ene – Abr 2025): IT Intern, web scraping ug data work gamit ang AI" } },
    { id: "projects", kw: ["project*", "proyekto", "capstone", "built", "build", "made", "gihimo", "ginawa", "citu", "citsecure", "face", "recognition", "portfolio", "thesis"],
      a: { en: "- CITU-Secure (2024, school): a campus visitor management system; Hans built the backend\n- Real-Time Face Recognition (2023–2024, school): OpenCV + Python\n- Security labs: Splunk, Wireshark, Nmap and incident response\n- This portfolio, with the Ask about Hans AI\nSee the Projects page for all of them.",
           tl: "- CITU-Secure (2024, school): visitor management system para sa campus; si Hans ang gumawa ng backend\n- Real-Time Face Recognition (2023–2024, school): OpenCV + Python\n- Mga security lab: Splunk, Wireshark, Nmap at incident response\n- Itong portfolio, kasama ang Ask about Hans AI\nTingnan ang Projects page para sa lahat.",
           ceb: "- CITU-Secure (2024, school): visitor management system para sa campus; si Hans ang naghimo sa backend\n- Real-Time Face Recognition (2023–2024, school): OpenCV + Python\n- Mga security lab: Splunk, Wireshark, Nmap ug incident response\n- Kining portfolio, uban ang Ask about Hans AI\nTan-awa ang Projects page para sa tanan." } },
    { id: "security", w: 2, kw: ["security", "cybersecurity", "cyber*", "soc", "splunk", "wireshark", "nmap", "kali", "incident", "triage", "hack*", "labs", "lab", "seguridad", "mitre", "phishing", "honeypot"],
      a: { en: "Hans is training as a Tier 1 SOC analyst:\n- Splunk: a SOC dashboard, detections and a scheduled alert, plus alert triage\n- Wireshark: traffic analysis\n- Nmap on Kali Linux: enumeration and vulnerability scans\n- An incident report mapped to MITRE ATT&CK\nEach lab has screenshots and a full write-up on the Projects page.",
           tl: "Nagsasanay si Hans bilang Tier 1 SOC analyst:\n- Splunk: SOC dashboard, mga detection at scheduled alert, at alert triage\n- Wireshark: traffic analysis\n- Nmap sa Kali Linux: enumeration at vulnerability scans\n- Incident report na naka-map sa MITRE ATT&CK\nMay screenshots at buong write-up ang bawat lab sa Projects page.",
           ceb: "Nagbansay si Hans isip Tier 1 SOC analyst:\n- Splunk: SOC dashboard, mga detection ug scheduled alert, ug alert triage\n- Wireshark: traffic analysis\n- Nmap sa Kali Linux: enumeration ug vulnerability scans\n- Incident report nga naka-map sa MITRE ATT&CK\nAduna'y screenshots ug tibuok write-up ang matag lab sa Projects page." } },
    { id: "certs", w: 2, kw: ["cert*", "sertipiko", "nse", "fortinet", "cisco", "udemy", "huawei", "accenture", "course", "courses", "kurso", "credential*", "badge*"],
      a: { en: "Hans holds Fortinet NSE 1 and NSE 2 (Certified in Cybersecurity), Cisco Network Defense, Fortinet Cybersecurity and Cloud Fundamentals, Huawei HCIA-Datacom, Accenture Back End Development (138 hrs), and Udemy courses in Java, Spring Boot, Docker, JUnit, Git and Maven.",
           tl: "Mga sertipiko ni Hans: Fortinet NSE 1 at NSE 2 (Certified in Cybersecurity), Cisco Network Defense, Fortinet Cybersecurity and Cloud Fundamentals, Huawei HCIA-Datacom, Accenture Back End Development (138 oras), at mga Udemy course sa Java, Spring Boot, Docker, JUnit, Git at Maven.",
           ceb: "Mga sertipiko ni Hans: Fortinet NSE 1 ug NSE 2 (Certified in Cybersecurity), Cisco Network Defense, Fortinet Cybersecurity and Cloud Fundamentals, Huawei HCIA-Datacom, Accenture Back End Development (138 ka oras), ug mga Udemy course sa Java, Spring Boot, Docker, JUnit, Git ug Maven." } },
    { id: "skills", kw: ["skill*", "skills", "kasanayan", "kahanas", "kahibalo", "stack", "tech", "technolog*", "tools", "program*", "coding", "code", "python", "java", "javascript", "react", "n8n", "automat*", "backend", "frontend", "kaya", "kabalo", "programming language"],
      a: { en: "Hans works with Java, Python, JavaScript and React; automation with web scraping and n8n; DNS, SSL, hosting and email; Splunk, Wireshark, Nmap and Kali Linux; and prompt engineering and OpenCV.",
           tl: "Mga skill ni Hans: Java, Python, JavaScript at React; automation gamit ang web scraping at n8n; DNS, SSL, hosting at email; Splunk, Wireshark, Nmap at Kali Linux; at prompt engineering at OpenCV.",
           ceb: "Mga skill ni Hans: Java, Python, JavaScript ug React; automation gamit ang web scraping ug n8n; DNS, SSL, hosting ug email; Splunk, Wireshark, Nmap ug Kali Linux; ug prompt engineering ug OpenCV." } },
    { id: "education", w: 2, kw: ["school", "eskwela*", "skwela*", "study", "studied", "studies", "aral", "nag-aral", "nagtuon", "university", "universidad", "college", "kolehiyo", "degree", "cit-u", "cit", "education", "edukasyon", "graduate*", "graduated", "gradwado", "course taken"],
      a: { en: "Hans studied at Cebu Institute of Technology – University (CIT-U) in Cebu City, 2019–2025.",
           tl: "Nag-aral si Hans sa Cebu Institute of Technology – University (CIT-U) sa Cebu City, 2019–2025.",
           ceb: "Nagtuon si Hans sa Cebu Institute of Technology – University (CIT-U) sa Cebu City, 2019–2025." } },
    { id: "spoken", w: 2, kw: ["speak", "speaks", "spoken", "languages", "language", "english", "filipino", "cebuano", "tagalog", "bisaya", "lengguwahe", "pinulongan", "wika", "sinultian"],
      a: { en: "Hans is fluent in English, Filipino and Cebuano.",
           tl: "Matatas si Hans sa English, Filipino at Cebuano.",
           ceb: "Hanas si Hans sa English, Filipino ug Cebuano." } },
    { id: "location", kw: ["where", "located", "location", "based", "live", "lives", "asa", "saan", "taga", "cebu", "mandaue", "address", "lugar", "nagpuyo", "nakatira", "remote"],
      a: { en: "Hans is based in Mandaue City, Cebu, Philippines.",
           tl: "Nakatira si Hans sa Mandaue City, Cebu, Philippines.",
           ceb: "Nagpuyo si Hans sa Mandaue City, Cebu, Philippines." } },
    { id: "hire", w: 2, kw: ["hire", "hiring", "available", "availability", "open to", "role", "roles", "position", "salary", "rate", "sweldo", "suweldo", "sahod", "apply", "vacancy", "freelance", "full-time", "fulltime"],
      a: { en: `Hans is open to Backend Developer and IT Specialist roles, and is training toward Tier 1 SOC analyst work. For availability or pay, email Hans at ${EMAIL}.`,
           tl: `Bukas si Hans sa mga Backend Developer at IT Specialist na posisyon, at nagsasanay para sa Tier 1 SOC analyst. Para sa availability o sahod, i-email si Hans sa ${EMAIL}.`,
           ceb: `Bukas si Hans sa mga Backend Developer ug IT Specialist nga posisyon, ug nagbansay para sa Tier 1 SOC analyst. Para sa availability o sweldo, i-email si Hans sa ${EMAIL}.` } },
    { id: "contact", w: 2, kw: ["contact", "email", "e-mail", "reach", "message", "phone", "call", "number", "kontak", "makontak", "kontakon", "get in touch", "linkedin", "facebook"],
      a: { en: `The quickest way to reach Hans is email: ${EMAIL}.`,
           tl: `Ang pinakamabilis na paraan para makontak si Hans ay email: ${EMAIL}.`,
           ceb: `Ang pinakapaspas nga paagi aron makontak si Hans kay email: ${EMAIL}.` } },
    { id: "resume", w: 3, kw: ["resume", "cv", "curriculum"],
      a: { en: "You can view or download Hans's résumé with the Résumé button at the top of the page or in the Contact section.",
           tl: "Makikita o mada-download ang résumé ni Hans gamit ang Résumé button sa itaas ng page o sa Contact section.",
           ceb: "Makita o ma-download ang résumé ni Hans gamit ang Résumé button sa taas sa page o sa Contact section." } },
    { id: "personal", w: 2, kw: ["age", "old", "edad", "pila ka tuig", "ilang taon", "birthday", "married", "girlfriend", "boyfriend", "single", "family", "hobby", "hobbies", "religion"],
      a: { en: `That isn't on Hans's portfolio. You can ask Hans directly at ${EMAIL}.`,
           tl: `Wala iyan sa portfolio ni Hans. Maaari mong tanungin si Hans sa ${EMAIL}.`,
           ceb: `Wala na sa portfolio ni Hans. Mahimo nimong pangutan-on si Hans sa ${EMAIL}.` } },
  ];

  const FALLBACK = {
    en: `I'm not sure about that one. Try asking about Hans's experience, projects, skills or certificates, or email Hans at ${EMAIL}.`,
    tl: `Hindi ako sigurado diyan. Subukang magtanong tungkol sa karanasan, mga proyekto, skills o mga sertipiko ni Hans, o i-email si Hans sa ${EMAIL}.`,
    ceb: `Dili ko sigurado ana. Sulayi pagpangutana bahin sa kasinatian, mga proyekto, skills o mga sertipiko ni Hans, o i-email si Hans sa ${EMAIL}.`,
  };

  function answer(question) {
    const text = normalize(question);
    const tokens = text.split(/\s+/).filter(Boolean);
    const lang = detectLang(tokens);

    const scored = INTENTS
      .map((it) => { const h = hits(it.kw, text, tokens); return { it, h, s: h * (it.w || 1) }; })
      .filter((x) => x.h > 0)
      .sort((a, b) => b.s - a.s);
    if (!scored.length) return FALLBACK[lang];

    // Greetings/thanks/bye only win when nothing more specific was asked ("hi, who is Hans?" answers "who")
    const main = scored.filter((x) => !x.it.small);
    if (!main.length) return scored[0].it.a[lang];

    // "tell me about Hans's X" is about X; the summary only joins in when they actually asked who Hans is
    const askedWho = tokens.some((t) => ["who", "kinsa", "sino"].includes(t));
    let picks = main.filter((x) => x.it.id !== "who" || askedWho || main.length === 1);
    // "experience" is the general version of ionos/lifewood
    if (picks.some((x) => x.it.id === "ionos" || x.it.id === "lifewood")) picks = picks.filter((x) => x.it.id !== "experience");
    picks = picks.slice(0, 2).filter((x, i) => i === 0 || x.s >= picks[0].s * 0.5); // answer a second topic if it was clearly asked too
    picks.sort((a, b) => (b.it.id === "who") - (a.it.id === "who")); // the introduction reads best first
    return picks.map((x) => x.it.a[lang]).join("\n\n");
  }

  window.HansOffline = { answer };
})();
