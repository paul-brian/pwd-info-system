const db = require("../../config/db");

const LogModel = {

  // Get latest 5 logs with user info
  getAll: (callback) => {
    const sql = `
      SELECT 
        l.*,
        u.full_name AS user_name,
        u.role
      FROM activity_logs l
      LEFT JOIN user u ON l.user_id = u.user_id
      ORDER BY l.created_at DESC
      LIMIT 10
    `;
    db.query(sql, callback);
  },

  // Insert a new log — auto-delete oldest if more than 5
  insert: (data, callback) => {
    const { user_id, action, module, description } = data;

    db.query(
      `INSERT INTO activity_logs (user_id, action, module, description)
       VALUES (?, ?, ?, ?)`,
      [user_id || null, action, module, description || null],
      (err, result) => {
        if (err) return callback(err);

        // ✅ Delete oldest records beyond 5
        db.query(
          `DELETE FROM activity_logs
           WHERE log_id NOT IN (
             SELECT log_id FROM (
               SELECT log_id FROM activity_logs
               ORDER BY created_at DESC
               LIMIT 10
             ) AS latest
           )`,
          (delErr) => {
            if (delErr) console.error("Failed to trim logs:", delErr);
            callback(null, result);
          }
        );
      }
    );
  },

};

module.exports = LogModel;