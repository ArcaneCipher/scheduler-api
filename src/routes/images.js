const express = require("express");
const path = require("path");

const router = express.Router();

/**
 * Resolves the absolute path to the directory containing image files.
 */
const imagesPath = path.resolve(__dirname, "../db/images");

/**
 * Middleware to serve static images from the database directory.
 */
router.use("/", express.static(imagesPath));

module.exports = router;
