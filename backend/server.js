const express = require("express");
const { getTodaysReadings } = require("./scripts/readingScraper");
const bodyParser = require("body-parser");
const cors = require("cors");
const bibleLibrary = require("./scripts/bibleLibrary");
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
  const reading = await getTodaysReadings();
  res.json(reading);
});

app.get("/bible", async (req, res) => {
  const { book, chapter, verses, translated } = req.query;
  const content = await bibleLibrary.getReading(
    book,
    chapter,
    verses,
    translated == "true"
  );
  res.json(content);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
