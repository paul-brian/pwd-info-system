// import { useState, useEffect } from "react";
// import axios from "axios";
// import API_URL from "../../api/api";
// import { ToastContainer } from "../../components/ui/Toast";
// import { StatCardsLoader, TableLoader } from "../../components/ui/Loading";
// import StatsCards from "../../components/ui/StatsCards";
// import StatsGrid from "../../components/ui/StatsGrid";
// import Buttons from "../../components/ui/Buttons";
// import DataTable from "../../components/ui/DataTable";
// import Pagination from "../../components/ui/Pagination";
// import SearchBar from "../../components/ui/SearchBar";
// import AddEditModal from "../../components/modals/AddEditModal";
// import DeleteModal from "../../components/modals/DeleteModal";
// import ViewModal from "../../components/modals/ViewModal";
// import useToast from "../../hooks/useToast";

// const API_BASE = `${API_URL}/api/health`;
// const PWD_API  = `${API_URL}/api/pwd`;

// // ✅ Proper date format: March 1, 2026
// const formatDateDisplay = (dateStr) => {
//   if (!dateStr || dateStr === "—") return "—";
//   const date = new Date(dateStr);
//   if (isNaN(date)) return dateStr;
//   return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
// };

// const mapRecord = (r) => ({
//   id:             r.health_id,
//   pwd_id:         r.pwd_id,
//   pwd_number:     r.pwd_number || `PWD-${r.pwd_id}`, // ✅ use pwd_number
//   name:           r.name || `PWD-${r.pwd_id}`,
//   date:           r.recorded_at ? r.recorded_at.slice(0, 10) : "—",
//   status:         r.health_status,
//   color:          r.health_status === "Critical" ? "red" : r.health_status === "Follow-up" ? "amber" : "green",
//   blood_pressure: r.blood_pressure,
//   heart_rate:     r.heart_rate,
//   temperature:    r.temperature,
//   weight:         r.weight,
//   blood_sugar:    r.blood_sugar ?? "",
//   remarks:        r.remarks ?? "",
//   health_status:  r.health_status,
// });

// const statusColors = {
//   green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//   amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
//   red:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
// };

// // ✅ PWD Searchable Dropdown
// const PwdDropdown = ({ pwdList, value, onChange }) => {
//   const [query, setQuery]   = useState("");
//   const [open, setOpen]     = useState(false);
//   const selected = pwdList.find(p => String(p.pwd_id) === String(value));

//   const filtered = pwdList.filter(p =>
//     p.full_name?.toLowerCase().includes(query.toLowerCase()) ||
//     p.pwd_number?.toLowerCase().includes(query.toLowerCase())
//   );

//   return (
//     <div className="relative">
//       <div
//         onClick={() => setOpen(!open)}
//         className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 cursor-pointer flex items-center justify-between"
//       >
//         <span className={selected ? "text-slate-900 dark:text-white" : "text-slate-400"}>
//           {selected ? `${selected.pwd_number} — ${selected.full_name}` : "Search PWD number or name..."}
//         </span>
//         <span className="material-symbols-outlined text-slate-400 text-base">expand_more</span>
//       </div>

//       {open && (
//         <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
//           <div className="p-2 border-b border-slate-100 dark:border-slate-700">
//             <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
//               placeholder="Search name or PWD number..."
//               className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/30" />
//           </div>
//           <div className="max-h-48 overflow-y-auto">
//             {filtered.length === 0 ? (
//               <p className="text-center text-xs text-slate-400 py-4">No PWD found</p>
//             ) : filtered.map(p => (
//               <div key={p.pwd_id} onClick={() => { onChange(p.pwd_id); setOpen(false); setQuery(""); }}
//                 className="px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between">
//                 <span className="font-medium text-slate-900 dark:text-white">{p.full_name}</span>
//                 <span className="text-xs text-slate-400 font-mono">{p.pwd_number}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const AdminHealthRecords = () => {
//   const [records, setRecords]           = useState([]);
//   const [pwdList, setPwdList]           = useState([]); // ✅ for dropdown
//   const [selectedPwdId, setSelectedPwdId] = useState("");
//   const [loading, setLoading]           = useState(true);
//   const { toasts, showToast, removeToast } = useToast();
//   const [currentPage, setCurrentPage]   = useState(1);
//   const [modal, setModal]               = useState({ type: null, record: null });
//   const [submitting, setSubmitting]     = useState(false);
//   const [search, setSearch]             = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const itemsPerPage = 6;

//   const fetchRecords = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(API_BASE);
//       setRecords(data.map(mapRecord));
//     } catch (err) {
//       showToast(err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch PWD list for dropdown
//   const fetchPwdList = async () => {
//     try {
//       const { data } = await axios.get(PWD_API);
//       setPwdList(data);
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { fetchRecords(); fetchPwdList(); }, []);

//   const closeModal = () => { setModal({ type: null, record: null }); setSelectedPwdId(""); };

//   // ✅ Fixed search — searches by pwd_number, name, status, remarks
//   const filtered = records.filter(r => {
//     const matchStatus = filterStatus === "all" || r.status?.toLowerCase() === filterStatus.toLowerCase();
//     const q = search.toLowerCase();
//     const matchSearch =
//       (r.pwd_number || "").toLowerCase().includes(q) ||
//       (r.name       || "").toLowerCase().includes(q) ||
//       (r.status     || "").toLowerCase().includes(q) ||
//       (r.remarks    || "").toLowerCase().includes(q);
//     return matchStatus && matchSearch;
//   });
//   const totalPages       = Math.ceil(filtered.length / itemsPerPage);
//   const paginatedRecords = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
//   const goToPage         = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

//   // ✅ Stats — replaced Staff Utilization with Total Checkups
//   const today     = new Date();
//   const oneWeekAgo = new Date(); oneWeekAgo.setDate(today.getDate() - 7);
//   const criticalCases    = records.filter(r => r.status === "Critical").length;
//   const checkupsThisWeek = records.filter(r => { const d = new Date(r.date); return d >= oneWeekAgo && d <= today; }).length;

//   const statsdata = [
//     { label: "Total Checkups",     icon: "health_and_safety", value: records.length,         changeText: "all records",        changeClass: "text-primary"     },
//     { label: "Critical Cases",     icon: "emergency",         value: criticalCases,           changeText: "active critical",    changeClass: "text-red-600"     },
//     { label: "Checkups This Week", icon: "calendar_month",    value: checkupsThisWeek,        changeText: "in the last 7 days", changeClass: "text-emerald-600" },
//   ];

//   const handleDelete = async () => {
//     setSubmitting(true);
//     try {
//       await axios.delete(`${API_BASE}/${modal.record.id}`);
//       closeModal(); fetchRecords();
//       showToast("Health record deleted!", "success");
//     } catch (err) { showToast("Failed to delete.", "error"); }
//     finally { setSubmitting(false); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     const form = e.target;

//     if (!selectedPwdId) { showToast("Please select a PWD.", "error"); setSubmitting(false); return; }

//     const body = {
//       pwd_id:         parseInt(selectedPwdId),
//       blood_pressure: form.blood_pressure.value,
//       heart_rate:     parseInt(form.heart_rate.value),
//       temperature:    parseFloat(form.temperature.value),
//       weight:         parseFloat(form.weight.value),
//       blood_sugar:    form.blood_sugar.value ? parseFloat(form.blood_sugar.value) : null,
//       remarks:        form.remarks.value || null,
//       health_status:  form.health_status.value,
//     };
//     try {
//       if (modal.type === "add") await axios.post(API_BASE, body);
//       else await axios.put(`${API_BASE}/${modal.record.id}`, body);
//       closeModal(); fetchRecords();
//       showToast(modal.type === "add" ? "Record added!" : "Record updated!", "success");
//     } catch (err) { showToast(err.message, "error"); }
//     finally { setSubmitting(false); }
//   };

//   const columns = ["Health ID", "PWD Number", "Blood Pressure", "Heart Rate", "Weight", "Blood Sugar", "Status", "Remarks", "Date", "Actions"];

//   const renderRow = (record) => (
//     <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
//       <td className="px-3 py-2.5 text-sm font-medium text-primary">#{record.id}</td>
//       {/* ✅ Show pwd_number instead of pwd_id */}
//       <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{record.pwd_number}</td>
//       <td className="px-3 py-2.5 text-sm font-mono whitespace-nowrap">{record.blood_pressure}</td>
//       <td className="px-3 py-2.5 text-sm whitespace-nowrap">{record.heart_rate} bpm</td>
//       <td className="px-3 py-2.5 text-sm whitespace-nowrap">{record.weight} kg</td>
//       <td className="px-3 py-2.5 text-sm">{record.blood_sugar || "—"}</td>
//       <td className="px-3 py-2.5">
//         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[record.color]}`}>
//           {record.status}
//         </span>
//       </td>
//       <td className="px-3 py-2.5 text-sm text-slate-500 max-w-[140px] truncate">{record.remarks || "—"}</td>
//       {/* ✅ Fixed date format */}
//       <td className="px-3 py-2.5 text-sm text-slate-500 whitespace-nowrap">{formatDateDisplay(record.date)}</td>
//       <td className="px-3 py-2.5">
//         <div className="flex gap-1">
//           <button onClick={() => setModal({ type: "view", record })}
//             className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
//             <span className="material-symbols-outlined text-base">visibility</span>
//           </button>
//           <button onClick={() => { setSelectedPwdId(record.pwd_id); setModal({ type: "edit", record }); }}
//             className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
//             <span className="material-symbols-outlined text-base">edit</span>
//           </button>
//           <button onClick={() => setModal({ type: "delete", record })}
//             className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
//             <span className="material-symbols-outlined text-base">delete</span>
//           </button>
//         </div>
//       </td>
//     </tr>
//   );

//   const renderCard = (record) => (
//     <div key={record.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
//       <div className="flex items-start justify-between gap-2 mb-2.5">
//         <div className="flex-1 min-w-0">
//           {/* ✅ Show pwd_number */}
//           <p className="font-bold text-sm dark:text-white">{record.pwd_number}</p>
//           <p className="text-xs text-slate-500 mt-0.5">{formatDateDisplay(record.date)}</p>
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[record.color]}`}>
//             {record.status}
//           </span>
//           <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">#{record.id}</span>
//         </div>
//       </div>
//       <div className="grid grid-cols-3 gap-2 mb-2.5">
//         <div><p className="text-[9px] text-slate-400 uppercase font-bold">BP</p><p className="text-xs font-mono font-semibold dark:text-white">{record.blood_pressure}</p></div>
//         <div><p className="text-[9px] text-slate-400 uppercase font-bold">HR</p><p className="text-xs font-semibold dark:text-white">{record.heart_rate} bpm</p></div>
//         <div><p className="text-[9px] text-slate-400 uppercase font-bold">Weight</p><p className="text-xs font-semibold dark:text-white">{record.weight} kg</p></div>
//         {record.blood_sugar && (
//           <div><p className="text-[9px] text-slate-400 uppercase font-bold">Blood Sugar</p><p className="text-xs font-semibold dark:text-white">{record.blood_sugar}</p></div>
//         )}
//         {record.remarks && (
//           <div className="col-span-3"><p className="text-[9px] text-slate-400 uppercase font-bold">Remarks</p><p className="text-xs text-slate-600 dark:text-slate-400 truncate">{record.remarks}</p></div>
//         )}
//       </div>
//       <div className="flex gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-700">
//         <button onClick={() => setModal({ type: "view", record })} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">View</button>
//         <button onClick={() => { setSelectedPwdId(record.pwd_id); setModal({ type: "edit", record }); }} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg">Edit</button>
//         <button onClick={() => setModal({ type: "delete", record })} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
//       </div>
//     </div>
//   );

//   const inputClass = "border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

//   const HealthForm = () => (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//       {/* ✅ PWD Number Searchable Dropdown */}
//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PWD Number *</label>
//         <PwdDropdown pwdList={pwdList} value={selectedPwdId} onChange={setSelectedPwdId} />
//       </div>

//       {[
//         { label: "Blood Pressure",      name: "blood_pressure",                               placeholder: "e.g. 120/80", required: true },
//         { label: "Heart Rate (bpm)",    name: "heart_rate",     type: "number",               placeholder: "e.g. 72",     required: true },
//         { label: "Temperature (°C)",    name: "temperature",    type: "number", step: "0.01", placeholder: "e.g. 36.5",   required: true },
//         { label: "Weight (kg)",         name: "weight",         type: "number", step: "0.01", placeholder: "e.g. 65.0",   required: true },
//         { label: "Blood Sugar (mg/dL)", name: "blood_sugar",    type: "number", step: "0.01", placeholder: "Optional" },
//         { label: "Remarks",             name: "remarks",                                      placeholder: "Optional" },
//       ].map(({ label, name, ...props }) => (
//         <div key={name} className="flex flex-col gap-1">
//           <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
//           <input name={name} defaultValue={modal.record?.[name] ?? ""} className={inputClass} {...props} />
//         </div>
//       ))}

//       <div className="flex flex-col gap-1">
//         <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Health Status</label>
//         <select name="health_status" defaultValue={modal.record?.health_status || "Stable"} className={inputClass + " appearance-none"}>
//           <option value="Stable">Stable</option>
//           <option value="Follow-up">Follow-up</option>
//           <option value="Critical">Critical</option>
//         </select>
//       </div>

//       <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-2">
//         <button type="button" onClick={closeModal} className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-slate-300">Cancel</button>
//         <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60">
//           {submitting ? "Saving…" : modal.type === "add" ? "Add Record" : "Update Record"}
//         </button>
//       </div>
//     </form>
//   );

//   return (
//     <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
//          bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">Health Monitoring</h1>
//           <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage and monitor PWD health records across the barangay</p>
//         </div>
//         <Buttons variant="primary" onClick={() => { setSelectedPwdId(""); setModal({ type: "add", record: null }); }} className="flex items-center justify-center w-full sm:w-auto">
//           Record New Checkup
//         </Buttons>
//       </div>

//       {/* ── Stats ── */}
//       {loading ? <StatCardsLoader count={3} /> : (
//         <StatsGrid>
//           {statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}
//         </StatsGrid>
//       )}

//       {/* ── Search ── */}
//       <SearchBar
//         searchValue={search}
//         setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
//         filterValue={filterStatus}
//         setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
//         placeholder="Search by PWD number, name, status, or remarks..."
//         options={[
//           { value: "all",       label: "All Status" },
//           { value: "Stable",    label: "Stable" },
//           { value: "Follow-up", label: "Follow-up" },
//           { value: "Critical",  label: "Critical" },
//         ]}
//       />

//       {/* ── Table ── */}
//       {loading ? (
//         <TableLoader rows={6} cols={columns.length} />
//       ) : (
//         <DataTable
//           columns={columns}
//           data={paginatedRecords}
//           renderRow={renderRow}
//           renderCard={renderCard}
//           empty="No health records found."
//           pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={goToPage} />}
//         />
//       )}

//       {/* ── View Modal ── ✅ pwd_number + formatted date */}
//       {modal.type === "view" && (
//         <ViewModal title="Health Record" icon="monitor_heart"
//           data={{
//             "Health ID":      `#${modal.record.id}`,
//             "PWD Number":     modal.record.pwd_number,
//             "Blood Pressure": modal.record.blood_pressure,
//             "Heart Rate":     `${modal.record.heart_rate} bpm`,
//             "Weight":         `${modal.record.weight} kg`,
//             "Blood Sugar":    modal.record.blood_sugar || "—",
//             "Status":         modal.record.status,
//             "Remarks":        modal.record.remarks || "—",
//             "Date":           formatDateDisplay(modal.record.date),
//           }}
//           onClose={closeModal} />
//       )}

//       {/* ── Add Modal ── */}
//       {modal.type === "add" && (
//         <AddEditModal isOpen isEdit={false} title="Health Record" icon="monitor_heart" onCancel={closeModal}>
//           <HealthForm />
//         </AddEditModal>
//       )}

//       {/* ── Edit Modal ── */}
//       {modal.type === "edit" && (
//         <AddEditModal isOpen isEdit={true} title="Health Record" icon="monitor_heart" onCancel={closeModal}>
//           <HealthForm />
//         </AddEditModal>
//       )}

//       {/* ── Delete Modal ── ✅ pwd_number instead of pwd_id */}
//       {modal.type === "delete" && (
//         <DeleteModal
//           title="Delete Health Record"
//           message="Are you sure you want to delete health record for"
//           subject={modal.record.pwd_number}
//           confirmText={submitting ? "Deleting…" : "Delete"}
//           onConfirm={handleDelete}
//           onCancel={closeModal}
//         />
//       )}

//       <ToastContainer toasts={toasts} removeToast={removeToast} />
//     </div>
//   );
// };

// export default AdminHealthRecords;
import { useState, useEffect } from "react";
import axios from "axios";
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

const API_BASE = `${API_URL}/api/health`;
const PWD_API  = `${API_URL}/api/pwd`;

// ✅ Proper date format: March 1, 2026
const formatDateDisplay = (dateStr) => {
  if (!dateStr || dateStr === "—") return "—";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const mapRecord = (r) => ({
  id:             r.health_id,
  pwd_id:         r.pwd_id,
  pwd_number:     r.pwd_number || "",
  pwd_name:       r.pwd_name  || "",  // ✅ full_name from user table
  date:           r.recorded_at ? r.recorded_at.slice(0, 10) : "—",
  status:         r.health_status,
  color:          r.health_status === "Critical" ? "red" : r.health_status === "Follow-up" ? "amber" : "green",
  blood_pressure: r.blood_pressure,
  heart_rate:     r.heart_rate,
  temperature:    r.temperature,
  weight:         r.weight,
  blood_sugar:    r.blood_sugar ?? "",
  remarks:        r.remarks ?? "",
  health_status:  r.health_status,
});

const statusColors = {
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  red:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

// ✅ PWD Searchable Dropdown
const PwdDropdown = ({ pwdList, value, onChange }) => {
  const [query, setQuery]   = useState("");
  const [open, setOpen]     = useState(false);
  const selected = pwdList.find(p => String(p.pwd_id) === String(value));

  const filtered = pwdList.filter(p =>
    p.full_name?.toLowerCase().includes(query.toLowerCase()) ||
    p.pwd_number?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm dark:bg-slate-800 cursor-pointer flex items-center justify-between"
      >
        <span className={selected ? "text-slate-900 dark:text-white" : "text-slate-400"}>
          {selected ? `${selected.pwd_number} — ${selected.full_name}` : "Search PWD number or name..."}
        </span>
        <span className="material-symbols-outlined text-slate-400 text-base">expand_more</span>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search name or PWD number..."
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4">No PWD found</p>
            ) : filtered.map(p => (
              <div key={p.pwd_id} onClick={() => { onChange(p.pwd_id); setOpen(false); setQuery(""); }}
                className="px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between">
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

const AdminHealthRecords = () => {
  const [records, setRecords]           = useState([]);
  const [pwdList, setPwdList]           = useState([]); // ✅ for dropdown
  const [selectedPwdId, setSelectedPwdId] = useState("");
  const [loading, setLoading]           = useState(true);
  const { toasts, showToast, removeToast } = useToast();
  const [currentPage, setCurrentPage]   = useState(1);
  const [modal, setModal]               = useState({ type: null, record: null });
  const [submitting, setSubmitting]     = useState(false);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 6;

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE);
      setRecords(data.map(mapRecord));
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch PWD list for dropdown
  const fetchPwdList = async () => {
    try {
      const { data } = await axios.get(PWD_API);
      setPwdList(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRecords(); fetchPwdList(); }, []);

  const closeModal = () => { setModal({ type: null, record: null }); setSelectedPwdId(""); };

  // ✅ Fixed search — searches by pwd_number, name, status, remarks
  const filtered = records.filter(r => {
    const matchStatus = filterStatus === "all" || r.status?.toLowerCase() === filterStatus.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch =
      (r.pwd_number || "").toLowerCase().includes(q) ||
      (r.name       || "").toLowerCase().includes(q) ||
      (r.status     || "").toLowerCase().includes(q) ||
      (r.remarks    || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });
  const totalPages       = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRecords = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage         = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  // ✅ Stats — replaced Staff Utilization with Total Checkups
  const today     = new Date();
  const oneWeekAgo = new Date(); oneWeekAgo.setDate(today.getDate() - 7);
  const criticalCases    = records.filter(r => r.status === "Critical").length;
  const checkupsThisWeek = records.filter(r => { const d = new Date(r.date); return d >= oneWeekAgo && d <= today; }).length;

  const statsdata = [
    { label: "Total Checkups",     icon: "health_and_safety", value: records.length,         changeText: "all records",        changeClass: "text-primary"     },
    { label: "Critical Cases",     icon: "emergency",         value: criticalCases,           changeText: "active critical",    changeClass: "text-red-600"     },
    { label: "Checkups This Week", icon: "calendar_month",    value: checkupsThisWeek,        changeText: "in the last 7 days", changeClass: "text-emerald-600" },
  ];

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`${API_BASE}/${modal.record.id}`);
      closeModal(); fetchRecords();
      showToast("Health record deleted!", "success");
    } catch (err) { showToast("Failed to delete.", "error"); }
    finally { setSubmitting(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.target;

    if (!selectedPwdId) { showToast("Please select a PWD.", "error"); setSubmitting(false); return; }

    const body = {
      pwd_id:         parseInt(selectedPwdId),
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
      closeModal(); fetchRecords();
      showToast(modal.type === "add" ? "Record added!" : "Record updated!", "success");
    } catch (err) { showToast(err.message, "error"); }
    finally { setSubmitting(false); }
  };

  const columns = ["Health ID", "PWD Number", "PWD Name", "Blood Pressure", "Heart Rate", "Weight", "Blood Sugar", "Status", "Remarks", "Date", "Actions"];

  const renderRow = (record) => (
    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 text-sm font-medium text-primary">#{record.id}</td>
      <td className="px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">{record.pwd_number}</td>
      <td className="px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">{record.pwd_name}</td>
      <td className="px-3 py-2.5 text-sm font-mono whitespace-nowrap">{record.blood_pressure}</td>
      <td className="px-3 py-2.5 text-sm whitespace-nowrap">{record.heart_rate} bpm</td>
      <td className="px-3 py-2.5 text-sm whitespace-nowrap">{record.weight} kg</td>
      <td className="px-3 py-2.5 text-sm">{record.blood_sugar || "—"}</td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[record.color]}`}>
          {record.status}
        </span>
      </td>
      <td className="px-3 py-2.5 text-sm text-slate-500 max-w-[140px] truncate">{record.remarks || "—"}</td>
      {/* ✅ Fixed date format */}
      <td className="px-3 py-2.5 text-sm text-slate-500 whitespace-nowrap">{formatDateDisplay(record.date)}</td>
      <td className="px-3 py-2.5">
        <div className="flex gap-1">
          <button onClick={() => setModal({ type: "view", record })}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          <button onClick={() => { setSelectedPwdId(record.pwd_id); setModal({ type: "edit", record }); }}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button onClick={() => setModal({ type: "delete", record })}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = (record) => (
    <div key={record.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          {/* ✅ Show pwd_number */}
          <p className="font-bold text-sm dark:text-white">{record.pwd_number}</p>
          <p className="text-xs text-slate-500 mt-0.5">{formatDateDisplay(record.date)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[record.color]}`}>
            {record.status}
          </span>
          <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">#{record.id}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2.5">
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">BP</p><p className="text-xs font-mono font-semibold dark:text-white">{record.blood_pressure}</p></div>
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">HR</p><p className="text-xs font-semibold dark:text-white">{record.heart_rate} bpm</p></div>
        <div><p className="text-[9px] text-slate-400 uppercase font-bold">Weight</p><p className="text-xs font-semibold dark:text-white">{record.weight} kg</p></div>
        {record.blood_sugar && (
          <div><p className="text-[9px] text-slate-400 uppercase font-bold">Blood Sugar</p><p className="text-xs font-semibold dark:text-white">{record.blood_sugar}</p></div>
        )}
        {record.remarks && (
          <div className="col-span-3"><p className="text-[9px] text-slate-400 uppercase font-bold">Remarks</p><p className="text-xs text-slate-600 dark:text-slate-400 truncate">{record.remarks}</p></div>
        )}
      </div>
      <div className="flex gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-700">
        <button onClick={() => setModal({ type: "view", record })} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">View</button>
        <button onClick={() => { setSelectedPwdId(record.pwd_id); setModal({ type: "edit", record }); }} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg">Edit</button>
        <button onClick={() => setModal({ type: "delete", record })} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
      </div>
    </div>
  );

  const inputClass = "border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  const HealthForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* ✅ PWD Number Searchable Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PWD Number *</label>
        <PwdDropdown pwdList={pwdList} value={selectedPwdId} onChange={setSelectedPwdId} />
      </div>

      {[
        { label: "Blood Pressure",      name: "blood_pressure",                               placeholder: "e.g. 120/80", required: true },
        { label: "Heart Rate (bpm)",    name: "heart_rate",     type: "number",               placeholder: "e.g. 72",     required: true },
        { label: "Temperature (°C)",    name: "temperature",    type: "number", step: "0.01", placeholder: "e.g. 36.5",   required: true },
        { label: "Weight (kg)",         name: "weight",         type: "number", step: "0.01", placeholder: "e.g. 65.0",   required: true },
        { label: "Blood Sugar (mg/dL)", name: "blood_sugar",    type: "number", step: "0.01", placeholder: "Optional" },
        { label: "Remarks",             name: "remarks",                                      placeholder: "Optional" },
      ].map(({ label, name, ...props }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
          <input name={name} defaultValue={modal.record?.[name] ?? ""} className={inputClass} {...props} />
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Health Status</label>
        <select name="health_status" defaultValue={modal.record?.health_status || "Stable"} className={inputClass + " appearance-none"}>
          <option value="Stable">Stable</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-2">
        <button type="button" onClick={closeModal} className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-slate-300">Cancel</button>
        <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60">
          {submitting ? "Saving…" : modal.type === "add" ? "Add Record" : "Update Record"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">Health Monitoring</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage and monitor PWD health records across the barangay</p>
        </div>
        <Buttons variant="primary" onClick={() => { setSelectedPwdId(""); setModal({ type: "add", record: null }); }} className="flex items-center justify-center w-full sm:w-auto">
          Record New Checkup
        </Buttons>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={3} /> : (
        <StatsGrid>
          {statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}
        </StatsGrid>
      )}

      {/* ── Search ── */}
      <SearchBar
        searchValue={search}
        setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
        filterValue={filterStatus}
        setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
        placeholder="Search by PWD number..."
        options={[
          { value: "all",       label: "All Status" },
          { value: "Stable",    label: "Stable" },
          { value: "Follow-up", label: "Follow-up" },
          { value: "Critical",  label: "Critical" },
        ]}
      />

      {/* ── Table ── */}
      {loading ? (
        <TableLoader rows={6} cols={columns.length} />
      ) : (
        <DataTable
          columns={columns}
          data={paginatedRecords}
          renderRow={renderRow}
          renderCard={renderCard}
          empty="No health records found."
          pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={goToPage} />}
        />
      )}

      {/* ── View Modal ── ✅ pwd_number + formatted date */}
      {modal.type === "view" && (
        <ViewModal title="Health Record" icon="monitor_heart"
          data={{
            "Health ID":      `#${modal.record.id}`,
            "PWD Number":     modal.record.pwd_number,
            "PWD Name":       modal.record.pwd_name,
            "Blood Pressure": modal.record.blood_pressure,
            "Heart Rate":     `${modal.record.heart_rate} bpm`,
            "Weight":         `${modal.record.weight} kg`,
            "Blood Sugar":    modal.record.blood_sugar || "—",
            "Status":         modal.record.status,
            "Remarks":        modal.record.remarks || "—",
            "Date":           formatDateDisplay(modal.record.date),
          }}
          onClose={closeModal} />
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

      {/* ── Delete Modal ── ✅ pwd_number instead of pwd_id */}
      {modal.type === "delete" && (
        <DeleteModal
          title="Delete Health Record"
          message="Are you sure you want to delete health record for"
          subject={modal.record.pwd_number}
          confirmText={submitting ? "Deleting…" : "Delete"}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AdminHealthRecords;