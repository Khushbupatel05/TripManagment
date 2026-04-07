
const jwt        = require("jsonwebtoken");
const AdminModel = require("../model/AdminModel");


const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      req.flash("error", "Please log in to access this page.");
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await AdminModel.findById(decoded.id);
    if (!admin) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      req.flash("error", "Admin account not found.");
      return res.redirect("/auth/login");
    }

    req.admin        = admin;
    res.locals.admin = admin;
    next();
  } catch (err) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    req.flash("error", "Session expired. Please log in again.");
    res.redirect("/auth/login");
  }
};

/**
 * redirectIfLoggedIn — sends already-authenticated admins
 * straight to the dashboard (skips login/signup pages).
 */
const redirectIfLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect("/admin/dashboard");
    } catch (_) {
      // invalid token — fall through to login
    }
  }
  next();
};

module.exports = { protect, redirectIfLoggedIn };
