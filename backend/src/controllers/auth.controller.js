// const db = require("../config/db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");


// exports.loginUser = (req, res) => {
//   const { email, password } = req.body;

//   const sql = `
//     SELECT * FROM user
//     WHERE email = ?
//       AND status = 'active'
//   `;

//   db.query(sql, [email], (err, data) => {
//     if (err)
//       return res.status(500).json({ Error: "Server error" });

//     if (data.length === 0)
//       return res.status(404).json({ Error: "Account not found or inactive" });

//     const user = data[0];

//     bcrypt.compare(password, user.password, (err, match) => {
//       if (!match)
//         return res.status(401).json({ Error: "Wrong password" });

//       const token = jwt.sign(
//         {
//           id: user.user_id,
//           role: user.role
//         },
//         process.env.JWT_SECRET || "SECRET_KEY",
//         { expiresIn: "1d" }
//       );

//       res.json({
//         Status: "Success",
//         token,
//         role: user.role
//       });
//     });
//   });
// };

// exports.loginPWD = (req, res) => {
//   const { pwd_number, password } = req.body;

//   const sql = `
//     SELECT * FROM pwd_profiles
//     WHERE pwd_number = ?
//       AND status = 'active'
//   `;

//   db.query(sql, [pwd_number], (err, data) => {
//     if (err)
//       return res.status(500).json({ Error: "Server error" });

//     if (data.length === 0)
//       return res.status(404).json({ Error: "PWD not found or inactive" });

//     const pwd = data[0];

//     bcrypt.compare(password, pwd.password, (err, match) => {
//       if (!match)
//         return res.status(401).json({ Error: "Wrong password" });

//       const token = jwt.sign(
//         {
//           id: pwd.pwd_id,
//           role: "pwd"
//         },
//         process.env.JWT_SECRET || "SECRET_KEY",
//         { expiresIn: "1d" }
//       );

//       res.json({
//         Status: "Success",
//         token,
//         role: "pwd"
//       });
//     });
//   });
// };

// const db = require("../config/db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // Helper function: generate JWT
// const generateToken = (id, role) => {
//   return jwt.sign(
//     { id, role },
//     process.env.JWT_SECRET || "SECRET_KEY",
//     { expiresIn: "1d" }
//   );
// };

// // =====================
// // LOGIN: Admin / Staff
// // =====================
// exports.loginUser = (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ Error: "Email and password are required" });
//   }

//   const sql = `SELECT * FROM user WHERE email = ? AND status = 'active'`;

//   db.query(sql, [email], (err, results) => {
//     if (err) return res.status(500).json({ Error: "Server error" });
//     if (results.length === 0)
//       return res.status(404).json({ Error: "Account not found or inactive" });

//     const user = results[0];

//     // TEMPORARY: plain password mode for testing
//     // Comment this block if you are using hashed password
//     if (password === user.password) {
//       const token = generateToken(user.user_id, user.role);
//       return res.json({ Status: "Success", token, role: user.role });
//     }

//     // Normal bcrypt compare
//     bcrypt.compare(password, user.password, (err, match) => {
//       if (err) return res.status(500).json({ Error: "Server error" });
//       if (!match) return res.status(401).json({ Error: "Wrong password" });

//       const token = generateToken(user.user_id, user.role);
//       res.json({ Status: "Success", 
//                  token, 
//                  role: user.role,
//                  full_name: user.full_name,
//                 image: user.image || "",
//                 });
//     });
//   });
// };

// // =====================
// // LOGIN: PWD
// // =====================
// exports.loginPWD = (req, res) => {
//   const { pwd_number, password } = req.body;

//   if (!pwd_number || !password) {
//     return res.status(400).json({ Error: "PWD number and password are required" });
//   }

//   const sqlPWD = `SELECT * FROM pwd_profiles WHERE pwd_number = ? AND status = 'active'`;

//   db.query(sqlPWD, [pwd_number], (err, results) => {
//     if (err) return res.status(500).json({ Error: "Server error" });
//     if (results.length === 0)
//       return res.status(404).json({ Error: "PWD not found or inactive" });

//     const pwd = results[0];

//     // Kunin ang user info (password + role)
//     const sqlUser = `SELECT * FROM user WHERE user_id = ? AND status = 'active'`;
//     db.query(sqlUser, [pwd.user_id], (err, userResults) => {
//       if (err) return res.status(500).json({ Error: "Server error" });
//       if (userResults.length === 0)
//         return res.status(404).json({ Error: "User account not found or inactive" });

//       const user = userResults[0];

//       bcrypt.compare(password, user.password, (err, match) => {
//         if (err) return res.status(500).json({ Error: "Server error" });
//         if (!match) return res.status(401).json({ Error: "Wrong password" });

//         const token = generateToken(user.user_id, user.role);
//         res.json({ Status: "Success", 
//                    token, 
//                    role: user.role,
//                    full_name: user.full_name,
//                    image: user.image || "",
//                   });
//       });
//     });
//   });
// };

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const log = require("../helper/recentLog/RecentLogHelper")

// Helper function: generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "SECRET_KEY",
    { expiresIn: "1d" }
  );
};

// =====================
// LOGIN: Admin / Staff
// =====================
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Error: "Email and password are required" });
  }

  const sql = `SELECT * FROM user WHERE email = ? AND status = 'active'`;

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ Error: "Server error" });
    if (results.length === 0)
      return res.status(404).json({ Error: "Account not found or inactive" });

    const user = results[0];


    const sendResponse = () => {
      db.query(
        "UPDATE user SET last_login = NOW() WHERE user_id = ?",
        [user.user_id],
        (err) => { if (err) console.error("Failed to update last_login:", err); }
      );

      log(user.user_id, `${user.full_name} logged in`, "User Login/Logout", `Role: ${user.role}`);

      const token = generateToken(user.user_id, user.role);
      return res.json({
        Status: "Success",
        token,
        role: user.role,
        full_name: user.full_name,  
        image: user.image || "",    
      });
    };

    // TEMPORARY: plain password mode for testing
    if (password === user.password) {
      return sendResponse();
    }

    // Normal bcrypt compare
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ Error: "Server error" });
      if (!match) return res.status(401).json({ Error: "Wrong password" });
      sendResponse();
    });
  });
};

// =====================
// LOGIN: PWD
// =====================
exports.loginPWD = (req, res) => {
  const { pwd_number, password } = req.body;

  if (!pwd_number || !password) {
    return res.status(400).json({ Error: "PWD number and password are required" });
  }

  const sqlPWD = `SELECT * FROM pwd_profiles WHERE pwd_number = ? AND status = 'active'`;

  db.query(sqlPWD, [pwd_number], (err, results) => {
    if (err) return res.status(500).json({ Error: "Server error" });
    if (results.length === 0)
      return res.status(404).json({ Error: "PWD not found or inactive" });

    const pwd = results[0];

    const sqlUser = `SELECT * FROM user WHERE user_id = ? AND status = 'active'`;
    db.query(sqlUser, [pwd.user_id], (err, userResults) => {
      if (err) return res.status(500).json({ Error: "Server error" });
      if (userResults.length === 0)
        return res.status(404).json({ Error: "User account not found or inactive" });

      const user = userResults[0];

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) return res.status(500).json({ Error: "Server error" });
        if (!match) return res.status(401).json({ Error: "Wrong password" });

        db.query(
          "UPDATE user SET last_login = NOW() WHERE user_id = ?",
          [user.user_id],
          (err) => { if (err) console.error("Failed to update last_login:", err); }
        );

        log(user.user_id, `${user.full_name} logged in`, "User Login/Logout", `PWD Number: ${pwd_number}`);

        const token = generateToken(user.user_id, user.role);
        res.json({
          Status: "Success",
          token,
          role: user.role,
          full_name: user.full_name, 
          image: user.image || "",   
        });
      });
    });
  });
};