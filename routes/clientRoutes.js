
const express   = require("express");
const router    = express.Router();
const TripModel = require("../model/TripModel");


router.get("/", (req, res) => {
  res.render("client/home", { title: "Explore Trips" });
});

module.exports = router;
