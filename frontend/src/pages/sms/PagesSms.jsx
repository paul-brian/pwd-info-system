// import { useState, useEffect } from "react";
// import axios from "axios";
// import API_URL from "../../api/api";
// import { ToastContainer } from "../../components/ui/Toast";
// import { StatCardsLoader } from "../../components/ui/Loading";
// import { TableLoader } from "../../components/ui/Loading";
// import { formatDate } from "../../config/formatDate";
// import StatsCards    from "../../components/ui/StatsCards";
// import StatsGrid     from "../../components/ui/StatsGrid";
// import Buttons from "../../components/ui/Buttons";
// import SearchBar     from "../../components/ui/SearchBar";
// import DataTable     from "../../components/ui/DataTable";
// import Pagination    from "../../components/ui/Pagination";
// import AddEditModal  from "../../components/modals/AddEditModal";
// import ViewModal     from "../../components/modals/ViewModal";
// import useToast      from "../../hooks/useToast";


// const API_BASE = `${API_URL}/api/sms`;

// const PwdSearchDropdown = ({ pwdList, value, onChange }) => {
//   const [query, setQuery] = useState("");
//   const [open, setOpen]   = useState(false);
//   const selected = pwdList.find(p => String(p.pwd_id) === String(value));
 
//   const filtered = pwdList.filter(p =>
//     (p.full_name  || "").toLowerCase().includes(query.toLowerCase()) ||
//     (p.pwd_number || "").toLowerCase().includes(query.toLowerCase())
//   );
 
//   return (
//     <div className="relative">
//       <div
//         onClick={() => setOpen(!open)}
//         className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm
//           bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer
//           flex items-center justify-between focus:ring-2 focus:ring-primary/30"
//       >
//         <span className={selected ? "text-slate-900 dark:text-white" : "text-slate-400"}>
//           {selected ? `${selected.full_name} — ${selected.pwd_number}` : "— Select PWD Member —"}
//         </span>
//         <span className="material-symbols-outlined text-slate-400 text-base">expand_more</span>
//       </div>
 
//       {open && (
//         <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
//           <div className="p-2 border-b border-slate-100 dark:border-slate-700">
//             <div className="relative">
//               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
//               <input
//                 autoFocus
//                 type="text"
//                 value={query}
//                 onChange={e => setQuery(e.target.value)}
//                 placeholder="Search name or PWD number..."
//                 className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/30"
//               />
//             </div>
//           </div>
//           <div className="max-h-48 overflow-y-auto">
//             {filtered.length === 0 ? (
//               <p className="text-center text-xs text-slate-400 py-4">No PWD member found</p>
//             ) : filtered.map(p => (
//               <div
//                 key={p.pwd_id}
//                 onClick={() => { onChange(p.pwd_id); setOpen(false); setQuery(""); }}
//                 className="px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
//               >
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

// const AdminSms = () => {
//   const [messages, setMessages]       = useState([]);
//   const [pwdList, setPwdList]         = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showCompose, setShowCompose] = useState(false);
//   const [viewMessage, setViewMessage] = useState(null);
//   const [sending, setSending]         = useState(false);
//   const [form, setForm]               = useState({ pwd_id: "", message: "" });
//   const [search, setSearch]           = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const { toasts, showToast, removeToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([]);
//   const itemsPerPage = 6;

//   // ── Fetch ──
//   const fetchLogs = async () => {
//     try {
//       setLoading(true)
//       const res = await axios.get(`${API_BASE}/logs`);
//       setMessages(res.data);
//       setData(res.data)
//     } catch (err) { console.error("Failed to fetch logs:", err); 
//     }finally {
//       setLoading(false);
//     }
//   };

//   const fetchPwdList = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE}/pwd-list`);
//       setPwdList(res.data);
//     } catch (err) { console.error("Failed to fetch PWD list:", err); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchLogs(); fetchPwdList(); }, []);

//   // ── Send SMS ──
//   const handleSend = async () => {
//     if (!form.pwd_id || !form.message)
//       return showToast("Pumili ng PWD member at maglagay ng mensahe!", "error");
//     setSending(true);
//     try {
//       await axios.post(`${API_BASE}/send`, form);
//       await fetchLogs();
//       setShowCompose(false);
//       setForm({ pwd_id: "", message: "" });
//       showToast("SMS sent successfully!", "success");
//     } catch (err) {
//       console.error("Failed to send SMS:", err);
//       showToast("Failed to send SMS.", "error");
//     } finally { setSending(false); }
//   };

//   const handleSendAll = async () => {
//     if (!form.message) return showToast("Maglagay ng mensahe!", "error");
//     setSendingAll(true);
//     try {
//       const res = await axios.post(`${API_BASE}/send-all`, { message: form.message });
//       await fetchLogs();
//       setShowCompose(false);
//       setForm({ pwd_id: "", message: "", sendAll: false });
//       showToast(`SMS sent to ${res.data.sent} of ${res.data.total} PWD members!`, "success");
//     } catch (err) { showToast("Failed to send bulk SMS.", "error"); }
//     finally { setSendingAll(false); }
//   };

//   // ── Retry ──
//   const handleRetry = async (id) => {
//     try {
//       await axios.post(`${API_BASE}/retry/${id}`);
//       await fetchLogs();
//       showToast("SMS retried successfully!", "success");
//     } catch (err) {
//       console.error("Retry failed:", err);
//       showToast("Failed to retry SMS.", "error");
//     }
//   };

//   // ── Filter & Paginate ──
//   const filtered = messages.filter((m) =>
//     (filterStatus === "all" || m.status?.toLowerCase() === filterStatus) &&
//     (
//       (m.recipient_name || "").toLowerCase().includes(search.toLowerCase()) ||
//       (m.sent_to        || "").toLowerCase().includes(search.toLowerCase()) ||
//       (m.message        || "").toLowerCase().includes(search.toLowerCase())
//     )
//   );
//   const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
//   const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
//   const goToPage   = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

//   // ── Stats ──
//   const statsdata = [
//     { label: "Total Sent",        icon: "outbox",          value: messages.filter((m) => m.status === "Sent").length,    change: "", changeText: "messages sent",    changeClass: "text-emerald-600" },
//     { label: "Pending Queue",     icon: "pending_actions", value: messages.filter((m) => m.status === "Pending").length, change: "", changeText: "in processing",    changeClass: "text-amber-500"   },
//     { label: "Failed Deliveries", icon: "error",           value: messages.filter((m) => m.status === "Failed").length,  change: "", changeText: "requires attention", changeClass: "text-red-500"   },
//   ];

//   // ── Status badge ──
//   const statusBadge = (status) => {
//     if (status === "Sent")    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
//     if (status === "Pending") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
//     return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
//   };

//   const statusIcon = (status) => {
//     if (status === "Sent")    return "check_circle";
//     if (status === "Pending") return "hourglass_empty";
//     return "error";
//   };

//   const columns=["Date & Time", "Recipient", "Message Preview", "Status", "Actions"];

//   // ── Desktop Row ──
//   const renderRow = (msg) => (
//     <tr key={msg.sms_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
//       <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
//         {formatDate(msg.sent_date, true)}
//       </td>
//       <td className="px-4 lg:px-6 py-3 lg:py-4">
//         <div className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
//             <span className="material-symbols-outlined text-primary text-sm">person</span>
//           </div>
//           <div className="min-w-0">
//             <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{msg.recipient_name}</p>
//             <p className="text-[10px] text-slate-400">{msg.sent_to}</p>
//           </div>
//         </div>
//       </td>
//       <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
//         {msg.message?.substring(0, 60)}{msg.message?.length > 60 ? "..." : ""}
//       </td>
//       <td className="px-4 lg:px-6 py-3 lg:py-4 text-start">
//         <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge(msg.status)}`}>
//           <span className="material-symbols-outlined text-[12px]">{statusIcon(msg.status)}</span>
//           {msg.status}
//         </span>
//       </td>
//       <td className="px-4 lg:px-6 py-3 lg:py-4 flex">
//         <div className="flex justify-end gap-1">
//           <button onClick={() => setViewMessage(msg)}
//             className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
//             <span className="material-symbols-outlined text-lg">visibility</span>
//           </button>
//           {msg.status === "Failed" && (
//             <button onClick={() => handleRetry(msg.sms_id)}
//               className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
//               <span className="material-symbols-outlined text-lg">replay</span>
//             </button>
//           )}
//         </div>
//       </td>
//     </tr>
//   );

//   // ── Mobile Card ──
//   const renderCard = (msg) => (
//     <div key={msg.sms_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 sm:p-4 shadow-sm">
//       <div className="flex justify-between items-start gap-2 mb-2">
//         <div className="min-w-0">
//           <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{msg.recipient_name}</p>
//           <p className="text-[10px] text-slate-400">{msg.sent_to}</p>
//         </div>
//         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusBadge(msg.status)}`}>
//           <span className="material-symbols-outlined text-[10px]">{statusIcon(msg.status)}</span>
//           {msg.status}
//         </span>
//       </div>
//       <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2">
//         {msg.message}
//       </p>
//       <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2.5">
//         {formatDate(msg.sent_date, true)}
//       </p>
//       <div className="flex gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
//         <button onClick={() => setViewMessage(msg)}
//           className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-blue-700 rounded-lg text-xs font-bold transition-colors">
//           <span className= "font-bold">View</span>
//         </button>
//         {msg.status === "Failed" && (
//           <button onClick={() => handleRetry(msg.sms_id)}
//             className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-colors">
//             <span className="material-symbols-outlined text-sm">replay</span>
//             Retry
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
//          bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div>
//             <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
//               SMS Notifications
//             </h1>
//             <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
//               Manage and monitor broadcasts to PWD members
//             </p>
//           </div>
//         </div>
//         <div className="flex-shrink-0">
//           <Buttons variant="primary" onClick={() => setShowCompose(true)} className="flex items-center justify-center w-full sm:w-auto">
//             Compose SMS
//           </Buttons>
//         </div>
//       </div>


//       {/* ── Stats ── */}
//       {loading ? <StatCardsLoader count={3} /> :
//         <StatsGrid>
//           {statsdata.map((stat, idx) => (
//             <StatsCards key={idx} stat={stat} />
//           ))}
//         </StatsGrid>}

//       {/* ── Search ── */}
//       <SearchBar
//         searchValue={search}
//         setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
//         filterValue={filterStatus}
//         setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
//         placeholder="Search recipient or message..."
//         options={[
//           { value: "all",     label: "All Status" },
//           { value: "sent",    label: "Sent" },
//           { value: "pending", label: "Pending" },
//           { value: "failed",  label: "Failed" },
//         ]}
//       />

//       {/* ── DataTable ── */}
//       {loading ? (
//         <TableLoader rows={6} cols={columns.length} />
//       ) : (
//         <DataTable
//           columns={columns}
//           data={paginated}
//           renderRow={renderRow}
//           renderCard={renderCard}
//           empty="No messages yet. Compose a new SMS."
//           pagination={
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               totalItems={filtered.length}
//               itemsPerPage={itemsPerPage}
//               onPageChange={goToPage}
//             />
//           }
//         />
//       )}

//       {/* ── Compose Modal ── */}
//       {showCompose && (
//         <AddEditModal isOpen isEdit={false} title="SMS" icon="send"
//           onCancel={() => { setShowCompose(false); setForm({ pwd_id: "", message: "", sendAll: false }); }}>
//           <div className="flex flex-col gap-4">

//             {/* ✅ Toggle: Single or All */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setForm({ ...form, sendAll: false, pwd_id: "" })}
//                 className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${!form.sendAll
//                     ? "bg-primary text-white border-primary shadow-sm"
//                     : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
//                   }`}
//               >
//                 <span className="material-symbols-outlined text-base align-middle mr-1">person</span>
//                 Single PWD
//               </button>
//               <button
//                 onClick={() => setForm({ ...form, sendAll: true, pwd_id: "" })}
//                 className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.sendAll
//                     ? "bg-primary text-white border-primary shadow-sm"
//                     : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
//                   }`}
//               >
//                 <span className="material-symbols-outlined text-base align-middle mr-1">groups</span>
//                 All PWDs ({pwdList.length})
//               </button>
//             </div>

//             {/* ✅ Searchable PWD Dropdown — only if single */}
//             {!form.sendAll && (
//               <div className="flex flex-col gap-1">
//                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PWD Member</label>
//                 <PwdSearchDropdown
//                   pwdList={pwdList}
//                   value={form.pwd_id}
//                   onChange={(id) => setForm({ ...form, pwd_id: id })}
//                 />
//               </div>
//             )}

//             {form.sendAll && (
//               <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700/30 text-xs text-blue-700 dark:text-blue-300">
//                 <span className="material-symbols-outlined text-base">info</span>
//                 This SMS will be sent to all <strong>{pwdList.length}</strong> active PWD members.
//               </div>
//             )}

//             {/* Message */}
//             <div className="flex flex-col gap-1">
//               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Message</label>
//               <textarea
//                 rows={4}
//                 placeholder="Write your SMS message here..."
//                 value={form.message}
//                 onChange={(e) => setForm({ ...form, message: e.target.value })}
//                 className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm
//                   bg-white dark:bg-slate-800 text-slate-900 dark:text-white
//                   focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
//               />
//               <p className="text-[10px] text-slate-400 text-right">{form.message.length}/160 characters</p>
//             </div>

//             <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
//               <button
//                 onClick={() => { setShowCompose(false); setForm({ pwd_id: "", message: "", sendAll: false }); }}
//                 className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
//                 Cancel
//               </button>
//               <button
//                 onClick={form.sendAll ? handleSendAll : handleSend}
//                 disabled={sending || sendingAll}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60">
//                 <span className="material-symbols-outlined text-base">
//                   {(sending || sendingAll) ? "hourglass_empty" : "send"}
//                 </span>
//                 {sending ? "Sending..." : sendingAll ? "Sending to all..." : form.sendAll ? `Send to All (${pwdList.length})` : "Send SMS"}
//               </button>
//             </div>
//           </div>
//         </AddEditModal>
//       )}

//       {/* ── View Modal ── */}
//       {viewMessage && (
//         <ViewModal
//           title="Message Details"
//           icon="sms"
//           data={{
//             "Recipient":   viewMessage.recipient_name,
//             "Phone":       viewMessage.sent_to,
//             "Status":      viewMessage.status,
//             "Date & Time": new Date(viewMessage.sent_date).toLocaleString("en-PH"),
//             "Message":     viewMessage.message,
//           }}
//           onClose={() => setViewMessage(null)}
//         />
//       )}

//       <ToastContainer toasts={toasts} removeToast={removeToast} />
//     </div>
//   );
// };

// export default AdminSms;

import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import { ToastContainer } from "../../components/ui/Toast";
import { StatCardsLoader, TableLoader } from "../../components/ui/Loading";
import { formatDate } from "../../config/formatDate";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid  from "../../components/ui/StatsGrid";
import Buttons from "../../components/ui/Buttons";
import SearchBar  from "../../components/ui/SearchBar";
import DataTable  from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import AddEditModal from "../../components/modals/AddEditModal";
import ViewModal from "../../components/modals/ViewModal";
import useToast from "../../hooks/useToast";

const API_BASE = `${API_URL}/api/sms`;

// ✅ Searchable PWD Dropdown
const PwdSearchDropdown = ({ pwdList, value, onChange }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen]   = useState(false);
  const selected = pwdList.find(p => String(p.pwd_id) === String(value));

  const filtered = pwdList.filter(p =>
    (p.contact_number  || "").toLowerCase().includes(query.toLowerCase()) ||
    (p.pwd_number || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm
          bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer
          flex items-center justify-between focus:ring-2 focus:ring-primary/30"
      >
        <span className={selected ? "text-slate-900 dark:text-white" : "text-slate-400"}>
          {selected ? `${selected.contact_number} — ${selected.pwd_number}` : "— Select PWD Member —"}
        </span>
        <span className="material-symbols-outlined text-slate-400 text-base">expand_more</span>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search name or PWD number..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4">No PWD member found</p>
            ) : filtered.map(p => (
              <div
                key={p.pwd_id}
                onClick={() => { onChange(p.pwd_id); setOpen(false); setQuery(""); }}
                className="px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between"
              >
                <span className="font-medium text-slate-900 dark:text-white">{p.contact_number}</span>
                <span className="text-xs text-slate-400 font-mono">{p.pwd_number}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminSms = () => {
  const [messages, setMessages]         = useState([]);
  const [pwdList, setPwdList]           = useState([]);
  const [currentPage, setCurrentPage]   = useState(1);
  const [showCompose, setShowCompose]   = useState(false);
  const [viewMessage, setViewMessage]   = useState(null);
  const [sending, setSending]           = useState(false);
  const [sendingAll, setSendingAll]     = useState(false);
  const [form, setForm]                 = useState({ pwd_id: "", message: "", sendAll: false });
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toasts, showToast, removeToast } = useToast();
  const [loading, setLoading]           = useState(true);
  const itemsPerPage = 6;


  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/logs`);
      setMessages(res.data);
    } catch (err) { console.error("Failed to fetch logs:", err); }
    finally { setLoading(false); }
  };

  const fetchPwdList = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pwd-list`);
      setPwdList(res.data);
    } catch (err) { console.error("Failed to fetch PWD list:", err); }
  };

  useEffect(() => { fetchLogs(); fetchPwdList(); }, []);

  // ── Send SMS to single PWD ──
  const handleSend = async () => {
    if (!form.pwd_id || !form.message)
      return showToast("Pumili ng PWD member at maglagay ng mensahe!", "error");
    setSending(true);
    try {
      await axios.post(`${API_BASE}/send`, { pwd_id: form.pwd_id, message: form.message });
      await fetchLogs();
      setShowCompose(false);
      setForm({ pwd_id: "", message: "", sendAll: false });
      showToast("SMS sent successfully!", "success");
    } catch (err) { showToast("Failed to send SMS.", "error"); }
    finally { setSending(false); }
  };

  // ✅ Send SMS to ALL active PWDs
  const handleSendAll = async () => {
    if (!form.message) return showToast("Maglagay ng mensahe!", "error");
    setSendingAll(true);
    try {
      const res = await axios.post(`${API_BASE}/send-all`, { message: form.message });
      await fetchLogs();
      setShowCompose(false);
      setForm({ pwd_id: "", message: "", sendAll: false });
      showToast(`SMS sent to ${res.data.sent} of ${res.data.total} PWD members!`, "success");
    } catch (err) { showToast("Failed to send bulk SMS.", "error"); }
    finally { setSendingAll(false); }
  };

  const handleRetry = async (id) => {
    try {
      await axios.post(`${API_BASE}/retry/${id}`);
      await fetchLogs();
      showToast("SMS retried successfully!", "success");
    } catch (err) { showToast("Failed to retry SMS.", "error"); }
  };

  // ── Filter & Paginate ──
  const filtered = messages.filter((m) =>
    (filterStatus === "all" || m.status?.toLowerCase() === filterStatus) &&
    (
      (m.recipient_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.sent_to        || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.message        || "").toLowerCase().includes(search.toLowerCase())
    )
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage   = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  const statsdata = [
    { label: "Total Sent",        icon: "outbox",          value: messages.filter(m => m.status === "Sent").length,    changeText: "messages sent",     changeClass: "text-emerald-600" },
    { label: "Pending Queue",     icon: "pending_actions", value: messages.filter(m => m.status === "Pending").length, changeText: "in processing",     changeClass: "text-amber-500"   },
    { label: "Failed Deliveries", icon: "error",           value: messages.filter(m => m.status === "Failed").length,  changeText: "requires attention", changeClass: "text-red-500"    },
  ];

  const statusBadge = (status) => {
    if (status === "Sent")    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (status === "Pending") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };
  const statusIcon = (status) => {
    if (status === "Sent")    return "check_circle";
    if (status === "Pending") return "hourglass_empty";
    return "error";
  };

  const columns = ["Date & Time", "Recipient", "Message Preview", "Status", "Actions"];

  const renderRow = (msg) => (
    <tr key={msg.sms_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(msg.sent_date)}</td>
      <td className="px-3 py-2.5">
        <div className="flex justify-center items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-sm">person</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{msg.recipient_name}</p>
            <p className="text-[10px] text-slate-400">{msg.sent_to}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
        {msg.message?.substring(0, 60)}{msg.message?.length > 60 ? "..." : ""}
      </td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge(msg.status)}`}>
          <span className="material-symbols-outlined text-[12px]">{statusIcon(msg.status)}</span>
          {msg.status}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex justify-center gap-1">
          <button onClick={() => setViewMessage(msg)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          {msg.status === "Failed" && (
            <button onClick={() => handleRetry(msg.sms_id)} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-base">replay</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  const renderCard = (msg) => (
    <div key={msg.sms_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 shadow-sm">
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{msg.recipient_name}</p>
          <p className="text-[10px] text-slate-400">{msg.sent_to}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusBadge(msg.status)}`}>
          <span className="material-symbols-outlined text-[10px]">{statusIcon(msg.status)}</span>
          {msg.status}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{msg.message}</p>
      <p className="text-[10px] text-slate-400 mb-2">{formatDate(msg.sent_date)}</p>
      <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => setViewMessage(msg)} className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">View</button>
        {msg.status === "Failed" && (
          <button onClick={() => handleRetry(msg.sms_id)} className="flex-1 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-all">Retry</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">SMS Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage and monitor broadcasts to PWD members</p>
        </div>
        <Buttons variant="primary" onClick={() => setShowCompose(true)} className="flex items-center justify-center w-full sm:w-auto">
          <span className="material-symbols-outlined text-base">send</span>
          Compose SMS
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
        placeholder="Search recipient or message..."
        options={[
          { value: "all",     label: "All Status" },
          { value: "sent",    label: "Sent" },
          { value: "pending", label: "Pending" },
          { value: "failed",  label: "Failed" },
        ]}
      />

      {/* ── Table ── */}
      {loading ? (
        <TableLoader rows={6} cols={columns.length} />
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          renderRow={renderRow}
          renderCard={renderCard}
          empty="No messages yet. Compose a new SMS."
          pagination={
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={goToPage} />
          }
        />
      )}

      {/* ── Compose Modal ── */}
      {showCompose && (
        <AddEditModal isOpen isEdit={false} title="SMS" icon="send"
          onCancel={() => { setShowCompose(false); setForm({ pwd_id: "", message: "", sendAll: false }); }}>
          <div className="flex flex-col gap-4">

            {/* ✅ Toggle: Single or All */}
            <div className="flex gap-2">
              <button
                onClick={() => setForm({ ...form, sendAll: false, pwd_id: "" })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  !form.sendAll
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span className="material-symbols-outlined text-base align-middle mr-1">person</span>
                Single PWD
              </button>
              <button
                onClick={() => setForm({ ...form, sendAll: true, pwd_id: "" })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  form.sendAll
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span className="material-symbols-outlined text-base align-middle mr-1">groups</span>
                All PWDs ({pwdList.length})
              </button>
            </div>

            {/* ✅ Searchable PWD Dropdown — only if single */}
            {!form.sendAll && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PWD Member</label>
                <PwdSearchDropdown
                  pwdList={pwdList}
                  value={form.pwd_id}
                  onChange={(id) => setForm({ ...form, pwd_id: id })}
                />
              </div>
            )}

            {form.sendAll && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700/30 text-xs text-blue-700 dark:text-blue-300">
                <span className="material-symbols-outlined text-base">info</span>
                This SMS will be sent to all <strong>{pwdList.length}</strong> active PWD members.
              </div>
            )}

            {/* Message */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Message</label>
              <textarea
                rows={4}
                placeholder="Write your SMS message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm
                  bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
              />
              <p className="text-[10px] text-slate-400 text-right">{form.message.length}/160 characters</p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { setShowCompose(false); setForm({ pwd_id: "", message: "", sendAll: false }); }}
                className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button
                onClick={form.sendAll ? handleSendAll : handleSend}
                disabled={sending || sendingAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60">
                <span className="material-symbols-outlined text-base">
                  {(sending || sendingAll) ? "hourglass_empty" : "send"}
                </span>
                {sending ? "Sending..." : sendingAll ? "Sending to all..." : form.sendAll ? `Send to All (${pwdList.length})` : "Send SMS"}
              </button>
            </div>
          </div>
        </AddEditModal>
      )}

      {/* ── View Modal ── */}
      {viewMessage && (
        <ViewModal title="Message Details" icon="sms"
          data={{
            "Recipient":   viewMessage.recipient_name,
            "Phone":       viewMessage.sent_to,
            "Status":      viewMessage.status,
            "Date & Time": new Date(viewMessage.sent_date).toLocaleString("en-PH"),
            "Message":     viewMessage.message,
          }}
          onClose={() => setViewMessage(null)}
        />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AdminSms;
