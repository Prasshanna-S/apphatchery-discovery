/**
 * AppHatchery Discovery Experience — VERIFIED CONTENT INVENTORY
 * =============================================================
 * Single source of truth. Every version (V1 guide, V2 canvas, V3 WebGL, V4 widget)
 * renders from this file. Framework-agnostic: exported as an ES module AND attached
 * to window.AH so dependency-free pages (V1, V4) can use it without a bundler.
 *
 * VERIFICATION CONVENTION (per Phase 0 research brief):
 *   urlVerified: true   -> URL confirmed to resolve with expected content
 *   urlVerified: false  -> could not confirm; url may be null + `urlNote` explains
 *   description "[STUB] ..." -> placeholder; real content not yet verified
 *   evidenceType -> what proves this artifact is real/live
 *   All data gathered & cross-checked 2026-06-17 (5 research agents + firsthand crawl).
 *
 * ASSET SLOTS: every artifact has `asset` { sticker, mascot, screen } pointing into
 * /assets/*. These are slots — placeholders today, hot-swapped when high-fidelity
 * stickers/mascots are dropped in. Nothing else changes when assets arrive.
 */

export const ORG = {
  name: "AppHatchery",
  fullName: "Georgia CTSA AppHatchery",
  tagline: "From Aha! (idea) to Ahh (impact)",
  blurb: "A digital health incubator at Emory University that takes health-tech ideas from first sketch to launched, studied product.",
  founded: 2019,
  location: "Atlanta, Georgia",
  parent: "Georgia Clinical and Translational Science Alliance (Georgia CTSA)",
  nihGrant: "UL1TR002378",
  site: "https://apphatchery.org",
  officialPage: "https://georgiactsa.org/research/commercialization/apphatchery.html",
  github: "https://github.com/AppHatchery",
  linkedin: "https://www.linkedin.com/company/apphatchery/",
  // Disambiguation note for any future maintainer / AI assistant:
  notDisambiguation: "AppHatchery (apphatchery.org, Georgia CTSA digital-health studio) is NOT 'The Hatchery' (hatchery.emory.edu, Emory's student-startup incubator).",
  lastVerified: "2026-06-17"
};

/** Brand tokens mirrored in tokens.css — duplicated here for canvas/WebGL (need JS values). */
export const BRAND = {
  blue: "#105194",      // primary deep blue (h1/site chrome)
  blueAlt: "#19558F",   // heading blue
  blueTint: "#C3D3DE",  // soft blue-grey
  orange: "#F59A2C",    // yolk / "sunny side up" accent — keyword + CTA highlight
  orangeSoft: "#F2BB77",
  ink: "#15171A",       // near-black text (raised contrast vs site's true 14px grey)
  paper: "#FFFFFF",
  cream: "#F4F2EC",     // editorial off-white surface (Unseen-style)
  grid: "#2E6BB0",      // blueprint-grid line color (V2 canvas backdrop)
  fontDisplay: "'Geist', 'Geist Placeholder', system-ui, sans-serif",
  fontBody: "'Inter', 'Inter Placeholder', system-ui, sans-serif",
  fontMono: "'Geist Mono', ui-monospace, 'SF Mono', monospace", // bracket micro-labels
  radius: 10
};

/** Audience segments — used for routing + filter chips. */
export const AUDIENCES = {
  researcher:   { label: "Researcher / PI", short: "Researcher" },
  clinician:    { label: "Clinician / Provider", short: "Clinician" },
  caregiver:    { label: "Patient / Caregiver", short: "Patient & family" },
  publicHealth: { label: "Public Health", short: "Public health" },
  builder:      { label: "Has an idea to build", short: "Idea / builder" },
  explorer:     { label: "Just exploring", short: "Exploring" }
};

/** Problem-area taxonomy — derived from the actual portfolio, not assumed. */
export const PROBLEM_AREAS = {
  dataCollection:   "Data collection & diary studies",
  patientEd:        "Patient & caregiver education",
  clinicalSupport:  "Clinical decision support",
  languageAccess:   "Language access & communication",
  careNavigation:   "Care navigation & logistics",
  screening:        "Screening & early detection",
  surveillance:     "Surveillance & risk management",
  mentalHealth:     "Mental & behavioral health",
  prevention:       "Prevention & awareness",
  appGuidance:      "How to build a health app",
  research:         "Research methods & validation"
};

/**
 * ARTIFACTS — the things a visitor can be routed to.
 * type: "app" | "tool" | "publication" | "service" | "news"
 */
export const ARTIFACTS = [
  // ----------------------------- APPS -----------------------------
  {
    id: "fabla", type: "app", title: "Fabla", tagline: "Voice diaries for research",
    description: "A voice-first diary / ecological momentary assessment (EMA) app: study participants speak their entries instead of writing them, with recordings auto-uploaded to secure Emory-hosted storage for the research team.",
    url: "https://fabla.framer.website/", urlVerified: true,
    secondaryUrls: {
      iosAppStore: "https://apps.apple.com/us/app/fabla-audio-diary-kit/id6462336933",
      googlePlay: "https://play.google.com/store/apps/details?id=edu.emory.audio_diaries_flutter",
      github: "https://github.com/AppHatchery/Fabla-Front-end",
      paper: "https://doi.org/10.3758/s13428-025-02777-1"
    },
    audience: ["researcher", "caregiver"],
    problemAreas: ["dataCollection", "mentalHealth", "research"],
    evidenceType: "Live marketing site + iOS & Android store listings + open-source repo + peer-reviewed validation (Behavior Research Methods 2025)",
    foundAt: "apphatchery.org/work + App Store/Play + github.com/AppHatchery + PubMed",
    year: 2025, status: "live", publisher: "Emory University",
    partners: ["Dr. Deanna Kaplan (Emory SOM)", "Depts. of Spiritual Health & Preventive Medicine"],
    asset: { sticker: "assets/stickers/fabla.png", mascot: "assets/mascots/fabla-blob.png", screen: "assets/screens/fabla.png", logoVariants: ["assets/stickers/fabla.png","assets/stickers/fabla-wordmark.png","assets/stickers/fabla-icon.png"] },
    lastVerified: "2026-06-17",
    notes: "Used in psilocybin/MDD depression clinical trials; first app to collect speech biomarkers in the wild. Has a friendly blue blob mascot (asset to be provided)."
  },
  {
    id: "vocalis-care", type: "app", title: "Vocalis Care", tagline: "Talk with LEP patients, instantly",
    description: "A clinical-communication app for Limited-English-Proficiency patients: real-time voice-to-voice medical translation plus pre-translated quick-access phrase cards for high-stakes moments. A communication aid, not a replacement for professional interpreters.",
    url: "https://vocaliscare.com/", urlVerified: true,
    secondaryUrls: {
      iosAppStore: "https://apps.apple.com/us/app/vocalis-care/id6745276077"
    },
    audience: ["clinician", "publicHealth"],
    problemAreas: ["languageAccess", "clinicalSupport"],
    evidenceType: "Live product site (vocaliscare.com) + iOS App Store listing",
    foundAt: "apphatchery.org/work + vocaliscare.com + App Store",
    year: 2025, status: "live", publisher: "Emory University / VocalisCare (spin-out)",
    partners: ["Children's Healthcare of Atlanta", "Dr. Christina Calamaro", "Dr. Michael Fundora"],
    asset: { sticker: "assets/stickers/vocalis.png", mascot: null, screen: "assets/screens/vocalis.png" },
    lastVerified: "2026-06-17",
    notes: "iOS-only — no Android listing found (Phase 0). Founded by Santiago Arconada Alvarez; 2024 Emory IDEAward lineage. Works offline; ~5+ languages."
  },
  {
    id: "typeu", type: "app", title: "TypeU", tagline: "Type 1 diabetes care for families",
    description: "A companion app for parents and caregivers of children newly diagnosed with Type 1 Diabetes: bite-sized education, an insulin-dose calculator, and sick-day / emergency guidance mirroring the hospital nurse-line protocol.",
    url: "https://apphatchery.org/typeu", urlVerified: true,
    secondaryUrls: {
      iosAppStore: "https://apps.apple.com/us/app/typeu/id1641564536",
      googlePlay: "https://play.google.com/store/apps/details?id=edu.emory.diabetes.education",
      github: "https://github.com/AppHatchery/choa-diabetes-education"
    },
    audience: ["caregiver", "clinician"],
    problemAreas: ["patientEd", "clinicalSupport"],
    evidenceType: "Dedicated apphatchery.org page + iOS & Android listings + open-source repos",
    foundAt: "apphatchery.org/typeu + App Store/Play + github.com/AppHatchery",
    year: 2024, status: "live", publisher: "Children's Healthcare of Atlanta / Emory",
    partners: ["Children's Healthcare of Atlanta (CHOA)"],
    asset: { sticker: "assets/stickers/typeu.png", mascot: null, screen: "assets/screens/typeu.png", logoVariants: ["assets/stickers/typeu.png","assets/stickers/typeu-icon.png"] },
    lastVerified: "2026-06-17",
    notes: "~304k US children/adolescents have T1D. CHOA-affiliated care system."
  },
  {
    id: "ga-tb-guide", type: "app", title: "Georgia TB Reference Guide", tagline: "The TB handbook, searchable",
    description: "A mobile conversion of Georgia's 112-page printed TB reference guide: browse every chapter/table/chart, keyword-search drugs and protocols, bookmark, take notes, and reach the county-by-county TB coordinator directory — always current, unlike the paper edition.",
    url: "https://apphatchery.org/tbguide", urlVerified: true,
    secondaryUrls: {
      iosAppStore: "https://apps.apple.com/us/app/georgia-tb-reference-guide/id1583294462",
      googlePlay: "https://play.google.com/store/apps/details?id=org.apphatchery.gatbreferenceguide",
      paper: "https://doi.org/10.1371/journal.pone.0298758"
    },
    audience: ["clinician", "publicHealth"],
    problemAreas: ["clinicalSupport", "research"],
    evidenceType: "Dedicated apphatchery.org page + iOS & Android listings + peer-reviewed paper (PLOS ONE 2024)",
    foundAt: "apphatchery.org/tbguide + App Store/Play + PubMed",
    year: 2023, status: "live", publisher: "Emory University",
    partners: ["Georgia Department of Public Health"],
    asset: { sticker: "assets/stickers/tbguide.png", mascot: null, screen: "assets/screens/tbguide.png" },
    lastVerified: "2026-06-17",
    notes: "Guideline-based (ATS/CDC/IDSA/WHO/Emory). Listing age-rated 17+."
  },
  {
    id: "cchd-pulseox", type: "app", title: "CCHD PulseOx", tagline: "Read newborn screening right, every time",
    description: "A clinician tool for Critical Congenital Heart Disease screening: enter a newborn's pulse-oximetry values and get the correct AAP/AHA algorithmic pass / fail / retest interpretation and next steps — removing human error from a fiddly screening algorithm.",
    url: "https://apphatchery.org/pulseox", urlVerified: true,
    secondaryUrls: {
      iosAppStore: "https://apps.apple.com/us/app/cchd-pulseox-screening/id567756249",
      googlePlay: "https://play.google.com/store/apps/details?id=org.apphatchery.pulseOx"
    },
    audience: ["clinician"],
    problemAreas: ["screening", "clinicalSupport"],
    evidenceType: "Dedicated apphatchery.org page + iOS & Android listings (Android pkg org.apphatchery.pulseOx)",
    foundAt: "apphatchery.org/pulseox + App Store/Play",
    year: 2022, status: "live", publisher: "Children's Healthcare of Atlanta",
    partners: ["Children's Healthcare of Atlanta", "Dr. Matt Oster (Emory)"],
    asset: { sticker: "assets/stickers/pulseox.png", mascot: null, screen: "assets/screens/pulseox.png", logoVariants: ["assets/stickers/pulseox.png","assets/stickers/pulseox-icon.png","assets/stickers/pulseox-mark.png"] },
    lastVerified: "2026-06-17",
    notes: "Aimed at newborn nurseries. Free."
  },
  {
    id: "siby", type: "tool", title: "Siby", tagline: "An AI guide for sickle-cell families",
    description: "A GPT-4o-based conversational assistant that helps caregivers navigating pediatric sickle-cell care with the non-medical logistics — transport, insurance, financial aid, appointment prep.",
    url: "https://chatbottest.framer.website/chatbot", urlVerified: true,
    secondaryUrls: {
      news: "https://georgiactsa.org/news-events/news/2025/discovery/siby-chatbot/index.html"
    },
    audience: ["caregiver", "clinician"],
    problemAreas: ["careNavigation", "patientEd"],
    evidenceType: "Interactive prototype (Framer-hosted) + Georgia CTSA / NCATS news coverage",
    foundAt: "apphatchery.org/work ('Sickle Cell AI Chatbot') + Georgia CTSA news",
    year: 2025, status: "prototype", publisher: "AppHatchery + CHOA",
    partners: ["Children's Healthcare of Atlanta", "Dr. Beatrice Gee", "built by Tulika Banerjee"],
    asset: { sticker: "assets/stickers/siby.svg", mascot: "assets/mascots/siby.png", screen: "assets/screens/siby.png" },
    lastVerified: "2026-06-17",
    notes: "Prototype — NOT in app stores. Listed on /work as 'Sickle Cell AI Chatbot'. Featured at NIH CCOS / on socials."
  },
  {
    id: "hometown", type: "app", title: "HomeTown", tagline: "Cancer surveillance for predisposition syndromes",
    description: "An mHealth app that helps families and clinicians manage the complex surveillance schedules of hereditary cancer-predisposition syndromes (e.g., Li-Fraumeni, DICER1) — turning a tangle of screening protocols into a manageable plan.",
    url: null, urlVerified: false,
    urlNote: "Google Play listing (org.apphatchery.hometown) returns HTTP 404 as of 2026-06-17 (pulled or region-locked) — confirmed during asset seeding. Verified evidence is the peer-reviewed paper.",
    secondaryUrls: { paper: "https://doi.org/10.1002/pbc.30537", playStoreFormer: "https://play.google.com/store/apps/details?id=org.apphatchery.hometown" },
    audience: ["clinician", "caregiver"],
    problemAreas: ["surveillance", "patientEd"],
    evidenceType: "Peer-reviewed paper (Pediatric Blood & Cancer 2023). Former Google Play listing now 404s (checked 2026-06-17).",
    foundAt: "Google Play (now 404) + PubMed",
    year: 2023, status: "unknown", publisher: "AppHatchery / Emory",
    partners: [],
    asset: { sticker: "assets/stickers/hometown.svg", mascot: null, screen: "assets/screens/hometown.png" },
    lastVerified: "2026-06-17",
    notes: "Surfaced via app-store + publication research; not prominently featured on the current apphatchery.org homepage."
  },
  {
    id: "ready-tonsillectomy", type: "app", title: "Ready for Tonsillectomy", tagline: "Kid-friendly surgery prep",
    description: "A pediatric pre-surgery education app that prepares children and caregivers for a tonsillectomy with clear, reassuring, kid-friendly guidance.",
    url: "https://play.google.com/store/apps/details?id=edu.emory.tonsillectomysurgery", urlVerified: true,
    secondaryUrls: { github: "https://github.com/AppHatchery/ready_for_tonsillectomy_public" },
    audience: ["caregiver", "clinician"],
    problemAreas: ["patientEd"],
    evidenceType: "Google Play listing + open-source repo",
    foundAt: "Google Play + github.com/AppHatchery",
    year: 2024, status: "live", publisher: "Emory University",
    partners: [],
    asset: { sticker: "assets/app-icons/ready-tonsillectomy.png", mascot: null, screen: "assets/screens/tonsillectomy.png" },
    lastVerified: "2026-06-17",
    notes: "Discovered via store + repo; not on the current homepage."
  },
  {
    id: "herheart", type: "app", title: "HerHeart", tagline: "Heart health for young women",
    description: "A user-centered cardiovascular-health education tool for adolescent women, built with Georgia Tech MS-HCI students — assessing and promoting heart health where it's usually overlooked.",
    url: null, urlVerified: false, urlNote: "No standalone live URL confirmed; evidence is the peer-reviewed paper, the repo, and Georgia CTSA news.",
    secondaryUrls: {
      paper: "https://doi.org/10.2196/42051",
      github: "https://github.com/AppHatchery/HerHeart",
      news: "https://georgiactsa.org/news-events/news/2025/discovery/her-heart/index.html"
    },
    audience: ["researcher", "caregiver"],
    problemAreas: ["prevention", "patientEd", "research"],
    evidenceType: "Peer-reviewed UCD paper (JMIR Formative Research 2022) + repo + Georgia CTSA news",
    foundAt: "PubMed + github.com/AppHatchery + Georgia CTSA",
    year: 2022, status: "research", publisher: "AppHatchery / Emory + Georgia Tech",
    partners: ["Georgia Tech MS-HCI"],
    asset: { sticker: "assets/stickers/herheart.svg", mascot: null, screen: "assets/screens/herheart.png" },
    lastVerified: "2026-06-17",
    notes: "Led by Santiago Arconada Alvarez. Live distribution status unconfirmed."
  },
  {
    id: "mama-love", type: "tool", title: "MAMA LOVE", tagline: "Maternal risk, made visible",
    description: "A web-based intervention to help reduce maternal morbidity and mortality risk by raising awareness and guiding action.",
    url: null, urlVerified: false, urlNote: "No live URL located; evidence is the peer-reviewed paper only.",
    secondaryUrls: { paper: "https://doi.org/10.2196/44615" },
    audience: ["researcher", "caregiver"],
    problemAreas: ["prevention", "patientEd", "research"],
    evidenceType: "Peer-reviewed paper (JMIR Pediatrics and Parenting 2023)",
    foundAt: "PubMed",
    year: 2023, status: "research", publisher: "AppHatchery / Emory",
    partners: [],
    asset: { sticker: "assets/stickers/mamalove.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17",
    notes: "[Live URL unverified] Included as a documented research output."
  },
  {
    id: "in-the-know", type: "app", title: "in-The-KNOW", tagline: "STI prevention & self-tracking",
    description: "[STUB] An STI prevention / awareness self-tracking app (verified as a public AppHatchery repository; product-page details not yet confirmed).",
    url: null, urlVerified: false, urlNote: "Repo only; no store/site listing found.",
    secondaryUrls: { github: "https://github.com/AppHatchery/in-The-KNOW" },
    audience: ["caregiver", "publicHealth"],
    problemAreas: ["prevention", "patientEd"],
    evidenceType: "Open-source repo (Kotlin) in the AppHatchery GitHub org",
    foundAt: "github.com/AppHatchery",
    year: null, status: "unknown", publisher: "AppHatchery",
    partners: [],
    asset: { sticker: "assets/stickers/intheknow.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17",
    notes: "[STUB] Confirm scope/status with the team before featuring prominently."
  },
  {
    id: "eyra", type: "app", title: "Eyra", tagline: "",
    description: "[STUB] Listed as a 2025 project on apphatchery.org/work (UI/UX, research, app dev, usability testing, content digitization). Public details are minimal.",
    url: null, urlVerified: false, urlNote: "Listed on /work without a working detail link.",
    secondaryUrls: {},
    audience: ["researcher"], problemAreas: ["research"],
    evidenceType: "Listed on apphatchery.org/work (2025)",
    foundAt: "apphatchery.org/work",
    year: 2025, status: "unknown", publisher: "AppHatchery",
    partners: [],
    asset: { sticker: "assets/screens/eyra.png", mascot: null, screen: "assets/screens/eyra.png" },
    lastVerified: "2026-06-17",
    notes: "[STUB] Need details from team."
  },
  {
    id: "sensory-sims", type: "app", title: "Sensory Sims", tagline: "",
    description: "[STUB] Listed as a 2025 project on apphatchery.org/work (UI/UX, research, app + dashboard development). Likely related to AppHatchery's XR work; public details minimal.",
    url: null, urlVerified: false, urlNote: "Listed on /work without a working detail link.",
    secondaryUrls: {},
    audience: ["researcher", "clinician"], problemAreas: ["research"],
    evidenceType: "Listed on apphatchery.org/work (2025)",
    foundAt: "apphatchery.org/work",
    year: 2025, status: "unknown", publisher: "AppHatchery",
    partners: [],
    asset: { sticker: "assets/screens/sensory-sims.png", mascot: null, screen: "assets/screens/sensory-sims.png" },
    lastVerified: "2026-06-17",
    notes: "[STUB] Possibly XR/Sensory simulation. Confirm with team."
  },

  // ----------------------- PUBLICATIONS -----------------------
  {
    id: "pub-app-dev-bmc", type: "publication", title: "Navigating mobile medical app development — idea to launch",
    tagline: "AppHatchery's own playbook",
    description: "AppHatchery's peer-reviewed how-to guide for taking a medical app from idea to launch — the single best read for a researcher wondering 'how would I even build this?'",
    url: "https://doi.org/10.1186/s12916-023-02833-7", urlVerified: true,
    secondaryUrls: {},
    audience: ["researcher", "clinician", "builder"],
    problemAreas: ["appGuidance", "research"],
    evidenceType: "DOI verified via CrossRef + NCBI (BMC Medicine 21:109, 2023)",
    foundAt: "PubMed / CrossRef",
    year: 2023, status: "published",
    authors: "Mannino RG, Arconada Alvarez SJ, Greenleaf M, Parsell M, Mwalija C, Lam WA",
    asset: { sticker: "assets/stickers/pub-app-dev-bmc.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17",
    notes: "KEY artifact for the 'I have an idea' / builder route."
  },
  {
    id: "pub-tb-plos", type: "publication", title: "Converting the Georgia TB Reference Guide into a mobile app",
    tagline: "“An app is just available at all times”",
    description: "Process and outcomes of digitizing a printed clinical reference into the Georgia TB Reference Guide app.",
    url: "https://doi.org/10.1371/journal.pone.0298758", urlVerified: true,
    secondaryUrls: { relatedApp: "ga-tb-guide" },
    audience: ["clinician", "researcher"],
    problemAreas: ["clinicalSupport", "research"],
    evidenceType: "DOI verified via CrossRef + NCBI (PLOS ONE 19(5):e0298758, 2024)",
    foundAt: "PubMed / CrossRef",
    year: 2024, status: "published",
    authors: "Arconada Alvarez SJ, Hoover, Greenleaf, Ray, Schechter, Blumberg, Lam",
    asset: { sticker: "assets/stickers/pub-tb-plos.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17", notes: ""
  },
  {
    id: "pub-hometown-pbc", type: "publication", title: "A novel mHealth app for cancer surveillance in predisposition syndromes",
    tagline: "The HomeTown study",
    description: "Peer-reviewed account of the cancer-surveillance app for predisposition-syndrome families (HomeTown).",
    url: "https://doi.org/10.1002/pbc.30537", urlVerified: true,
    secondaryUrls: { relatedApp: "hometown" },
    audience: ["clinician", "researcher", "caregiver"],
    problemAreas: ["surveillance", "research"],
    evidenceType: "DOI verified via CrossRef + NCBI (Pediatric Blood & Cancer 70(10):e30537, 2023)",
    foundAt: "PubMed / CrossRef",
    year: 2023, status: "published",
    authors: "Arconada Alvarez SJ, Pencheva, Greenleaf, Lam, Mannino, Mitchell",
    asset: { sticker: "assets/stickers/pub-hometown-pbc.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17", notes: ""
  },
  {
    id: "pub-fabla-brm", type: "publication", title: "Fabla: a voice-based ecological assessment method",
    tagline: "The Fabla validation",
    description: "Validation of Fabla as a method for collecting spoken responses in daily-diary / EMA research.",
    url: "https://doi.org/10.3758/s13428-025-02777-1", urlVerified: true,
    secondaryUrls: { relatedApp: "fabla", erratum: "https://doi.org/10.3758/s13428-025-02818-9" },
    audience: ["researcher"],
    problemAreas: ["dataCollection", "mentalHealth", "research"],
    evidenceType: "DOI verified via CrossRef + NCBI (Behavior Research Methods 57(9):257, 2025)",
    foundAt: "PubMed / CrossRef",
    year: 2025, status: "published",
    authors: "Kaplan DM, Arconada Alvarez SJ, Greenleaf MN, Lam WA, et al.",
    asset: { sticker: "assets/stickers/pub-fabla-brm.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17", notes: ""
  },
  {
    id: "pub-herheart-jmir", type: "publication", title: "Cardiovascular health for adolescent women: a UCD approach",
    tagline: "The HerHeart paper",
    description: "User-centered design approach to assessing and promoting cardiovascular health in adolescent women.",
    url: "https://doi.org/10.2196/42051", urlVerified: true,
    secondaryUrls: { relatedApp: "herheart" },
    audience: ["researcher", "clinician"],
    problemAreas: ["prevention", "research"],
    evidenceType: "DOI verified via CrossRef + NCBI (JMIR Formative Research 6:e42051, 2022)",
    foundAt: "PubMed / CrossRef",
    year: 2022, status: "published",
    authors: "Arconada Alvarez SJ, Greenleaf M, Parsell M, Gooding",
    asset: { sticker: "assets/stickers/pub-herheart-jmir.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17", notes: ""
  },
  {
    id: "pub-chatgpt-bias-jmir", type: "publication", title: "Gender Bias in Recommendation Letters Generated by ChatGPT",
    tagline: "AppHatchery on AI methods",
    description: "An AppHatchery-authored study of gender bias in LLM-generated recommendation letters — relevant to anyone weighing AI in research workflows.",
    url: "https://doi.org/10.2196/51837", urlVerified: true,
    secondaryUrls: {},
    audience: ["researcher"],
    problemAreas: ["research"],
    evidenceType: "DOI verified via CrossRef + NCBI (J Medical Internet Research 26:e51837, 2024)",
    foundAt: "PubMed / CrossRef",
    year: 2024, status: "published",
    authors: "Kaplan DM, Arconada Alvarez SJ, Greenleaf MN, Lam WA",
    asset: { sticker: "assets/stickers/pub-chatgpt-bias-jmir.svg", mascot: null, screen: null },
    lastVerified: "2026-06-17", notes: ""
  },

  // ----------------------- SERVICES -----------------------
  { id: "svc-human-factors", type: "service", title: "Human Factors Research", tagline: "[01]",
    description: "Studying how real users behave so a tool fits the human, not the other way around.",
    url: "https://apphatchery.org", urlVerified: true, secondaryUrls: {},
    audience: ["researcher", "clinician", "builder"], problemAreas: ["research"],
    evidenceType: "Listed service on apphatchery.org", foundAt: "apphatchery.org", status: "service",
    asset: { sticker: "assets/stickers/svc-research.svg", mascot: null, screen: null }, lastVerified: "2026-06-17", notes: "" },
  { id: "svc-ucd", type: "service", title: "User-centered Design", tagline: "[02]",
    description: "Designing the experience around the people who'll actually use it.",
    url: "https://apphatchery.org", urlVerified: true, secondaryUrls: {},
    audience: ["researcher", "builder"], problemAreas: ["research"],
    evidenceType: "Listed service on apphatchery.org", foundAt: "apphatchery.org", status: "service",
    asset: { sticker: "assets/stickers/svc-design.svg", mascot: null, screen: null }, lastVerified: "2026-06-17", notes: "" },
  { id: "svc-mobile-dev", type: "service", title: "Mobile App Development", tagline: "[03]",
    description: "Building the iOS/Android app — from MVP for field testing to launch and support.",
    url: "https://apphatchery.org", urlVerified: true, secondaryUrls: {},
    audience: ["builder", "researcher"], problemAreas: ["appGuidance"],
    evidenceType: "Listed service on apphatchery.org", foundAt: "apphatchery.org", status: "service",
    asset: { sticker: "assets/stickers/svc-mobile.svg", mascot: null, screen: null }, lastVerified: "2026-06-17", notes: "" },
  { id: "svc-web-dev", type: "service", title: "Web Design and Development", tagline: "[04]",
    description: "Web tools, dashboards, and data integrations for studies and clinics.",
    url: "https://apphatchery.org", urlVerified: true, secondaryUrls: {},
    audience: ["builder", "researcher"], problemAreas: ["appGuidance"],
    evidenceType: "Listed service on apphatchery.org", foundAt: "apphatchery.org", status: "service",
    asset: { sticker: "assets/stickers/svc-web.svg", mascot: null, screen: null }, lastVerified: "2026-06-17", notes: "" },
  { id: "svc-xr", type: "service", title: "XR Research and Design", tagline: "[05]",
    description: "Extended-reality research and prototyping (the XR Innovation Center grew out of AppHatchery).",
    url: "https://apphatchery.org", urlVerified: true, secondaryUrls: {},
    audience: ["researcher", "builder"], problemAreas: ["research"],
    evidenceType: "Listed service on apphatchery.org", foundAt: "apphatchery.org", status: "service",
    asset: { sticker: "assets/stickers/svc-xr.svg", mascot: null, screen: null }, lastVerified: "2026-06-17", notes: "" },
  { id: "svc-consultation", type: "service", title: "Project Consultation", tagline: "[06]",
    description: "Not sure where to start? Consult AppHatchery advisors to define goals, feasibility, scope, and budget.",
    url: "https://apphatchery.org/contact", urlVerified: true, secondaryUrls: {},
    audience: ["builder", "researcher", "clinician", "explorer"], problemAreas: ["appGuidance"],
    evidenceType: "Listed service on apphatchery.org + intake described on georgiactsa.org program page",
    foundAt: "apphatchery.org + georgiactsa.org", status: "service",
    asset: { sticker: "assets/stickers/svc-consult.svg", mascot: null, screen: null }, lastVerified: "2026-06-17",
    notes: "Doubles as an on-ramp to the contact pipeline." },

  // ----------------------- NEWS (selected, verified) -----------------------
  { id: "news-r50", type: "news", title: "Co-Director receives NIH R50 Research Software Engineer Award",
    tagline: "Jun 5, 2026",
    description: "Santiago Arconada Alvarez received a 3-year NIH R50 RSE award to build research technologies for mental-health diagnosis and treatment.",
    url: "https://georgiactsa.org/news-events/news/2026/discovery/r5o-arconada-alvarez/index.html", urlVerified: true,
    secondaryUrls: {}, audience: ["researcher"], problemAreas: ["research"],
    evidenceType: "Georgia CTSA news article (verified resolves, Jun 5 2026)", foundAt: "apphatchery.org/blog + georgiactsa.org",
    year: 2026, status: "news", asset: { sticker: "assets/stickers/news.svg", mascot: null, screen: null }, lastVerified: "2026-06-17",
    notes: "URL slug uses 'r5o' (not 'r50') — confirmed real & current." },
  { id: "news-fabla-ncats", type: "news", title: "Fabla featured by NIH NCATS",
    tagline: "Daily-diary research for a depression trial",
    description: "Coverage of Fabla transforming daily-diary research for a depression-treatment clinical trial.",
    url: "https://georgiactsa.org/news-events/news/2025/discovery/fabla-clinical-trial/index.html", urlVerified: true,
    secondaryUrls: { mirror: "https://ccos-cc.ctsa.io/news/New-Mobile-App-Fabla-Transforms-Daily-Diary-Research-for-Depression-Treatment-Clinical-Trial" },
    audience: ["researcher"], problemAreas: ["dataCollection", "mentalHealth"],
    evidenceType: "Georgia CTSA / CCOS news (verified)", foundAt: "apphatchery.org/blog", year: 2025, status: "news",
    asset: { sticker: "assets/stickers/news.svg", mascot: null, screen: null }, lastVerified: "2026-06-17", notes: "" },
  { id: "news-office-hours", type: "news", title: "AppHatchery Monthly Office Hours",
    tagline: "Free app raffle for researchers",
    description: "Monthly office hours where researchers with a health-app idea can get time with the team — including a free app raffle.",
    url: "https://www.linkedin.com/posts/leahwardsears_got-a-health-app-idea-the-georgia-clinical-share-7468390472399372288-ZDwV/", urlVerified: false,
    urlNote: "LinkedIn post — exists but content not machine-verifiable (LinkedIn blocks fetch).",
    secondaryUrls: {}, audience: ["researcher", "builder"], problemAreas: ["appGuidance"],
    evidenceType: "Listed on apphatchery.org/blog; LinkedIn post", foundAt: "apphatchery.org/blog", year: 2026, status: "news",
    asset: { sticker: "assets/stickers/news.svg", mascot: null, screen: null }, lastVerified: "2026-06-17",
    notes: "Strong signal for the always-on contact pipeline — a real recurring on-ramp." }
];

/** People — for trust signals (credentials + affiliation matter for this audience). */
export const PEOPLE = [
  { id: "lam", name: "Wilbur Lam, MD, PhD", role: "Program Director / PI", org: "Emory University & Georgia Tech", note: "National Academy of Medicine 2023 Fellow." },
  { id: "greenleaf", name: "Morgan Greenleaf", role: "Director — Apps, Digital Platforms & Technology Development", org: "AppHatchery / Emory", contact: "morgan.greenleaf@emory.edu", note: "Also Scientific Director, XR Innovation Center. 2024 Georgia CTSA Innovation Award." },
  { id: "arconada", name: "Santiago Arconada Alvarez, MS", role: "Co-Founder & Associate Director of Apps", org: "AppHatchery / Emory", note: "NIH R50 RSE awardee (2026); creator of Fabla & HerHeart; founder of VocalisCare; 2024 Emory IDEAward.", portfolio: "https://yagoarconada.com" },
  { id: "kaplan", name: "Dr. Deanna Kaplan, PhD", role: "Fabla creator / PI (partner-investigator)", org: "Emory SOM — Spiritual Health & Preventive Medicine; HEAT Lab", note: "Genomic Press 2025 Rising Star." }
];

export const PARTNERS = [
  "Georgia CTSA", "Emory School of Medicine", "Woodruff Health Sciences Center",
  "Children's Healthcare of Atlanta (CHOA)", "Georgia Tech", "Morehouse School of Medicine",
  "University of Georgia", "NIH / NCATS"
];

/**
 * THE PIPELINE — the always-on, never-disperses contact path.
 * This is first-class, not a no-match fallback: AppHatchery's whole reason for being
 * is people arriving with an idea or problem.
 */
export const PIPELINE = {
  id: "pipeline",
  title: "Start a project",
  subtitle: "Have an idea, a problem, or just questions? Talk to the people who build this.",
  primaryCta: { label: "Get in touch", url: "https://apphatchery.org/contact" },
  email: "info@apphatchery.org",
  support: "Support@apphatchery.org",
  directContact: { name: "Morgan Greenleaf", email: "morgan.greenleaf@emory.edu" },
  officeHours: "Monthly Office Hours (with a free app raffle for researchers with a health-app idea)",
  accent: BRAND.orange,
  asset: { sticker: "assets/stickers/pipeline.svg", mascot: null, screen: null }
};

const CONTENT = { ORG, BRAND, AUDIENCES, PROBLEM_AREAS, ARTIFACTS, PEOPLE, PARTNERS, PIPELINE };
export default CONTENT;

// Dependency-free pages (V1, V4) consume this via a global instead of a bundler import.
if (typeof window !== "undefined") { window.AH = CONTENT; }
