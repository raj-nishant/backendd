const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Connect to MongoDB (replace 'yourMongoDBURI' with your actual MongoDB URI)
mongoose.connect(
  "mongodb+srv://rajnishanta1:qQOtZardseMZepgs@cluster0.q5xg5dg.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Middleware
app.use(bodyParser.json());

// MongoDB schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});
const ContactModel = mongoose.model("Contact", contactSchema);

// Route for handling contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new contact document
    const newContact = new ContactModel({ name, email, message });

    // Save the document to MongoDB
    await newContact.save();

    res
      .status(200)
      .json({ success: true, message: "Contact form submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
