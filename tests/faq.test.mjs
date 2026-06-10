import assert from "node:assert/strict";
import { faqItems, getNextOpenFaqId } from "../faq.js";

assert.ok(faqItems.length >= 6, "FAQ should include core client objections");
assert.equal(faqItems[0].id, "timeline");
assert.match(faqItems[0].question, /срок/i);
assert.match(faqItems[0].answer, /14 дней|10-14 дней/);

assert.equal(getNextOpenFaqId(null, "timeline"), "timeline");
assert.equal(getNextOpenFaqId("timeline", "ownership"), "ownership");
assert.equal(getNextOpenFaqId("ownership", "ownership"), null);

console.log("faq tests passed");
