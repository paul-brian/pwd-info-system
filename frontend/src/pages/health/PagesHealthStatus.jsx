import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import { StatCardsLoader, TableLoader, SectionLoader } from "../../components/ui/Loading";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid  from "../../components/ui/StatsGrid";
import SearchBar  from "../../components/ui/SearchBar";
import DataTable  from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import ViewModal  from "../../components/modals/ViewModal";

const BASE_URL = API_URL;
const API      = `${BASE_URL}/api`;

const getToken   = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";

const statusColors = {
  Stable:      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  "Follow-up": "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  Critical:    "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  Normal:      "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
};
const getStatusColor = (status) => statusColors[status] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

const HealthRecords = () => {
  const [health, setHealth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewRecord, setViewRecord] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get(`${API}/health/me`, { headers: authHeader() });
        setHealth(Array.isArray(res.data) ? res.data : []);
        setData(res.data);
      } catch (err) { console.error("Failed to fetch health records:", err); }
      finally { setLoading(false); }
    };
    fetchHealth();
  }, []);


  // ── Filter & Paginate ──
  const filtered = health.filter((record) => {
    const matchSearch =
      (record.blood_pressure || "").toLowerCase().includes(search.toLowerCase()) ||
      (record.remarks        || "").toLowerCase().includes(search.toLowerCase()) ||
      (record.health_status  || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || record.health_status === filterStatus;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage   = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  // ── Stats ──
  const latestRecord = health?.[0] || {};
  const stableCount   = health.filter((h) => h.health_status?.toLowerCase() === "stable").length;
  const followUpCount = health.filter((h) => h.health_status?.toLowerCase() === "follow-up").length;
  const criticalCount = health.filter((h) => h.health_status?.toLowerCase() === "critical").length;

  const statsdata = [
    { label: "Total Records", icon: "health_and_safety", value: health.length,   change: "", changeText: "all records",     changeClass: "text-blue-600"    },
    { label: "Stable",        icon: "verified",          value: stableCount,     change: "", changeText: "good condition",  changeClass: "text-emerald-600" },
    { label: "Follow-up",     icon: "pending_actions",   value: followUpCount,   change: "", changeText: "needs follow-up", changeClass: "text-amber-500"   },
    { label: "Critical",      icon: "emergency",         value: criticalCount,   change: "", changeText: "critical status", changeClass: "text-red-500"     },
  ];

  const columns= ["Date", "Blood Pressure", "Heart Rate", "Temp", "Weight", "Blood Sugar", "Status", "Remarks", "Actions"];

  // ── Desktop Row ──
  const renderRow = (record) => (
    <tr key={record.health_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(record.recorded_at)}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-semibold text-slate-900 dark:text-white">
        {record.blood_pressure || "—"}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-600 dark:text-slate-400">
        {record.heart_rate ? `${record.heart_rate} bpm` : "—"}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-600 dark:text-slate-400">
        {record.temperature ? `${record.temperature}°C` : "—"}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-600 dark:text-slate-400">
        {record.weight ? `${record.weight} kg` : "—"}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-600 dark:text-slate-400">
        {record.blood_sugar ? `${record.blood_sugar} mg/dL` : "—"}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${getStatusColor(record.health_status)}`}>
          {record.health_status || "—"}
        </span>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate">
        {record.remarks || "—"}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-right">
        <button onClick={() => setViewRecord(record)}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-lg">visibility</span>
        </button>
      </td>
    </tr>
  );

  // ── Mobile Card ──
  const renderCard = (record) => (
    <div key={record.health_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(record.recorded_at)}</p>
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${getStatusColor(record.health_status)}`}>
          {record.health_status || "—"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2.5">
        {[
          { label: "Blood Pressure", value: record.blood_pressure },
          { label: "Heart Rate",     value: record.heart_rate ? `${record.heart_rate} bpm` : null },
          { label: "Temperature",    value: record.temperature ? `${record.temperature}°C` : null },
          { label: "Weight",         value: record.weight ? `${record.weight} kg` : null },
          { label: "Blood Sugar",    value: record.blood_sugar ? `${record.blood_sugar} mg/dL` : null },
        ].map((vital) => (
          <div key={vital.label}>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">{vital.label}</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{vital.value || "—"}</p>
          </div>
        ))}
      </div>
      {record.remarks && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mb-2.5">
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Remarks</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{record.remarks}</p>
        </div>
      )}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => setViewRecord(record)}
          className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <span className="font-bold">View Details</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
        bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-lg">health_and_safety</span>
            <span className="text-xs font-semibold uppercase tracking-widest">PWD Health Monitoring</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Health Records</h1>
          <p className=" mt-1 text-xs sm:text-sm">
            Complete medical history and vitals monitored by Barangay Trapiche
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={4} /> :
        <StatsGrid>
          {statsdata.map((stat, idx) => (
            <StatsCards key={idx} stat={stat} />
          ))}
        </StatsGrid>}

      {/* ── Latest Vitals Card ── */}
      {loading ? <SectionLoader message="Loading Health Records..." /> : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-600 text-base">monitor_heart</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Latest Vitals</h3>
            <span className="ml-auto text-xs text-slate-400">{formatDate(latestRecord.recorded_at)}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "Blood Pressure", value: latestRecord.blood_pressure,                                             icon: "favorite" },
              { label: "Heart Rate",     value: latestRecord.heart_rate    ? `${latestRecord.heart_rate} bpm`    : "—", icon: "cardiology" },
              { label: "Temperature",    value: latestRecord.temperature   ? `${latestRecord.temperature}°C`     : "—", icon: "device_thermostat" },
              { label: "Weight",         value: latestRecord.weight        ? `${latestRecord.weight} kg`         : "—", icon: "scale" },
              { label: "Blood Sugar",    value: latestRecord.blood_sugar   ? `${latestRecord.blood_sugar} mg/dL` : "—", icon: "water_drop" },
              { label: "Status",         value: latestRecord.health_status,                                               icon: "verified", isStatus: true },
            ].map((vital) => (
              <div key={vital.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex flex-col gap-1">
                <span className="material-symbols-outlined text-blue-500 text-sm">{vital.icon}</span>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{vital.label}</p>
                {vital.isStatus ? (
                  <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg w-fit ${getStatusColor(vital.value)}`}>
                    {vital.value || "—"}
                  </span>
                ) : (
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{vital.value || "—"}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Search ── */}
      <SearchBar
        searchValue={search}
        setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
        filterValue={filterStatus}
        setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
        placeholder="Search by BP, status, or remarks..."
      />

      {/* ── Table ── */}
      {loading ? (
        <TableLoader rows={6} columns={columns.length} />
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          renderRow={renderRow}
          renderCard={renderCard}
          empty="No health records found."
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

      {/* ── View Modal ── */}
      {viewRecord && (
        <ViewModal
          title="Health Record Details"
          icon="health_and_safety"
          data={{
            "Date":           formatDate(viewRecord.recorded_at),
            "Blood Pressure": viewRecord.blood_pressure || "—",
            "Heart Rate":     viewRecord.heart_rate ? `${viewRecord.heart_rate} bpm` : "—",
            "Temperature":    viewRecord.temperature ? `${viewRecord.temperature}°C` : "—",
            "Weight":         viewRecord.weight ? `${viewRecord.weight} kg` : "—",
            "Blood Sugar":    viewRecord.blood_sugar ? `${viewRecord.blood_sugar} mg/dL` : "—",
            "Status":         viewRecord.health_status || "—",
            "Remarks":        viewRecord.remarks || "—",
          }}
          onClose={() => setViewRecord(null)}
        />
      )}
    </div>
  );
};

export default HealthRecords;