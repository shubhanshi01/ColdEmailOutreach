const axios = require("axios");

const BREVO_URL = "https://api.brevo.com/v3";

const headers = {
  "api-key": process.env.BREVO_API_KEY,
  "Content-Type": "application/json"
};

const SENDER_EMAIL =
  process.env.SENDER_EMAIL ||
  process.env.Sender_email ||
  process.env.SENDEREMAIL ||
  process.env.SENDER ||
  process.env.SenderEmail ||
  "";

const getAccount = async () => {
  const response = await axios.get(`${BREVO_URL}/account`, { headers });
  return response.data;
};

const sendEmail = async ({ to, subject, htmlContent }) => {
  const recipients = Array.isArray(to) ? to : [{ email: to, name: "" }];

  const cleanRecipients = recipients.map(r => ({
    email: String(r.email).trim(),
    name: r.name || ""
  }));

  if (!SENDER_EMAIL) {
    throw new Error("SENDER_EMAIL is not set in environment.");
  }

  const response = await axios.post(
    `${BREVO_URL}/smtp/email`,
    {
      sender: { email: SENDER_EMAIL, name: "Subspace" },
      to: cleanRecipients,
      subject,
      htmlContent  // ✅ correct key
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

const sendCampaign = async (contacts) => {
  const results = [];

  for (const contact of contacts) {
    try {
      const res = await sendEmail({
        to: { email: contact.email, name: contact.name || "" },
        subject: contact.subject || "Hello",
        htmlContent: contact.htmlContent || "<p>Hello</p>"  // ✅ was contact.html
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

// ✅ Single module.exports — previously overwritten by generateEmail's export
module.exports = { getAccount, sendEmail, sendCampaign };