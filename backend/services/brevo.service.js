const axios = require("axios");

const BREVO_URL = "https://api.brevo.com/v3";

const headers = {
  "api-key": process.env.BREVO_API_KEY,
  "Content-Type": "application/json"
};

const SENDER_EMAIL = process.env.SENDER_EMAIL;

const getAccount = async () => {
  const response = await axios.get(
    `${BREVO_URL}/account`,
    { headers }
  );

  return response.data;
};

const sendEmail = async ({
  to,
  subject,
  htmlContent
}) => {

  let recipients = [];

  // string email
  if (typeof to === "string") {

    recipients = [
      {
        email: to.trim(),
        name: "Prospect"
      }
    ];

  }

  // object { email, name }
  else if (
    typeof to === "object" &&
    !Array.isArray(to) &&
    to?.email
  ) {

    recipients = [
      {
        email: String(to.email).trim(),
        name: to.name || "Prospect"
      }
    ];

  }

  // array
  else if (Array.isArray(to)) {

    recipients = to.map((r) => ({
      email: String(r.email).trim(),
      name: r.name || "Prospect"
    }));

  }

  else {
    throw new Error("Invalid recipient format");
  }

  if (!SENDER_EMAIL) {
    throw new Error(
      "SENDER_EMAIL is not set in environment."
    );
  }

  const payload = {
    sender: {
      email: SENDER_EMAIL,
      name: "Subspace"
    },
    to: recipients,
    subject,
    htmlContent
  };

  console.log(
    "BREVO PAYLOAD:",
    JSON.stringify(payload, null, 2)
  );

  try {

    const response = await axios.post(
      `${BREVO_URL}/smtp/email`,
      payload,
      {
        headers
      }
    );

    return response.data;

  } catch (err) {

    console.error(
      "BREVO ERROR:",
      JSON.stringify(
        err.response?.data,
        null,
        2
      )
    );

    throw new Error(
      err.response?.data?.message ||
      err.message
    );
  }
};

const sendCampaign = async (contacts) => {

  const results = [];

  for (const contact of contacts) {

    try {

      const result =
        await sendEmail({
          to: {
            email: contact.email,
            name:
              contact.name ||
              "Prospect"
          },
          subject:
            contact.subject ||
            "Hello",
          htmlContent:
            contact.htmlContent ||
            "<p>Hello</p>"
        });

      results.push({
        email: contact.email,
        status: "sent",
        result
      });

    } catch (err) {

      results.push({
        email: contact.email,
        status: "failed",
        error: err.message
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