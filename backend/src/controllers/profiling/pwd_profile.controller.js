const db = require("../../config/db");
const bcrypt = require("bcrypt");
const PWD = require("../../models/profiling/pwd_profile.models");
const log = require("../../helper/recentLog/RecentLogHelper")

// ---------------- CREATE PWD PROFILE + USER LOGIN ----------------
exports.createProfile = async (req, res) => {
  const {
    full_name,
    pwd_number,
    password,
    disability_type,
    medical_condition,
    birth_date,
    gender,
    address,
    contact_number,
    emergency_contact,
    status,
  } = req.body;

  const created_at = new Date();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // START TRANSACTION
    db.beginTransaction((err) => {
      if (err) return res.status(500).json(err);

      // Insert into user table
      const userSql = `
        INSERT INTO user
        (full_name, password, role, status, created_at)
        VALUES (?, ?, 'user', 'active', ?)
      `;
      db.query(userSql, [full_name, hashedPassword, created_at], (err, userResult) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        const userId = userResult.insertId;

        // Insert into pwd_profiles
        const pwdSql = `
          INSERT INTO pwd_profiles
          (user_id, pwd_number, disability_type, medical_condition, birth_date, gender, address, contact_number, emergency_contact, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(pwdSql, [
          userId,
          pwd_number,
          disability_type,
          medical_condition,
          birth_date,
          gender,
          address,
          contact_number,
          emergency_contact,
          status,
          created_at
        ], (err, result) => {
          if (err) return db.rollback(() => res.status(500).json(err));

          // COMMIT TRANSACTION
          db.commit((err) => {
            if (err) return db.rollback(() => res.status(500).json(err));

          log(req.user?.id, `Registered new PWD: ${full_name}`, "PWD Registration", `PWD Number: ${pwd_number}`);

            res.json({ message: "PWD Profile + Login Account Created Successfully!" });
          });
        });

      });

    });

  } catch (err) {
    res.status(500).json(err);
  }
};

// ---------------- GET ALL PROFILES ----------------
exports.getProfiles = (req, res) => {
  PWD.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ---------------- UPDATE PROFILE ----------------
exports.updateProfile = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  PWD.update(id, data, (err, result) => {
    if (err) return res.status(500).json(err);

        if (data.password) {
      bcrypt.hash(data.password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json(err);

        const getUserSql = "SELECT user_id FROM pwd_profiles WHERE pwd_id=?";
        db.query(getUserSql, [id], (err2, rows) => {
          if (err2) return res.status(500).json(err2);
          if (!rows.length) return res.json({ message: "Profile updated!" });

          const userId = rows[0].user_id;
          db.query("UPDATE user SET password=? WHERE user_id=?", [hashedPassword, userId], (err3) => {
            if (err3) return res.status(500).json(err3);
            log(req.user?.id, `Updated PWD profile & password`, "PWD Registration", `PWD ID: ${id}`);
            return res.json({ message: "Profile and password updated!" });
          });
        });
      });
      return; 
    }
    
    // If profile status was changed, propagate to user table
    if (data && data.status) {
      const getUserSql = "SELECT user_id FROM pwd_profiles WHERE pwd_id=?";
      db.query(getUserSql, [id], (err2, rows) => {
        if (err2) return res.status(500).json(err2);
        if (rows && rows.length) {
          const userId = rows[0].user_id;
          const updateUserSql = "UPDATE user SET status=? WHERE user_id=?";
          db.query(updateUserSql, [data.status, userId], (err3) => {
            if (err3) return res.status(500).json(err3);
            log(req.user?.id, `Updated PWD profile status to ${data.status}`, "PWD Registration", `PWD ID: ${id}`);
            return res.json({ message: "Profile updated!" });
          });
        } else {
          return res.json({ message: "Profile updated!" });
        }
      });
    } else {
      log(req.user?.id, `Updated PWD profile`, "PWD Registration", `PWD ID: ${id}`);
      res.json({ message: "Profile updated!" });
    }
  });
};



// ---------------- DELETE PROFILE (soft delete) ----------------
exports.deleteProfile = (req, res) => {
  const { id } = req.params;

  // get associated user_id first
  const getUserSql = "SELECT user_id FROM pwd_profiles WHERE pwd_id=?";
  db.query(getUserSql, [id], (err, rows) => {
    if (err) return res.status(500).json(err);

    const userId = rows && rows.length ? rows[0].user_id : null;

    // soft-delete profile (model's delete now sets status='inactive')
    PWD.delete(id, (err2, result) => {
      if (err2) return res.status(500).json(err2);

      if (userId) {
        const updateUserSql = "UPDATE user SET status='inactive' WHERE user_id=?";
        db.query(updateUserSql, [userId], (err3) => {
          if (err3) return res.status(500).json(err3);
          log(req.user?.id, `Deactivated PWD profile`, "PWD Registration", `PWD ID: ${id}`);
          res.json({ message: "Profile soft-deleted and user deactivated!" });
        });
      } else {
        res.json({ message: "Profile soft-deleted!" });
      }
    });
  });
};

// ---------------- GET OWN PWD PROFILE (logged-in user) ----------------
exports.getMyProfile = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT p.*, u.full_name, u.email, u.image, u.role
    FROM pwd_profiles p
    JOIN user u ON p.user_id = u.user_id
    WHERE p.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: "PWD profile not found" });
    res.json(results[0]);
  });
};

// ---------------- UPDATE OWN PWD PROFILE (logged-in user) ----------------
exports.updateMyProfile = (req, res) => {
  const userId = req.user.id;

  const {
    contact_number,
    disability_type,
    medical_condition,
    address,
    emergency_contact,
  } = req.body;

  const sql = `
    UPDATE pwd_profiles
    SET contact_number = ?,
        disability_type = ?,
        medical_condition = ?,
        address = ?,
        emergency_contact = ?
    WHERE user_id = ?
  `;

  db.query(
    sql,
    [contact_number, disability_type, medical_condition, address, emergency_contact, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "PWD profile not found" });
        log(userId, `PWD updated own profile`, "PWD Registration", `User ID: ${userId}`);
      res.json({ message: "PWD profile updated successfully" });
    }
  );
};


