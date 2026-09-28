/* Image galleries for the Security and Certificates sections, opened by [data-gallery] buttons.
   A shot is either a caption (image at dir/NN.webp) or { src, cap }. */
window.LAB_GALLERIES = {
  wireshark: {
    title: "Wireshark Lab Series",
    dir: "assets/labs/wireshark/",
    shots: [
      "Activity 1 · DNS packets isolated from a live capture",
      "Activity 1 · TCP packets, including handshakes and resets",
      "Activity 1 · Plain HTTP requests generated with curl",
      "Activity 1 · Combined filter: dns or tcp or http",
      "Activity 2 · Capture filter host 8.8.8.8: 4 pings, 8 ICMP packets",
      "Activity 2 · Display filter dns (42 packets)",
      "Activity 2 · Display filter tcp.port == 80 (24 packets)",
      "Activity 2 · Display filter ip.addr == default gateway (28 packets)",
      "Activity 2 · Display filter http.request, incl. SSDP M-SEARCH from the LAN",
      "Activity 3 · http.request: the curl GETs to neverssl.com and example.com",
      "Activity 3 · http.response: both sites answered 200 OK",
      "Activity 3 · tcp.flags.syn==1 to locate the three-way handshakes",
      "Activity 3 · Following a single TCP stream",
      "Activity 4 · DHCP Discover, Offer, Request, ACK after ipconfig /renew",
      "Activity 4 · ARP requests, replies, probes and announcements",
      "Activity 5 · http.authorization isolates the Basic Auth request",
      "Activity 5 · Wireshark decodes the Base64 header to labuser:Lab12345",
      "Activity 5 · Follow HTTP Stream shows the full request and response",
      "Activity 5 · Extra credit: over HTTPS only encrypted TLS records are visible",
      "Activity 5 · TLS session to httpbin.org: only the SNI is readable",
      "Activity 5 · SFTP to test.rebex.net: every SSH packet is encrypted",
      "Activity 5 · SSH TCP stream: key exchange, then unreadable ciphertext",
      "Activity 5 · SSH TCP stream (continued)",
      "Activity 6 · Protocol Hierarchy: QUIC 40.8% and TLS 28.2% of bytes",
      "Activity 6 · Conversations sorted by bytes",
      "Activity 6 · Endpoints view",
      "Activity 6 · tcp.analysis.flags: 138 flagged packets to follow up",
      "Capstone · Protocol Hierarchy of the investigation capture",
      "Capstone · tcp.port == 21: USER demo and PASS password in cleartext",
      "Capstone · Protocol Hierarchy filtered to FTP",
      "Capstone · ip.addr == 194.108.117.16: FTP control and data connections",
      "Capstone · Custom filter frame contains \"labuser\" (2 packets)",
      "Capstone · Custom filter: everything my PC sent over cleartext ports",
      "Capstone · Frame 678: decoded HTTP Basic Auth credentials",
      "Capstone · tcp.flags.reset == 1: no forced resets (0 packets)",
      "Capstone · ftp.request.command == \"PASS\""
    ]
  },
  nmap: {
    title: "Nmap on Kali Linux",
    dir: "assets/labs/nmap/",
    shots: [
      "Metasploitable 2 · nmap -sV -p- service and version enumeration",
      "Scan comparison · -sS (1.67 s), -sT (15.29 s) and -sU (117.28 s) against the gateway",
      "Scan comparison · SYN scan in Wireshark: SYN → SYN/ACK → RST",
      "Scan comparison · Connect scan in Wireshark: the full handshake completes",
      "Scan comparison · UDP scan in Wireshark: ICMP port unreachable replies",
      "NSE safe scripts · banners, HTTP titles, SMTP commands, MySQL info",
      "NSE safe scripts · Tomcat headers and smb-os-discovery results",
      "NSE discovery scripts · rpcinfo, dns-nsid and ajp-headers",
      "NSE discovery scripts · SMB shares with anonymous READ/WRITE and NetBIOS names",
      "NSE auth scripts · anonymous FTP login and an empty MySQL root password",
      "NSE vuln scripts · vsFTPd 2.3.4 backdoor (CVE-2011-2523) confirmed exploitable"
    ]
  },
  splunk: {
    title: "Splunk SOC Dashboard (BOTS v2)",
    dir: "assets/labs/splunk/",
    shots: [
      "Total Events KPI tile",
      "Breakdown pies: events by sourcetype, host and hour of day",
      "Recent Event Detail table",
      "Sourcetype dropdown input (token st_tok)",
      "Host dropdown input (token host_tok)",
      "Shared Time Range picker with a Submit button",
      "Total Events search wired to the filter tokens",
      "Sourcetype dropdown filtered by the selected host",
      "Host dropdown filtered by the selected sourcetype",
      "Events by Hour of Day search on the Shared Time Picker",
      "Recent Event Detail search on the Shared Time Picker",
      "Testing the filters: winregistry selected, every panel updates",
      "Detection 1 search: High-Volume Accounts using coalesce()",
      "Detection 1 results: top accounts by event count and host spread",
      "Detection 2 search: Possible Network Scanning",
      "Detection 2 results: 10.0.1.120 touched 5,769 unique ports",
      "Detection 3 search: Web Path Enumeration (404s per source)",
      "Detection 3: drilling into a raw stream:http event",
      "Scanning detection saved as a scheduled alert with an email action"
    ]
  },
  certs: {
    title: "Certificates",
    shots: [
        {
              "src": "assets/certs/cisco-network-defense.webp",
              "cap": "Cisco Networking Academy · Network Defense · Sep 28, 2026"
        },
        {
              "src": "assets/certs/fortinet-nse1.webp",
              "cap": "Fortinet Training Institute · Cybersecurity and Cloud Fundamentals 1.0 (NSE 1) · Sep 29, 2026"
        },
        {
              "src": "assets/certs/huawei-hcia-datacom.webp",
              "cap": "Huawei Talent Online · HCIA-Datacom Course · Jun 9, 2022"
        },
        {
              "src": "assets/certs/accenture-backend.webp",
              "cap": "Accenture Technology Academy · Back End Development · Sep – Dec 2023 · 138 hrs"
        },
        {
              "src": "assets/certs/udemy-java-masterclass.webp",
              "cap": "Udemy · Tim Buchalka · Java Programming Masterclass (Java 17) · Oct 1, 2023 · 132 hrs"
        },
        {
              "src": "assets/certs/udemy-spring-hibernate.webp",
              "cap": "Udemy · Chad Darby · Spring Boot 3, Spring 6 & Hibernate for Beginners · Oct 12, 2023 · 33.5 hrs"
        },
        {
              "src": "assets/certs/udemy-docker.webp",
              "cap": "Udemy · KodeKloud · Docker for the Absolute Beginner – Hands On · Nov 10, 2023 · 4.5 hrs"
        },
        {
              "src": "assets/certs/udemy-junit-mockito.webp",
              "cap": "Udemy · in28Minutes · Java Unit Testing with JUnit & Mockito · Oct 3, 2023 · 5 hrs"
        },
        {
              "src": "assets/certs/udemy-git.webp",
              "cap": "Udemy · Jason Taylor · Git Complete: The Definitive Guide to Git · Sep 26, 2023 · 6.5 hrs"
        },
        {
              "src": "assets/certs/udemy-maven.webp",
              "cap": "Udemy · Jason Taylor · Maven Crash Course for Beginners · Sep 26, 2023 · 2.5 hrs"
        },
        {
              "src": "assets/certs/udemy-eclipse.webp",
              "cap": "Udemy · in28Minutes · Eclipse Tutorial: Learn Java IDE in 10 Steps · Sep 27, 2023 · 1.5 hrs"
        }
  ]
  }
};
