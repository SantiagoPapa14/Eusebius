const express = require("express");
const { getTodaysReadings } = require("./scripts/readingScraper");
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
