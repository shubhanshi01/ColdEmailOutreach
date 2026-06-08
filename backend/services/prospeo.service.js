const getDecisionMakers = async (domain) => {

  const payload = {
    page: 1,
    filters: {
      company: {
        websites: {
          include: [domain]
        }
      },
      person_seniority: {
        include: [
          "Founder/Owner",
          "C-Suite",
          "Vice President"
        ]
      }
    }
  };

  const response = await fetch(
    "https://api.prospeo.io/search-person",
    {
      method: "POST",
      headers: {
        "X-KEY": process.env.PROSPEO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  console.log("Prospeo Status:", response.status);
  console.log(
    "Prospeo Response:",
    JSON.stringify(data, null, 2)
  );

  if (!response.ok) {
    throw new Error(
      JSON.stringify(data)
    );
  }

  return (data.results || []).slice(0,3);
};
module.exports = {
  getDecisionMakers
};