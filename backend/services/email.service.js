const generateEmail = (contact, company) => {
  return {
    subject: `Quick question about ${company.companyName}`,
    htmlContent: `
      <p>Hi ${contact.name},</p>

      <p>I came across ${company.companyName} and noticed your role in the team.</p>

      <p>We help companies discover similar high-intent prospects and automate outreach pipelines end-to-end.</p>

      <p>Would you be open to a quick conversation?</p>

      <br/>

      <p>Best,<br/>Shubhanshi Gupta</p>
    `
  };
};

module.exports = { generateEmail };