const express    = require("express");
const router     = express.Router();
const controller = require("../../controllers/landing/landingstats.Controller");

// ✅ Public route — no verifyToken, aggregate counts only
router.get("/", controller.getPublicStats);

module.exports = router;