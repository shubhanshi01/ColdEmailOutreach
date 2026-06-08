const generateEmail = (
  contact,
  company
) => {

  return {
    subject:
      `Quick question for ${company.companyName}`,

    html: `
      <p>Hi ${contact.name},</p>

      <p>
      I noticed you're part of the team at
      ${company.companyName}.
      </p>

      <p>
      We've built an AI platform that helps
      sales teams automatically discover
      lookalike companies, find decision makers,
      and verify work emails.
      </p>

      <p>
      Would you be open to a quick discussion?
      </p>

      <p>
      Regards,<br/>
      Shubhanshi
      </p>
    `
  };
};

module.exports = {
  generateEmail
};