const oceanService = require("../services/ocean.service");
const prospeoService = require("../services/prospeo.service");
const brevoService = require("../services/brevo.service");

const testOcean = async (req, res) => {
  try {
    const { domain } = req.body;

    const companies =
      await oceanService.getLookalikeCompanies(domain);

    return res.json({
      success: true,
      total: companies.length,
      companies
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const testProspeo = async (req, res) => {
  try {
    const { domain } = req.body;

    const contacts =
      await prospeoService.getDecisionMakers(domain);

    return res.json({
      success: true,
      total: contacts.length,
      contacts
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



const prospeoEnrich =
  require("../services/verifiedEmail");

const testEnrichPerson =
  async (req, res) => {

    try {

      const { linkedinUrl } = req.body;

      const result =
        await prospeoEnrich.enrichPerson(
          linkedinUrl
        );

      return res.json(result);

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }
};



const testBrevoConnection = async (req, res) => {
  try {
    // Simple account check (optional but useful)
    const account = await brevoService.getAccount();

    return res.json({
      success: true,
      message: "Brevo connection successful",
      account
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.response?.data || error.message
    });
  }
};

const testBrevoSendEmail = async (req, res) => {
  try {
    const {
      to,
      subject,
      htmlContent
    } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: "to, subject, htmlContent are required"
      });
    }

    const result = await brevoService.sendEmail({
      to,
      subject,
      htmlContent
    });

    return res.json({
      success: true,
      message: "Email sent successfully",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.response?.data || error.message
    });
  }
};

module.exports = {
  testBrevoConnection,
  testBrevoSendEmail,
  testOcean,
  testProspeo,
  testEnrichPerson
};