
const multer = require("multer");
const path   = require("path");
const crypto = require("crypto");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString("hex");
    const ext    = path.extname(file.originalname).toLowerCase();
    cb(null, `trip-${Date.now()}-${unique}${ext}`);
  },
});


const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk  = allowed.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
