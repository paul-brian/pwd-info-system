import { useState, useEffect } from "react";
import API_URL from "../../api/api";
import axios from "axios";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid from "../../components/ui/StatsGrid";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import AddEditModal from "../../components/modals/AddEditModal";
import DeleteModal from "../../components/modals/DeleteModal";
import ViewModal from "../../components/modals/ViewModal";

const API_BASE = `${API_URL}/api/health`;

const mapRecord = (r) => ({
  id: r.health_id,
  pwd_id: r.pwd_id,
  name: r.name || `PWD-${r.pwd_id}`,
  zone: r.zone || "—",
  date: r.recorded_at ? r.recorded_at.slice(0, 10) : "—",
  status: r.health_status,
  color: r.health_status === "Critical" ? "red"
       : r.health_status === "Follow-up" ? "amber"
       : "green",
  vitals: `${r.blood_pressure} - ${r.weight}kg`,
  blood_pressure: r.blood_pressure,
  heart_rate: r.heart_rate,
  temperature: r.temperature,
  weight: r.weight,
  blood_sugar: r.blood_sugar ?? "",
  remarks: r.remarks ?? "",
  health_status: r.health_status,
  staff: r.staff || "—",
  staffImg: r.staffImg || "",
});

const statusColors = {
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  red:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const AdminHealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, record: null });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 8;

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(API_BASE);
      setRecords(data.map(mapRecord));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const closeModal = () => setModal({ type: null, record: null });

  // ── Filter & Paginate ──
  const filtered = records.filter(r => {
    const matchStatus = filterStatus === "all" || r.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchSearch =
      String(r.pwd_id).includes(search) ||
      (r.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.status || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.remarks || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRecords = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  // ── Stats ──
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  const criticalCases = records.filter(r => r.status === "Critical").length;
  const checkupsThisWeek = records.filter(r => { const d = new Date(r.date); return d >= oneWeekAgo && d <= today; }).length;
  const staffSet = new Set(records.map(r => r.staff));
  const activeStaffSet = new Set(records.filter(r => { const d = new Date(r.date); return d >= oneWeekAgo && d <= today; }).map(r => r.staff));
  const staffUtilization = staffSet.size ? Math.round((activeStaffSet.size / staffSet.size) * 100) : 0;

  const statsdata = [
    { label: "Critical Cases",     icon: "emergency",      value: criticalCases,          change: "", changeText: "active critical cases", changeClass: "text-red-600" },
    { label: "Checkups This Week", icon: "calendar_check", value: checkupsThisWeek,       change: "", changeText: "in the last 7 days",   changeClass: "text-primary" },
    { label: "Staff Utilization",  icon: "people",         value: `${staffUtilization}%`, change: "", changeText: "of staff active",      changeClass: "text-green-600" },
  ];

  // ── CRUD ──
  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`${API_BASE}/${modal.record.id}`);
      closeModal();
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.target;
    const body = {
      pwd_id:         parseInt(form.pwd_id.value),
      blood_pressure: form.blood_pressure.value,
      heart_rate:     parseInt(form.heart_rate.value),
      temperature:    parseFloat(form.temperature.value),
      weight:         parseFloat(form.weight.value),
      blood_sugar:    form.blood_sugar.value ? parseFloat(form.blood_sugar.value) : null,
      remarks:        form.remarks.value || null,
      health_status:  form.health_status.value,
    };
    try {
      if (modal.type === "add") await axios.post(API_BASE, body);
      else await axios.put(`${API_BASE}/${modal.record.id}`, body);
      closeModal();
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Desktop row ──
  const renderRow = (record) => (
    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm font-medium text-primary">#{record.id}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm text-[#4e7397]">{record.pwd_id}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm font-mono">{record.blood_pressure}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm">{record.heart_rate} bpm</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm">{record.weight} kg</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm">{record.blood_sugar || "—"}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[record.color]}`}>
          {record.status}
        </span>
      </td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm text-[#4e7397] max-w-[160px] truncate" title={record.remarks}>
        {record.remarks || "—"}
      </td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-sm text-[#4e7397] whitespace-nowrap">{record.date}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setModal({ type: "view", record })}
            className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-[#4e7397]">
            <span className="material-symbols-outlined text-lg lg:text-xl">visibility</span>
          </button>
          <button onClick={() => setModal({ type: "edit", record })}
            className="p-1.5 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-[#4e7397]">
            <span className="material-symbols-outlined text-lg lg:text-xl">edit</span>
          </button>
          <button onClick={() => setModal({ type: "delete", record })}
            className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-[#4e7397]">
            <span className="material-symbols-outlined text-lg lg:text-xl">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );

  // ── Mobile card ──
  const renderCard = (record) => (
    <div key={record.id} className="bg-white dark:bg-slate-900 rounded-xl border border-[#d0dbe7] dark:border-slate-800 p-3 sm:p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#0e141b] dark:text-white">PWD #{record.pwd_id}</p>
          <p className="text-xs text-[#4e7397] mt-0.5">{record.date}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[record.color]}`}>
            {record.status}
          </span>
          <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded-md">#{record.id}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2.5">
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">BP</p><p className="text-xs font-mono font-semibold text-[#0e141b] dark:text-white">{record.blood_pressure}</p></div>
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">HR</p><p className="text-xs font-semibold text-[#0e141b] dark:text-white">{record.heart_rate} bpm</p></div>
        <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Weight</p><p className="text-xs font-semibold text-[#0e141b] dark:text-white">{record.weight} kg</p></div>
        {record.blood_sugar && (
          <div><p className="text-[9px] text-[#4e7397] uppercase font-bold">Blood Sugar</p><p className="text-xs font-semibold text-[#0e141b] dark:text-white">{record.blood_sugar}</p></div>
        )}
        {record.remarks && (
          <div className="col-span-3"><p className="text-[9px] text-[#4e7397] uppercase font-bold">Remarks</p><p className="text-xs text-slate-600 dark:text-slate-400 truncate">{record.remarks}</p></div>
        )}
      </div>
      <div className="flex gap-2 pt-2.5 border-t border-[#e7edf3] dark:border-slate-800">
        <button onClick={() => setModal({ type: "view", record })}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 text-[#4e7397] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm">
          <span className="material-symbols-outlined text-base">visibility</span>
          <span className="hidden sm:inline">View</span>
        </button>
        <button onClick={() => setModal({ type: "edit", record })}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 text-[#4e7397] hover:text-primary hover:bg-primary/10 rounded-lg transition-colors text-xs sm:text-sm">
          <span className="material-symbols-outlined text-base">edit</span>
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button onClick={() => setModal({ type: "delete", record })}
          className="flex-1 flex items-center justify-center gap-1.5 p-2 text-[#4e7397] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm">
          <span className="material-symbols-outlined text-base">delete</span>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );

  // ── Health Record Form ──
  const HealthForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {[
        { label: "PWD ID",             name: "pwd_id",         type: "number",               placeholder: "e.g. 1",      required: true },
        { label: "Blood Pressure",      name: "blood_pressure",                               placeholder: "e.g. 120/80", required: true },
        { label: "Heart Rate (bpm)",    name: "heart_rate",     type: "number",               placeholder: "e.g. 72",     required: true },
        { label: "Temperature (°C)",    name: "temperature",    type: "number", step: "0.01", placeholder: "e.g. 36.5",   required: true },
        { label: "Weight (kg)",         name: "weight",         type: "number", step: "0.01", placeholder: "e.g. 65.0",   required: true },
        { label: "Blood Sugar (mg/dL)", name: "blood_sugar",    type: "number", step: "0.01", placeholder: "Optional" },
        { label: "Remarks",             name: "remarks",                                      placeholder: "Optional" },
      ].map(({ label, name, ...props }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-[#4e7397] dark:text-slate-400 uppercase tracking-wider">{label}</label>
          <input name={name} defaultValue={modal.record?.[name] ?? ""}
            className="border border-[#d0dbe7] dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            {...props} />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] dark:text-slate-400 uppercase tracking-wider">Health Status</label>
        <select name="health_status" defaultValue={modal.record?.health_status || "Stable"}
          className="border border-[#d0dbe7] dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none">
          <option value="Stable">Stable</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-end gap-2 mt-2">
        <button type="button" onClick={closeModal}
          className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-slate-300">Cancel</button>
        <button type="submit" disabled={submitting}
          className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60">
          {submitting ? "Saving…" : modal.type === "add" ? "Add Record" : "Update Record"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
        bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent
        p-3 sm:p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#0e141b] dark:text-white leading-tight tracking-tight">
            Health Monitoring
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#4e7397] dark:text-slate-400">
            Manage and monitor PWD health records across the barangay
          </p>
        </div>
        <div className="flex-shrink-0">
          <button onClick={() => setModal({ type: "add", record: null })}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5
              bg-primary text-white rounded-xl text-xs sm:text-sm md:text-base font-bold
              shadow-md hover:bg-primary/90 transition-colors whitespace-nowrap w-full sm:w-auto">
            <span className="material-symbols-outlined text-sm sm:text-base">add</span>
            Record New Checkup
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
          {error} — <button onClick={fetchRecords} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* ── Stats ── */}
      <StatsGrid>
        {statsdata.map((stat, idx) => (
          <StatsCards key={idx} stat={stat} />
        ))}
      </StatsGrid>

      {/* ── SearchBar ── */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
          <SearchBar
            searchValue={search}
            setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
            filterValue={filterStatus}
            setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
            placeholder="Search by PWD ID, name, or remarks..."
            options={[
              { value: "all",       label: "All Status" },
              { value: "Stable",    label: "Stable" },
              { value: "Follow-up", label: "Follow-up" },
              { value: "Critical",  label: "Critical" },
            ]}
          />
        </div>
      </div>

      {/* ── DataTable ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#4e7397] gap-3">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-sm">Loading records…</span>
        </div>
      ) : (
        <DataTable
          columns={["Health ID", "PWD ID", "Blood Pressure", "Heart Rate", "Weight", "Blood Sugar", "Status", "Remarks", "Date", "Actions"]}
          data={paginatedRecords}
          renderRow={renderRow}
          renderCard={renderCard}
          empty="No health records found."
          pagination={
            totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
              />
            ) : null
          }
        />
      )}

      {/* ── View Modal ── */}
      {modal.type === "view" && (
        <ViewModal
          title="Health Record" icon="monitor_heart"
          data={{
            "Health ID":    `#${modal.record.id}`,
            "PWD ID":       modal.record.pwd_id,
            "Blood Pressure": modal.record.blood_pressure,
            "Heart Rate":   `${modal.record.heart_rate} bpm`,
            "Weight":       `${modal.record.weight} kg`,
            "Blood Sugar":  modal.record.blood_sugar || "—",
            "Status":       modal.record.status,
            "Remarks":      modal.record.remarks || "—",
            "Date":         modal.record.date,
          }}
          onClose={closeModal}
        />
      )}

      {/* ── Add Modal ── */}
      {modal.type === "add" && (
        <AddEditModal isOpen isEdit={false} title="Health Record" icon="monitor_heart" onCancel={closeModal}>
          <HealthForm />
        </AddEditModal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === "edit" && (
        <AddEditModal isOpen isEdit={true} title="Health Record" icon="monitor_heart" onCancel={closeModal}>
          <HealthForm />
        </AddEditModal>
      )}

      {/* ── Delete Modal ── */}
      {modal.type === "delete" && (
        <DeleteModal
          title="Delete Record"
          message="Are you sure you want to delete health record"
          subject={`#${modal.record.id}`}
          confirmText={submitting ? "Deleting…" : "Delete"}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default AdminHealthRecords;