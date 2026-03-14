import { useState, useEffect } from "react";
import API_URL from "../api/api";


const API_BASE = `${API_URL}/api`;

// ─── SHARED HELPERS ────────────────────────────────────────────────────────────



const getStatus = (qty, threshold = 5) =>
  qty === 0 ? "Out of Stock" : qty <= threshold ? "Low Stock" : "In Stock";
const getColor = (qty, threshold = 5) =>
  qty === 0 ? "red" : qty <= threshold ? "yellow" : "emerald";

const StatusBadge = ({ qty, threshold }) => {
  const color = getColor(qty, threshold);
  const status = getStatus(qty, threshold);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
      color === "red" ? "bg-red-100 text-red-600"
      : color === "yellow" ? "bg-yellow-100 text-yellow-600"
      : "bg-emerald-100 text-emerald-600"
    }`}>{status}</span>
  );
};

const ErrorBanner = ({ message }) => (
  <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
    <span className="material-symbols-outlined text-[18px]">error</span>
    {message} — Make sure your backend is running on port 5000.
  </div>
);

const LoadingRow = ({ cols, text }) => (
  <tr><td colSpan={cols} className="py-16">
    <div className="flex items-center justify-center gap-3 text-[#4e7397]">
      <span className="material-symbols-outlined animate-spin">progress_activity</span>
      {text}
    </div>
  </td></tr>
);


const EmptyRow = ({ cols, text }) => (
  <tr><td colSpan={cols} className="py-12 text-center text-[#4e7397] text-sm">{text}</td></tr>
);

const Pagination = ({ currentPage, totalPages, setCurrentPage, totalItems, itemsPerPage }) => (
  <div className="px-5 py-4 flex flex-wrap items-center justify-between border-t border-[#e7edf3] dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 gap-2">
    <p className="text-sm text-[#4e7397]">
      Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
    </p>
    <div className="flex gap-2 flex-wrap">
      <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 border border-[#d0dbe7] dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm disabled:opacity-50">Previous</button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded-md text-sm font-bold ${currentPage === i + 1 ? "bg-primary text-white" : "bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"}`}>{i + 1}</button>
      ))}
      <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border border-[#d0dbe7] dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-sm disabled:opacity-50">Next</button>
    </div>
  </div>
);

// ─── INVENTORY TAB ─────────────────────────────────────────────────────────────
const InventoryTab = ({ inventoryItems, loading, error, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, item: null });
  const itemsPerPage = 5;

  const filtered = inventoryItems.filter(item =>
    String(item.inventory_id).includes(search.toLowerCase()) ||
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      item_name: form.item_name.value,
      category: form.category.value,
      quantity: parseInt(form.quantity.value),
      unit: form.unit.value,
    };
    try {
      const url = modal.type === "add" ? `${API_BASE}/inventory` : `${API_BASE}/inventory/${modal.item.inventory_id}`;
      const method = modal.type === "add" ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save item");
      await onRefresh();
      setModal({ type: null, item: null });
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory/${modal.item.inventory_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      await onRefresh();
      setModal({ type: null, item: null });
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e7397]">search</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
            placeholder="Search by name or ID..." />
        </div>
        <button onClick={() => setModal({ type: "add", item: null })}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap">
          <span className="material-symbols-outlined">add_circle</span>Add Item
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#d0dbe7] dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>{["ID", "Item Name", "Category", "Quantity", "Unit", "Status", "Actions"].map((col, i) => (
              <th key={i} className="px-5 py-3 text-xs font-bold text-[#4e7397] uppercase tracking-wider text-center">{col}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-800">
            {loading ? <LoadingRow cols={7} text="Loading inventory..." />
              : paginated.length === 0 ? <EmptyRow cols={7} text="No items found." />
              : paginated.map(item => (
                <tr key={item.inventory_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-primary font-bold text-center">{item.inventory_id}</td>
                  <td className="px-5 py-3 font-bold text-[#0e141b] dark:text-white text-sm">{item.item_name}</td>
                  <td className="px-5 py-3 text-sm">{item.category}</td>
                  <td className="px-5 py-3 text-sm font-medium text-center">{item.quantity}</td>
                  <td className="px-5 py-3 text-sm text-center">{item.unit || "—"}</td>
                  <td className="px-5 py-3 text-center"><StatusBadge qty={item.quantity} threshold={item.low_stock_threshold} /></td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setModal({ type: "edit", item })} className="p-1.5 text-[#4e7397] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit_note</span>
                      </button>
                      <button onClick={() => setModal({ type: "delete", item })} className="p-1.5 text-[#4e7397] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} totalItems={filtered.length} itemsPerPage={itemsPerPage} />}
      </div>

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full shadow-xl">
            {modal.type === "delete" ? (
              <>
                <h2 className="text-xl font-bold mb-4">Delete Item</h2>
                <p>Are you sure you want to delete <span className="font-bold">{modal.item.item_name}</span>?</p>
                <div className="flex justify-end gap-2 mt-6">
                  <button onClick={() => setModal({ type: null, item: null })} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Delete</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-5">{modal.type === "add" ? "Add New Item" : "Edit Item"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {[
                    { name: "item_name", label: "Item Name", placeholder: "e.g. Folding Wheelchair", defaultValue: modal.item?.item_name },
                    { name: "category", label: "Category", placeholder: "e.g. Wheelchair", defaultValue: modal.item?.category },
                    { name: "unit", label: "Unit", placeholder: "e.g. pcs, box, pair", defaultValue: modal.item?.unit },
                  ].map(f => (
                    <div key={f.name} className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[#4e7397] uppercase">{f.label}</label>
                      <input name={f.name} placeholder={f.placeholder} defaultValue={f.defaultValue || ""} required={f.name !== "unit"} className="border rounded-lg px-3 py-2 text-sm" />
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#4e7397] uppercase">Quantity</label>
                    <input name="quantity" type="number" min="0" defaultValue={modal.item?.quantity || 0} required className="border rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button type="button" onClick={() => setModal({ type: null, item: null })} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">{modal.type === "add" ? "Add" : "Save"}</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DONATIONS TAB ─────────────────────────────────────────────────────────────
const DonationsTab = ({ inventoryItems, onInventoryRefresh }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/donations`);
      if (!res.ok) throw new Error("Failed to fetch donations");
      setDonations(await res.json());
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      donor_name: form.donor_name.value,
      Item_id: parseInt(form.Item_id.value),       // capital I — matches schema
      category: form.category.value,
      quantity: parseInt(form.quantity.value),
      donations_date: form.donations_date.value,   // matches schema column name
    };
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/donations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to record donation");
      await fetchDonations();
      await onInventoryRefresh();
      setModal(false);
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  const filtered = donations.filter(d =>
    (d.donor_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.item_name || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e7397]">search</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
            placeholder="Search by donor or item..." />
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap">
          <span className="material-symbols-outlined">volunteer_activism</span>Record Donation
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#d0dbe7] dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>{["#", "Donor Name", "Item", "Quantity", "Date", "Category"].map((col, i) => (
              <th key={i} className="px-5 py-3 text-xs font-bold text-[#4e7397] uppercase tracking-wider text-center">{col}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-800">
            {loading ? <LoadingRow cols={6} text="Loading donations..." />
              : paginated.length === 0 ? <EmptyRow cols={6} text="No donations recorded yet." />
              : paginated.map((d, i) => (
                <tr key={d.donation_id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-primary font-bold text-center">{d.donation_id}</td>
                  <td className="px-5 py-3 font-semibold text-[#0e141b] dark:text-white text-sm">{d.donor_name}</td>
                  <td className="px-5 py-3 text-sm">{d.item_name}</td>
                  <td className="px-5 py-3 text-sm font-medium text-center">{d.quantity}</td>
                  <td className="px-5 py-3 text-sm text-center">{d.donations_date ? new Date(d.donations_date).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-3 text-sm text-[#4e7397]">{d.category || "—"}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} totalItems={filtered.length} itemsPerPage={itemsPerPage} />}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">volunteer_activism</span>Record New Donation
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Donor Name</label>
                <input name="donor_name" placeholder="e.g. DSWD Regional Office" required className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Item</label>
                <select name="Item_id" required className="border rounded-lg px-3 py-2 text-sm">
                  <option value="">— Select Item —</option>
                  {inventoryItems.map(item => <option key={item.inventory_id} value={item.inventory_id}>{item.item_name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Category</label>
                <input name="category" placeholder="e.g. Medicine, Wheelchair" required className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Quantity</label>
                <input name="quantity" type="number" min="1" placeholder="0" required className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Donation Date</label>
                <input name="donations_date" type="date" required className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold disabled:opacity-60">
                  {submitting ? "Saving..." : "Record Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DISTRIBUTION TAB ──────────────────────────────────────────────────────────
const DistributionTab = ({ inventoryItems, onInventoryRefresh }) => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/distribution`);
      if (!res.ok) throw new Error("Failed to fetch distributions");
      setDistributions(await res.json());
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDistributions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      beneficiary_id: parseInt(form.beneficiary_id.value),
      item_id: parseInt(form.item_id.value),
      quantity: parseInt(form.quantity.value),
      release_date: form.release_date.value,
      remarks: form.remarks.value,
    };
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/distribution`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to release assistance");
      await fetchDistributions();
      await onInventoryRefresh();
      setModal(false);
    } catch (err) { alert(err.message); }
    finally { setSubmitting(false); }
  };

  const filtered = distributions.filter(d =>
    (d.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.item_name || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e7397]">search</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
            placeholder="Search by beneficiary or item..." />
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap">
          <span className="material-symbols-outlined">local_shipping</span>Release Assistance
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#d0dbe7] dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>{["#", "Beneficiary", "Item Released", "Quantity", "Release Date", "Remarks"].map((col, i) => (
              <th key={i} className="px-5 py-3 text-xs font-bold text-[#4e7397] uppercase tracking-wider text-center">{col}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-800">
            {loading ? <LoadingRow cols={6} text="Loading distributions..." />
              : paginated.length === 0 ? <EmptyRow cols={6} text="No distributions recorded yet." />
              : paginated.map((d, i) => (
                <tr key={d.assistance_id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-primary font-bold text-center">{d.assistance_id}</td>
                  <td className="px-5 py-3 font-semibold text-[#0e141b] dark:text-white text-sm">{d.full_name || `PWD ID: ${d.beneficiary_id}`}</td>
                  <td className="px-5 py-3 text-sm">{d.item_name}</td>
                  <td className="px-5 py-3 text-sm font-medium text-center">{d.quantity}</td>
                  <td className="px-5 py-3 text-sm text-center">{d.release_date ? new Date(d.release_date).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-3 text-sm text-[#4e7397]">{d.remarks || "—"}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} totalItems={filtered.length} itemsPerPage={itemsPerPage} />}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span>Release Assistance
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Beneficiary ID</label>
                <input name="beneficiary_id" type="number" placeholder="PWD Profile ID" required className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Item</label>
                <select name="item_id" required className="border rounded-lg px-3 py-2 text-sm">
                  <option value="">— Select Item —</option>
                  {inventoryItems.map(item => (
                    <option key={item.inventory_id} value={item.inventory_id}>{item.item_name} (Stock: {item.quantity})</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Quantity</label>
                <input name="quantity" type="number" min="1" placeholder="0" required className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Release Date</label>
                <input name="release_date" type="date" required className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#4e7397] uppercase">Remarks</label>
                <textarea name="remarks" rows={2} placeholder="Optional notes..." className="border rounded-lg px-3 py-2 text-sm resize-none" />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Stock will automatically be deducted upon release.
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold disabled:opacity-60">
                  {submitting ? "Releasing..." : "Release"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const AdminInventoryPage = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState(null);

  // Inventory is fetched here at the top level so Donations & Distribution
  // tabs can share the same list without extra network calls
  const fetchInventory = async () => {
    try {
      setInventoryLoading(true);
      const res = await fetch(`${API_BASE}/inventory`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      setInventoryItems(await res.json());
      setInventoryError(null);
    } catch (err) { setInventoryError(err.message); }
    finally { setInventoryLoading(false); }
  };

  useEffect(() => { fetchInventory(); }, []);

  // Stats
  const totalItems = inventoryItems.length;
  const outOfStock = inventoryItems.filter(i => i.quantity === 0).length;
  const lowStock = inventoryItems.filter(i => i.quantity > 0 && i.quantity <= (i.low_stock_threshold || 5)).length;

  const tabs = [
    { key: "inventory", label: "Inventory", icon: "inventory" },
    { key: "donations", label: "Donations", icon: "volunteer_activism" },
    { key: "distribution", label: "Distribution", icon: "local_shipping" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[#0e141b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
          Inventory & Donations
        </h1>
        <p className="text-[#4e7397] dark:text-slate-400 text-sm md:text-lg">
          Manage medical supplies, track donations, and release assistance to PWD beneficiaries.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Items", icon: "inventory", value: totalItems, sub: "in database", color: "emerald" },
          { label: "Low Stock", icon: "warning", value: lowStock, sub: "items need restocking", color: "yellow" },
          { label: "Out of Stock", icon: "block", value: outOfStock, sub: "items unavailable", color: "red" },
        ].map((s, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl p-5 border border-[#d0dbe7] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#4e7397] dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <span className={`material-symbols-outlined text-${s.color}-500`}>{s.icon}</span>
            </div>
            <p className="text-[#0e141b] dark:text-white text-3xl font-black">{inventoryLoading ? "—" : s.value}</p>
            <p className="text-[#4e7397] dark:text-slate-500 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e7edf3] dark:border-slate-800">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-[#4e7397] hover:text-[#0e141b] dark:hover:text-white"
            }`}>
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "inventory" && (
        <InventoryTab
          inventoryItems={inventoryItems}
          loading={inventoryLoading}
          error={inventoryError}
          onRefresh={fetchInventory}
        />
      )}
      {activeTab === "donations" && (
        <DonationsTab
          inventoryItems={inventoryItems}
          onInventoryRefresh={fetchInventory}
        />
      )}
      {activeTab === "distribution" && (
        <DistributionTab
          inventoryItems={inventoryItems}
          onInventoryRefresh={fetchInventory}
        />
      )}
    </div>
  );
};

export default AdminInventoryPage;