// services/prospeo-enrich.service.js

const enrichPerson = async (linkedinUrl) => {
  const response = await fetch(
    "https://api.prospeo.io/enrich-person",
    {
      method: "POST",
      headers: {
        "X-KEY": process.env.PROSPEO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        only_verified_email: true,
        data: {
          linkedin_url: linkedinUrl
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
};

module.exports = { enrichPerson };