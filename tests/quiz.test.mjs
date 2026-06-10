import assert from "node:assert/strict";
import { buildTelegramLink, calculateEstimate, createLeadSummary, quizOptions } from "../quiz.js";

assert.deepEqual(Object.keys(quizOptions.pages), ["1", "2-5", "5+"]);
assert.equal(quizOptions.defaults.pages, "1");
assert.equal(quizOptions.defaults.projectType, "landing");
assert.equal(quizOptions.defaults.integrations, "none");
assert.equal(quizOptions.integrations.none.label, "Нет");
assert.equal(quizOptions.integrations.basic.label, "Форма, мессенджеры, аналитика");
assert.equal(quizOptions.integrations.crm.label, "CRM, оплаты, бронирования и т.д.");
assert.equal(quizOptions.projects.landing.base, 5000);
assert.equal(quizOptions.projects.corporate.base, 50000);
assert.equal(quizOptions.projects.shop.base, 100000);
assert.equal(quizOptions.projects.app.base, 150000);
assert.equal(quizOptions.pages["1"].add, 0);
assert.equal(quizOptions.pages["2-5"].add, 5000);
assert.equal(quizOptions.pages["5+"].add, 10000);
assert.equal(quizOptions.design.template.add, 0);
assert.equal(quizOptions.design.custom.add, 5000);
assert.equal(quizOptions.integrations.none.add, 0);
assert.equal(quizOptions.integrations.basic.add, 5000);
assert.equal(quizOptions.integrations.crm.add, 20000);

const simplestEstimate = calculateEstimate({
  projectType: "landing",
  pages: "1",
  design: "template",
  integrations: "none",
  launch: "soon",
});

assert.deepEqual(simplestEstimate, {
  price: "от 5 000 ₽",
  timeline: "от 3 дней",
});

const estimate = calculateEstimate({
  projectType: "landing",
  pages: "1",
  design: "custom",
  integrations: "none",
  launch: "soon",
});

assert.deepEqual(estimate, {
  price: "от 10 000 ₽",
  timeline: "от 7 дней",
});

const complexEstimate = calculateEstimate({
  projectType: "landing",
  pages: "2-5",
  design: "custom",
  integrations: "basic",
  launch: "soon",
});

assert.deepEqual(complexEstimate, {
  price: "от 20 000 ₽",
  timeline: "от 10-14 дней",
});

const summary = createLeadSummary({
  projectType: "landing",
  pages: "1",
  design: "custom",
  integrations: "none",
  launch: "soon",
  telegram: "@client",
});

assert.match(summary, /Лендинг/);
assert.match(summary, /1 страница/);
assert.match(summary, /Нет/);
assert.match(summary, /от 10 000 ₽/);
assert.match(summary, /от 7 дней/);
assert.match(summary, /@client/);

const link = buildTelegramLink("rndmax", summary);

assert.ok(link.startsWith("https://t.me/rndmax?text="));
assert.ok(decodeURIComponent(link).includes("Новая заявка с лендинга"));

console.log("quiz tests passed");
