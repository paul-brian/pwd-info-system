const db = require("../../config/db");

// ---------------- SUMMARY STATS ----------------
exports.getStats = (req, res) => {
  const stats = {};

  // Total PWDs
  db.query("SELECT COUNT(*) AS total FROM pwd_profiles WHERE status = 'active'", (err, r1) => {
    if (err) return res.status(500).json(err);
    stats.totalPWDs = r1[0].total;

    // Recent Releases this month
    db.query(`
      SELECT COUNT(*) AS total FROM assistance_distribution
      WHERE MONTH(release_date) = MONTH(CURDATE())
      AND YEAR(release_date) = YEAR(CURDATE())
    `, (err, r2) => {
      if (err) return res.status(500).json(err);
      stats.recentReleases = r2[0].total;

      // Active Events
      db.query(`
        SELECT COUNT(*) AS total FROM events
        WHERE status IN ('Ongoing', 'Upcoming', 'Scheduled')
      `, (err, r3) => {
        if (err) return res.status(500).json(err);
        stats.activeEvents = r3[0].total;

        // Weekly Donations
        db.query(`
          SELECT COUNT(*) AS total FROM donations
          WHERE donations_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        `, (err, r4) => {
          if (err) return res.status(500).json(err);
          stats.weeklyDonations = r4[0].total;

          res.json(stats);
        });
      });
    });
  });
};

// ---------------- MONTHLY REGISTRATION CHART ----------------
exports.getMonthlyRegistrations = (req, res) => {
  const sql = `
    SELECT 
      MONTHNAME(created_at) AS month,
      MONTH(created_at) AS month_num,
      COUNT(*) AS value
    FROM pwd_profiles
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at), MONTHNAME(created_at)
    ORDER BY MONTH(created_at) ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ---------------- RECENT PWDs ----------------
exports.getRecentPWDs = (req, res) => {
  const sql = `
    SELECT
      p.pwd_number,
      u.full_name,
      p.disability_type,
      p.contact_number,
      p.status,
      p.created_at
    FROM pwd_profiles p
    JOIN user u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
    LIMIT 3
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// ---------------- RECENT LOGS ----------------
exports.getRecentLogs = (req, res) => {
  const logs = [];

  // Latest donation
  db.query(`
    SELECT donor_name, quantity, category, donations_date
    FROM donations
    ORDER BY donations_date DESC
    LIMIT 3
  `, (err, donations) => {
    if (err) return res.status(500).json(err);

    donations.forEach((d) => {
      logs.push({
        icon: "volunteer_activism",
        color: "emerald",
        title: "New Donation Received",
        description: `${d.quantity} ${d.category} donated by ${d.donor_name}.`,
        time: d.donations_date,
      });
    });

    // Latest assistance distribution
    db.query(`
      SELECT ad.quantity, ad.release_date, i.item_name, u.full_name
      FROM assistance_distribution ad
      JOIN inventory_items i ON ad.item_id = i.inventory_id
      JOIN pwd_profiles p ON ad.beneficiary_id = p.pwd_id
      JOIN user u ON p.user_id = u.user_id
      ORDER BY ad.release_date DESC
      LIMIT 3
    `, (err2, distributions) => {
      if (err2) return res.status(500).json(err2);

      distributions.forEach((d) => {
        logs.push({
          icon: "inventory",
          color: "blue",
          title: "Assistance Released",
          description: `${d.quantity} ${d.item_name} released to ${d.full_name}.`,
          time: d.release_date,
        });
      });

      // Latest PWD registrations
      db.query(`
        SELECT u.full_name, p.created_at
        FROM pwd_profiles p
        JOIN user u ON p.user_id = u.user_id
        ORDER BY p.created_at DESC
        LIMIT 3
      `, (err3, pwds) => {
        if (err3) return res.status(500).json(err3);

        pwds.forEach((p) => {
          logs.push({
            icon: "person_add",
            color: "orange",
            title: "New PWD Registered",
            description: `${p.full_name} has been registered in the system.`,
            time: p.created_at,
          });
        });

        // Sort by time descending
        logs.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json(logs.slice(0, 6));
      });
    });
  });
};