// import { useState } from "react";

// const dummyRecords = [
//   { id: "PWD-001", name: "Juan Dela Cruz", zone: "Zone 4, Trapiche", date: "2023-10-24", status: "Stable", color: "green", vitals: "120/80 - 65kg", staff: "Nurse Sarah", staffImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtp544j9UiOJ2op8gpC0OoPrr76LLXpXyvqyE9LzPrwteTMY2kpx-bDmUBML-HKOTWqvf1wf7nadip64A_PhsB2khmEsmMyY42yUdtpLo9JgQ07U8STDSXdt6DfXRtPttrd2nzDDkIj3oC14TqQG-DWfE3ESe3yT6iSLwR_l3aEytE818TlM5SSNPvpfbDHl0r9-cf4z8T5NQcNpi056E-IX3epeJ7IDq4jQtbWSEVJ9tFtIf7Ak39V-xLX1KkIW8C_G-ZJbsI3fE" },
//   { id: "PWD-002", name: "Maria Santos", zone: "Zone 1, Trapiche", date: "2023-10-22", status: "Follow-up", color: "amber", vitals: "140/90 - 58kg", staff: "Dr. Reyes", staffImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7t5nigaJTn5fSjPQ97WTCtv2SnePcJgGX6ryU66Drxr1nulphcnP8OVS6K8R_If3S0_j3I7VejhFpt2M1vy11dLhNw5o76bSHGeHPuxbrGlJA1Kjk6AOQ3omPTS--52Sv2I-Lu_6LMlKWZy6ndUJ2L-HLcHmM1jVNSEHX53-fWnOEbh7C9ukLor53fWpeBlZMYDWaxABAiYuP7Ifj_B5oLMTFsgXynyhnZ8qmh1qnK1VMaXdhAd-JsATsl5w7lhmxvpMpYMp7gBs" },
//   { id: "PWD-003", name: "Ricardo Gomez", zone: "Zone 3, Trapiche", date: "2023-10-21", status: "Critical", color: "red", vitals: "160/100 - 72kg", staff: "Nurse Sarah", staffImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8aX7mrHSlb7KCkZM2oHhPUj-VOCQ2jD76TIgtw0FR3vcRqR6dLVg5Zxfxod-8IsNAVAv7AEEXwZdOAo1Ot60J69KNtG_CJ2ETJApgcsGJNYLqk3s48d4EyPyD9NPCbgXQQI0AdAch_RXTa9D3GM4Lx2BCREJgALs3x6MwPMEGu_pIMuND14odCU3yYBixPgMDt5U9ON1UO07Jy_kQyRv3V9yJYgSkBgNhoNOsw25YiPKa1VIv5vYBnDkzyOBYKaaT5IX6c_0e0os" },
//   { id: "PWD-004", name: "Elena Dimaculangan", zone: "Zone 2, Trapiche", date: "2023-10-20", status: "Stable", color: "green", vitals: "110/70 - 50kg", staff: "Dr. Reyes", staffImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNNaY6RrxDt3AwwdnEQ12PdG6ESHXNwXG1ggudPfYxE9bMRzcde5n-t22n2hOkndBrnkVYoIPG-TchVJTH3zz_gzFuYhsrsTIpi3ROZjmkNzGg4MhXPoQeFXtKz6-zi8eHOlmVVJg9SFkdTJJzIk6POvVM80g2QH2Cd95d2dSm7h3DymjbycCkhfsm72FMoCFA3rxo_g69sM-ZDnnVjOuDSD9mJtuwJvPAh-QRGeq7lcjbTCyr96159No5Vpl8eKhh8k2GenNkMSY" },
// ];

// const AdminHealthRecords = () => {
//   const [records, setRecords] = useState(dummyRecords);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [modal, setModal] = useState({ type: null, record: null });
//   const itemsPerPage = 3;

//   const paginatedRecords = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
//   const totalPages = Math.ceil(records.length / itemsPerPage);

//   const statusColors = {
//     green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//     amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
//     red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//   };

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   // ---------- Dynamic Stats ----------
//   const today = new Date();
//   const oneWeekAgo = new Date();
//   oneWeekAgo.setDate(today.getDate() - 7);

//   const criticalCases = records.filter(r => r.status === "Critical").length;
//   const checkupsThisWeek = records.filter(r => {
//     const recordDate = new Date(r.date);
//     return recordDate >= oneWeekAgo && recordDate <= today;
//   }).length;

//   const staffSet = new Set(records.map(r => r.staff));
//   const activeStaffSet = new Set(records.filter(r => {
//     const recordDate = new Date(r.date);
//     return recordDate >= oneWeekAgo && recordDate <= today;
//   }).map(r => r.staff));
//   const staffUtilization = staffSet.size ? Math.round((activeStaffSet.size / staffSet.size) * 100) : 0;

//   // ---------- Modal Handlers ----------
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const newRecord = {
//       id: form.id.value,
//       name: form.name.value,
//       zone: form.zone.value,
//       date: form.date.value,
//       status: form.status.value,
//       color: form.status.value === "Critical" ? "red" : form.status.value === "Follow-up" ? "amber" : "green",
//       vitals: form.vitals.value,
//       staff: form.staff.value,
//       staffImg: form.staffImg.value
//     };

//     if (modal.type === "add") {
//       setRecords([newRecord, ...records]);
//     } else if (modal.type === "edit") {
//       setRecords(records.map(r => r.id === modal.record.id ? newRecord : r));
//     }

//     setModal({ type: null, record: null });
//   };

//   const handleDelete = () => {
//     setRecords(records.filter(r => r.id !== modal.record.id));
//     setModal({ type: null, record: null });
//   };

//   return (
//     <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
//       {/* Heading + Add Button */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
//         <div className="flex flex-col gap-1">
//           <h1 className="text-[#0e141b] dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-tight">Health Monitoring</h1>
//           <p className="text-[#4e7397] dark:text-slate-400 text-sm md:text-base">Manage and monitor PWD health records across the barangay</p>
//         </div>
//         <button onClick={() => setModal({ type: "add", record: null })} className="flex items-center gap-2 px-4 md:px-6 py-2 bg-primary text-white rounded-lg text-sm md:text-base font-bold shadow-md hover:bg-blue-600 transition-colors whitespace-nowrap">
//           <span className="material-symbols-outlined text-sm md:text-base">add</span>
//           Record New Checkup
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
//         <table className="w-full min-w-[700px] text-left border-collapse">
//           <thead className="bg-slate-50 dark:bg-slate-800/50">
//             <tr>
//               {["PWD ID", "Name", "Last Checkup Date", "Health Status", "Vitals (BP/Weight)", "Attending Staff", "Actions"].map((col, idx) => (
//                 <th key={idx} className="px-4 md:px-6 py-3 text-xs md:text-sm font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-wider">{col}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-[#d0dbe7] dark:divide-slate-800">
//             {paginatedRecords.map(record => (
//               <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
//                 <td className="px-4 md:px-6 py-3 text-sm font-medium text-primary">{record.id}</td>
//                 <td className="px-4 md:px-6 py-3">
//                   <div className="flex flex-col">
//                     <span className="text-sm font-bold dark:text-white">{record.name}</span>
//                     <span className="text-xs text-[#4e7397]">{record.zone}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 md:px-6 py-3 text-sm text-[#4e7397] dark:text-slate-400">{record.date}</td>
//                 <td className="px-4 md:px-6 py-3">
//                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[record.color]}`}>{record.status}</span>
//                 </td>
//                 <td className="px-4 md:px-6 py-3 text-sm text-[#4e7397] dark:text-slate-400">{record.vitals}</td>
//                 <td className="px-4 md:px-6 py-3">
//                   <div className="flex items-center gap-2">
//                     <div className="w-6 h-6 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${record.staffImg})` }} title={record.staff}></div>
//                     <span className="text-sm font-medium dark:text-slate-300">{record.staff}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 md:px-6 py-3 text-right">
//                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button onClick={() => setModal({ type: "edit", record })} className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-[#4e7397]">
//                       <span className="material-symbols-outlined text-xl">edit</span>
//                     </button>
//                     <button onClick={() => setModal({ type: "delete", record })} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-[#4e7397]">
//                       <span className="material-symbols-outlined text-xl">delete</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="px-4 md:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between border-t border-[#d0dbe7] dark:border-slate-800 gap-2">
//           <p className="text-sm text-[#4e7397] dark:text-slate-400">
//             Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, records.length)} of {records.length} records
//           </p>
//           <div className="flex gap-2 flex-wrap">
//             <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-[#d0dbe7] dark:border-slate-700 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors">Previous</button>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button key={i + 1} onClick={() => goToPage(i + 1)} className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === i + 1 ? "bg-primary text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#d0dbe7] dark:border-slate-700"}`}>{i + 1}</button>
//             ))}
//             <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border border-[#d0dbe7] dark:border-slate-700 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors">Next</button>
//           </div>
//         </div>
//       </div>

//       {/* Footer Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
//         <div className="p-4 bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl">
//           <p className="text-xs font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-widest mb-1">Critical Cases</p>
//           <p className="text-2xl font-black text-red-600">{criticalCases}</p>
//         </div>
//         <div className="p-4 bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl">
//           <p className="text-xs font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-widest mb-1">Checkups This Week</p>
//           <p className="text-2xl font-black text-primary">{checkupsThisWeek}</p>
//         </div>
//         <div className="p-4 bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl">
//           <p className="text-xs font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-widest mb-1">Staff Utilization</p>
//           <p className="text-2xl font-black text-green-600">{staffUtilization}%</p>
//         </div>
//       </div>

//       {/* ---------- Modal ---------- */}
//       {modal.type && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">
//                 {modal.type === "add" ? "Add Record" : modal.type === "edit" ? "Edit Record" : "Delete Record"}
//               </h2>
//               <button onClick={() => setModal({ type: null, record: null })} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             </div>

//             {modal.type === "delete" ? (
//               <div className="flex flex-col gap-4">
//                 <p>Are you sure you want to delete <span className="font-bold">{modal.record.name}</span>?</p>
//                 <div className="flex justify-end gap-2">
//                   <button onClick={() => setModal({ type: null, record: null })} className="px-4 py-2 border rounded-lg">Cancel</button>
//                   <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//                 <input name="id" placeholder="PWD ID" defaultValue={modal.record?.id || ""} required className="border rounded-lg px-3 py-2" />
//                 <input name="name" placeholder="Name" defaultValue={modal.record?.name || ""} required className="border rounded-lg px-3 py-2" />
//                 <input name="zone" placeholder="Zone" defaultValue={modal.record?.zone || ""} required className="border rounded-lg px-3 py-2" />
//                 <input name="date" type="date" defaultValue={modal.record?.date || ""} required className="border rounded-lg px-3 py-2" />
//                 <select name="status" defaultValue={modal.record?.status || "Stable"} className="border rounded-lg px-3 py-2">
//                   <option value="Stable">Stable</option>
//                   <option value="Follow-up">Follow-up</option>
//                   <option value="Critical">Critical</option>
//                 </select>
//                 <input name="vitals" placeholder="Vitals (BP/Weight)" defaultValue={modal.record?.vitals || ""} required className="border rounded-lg px-3 py-2" />
//                 <input name="staff" placeholder="Attending Staff" defaultValue={modal.record?.staff || ""} required className="border rounded-lg px-3 py-2" />
//                 <input name="staffImg" placeholder="Staff Image URL" defaultValue={modal.record?.staffImg || ""} required className="border rounded-lg px-3 py-2" />
//                 <div className="flex justify-end gap-2 mt-4">
//                   <button type="button" onClick={() => setModal({ type: null, record: null })} className="px-4 py-2 border rounded-lg">Cancel</button>
//                   <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">{modal.type === "add" ? "Add" : "Update"}</button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminHealthRecords;

import { useState, useEffect } from "react";
import API_URL from "../api/api";
import axios from "axios";

const API_BASE = `${API_URL}/api/health`;

// Helper to map DB row → display format
const mapRecord = (r) => ({
  id: r.health_id,
  pwd_id: r.pwd_id,
  name: r.name || `PWD-${r.pwd_id}`,           // join pwd_profiles if available
  zone: r.zone || "—",
  date: r.recorded_at ? r.recorded_at.slice(0, 10) : "—",
  status: r.health_status,
  color: r.health_status === "Critical" ? "red"
       : r.health_status === "Follow-up" ? "amber"
       : "green",
  vitals: `${r.blood_pressure} - ${r.weight}kg`,
  // raw fields for edit form
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

const AdminHealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, record: null });
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 3;

  // ── FETCH ALL ──────────────────────────────────────────────
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

  // ── PAGINATION ─────────────────────────────────────────────
  const paginatedRecords = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(records.length / itemsPerPage);
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ── STATUS COLORS ──────────────────────────────────────────
  const statusColors = {
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    red:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  // ── STATS ──────────────────────────────────────────────────
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const criticalCases = records.filter(r => r.status === "Critical").length;
  const checkupsThisWeek = records.filter(r => {
    const d = new Date(r.date);
    return d >= oneWeekAgo && d <= today;
  }).length;
  const staffSet = new Set(records.map(r => r.staff));
  const activeStaffSet = new Set(
    records
      .filter(r => { const d = new Date(r.date); return d >= oneWeekAgo && d <= today; })
      .map(r => r.staff)
  );
  const staffUtilization = staffSet.size
    ? Math.round((activeStaffSet.size / staffSet.size) * 100)
    : 0;

  // ── CREATE ─────────────────────────────────────────────────
  const handleCreate = async (body) => {
    await axios.post(API_BASE, body);
  };

  // ── UPDATE ─────────────────────────────────────────────────
  const handleUpdate = async (id, body) => {
    await axios.put(`${API_BASE}/${id}`, body);
  };

  // ── DELETE ─────────────────────────────────────────────────
  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await axios.delete(`${API_BASE}/${modal.record.id}`);
      setModal({ type: null, record: null });
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── FORM SUBMIT (add / edit) ───────────────────────────────
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
      if (modal.type === "add") {
        await handleCreate(body);
      } else {
        await handleUpdate(modal.record.id, body);
      }
      setModal({ type: null, record: null });
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">

      {/* Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#0e141b] dark:text-white text-2xl md:text-3xl font-black leading-tight tracking-tight">
            Health Monitoring
          </h1>
          <p className="text-[#4e7397] dark:text-slate-400 text-sm md:text-base">
            Manage and monitor PWD health records across the barangay
          </p>
        </div>
        <button
          onClick={() => setModal({ type: "add", record: null })}
          className="flex items-center gap-2 px-4 md:px-6 py-2 bg-primary text-white rounded-lg text-sm md:text-base font-bold shadow-md hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-sm md:text-base">add</span>
          Record New Checkup
        </button>
      </div>

      {/* Error / Loading */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error} —{" "}
          <button onClick={fetchRecords} className="underline font-bold">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-[#4e7397] gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading records…
          </div>
        ) : (
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {["Health ID","PWD ID","Blood Pressure","Heart Rate","Weight","Blood Sugar","Status","Remarks","Date","Actions"].map((col, i) => (
                  <th key={i} className="px-4 md:px-6 py-3 text-xs font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0dbe7] dark:divide-slate-800">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-14 text-[#4e7397] text-sm">
                    No health records found.
                  </td>
                </tr>
              ) : paginatedRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <td className="px-4 md:px-6 py-3 text-sm font-medium text-primary">#{record.id}</td>
                  <td className="px-4 md:px-6 py-3 text-sm text-[#4e7397]">{record.pwd_id}</td>
                  <td className="px-4 md:px-6 py-3 text-sm font-mono">{record.blood_pressure}</td>
                  <td className="px-4 md:px-6 py-3 text-sm">{record.heart_rate} bpm</td>
                  <td className="px-4 md:px-6 py-3 text-sm">{record.weight} kg</td>
                  <td className="px-4 md:px-6 py-3 text-sm">{record.blood_sugar || "—"}</td>
                  <td className="px-4 md:px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[record.color]}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 text-sm text-[#4e7397] max-w-[160px] truncate" title={record.remarks}>
                    {record.remarks || "—"}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-sm text-[#4e7397] whitespace-nowrap">{record.date}</td>
                  <td className="px-4 md:px-6 py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setModal({ type: "edit", record })}
                        className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-[#4e7397]"
                      >
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button
                        onClick={() => setModal({ type: "delete", record })}
                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-[#4e7397]"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-4 md:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between border-t border-[#d0dbe7] dark:border-slate-800 gap-2">
            <p className="text-sm text-[#4e7397] dark:text-slate-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, records.length)} of {records.length} records
            </p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                className="px-3 py-1 border border-[#d0dbe7] dark:border-slate-700 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === i + 1 ? "bg-primary text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-[#d0dbe7] dark:border-slate-700"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                className="px-3 py-1 border border-[#d0dbe7] dark:border-slate-700 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl">
          <p className="text-xs font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-widest mb-1">Critical Cases</p>
          <p className="text-2xl font-black text-red-600">{criticalCases}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl">
          <p className="text-xs font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-widest mb-1">Checkups This Week</p>
          <p className="text-2xl font-black text-primary">{checkupsThisWeek}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-[#d0dbe7] dark:border-slate-800 rounded-xl">
          <p className="text-xs font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-widest mb-1">Staff Utilization</p>
          <p className="text-2xl font-black text-green-600">{staffUtilization}%</p>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                {modal.type === "add" ? "Add Health Record"
                  : modal.type === "edit" ? "Edit Health Record"
                  : "Delete Record"}
              </h2>
              <button onClick={() => setModal({ type: null, record: null })}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {modal.type === "delete" ? (
              <div className="flex flex-col gap-4">
                <p className="dark:text-slate-300">
                  Are you sure you want to delete health record{" "}
                  <span className="font-bold">#{modal.record.id}</span>?
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal({ type: null, record: null })}
                    className="px-4 py-2 border rounded-lg dark:border-slate-700 dark:text-slate-300">Cancel</button>
                  <button onClick={handleDelete} disabled={submitting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-60">
                    {submitting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {[
                  { label: "PWD ID", name: "pwd_id", type: "number", placeholder: "e.g. 1", required: true },
                  { label: "Blood Pressure", name: "blood_pressure", placeholder: "e.g. 120/80", required: true },
                  { label: "Heart Rate (bpm)", name: "heart_rate", type: "number", placeholder: "e.g. 72", required: true },
                  { label: "Temperature (°C)", name: "temperature", type: "number", step: "0.01", placeholder: "e.g. 36.5", required: true },
                  { label: "Weight (kg)", name: "weight", type: "number", step: "0.01", placeholder: "e.g. 65.0", required: true },
                  { label: "Blood Sugar (mg/dL)", name: "blood_sugar", type: "number", step: "0.01", placeholder: "Optional" },
                  { label: "Remarks", name: "remarks", placeholder: "Optional" },
                ].map(({ label, name, ...props }) => (
                  <div key={name} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#4e7397] dark:text-slate-400 uppercase tracking-wider">
                      {label}
                    </label>
                    <input
                      name={name}
                      defaultValue={modal.record?.[name] ?? ""}
                      className="border border-[#d0dbe7] dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      {...props}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#4e7397] dark:text-slate-400 uppercase tracking-wider">
                    Health Status
                  </label>
                  <select name="health_status"
                    defaultValue={modal.record?.health_status || "Stable"}
                    className="border border-[#d0dbe7] dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    <option value="Stable">Stable</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setModal({ type: null, record: null })}
                    className="px-4 py-2 border rounded-lg dark:border-slate-700 dark:text-slate-300">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-60">
                    {submitting ? "Saving…" : modal.type === "add" ? "Add Record" : "Update Record"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHealthRecords;