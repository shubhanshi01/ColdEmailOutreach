const getLookalikeCompanies = async (domain) => {
  try {
    const payload = {
      companiesFilters: {
        lookalikeDomains: [domain],
      },
      size: 10,
    };

    //console.log("Ocean Request:");
   // console.log(JSON.stringify(payload, null, 2));

    const response = await fetch(
      "https://api.ocean.io/v3/search/companies",
      {
        method: "POST",
        headers: {
          "x-api-token": process.env.OCEAN_API_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

   // console.log("Ocean Status:", response.status);
   // console.log("Ocean Response:");
   // console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(
        `Ocean API Error ${response.status}: ${JSON.stringify(data)}`
      );
    }

    return data.companies || [];
  } catch (error) {
    console.error("Error fetching lookalike companies:", error.message);
    return [];
  }
};

module.exports = {
  getLookalikeCompanies,
};