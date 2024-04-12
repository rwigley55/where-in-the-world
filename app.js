const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const axios = require("axios");
const app = express();

// EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configs
app.use(express.static(path.join(__dirname, "public")));

const fetchCountries = async () => {
  try {
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags"
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const fetchCountry = async (name = "") => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${name}?fullText=true`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const fetchCountryCode = async (code) => {
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/alpha/${code}`
    );
    if (!response.data || response.data.length === 0) {
      console.error(`No data returned for code: ${code}`);
      return null;
    }
    return response.data[0];
  } catch (error) {
    console.error("Failed to fetch country data for code:", code, error);
    return null; // Return null on failure
  }
};

// Utility function for border countries
const fetchBorderCountries = async (borderCodes) => {
  if (!borderCodes) return []; // Return an empty array if there are no border codes

  const requests = borderCodes.map((code) => fetchCountryCode(code)); // Create a promise for each code
  const borderCountries = await Promise.all(requests); // Execute all promises concurrently

  return borderCountries.map((country) =>
    country ? country.name.common : "Unknown"
  ); // Map each country to its official name or 'Unknown'
};

// Home route
app.get("/", async (req, res) => {
  const countryData = await fetchCountries();
  res.render("home", { countryData: countryData });
});

// Show route
app.get("/:name", async (req, res) => {
  const { name } = req.params;
  const countryData = await fetchCountry(name);

  // Check if country data was successfully fetched and is not empty
  if (!countryData || countryData.length === 0) {
    console.error("No country found or an error occurred");
    return res.status(404).send("Country not found.");
  }

  const country = countryData[0];

  // Check if 'borders' property exists
  if (!country.borders) {
    console.log("This country does not have any bordering countries.");
    res.render("show", { country, borderCountries: [] }); // Pass an empty array if no borders exist
    return;
  }
  const borderCountries = await fetchBorderCountries(country.borders);

  res.render("show", { country, borderCountries });
});

app.listen(3000, () => {
  console.log(`Serving on Port 3000`);
});
