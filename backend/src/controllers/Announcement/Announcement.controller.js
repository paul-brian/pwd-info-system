const Announcement = require("../../models/Announcement/AnnouncementModel");

exports.getAll = (req, res) => {
  Announcement.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};