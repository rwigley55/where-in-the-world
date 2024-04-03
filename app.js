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
      "https://restcountries.com/v3.1/all?fields=name,capital,region,population"
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Home route
app.get("/", async (req, res) => {
  const countryData = await fetchCountries();

  res.render("home", { countryData: countryData });
});

app.listen(3000, () => {
  console.log(`Serving on Port 3000`);
});
