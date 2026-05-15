const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Announcement/Announcement.controller");


router.get("/", controller.getAll);

module.exports = router;