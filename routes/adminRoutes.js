
const express   = require("express");
const router    = express.Router();
const path      = require("path");
const fs        = require("fs");
const TripModel = require("../model/TripModel");
const { protect } = require("../middlewares/auth");
const upload    = require("../middlewares/upload");

// Prevent admin pages from being cached by the browser
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

router.use(protect);

const TRIPS_PER_PAGE = 8;


router.get("/dashboard", async (req, res) => {
  try {
    const [totalTrips, activeTrips, inactiveTrips, recentTrips] =
      await Promise.all([
        TripModel.countDocuments(),
        TripModel.countDocuments({ status: "active" }),
        TripModel.countDocuments({ status: "inactive" }),
        TripModel.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.render("admin/dashboard", {
      title: "Dashboard",
      totalTrips,
      activeTrips,
      inactiveTrips,
      recentTrips,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    req.flash("error", "Could not load dashboard.");
    res.redirect("/admin/dashboard");
  }
});



router.get("/trips", async (req, res) => {
  try {
    const page         = parseInt(req.query.page) || 1;
    const search       = req.query.search || "";
    const statusFilter = req.query.status || "";

    const query = {};
    if (search)       query.destination = { $regex: search, $options: "i" };
    if (statusFilter) query.status      = statusFilter;

    const total = await TripModel.countDocuments(query);
    const trips = await TripModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * TRIPS_PER_PAGE)
      .limit(TRIPS_PER_PAGE);

    res.render("admin/trips", {
      title: "All Trips",
      trips,
      currentPage: page,
      totalPages: Math.ceil(total / TRIPS_PER_PAGE),
      totalTrips: total,
      search,
      statusFilter,
    });
  } catch (err) {
    console.error("Trips list error:", err);
    req.flash("error", "Could not load trips.");
    res.redirect("/admin/dashboard");
  }
});



router.get("/addTrip", (req, res) => {
  res.render("admin/addTrip", { title: "Add New Trip" });
});

router.post("/addTrip", upload.single("image"), async (req, res) => {
  try {
    const { title, destination, price, duration, description, status } = req.body;

    if (!title || !destination || !price || !duration || !description) {
      req.flash("error", "All required fields must be filled.");
      return res.redirect("/admin/addTrip");
    }
    if (isNaN(price) || Number(price) < 0) {
      req.flash("error", "Price must be a positive number.");
      return res.redirect("/admin/addTrip");
    }

    const tripData = {
      title, destination,
      price: Number(price),
      duration, description,
      status: status || "active",
      image: req.file ? req.file.filename : null,
    };

    await TripModel.create(tripData);
    req.flash("success", "Trip created successfully!");
    res.redirect("/admin/trips");
  } catch (err) {
    console.error("Add trip error:", err);
    req.flash("error", "Could not create trip. Please try again.");
    res.redirect("/admin/addTrip");
  }
});



router.get("/editTrip/:id", async (req, res) => {
  try {
    const trip = await TripModel.findById(req.params.id);
    if (!trip) {
      req.flash("error", "Trip not found.");
      return res.redirect("/admin/trips");
    }
    res.render("admin/editTrip", { title: `Edit: ${trip.title}`, trip });
  } catch (err) {
    req.flash("error", "Trip not found.");
    res.redirect("/admin/trips");
  }
});


router.put("/editTrip/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, destination, price, duration, description, status } = req.body;
    const trip = await TripModel.findById(req.params.id);

    if (!trip) {
      req.flash("error", "Trip not found.");
      return res.redirect("/admin/trips");
    }
    if (!title || !destination || !price || !duration || !description) {
      req.flash("error", "All required fields must be filled.");
      return res.redirect(`/admin/editTrip/${req.params.id}`);
    }

    const updateData = {
      title, destination,
      price: Number(price),
      duration, description,
      status: status || "active",
    };

    if (req.file) {
      if (trip.image) {
        const oldPath = path.join(__dirname, "../public/uploads", trip.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = req.file.filename;
    }

    await TripModel.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    req.flash("success", "Trip updated successfully!");
    res.redirect("/admin/trips");
  } catch (err) {
    console.error("Edit trip error:", err);
    req.flash("error", "Could not update trip.");
    res.redirect(`/admin/editTrip/${req.params.id}`);
  }
});



router.delete("/deleteTrip/:id", async (req, res) => {
  try {
    const trip = await TripModel.findByIdAndDelete(req.params.id);
    if (trip && trip.image) {
      const imgPath = path.join(__dirname, "../public/uploads", trip.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    req.flash("success", "Trip deleted successfully!");
    res.redirect("/admin/trips");
  } catch (err) {
    console.error("Delete trip error:", err);
    req.flash("error", "Could not delete trip.");
    res.redirect("/admin/trips");
  }
});



router.get("/viewTrip/:id", async (req, res) => {
  try {
    const trip = await TripModel.findById(req.params.id);
    if (!trip) {
      req.flash("error", "Trip not found.");
      return res.redirect("/admin/trips");
    }
    res.render("admin/viewTrip", { title: trip.title, trip });
  } catch (err) {
    req.flash("error", "Trip not found.");
    res.redirect("/admin/trips");
  }
});

module.exports = router;
