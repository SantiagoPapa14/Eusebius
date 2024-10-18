const express = require("express");
const { getTodaysReadings } = require("./scripts/readingScraper");
const bodyParser = require("body-parser");
const cors = require("cors");
const { populateReadings } = require("./scripts/bibleLibrary");
require("dotenv").config();

// Create an Express app
const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Simple route
app.get("/readings", async (req, res) => {
  const { translated, includeContent } = req.query;
  const isTranslated = translated === "true";
  const doIncludeContent = includeContent === "true";
  const reading = await getTodaysReadings();
  if (doIncludeContent) {
    await populateReadings(reading, isTranslated);
  } else {
    res.json(reading);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
