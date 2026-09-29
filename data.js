/* Everything shown on the Projects and Certificates archive pages (projects.html, certificates.html).
   Dates are "YYYY-MM" (projects) or "YYYY-MM-DD" (certificates); `end` is omitted for single-date items.
   `category` drives the category filter (work / school / project / personal for projects); `featured` items also appear on the home page. */
window.PORTFOLIO = {
  projects: [
    {
      id: "soc-dashboard", category: "project", start: "2026-09", dateLabel: "Sep 2026",
      title: "SOC Overview Dashboard", org: "Splunk Enterprise · BOTS v2 dataset",
      summary: "A filterable Splunk dashboard with KPI, breakdown and detail panels tied to shared Sourcetype, Host and Time inputs, plus three detection panels and a scheduled email alert.",
      tags: ["Splunk", "SPL", "Dashboards", "Alerting"],
      image: "assets/labs/splunk/12.webp", gallery: { key: "splunk", start: 11 }, doc: "assets/docs/splunk-soc-dashboard.pdf"
    },
    {
      id: "wireshark", category: "project", start: "2026-09", dateLabel: "Sep 2026",
      title: "Network Traffic Analysis", org: "Wireshark · Beginner to advanced",
      summary: "Six activities and a capstone: capture vs. display filters, TCP handshakes, DHCP and ARP, and pulling test credentials out of HTTP and FTP to show why HTTPS and SFTP matter.",
      tags: ["Wireshark", "TCP/IP", "DNS / DHCP / ARP", "TLS / SSH"],
      image: "assets/labs/wireshark/18.webp", gallery: { key: "wireshark", start: 17 }, doc: "assets/docs/wireshark-lab-series.pdf"
    },
    {
      id: "nmap", category: "project", start: "2026-09", dateLabel: "Sep 2026",
      title: "Network Scanning & Enumeration", org: "Nmap · Kali Linux & Metasploitable 2",
      summary: "Home network discovery, full service enumeration of Metasploitable 2, SYN vs. Connect vs. UDP scans compared in Wireshark, and NSE scripts that confirmed the vsFTPd 2.3.4 backdoor.",
      tags: ["Nmap", "NSE", "Kali Linux", "Enumeration"],
      image: "assets/labs/nmap/11.webp", gallery: { key: "nmap", start: 10 }, doc: "assets/docs/nmap-activities.pdf"
    },
    {
      id: "manila-fog", category: "project", start: "2026-09", dateLabel: "Sep 2026",
      title: "Operation Manila Fog", org: "Incident reporting · Training exercise",
      summary: "Three alerts on a domain controller worked into one incident: mapped to MITRE ATT&CK, rated Critical, the external IP checked on VirusTotal, AbuseIPDB and Shodan, and escalated with an SBAR briefing.",
      tags: ["Incident Response", "MITRE ATT&CK", "Threat Intel", "SBAR"],
      visual: { icon: "alert", label: "INC-0915-001 · CRITICAL" }, doc: "assets/docs/incident-response-manila-fog.pdf"
    },
    {
      id: "bots-triage", category: "project", start: "2026-09", dateLabel: "Sep 2026",
      title: "Alert Triage on BOTS v2", org: "Splunk · Tier 1 SOC workbook",
      summary: "15 lessons and 10 labs of Tier 1 triage across 68.9M events: a crafted script payload on an admin panel, likely port-scan reconnaissance, and PowerShell activity cleared as benign.",
      tags: ["Triage", "SPL", "DNS / HTTP analysis", "Escalation"],
      visual: { icon: "search", label: "index=botsv2 | stats count" }, doc: "assets/docs/splunk-tier1-triage-workbook.pdf"
    },
    {
      id: "gophish-honeypot", category: "project", start: "2026-09", dateLabel: "In progress", status: "In progress",
      title: "GoPhish & Honeypot", org: "Blue / Red / Purple team",
      summary: "A phishing simulation with GoPhish and a honeypot deployment, looked at from the attacker's side, the defender's side, and both working together.",
      tags: ["GoPhish", "Honeypot", "Red Team", "Blue Team"],
      visual: { icon: "hook", label: "Purple team" }
    },
    {
      id: "portfolio", category: "personal", start: "2026-09", dateLabel: "Sep 2026", featured: true,
      title: "This Portfolio + Ask Hans AI", org: "Personal project",
      summary: "The site you're on: hand-written HTML, CSS and JavaScript with a screenshot viewer, filterable archives, and an AI chat assistant powered by Claude through a Vercel serverless function.",
      tags: ["HTML/CSS", "JavaScript", "Vercel", "Claude API"],
      image: "assets/projects/portfolio.webp", links: [{ label: "Source on GitHub", href: "https://github.com/LT1019/portfolio" }]
    },
    {
      id: "ionos-migration", category: "work", start: "2025-09", end: "2026-02", dateLabel: "Sep 2025 – Feb 2026",
      title: "Large-Scale Website Migration", org: "IONOS Philippines Inc.",
      summary: "Migrated 4,000+ websites from legacy platforms to IONOS infrastructure in 3.5 months at 3 full-site migrations a day, checking every site so no data was lost and DNS changes didn't take live sites offline.",
      tags: ["DNS", "SSL", "Hosting", "QA"],
      visual: { icon: "server", label: "4,000+ sites · 0 data loss" }
    },
    {
      id: "lifewood-scraping", category: "work", start: "2025-01", end: "2025-04", dateLabel: "Jan – Apr 2025",
      title: "Web Scraping & AI Data Pipelines", org: "Lifewood Data Technology · Internship",
      summary: "Web scraping scripts that automated data collection, plus AI tools and prompt engineering to speed up processing of large genealogy datasets.",
      tags: ["Python", "Web Scraping", "AI", "Data"],
      visual: { icon: "code", label: "scrape → clean → load" }
    },
    {
      id: "citu-secure", category: "school", start: "2024-01", end: "2024-12", dateLabel: "Jan – Dec 2024", featured: true,
      title: "CITU-Secure", org: "Capstone · Backend Developer",
      summary: "A visitor management system that improves security on the CIT-U campus by tracking each visitor's details, purpose of visit, and entry and exit times. I built the backend for visitor management and tracking.",
      tags: ["Backend", "Visitor Tracking", "Security"],
      image: "assets/projects/citu-secure.webp"
    },
    {
      id: "face-recognition", category: "school", start: "2023-01", end: "2024-12", dateLabel: "2023 – 2024", featured: true,
      title: "Real-Time Face Recognition", org: "Backend & Data Collection",
      summary: "A face recognition system built with OpenCV and Python that identifies faces in live video. I built the backend and collected the training data that made the model more accurate.",
      tags: ["Python", "OpenCV", "Computer Vision"],
      image: "assets/projects/face-recognition.webp"
    }
  ],

  certificates: [
    { id: "nse1", category: "security", date: "2026-09-28", dateLabel: "Sep 28, 2026 · valid to Sep 2028", featured: true,
      title: "Fortinet NSE 1 Certified in Cybersecurity", issuer: "Fortinet Training Institute", tags: ["Certification", "Cybersecurity"],
      image: "assets/certs/fortinet-nse1-certified.webp", gallery: 0,
      verify: "https://training.fortinet.com/admin/tool/certificate/index.php", note: "Validation no. 5590515085HW" },
    { id: "nse2", category: "security", date: "2026-09-29", dateLabel: "Sep 29, 2026 · valid to Sep 2028", featured: true,
      title: "Fortinet NSE 2 Certified in Cybersecurity", issuer: "Fortinet Training Institute", tags: ["Certification", "Cybersecurity"],
      image: "assets/certs/fortinet-nse2-certified.webp", gallery: 1,
      verify: "https://training.fortinet.com/admin/tool/certificate/index.php", note: "Validation no. 1964637097HW" },
    { id: "cisco-nd", category: "security", date: "2026-09-28", dateLabel: "Sep 28, 2026", featured: true,
      title: "Network Defense", issuer: "Cisco Networking Academy", tags: ["Firewalls", "PKI", "Identity management", "Cloud security"],
      image: "assets/certs/cisco-network-defense.webp", gallery: 2 },
    { id: "fortinet-ccf", category: "security", date: "2026-09-29", dateLabel: "Sep 29, 2026",
      title: "Cybersecurity and Cloud Fundamentals 1.0", issuer: "Fortinet Training Institute", tags: ["Security awareness", "Cloud", "Threat landscape"],
      image: "assets/certs/fortinet-nse1.webp", gallery: 3 },
    { id: "nse3", category: "security", dateLabel: "Fortinet NSE", badge: "NSE 3",
      title: "NSE 3", issuer: "Fortinet Training Institute", tags: ["Security Fabric"] },
    { id: "huawei", category: "networking", date: "2022-06-09", dateLabel: "Jun 9, 2022",
      title: "HCIA-Datacom Course", issuer: "Huawei Talent Online", tags: ["Routing", "Switching", "Datacom"],
      image: "assets/certs/huawei-hcia-datacom.webp", gallery: 4,
      verify: "https://ilearningx.huawei.com/portal/certificates/e516957cbd524729b1a90fcea7887dd6" },
    { id: "accenture", category: "development", date: "2023-12-15", dateLabel: "Sep – Dec 2023 · 138 hrs", featured: true,
      title: "Back End Development", issuer: "Accenture Technology Academy", tags: ["Backend", "Java"],
      image: "assets/certs/accenture-backend.webp", gallery: 5 },
    { id: "java", category: "development", date: "2023-10-01", dateLabel: "Oct 1, 2023 · 132 hrs",
      title: "Java Programming Masterclass (Java 17)", issuer: "Udemy · Tim Buchalka", tags: ["Java"],
      image: "assets/certs/udemy-java-masterclass.webp", gallery: 6, verify: "https://ude.my/UC-7209fab7-3c48-4494-9a9f-80c865dfc112" },
    { id: "spring", category: "development", date: "2023-10-12", dateLabel: "Oct 12, 2023 · 33.5 hrs",
      title: "Spring Boot 3, Spring 6 & Hibernate for Beginners", issuer: "Udemy · Chad Darby", tags: ["Spring Boot", "Hibernate"],
      image: "assets/certs/udemy-spring-hibernate.webp", gallery: 7, verify: "https://ude.my/UC-8d826e56-7633-4573-bcf0-521cf291f706" },
    { id: "docker", category: "development", date: "2023-11-10", dateLabel: "Nov 10, 2023 · 4.5 hrs",
      title: "Docker for the Absolute Beginner – Hands On", issuer: "Udemy · KodeKloud", tags: ["Docker", "DevOps"],
      image: "assets/certs/udemy-docker.webp", gallery: 8, verify: "https://ude.my/UC-38ad598b-0ed0-4cb7-b274-0bd5485de9b0" },
    { id: "junit", category: "development", date: "2023-10-03", dateLabel: "Oct 3, 2023 · 5 hrs",
      title: "Java Unit Testing with JUnit & Mockito", issuer: "Udemy · in28Minutes", tags: ["JUnit", "Mockito"],
      image: "assets/certs/udemy-junit-mockito.webp", gallery: 9, verify: "https://ude.my/UC-b42f91ff-e927-49ba-86b6-f4650f5d8a3b" },
    { id: "git", category: "development", date: "2023-09-26", dateLabel: "Sep 26, 2023 · 6.5 hrs",
      title: "Git Complete: The Definitive Guide to Git", issuer: "Udemy · Jason Taylor", tags: ["Git"],
      image: "assets/certs/udemy-git.webp", gallery: 10, verify: "https://ude.my/UC-6da35939-8e89-4f1b-ba31-bd03230364a0" },
    { id: "maven", category: "development", date: "2023-09-26", dateLabel: "Sep 26, 2023 · 2.5 hrs",
      title: "Maven Crash Course for Beginners", issuer: "Udemy · Jason Taylor", tags: ["Maven"],
      image: "assets/certs/udemy-maven.webp", gallery: 11, verify: "https://ude.my/UC-db5d0a8a-83ed-4932-804b-10c437304af5" },
    { id: "eclipse", category: "development", date: "2023-09-27", dateLabel: "Sep 27, 2023 · 1.5 hrs",
      title: "Eclipse Tutorial: Learn Java IDE in 10 Steps", issuer: "Udemy · in28Minutes", tags: ["Eclipse", "Java"],
      image: "assets/certs/udemy-eclipse.webp", gallery: 12, verify: "https://ude.my/UC-04d28e84-e43d-4448-91c9-0165cf10ce6e" }
  ]
};
