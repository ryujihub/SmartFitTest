const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // For generating unique UID
const dotenv = require("dotenv");
const User = require("./models/User"); // Import your user model
const Admin = require("./models/Admin"); // Import Admin model
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Make sure this matches your frontend URL
}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/SmartFit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Middleware to create a default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const admin = await Admin.findOne({ username: "admin" });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const newAdmin = new Admin({
        username: "admin",
        password: hashedPassword,
      });
      await newAdmin.save();
      console.log("Default admin created.");
    }
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};

// Call the createDefaultAdmin function when the server starts
createDefaultAdmin();

// Signup route (creates a new user)
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword, uid: uuidv4() });
    await user.save();
    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route (validates the user's credentials and generates a JWT token)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, uid: user.uid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login route (validates admin credentials)
app.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  // Ensure the credentials match the default admin
  if (username === "admin" && password === "admin") {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ message: "Admin login successful", token });
  }

  res.status(401).json({ error: "Invalid admin credentials" });
});

// Middleware to protect routes requiring authentication
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Authorization required" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Example of a protected route
app.get("/api/protected", authenticateJWT, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
