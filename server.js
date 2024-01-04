const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB using the connection string from the environment variables
mongoose.connect(
  "mongodb+srv://xenon:xenon@cluster0.x9fpvih.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Middleware
app.use(express.json());

// MongoDB schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});
const ContactModel = mongoose.model("Contact", contactSchema);

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

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
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or Password" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
