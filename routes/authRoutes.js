
const express    = require("express");
const router     = express.Router();
const jwt        = require("jsonwebtoken");
const bcrypt     = require("bcryptjs");
const AdminModel = require("../model/AdminModel");
const { redirectIfLoggedIn } = require("../middlewares/auth");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Set it in your .env file.");
}


const sendTokenCookie = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("auth/login", { title: "Admin Login" });
});


router.post("/login", redirectIfLoggedIn, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Email and password are required.");
      return res.redirect("/auth/login");
    }

    const admin = await AdminModel.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/auth/login");
    }

    sendTokenCookie(res, admin._id);
    req.flash("success", `Welcome back, ${admin.name}!`);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/auth/login");
  }
});

router.get("/register", redirectIfLoggedIn, (req, res) => {
  res.render("auth/register", { title: "Admin Register" });
});

router.post("/register", redirectIfLoggedIn, async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      req.flash("error", "All fields are required.");
      return res.redirect("/auth/register");
    }
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/auth/register");
    }
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect("/auth/register");
    }

    const existing = await AdminModel.findOne({ email });
    if (existing) {
      req.flash("error", "An admin with that email already exists.");
      return res.redirect("/auth/register");
    }

    const admin = await AdminModel.create({ name, email, password });
    sendTokenCookie(res, admin._id);
    req.flash("success", `Account created! Welcome, ${admin.name}.`);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Register error:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/auth/register");
  }
});


router.get("/logout", (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  req.flash("success", "You have been logged out.");
  res.redirect("/");
});

module.exports = router;
