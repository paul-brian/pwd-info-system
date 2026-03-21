const express = require("express");
const router = express.Router();
const controller = require("../../controllers/event/event.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.get("/upcoming", verifyToken, controller.getUpcomingEvents)
router.get("/", controller.getEvents);
router.post("/", controller.createEvent);
router.put("/:id", controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;