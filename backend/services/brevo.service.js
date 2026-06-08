const axios = require("axios");

const BREVO_URL = "https://api.brevo.com/v3";

const headers = {
  "api-key": process.env.BREVO_API_KEY,
  "Content-Type": "application/json"
};

const getAccount = async () => {
  const response = await axios.get(`${BREVO_URL}/account`, {
    headers
  });

  return response.data;
};

const sendEmail = async ({ to, subject, htmlContent }) => {
  // Normalize "to"
  const recipients = Array.isArray(to)
    ? to
    : [{ email: to, name: "" }];

  const cleanRecipients = recipients.map(r => ({
    email: String(r.email).trim(),
    name: r.name || ""
  }));

  console.log("CLEAN RECIPIENTS:", cleanRecipients);

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        email: process.env.SENDER_EMAIL,
        name: "Subspace"
      },
      to: cleanRecipients,
      subject,
      htmlContent
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

// ✅ BULK SENDING (SAFE LOOP VERSION)
const sendCampaign = async (contacts) => {
  const results = [];

  for (const contact of contacts) {
    try {
      const res = await sendEmail({
        to: contact.email,
        name: contact.name,
        subject: contact.subject || "Hello",
        htmlContent: contact.html || "<p>Hello</p>"
      });

      results.push({ email: contact.email, status: "sent", res });
    } catch (err) {
      results.push({
        email: contact.email,
        status: "failed",
        error: err.response?.data || err.message
      });
    }
  }

  return results;
};

module.exports = {
  getAccount,
  sendEmail,
  sendCampaign
};