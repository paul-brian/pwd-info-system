const db = require("../../config/db");

const Announcement = {
  getAll: (callback) => {
    const sql = `
      SELECT a.*, u.full_name AS posted_by_name
      FROM announcements a
      JOIN user u ON a.posted_by = u.user_id
      ORDER BY a.created_at DESC
    `;
    db.query(sql, callback);
  },
};

module.exports = Announcement;