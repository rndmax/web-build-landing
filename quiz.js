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

export function calculateEstimate(values) {
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

export function createLeadSummary(values) {
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

export function buildTelegramLink(username, summary) {
  return `https://t.me/${username}?text=${encodeURIComponent(summary)}`;
}

export const quizOptions = {
  projects: PROJECTS,
  pages: PAGES,
  design: DESIGN,
  integrations: INTEGRATIONS,
  launch: LAUNCH,
  defaults: DEFAULTS,
};
