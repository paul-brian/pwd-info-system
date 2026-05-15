const Inventory = require("../../models/inventory/inventoryModel");
const log = require("../../helper/recentLog/RecentLogHelper")

exports.getAll = (req, res) => {
  Inventory.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getOne = (req, res) => {
  Inventory.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

exports.create = (req, res) => {
  Inventory.create(req.body, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Added inventory item: ${req.body.item_name}`, "Assistance/Distribution", `Category: ${req.body.category}`);
    res.json({ message: "Item added successfully" });
  });
};

exports.update = (req, res) => {
  Inventory.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Updated inventory item`, "Assistance/Distribution", `Item ID: ${req.params.id}`);
    res.json({ message: "Item updated successfully" });
  });
};

exports.delete = (req, res) => {
  Inventory.delete(req.params.id, (err) => {
    if (err) return res.status(500).json(err);
    log(req.user?.id, `Deleted inventory item`, "Assistance/Distribution", `Item ID: ${req.params.id}`);
    res.json({ message: "Item deleted successfully" });
  });
};