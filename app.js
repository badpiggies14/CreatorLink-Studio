const store = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const SUPABASE_PROFILE_SLUG = "mayamakes";
const supabaseConfig = window.CREATORLINK_SUPABASE || {};
const supabaseUrl = String(supabaseConfig.url || "").replace(/\/$/, "");
const supabaseAnonKey = String(supabaseConfig.anonKey || "");
const configuredAppUrl = String(supabaseConfig.appUrl || "").replace(/\/$/, "");
let supabaseReady = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes("PASTE") &&
  supabaseAnonKey.length > 20
);
let syncTimer = null;

async function supabaseRequest(path, options = {}) {
  if (!supabaseReady) throw new Error("Supabase is not configured");
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Supabase request failed with ${response.status}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function supabaseStorageRequest(path, file) {
  if (!supabaseReady) throw new Error("Supabase is not configured");
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${path}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": file.type,
      "x-upsert": "true"
    },
    body: file
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Supabase storage failed with ${response.status}`);
  }
  return `${supabaseUrl}/storage/v1/object/public/${path}`;
}

const features = [
  ["link", "Bio-link builder", "Create a polished link hub with active toggles, theme controls, and instant publishing."],
  ["briefcase", "Portfolio showcase", "Feature projects, outcomes, tools, demos, and case-study-ready presentation."],
  ["grid", "Project gallery", "Turn scattered work samples into a curated grid that looks investor and client ready."],
  ["palette", "Custom themes", "Choose premium gradients and branded surfaces without touching code."],
  ["share", "Social links", "Bring every channel into one clean, mobile-first creator identity."],
  ["mail", "Contact form", "Collect qualified project inquiries with budget, service type, and message context."],
  ["badge", "Service listing", "Package what you offer so visitors understand how to hire you."],
  ["chart", "Analytics dashboard", "Track views, clicks, inquiries, growth, and profile completion."],
  ["search", "SEO-ready profiles", "Give your public creator profile strong content structure and clear metadata."],
  ["phone", "Mobile-first design", "Every page is tuned for thumbs, narrow screens, and fast scanning."],
  ["spark", "Custom branding", "Make the profile feel like your own studio, not a generic link page."],
  ["rocket", "Fast publishing", "Edit once, preview instantly, and keep the public page fresh."]
];

const templates = [
  ["Developer", "Alex Rivera", "@alexcodes", "Full-stack developer shipping AI products.", "#22d3ee", "#6366f1"],
  ["Designer", "Maya Chen", "@mayamakes", "Product designer for luminous systems.", "#ec4899", "#7c3aed"],
  ["Photographer", "Iris Vale", "@irisframes", "Editorial photographer and visual storyteller.", "#f59e0b", "#fb7185"],
  ["Influencer", "Nova Rae", "@novarae", "Lifestyle creator with premium brand partners.", "#34d399", "#06b6d4"],
  ["Freelancer", "Owen Blake", "@owenstudio", "Independent studio for launch-ready websites.", "#a3e635", "#14b8a6"],
  ["Artist", "Sel Sol", "@selsol", "Digital artist creating bold visual worlds.", "#f472b6", "#f97316"],
  ["Startup Founder", "Kai Morgan", "@kaibuilds", "Founder building tools for creator teams.", "#67e8f9", "#8b5cf6"],
  ["Content Creator", "Zara Moon", "@zaramoon", "Creator educator turning ideas into systems.", "#fb923c", "#ec4899"]
];

const defaultLinks = [
  { title: "Portfolio", url: "#portfolio", active: true },
  { title: "YouTube", url: "https://youtube.com", active: true },
  { title: "GitHub", url: "https://github.com", active: true },
  { title: "Instagram", url: "https://instagram.com", active: true },
  { title: "Book a Call", url: "https://cal.com", active: true },
  { title: "Latest Project", url: "#reel", active: true }
];

const defaultProjects = [
  { title: "AI Portfolio Website", description: "A cinematic personal site with smart copy prompts and dynamic case studies.", category: "Development", stack: "React, AI, Motion", demo: "#", github: "#", c1: "#22d3ee", c2: "#6366f1" },
  { title: "Brand Identity System", description: "A full visual identity kit for an independent creator studio.", category: "Design", stack: "Figma, Strategy, Tokens", demo: "#", github: "#", c1: "#ec4899", c2: "#8b5cf6" },
  { title: "Mobile App UI Kit", description: "A premium mobile interface library for creator dashboards.", category: "Product", stack: "UI, Components, Mobile", demo: "#", github: "#", c1: "#34d399", c2: "#06b6d4" },
  { title: "Creator Analytics Dashboard", description: "A focused dashboard for profile views, link clicks, and lead quality.", category: "SaaS", stack: "Charts, UX, Data", demo: "#", github: "#", c1: "#f59e0b", c2: "#fb7185" }
];

const themes = [
  { name: "Aurora", a: "rgba(99,102,241,.18)", c1: "#06b6d4", c2: "#7c3aed" },
  { name: "Bloom", a: "rgba(236,72,153,.18)", c1: "#ec4899", c2: "#7c3aed" },
  { name: "Mint", a: "rgba(16,185,129,.16)", c1: "#10b981", c2: "#06b6d4" },
  { name: "Peach", a: "rgba(249,115,22,.16)", c1: "#f97316", c2: "#ec4899" }
];

const plans = [
  ["Starter", 0, ["Basic bio link page", "3 project cards", "Basic themes", "Community support"]],
  ["Creator Pro", 15, ["Unlimited links", "Unlimited projects", "Advanced themes", "Analytics", "Custom branding", "Contact forms", "Priority templates"]],
  ["Studio", 39, ["Everything in Pro", "Team profiles", "Advanced analytics", "Custom domain mock feature", "Client inquiry management", "White-label style controls", "Priority support"]]
];

const faqs = [
  ["What is CreatorLink Studio?", "It is an all-in-one creator profile, bio-link, portfolio, services, analytics, and inquiry platform concept built as a functional frontend demo."],
  ["Can I customize my profile?", "Yes. The builder includes theme selection, editable links, reordered links, and a live profile preview."],
  ["Can I add portfolio projects?", "Yes. Add, edit, and delete projects with category, stack, demo link, GitHub link, and gradient thumbnails."],
  ["Does it support analytics?", "The dashboard includes realistic mock analytics, growth bars, profile metrics, and recent activity."],
  ["Can I collect client inquiries?", "Yes. The inquiry form saves submissions to localStorage and shows them in the dashboard."],
  ["Does this require a backend?", "No. This demo runs entirely in the browser with localStorage persistence and no paid APIs."]
];

let links = store.get("cls_links", defaultLinks);
let projects = store.get("cls_projects", defaultProjects);
let inquiries = store.get("cls_inquiries", []);
let profile = store.get("cls_profile", {
  slug: SUPABASE_PROFILE_SLUG,
  name: "Maya Chen",
  username: "@mayamakes",
  bio: "Product designer and creative technologist crafting brand systems, launch pages, and creator tools.",
  avatarUrl: ""
});
let selectedTheme = store.get("cls_theme", themes[0].name);
let billing = "monthly";
let authMode = "signin";
let avatarUploading = false;

function $(selector) {
  return document.querySelector(selector);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function getCleanUsername(username = profile.username || profile.slug || SUPABASE_PROFILE_SLUG) {
  return String(username).replace(/^@/, "").trim().toLowerCase() || SUPABASE_PROFILE_SLUG;
}

function getPublicProfileUrl(username = profile.username) {
  const clean = getCleanUsername(username);
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const base = configuredAppUrl && !isLocal ? configuredAppUrl : window.location.origin;
  return `${base}/u/${clean}`;
}

function getProfilePath(username = profile.username) {
  return `/u/${getCleanUsername(username)}`;
}

const avatarStyles = {
  "Alex Rivera": ["#7dd3fc", "#6366f1", "#8b4513", "#f2c7a5", "#1e293b"],
  "Maya Chen": ["#f9a8d4", "#7c3aed", "#111827", "#f4c7a1", "#7c3aed"],
  "Iris Vale": ["#fde68a", "#fb7185", "#7c2d12", "#e8b58f", "#0f766e"],
  "Nova Rae": ["#86efac", "#06b6d4", "#111827", "#8d5524", "#db2777"],
  "Owen Blake": ["#bef264", "#14b8a6", "#51301d", "#d7a27b", "#2563eb"],
  "Sel Sol": ["#f0abfc", "#f97316", "#3b0764", "#b06b45", "#be185d"],
  "Kai Morgan": ["#67e8f9", "#8b5cf6", "#111827", "#c68642", "#0f172a"],
  "Zara Moon": ["#fdba74", "#ec4899", "#4a2511", "#a96f50", "#0891b2"],
  "Aria Wells": ["#f9a8d4", "#6366f1", "#111827", "#c68642", "#7c3aed"],
  "Noah Reed": ["#93c5fd", "#06b6d4", "#59331a", "#d7a27b", "#334155"],
  "Lina Park": ["#fcd34d", "#f97316", "#111827", "#f0b88b", "#be123c"]
};

function logoMarkSvg() {
  return `
    <svg class="logo-svg" viewBox="0 0 64 64" aria-hidden="true">
      <defs><linearGradient id="logoGradient" x1="8" y1="8" x2="58" y2="58"><stop stop-color="#06b6d4"/><stop offset=".52" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>
      <rect width="64" height="64" rx="18" fill="url(#logoGradient)"/>
      <circle cx="25" cy="24" r="9" fill="#fff" fill-opacity=".95"/>
      <path d="M17 45c4.5-9 19.5-9 24 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <path d="M36 25h7a9 9 0 0 1 0 18h-8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <path d="M39 34h-9" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
}

function iconSvg(type) {
  const icons = {
    link: '<path d="M9 12a4 4 0 0 1 4-4h4"/><path d="M15 8h2a4 4 0 0 1 0 8h-3"/><path d="M15 16h-2a4 4 0 0 1 0-8h3"/>',
    briefcase: '<rect x="5" y="8" width="14" height="10" rx="2"/><path d="M9 8V6h6v2"/><path d="M5 13h14"/>',
    grid: '<rect x="5" y="5" width="6" height="6" rx="1.5"/><rect x="13" y="5" width="6" height="6" rx="1.5"/><rect x="5" y="13" width="6" height="6" rx="1.5"/><rect x="13" y="13" width="6" height="6" rx="1.5"/>',
    palette: '<path d="M12 4a8 8 0 0 0 0 16h1.2a1.8 1.8 0 0 0 1.2-3.1 1.4 1.4 0 0 1 1-2.4H16a4 4 0 0 0 0-8.5A8.6 8.6 0 0 0 12 4Z"/><circle cx="8.5" cy="11" r="1"/><circle cx="11" cy="8" r="1"/><circle cx="15" cy="9.5" r="1"/>',
    share: '<circle cx="7" cy="12" r="2.2"/><circle cx="17" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="m9 11 6-3"/><path d="m9 13 6 3"/>',
    mail: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="m5 8 7 5 7-5"/>',
    badge: '<path d="M7 5h10l2 3v11H5V8Z"/><path d="M8 11h8"/><path d="M8 15h5"/><path d="m14 17 1.3 1.3L18 15.5"/>',
    chart: '<path d="M5 19V5"/><path d="M5 19h15"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-8"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/><path d="M8 11h6"/><path d="M11 8v6"/>',
    phone: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M11 18h2"/>',
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m18 15 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z"/>',
    rocket: '<path d="M13 5c3-1 5-1 6 0 1 1 1 3 0 6l-5 5-5-5Z"/><path d="m8 16-3 3 1-5"/><path d="m16 8-8 8"/><circle cx="15.5" cy="8.5" r="1.3"/>'
  };
  return `<svg class="visual-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[type] || icons.spark}</svg>`;
}

function creatorAvatar(name, sizeClass = "") {
  const [c1, c2, hair, skin, shirt] = avatarStyles[name] || avatarStyles["Maya Chen"];
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `
    <svg class="creator-avatar ${sizeClass}" viewBox="0 0 120 120" role="img" aria-label="${escapeAttr(name)} avatar">
      <defs>
        <linearGradient id="avatar-bg-${id}" x1="16" y1="10" x2="104" y2="110"><stop stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
      </defs>
      <rect width="120" height="120" rx="34" fill="url(#avatar-bg-${id})"/>
      <circle cx="92" cy="24" r="17" fill="#fff" opacity=".2"/>
      <circle cx="31" cy="92" r="24" fill="#fff" opacity=".14"/>
      <path d="M28 110c5-27 59-27 64 0Z" fill="${shirt}"/>
      <circle cx="60" cy="58" r="27" fill="${skin}"/>
      <path d="M33 54c2-27 39-39 58-13-8-3-17-3-26 0-10 3-20 2-32 13Z" fill="${hair}"/>
      <path d="M35 63c2-11 4-18 10-24 3 8 15 12 39 11 2 4 3 8 3 13 0 19-12 32-27 32S35 82 35 63Z" fill="${skin}"/>
      <circle cx="51" cy="64" r="2.6" fill="#0f172a"/>
      <circle cx="70" cy="64" r="2.6" fill="#0f172a"/>
      <path d="M53 78c5 4 11 4 16 0" fill="none" stroke="#8a4b35" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 55c4-3 9-4 14-2" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>
      <path d="M66 53c5-2 10-1 14 2" fill="none" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>
    </svg>`;
}

function profileAvatar(name = "Maya Chen", sizeClass = "") {
  if (profile.avatarUrl) {
    return `<img class="creator-avatar uploaded-avatar ${sizeClass}" src="${escapeAttr(profile.avatarUrl)}" alt="${escapeAttr(name)} profile photo" />`;
  }
  return creatorAvatar(name, sizeClass);
}

function projectThumbnail(title) {
  const key = title.toLowerCase();
  if (key.includes("brand")) return brandThumbnail();
  if (key.includes("mobile")) return mobileThumbnail();
  if (key.includes("analytics")) return analyticsThumbnail();
  return aiPortfolioThumbnail();
}

function aiPortfolioThumbnail() {
  return `<div class="project-visual ai-thumb"><div class="visual-browser"><span></span><span></span><span></span></div><div class="visual-profile">${profileAvatar("Maya Chen", "tiny-avatar")}<div><b>AI Profile</b><i></i><i></i></div></div><div class="spark-cluster"><b></b><b></b><b></b></div></div>`;
}

function brandThumbnail() {
  return `<div class="project-visual brand-thumb"><div class="brand-tile">${logoMarkSvg()}</div><div class="palette-row"><span></span><span></span><span></span><span></span></div><div class="brand-lines"><i></i><i></i><i></i></div></div>`;
}

function mobileThumbnail() {
  return `<div class="project-visual mobile-thumb"><div class="mini-phone"><i></i><b></b><span></span><span></span><span></span></div><div class="mini-phone alt"><i></i><b></b><span></span><span></span><span></span></div></div>`;
}

function analyticsThumbnail() {
  return `<div class="project-visual analytics-thumb"><div class="chart-card"><b></b><span></span><span></span><span></span><span></span></div><div class="line-chart"><i></i><i></i><i></i></div></div>`;
}

function reelVisual(index) {
  const visuals = [
    `<div class="reel-ui profile-scene">${profileAvatar("Maya Chen", "reel-avatar")}<b>Maya Chen</b><i></i><i></i><i></i></div>`,
    `<div class="reel-ui links-scene"><span>${iconSvg("link")} Portfolio</span><span>${iconSvg("mail")} Book a call</span><span>${iconSvg("share")} Social kit</span></div>`,
    `<div class="reel-ui work-scene">${projectThumbnail("AI Portfolio Website")}${projectThumbnail("Brand Identity System")}</div>`,
    `<div class="reel-ui growth-scene"><span></span><span></span><span></span><span></span><span></span><b>+34%</b></div>`,
    `<div class="reel-ui share-scene">${logoMarkSvg()}<b>/u/mayamakes</b><div class="qr-grid">${Array.from({ length: 16 }, (_, i) => `<span class="${i % 3 === 0 ? "on" : ""}"></span>`).join("")}</div></div>`
  ];
  return visuals[index] || visuals[0];
}

function renderFeatures() {
  $("#featureGrid").innerHTML = features.map(([icon, title, description], index) => `
    <article class="feature-card reveal" style="transition-delay:${Math.min(index * 28, 220)}ms">
      <div class="feature-icon">${iconSvg(icon)}</div>
      <h3>${title}</h3>
      <p>${description}</p>
    </article>
  `).join("");
}

function renderTemplates() {
  $("#templateGrid").innerHTML = templates.map(([role, name, user, bio, c1, c2]) => `
    <article class="template-card reveal" style="--c1:${c1};--c2:${c2}">
      <div class="template-thumb">
        <div class="mini-profile">
          ${creatorAvatar(name, "template-avatar")}
          <strong>${name}</strong>
          <p>${user}</p>
          <div class="mini-line" style="width:92%"></div>
          <div class="mini-line" style="width:62%"></div>
          <div class="link-pills"><span>Portfolio</span><span>Book</span><span>Work</span></div>
        </div>
      </div>
      <h3>${role}</h3>
      <p>${bio}</p>
      <button class="secondary-button small" data-scroll="#builder">Preview Template</button>
    </article>
  `).join("");
}

function renderDashboard() {
  const stats = [
    ["Profile views", "48.2k"], ["Link clicks", "12.8k"], ["Contact requests", String(getInquiries().length + 24)], ["Projects", String(projects.length)], ["Revenue intent", "$18.4k"]
  ];
  $("#statGrid").innerHTML = stats.map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`).join("");
  $("#chart").innerHTML = [42, 58, 48, 72, 64, 84, 76, 92, 88, 100, 96, 116].map((height, i) => `<span class="bar" style="height:${height}px;animation-delay:${i * 45}ms"></span>`).join("");
  renderActivity();
}

function getInquiries() {
  return inquiries;
}

function renderActivity() {
  const inquiries = getInquiries();
  $("#inquiryCount").textContent = `${inquiries.length} saved inquiries`;
  const activity = [
    ...inquiries.slice(-3).reverse().map((item) => [`New inquiry from ${item.name}`, `${item.service} - ${item.budget}`]),
    ["Portfolio link crossed 2k clicks", "Growth event"],
    ["Profile theme updated", "Brand activity"],
    ["New visitor saved your Book a Call link", "Lead signal"]
  ].slice(0, 5);
  $("#activityList").innerHTML = activity.map(([title, detail]) => `<div class="activity-item"><strong>${escapeText(title)}</strong><small>${escapeText(detail)}</small></div>`).join("");
}

function renderThemePicker() {
  $("#themePicker").innerHTML = themes.map((theme) => `
    <button class="theme-dot ${theme.name === selectedTheme ? "active" : ""}" title="${theme.name}" style="--c1:${theme.c1};--c2:${theme.c2}" data-theme="${theme.name}"></button>
  `).join("");
}

function renderProfilePhotoEditor() {
  const node = $("#profilePhotoEditor");
  if (!node) return;
  node.innerHTML = `
    <section class="profile-photo-card">
      <div class="profile-photo-preview">${profileAvatar(profile.name, "photo-editor-avatar")}</div>
      <div class="profile-photo-copy">
        <h4>Profile Photo</h4>
        <p>Upload a profile photo shown on your public creator page.</p>
        <div class="profile-photo-actions">
          <label class="secondary-button small ${avatarUploading ? "loading" : ""}" for="avatarUpload">${avatarUploading ? "Uploading..." : "Upload / Change"}</label>
          <button class="ghost-button small" id="removeAvatar" type="button">Remove</button>
        </div>
        <input id="avatarUpload" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" hidden />
      </div>
    </section>
  `;
}

function persist() {
  store.set("cls_links", links);
  store.set("cls_projects", projects);
  store.set("cls_profile", profile.avatarUrl.startsWith("blob:") ? { ...profile, avatarUrl: "" } : profile);
  store.set("cls_theme", selectedTheme);
  renderProfile();
  renderProjectGrid();
  renderDashboard();
  hydrateStaticVisuals();
  queueSupabaseSync();
}

function queueSupabaseSync() {
  if (!supabaseReady) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncSupabaseState().catch((error) => {
      console.warn("Supabase sync failed", error);
      showToast("Saved locally. Supabase sync needs attention.");
    });
  }, 700);
}

async function syncSupabaseState() {
  const linkRows = links.map((link, position) => ({
    profile_slug: SUPABASE_PROFILE_SLUG,
    title: link.title,
    url: link.url,
    active: Boolean(link.active),
    position
  }));
  const projectRows = projects.map((project, position) => ({
    profile_slug: SUPABASE_PROFILE_SLUG,
    title: project.title,
    description: project.description,
    category: project.category,
    stack: project.stack,
    demo: project.demo,
    github: project.github,
    c1: project.c1,
    c2: project.c2,
    position
  }));

  await supabaseRequest(`creator_profiles?slug=eq.${SUPABASE_PROFILE_SLUG}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { theme: selectedTheme, avatar_url: profile.avatarUrl || null, updated_at: new Date().toISOString() }
  });
  await supabaseRequest(`creator_links?profile_slug=eq.${SUPABASE_PROFILE_SLUG}`, { method: "DELETE", prefer: "return=minimal" });
  if (linkRows.length) await supabaseRequest("creator_links", { method: "POST", prefer: "return=minimal", body: linkRows });
  await supabaseRequest(`creator_projects?profile_slug=eq.${SUPABASE_PROFILE_SLUG}`, { method: "DELETE", prefer: "return=minimal" });
  if (projectRows.length) await supabaseRequest("creator_projects", { method: "POST", prefer: "return=minimal", body: projectRows });
}

async function loadSupabaseState() {
  if (!supabaseReady) return false;
  try {
    const [profileRows, linkRows, projectRows, inquiryRows] = await Promise.all([
      supabaseRequest(`creator_profiles?slug=eq.${SUPABASE_PROFILE_SLUG}&select=slug,name,username,bio,theme,avatar_url&limit=1`),
      supabaseRequest(`creator_links?profile_slug=eq.${SUPABASE_PROFILE_SLUG}&select=title,url,active&order=position.asc`),
      supabaseRequest(`creator_projects?profile_slug=eq.${SUPABASE_PROFILE_SLUG}&select=title,description,category,stack,demo,github,c1,c2&order=position.asc`),
      supabaseRequest(`creator_inquiries?profile_slug=eq.${SUPABASE_PROFILE_SLUG}&select=name,email,service,budget,message,created_at&order=created_at.desc&limit=20`)
    ]);
    if (profileRows?.[0]) {
      const row = profileRows[0];
      profile = {
        slug: row.slug || SUPABASE_PROFILE_SLUG,
        name: row.name || "Maya Chen",
        username: row.username || "@mayamakes",
        bio: row.bio || profile.bio,
        avatarUrl: row.avatar_url || profile.avatarUrl || ""
      };
      if (row.theme) selectedTheme = row.theme;
    }
    if (Array.isArray(linkRows) && linkRows.length) links = linkRows;
    if (Array.isArray(projectRows) && projectRows.length) projects = projectRows;
    if (Array.isArray(inquiryRows)) {
      inquiries = inquiryRows.map((item) => ({
        name: item.name,
        email: item.email,
        service: item.service,
        budget: item.budget,
        message: item.message,
        createdAt: item.created_at
      })).reverse();
    }
    store.set("cls_links", links);
    store.set("cls_projects", projects);
    store.set("cls_profile", profile);
    store.set("cls_theme", selectedTheme);
    store.set("cls_inquiries", inquiries);
    return true;
  } catch (error) {
    supabaseReady = false;
    console.warn("Supabase load failed", error);
    showToast("Using local demo data. Check Supabase config.");
    return false;
  }
}

async function getProfileByUsername(username) {
  const clean = getCleanUsername(username);
  if (!supabaseReady) {
    return clean === SUPABASE_PROFILE_SLUG ? profile : null;
  }
  const rows = await supabaseRequest(`creator_profiles?slug=eq.${clean}&select=slug,name,username,bio,theme,avatar_url&limit=1`);
  if (!rows?.[0] && clean !== SUPABASE_PROFILE_SLUG) return null;
  const row = rows?.[0];
  if (!row) return profile;
  return {
    slug: row.slug,
    name: row.name,
    username: row.username,
    bio: row.bio,
    theme: row.theme,
    avatarUrl: row.avatar_url || ""
  };
}

async function getPublicProfileData(username) {
  const clean = getCleanUsername(username);
  try {
    const publicProfile = await getProfileByUsername(clean);
    if (!publicProfile) return null;
    if (!supabaseReady) {
      return { profile: publicProfile, links, projects };
    }
    const [publicLinks, publicProjects] = await Promise.all([
      supabaseRequest(`creator_links?profile_slug=eq.${clean}&active=eq.true&select=title,url,active&order=position.asc`),
      supabaseRequest(`creator_projects?profile_slug=eq.${clean}&select=title,description,category,stack,demo,github,c1,c2&order=position.asc`)
    ]);
    return {
      profile: publicProfile,
      links: Array.isArray(publicLinks) && publicLinks.length ? publicLinks : links.filter((link) => link.active),
      projects: Array.isArray(publicProjects) && publicProjects.length ? publicProjects : projects
    };
  } catch (error) {
    console.warn("Public profile load failed", error);
    return clean === SUPABASE_PROFILE_SLUG ? { profile, links: links.filter((link) => link.active), projects } : null;
  }
}

function renderLinkEditor() {
  $("#linkEditor").innerHTML = links.map((link, index) => `
    <div class="editor-card">
      <input value="${escapeAttr(link.title)}" data-link-title="${index}" aria-label="Link title" />
      <input value="${escapeAttr(link.url)}" data-link-url="${index}" aria-label="Link URL" />
      <div class="editor-actions">
        <button title="Move up" data-link-up="${index}">Up</button>
        <button title="Move down" data-link-down="${index}">Down</button>
        <button title="Toggle active" data-link-toggle="${index}">${link.active ? "On" : "Off"}</button>
        <button title="Delete" data-link-delete="${index}">x</button>
      </div>
    </div>
  `).join("");
}

function renderProjectEditor() {
  $("#projectEditor").innerHTML = projects.map((project, index) => `
    <div class="editor-card project-editor-card">
      <input value="${escapeAttr(project.title)}" data-project-field="title" data-project-index="${index}" aria-label="Project title" />
      <input value="${escapeAttr(project.category)}" data-project-field="category" data-project-index="${index}" aria-label="Category" />
      <textarea data-project-field="description" data-project-index="${index}" aria-label="Description">${escapeText(project.description)}</textarea>
      <input value="${escapeAttr(project.stack)}" data-project-field="stack" data-project-index="${index}" aria-label="Tech stack" />
      <input value="${escapeAttr(project.demo)}" data-project-field="demo" data-project-index="${index}" aria-label="Demo link" />
      <input value="${escapeAttr(project.github)}" data-project-field="github" data-project-index="${index}" aria-label="GitHub link" />
      <select data-project-field="palette" data-project-index="${index}">
        ${themes.map((theme) => `<option value="${theme.c1}|${theme.c2}" ${project.c1 === theme.c1 ? "selected" : ""}>${theme.name} thumbnail</option>`).join("")}
      </select>
      <div class="editor-actions"><button title="Delete project" data-project-delete="${index}">Delete</button></div>
    </div>
  `).join("");
}

function renderProfile() {
  const theme = themes.find((item) => item.name === selectedTheme) || themes[0];
  $("#profile").innerHTML = `
    <div class="public-profile" style="--themeA:${theme.a}">
      <div class="profile-cover">${logoMarkSvg()}</div>
      ${profileAvatar(profile.name, "profile-avatar")}
      <h3>${escapeText(profile.name)}</h3>
      <p>${escapeText(profile.username)} - ${escapeText(profile.bio)}</p>
      <div class="mini-socials"><span>Dr</span><span>Ig</span><span>Be</span></div>
      ${links.map((link) => `<a class="profile-link ${link.active ? "" : "disabled"}" href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${escapeText(link.title)}</a>`).join("")}
      <div class="preview-projects">
        ${projects.slice(0, 3).map((project) => `<div class="preview-project"><strong>${escapeText(project.title)}</strong><p>${escapeText(project.category)} - ${escapeText(project.stack)}</p></div>`).join("")}
      </div>
      <button class="secondary-button small" id="shareProfile" style="margin-top:1rem">Copy Profile Link</button>
    </div>
  `;
}

function renderPublicProfilePage(data) {
  const main = document.querySelector("main");
  const theme = themes.find((item) => item.name === (data.profile.theme || selectedTheme)) || themes[0];
  const activeLinks = data.links.filter((link) => link.active !== false);
  main.innerHTML = `
    <section class="section public-page-shell">
      <article class="public-page-card" style="--themeA:${theme.a}">
        <div class="profile-cover">${logoMarkSvg()}</div>
        ${data.profile.avatarUrl ? `<img class="creator-avatar uploaded-avatar public-page-avatar" src="${escapeAttr(data.profile.avatarUrl)}" alt="${escapeAttr(data.profile.name)} profile photo" />` : creatorAvatar(data.profile.name, "public-page-avatar")}
        <h1>${escapeText(data.profile.name)}</h1>
        <p class="public-username">${escapeText(data.profile.username || `@${data.profile.slug}`)}</p>
        <p>${escapeText(data.profile.bio || profile.bio)}</p>
        <div class="mini-socials"><span>Dr</span><span>Ig</span><span>Be</span></div>
        <div class="public-links">
          ${activeLinks.map((link) => `<a class="profile-link" href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${escapeText(link.title)}</a>`).join("")}
        </div>
        <div class="preview-projects public-projects">
          ${data.projects.slice(0, 4).map((project) => `<div class="preview-project"><strong>${escapeText(project.title)}</strong><p>${escapeText(project.category)} - ${escapeText(project.stack)}</p></div>`).join("")}
        </div>
        <div class="public-profile-actions">
          <a class="primary-button" href="/#contact">Contact / Inquiry</a>
          <button class="secondary-button" id="copyPublicProfile">Copy Profile Link</button>
        </div>
      </article>
    </section>
  `;
  hydrateStaticVisuals();
}

function renderPublicNotFound(username) {
  document.querySelector("main").innerHTML = `
    <section class="section public-page-shell">
      <article class="public-page-card">
        ${logoMarkSvg()}
        <h1>Profile not found</h1>
        <p>We could not find a public creator page for @${escapeText(username)}.</p>
        <button class="primary-button" onclick="window.location.href='/'">Back to CreatorLink Studio</button>
      </article>
    </section>
  `;
}

async function initPublicRoute(username) {
  hydrateStaticVisuals();
  const data = await getPublicProfileData(username);
  if (!data) {
    renderPublicNotFound(username);
    return;
  }
  renderPublicProfilePage(data);
  document.addEventListener("click", (event) => {
    if (event.target.id === "copyPublicProfile") {
      navigator.clipboard?.writeText(getPublicProfileUrl(data.profile.username || username));
      showToast("Profile link copied");
    }
  });
  revealVisible();
}

function renderProjectGrid() {
  $("#projectGrid").innerHTML = projects.map((project) => `
    <article class="project-card reveal" style="--c1:${project.c1};--c2:${project.c2}">
      <div class="project-thumb">${projectThumbnail(project.title)}</div>
      <h3>${escapeText(project.title)}</h3>
      <p>${escapeText(project.description)}</p>
      <div class="tags">${project.stack.split(",").map((tag) => `<span>${escapeText(tag.trim())}</span>`).join("")}</div>
    </article>
  `).join("");
  revealVisible();
}

function renderPricing() {
  $("#pricingGrid").innerHTML = plans.map(([name, price, items]) => {
    const finalPrice = billing === "yearly" ? Math.round(price * 12 * .8) : price;
    const suffix = price === 0 ? "" : billing === "yearly" ? "/yr" : "/mo";
    return `<article class="pricing-card reveal ${name === "Creator Pro" ? "recommended" : ""}">
      <h3>${name}</h3>
      <div class="price">${price === 0 ? "Free" : `$${finalPrice}`}<span>${suffix}</span></div>
      <button class="${name === "Creator Pro" ? "primary-button" : "secondary-button"} small" data-auth="signup">${name === "Starter" ? "Start free" : "Choose plan"}</button>
      <ul>${items.map((item) => `<li>${escapeText(item)}</li>`).join("")}</ul>
    </article>`;
  }).join("");
}

function renderFaq() {
  $("#faqList").innerHTML = faqs.map(([q, a], index) => `
    <div class="faq-item ${index === 0 ? "open" : ""}">
      <button class="faq-question">${escapeText(q)}<span>+</span></button>
      <div class="faq-answer"><p>${escapeText(a)}</p></div>
    </div>
  `).join("");
}

const reelScenes = [
  ["Create your profile", "Design a polished public page with a premium avatar, story, links, and services."],
  ["Add your links", "Collect every destination into one elegant, trackable creator hub."],
  ["Showcase your work", "Feature projects and case studies that make visitors believe in your craft."],
  ["Track your growth", "Watch clicks, views, inquiries, and profile completion in a calm dashboard."],
  ["Share your page", "Send one link that carries your entire creator brand."]
];
let reelIndex = 0;

function renderReel() {
  const [title, detail] = reelScenes[reelIndex];
  $("#reelScreen").innerHTML = `<div class="reel-visual"><div><span class="eyebrow"><span></span> Scene ${reelIndex + 1}</span><strong>${title}</strong><p>${detail}</p>${reelVisual(reelIndex)}</div></div>`;
  $("#reelSteps").innerHTML = reelScenes.map((scene, index) => `<div class="reel-step ${index === reelIndex ? "active" : ""}">${index + 1}. ${scene[0]}</div>`).join("");
}

function hydrateStaticVisuals() {
  document.querySelectorAll(".logo-mark").forEach((node) => {
    node.innerHTML = logoMarkSvg();
  });
  document.querySelectorAll("[data-avatar='Maya Chen']").forEach((node) => {
    node.innerHTML = profileAvatar(profile.name, "hero-face");
  });
  document.querySelectorAll(".profile-mini-panel .avatar").forEach((node) => {
    node.outerHTML = profileAvatar(profile.name, "dashboard-avatar");
  });
  document.querySelectorAll(".profile-mini-panel .creator-avatar").forEach((node) => {
    if (!node.classList.contains("dashboard-avatar")) node.outerHTML = profileAvatar(profile.name, "dashboard-avatar");
  });
  const testimonials = [
    ["Aria Wells", ".testimonial-grid blockquote:nth-child(1)"],
    ["Noah Reed", ".testimonial-grid blockquote:nth-child(2)"],
    ["Lina Park", ".testimonial-grid blockquote:nth-child(3)"]
  ];
  testimonials.forEach(([name, selector]) => {
    const node = document.querySelector(selector);
    if (node && !node.querySelector(".testimonial-face")) {
      node.insertAdjacentHTML("afterbegin", creatorAvatar(name, "testimonial-face"));
    }
  });
}

function escapeAttr(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function escapeText(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const scrollTarget = event.target.closest("[data-scroll]");
    if (scrollTarget) {
      $(scrollTarget.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
      $(".mobile-nav")?.classList.remove("open");
    }

    const authTarget = event.target.closest("[data-auth]");
    if (authTarget) openAuth(authTarget.dataset.auth);

    const profileAction = event.target.closest("[data-profile-action]");
    if (profileAction?.dataset.profileAction === "open") {
      window.location.href = getProfilePath(profile.username);
    }

    if (event.target.closest(".mobile-menu-button")) $(".mobile-nav").classList.toggle("open");
    if (event.target.matches(".close-modal")) $("#authModal").classList.remove("open");

    const tab = event.target.closest(".tab");
    if (tab) switchTab(tab.dataset.tab);

    const theme = event.target.closest("[data-theme]");
    if (theme) {
      selectedTheme = theme.dataset.theme;
      renderThemePicker();
      persist();
      showToast(`${selectedTheme} theme applied`);
    }

    if (event.target.id === "addLink") {
      links.push({ title: "New Link", url: "https://", active: true });
      renderLinkEditor();
      persist();
      showToast("Link added");
    }
    if (event.target.id === "addProject") {
      projects.push({ title: "New Project", description: "Describe the outcome, craft, and value of this project.", category: "Creative", stack: "Design, Web", demo: "#", github: "#", c1: "#06b6d4", c2: "#7c3aed" });
      renderProjectEditor();
      persist();
      showToast("Project added");
    }

    if (event.target.id === "removeAvatar") {
      removeProfileAvatar();
    }

    handleLinkButtons(event.target);
    handleProjectButtons(event.target);

    if (event.target.id === "shareProfile") {
      navigator.clipboard?.writeText(getPublicProfileUrl(profile.username));
      showToast("Profile link copied");
    }

    if (event.target.classList.contains("faq-question")) {
      event.target.parentElement.classList.toggle("open");
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.dataset.linkTitle) {
      links[Number(event.target.dataset.linkTitle)].title = event.target.value;
      persist();
    }
    if (event.target.dataset.linkUrl) {
      links[Number(event.target.dataset.linkUrl)].url = event.target.value;
      persist();
    }
    if (event.target.dataset.projectField) {
      updateProjectField(event.target);
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.dataset.projectField === "palette") updateProjectField(event.target);
    if (event.target.id === "avatarUpload") handleAvatarUpload(event.target.files?.[0]);
  });

  $("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    inquiries.push({ ...data, createdAt: new Date().toISOString() });
    store.set("cls_inquiries", inquiries);
    saveInquiryToSupabase(data);
    event.target.reset();
    renderDashboard();
    showToast("Inquiry saved to dashboard");
  });

  $("#generateTips").addEventListener("click", () => {
    const input = $("#aiInput").value.trim() || "creative professional";
    const ideas = [
      `Bio upgrade: Lead with the outcome you create, then mention your craft: "${input} focused on measurable launches."`,
      "Link idea: Put your booking link above social channels so high-intent visitors have a clear next step.",
      "Project copy: Frame each project as challenge, action, result. It makes the story easier to scan.",
      "Profile tip: Use one featured service and one featured case study before the full portfolio."
    ];
    $("#aiTips").innerHTML = ideas.map((idea) => `<div class="ai-tip">${escapeText(idea)}</div>`).join("");
    showToast("Creator AI suggestions generated");
  });

  $("#authSubmit").addEventListener("click", () => {
    const email = $("#authEmail").value || "creator@creatorlink.studio";
    store.set("cls_user", { email, loggedIn: true });
    $("#authModal").classList.remove("open");
    const button = document.querySelector("[data-auth='signin']");
    if (button) button.textContent = "Studio";
    showToast(authMode === "signin" ? "Signed in to demo account" : "Demo account created");
  });
  $("#toggleAuth").addEventListener("click", () => openAuth(authMode === "signin" ? "signup" : "signin"));
  $("#forgotAuth").addEventListener("click", () => showToast("Password reset email mocked"));

  document.querySelectorAll("[data-billing]").forEach((button) => {
    button.addEventListener("click", () => {
      billing = button.dataset.billing;
      document.querySelectorAll("[data-billing]").forEach((item) => item.classList.toggle("active", item === button));
      renderPricing();
      revealVisible();
    });
  });
}

function handleLinkButtons(target) {
  const indexOf = (name) => target.dataset[name] === undefined ? null : Number(target.dataset[name]);
  const del = indexOf("linkDelete");
  const toggle = indexOf("linkToggle");
  const up = indexOf("linkUp");
  const down = indexOf("linkDown");
  if (del !== null) {
    links.splice(del, 1);
    showToast("Link deleted");
  }
  if (toggle !== null) {
    links[toggle].active = !links[toggle].active;
    showToast("Link visibility updated");
  }
  if (up !== null && up > 0) [links[up - 1], links[up]] = [links[up], links[up - 1]];
  if (down !== null && down < links.length - 1) [links[down + 1], links[down]] = [links[down], links[down + 1]];
  if ([del, toggle, up, down].some((value) => value !== null)) {
    renderLinkEditor();
    persist();
  }
}

function handleProjectButtons(target) {
  if (target.dataset.projectDelete !== undefined) {
    projects.splice(Number(target.dataset.projectDelete), 1);
    renderProjectEditor();
    persist();
    showToast("Project deleted");
  }
}

function updateProjectField(target) {
  const index = Number(target.dataset.projectIndex);
  const field = target.dataset.projectField;
  if (!projects[index]) return;
  if (field === "palette") {
    const [c1, c2] = target.value.split("|");
    projects[index].c1 = c1;
    projects[index].c2 = c2;
  } else {
    projects[index][field] = target.value;
  }
  persist();
}

function saveInquiryToSupabase(data) {
  if (!supabaseReady) return;
  supabaseRequest("creator_inquiries", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      profile_slug: SUPABASE_PROFILE_SLUG,
      name: data.name,
      email: data.email,
      service: data.service,
      budget: data.budget,
      message: data.message
    }
  }).catch((error) => {
    console.warn("Supabase inquiry save failed", error);
    showToast("Inquiry saved locally. Supabase save failed.");
  });
}

function validateAvatarFile(file) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!file) return "Choose an image first.";
  if (!allowed.includes(file.type)) return "Please upload a JPG, PNG, or WebP image.";
  if (file.size > 5 * 1024 * 1024) return "Profile photo must be 5MB or smaller.";
  return "";
}

async function uploadAvatar(file, userId = SUPABASE_PROFILE_SLUG) {
  const ext = (file.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `avatars/${userId}/profile.${ext}`;
  return supabaseStorageRequest(path, file);
}

async function updateProfileAvatar(userId, avatarUrl) {
  if (!supabaseReady) return;
  await supabaseRequest(`creator_profiles?slug=eq.${userId}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { avatar_url: avatarUrl || null, updated_at: new Date().toISOString() }
  });
}

async function handleAvatarUpload(file) {
  const validation = validateAvatarFile(file);
  if (validation) {
    showToast(validation);
    return;
  }
  avatarUploading = true;
  renderProfilePhotoEditor();
  try {
    let avatarUrl = URL.createObjectURL(file);
    profile = { ...profile, avatarUrl };
    store.set("cls_profile", { ...profile, avatarUrl: "" });
    renderProfile();
    renderDashboard();
    hydrateStaticVisuals();
    renderProfilePhotoEditor();
    if (supabaseReady) {
      avatarUrl = await uploadAvatar(file, SUPABASE_PROFILE_SLUG);
      await updateProfileAvatar(SUPABASE_PROFILE_SLUG, avatarUrl);
      profile = { ...profile, avatarUrl };
      persist();
    }
    showToast("Profile photo updated");
  } catch (error) {
    console.warn("Avatar upload failed", error);
    showToast("Photo preview updated locally. Supabase upload failed.");
  } finally {
    avatarUploading = false;
    renderProfilePhotoEditor();
  }
}

function removeProfileAvatar() {
  profile = { ...profile, avatarUrl: "" };
  persist();
  updateProfileAvatar(SUPABASE_PROFILE_SLUG, "").catch((error) => console.warn("Avatar reset failed", error));
  showToast("Profile photo reset");
}

function switchTab(name) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
  document.querySelectorAll(".tab-view").forEach((view) => view.classList.remove("active"));
  $(`#${name}Tab`).classList.add("active");
}

function openAuth(mode) {
  authMode = mode || "signin";
  $("#authTitle").textContent = authMode === "signin" ? "Sign In" : "Create Account";
  $("#toggleAuth").textContent = authMode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in";
  $("#authModal").classList.add("open");
}

function revealVisible() {
  document.querySelectorAll(".reveal").forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) node.classList.add("visible");
  });
}

async function init() {
  const routeMatch = window.location.pathname.match(/^\/u\/([^/]+)\/?$/);
  if (routeMatch) {
    await initPublicRoute(decodeURIComponent(routeMatch[1]));
    return;
  }
  const loadedFromSupabase = await loadSupabaseState();
  hydrateStaticVisuals();
  renderFeatures();
  renderTemplates();
  renderDashboard();
  renderThemePicker();
  renderProfilePhotoEditor();
  renderLinkEditor();
  renderProjectEditor();
  renderProfile();
  renderProjectGrid();
  renderPricing();
  renderFaq();
  renderReel();
  bindEvents();
  revealVisible();
  window.addEventListener("scroll", revealVisible, { passive: true });
  setInterval(() => {
    reelIndex = (reelIndex + 1) % reelScenes.length;
    renderReel();
  }, 3200);
  const user = store.get("cls_user", null);
  if (user?.loggedIn) {
    const button = document.querySelector("[data-auth='signin']");
    if (button) button.textContent = "Studio";
  }
  if (loadedFromSupabase) showToast("Connected to Supabase");
}

init();
