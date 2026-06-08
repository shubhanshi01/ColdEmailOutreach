const PipelineRuns = require("../fallback/PipelineRuns");
const oceanService = require("../services/ocean.service");
const prospeoService = require("../services/prospeo.service");
const prospeoEnrichService = require("../services/verifiedEmail");
const emailService = require("../services/email.service");
const brevoService = require("../services/brevo.service");

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
 * PROSPEO RETRY WRAPPER (handles 429)
 */
const getContactsWithRetry = async (domain, retries = 3) => {
  try {
    return await prospeoService.getDecisionMakers(domain);
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data || err.message;

    console.log(`Prospeo error (${domain}):`, message);

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

    console.log("Starting pipeline for:", domain);

    const companies = await oceanService.getLookalikeCompanies(domain);
    const companiesToProcess = companies.slice(0, 3);

    const enrichedCompanies = [];
    const outreachQueue = [];

    for (const company of companiesToProcess) {
      const companyName = company.company.name;
      const companyDomain = company.company.domain
        .replace("https://", "")
        .replace("http://", "")
        .replace("www.", "")
        .trim();

      console.log(`Processing company: ${companyName}`);

      await sleep(2500);

      let contacts = await getContactsWithRetry(companyDomain);

      const enrichedContacts = [];

      for (const contact of contacts.slice(0, 3)) {
        try {
          const enriched =
            await prospeoEnrichService.enrichPerson(
              contact.person.linkedin_url
            );

          const email =
            enriched.person?.email?.email || null;

          const name =
            contact.person.full_name ||
            contact.person.first_name ||
            contact.person.last_name ||
            email?.split("@")[0] ||
            "There";

          const contactData = {
            personId: contact.person.person_id,
            name,
            title: contact.person.job_title,
            linkedin: contact.person.linkedin_url,
            email,
            emailStatus: enriched.person?.email?.status || null,
            emailRevealed: enriched.person?.email?.revealed || false
          };

          enrichedContacts.push(contactData);

          /*
           * EMAIL QUEUE
           */
          if (email) {
            const mail = emailService.generateEmail(contactData, {
              companyName,
              domain: companyDomain
            });

            outreachQueue.push({
              email: email.trim(),
              name: (name || email.split("@")[0] || "There").trim(),
              subject: mail.subject,
              html: mail.html
            });
          }

          await sleep(1200);

        } catch (err) {
          console.log(
            `Enrichment failed for ${contact.person.full_name || "unknown contact"}`
          );

          enrichedContacts.push({
            personId: contact.person.person_id,
            name: contact.person.full_name || "Unknown",
            title: contact.person.job_title,
            linkedin: contact.person.linkedin_url,
            email: null,
            emailStatus: null,
            emailRevealed: false
          });
        }
      }

      enrichedCompanies.push({
        companyName,
        domain: companyDomain,
        contacts: enrichedContacts
      });

      await sleep(2000);
    }

    /*
     * SEND EMAILS (BREVO)
     */
    let brevoResult = null;

    if (outreachQueue.length > 0) {
      console.log(`Sending ${outreachQueue.length} emails`);

      const cleanQueue = outreachQueue
        .filter((c) => c.email && c.email.includes("@"))
        .map((c) => ({
          ...c,
          name: c.name?.trim() || c.email.split("@")[0] || "There"
        }));

      brevoResult = await brevoService.sendCampaign(cleanQueue);
    }

    /*
     * SAVE PIPELINE RUN
     */
    const result = await PipelineRuns.create({
      seedDomain: domain,
      companies: enrichedCompanies,
      totalCompanies: enrichedCompanies.length,
      emailsSent: outreachQueue.length,
      brevoResult,
      status: "completed",
      createdAt: new Date()
    });

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Pipeline Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  runPipeline
};