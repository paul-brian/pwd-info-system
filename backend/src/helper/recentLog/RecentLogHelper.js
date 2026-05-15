const LogModel = require("../../models/recentLog/recentlogmodel");

/**
 * Reusable log helper — call this anywhere in your controllers
 *
 * @param {number|null} user_id  - ID of the user who performed the action
 * @param {string}      action   - Short description e.g. "Created PWD profile"
 * @param {string}      module   - One of the ENUM values in activity_logs
 * @param {string}      description - Optional longer description
 *
 * Usage:
 *   const log = require("../../helpers/logHelper");
 *   log(req.user?.id, "Sent SMS to PWD-001", "SMS Notification", message);
 */
const log = (user_id, action, module, description = null) => {
  LogModel.insert({ user_id, action, module, description }, (err) => {
    if (err) console.error("Failed to save log:", err);
  });
};

module.exports = log;