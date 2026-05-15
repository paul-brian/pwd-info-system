const db = require("../config/db");
const log = require("..//helper/recentLog/RecentLogHelper")
const bcrypt = require("bcrypt");

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT user_id, full_name, email, role, image
    FROM user
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result || result.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json(result[0]);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { full_name, email } = req.body;

  if (!full_name || !email)
    return res.status(400).json({ error: "full_name and email are required" });

  const sql = `
    UPDATE user
    SET full_name = ?, email = ?
    WHERE user_id = ?
  `;

  db.query(sql, [full_name, email, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(userId, `Updated own profile`, "User Login/Logout", `Name: ${full_name}`);
    res.json({ message: "Profile updated" });
  });
};


exports.changePassword = (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return res.status(400).json({ error: "Both passwords are required" });

  const sql = `SELECT password FROM user WHERE user_id = ?`;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result || result.length === 0)
      return res.status(404).json({ error: "User not found" });

    const hashedPassword = result[0].password;

    bcrypt
      .compare(oldPassword, hashedPassword)
      .then((match) => {
        if (!match)
          return res.status(400).json({ error: "Old password incorrect" });

        return bcrypt.hash(newPassword, 10);
      })
      .then((hash) => {
        if (!hash) return; 

        db.query(
          `UPDATE user SET password = ? WHERE user_id = ?`,
          [hash, userId],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            log(userId, `Changed password`, "User Login/Logout", `User ID: ${userId}`);
            res.json({ message: "Password updated" });
          }
        );
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
};

exports.uploadProfileImage = (req, res) => {
  const userId = req.user.id;


  if (!req.file)
    return res.status(400).json({ error: "No image file uploaded" });

  const image = req.file.filename;

  const sql = `UPDATE user SET image = ? WHERE user_id = ?`;

  db.query(sql, [image, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    log(userId, `Updated profile image`, "User Login/Logout", `User ID: ${userId}`);
    res.json({ message: "Image updated", image });
  });
};