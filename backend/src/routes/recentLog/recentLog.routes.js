const express = require("express");
const router = express.Router();
const controller = require("../../controllers/recentLog/recentLog.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

// Admin/Staff only
router.get("/", verifyToken, controller.getAll);

module.exports = router;