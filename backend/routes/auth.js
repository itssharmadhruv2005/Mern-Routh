const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { protect } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route   POST /api/auth/register
// @desc    Create a new (unverified) user and email an OTP
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    let user = existing;
    if (!user) {
      user = new User({ name, email, password });
    } else {
      // Unverified user trying to register again - update details
      user.name = name;
      user.password = password;
    }

    const otp = await user.generateOtp();
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verify your email - OTP Code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    res.status(201).json({
      message: "Registration successful. Please check your email for the OTP to verify your account.",
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify the OTP sent to a user's email
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const isValid = await user.compareOtp(otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.json({
      message: "Email verified successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});

// @route   POST /api/auth/resend-otp
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

    const otp = await user.generateOtp();
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your new OTP code",
      text: `Your new verification code is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your new verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`,
    });

    res.json({ message: "A new OTP has been sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while resending OTP" });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id);
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged-in user (protected route)
router.get("/me", protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
      lastLogin: req.user.lastLogin,
    },
  });
});

module.exports = router;
