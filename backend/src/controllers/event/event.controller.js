const db = require("../../config/db");


// ✅ GET ALL EVENTS
exports.getEvents = (req, res) => {
  db.query("SELECT * FROM events ORDER BY event_date DESC",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });
};


// ✅ CREATE EVENT
exports.createEvent = (req, res) => {
  const { event_name, event_date, location, description, created_by } =
    req.body;

  const sql = `
    INSERT INTO events
    (event_name, event_date, location, description, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [event_name, event_date, location, description, created_by],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Event created" });
    }
  );
};


// ✅ UPDATE EVENT
exports.updateEvent = (req, res) => {
  const { id } = req.params;

  const {
    event_name,
    event_date,
    location,
    description,
    capacity,
    registered,
    status
  } = req.body;

  const sql = `
    UPDATE events SET
      event_name=?,
      event_date=?,
      location=?,
      description=?,
      capacity=?,
      registered=?,
      status=?
    WHERE event_id=?
  `;

  db.query(
    sql,
    [
      event_name,
      event_date,
      location,
      description,
      capacity,
      registered,
      status,
      id
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Event updated" });
    }
  );
};


// ✅ DELETE EVENT
exports.deleteEvent = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM event_attendance WHERE event_id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "DELETE FROM events WHERE event_id=?",
        [id],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({ message: "Event deleted" });
        }
      );
    }
  );
};

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