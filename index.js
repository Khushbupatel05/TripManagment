
const dotenv = require("dotenv");
const path   = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const express        = require("express");
const cookieParser   = require("cookie-parser");
const session        = require("express-session");
const flash          = require("connect-flash");
const methodOverride = require("method-override");

const connectDB      = require("./config/db");
const authRoutes     = require("./routes/authRoutes");
const adminRoutes    = require("./routes/adminRoutes");
const clientRoutes   = require("./routes/clientRoutes");

const requiredEnvs = ["MONGO_URI", "SESSION_SECRET", "JWT_SECRET"];
requiredEnvs.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

connectDB();

const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Method Override (PUT / DELETE via forms) ──
app.use(methodOverride("_method"));

app.use(cookieParser());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
}));
app.use(flash());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error   = req.flash("error");
  next();
});

app.use("/",      clientRoutes);   
app.use("/auth",  authRoutes);     
app.use("/admin", adminRoutes);    


app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
  console.log(` Admin panel  → http://localhost:${PORT}/admin/dashboard`);
  console.log(` Login        → http://localhost:${PORT}/auth/login`);
});
