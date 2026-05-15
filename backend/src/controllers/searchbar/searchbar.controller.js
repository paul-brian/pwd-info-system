const db = require("../../config/db");

// ✅ ADMIN — all modules
const searchAdmin = (query, callback) => {
  const q = `%${query}%`;

  const sql = `
    SELECT 'PWD Profile' AS module, 'person' AS icon,
      CONCAT(u.full_name, ' — ', p.pwd_number) AS label,
      p.pwd_number AS sub,
      '/PagesProfiling' AS path
    FROM pwd_profiles p
    JOIN user u ON p.user_id = u.user_id
    WHERE u.full_name LIKE ? OR p.pwd_number LIKE ? OR p.disability_type LIKE ? OR p.address LIKE ?

    UNION ALL

    SELECT 'Health Record' AS module, 'health_and_safety' AS icon,
      CONCAT(u.full_name, ' — ', h.health_status) AS label,
      DATE_FORMAT(h.recorded_at, '%M %d, %Y') AS sub,
      '/PagesHealthRecords' AS path
    FROM health_records h
    JOIN pwd_profiles p ON h.pwd_id = p.pwd_id
    JOIN user u ON p.user_id = u.user_id
    WHERE u.full_name LIKE ? OR h.health_status LIKE ? OR h.remarks LIKE ? OR p.pwd_number LIKE ?

    UNION ALL

    SELECT 'Event' AS module, 'event_available' AS icon,
      e.event_name AS label,
      CONCAT(DATE_FORMAT(e.event_date, '%M %d, %Y'), ' — ', COALESCE(e.location, '')) AS sub,
      '/PagesEvents' AS path
    FROM events e
    WHERE e.event_name LIKE ? OR e.location LIKE ? OR e.description LIKE ?

    UNION ALL

    SELECT 'Inventory' AS module, 'inventory_2' AS icon,
      i.item_name AS label,
      CONCAT(i.category, ' — Qty: ', i.quantity) AS sub,
      '/PagesInventory' AS path
    FROM inventory_items i
    WHERE i.item_name LIKE ? OR i.category LIKE ?

    UNION ALL

    SELECT 'Donation' AS module, 'volunteer_activism' AS icon,
      CONCAT(d.donor_name, ' → ', i.item_name) AS label,
      DATE_FORMAT(d.donations_date, '%M %d, %Y') AS sub,
      '/PagesInventory' AS path
    FROM donations d
    JOIN inventory_items i ON d.Item_id = i.inventory_id
    WHERE d.donor_name LIKE ? OR i.item_name LIKE ? OR d.category LIKE ?

    UNION ALL

    SELECT 'SMS' AS module, 'sms' AS icon,
      CONCAT(s.recipient_name, ' — ', s.status) AS label,
      LEFT(s.message, 60) AS sub,
      '/PagesSms' AS path
    FROM sms_notifications s
    WHERE s.recipient_name LIKE ? OR s.message LIKE ? OR s.sent_to LIKE ?

    LIMIT 20
  `;

  const params = [
    q, q, q, q,   // PWD Profile
    q, q, q, q,   // Health Record
    q, q, q,      // Event
    q, q,         // Inventory
    q, q, q,      // Donation
    q, q, q,      // SMS (✅ sms_notifications)
  ];

  db.query(sql, params, callback);
};

// ✅ STAFF — PWD Profiles, Health Records, Events only
const searchStaff = (query, callback) => {
  const q = `%${query}%`;

  const sql = `
    SELECT 'PWD Profile' AS module, 'person' AS icon,
      CONCAT(u.full_name, ' — ', p.pwd_number) AS label,
      p.pwd_number AS sub,
      '/PagesProfiling' AS path
    FROM pwd_profiles p
    JOIN user u ON p.user_id = u.user_id
    WHERE u.full_name LIKE ? OR p.pwd_number LIKE ? OR p.disability_type LIKE ? OR p.address LIKE ?

    UNION ALL

    SELECT 'Health Record' AS module, 'health_and_safety' AS icon,
      CONCAT(u.full_name, ' — ', h.health_status) AS label,
      DATE_FORMAT(h.recorded_at, '%M %d, %Y') AS sub,
      '/PagesHealthRecords' AS path
    FROM health_records h
    JOIN pwd_profiles p ON h.pwd_id = p.pwd_id
    JOIN user u ON p.user_id = u.user_id
    WHERE u.full_name LIKE ? OR h.health_status LIKE ? OR h.remarks LIKE ? OR p.pwd_number LIKE ?

    UNION ALL

    SELECT 'Event' AS module, 'event_available' AS icon,
      e.event_name AS label,
      CONCAT(DATE_FORMAT(e.event_date, '%M %d, %Y'), ' — ', COALESCE(e.location, '')) AS sub,
      '/PagesEvents' AS path
    FROM events e
    WHERE e.event_name LIKE ? OR e.location LIKE ? OR e.description LIKE ?

    LIMIT 15
  `;

  const params = [
    q, q, q, q,   // PWD Profile
    q, q, q, q,   // Health Record
    q, q, q,      // Event
  ];

  db.query(sql, params, callback);
};

// ✅ USER — own health records, events, own assistance only
const searchUser = (userId, query, callback) => {
  const q = `%${query}%`;

  const sql = `
    SELECT 'Health Record' AS module, 'health_and_safety' AS icon,
      h.health_status AS label,
      DATE_FORMAT(h.recorded_at, '%M %d, %Y') AS sub,
      '/PagesHealthStatus' AS path
    FROM health_records h
    JOIN pwd_profiles p ON h.pwd_id = p.pwd_id
    WHERE p.user_id = ?
      AND (h.health_status LIKE ? OR h.remarks LIKE ? OR h.blood_pressure LIKE ?)

    UNION ALL

    SELECT 'Event' AS module, 'event_available' AS icon,
      e.event_name AS label,
      CONCAT(DATE_FORMAT(e.event_date, '%M %d, %Y'), ' — ', COALESCE(e.location, '')) AS sub,
      '/PagesEvents' AS path
    FROM events e
    WHERE e.event_name LIKE ? OR e.location LIKE ? OR e.description LIKE ?

    UNION ALL

    SELECT 'Assistance' AS module, 'volunteer_activism' AS icon,
      CONCAT(i.item_name, ' x', a.quantity) AS label,
      DATE_FORMAT(a.release_date, '%M %d, %Y') AS sub,
      '/PagesAssistance' AS path
    FROM assistance_distribution a
    JOIN inventory_items i ON a.item_id = i.inventory_id
    WHERE a.beneficiary_id = (
      SELECT pwd_id FROM pwd_profiles WHERE user_id = ? LIMIT 1
    )
    AND (i.item_name LIKE ? OR a.remarks LIKE ?)

    LIMIT 15
  `;

  const params = [
    userId, q, q, q,   // Health Record
    q, q, q,           // Event
    userId, q, q,      // Assistance (✅ fixed: using beneficiary_id via subquery)
  ];

  db.query(sql, params, callback);
};

exports.globalSearch = (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json([]);

  const role   = req.user?.role;
  const userId = req.user?.id;


  if (role === "admin") {
    searchAdmin(q.trim(), (err, results) => {
      if (err) {
        console.error("Admin search error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } else if (role === "staff") {
    searchStaff(q.trim(), (err, results) => {
      if (err) {
        console.error("Staff search error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } else {
    searchUser(userId, q.trim(), (err, results) => {
      if (err) {
        console.error("User search error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  }
};