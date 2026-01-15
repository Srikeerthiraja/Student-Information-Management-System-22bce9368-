const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminSchema.js');


const adminRegister = async (req, res) => {
  try {
    const { name, email, password, schoolName } = req.body;

   
    if (!name || !email || !password || !schoolName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    
    const safeEmail = email.toLowerCase().trim();
    const safeSchoolName = schoolName.trim();
    const safeName = name.trim();

    const existingAdminByEmail = await Admin.findOne({ email: safeEmail });
    if (existingAdminByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check existing school
    const existingSchool = await Admin.findOne({ schoolName: safeSchoolName });
    if (existingSchool) {
      return res.status(400).json({ message: "School name already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const admin = new Admin({
      name: safeName,
      email: safeEmail,
      password: hashedPassword,
      schoolName: safeSchoolName,
      role: "Admin",
    });

    const result = await admin.save();


    const token = jwt.sign(
      {
        _id: result._id,
        role: result.role,
        email: result.email,
        schoolName: result.schoolName,
      },
      process.env.JWT_SECRET || "fallback_secret_key_for_development",
      { expiresIn: "7d" }
    );

    const adminResponse = result.toObject();
    delete adminResponse.password;

    return res.status(201).json({
      ...adminResponse,
      token,
      role: "Admin",
      schoolName: safeSchoolName,
    });

  } catch (err) {
    console.error("Admin registration error:", err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value entered" });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    return res.status(500).json({
      message: "Server error during registration",
      error: err.message,
    });
  }
};

const adminLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Sanitize email
    const safeEmail = email.toLowerCase().trim();

    // Find admin by email
    const admin = await Admin.findOne({ email: safeEmail });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const validated = await bcrypt.compare(password, admin.password);
    if (!validated) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: admin._id,
        role: admin.role,
        email: admin.email,
        schoolName: admin.schoolName,
      },
      process.env.JWT_SECRET || "fallback_secret_key_for_development",
      { expiresIn: "7d" }
    );

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return res.status(200).json({
      ...adminResponse,
      token,
      role: "Admin",
    });

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({
      message: "Server error during login",
      error: err.message,
    });
  }
};

// GET ADMIN DETAIL
const getAdminDetail = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) {
      return res.status(404).json({ message: "No admin found" });
    }

    return res.status(200).json(admin);

  } catch (err) {
    console.error("Get admin detail error:", err);

    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };
