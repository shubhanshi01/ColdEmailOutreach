const PipelineRuns = require("../fallback/PipelineRuns");
const oceanService = require("../services/ocean.service");
const prospeoService = require("../services/prospeo.service");
const prospeoEnrichService = require("../services/verifiedEmail");
const emailService = require("../services/email.service");
const { sendLog } = require("./log.controllers");

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
 * RETRY WRAPPER
 */
const getContactsWithRetry = async (domain, retries = 3) => {
  try {
    return await prospeoService.getDecisionMakers(domain);
  } catch (err) {
    const status = err.response?.status;

    console.log(`Prospeo error (${domain}):`, err.message);

    if (status === 429 && retries > 0) {
      console.log(`Rate limited. Retrying ${domain}. Attempts left: ${retries}`);
      await sleep(5000);
      return getContactsWithRetry(domain, retries - 1);
    }

    return [];
  }
};

const runPipeline = async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: "Domain is required"
      });
    }

    console.log("Starting pipeline:", domain);
    sendLog("Pipeline started");

    const companies = await oceanService.getLookalikeCompanies(domain);
    const companiesToProcess = (companies || []).slice(0, 3);

    sendLog("Companies fetched");

    const enrichedCompanies = [];
    const outreachQueue = [];

    for (const company of companiesToProcess) {
      const companyName = company?.company?.name || "Unknown";

      // FIX 1: safe access
      sendLog(`Processing company: ${companyName}`);

      const companyDomainRaw = company?.company?.domain || "";
      const companyDomain = companyDomainRaw
        .replace("https://", "")
        .replace("http://", "")
        .replace("www.", "")
        .trim();

      if (!companyDomain) continue;

      console.log(`Processing company: ${companyName}`);

      await sleep(2000);

      const contacts = await getContactsWithRetry(companyDomain);

      const enrichedContacts = [];

      for (const contact of (contacts || []).slice(0, 3)) {
        try {
          const linkedinUrl = contact?.person?.linkedin_url;

          if (!linkedinUrl) continue; // FIX 2

          const enriched = await prospeoEnrichService.enrichPerson(linkedinUrl);

          sendLog("Contacts fetched");

          const email = enriched?.person?.email?.email || null;

          const name =
            contact?.person?.full_name ||
            (email ? email.split("@")[0] : null) ||
            "There";

          const contactData = {
            personId: contact?.person?.person_id,
            name,
            title: contact?.person?.job_title,
            linkedin: linkedinUrl,
            email,
            emailStatus: enriched?.person?.email?.status || null,
            emailRevealed: enriched?.person?.email?.revealed || false
          };

          enrichedContacts.push(contactData);

          sendLog("Enriching contacts...");

          /*
           * BUILD EMAIL QUEUE (DO NOT SEND)
           */
          if (email) {
            const mail = emailService.generateEmail(contactData, {
              companyName,
              domain: companyDomain
            });

            outreachQueue.push({
              email: email.trim(),
              name: name?.trim() || "There",

              // FIX 3: consistent naming (must match sendEmails controller)
              subject: mail.subject,
              htmlContent: mail.htmlContent,

              company: companyName
            });
          }

          await sleep(1000);
        } catch (err) {
          console.log(
            `Enrichment failed for ${contact?.person?.full_name || "unknown"}`
          );

          enrichedContacts.push({
            personId: contact?.person?.person_id,
            name: contact?.person?.full_name || "Unknown",
            title: contact?.person?.job_title,
            linkedin: contact?.person?.linkedin_url,
            email: null
          });
        }
      }

      enrichedCompanies.push({
        companyName,
        domain: companyDomain,
        contacts: enrichedContacts
      });

      await sleep(1500);
    }

    /*
     * SAVE PIPELINE RUN (DRAFT MODE)
     */
    const result = await PipelineRuns.create({
      seedDomain: domain,
      companies: enrichedCompanies,
      totalCompanies: enrichedCompanies.length,
      emailsSent: 0,
      status: "draft",
      outreachPreview: outreachQueue,
      createdAt: new Date()
    });

    return res.status(200).json({
      success: true,
      data: {
        runId: result._id,
        companies: enrichedCompanies,
        outreachPreview: outreachQueue,
        requiresApproval: true
      }
    });

  } catch (error) {
    console.error("Pipeline Error:", error);
    sendLog("Pipeline failed");

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  runPipeline
};