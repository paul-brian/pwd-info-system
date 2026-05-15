const Health = require("../../models/health/healthModel");
const log = require("../../helper/recentLog/RecentLogHelper")

exports.getAllHealth = (req, res) => {
  Health.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getHealthByPwd = (req, res) => {
  const { pwd_id } = req.params;

  Health.getByPwd(pwd_id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createHealth = (req, res) => {
    console.log("Request body:", req.body);
  Health.create(req.body, (err, result) => {
    console.error("DB Error:", err);
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Added health record`, "Health Record", `PWD ID: ${req.body.pwd_id}, Status: ${req.body.health_status}`);
    res.json({ message: "Health record created", id: result.insertId });
  });
};

exports.updateHealth = (req, res) => {
  const { id } = req.params;

  Health.update(id, req.body, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Updated health record`, "Health Record", `Health ID: ${req.params.id}`);
    res.json({ message: "Health record updated" });
  });
};

exports.deleteHealth = (req, res) => {
  const { id } = req.params;

  Health.delete(id, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Deleted health record`, "Health Record", `Health ID: ${req.params.id}`);
    res.json({ message: "Health record deleted" });
  });
};

exports.getMyHealth = (req, res) => {
  const userId = req.user.id;
  Health.getMyHealth(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};