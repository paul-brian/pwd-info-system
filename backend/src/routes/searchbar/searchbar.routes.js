const express = require("express");
const router  = express.Router();
const { globalSearch } = require("../../controllers/searchbar/searchbar.controller");
const { verifyToken }  = require("../../middlewares/auth.middleware");

// GET /api/search?q=wheelchair
router.get("/", verifyToken, globalSearch);

module.exports = router;