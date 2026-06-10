const PROJECTS = {
  landing: { label: "Лендинг", base: 5000 },
  corporate: { label: "Корпоративный сайт", base: 50000 },
  shop: { label: "Интернет-магазин", base: 100000 },
  app: { label: "Веб-приложение или сервис", base: 150000 },
};

const PAGES = {
  1: { label: "1 страница", add: 0 },
  "2-5": { label: "2-5 страниц", add: 5000 },
  "5+": { label: "5+ страниц", add: 10000 },
};

const DESIGN = {
  template: { label: "Быстрее на шаблоне", add: 0 },
  custom: { label: "Индивидуальный дизайн", add: 5000 },
};

const INTEGRATIONS = {
  none: { label: "Нет", add: 0 },
  basic: { label: "Форма, мессенджеры, аналитика", add: 5000 },
  crm: { label: "CRM, оплаты, бронирования и т.д.", add: 20000 },
};

const LAUNCH = {
  soon: { label: "Чем раньше, тем лучше", days: "10-14 дней" },
  month: { label: "В течение месяца", days: "14-21 день" },
  later: { label: "Планирую позже", days: "после согласования" },
};

const DEFAULTS = {
  projectType: "landing",
  pages: "1",
  design: "custom",
  integrations: "none",
  launch: "soon",
  telegram: "",
};

const quizOptions = {
  projects: PROJECTS,
  pages: PAGES,
  design: DESIGN,
  integrations: INTEGRATIONS,
  launch: LAUNCH,
  defaults: DEFAULTS,
};

const TELEGRAM_USERNAME = "rndmax";
const HERO_STACK_QUERY = "(max-width: 1100px)";
const CASE_CENTER_QUERY = "(max-width: 720px)";
const state = { ...quizOptions.defaults };
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const estimatePrice = document.querySelector("[data-estimate-price]");
const estimateTimeline = document.querySelector("[data-estimate-timeline]");
const leadPreview = document.querySelector("[data-lead-preview]");
const telegramButtons = document.querySelectorAll("[data-telegram-link]");
const faqItems = document.querySelectorAll("[data-faq-item]");
const caseCards = document.querySelectorAll(".case-card");
let openFaqId = null;
let caseScrollTicking = false;

function calculateTimeline(values) {
  const isOnePageLanding = values.projectType === "landing" && values.pages === "1";
  const hasNoIntegrations = values.integrations === "none";

  if (isOnePageLanding && hasNoIntegrations && values.design === "template") {
    return "от 3 дней";
  }

  if (isOnePageLanding && hasNoIntegrations && values.design === "custom") {
    return "от 7 дней";
  }

  return "от 10-14 дней";
}

function calculateEstimate(values) {
  const project = PROJECTS[values.projectType] ?? PROJECTS.landing;
  const pages = PAGES[values.pages] ?? PAGES["1"];
  const design = DESIGN[values.design] ?? DESIGN.custom;
  const integrations = INTEGRATIONS[values.integrations] ?? INTEGRATIONS.basic;
  const total = project.base + pages.add + design.add + integrations.add;
  const formattedTotal = new Intl.NumberFormat("ru-RU").format(total).replace(/\u00a0/g, " ");

  return {
    price: `от ${formattedTotal} ₽`,
    timeline: calculateTimeline(values),
  };
}

function createLeadSummary(values) {
  const normalized = { ...DEFAULTS, ...values };
  const estimate = calculateEstimate(normalized);
  const lines = [
    "Новая заявка с лендинга",
    `Проект: ${(PROJECTS[normalized.projectType] ?? PROJECTS.landing).label}`,
    `Объем: ${(PAGES[normalized.pages] ?? PAGES["1"]).label}`,
    `Дизайн: ${(DESIGN[normalized.design] ?? DESIGN.custom).label}`,
    `Интеграции: ${(INTEGRATIONS[normalized.integrations] ?? INTEGRATIONS.basic).label}`,
    `Запуск: ${(LAUNCH[normalized.launch] ?? LAUNCH.soon).label}`,
    `Оценка: ${estimate.price}, ${estimate.timeline}`,
  ];

  if (normalized.telegram) {
    lines.push(`Telegram клиента: ${normalized.telegram}`);
  }

  return lines.join("\n");
}

function buildTelegramLink(username, summary) {
  return `https://t.me/${username}?text=${encodeURIComponent(summary)}`;
}

function getNextOpenFaqId(currentOpenId, clickedId) {
  return currentOpenId === clickedId ? null : clickedId;
}

function updateOptionButtons(name, value) {
  document.querySelectorAll(`[data-option-group="${name}"]`).forEach((button) => {
    const isSelected = button.dataset.optionValue === value;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function render() {
  const estimate = calculateEstimate(state);
  const summary = createLeadSummary(state);
  const link = buildTelegramLink(TELEGRAM_USERNAME, summary);

  estimatePrice.textContent = estimate.price;
  estimateTimeline.textContent = estimate.timeline;
  leadPreview.textContent = summary;
  telegramButtons.forEach((button) => {
    button.setAttribute("href", link);
  });
}

function setFaqPanelHeight(item, isOpen) {
  const panel = item.querySelector("[data-faq-panel]");
  if (!panel) return;
  panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
}

function updateFaqItems() {
  faqItems.forEach((item) => {
    const isOpen = item.dataset.faqItem === openFaqId;
    item.classList.toggle("is-open", isOpen);
    item.querySelector("[data-faq-trigger]")?.setAttribute("aria-expanded", String(isOpen));
    setFaqPanelHeight(item, isOpen);
  });
}

function isHeroStacked(element) {
  const hero = element.closest(".hero");
  const columns = hero ? window.getComputedStyle(hero).gridTemplateColumns : "";

  if (columns) {
    return columns.trim().split(/\s+/).length === 1;
  }

  return window.matchMedia(HERO_STACK_QUERY).matches;
}

function highlightCalculator(element) {
  element.classList.remove("is-attention");
  void element.offsetWidth;
  element.classList.add("is-attention");

  window.setTimeout(() => {
    element.classList.remove("is-attention");
  }, 1300);
}

function updateActiveCaseCard() {
  caseScrollTicking = false;

  if (!window.matchMedia(CASE_CENTER_QUERY).matches) {
    caseCards.forEach((card) => card.classList.remove("is-in-view"));
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  let activeCard = null;

  caseCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const containsCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;

    if (containsCenter && !activeCard) {
      activeCard = card;
    }
  });

  caseCards.forEach((card) => {
    card.classList.toggle("is-in-view", card === activeCard);
  });
}

function requestCaseCardUpdate() {
  if (caseScrollTicking) return;

  caseScrollTicking = true;
  window.requestAnimationFrame(updateActiveCaseCard);
}

document.querySelectorAll("[data-option-group]").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.optionGroup;
    const value = button.dataset.optionValue;
    state[name] = value;
    updateOptionButtons(name, value);
    render();
  });
});

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(button.dataset.scrollTarget);

    if (!target) return;

    if (!isHeroStacked(target)) {
      highlightCalculator(target);
      return;
    }

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    window.setTimeout(() => highlightCalculator(target), prefersReducedMotion ? 0 : 550);
  });
});

faqItems.forEach((item) => {
  item.querySelector("[data-faq-trigger]")?.addEventListener("click", () => {
    openFaqId = getNextOpenFaqId(openFaqId, item.dataset.faqItem);
    updateFaqItems();
  });
});

window.addEventListener("resize", () => {
  updateFaqItems();
  requestCaseCardUpdate();
});

window.addEventListener("scroll", requestCaseCardUpdate, { passive: true });

Object.entries(state).forEach(([name, value]) => updateOptionButtons(name, value));
render();
updateFaqItems();
updateActiveCaseCard();
