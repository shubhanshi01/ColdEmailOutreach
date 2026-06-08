
const express = require("express");
const router = express.Router();
const {
  testOcean,
  testProspeo,
  testEnrichPerson,
  testBrevoConnection,
  testBrevoSendEmail
} = require("../controllers/tester.controller");



const {
  runPipeline
} = require("../controllers/pipeline.controller");

router.post("/tester/ocean", testOcean);
router.post("/test/prospeo", testProspeo);
router.post(
  "/test/enrich-person",
  testEnrichPerson
);
router.get("/test/brevo",testBrevoConnection);
router.post("/brevo/send", testBrevoSendEmail);
router.post("/run", runPipeline);

module.exports = router;