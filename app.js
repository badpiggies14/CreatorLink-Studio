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

const features = [
  ["Links", "Bio-link builder", "Create a polished link hub with active toggles, theme controls, and instant publishing."],
  ["Work", "Portfolio showcase", "Feature projects, outcomes, tools, demos, and case-study-ready presentation."],
  ["Grid", "Project gallery", "Turn scattered work samples into a curated grid that looks investor and client ready."],
  ["Theme", "Custom themes", "Choose premium gradients and branded surfaces without touching code."],
  ["Social", "Social links", "Bring every channel into one clean, mobile-first creator identity."],
  ["Lead", "Contact form", "Collect qualified project inquiries with budget, service type, and message context."],
  ["Offer", "Service listing", "Package what you offer so visitors understand how to hire you."],
  ["Data", "Analytics dashboard", "Track views, clicks, inquiries, growth, and profile completion."],
  ["SEO", "SEO-ready profiles", "Give your public creator profile strong content structure and clear metadata."],
  ["Phone", "Mobile-first design", "Every page is tuned for thumbs, narrow screens, and fast scanning."],
  ["Brand", "Custom branding", "Make the profile feel like your own studio, not a generic link page."],
  ["Fast", "Fast publishing", "Edit once, preview instantly, and keep the public page fresh."]
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
  { title: "Portfolio", url: "https://creator.link/portfolio", active: true },
  { title: "YouTube", url: "https://youtube.com", active: true },
  { title: "GitHub", url: "https://github.com", active: true },
  { title: "Instagram", url: "https://instagram.com", active: true },
  { title: "Book a Call", url: "https://cal.com", active: true },
  { title: "Latest Project", url: "https://creator.link/latest", active: true }
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
let selectedTheme = store.get("cls_theme", themes[0].name);
let billing = "monthly";
let authMode = "signin";

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

function renderFeatures() {
  $("#featureGrid").innerHTML = features.map(([icon, title, description], index) => `
    <article class="feature-card reveal" style="transition-delay:${Math.min(index * 28, 220)}ms">
      <div class="feature-icon">${icon}</div>
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
          <div class="avatar" style="width:3.3rem;height:3.3rem;margin:0 0 .8rem;background:linear-gradient(135deg,${c1},${c2})">${name[0]}</div>
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
  return store.get("cls_inquiries", []);
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

function persist() {
  store.set("cls_links", links);
  store.set("cls_projects", projects);
  store.set("cls_theme", selectedTheme);
  renderProfile();
  renderProjectGrid();
  renderDashboard();
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
      <div class="avatar" style="background:linear-gradient(135deg,${theme.c1},${theme.c2})">M</div>
      <h3>Maya Chen</h3>
      <p>@mayamakes - Product designer and creative technologist crafting brand systems, launch pages, and creator tools.</p>
      <div class="mini-socials"><span>Dr</span><span>Ig</span><span>Be</span></div>
      ${links.map((link) => `<a class="profile-link ${link.active ? "" : "disabled"}" href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${escapeText(link.title)}</a>`).join("")}
      <div class="preview-projects">
        ${projects.slice(0, 3).map((project) => `<div class="preview-project"><strong>${escapeText(project.title)}</strong><p>${escapeText(project.category)} - ${escapeText(project.stack)}</p></div>`).join("")}
      </div>
      <button class="secondary-button small" id="shareProfile" style="margin-top:1rem">Copy Profile Link</button>
    </div>
  `;
}

function renderProjectGrid() {
  $("#projectGrid").innerHTML = projects.map((project) => `
    <article class="project-card reveal" style="--c1:${project.c1};--c2:${project.c2}">
      <div class="project-thumb"></div>
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
  $("#reelScreen").innerHTML = `<div class="reel-visual"><div><span class="eyebrow"><span></span> Scene ${reelIndex + 1}</span><strong>${title}</strong><p>${detail}</p><div class="reel-art"><span></span><span></span><span></span></div></div></div>`;
  $("#reelSteps").innerHTML = reelScenes.map((scene, index) => `<div class="reel-step ${index === reelIndex ? "active" : ""}">${index + 1}. ${scene[0]}</div>`).join("");
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

    handleLinkButtons(event.target);
    handleProjectButtons(event.target);

    if (event.target.id === "shareProfile") {
      navigator.clipboard?.writeText("https://creator.link/mayamakes");
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
  });

  $("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const inquiries = getInquiries();
    inquiries.push({ ...data, createdAt: new Date().toISOString() });
    store.set("cls_inquiries", inquiries);
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

function init() {
  renderFeatures();
  renderTemplates();
  renderDashboard();
  renderThemePicker();
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
}

init();
