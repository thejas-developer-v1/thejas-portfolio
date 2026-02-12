const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serves your HTML file
app.use(cors());

// --- DATABASE CONNECTION ---
// We will fill this in next!
const dbURI = "mongodb+srv://anirudh:anirudh_password123@cluster0.fn5vpjx.mongodb.net/thejas-logs?retryWrites=true&w=majority"; 

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('DB Error:', err));

// --- DATA MODEL ---
const visitorSchema = new mongoose.Schema({
  name: String,
  message: String
});
const Visitor = mongoose.model('Visitor', visitorSchema);

// --- ROUTES ---
// 1. Save data
app.post('/add-visitor', async (req, res) => {
  try {
      const newVisitor = new Visitor({
        name: req.body.name,
        message: req.body.message
      });
      await newVisitor.save();
      console.log("Visitor saved!");
      res.redirect('/');
  } catch (err) {
      console.log(err);
      res.send("Error saving data");
  }
});

// 2. Get data
app.get('/visitors', async (req, res) => {
  const visitors = await Visitor.find();
  res.json(visitors);
});

// --- ANIRUDH GUESTBOOK LOGIC ---

// 1. Define the Shape of the Data (Schema)
const entrySchema = new mongoose.Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Entry = mongoose.model('Entry', entrySchema);

// 2. The "Receiver" (Saves the message)
app.post('/submit-guestbook', async (req, res) => {
    try {
        const newEntry = new Entry({
            name: req.body.name,
            message: req.body.message
        });
        await newEntry.save();
        res.redirect('/'); // Send them back to the homepage
    } catch (err) {
        console.log(err);
        res.send("Error saving message.");
    }
});

// 3. The "Broadcaster" (Shows the messages)
app.get('/guestbook-entries', async (req, res) => {
    try {
        const entries = await Entry.find().sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});
// -------------------------------

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
