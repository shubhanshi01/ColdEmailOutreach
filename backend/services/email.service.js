const generateEmail = (contact, company) => {
  return {
    subject: `Quick question for ${company.companyName}`,
    htmlContent: `
      <p>Hi ${contact.name},</p>
      <p>I noticed you're part of the leadership team at ${company.companyName}.</p>
      <p>We've built a platform that automatically discovers lookalike companies,
      finds decision makers, and verifies work emails.</p>
      <p>Would you be open to a quick conversation?</p>
      <p>Regards,<br>Shubhanshi Gupta</p>
    `  
  };
};

module.exports = { generateEmail };