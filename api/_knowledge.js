// Facts the chat assistant may use. Keep this in sync with index.html.
// Files starting with "_" inside /api are not deployed as endpoints by Vercel.
export const KNOWLEDGE = `
# Hans Werner A. Huyo

## Basics
- Full name: Hans Werner Almendras Huyo (goes by Hans).
- Based in Mandaue City, Cebu, Philippines. Open to work.
- Email: hanswernerhuyo@gmail.com (the best way to reach him).
- Résumé: visitors can view or download it with the Résumé button at the top of the page or in the Contact section.
- Education: College at Cebu Institute of Technology - University (CIT-U), N. Bacalso Ave, Cebu City, 2019-2025. Senior High School (2017-2019), Junior High School (2013-2017) and Elementary (2007-2013) at Colegio de la Inmaculada Concepcion, Tipolo, Mandaue City, Cebu.
- Languages: English, Filipino and Cebuano, all fluent.
- Looking for: Backend Developer or IT Specialist roles; also training as a Tier 1 SOC analyst.

## Experience
- IONOS Philippines Inc. - Representative, Website Administration (Website Migration), full-time, Sep 2025 - Feb 2026.
  - Migrated 4,000+ websites from legacy platforms to IONOS infrastructure within a strict 3.5-month timeline.
  - Met a quota of 3 full-site migrations per day, working around tool limitations and server-side delays.
  - Checked every site after migration so no data was lost and DNS changes didn't take live sites offline.
  - Skills used: DNS, SSL, hosting, email protocols (IMAP/POP3), QA.
- Lifewood Data Technology Philippines - IT Intern, Jan 2025 - Apr 2025.
  - Wrote web scraping scripts that automated data collection and cut manual work.
  - Used AI tools and prompt engineering to speed up data processing and genealogy workflows.
  - Design and backend data entry for genealogy-focused web projects; managed large genealogy datasets.

## Projects
- Roxy (Hans's latest project, Jun 2025 - present, live): a Discord stats bot in Python 3.13 (discord.py 2.5, SQLite via aiosqlite, openpyxl) that turns chat, voice, gaming, app and Spotify activity into XP, levels, profiles and leaderboards automatically. Live in 23 servers with 1,600+ members, 258 tracked users and 21,000+ recorded sessions. Highlights: fixed stuck sessions that had added tens of thousands of fake hours and removed 269 duplicates, then recalculated everyone's XP; an anti-spam XP system (fair voice XP only while talking with someone, 24-hour session cap); User / Server Admin / Owner permissions; message content is never stored; crash recovery, a single-instance lock and 24/7 auto-restart; interactive menus with 54 achievements. Code: https://github.com/LT1019/Roxy-Backup · Case study: https://github.com/LT1019/Roxy-Backup/blob/main/docs/CASE_STUDY.md · Privacy Policy and Terms: https://github.com/LT1019/Roxy-Docs
- CITU-Secure (capstone, Jan 2024 - Dec 2024, Backend Developer): a visitor management system for the CIT-U campus that tracks each visitor's personal information, purpose of visit, and entry/exit times. Hans built the backend for visitor management and tracking.
- Real-Time Face Recognition (2023 - 2024, Backend & Data Collection): OpenCV + Python system that identifies faces in live video. Hans built the backend and collected the training data that improved accuracy.

## Skills (what he can do)
- Backend development in Java and Python (e.g. the CITU-Secure visitor-tracking backend).
- Automation: web scrapers and n8n workflows.
- Website migration & hosting: DNS, SSL, email (IMAP/POP3), WordPress/CMS fixes.
- Security monitoring: Splunk detections and dashboards, Wireshark, Nmap, incident write-ups mapped to MITRE ATT&CK.
- AI & data: prompt engineering, data processing, OpenCV.
- Communication: technical writing, client support; English, Filipino and Cebuano (all fluent).

## Tech stack
- Languages: Java, Python, JavaScript, HTML/CSS.
- Frameworks & build: React.js, Spring Boot, Hibernate, JUnit, Maven, Docker, OpenCV (several from Udemy/Accenture coursework).
- Automation & AI: n8n, web scraping, Claude, prompt engineering.
- Security: Splunk, Wireshark, Nmap, Kali Linux, VirtualBox, MITRE ATT&CK.
- Hosting & web: IONOS, Vercel, WordPress, DNS/SSL, IMAP/POP3.
- Design & tools: Git/GitHub, Photoshop, Illustrator, MS Office.

## Cybersecurity lab work (SOC analyst training)
- Splunk SOC Overview Dashboard on the BOTS v2 dataset: KPI, breakdown and detail panels wired to shared Sourcetype/Host/Time filters; detections for high-volume accounts, network scanning and web path enumeration; the scanning detection saved as a scheduled email alert.
- Wireshark lab series (six activities + capstone): capture vs display filters, TCP handshakes, DHCP and ARP, extracting test credentials from HTTP Basic Auth and FTP and showing HTTPS/SFTP hide them; capstone incident report with his own filters and recommendations.
- Incident report "Operation Manila Fog" (training exercise): after-hours privileged login, new Domain Admin account and 2.1 GB outbound over HTTPS on a domain controller; mapped to MITRE ATT&CK T1078.002, T1136.002, T1098 and T1041; rated Critical; checked the IP on VirusTotal, AbuseIPDB and Shodan; wrote the ticket and an SBAR escalation.
- Splunk Tier 1 triage workbook on BOTS v2 (68.9M events, 103 sourcetypes): found a crafted <script> payload trying to create an admin user, flagged 10.0.1.120 hitting 5,769 distinct ports as likely reconnaissance, cleared PowerShell activity as benign Splunk forwarder behaviour.
- Nmap on Kali Linux: home network discovery, full service enumeration of Metasploitable 2, SYN vs Connect vs UDP scan comparison in Wireshark, NSE scripts (safe, discovery, auth, vuln) confirming the vsFTPd 2.3.4 backdoor (CVE-2011-2523).
- In progress: GoPhish phishing simulation and a honeypot (blue/red/purple team).
- All labs were run on his own network or purpose-built vulnerable VMs.

## Certificates
- Fortinet NSE 1, NSE 2 and NSE 3 Certified in Cybersecurity (Sep 28-29, 2026, valid to Sep 2028).
- Cisco Networking Academy - Network Defense, delivered by Delivering Skills (Sep 28, 2026).
- Huawei - HCIA-Datacom course (Jun 9, 2022).
- Accenture Technology Academy - Back End Development (Sep - Dec 2023, 138 hours).
- Udemy: Java Programming Masterclass (132 h), Spring Boot 3 / Spring 6 & Hibernate (33.5 h), Docker for the Absolute Beginner (4.5 h), Java Unit Testing with JUnit & Mockito (5 h), Git Complete (6.5 h), Maven Crash Course (2.5 h), Eclipse Tutorial (1.5 h), all 2023.
- Credly profile with his badges: https://www.credly.com/users/hans-werner-huyo
`;
