import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const privacyUrl = new URL("../privacy.html", import.meta.url);
const privacyHtml = existsSync(privacyUrl) ? readFileSync(privacyUrl, "utf8") : "";
const faviconUrl = new URL("../favicon.svg", import.meta.url);
const faviconSvg = existsSync(faviconUrl) ? readFileSync(faviconUrl, "utf8") : "";
const socialPreviewUrl = new URL("../assets/social-preview.svg", import.meta.url);
const socialPreviewSvg = existsSync(socialPreviewUrl) ? readFileSync(socialPreviewUrl, "utf8") : "";
const launchPlanText =
  "Ответьте на вопросы в Telegram — получите список того, что нужно для запуска: базовый минимум, структуру сайта, аналитику и, самое важное, юридический блок, чтобы снизить риск штрафов.";
const normalizedHtml = html.replace(/\s+/g, " ");

function optionValues(groupName) {
  return [
    ...html.matchAll(
      new RegExp(`data-option-group="${groupName}" data-option-value="([^"]+)"`, "g"),
    ),
  ].map((match) => match[1]);
}

assert.deepEqual(optionValues("pages"), ["1", "2-5", "5+"]);
assert.deepEqual(optionValues("design"), ["custom", "template"]);
assert.deepEqual(optionValues("integrations"), ["none", "basic", "crm"]);
assert.match(html, /<strong data-estimate-price>от 10 000 ₽<\/strong>/);
assert.match(html, /<small data-estimate-timeline>от 7 дней<\/small>/);
assert.doesNotMatch(html, /webstudio_owner/);
assert.match(html, /https:\/\/t\.me\/rndmax/);
assert.match(html, /data-telegram-link[^>]*target="_blank"[^>]*rel="noopener noreferrer"/);
assert.match(html, /<script src="\.\/script\.js"><\/script>/);
assert.doesNotMatch(html, /type="module"/);
assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\.\/favicon\.svg" \/>/);
assert.match(privacyHtml, /<link rel="icon" type="image\/svg\+xml" href="\.\/favicon\.svg" \/>/);
assert.match(
  privacyHtml,
  /<nav class="main-nav" aria-label="Основная навигация">[\s\S]*?<a href="\.\/index\.html">Главная<\/a>[\s\S]*?<a href="\.\/index\.html#cases">Кейсы<\/a>/,
);
assert.match(
  html,
  /<meta[\s\S]*?name="description"[\s\S]*?content="Корпоративный портал, лендинг для рекламы или интернет-магазин с системой лояльности — под ключ\. С фиксированной ценой, прозрачными сроками и официальной гарантией\."[\s\S]*?\/>/,
);
assert.match(html, /<meta property="og:type" content="website" \/>/);
assert.match(html, /<meta property="og:locale" content="ru_RU" \/>/);
assert.match(html, /<meta property="og:site_name" content="WebBuild" \/>/);
assert.match(
  html,
  /<meta[\s\S]*?property="og:title"[\s\S]*?content="Создадим сайт, который приносит заявки: от прототипа до запуска за 14 дней"[\s\S]*?\/>/,
);
assert.match(
  html,
  /<meta[\s\S]*?property="og:description"[\s\S]*?content="Корпоративный портал, лендинг для рекламы или интернет-магазин с системой лояльности — под ключ\. С фиксированной ценой, прозрачными сроками и официальной гарантией\."[\s\S]*?\/>/,
);
assert.match(html, /<meta property="og:image" content="\.\/assets\/social-preview\.svg" \/>/);
assert.match(html, /<meta property="og:image:type" content="image\/svg\+xml" \/>/);
assert.match(html, /<meta property="og:image:width" content="1200" \/>/);
assert.match(html, /<meta property="og:image:height" content="630" \/>/);
assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
assert.match(
  html,
  /<meta[\s\S]*?name="twitter:title"[\s\S]*?content="Создадим сайт, который приносит заявки: от прототипа до запуска за 14 дней"[\s\S]*?\/>/,
);
assert.match(
  html,
  /<meta[\s\S]*?name="twitter:description"[\s\S]*?content="Корпоративный портал, лендинг для рекламы или интернет-магазин с системой лояльности — под ключ\. С фиксированной ценой, прозрачными сроками и официальной гарантией\."[\s\S]*?\/>/,
);
assert.match(html, /<meta name="twitter:image" content="\.\/assets\/social-preview\.svg" \/>/);
assert.match(html, /<footer class="site-footer"[^>]*>[\s\S]*?ИП Иванов Иван Юрьевич/);
assert.match(html, /Разработка сайтов и корпоративных веб приложений/);
assert.match(privacyHtml, /Разработка сайтов и корпоративных веб приложений/);
assert.doesNotMatch(html, /Временное название до утверждения бренда/);
assert.doesNotMatch(privacyHtml, /Временное название до утверждения бренда/);
assert.match(html, /ИНН:\s*238473487348/);
assert.match(html, /ОГРНИП:\s*3438243284234/);
assert.match(html, /href="mailto:info@mail\.ru"/);
assert.match(html, /Москва, Россия/);
assert.match(
  html,
  /href="\.\/privacy\.html" target="_blank" rel="noopener noreferrer"[\s\S]*?Политика обработки персональных данных/,
);
assert.match(
  privacyHtml,
  /href="\.\/privacy\.html" target="_blank" rel="noopener noreferrer"[\s\S]*?Политика обработки персональных данных/,
);
assert.match(html, /Ответьте на 4 вопроса, и мы покажем ориентир по цене и срокам\./);
assert.doesNotMatch(
  html,
  /Ответьте на 4 вопроса, и мы отправим ориентир по цене и срокам в Telegram\./,
);
assert.match(
  html,
  /<div class="telegram-plan">[\s\S]*?<h3>Получите план запуска сайта за 5 минут<\/h3>/,
);
assert.ok(normalizedHtml.includes(launchPlanText));
assert.match(html, />\s*Получить план в Telegram\s*<\/a>/);
assert.doesNotMatch(html, /Получить расчет в Telegram/);
const finalCta =
  html.match(/<section class="final-cta section-shell">([\s\S]*?)<\/section>/)?.[1] ?? "";
const normalizedFinalCta = finalCta.replace(/\s+/g, " ");
assert.match(finalCta, /<a[\s\S]*?>\s*Получите план запуска сайта за 5 минут\s*<\/a>/);
assert.ok(normalizedFinalCta.includes(launchPlanText));
assert.doesNotMatch(finalCta, /Готовы обсудить проект/);
assert.doesNotMatch(finalCta, /Рассчитаем формат сайта и предложим следующий шаг/);
assert.doesNotMatch(finalCta, /Написать в Telegram/);
assert.match(html, /<strong>Фиксированная цена<\/strong>\s*<span>без доплат в процессе<\/span>/);
assert.doesNotMatch(
  html,
  /<strong>4 кейса<\/strong>\s*<span>с сайтами, CRM и автоматизацией<\/span>/,
);
assert.doesNotMatch(html, /Ваш Telegram для ответа/);
assert.doesNotMatch(html, /data-telegram-input/);
assert.doesNotMatch(html, /class="telegram-field"/);

assert.match(html, /Базовая подготовка для Яндекс \(Алиса ИИ\) и Google \(остальные ИИ\)\./);
const caseGrid = html.match(/<div class="case-grid">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] ?? "";
const normalizedCaseGrid = caseGrid.replace(/\s+/g, " ");
const caseTitles = [...caseGrid.matchAll(/<h3>(.*?)<\/h3>/g)].map((match) => match[1]);

assert.deepEqual(caseTitles, ["Good Story Club", "Novo-Dent", "Arendo", "Umnico"]);
assert.equal((caseGrid.match(/class="case-card"/g) ?? []).length, 4);
assert.equal((caseGrid.match(/target="_blank"/g) ?? []).length, 4);
assert.equal((caseGrid.match(/rel="noopener noreferrer"/g) ?? []).length, 4);
assert.match(caseGrid, /href="https:\/\/novo-dent\.vercel\.app\/"/);
assert.match(caseGrid, /href="https:\/\/arendo\.korevsky\.ru\/"/);
assert.match(caseGrid, /href="https:\/\/umnico\.com\/ru\/"/);
assert.doesNotMatch(caseGrid, /href="https:\/\/arendo\.ru\/"/);
assert.doesNotMatch(caseGrid, /href="https:\/\/umnico\.com\/"/);
assert.doesNotMatch(caseGrid, /Good Story Surf/);
assert.match(caseGrid, /case-novo-dent\.png/);
assert.ok(
  normalizedCaseGrid.includes(
    "Сайт семейной стоматологической клиники с услугами, врачами, расписанием и записью на первый визит.",
  ),
);
assert.ok(
  normalizedHtml.includes(
    "Система управления бронированием: личные кабинеты, роли доступа, документы, платежи, заметки и логирование действий.",
  ),
);
assert.ok(
  normalizedHtml.includes(
    "Высоконагруженная система с внутренним CRM, календарем и чатами, омниканальная платформа.",
  ),
);

const solutionGrid = html.match(/<div class="solution-grid">([\s\S]*?)<\/div>/)?.[1] ?? "";
const solutionTitles = [...solutionGrid.matchAll(/<strong>(.*?)<\/strong>/g)].map(
  (match) => match[1],
);

assert.deepEqual(solutionTitles, [
  "Онлайн-оплаты",
  "Бронирование",
  "Личные кабинеты",
  "Программы лояльности",
  "Интеграции и автоматизация",
  "CRM и воронки",
]);

assert.match(html, /class="header-cta"[^>]*aria-label="Написать в Telegram"/);
assert.match(html, /<span class="header-cta-label">Написать в Telegram<\/span>/);
assert.match(html, /class="header-cta-icon"/);
assert.match(css, /\.calculator-panel\.is-attention/);
assert.match(css, /animation:\s*calculatorAttention 1250ms ease-out;/);
assert.match(css, /scroll-margin-top:\s*18px/);
assert.match(css, /@keyframes calculatorAttention/);
assert.match(css, /18%,\s*62%/);
assert.match(css, /38%,\s*82%/);
assert.doesNotMatch(css, /86%/);
assert.match(css, /transition:[\s\S]*?background-color 220ms ease/);
assert.match(css, /background-color:\s*#fff1e8/);
assert.match(css, /background-color:\s*var\(--white\)/);
assert.match(css, /box-shadow:\s*0 0 0 6px rgba\(255, 90, 22, 0\.2\)/);
assert.match(css, /\.telegram-plan \{/);
assert.match(css, /\.telegram-plan h3 \{/);
assert.match(css, /\.telegram-plan p \{/);
assert.match(css, /\.case-card \{[\s\S]*?cursor:\s*pointer;[\s\S]*?transition:/);
assert.match(css, /\.case-card:hover,[\s\S]*?\.case-card\.is-in-view \{/);
assert.match(css, /\.case-card:hover img,[\s\S]*?\.case-card\.is-in-view img \{/);
assert.match(css, /\.footer-contacts \{/);
assert.match(css, /\.footer-links \{/);
assert.match(css, /\.legal-page \{/);
assert.match(
  css,
  /\.faq \{[\s\S]*?grid-template-columns:\s*minmax\(420px, 0\.46fr\) minmax\(0, 1fr\);/,
);
assert.match(
  css,
  /\.faq-heading h2 \{[\s\S]*?max-width:\s*460px;[\s\S]*?font-size:\s*clamp\(42px, 5vw, 72px\);/,
);
assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.site-header \{[\s\S]*?position: static;/);
assert.match(
  css,
  /@media \(max-width: 720px\)[\s\S]*?\.site-header \{[\s\S]*?flex-direction: row;/,
);
assert.match(
  css,
  /@media \(max-width: 720px\)[\s\S]*?\.header-cta \{[\s\S]*?background:\s*transparent;[\s\S]*?color:\s*var\(--navy\);/,
);
assert.doesNotMatch(css, /background:\s*#229ed9/);
assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.header-cta-label \{[\s\S]*?display: none;/);
assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.header-cta-icon \{[\s\S]*?display: block;/);

const script = readFileSync(new URL("../script.js", import.meta.url), "utf8");

assert.doesNotMatch(script, /^import /m);
assert.match(script, /const TELEGRAM_USERNAME = "rndmax"/);
assert.doesNotMatch(script, /webstudio_owner/);
assert.match(script, /const CASE_CENTER_QUERY = "\(max-width: 720px\)"/);
assert.match(script, /function updateActiveCaseCard/);
assert.match(script, /classList\.toggle\("is-in-view"/);
assert.doesNotMatch(script, /function isElementInViewport/);
assert.match(script, /const HERO_STACK_QUERY = "\(max-width: 1100px\)"/);
assert.match(script, /function isHeroStacked/);
assert.match(script, /function highlightCalculator/);
assert.match(script, /classList\.add\("is-attention"\)/);
assert.match(script, /\}, 1300\);/);
assert.match(script, /if \(!isHeroStacked\(target\)\)/);
assert.match(script, /block:\s*"start"/);
assert.doesNotMatch(
  script,
  /block:\s*window\.matchMedia\("\(max-width: 720px\)"\)\.matches\s*\?\s*"start"\s*:\s*"center"/,
);

assert.ok(existsSync(privacyUrl));
assert.match(privacyHtml, /Политика обработки персональных данных/);
assert.match(privacyHtml, /ИП Иванов Иван Юрьевич/);
assert.match(privacyHtml, /Telegram ID/);
assert.match(privacyHtml, /Telegram username/);
assert.match(privacyHtml, /Имя профиля Telegram/);
assert.match(privacyHtml, /Телефон\/e-mail/);
assert.match(privacyHtml, /Сообщения пользователя/);
assert.match(privacyHtml, /Данные калькулятора/);
assert.match(privacyHtml, /IP, cookies и технические данные/);
assert.match(privacyHtml, /Данные о согласиях/);
assert.match(privacyHtml, /152-ФЗ/);
assert.match(privacyHtml, /149-ФЗ/);

assert.ok(existsSync(faviconUrl));
assert.match(faviconSvg, /<svg[^>]*viewBox="0 0 64 64"/);
assert.match(faviconSvg, /<circle[^>]*fill="#07122f"/);
assert.match(faviconSvg, />wb<\/text>/);
assert.ok(existsSync(socialPreviewUrl));
assert.match(socialPreviewSvg, /<svg[^>]*viewBox="0 0 1200 630"/);
assert.match(socialPreviewSvg, />wb<\/text>/);
assert.match(socialPreviewSvg, /Создадим сайт, который приносит заявки/);
assert.match(socialPreviewSvg, /Корпоративный портал, лендинг для рекламы/);

console.log("content tests passed");
