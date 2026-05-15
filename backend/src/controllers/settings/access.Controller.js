const db = require("../../config/db");
const bcrypt = require("bcrypt");
const log = require("../../helper/recentLog/RecentLogHelper");
const { sendApprovedEmail, sendRejectedEmail } = require("../../services/emailServes");

// ---------------------------
// Submit Request Access
// ---------------------------
exports.submitRequest = (req, res) => {
  const { full_name, email, role, reason } = req.body;

  if (!full_name || !email || !role || !reason)
    return res.status(400).json({ error: "All fields are required" });

  const sql = `INSERT INTO request_access 
    (full_name, email, role, reason, status, created_at)
    VALUES (?, ?, ?, ?, 'pending', NOW())`;

  db.query(sql, [full_name, email, role, reason], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      if (err.code === "ER_DUP_ENTRY")
        return res.status(409).json({ error: "This email already submitted a request." });
      return res.status(500).json({ error: "Server error. Please try again later." });
    }
    res.json({ message: "Request submitted", requestId: result.insertId });
  });
};

// ---------------------------
// List All Requests (Admin)
// ---------------------------
exports.listRequests = (req, res) => {
  const sql = `
    SELECT * FROM request_access 
    ORDER BY 
      CASE 
        WHEN status='pending'  THEN 1
        WHEN status='approved' THEN 2
        WHEN status='rejected' THEN 3
      END, 
      created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ Error: "Server error" });
    res.json(results);
  });
};

// ---------------------------
// Approve Request (Admin)
// ---------------------------
exports.approveRequest = async (req, res) => {
  const { requestId } = req.params;

  db.query(
    "SELECT * FROM request_access WHERE request_id = ?",
    [requestId],
    async (err, results) => {
      if (err)              return res.status(500).json({ Error: "Server error" });
      if (!results.length)  return res.status(404).json({ Error: "Request not found" });

      const request = results[0];

      // ✅ Check if already approved
      if (request.status === "approved")
        return res.status(400).json({ Error: "Request already approved" });

      // Create user account (temporary password: 123456)
      const password = await bcrypt.hash("123456", 10);

      db.query(
        "INSERT INTO user (full_name, email, password, role, status, created_at) VALUES (?, ?, ?, ?, 'active', NOW())",
        [request.full_name, request.email, password, request.role],
        (err2) => {
          if (err2) {
            if (err2.code === "ER_DUP_ENTRY")
              return res.status(409).json({ Error: "User with this email already exists" });
            return res.status(500).json({ Error: "Error creating user" });
          }

          // Update request status to approved
          db.query(
            "UPDATE request_access SET status='approved' WHERE request_id=?",
            [requestId],
            async (err3) => {
              if (err3) return res.status(500).json({ Error: "Error updating request status" });

              log(
                req.user?.id,
                `Approved access request for ${request.full_name}`,
                "User Login/Logout",
                `Role: ${request.role}`
              );

              // ✅ Send approval email (non-blocking)
              await sendApprovedEmail({
                full_name: request.full_name,
                email:     request.email,
                role:      request.role,
              });

              res.json({ Status: "Request approved and user created" });
            }
          );
        }
      );
    }
  );
};

// ---------------------------
// Reject Request (Admin)
// ---------------------------
exports.rejectRequest = (req, res) => {
  const { requestId } = req.params;

  // ✅ Get request data first para makuha ang email
  db.query(
    "SELECT * FROM request_access WHERE request_id = ?",
    [requestId],
    async (err, results) => {
      if (err)             return res.status(500).json({ Error: "Server error" });
      if (!results.length) return res.status(404).json({ Error: "Request not found" });

      const request = results[0];

      // ✅ Check if already rejected
      if (request.status === "rejected")
        return res.status(400).json({ Error: "Request already rejected" });

      db.query(
        "UPDATE request_access SET status='rejected' WHERE request_id=?",
        [requestId],
        async (err2) => {
          if (err2) return res.status(500).json({ Error: "Error rejecting request" });

          log(
            req.user?.id,
            `Rejected access request for ${request.full_name}`,
            "User Login/Logout",
            `Request ID: ${requestId}`
          );

          // ✅ Send rejection email (non-blocking)
          await sendRejectedEmail({
            full_name: request.full_name,
            email:     request.email,
            role:      request.role,
          });

          res.json({ Status: "Request rejected" });
        }
      );
    }
  );
};