const Donation = require("../../models/inventory/donationModel");
const log = require("../../helper/recentLog/RecentLogHelper");

exports.getAll = (req, res) => {
  Donation.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.create = (req, res) => {
  Donation.create(req.body, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Recorded new donation`, "Assistance/Distribution", `Donor: ${req.body.donor_name || "Anonymous"}`);
    res.json({ message: "Donation recorded successfully" });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  Donation.update(id, req.body, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Updated donation`, "Assistance/Distribution", `Donation ID: ${id}`);
    res.json({ message: "Donation updated successfully" });
  });
};

exports.remove = (req, res) => {
  const { id } = req.params;
  Donation.remove(id, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Deleted donation`, "Assistance/Distribution", `Donation ID: ${id}`);
    res.json({ message: "Donation deleted successfully" });
  });
};