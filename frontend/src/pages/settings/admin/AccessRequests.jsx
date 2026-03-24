import { useState, useEffect } from "react";
import API_URL from "../../../api/api";
import StatsCards   from "../../../components/ui/StatsCards";
import StatsGrid from "../../../components/ui/StatsGrid";
import SearchBar    from "../../../components/ui/SearchBar";
import DataTable    from "../../../components/ui/DataTable";
import Pagination   from "../../../components/ui/Pagination";
import ConfirmModal from "../../../components/modals/ConfirmModal";

export default function AccessRequests({ showToast, onPendingCountChange }) {
  const [accessRequests, setAccessRequests] = useState([]);
  const [currentPage, setCurrentPage]       = useState(1);
  const [loading, setLoading]               = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeModal, setActiveModal]       = useState(null);
  const [filterStatus, setFilterStatus]     = useState("all");
  const [search, setSearch]                 = useState("");
  const itemsPerPage = 6;

  const fetchAccessRequests = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/api/access/requests`);
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : data.data || []).map((r) => ({
        id:         r.request_id,
        full_name:  r.full_name,
        email:      r.email,
        role:       r.role,
        created_at: r.created_at,
        status:     r.status,
      }));
      setAccessRequests(mapped);
      onPendingCountChange?.(mapped.filter((r) => r.status === "pending").length);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAccessRequests(); }, []);

  const updateRequestStatus = async (status) => {
    if (!selectedRequest) return;
    try {
      const endpoint = status === "approved"
        ? `${API_URL}/api/access/approve/${selectedRequest.id}`
        : `${API_URL}/api/access/reject/${selectedRequest.id}`;
      const res = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error("Failed to update status");
      setActiveModal(null);
      setSelectedRequest(null);
      showToast(`Request ${status} successfully!`, "success");
      fetchAccessRequests();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to update request.", "error");
    }
  };

  // ── Filter & Paginate ──
  const filtered = accessRequests.filter(
    (r) =>
      (filterStatus === "all" || r.status === filterStatus) &&
      (r.full_name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage   = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  // ── Stats ──
  const statsdata = [
    { label: "Total Requests", icon: "key",          value: accessRequests.length,                                          change: "", changeText: "all requests",    changeClass: "text-slate-500"   },
    { label: "Pending",        icon: "pending",       value: accessRequests.filter((r) => r.status === "pending").length,   change: "", changeText: "awaiting action", changeClass: "text-amber-500"   },
    { label: "Approved",       icon: "check_circle",  value: accessRequests.filter((r) => r.status === "approved").length,  change: "", changeText: "granted access",  changeClass: "text-emerald-600" },
    { label: "Rejected",       icon: "cancel",        value: accessRequests.filter((r) => r.status === "rejected").length,  change: "", changeText: "denied access",   changeClass: "text-red-500"     },
  ];

  // ── Table Row ──
  const renderRow = (req) => (
    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-4 lg:px-6 py-3 lg:py-4 font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap">{req.full_name}</td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-500 dark:text-slate-400">{req.email}</td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-700 dark:text-slate-300">{req.role}</td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <span className={`px-2.5 py-1 rounded-lg text-white text-[10px] font-bold uppercase
          ${req.status === "approved" ? "bg-emerald-600" : req.status === "rejected" ? "bg-red-600" : "bg-amber-500"}`}>
          {req.status}
        </span>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-500 whitespace-nowrap">
        {req.created_at ? new Date(req.created_at).toLocaleString("en-PH", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
        {req.status === "pending" && (
          <div className="flex justify-end gap-2">
            <button onClick={() => { setSelectedRequest(req); setActiveModal("approve"); }}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors">
              <span className="material-symbols-outlined text-xs">check_circle</span> Approve
            </button>
            <button onClick={() => { setSelectedRequest(req); setActiveModal("reject"); }}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors">
              <span className="material-symbols-outlined text-xs">close</span> Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );

  // ── Mobile Card ──
  const renderCard = (req) => (
    <div key={req.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 sm:p-4 shadow-sm">

      {/* ── Header: name + status badge ── */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{req.full_name}</p>
          <p className="text-xs text-slate-500 truncate">{req.email}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-white text-[10px] font-bold uppercase flex-shrink-0
        ${req.status === "approved" ? "bg-emerald-600" : req.status === "rejected" ? "bg-red-600" : "bg-amber-500"}`}>
          {req.status}
        </span>
      </div>

      {/* ── Role + Date ── */}
      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2.5">
        {req.role} · {req.created_at ? new Date(req.created_at).toLocaleDateString("en-PH") : "—"}
      </p>

      {/* ── Buttons — nasa baba, full width ── */}
      {req.status === "pending" && (
        <div className="flex gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => { setSelectedRequest(req); setActiveModal("approve"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Approve
          </button>
          <button
            onClick={() => { setSelectedRequest(req); setActiveModal("reject"); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
            Reject
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
        bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent
        p-3 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              Access Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review and manage incoming access requests
            </p>
          </div>
        </div>
      </div>

      <StatsGrid>
        {statsdata.map((stat, idx) => (
          <StatsCards key={idx} stat={stat} />
        ))}
      </StatsGrid>

      {/* ── Search ── */}
      <SearchBar
        searchValue={search}
        setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
        filterValue={filterStatus}
        setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
        placeholder="Search name or email..."
        options={[
          { value: "all",      label: "All Status" },
          { value: "pending",  label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ]}
      />

      {/* ── Table ── */}
      {loading ? (
        <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading requests...
        </div>
      ) : (
        <DataTable
          columns={["User", "Email", "Role", "Status", "Created Date", "Actions"]}
          data={paginated}
          renderRow={renderRow}
          renderCard={renderCard}
          empty="No requests found."
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          }
        />
      )}

      {/* ── Confirm Modal ── */}
      {activeModal && selectedRequest && (
        <ConfirmModal
          variant={activeModal === "approve" ? "success" : "danger"}
          title={activeModal === "approve" ? "Approve Request" : "Reject Request"}
          message={activeModal === "approve" ? "Confirm approval for" : "Confirm rejection for"}
          subject={selectedRequest.full_name}
          note={activeModal === "approve"
            ? "This will grant system access to the requested user."
            : "This will deny access and notify the user."
          }
          confirmText={activeModal === "approve" ? "Approve" : "Reject"}
          onConfirm={() => updateRequestStatus(activeModal === "approve" ? "approved" : "rejected")}
          onCancel={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}