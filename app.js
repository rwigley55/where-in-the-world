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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Home route
app.get("/", async (req, res) => {
  const countryData = await fetchCountries();

  res.render("home", { countryData: countryData });
});

// Show route
app.get("/:name", async (req, res) => {
  // console.log(req.params);
  const { name } = req.params;
  const countryData = await fetchCountry(name);

  res.render("show", { country: countryData[0] });
});

app.listen(3000, () => {
  console.log(`Serving on Port 3000`);
});
