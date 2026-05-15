const db = require("../../config/db");

exports.getAll = (callback) => {
  db.query(`
    SELECT d.*, i.item_name
    FROM donations d
    JOIN inventory_items i ON d.Item_id = i.inventory_id
    ORDER BY d.donations_date DESC
  `, callback);
};

exports.create = (data, callback) => {
  const { donor_name, Item_id, quantity, donations_date, category } = data;

  db.query(
    `INSERT INTO donations (donor_name, Item_id, quantity, donations_date, category)
     VALUES (?, ?, ?, ?, ?)`,
    [donor_name, Item_id, quantity, donations_date, category || ""],
    (err) => {
      if (err) return callback(err);
      // Add quantity to inventory on donation
      db.query(
        "UPDATE inventory_items SET quantity = quantity + ? WHERE inventory_id = ?",
        [quantity, Item_id],
        callback
      );
    }
  );
};

exports.update = (id, data, callback) => {
  const { donor_name, Item_id, quantity, donations_date, category } = data;

  // Get old quantity first to adjust inventory
  db.query("SELECT quantity, Item_id FROM donations WHERE donation_id = ?", [id], (err, rows) => {
    if (err) return callback(err);
    if (!rows.length) return callback(new Error("Donation not found"));

    const oldQty    = rows[0].quantity;
    const oldItemId = rows[0].Item_id;
    const diff      = quantity - oldQty;

    // Update donation record
    db.query(
      `UPDATE donations SET donor_name=?, Item_id=?, quantity=?, donations_date=?, category=?
       WHERE donation_id=?`,
      [donor_name, Item_id, quantity, donations_date, category || "", id],
      (err) => {
        if (err) return callback(err);

        // Adjust inventory — if same item, just adjust by diff
        if (String(oldItemId) === String(Item_id)) {
          db.query(
            "UPDATE inventory_items SET quantity = quantity + ? WHERE inventory_id = ?",
            [diff, Item_id],
            callback
          );
        } else {
          // Different item — revert old, add to new
          db.query(
            "UPDATE inventory_items SET quantity = quantity - ? WHERE inventory_id = ?",
            [oldQty, oldItemId],
            (err) => {
              if (err) return callback(err);
              db.query(
                "UPDATE inventory_items SET quantity = quantity + ? WHERE inventory_id = ?",
                [quantity, Item_id],
                callback
              );
            }
          );
        }
      }
    );
  });
};

exports.remove = (id, callback) => {
  // Get donation details first to revert inventory
  db.query("SELECT quantity, Item_id FROM donations WHERE donation_id = ?", [id], (err, rows) => {
    if (err) return callback(err);
    if (!rows.length) return callback(new Error("Donation not found"));

    const { quantity, Item_id } = rows[0];

    // Delete donation
    db.query("DELETE FROM donations WHERE donation_id = ?", [id], (err) => {
      if (err) return callback(err);

      // Revert inventory quantity
      db.query(
        "UPDATE inventory_items SET quantity = quantity - ? WHERE inventory_id = ?",
        [quantity, Item_id],
        callback
      );
    });
  });
};