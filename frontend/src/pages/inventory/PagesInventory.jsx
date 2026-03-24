import { useState, useEffect } from "react";
import { ToastContainer } from "../../components/ui/Toast";
import API_URL from "../../api/api";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid from "../../components/ui/StatsGrid";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import AddEditModal from "../../components/modals/AddEditModal";
import DeleteModal from "../../components/modals/DeleteModal";
import ViewModal from "../../components/modals/ViewModal";
import useToast from "../../hooks/useToast";

const API_BASE = `${API_URL}/api`;

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const getStatus = (qty, threshold = 5) =>
  qty === 0 ? "Out of Stock" : qty <= threshold ? "Low Stock" : "In Stock";
const getColor = (qty, threshold = 5) =>
  qty === 0 ? "red" : qty <= threshold ? "yellow" : "emerald";

const StatusBadge = ({ qty, threshold }) => {
  const color = getColor(qty, threshold);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
      color === "red"      ? "bg-red-100 text-red-600"
      : color === "yellow" ? "bg-yellow-100 text-yellow-600"
      : "bg-emerald-100 text-emerald-600"
    }`}>{getStatus(qty, threshold)}</span>
  );
};


// ─── INVENTORY TAB ─────────────────────────────────────────────────────────────
const InventoryTab = ({ inventoryItems, loading, error, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, item: null });
  const { toasts, showToast, removeToast } = useToast();
  const itemsPerPage = 6;

  const filtered = inventoryItems.filter(item => {
    const matchStatus =
      filterStatus === "all" ? true
      : filterStatus === "out" ? item.quantity === 0
      : filterStatus === "low" ? item.quantity > 0 && item.quantity <= (item.low_stock_threshold || 5)
      : true;
    const matchSearch =
      String(item.inventory_id).includes(search.toLowerCase()) ||
      item.item_name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      item_name: form.item_name.value,
      category:  form.category.value,
      quantity:  parseInt(form.quantity.value),
      unit:      form.unit.value,
    };
    try {
      const url = modal.type === "add" ? `${API_BASE}/inventory` : `${API_BASE}/inventory/${modal.item.inventory_id}`;
      const method = modal.type === "add" ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save item");
      await onRefresh();
      setModal({ type: null, item: null });
      showToast(modal.type === "add" ? "Item added successfully!" : "Item updated successfully!", "success");
    } catch (err) { 
      showToast(err.message || "Failed to save item.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory/${modal.item.inventory_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      await onRefresh();
      setModal({ type: null, item: null });
      showToast("Item deleted successfully!", "success");
    } catch (err) { 
      showToast(err.message || "Failed to delete item.", "error");
    }
  };

  const renderRow = (item) => (
    <tr key={item.inventory_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-4 lg:px-5 py-3 lg:py-4 font-mono text-xs text-primary font-bold text-center">{item.inventory_id}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 font-bold text-[#0e141b] dark:text-white text-sm">{item.item_name}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-slate-600 dark:text-slate-400">{item.category}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm font-medium text-center">{item.quantity}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-center">{item.unit || "—"}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-center"><StatusBadge qty={item.quantity} threshold={item.low_stock_threshold} /></td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-center">
        <div className="flex justify-center gap-1">
          <button onClick={() => setModal({ type: "view", item })} className="p-1.5 text-[#4e7397] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
          <button onClick={() => setModal({ type: "edit", item })} className="p-1.5 text-[#4e7397] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Edit">
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
          </button>
          <button onClick={() => setModal({ type: "delete", item })} className="p-1.5 text-[#4e7397] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = (item) => (
    <div key={item.inventory_id} className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#0e141b] dark:text-white truncate">{item.item_name}</p>
          <p className="text-xs text-[#4e7397] mt-0.5">{item.category}</p>
        </div>
        <StatusBadge qty={item.quantity} threshold={item.low_stock_threshold} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Qty</p><p className="text-sm font-bold text-[#0e141b] dark:text-white">{item.quantity}</p></div>
          <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Unit</p><p className="text-sm text-slate-600 dark:text-slate-400">{item.unit || "—"}</p></div>
          <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">ID</p><p className="text-xs font-mono text-primary font-bold">{item.inventory_id}</p></div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setModal({ type: "view", item })} className="p-2 text-[#4e7397] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          <button onClick={() => setModal({ type: "edit", item })} className="p-2 text-[#4e7397] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">edit_note</span>
          </button>
          <button onClick={() => setModal({ type: "delete", item })} className="p-2 text-[#4e7397] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">delete_forever</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ItemForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {[
        { name: "item_name", label: "Item Name", placeholder: "e.g. Folding Wheelchair", val: modal.item?.item_name },
        { name: "category",  label: "Category",  placeholder: "e.g. Wheelchair",         val: modal.item?.category },
        { name: "unit",      label: "Unit",      placeholder: "e.g. pcs, box, pair",     val: modal.item?.unit },
      ].map(f => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-[#4e7397] uppercase">{f.label}</label>
          <input name={f.name} placeholder={f.placeholder} defaultValue={f.val || ""} required={f.name !== "unit"}
            className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Quantity</label>
        <input name="quantity" type="number" min="0" defaultValue={modal.item?.quantity || 0} required
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={() => setModal({ type: null, item: null })} className="px-4 py-2.5 border rounded-xl text-sm">Cancel</button>
        <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">
          {modal.type === "add" ? "Add" : "Save"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
          <SearchBar
            searchValue={search}
            setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
            filterValue={filterStatus}
            setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
            placeholder="Search by name or ID..."
            options={[
              { value: "all", label: "All" },
              { value: "low", label: "Low Stock" },
              { value: "out", label: "Out of Stock" },
            ]}
          />
        </div>
        <button onClick={() => setModal({ type: "add", item: null })}
          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5
            bg-primary text-white font-bold rounded-xl hover:bg-primary/90
            transition-colors shadow-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0 h-fit">
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <DataTable
        columns={["ID", "Item Name", "Category", "Quantity", "Unit", "Status", "Actions"]}
        data={paginated} renderRow={renderRow} renderCard={renderCard} empty="No items found."
        pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={(p) => setCurrentPage(p)} />}
      />

      {modal.type === "view" && (
        <ViewModal title="Item Details" icon="inventory"
          data={{ "Item Name": modal.item.item_name, "Category": modal.item.category, "Quantity": modal.item.quantity, "Unit": modal.item.unit || "—", "Status": getStatus(modal.item.quantity, modal.item.low_stock_threshold) }}
          onClose={() => setModal({ type: null, item: null })} />
      )}
      {modal.type === "add" && (
        <AddEditModal isOpen isEdit={false} title="Item" icon="inventory" onCancel={() => setModal({ type: null, item: null })}>
          <ItemForm />
        </AddEditModal>
      )}
      {modal.type === "edit" && (
        <AddEditModal isOpen isEdit={true} title="Item" icon="edit_note" onCancel={() => setModal({ type: null, item: null })}>
          <ItemForm />
        </AddEditModal>
      )}
      {modal.type === "delete" && (
        <DeleteModal title="Delete Item" message="Are you sure you want to delete" subject={modal.item.item_name} confirmText="Delete"
          onConfirm={handleDelete} onCancel={() => setModal({ type: null, item: null })} />
      )}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// ─── DONATIONS TAB ─────────────────────────────────────────────────────────────
const DonationsTab = ({ inventoryItems, onInventoryRefresh }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const closeModal = () => setModal({ type: null, data: null });

  // ── Add ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      donor_name:     form.donor_name.value,
      Item_id:        parseInt(form.Item_id.value),
      category:       form.category.value,
      quantity:       parseInt(form.quantity.value),
      donations_date: form.donations_date.value,
    };
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to record donation");
      await fetchDonations();
      await onInventoryRefresh();
      showToast("Donation recorded successfully!", "success");
      closeModal();
    } catch (err) { 
      showToast(err.message || "Failed to record donation.", "error");  
    } finally { setSubmitting(false); }
  };

  // ── Edit ──
  const handleEdit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      donor_name:     form.donor_name.value,
      Item_id:        parseInt(form.Item_id.value),
      category:       form.category.value,
      quantity:       parseInt(form.quantity.value),
      donations_date: form.donations_date.value,
    };
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/donations/${modal.data.donation_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update donation");
      await fetchDonations();
      await onInventoryRefresh();
      showToast("Donation updated successfully!", "success");
      closeModal();
    } catch (err) {  
      showToast(err.message || "Failed to update donation.", "error");
    } finally { setSubmitting(false); }
  };

  // ── Delete ──
  const handleDelete = async () => {
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/donations/${modal.data.donation_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete donation");
      await fetchDonations();
      await onInventoryRefresh();
      
      closeModal();
    } catch (err) { 
      showToast(err.message || "Failed to delete donation.", "error"); 
    } finally { setSubmitting(false); }
  };

  const filtered = donations.filter(d => {
    const matchCategory = filterCategory === "all" || (d.category || "").toLowerCase() === filterCategory.toLowerCase();
    const matchSearch =
      (d.donor_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.item_name  || "").toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── Desktop row ──
  const renderRow = (d, i) => (
    <tr key={d.donation_id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-4 lg:px-5 py-3 lg:py-4 font-mono text-xs text-primary font-bold text-center">{d.donation_id}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 font-semibold text-[#0e141b] dark:text-white text-sm">{d.donor_name}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-slate-600 dark:text-slate-400">{d.item_name}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm font-medium text-center">{d.quantity}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-center whitespace-nowrap">{d.donations_date ? new Date(d.donations_date).toLocaleDateString() : "—"}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-[#4e7397]">{d.category || "—"}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-center">
        <div className="flex justify-center gap-1">
          <button onClick={() => setModal({ type: "view", data: d })}
            className="p-1.5 text-[#4e7397] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
          <button onClick={() => setModal({ type: "edit", data: d })}
            className="p-1.5 text-[#4e7397] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
          </button>
          <button onClick={() => setModal({ type: "delete", data: d })}
            className="p-1.5 text-[#4e7397] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          </button>
        </div>
      </td>
    </tr>
  );

  // ── Mobile card ──
  const renderCard = (d, i) => (
    <div key={d.donation_id || i} className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#0e141b] dark:text-white truncate">{d.donor_name}</p>
          <p className="text-xs text-[#4e7397] mt-0.5">{d.item_name}</p>
        </div>
        <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-md flex-shrink-0">#{d.donation_id}</span>
      </div>
      <div className="flex gap-4 mb-2.5">
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Qty</p><p className="text-sm font-bold text-[#0e141b] dark:text-white">{d.quantity}</p></div>
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Category</p><p className="text-xs text-slate-600 dark:text-slate-400">{d.category || "—"}</p></div>
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Date</p><p className="text-xs text-slate-600 dark:text-slate-400">{d.donations_date ? new Date(d.donations_date).toLocaleDateString() : "—"}</p></div>
      </div>
      <div className="flex gap-2 pt-2.5 border-t border-[#e7edf3] dark:border-slate-800">
        <button onClick={() => setModal({ type: "view", data: d })}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 text-[#4e7397] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm">
          <span className="material-symbols-outlined text-base">visibility</span>
          <span className="hidden sm:inline">View</span>
        </button>
        <button onClick={() => setModal({ type: "edit", data: d })}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 text-[#4e7397] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-xs sm:text-sm">
          <span className="material-symbols-outlined text-base">edit_note</span>
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button onClick={() => setModal({ type: "delete", data: d })}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 text-[#4e7397] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm">
          <span className="material-symbols-outlined text-base">delete_forever</span>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );

  // ── Donation Form (shared by Add + Edit) ──
  const DonationForm = ({ onSubmit }) => (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Donor Name</label>
        <input name="donor_name" placeholder="e.g. DSWD Regional Office" required
          defaultValue={modal.data?.donor_name || ""}
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Item</label>
        <select name="Item_id" required className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">
          <option value="">— Select Item —</option>
          {inventoryItems.map(item => (
            <option key={item.inventory_id} value={item.inventory_id}
              selected={modal.data?.Item_id === item.inventory_id}>
              {item.item_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Category</label>
        <input name="category" placeholder="e.g. Medicine, Wheelchair" required
          defaultValue={modal.data?.category || ""}
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Quantity</label>
        <input name="quantity" type="number" min="1" placeholder="0" required
          defaultValue={modal.data?.quantity || ""}
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Donation Date</label>
        <input name="donations_date" type="date" required
          defaultValue={modal.data?.donations_date ? modal.data.donations_date.slice(0, 10) : ""}
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={closeModal} className="px-4 py-2.5 border rounded-xl text-sm">Cancel</button>
        <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60">
          {submitting ? "Saving..." : modal.type === "add" ? "Record Donation" : "Save Changes"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
          <SearchBar
            searchValue={search}
            setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
            filterValue={filterCategory}
            setFilterValue={(val) => { setFilterCategory(val); setCurrentPage(1); }}
            placeholder="Search by donor or item..."
            options={[
              { value: "all",        label: "All Categories" },
              { value: "medicine",   label: "Medicine" },
              { value: "wheelchair", label: "Wheelchair" },
              { value: "equipment",  label: "Equipment" },
              { value: "food",       label: "Food" },
              { value: "clothing",   label: "Clothing" },
            ]}
          />
        </div>
        <button onClick={() => setModal({ type: "add", data: null })}
          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5
            bg-primary text-white font-bold rounded-xl hover:bg-primary/90
            transition-colors shadow-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0 h-fit">
          <span className="material-symbols-outlined text-base">volunteer_activism</span>
          <span className="hidden sm:inline">Record Donation</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <DataTable
        columns={["#", "Donor Name", "Item", "Quantity", "Date", "Category", "Actions"]}
        data={paginated} renderRow={renderRow} renderCard={renderCard} empty="No donations recorded yet."
        pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={(p) => setCurrentPage(p)} />}
      />

      {/* ── View Modal ── */}
      {modal.type === "view" && (
        <ViewModal
          title="Donation Details" icon="volunteer_activism"
          data={{
            "Donation ID": modal.data.donation_id,
            "Donor Name":  modal.data.donor_name,
            "Item":        modal.data.item_name,
            "Category":    modal.data.category || "—",
            "Quantity":    modal.data.quantity,
            "Date":        modal.data.donations_date ? new Date(modal.data.donations_date).toLocaleDateString() : "—",
          }}
          onClose={closeModal}
        />
      )}

      {/* ── Add Modal ── */}
      {modal.type === "add" && (
        <AddEditModal isOpen isEdit={false} title="Donation" icon="volunteer_activism" onCancel={closeModal}>
          <DonationForm onSubmit={handleSubmit} />
        </AddEditModal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === "edit" && (
        <AddEditModal isOpen isEdit={true} title="Donation" icon="volunteer_activism" onCancel={closeModal}>
          <DonationForm onSubmit={handleEdit} />
        </AddEditModal>
      )}

      {/* ── Delete Modal ── */}
      {modal.type === "delete" && (
        <DeleteModal
          title="Delete Donation"
          message="Are you sure you want to delete donation from"
          subject={modal.data.donor_name}
          confirmText={submitting ? "Deleting..." : "Delete"}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}

      {/* ── Toast ── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// ─── DISTRIBUTION TAB ──────────────────────────────────────────────────────────
const DistributionTab = ({ inventoryItems, onInventoryRefresh }) => {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
      item_id:        parseInt(form.item_id.value),
      quantity:       parseInt(form.quantity.value),
      release_date:   form.release_date.value,
      remarks:        form.remarks.value,
    };
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/distribution`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to release assistance");
      await fetchDistributions();
      await onInventoryRefresh();
      setModal(false);
      showToast("Assistance released successfully!", "success");
    } catch (err) { 
      showToast(err.message || "Failed to release assistance.", "error"); 
    } finally { setSubmitting(false); }
  };

  const filtered = distributions.filter(d => {
    const matchStatus = filterStatus === "all" || (d.status || "").toLowerCase() === filterStatus.toLowerCase();
    const matchSearch =
      (d.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.item_name  || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderRow = (d, i) => (
    <tr key={d.assistance_id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-4 lg:px-5 py-3 lg:py-4 font-mono text-xs text-primary font-bold text-center">{d.assistance_id}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 font-semibold text-[#0e141b] dark:text-white text-sm">{d.full_name || `PWD #${d.beneficiary_id}`}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-slate-600 dark:text-slate-400">{d.item_name}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm font-medium text-center">{d.quantity}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-center whitespace-nowrap">{d.release_date ? new Date(d.release_date).toLocaleDateString() : "—"}</td>
      <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-[#4e7397]">{d.remarks || "—"}</td>
    </tr>
  );

  const renderCard = (d, i) => (
    <div key={d.assistance_id || i} className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#0e141b] dark:text-white truncate">{d.full_name || `PWD #${d.beneficiary_id}`}</p>
          <p className="text-xs text-[#4e7397] mt-0.5">{d.item_name}</p>
        </div>
        <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-md flex-shrink-0">#{d.assistance_id}</span>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Qty</p><p className="text-sm font-bold text-[#0e141b] dark:text-white">{d.quantity}</p></div>
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Date</p><p className="text-xs text-slate-600 dark:text-slate-400">{d.release_date ? new Date(d.release_date).toLocaleDateString() : "—"}</p></div>
        {d.remarks && <div className="flex-1 min-w-0"><p className="text-[9px] text-[#4e7397] uppercase font-bold">Remarks</p><p className="text-xs text-slate-600 dark:text-slate-400 truncate">{d.remarks}</p></div>}
      </div>
    </div>
  );

  const DistributionForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Beneficiary ID</label>
        <input name="beneficiary_id" type="number" placeholder="PWD Profile ID" required
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Item</label>
        <select name="item_id" required className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">
          <option value="">— Select Item —</option>
          {inventoryItems.map(item => (
            <option key={item.inventory_id} value={item.inventory_id}>{item.item_name} (Stock: {item.quantity})</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Quantity</label>
        <input name="quantity" type="number" min="1" placeholder="0" required
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Release Date</label>
        <input name="release_date" type="date" required
          className="border rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase">Remarks</label>
        <textarea name="remarks" rows={2} placeholder="Optional notes..."
          className="border rounded-xl px-3 py-2.5 text-sm resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded-xl px-3 py-2.5 text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm flex-shrink-0">info</span>
        Stock will automatically be deducted upon release.
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={() => setModal(false)} className="px-4 py-2.5 border rounded-xl text-sm">Cancel</button>
        <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60">
          {submitting ? "Releasing..." : "Release"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
          <SearchBar
            searchValue={search}
            setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
            filterValue={filterStatus}
            setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
            placeholder="Search by beneficiary or item..."
            options={[
              { value: "all",       label: "All" },
              { value: "released",  label: "Released" },
              { value: "pending",   label: "Pending" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5
            bg-primary text-white font-bold rounded-xl hover:bg-primary/90
            transition-colors shadow-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0 h-fit">
          <span className="material-symbols-outlined text-base">local_shipping</span>
          <span className="hidden sm:inline">Release Assistance</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      <DataTable
        columns={["#", "Beneficiary", "Item Released", "Quantity", "Release Date", "Remarks"]}
        data={paginated} renderRow={renderRow} renderCard={renderCard} empty="No distributions recorded yet."
        pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={(p) => setCurrentPage(p)} />}
      />

      {modal && (
        <AddEditModal isOpen isEdit={false} title="Assistance" icon="local_shipping" onCancel={() => setModal(false)}>
          <DistributionForm />
        </AddEditModal>
      )}

      {/* ── Toast ── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const AdminInventoryPage = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState(null);

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

  const statsdata = [
    { label: "Total Items",  icon: "inventory", value: inventoryItems.length, change: "", changeText: "in stock",        changeClass: "text-emerald-600" },
    { label: "Low Stock",    icon: "warning",   value: inventoryItems.filter(i => i.quantity > 0 && i.quantity <= (i.low_stock_threshold || 5)).length, change: "", changeText: "need restocking", changeClass: "text-yellow-600" },
    { label: "Out of Stock", icon: "block",     value: inventoryItems.filter(i => i.quantity === 0).length, change: "", changeText: "unavailable", changeClass: "text-red-600" },
  ];

  const tabs = [
    { key: "inventory",    label: "Inventory",    icon: "inventory" },
    { key: "donations",    label: "Donations",    icon: "volunteer_activism" },
    { key: "distribution", label: "Distribution", icon: "local_shipping" },
  ];

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-[#0e141b] dark:text-white text-xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight">
          Inventory & Donations
        </h1>
        <p className="text-[#4e7397] dark:text-slate-400 text-xs sm:text-sm md:text-base">
          Manage medical supplies, track donations, and release assistance to PWD beneficiaries.
        </p>
      </div>

      <StatsGrid>
        {statsdata.map((stat, idx) => (
          <StatsCards key={idx} stat={stat} />
        ))}
      </StatsGrid>

      <div className="flex border-b border-[#e7edf3] dark:border-slate-800 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3
              text-xs sm:text-sm font-bold transition-all border-b-2 -mb-px whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-[#4e7397] hover:text-[#0e141b] dark:hover:text-white"
            }`}>
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "inventory"    && <InventoryTab    inventoryItems={inventoryItems} loading={inventoryLoading} error={inventoryError} onRefresh={fetchInventory} />}
      {activeTab === "donations"    && <DonationsTab    inventoryItems={inventoryItems} onInventoryRefresh={fetchInventory} />}
      {activeTab === "distribution" && <DistributionTab inventoryItems={inventoryItems} onInventoryRefresh={fetchInventory} />}
    </div>
  );
};

export default AdminInventoryPage;
