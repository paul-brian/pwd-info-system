const db = require("../../config/db");
const log = require("../../helper/recentLog/RecentLogHelper");

// ✅ Auto-update Completed status based on end_time — runs on every getEvents call
const autoCompleteEvents = () => {
  const sql = `
    UPDATE events
    SET status = 'Completed'
    WHERE status NOT IN ('Completed', 'Cancelled')
    AND end_time IS NOT NULL
    AND CONCAT(event_date, ' ', end_time) < NOW()
  `;
  db.query(sql, (err) => {
    if (err) console.error("Auto-complete events error:", err);
  });
};

// ✅ GET ALL EVENTS — includes per-event present_count, absent_count, total_pwd
exports.getEvents = (req, res) => {
  autoCompleteEvents();

  const sql = `
    SELECT 
      e.*,
      (SELECT COUNT(*) FROM pwd_profiles WHERE status = 'active') AS total_pwd,
      COALESCE((
        SELECT COUNT(*) FROM event_attendance
        WHERE event_id = e.event_id AND status = 'present'
      ), 0) AS present_count,
      COALESCE((
        SELECT COUNT(*) FROM event_attendance
        WHERE event_id = e.event_id AND status = 'absent'
      ), 0) AS absent_count
    FROM events e
    ORDER BY e.event_date DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ✅ CREATE EVENT
exports.createEvent = (req, res) => {
  const { event_name, event_date, start_time, end_time, location, description, created_by } = req.body;

  const sql = `
    INSERT INTO events
    (event_name, event_date, start_time, end_time, location, description, created_by, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Scheduled', NOW())
  `;

  db.query(sql, [event_name, event_date, start_time || null, end_time || null, location, description, created_by || 1], (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Created event: ${event_name}`, "Event Attendance", `Date: ${event_date}, Location: ${location}`);
    res.json({ message: "Event created" });
  });
};

// ✅ UPDATE EVENT
exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { event_name, event_date, start_time, end_time, location, description, status } = req.body;

  const sql = `
    UPDATE events SET
      event_name=?, event_date=?, start_time=?, end_time=?,
      location=?, description=?, status=?
    WHERE event_id=?
  `;

  db.query(sql, [event_name, event_date, start_time || null, end_time || null, location, description, status, id], (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Updated event: ${event_name}`, "Event Attendance", `Event ID: ${id}, Status: ${status}`);
    res.json({ message: "Event updated" });
  });
};

// ✅ DELETE EVENT
exports.deleteEvent = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM event_attendance WHERE event_id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    db.query("DELETE FROM events WHERE event_id=?", [id], (err2) => {
      if (err2) return res.status(500).json(err2);
      log(req.user?.id, `Deleted event`, "Event Attendance", `Event ID: ${id}`);
      res.json({ message: "Event deleted" });
    });
  });
};

// ✅ GET UPCOMING EVENTS
exports.getUpcomingEvents = (req, res) => {
  const sql = `
    SELECT * FROM events
    WHERE status IN ('Scheduled', 'Upcoming')
    AND event_date >= CURDATE()
    ORDER BY event_date ASC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};