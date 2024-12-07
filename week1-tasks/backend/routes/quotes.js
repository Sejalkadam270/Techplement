const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");

// Add a quote
router.post("/add", async (req, res) => {
  const { text, author } = req.body;
  try {
    const newQuote = new Quote({ text, author });
    await newQuote.save();
    res.status(201).json({ message: "Quote added successfully", quote: newQuote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a random quote
router.get("/random", async (req, res) => {
  try {
    const quotes = await Quote.find();
    if (quotes.length === 0) return res.status(404).json({ message: "No quotes found" });
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(200).json(randomQuote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async (req, res) => {
    const { author } = req.query;
  
    if (!author) {
      return res.status(400).json({ message: "Author name is required" });
    }
  
    try {
      const quotes = await Quote.find({ author: new RegExp(author, "i") }); // Case-insensitive search
      if (quotes.length === 0) {
        return res.status(404).json({ message: "No quotes found for this author" });
      }
      res.status(200).json(quotes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
