const express = require("express");
const { getTodaysReadings } = require("./scripts/readingScraper");
const latinBible = require("./constants/latin/VULG.json");
const englishBible = require("./constants/english/CPDV.json");
const bodyParser = require("body-parser");
const cors = require("cors");
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
  const readings = await getTodaysReadings();
  res.json(readings);
});

app.get("/bible", async (req, res) => {
  var { book, chapter, verses, language } = req.body;
  verses = JSON.parse(verses);
  const bible = language == "english" ? englishBible : latinBible;
  const result = bible.books
    .find((b) => b.name == book)
    .chapters[chapter - 1].verses.filter(
      (v) => v.verse <= verses.end && v.verse >= verses.start
    );
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
