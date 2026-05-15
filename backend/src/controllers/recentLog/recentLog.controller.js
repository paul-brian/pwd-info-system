const LogModel = require("../../models/recentLog/recentlogmodel");

// GET /api/logs — Admin/Staff only
exports.getAll = (req, res) => {
  LogModel.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};