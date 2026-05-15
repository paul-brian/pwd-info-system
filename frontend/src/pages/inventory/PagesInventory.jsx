import { useState, useEffect } from "react";
import API_URL from "../../api/api";
import { ToastContainer } from "../../components/ui/Toast";
import { StatCardsLoader, TableLoader } from "../../components/ui/Loading";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid from "../../components/ui/StatsGrid";
import Buttons from "../../components/ui/Buttons";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import AddEditModal from "../../components/modals/AddEditModal";
import DeleteModal from "../../components/modals/DeleteModal";
import ViewModal from "../../components/modals/ViewModal";
import useToast from "../../hooks/useToast";

const API_BASE = `${API_URL}/api`;


const formatDateDisplay = (dateStr) => {
  if (!dateStr || dateStr === "-") return "—";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const getStatus = (qty, threshold = 5) =>
  qty === 0 ? "Out of Stock" : qty <= threshold ? "Low Stock" : "In Stock";
const getColor = (qty, threshold = 5) =>
  qty === 0 ? "red" : qty <= threshold ? "yellow" : "emerald";

const StatusBadge = ({ qty, threshold }) => {
  const color = getColor(qty, threshold);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
      color === "red"    ? "bg-red-100 text-red-600"
      : color === "yellow" ? "bg-yellow-100 text-yellow-600"
      : "bg-emerald-100 text-emerald-600"
    }`}>{getStatus(qty, threshold)}</span>
  );
};


const PwdDropdown = ({ pwdList, value, onChange, placeholder = "Search PWD..." }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = pwdList.find(p => String(p.pwd_id) === String(value));

  const filtered = pwdList.filter(p =>
    p.full_name?.toLowerCase().includes(query.toLowerCase()) ||
    p.pwd_number?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:text-white cursor-pointer flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className={selected ? "text-slate-900 dark:text-white" : "text-slate-400"}>
          {selected ? `${selected.pwd_number} — ${selected.full_name}` : placeholder}
        </span>
        <span className="material-symbols-outlined text-slate-400 text-base">expand_more</span>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name or PWD number..."
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4">No PWD found</p>
            ) : filtered.map(p => (
              <div
                key={p.pwd_id}
                onClick={() => { onChange(p.pwd_id); setOpen(false); setQuery(""); }}
                className="px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
              >
                <span className="font-medium text-slate-900 dark:text-white">{p.full_name}</span>
                <span className="text-xs text-slate-400 font-mono">{p.pwd_number}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── INVENTORY TAB ─────────────────────────────────────────────────────────────
const InventoryTab = ({ inventoryItems, error, onRefresh, pageLoading }) => {
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
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      const url    = modal.type === "add" ? `${API_BASE}/inventory` : `${API_BASE}/inventory/${modal.item.inventory_id}`;
      const method = modal.type === "add" ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to save item");
      await onRefresh();
      setModal({ type: null, item: null });
      showToast(modal.type === "add" ? "Item added!" : "Item updated!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save.", "error");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory/${modal.item.inventory_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await onRefresh();
      setModal({ type: null, item: null });
      showToast("Item deleted!", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete.", "error");
    }
  };

  const renderRow = (item) => (
    <tr key={item.inventory_id} className="text-center align-middle hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 font-mono text-xs text-primary font-bold">{item.inventory_id}</td>
      <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white text-sm whitespace-nowrap">{item.item_name}</td>
      <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">{item.category}</td>
      <td className="px-3 py-2.5 text-sm font-medium">{item.quantity}</td>
      <td className="px-3 py-2.5 text-sm">{item.unit || "—"}</td>
      <td className="px-3 py-2.5"><StatusBadge qty={item.quantity} threshold={item.low_stock_threshold} /></td>
      <td className="px-3 py-2.5">
        <div className="flex justify-center gap-1">
          <button onClick={() => setModal({ type: "view", item })} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          <button onClick={() => setModal({ type: "edit", item })} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button onClick={() => setModal({ type: "delete", item })} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = (item) => (
    <div key={item.inventory_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
      <div className="flex justify-between items-start gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.item_name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
        </div>
        <StatusBadge qty={item.quantity} threshold={item.low_stock_threshold} />
      </div>
      <div className="flex gap-4 mb-2.5">
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Qty</p><p className="text-sm font-bold dark:text-white">{item.quantity}</p></div>
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Unit</p><p className="text-xs text-slate-600 dark:text-slate-400">{item.unit || "—"}</p></div>
      </div>
      <div className="flex gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-700">
        {["view","edit","delete"].map(action => (
          <button key={action} onClick={() => setModal({ type: action, item })}
            className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg capitalize transition-all">
            {action}
          </button>
        ))}
      </div>
    </div>
  );

  const ItemForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {[
        { name: "item_name", label: "Item Name", placeholder: "e.g. Folding Wheelchair", val: modal.item?.item_name },
        { name: "category",  label: "Category",  placeholder: "e.g. Wheelchair",         val: modal.item?.category },
        { name: "unit",      label: "Unit",       placeholder: "e.g. pcs, box, pair",    val: modal.item?.unit },
      ].map(f => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase">{f.label}</label>
          <input name={f.name} placeholder={f.placeholder} defaultValue={f.val || ""} required={f.name !== "unit"}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-500 uppercase">Quantity</label>
        <input name="quantity" type="number" min="0" defaultValue={modal.item?.quantity || 0} required
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={() => setModal({ type: null, item: null })} className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-white">Cancel</button>
        <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold">
          {modal.type === "add" ? "Add" : "Save"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <SearchBar searchValue={search} setSearchValue={(v) => { setSearch(v); setCurrentPage(1); }}
            filterValue={filterStatus} setFilterValue={(v) => { setFilterStatus(v); setCurrentPage(1); }}
            placeholder="Search by name or ID..."
            options={[{ value: "all", label: "All" }, { value: "low", label: "Low Stock" }, { value: "out", label: "Out of Stock" }]} />
        </div>
        <Buttons variant="primary" onClick={() => setModal({ type: "add", item: null })} className="flex items-center justify-center w-full sm:w-auto">Add Item</Buttons>
      </div>

      {pageLoading ? (
        <TableLoader rows={6} cols={7} />
      ) : (
      <DataTable columns={["ID", "Item Name", "Category", "Quantity", "Unit", "Status", "Actions"]}
        data={paginated} renderRow={renderRow} renderCard={renderCard} empty="No items found."
        pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={p => setCurrentPage(p)} />} /> )};

      {modal.type === "view" && (
        <ViewModal title="Item Details" icon="inventory"
          data={{ "Item Name": modal.item.item_name, "Category": modal.item.category, "Quantity": modal.item.quantity, "Unit": modal.item.unit || "—", "Status": getStatus(modal.item.quantity, modal.item.low_stock_threshold) }}
          onClose={() => setModal({ type: null, item: null })} />
      )}
      {(modal.type === "add" || modal.type === "edit") && (
        <AddEditModal isOpen isEdit={modal.type === "edit"} title="Item" icon="inventory" onCancel={() => setModal({ type: null, item: null })}>
          <ItemForm />
        </AddEditModal>
      )}
      {modal.type === "delete" && (
        <DeleteModal title="Delete Item" message="Are you sure you want to delete" subject={modal.item.item_name}
          confirmText="Delete" onConfirm={handleDelete} onCancel={() => setModal({ type: null, item: null })} />
      )}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
    </div>
  );
};

// ─── DONATIONS TAB ─────────────────────────────────────────────────────────────
const DonationsTab = ({ inventoryItems, onInventoryRefresh, pageLoading  }) => {
  const [donations, setDonations]       = useState([]);
  const { toasts, showToast, removeToast } = useToast();
  const [modal, setModal]               = useState({ type: null, data: null });
  const [submitting, setSubmitting]     = useState(false);
  const [search, setSearch]             = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 6;

  const fetchDonations = async () => {
    try {
      const res = await fetch(`${API_BASE}/donations`);
      setDonations(await res.json());
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchDonations(); }, []);

  const closeModal = () => setModal({ type: null, data: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = { donor_name: form.donor_name.value, Item_id: parseInt(form.Item_id.value), category: form.category.value, quantity: parseInt(form.quantity.value), donations_date: form.donations_date.value };
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/donations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to record donation");
      await fetchDonations(); await onInventoryRefresh();
      showToast("Donation recorded!", "success"); closeModal();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = { donor_name: form.donor_name.value, Item_id: parseInt(form.Item_id.value), category: form.category.value, quantity: parseInt(form.quantity.value), donations_date: form.donations_date.value };
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/donations/${modal.data.donation_id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to update donation");
      await fetchDonations(); await onInventoryRefresh();
      showToast("Donation updated!", "success"); closeModal();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await fetch(`${API_BASE}/donations/${modal.data.donation_id}`, { method: "DELETE" });
      await fetchDonations(); await onInventoryRefresh();
      showToast("Donation deleted!", "success"); closeModal();
    } catch (err) { showToast(err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const filtered = donations.filter(d =>
    (filterCategory === "all" || (d.category || "").toLowerCase() === filterCategory.toLowerCase()) &&
    ((d.donor_name || "").toLowerCase().includes(search.toLowerCase()) || (d.item_name || "").toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderRow = (d, i) => (
    <tr key={d.donation_id || i} className="text-center align-middle hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 font-mono text-xs text-primary font-bold">{d.donation_id}</td>
      <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-white text-sm whitespace-nowrap">{d.donor_name}</td>
      <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">{d.item_name}</td>
      <td className="px-3 py-2.5 text-sm font-medium text-center">{d.quantity}</td>
      <td className="px-3 py-2.5 text-sm whitespace-nowrap">{formatDateDisplay(d.donations_date)}</td>
      <td className="px-3 py-2.5 text-sm text-slate-500">{d.category || "—"}</td>
      <td className="px-3 py-2.5">
        <div className="flex justify-center gap-1">
          <button onClick={() => setModal({ type: "view", data: d })} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          <button onClick={() => setModal({ type: "edit", data: d })} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button onClick={() => setModal({ type: "delete", data: d })} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = (d, i) => (
    <div key={d.donation_id || i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm dark:text-white truncate">{d.donor_name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{d.item_name}</p>
        </div>
        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">#{d.donation_id}</span>
      </div>
      <div className="flex gap-4 mb-2.5">
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Qty</p><p className="text-sm font-bold dark:text-white">{d.quantity}</p></div>
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Category</p><p className="text-xs text-slate-600 dark:text-slate-400">{d.category || "—"}</p></div>
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Date</p><p className="text-xs text-slate-600 dark:text-slate-400">{formatDateDisplay(d.donations_date)}</p></div>
      </div>
      <div className="flex gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-700">
        <button onClick={() => setModal({ type: "view", data: d })} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">View</button>
        <button onClick={() => setModal({ type: "edit", data: d })} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">Edit</button>
        <button onClick={() => setModal({ type: "delete", data: d })} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">Delete</button>
      </div>
    </div>
  );

  const DonationForm = () => (
    <form onSubmit={modal.type === "edit" ? handleEdit : handleSubmit} className="flex flex-col gap-3">
      {[
        { name: "donor_name", label: "Donor Name", placeholder: "e.g. DSWD Regional Office", defaultVal: modal.data?.donor_name },
        { name: "category",   label: "Category",   placeholder: "e.g. Medicine, Wheelchair",   defaultVal: modal.data?.category },
      ].map(f => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase">{f.label}</label>
          <input name={f.name} placeholder={f.placeholder} defaultValue={f.defaultVal || ""} required className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-500 uppercase">Item</label>
        <select name="Item_id" required defaultValue={modal.data?.Item_id || ""} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">
          <option value="">— Select Item —</option>
          {inventoryItems.map(item => <option key={item.inventory_id} value={item.inventory_id}>{item.item_name}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-500 uppercase">Quantity</label>
        <input name="quantity" type="number" min="1" placeholder="0" defaultValue={modal.data?.quantity || ""} required className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-500 uppercase">Donation Date</label>
        <input name="donations_date" type="date" defaultValue={modal.data?.donations_date ? modal.data.donations_date.slice(0,10) : ""} required className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={closeModal} className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-white">Cancel</button>
        <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60">
          {submitting ? "Saving..." : "Record Donation"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <SearchBar searchValue={search} setSearchValue={(v) => { setSearch(v); setCurrentPage(1); }}
            filterValue={filterCategory} setFilterValue={(v) => { setFilterCategory(v); setCurrentPage(1); }}
            placeholder="Search by donor or item..."
            options={[{ value: "all", label: "All Categories" }, { value: "medicine", label: "Medicine" }, { value: "wheelchair", label: "Wheelchair" }, { value: "equipment", label: "Equipment" }, { value: "food", label: "Food" }, { value: "clothing", label: "Clothing" }]} />
        </div>
        <Buttons variant="primary" onClick={() => setModal({ type: "add", data: null })} className="flex items-center justify-center w-full sm:w-auto">Record Donation</Buttons>
      </div>

      {pageLoading ? (
        <TableLoader rows={6} cols={8} />
      ) : (
        <DataTable columns={["#", "Donor Name", "Item", "Quantity", "Date", "Category", "Actions"]}
          data={paginated} renderRow={renderRow} renderCard={renderCard} empty="No donations recorded yet."
          pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={p => setCurrentPage(p)} />} />
      )};

      {modal.type === "view" && (
        <ViewModal title="Donation Details" icon="volunteer_activism"
          data={{
            "Donation ID": modal.data.donation_id,
            "Donor Name":  modal.data.donor_name,
            "Item":        modal.data.item_name,
            "Category":    modal.data.category || "—",
            "Quantity":    modal.data.quantity,
            "Date":        formatDateDisplay(modal.data.donations_date),
          }}
          onClose={closeModal} />
      )}
      {modal.type === "add" && (
        <AddEditModal isOpen isEdit={false} title="Donation" icon="volunteer_activism" onCancel={closeModal}>
          <DonationForm />
        </AddEditModal>
      )}
      {modal.type === "edit" && (
        <AddEditModal isOpen isEdit={true} title="Donation" icon="volunteer_activism" onCancel={closeModal}>
          <DonationForm />
        </AddEditModal>
      )}
      {modal.type === "delete" && (
        <DeleteModal title="Delete Donation" message="Are you sure you want to delete donation from" subject={modal.data.donor_name}
          confirmText={submitting ? "Deleting..." : "Delete"} onConfirm={handleDelete} onCancel={closeModal} />
      )}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// ─── DISTRIBUTION TAB ──────────────────────────────────────────────────────────
const DistributionTab = ({ inventoryItems, onInventoryRefresh, pageLoading }) => {
  const [distributions, setDistributions] = useState([]);
  const [pwdList, setPwdList]             = useState([]); 
  const [selectedPwdId, setSelectedPwdId] = useState("");
  const { toasts, showToast, removeToast } = useToast();
  const [modal, setModal]                 = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [search, setSearch]               = useState("");
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage = 6;

  const fetchDistributions = async () => {
    try {
      const res = await fetch(`${API_BASE}/distribution`);
      setDistributions(await res.json());
    } catch (err) { console.error(err); }
  };


  const fetchPwdList = async () => {
    try {
      const res = await fetch(`${API_BASE}/pwd`);
      const data = await res.json();
      setPwdList(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDistributions(); fetchPwdList(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      beneficiary_id: parseInt(selectedPwdId),
      item_id:        parseInt(form.item_id.value),
      quantity:       parseInt(form.quantity.value),
      release_date:   form.release_date.value,
      remarks:        form.remarks.value,
    };
    if (!payload.beneficiary_id) { showToast("Please select a PWD beneficiary.", "error"); return; }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/distribution`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to release");
      await fetchDistributions(); await onInventoryRefresh();
      setModal(false); setSelectedPwdId("");
      showToast("Assistance released!", "success");
    } catch (err) { showToast(err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const filtered = distributions.filter(d =>
    (d.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.item_name || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderRow = (d, i) => (
    <tr key={d.assistance_id || i} className="text-center align-middle hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 font-mono text-xs text-primary font-bold">{d.assistance_id}</td>
      <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-white text-sm whitespace-nowrap">{d.full_name || `PWD #${d.beneficiary_id}`}</td>
      <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">{d.item_name}</td>
      <td className="px-3 py-2.5 text-sm font-medium text-center">{d.quantity}</td>
      <td className="px-3 py-2.5 text-sm whitespace-nowrap">{formatDateDisplay(d.release_date)}</td>
      <td className="px-3 py-2.5 text-sm text-slate-500">{d.remarks || "—"}</td>
    </tr>
  );

  const renderCard = (d, i) => (
    <div key={d.assistance_id || i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm dark:text-white truncate">{d.full_name || `PWD #${d.beneficiary_id}`}</p>
          <p className="text-xs text-slate-500 mt-0.5">{d.item_name}</p>
        </div>
        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">#{d.assistance_id}</span>
      </div>
      <div className="flex gap-4 flex-wrap">
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Qty</p><p className="text-sm font-bold dark:text-white">{d.quantity}</p></div>
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Date</p><p className="text-xs text-slate-600 dark:text-slate-400">{formatDateDisplay(d.release_date)}</p></div>
        {d.remarks && <div className="flex-1"><p className="text-[9px] text-slate-400 uppercase font-bold">Remarks</p><p className="text-xs text-slate-600 dark:text-slate-400 truncate">{d.remarks}</p></div>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <SearchBar searchValue={search} setSearchValue={(v) => { setSearch(v); setCurrentPage(1); }}
            placeholder="Search by beneficiary or item..." options={[{ value: "all", label: "All" }]}
            filterValue="all" setFilterValue={() => {}} />
        </div>
        <Buttons variant="primary" onClick={() => setModal(true)} className="flex items-center justify-center w-full sm:w-auto">Release Assistance</Buttons>
      </div>

      {pageLoading ? (
        <TableLoader rows={6} cols={6} />
      ) : (
        <DataTable columns={["#", "Beneficiary", "Item Released", "Quantity", "Release Date", "Remarks"]}
          data={paginated} renderRow={renderRow} renderCard={renderCard} empty="No distributions recorded yet."
          pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={p => setCurrentPage(p)} />} />
      )};

      {modal && (
        <AddEditModal isOpen isEdit={false} title="Release Assistance" icon="local_shipping" onCancel={() => { setModal(false); setSelectedPwdId(""); }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">PWD Beneficiary</label>
              <PwdDropdown
                pwdList={pwdList}
                value={selectedPwdId}
                onChange={setSelectedPwdId}
                placeholder="Search PWD name or number..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Item</label>
              <select name="item_id" required className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white">
                <option value="">— Select Item —</option>
                {inventoryItems.map(item => (
                  <option key={item.inventory_id} value={item.inventory_id}>{item.item_name} (Stock: {item.quantity})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Quantity</label>
              <input name="quantity" type="number" min="1" placeholder="0" required className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Release Date</label>
              <input name="release_date" type="date" required className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase">Remarks</label>
              <textarea name="remarks" rows={2} placeholder="Optional notes..." className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 rounded-xl px-3 py-2.5 text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Stock will automatically be deducted upon release.
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => { setModal(false); setSelectedPwdId(""); }} className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-white">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60">
                {submitting ? "Releasing..." : "Release"}
              </button>
            </div>
          </form>
        </AddEditModal>
      )}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const AdminInventoryPage = () => {
  const [activeTab, setActiveTab]         = useState("inventory");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [donations, setDonations]         = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [tabLoading, setTabLoading] = useState("");
  const [loading, setLoading]             = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [invRes, donRes, distRes] = await Promise.all([
        fetch(`${API_BASE}/inventory`),
        fetch(`${API_BASE}/donations`),
        fetch(`${API_BASE}/distribution`),
      ]);
      setInventoryItems(await invRes.json());
      setDonations(await donRes.json());
      setDistributions(await distRes.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);


  const statsdata = [
    { label: "Total Items", icon: "inventory", value: inventoryItems.length, changeText: "in stock", changeClass: "text-emerald-600" },
    { label: "Total Donations", icon: "volunteer_activism", value: donations.length, changeText: "recorded", changeClass: "text-blue-600" },
    { label: "Total Distributions", icon: "local_shipping", value: distributions.length, changeText: "released", changeClass: "text-violet-600" },
    { label: "Low Stock", icon: "warning", value: inventoryItems.filter(i => i.quantity > 0 && i.quantity <= (i.low_stock_threshold || 5)).length, changeText: "need restocking", changeClass: "text-yellow-600" },
    { label: "Out of Stock", icon: "block", value: inventoryItems.filter(i => i.quantity === 0).length, changeText: "unavailable", changeClass: "text-red-600" },
  ];

  const tabs = [
    { key: "inventory",    label: "Inventory",    icon: "inventory" },
    { key: "donations",    label: "Donations",    icon: "volunteer_activism" },
    { key: "distribution", label: "Distribution", icon: "local_shipping" },
  ];

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-xl sm:text-3xl font-black leading-tight tracking-tight">Inventory & Donations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Manage supplies, track donations, and release assistance to PWD beneficiaries.</p>
        </div>
      </div>

      {loading ? <StatCardsLoader count={5} /> : (
        <StatsGrid>
          {statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}
        </StatsGrid>
      )}

      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setTabLoading(tab.key);
              setTimeout(() => setTabLoading(""), 1200);
              setActiveTab(tab.key);
            }}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition-all border-b-2 -mb-px whitespace-nowrap flex-shrink-0 ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {(tabLoading === "inventory" || activeTab === "inventory") && (
        <InventoryTab inventoryItems={inventoryItems} onRefresh={fetchAll} pageLoading={tabLoading === "inventory" || loading} />
      )}
      {(tabLoading === "donations" || activeTab === "donations") && (
        <DonationsTab inventoryItems={inventoryItems} onInventoryRefresh={fetchAll} pageLoading={tabLoading === "donations"} />
      )}
      {(tabLoading === "distribution" || activeTab === "distribution") && (
        <DistributionTab inventoryItems={inventoryItems} onInventoryRefresh={fetchAll} pageLoading={tabLoading === "distribution"} />
      )}
    </div>
  );
};

export default AdminInventoryPage;
