const db = require("../../config/db");

// ✅ GET /api/stats — public, no auth, no personal data
exports.getPublicStats = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM pwd_profiles)                             AS total_pwd,
      (SELECT COUNT(*) FROM pwd_profiles WHERE status = 'active')    AS active_pwd,
      (SELECT COUNT(*) FROM events)                                   AS total_events,
      (SELECT COUNT(*) FROM request_access WHERE status = 'pending') AS pending_requests
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Stats error:", err);
      return res.json({ total_pwd: 0, active_pwd: 0, total_events: 0, pending_requests: 0 });
    }
    res.json(results[0]);
  });
};