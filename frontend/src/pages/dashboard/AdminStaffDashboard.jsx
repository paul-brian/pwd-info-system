import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api/api";
import { StatCardsLoader, SectionLoader, TableLoader } from "../../components/ui/Loading";
import { formatDate } from "../../config/formatDate";
import ViewModal from "../../components/modals/ViewModal";
import Buttons from "../../components/ui/Buttons";
import RecentAlert from "../../features/dashbord/RecentAlert";
import RecentLogs from "../../features/dashbord/RecentLogs";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid  from "../../components/ui/StatsGrid";
import DataTable  from "../../components/ui/DataTable";
import PWDActionModal from "../../features/dashbord/PwdAction";

const BASE_URL  = API_URL;
const API       = `${BASE_URL}/api/dashboard`;
const API_LOGS  = `${BASE_URL}/api/logs`;

const getToken   = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60)     return "Just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
};

const alertColors = {
  blue:    { bg: "bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600" },
  orange:  { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600" },
};

const Dashboard = () => {
  const [modal, setModal]         = useState({ open: false, type: null, data: null });
  const [stats, setStats]         = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentPWDs, setRecentPWDs] = useState([]);
  const [logs, setLogs]           = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Admin";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const headers = authHeader();
        const [statsRes, chartRes, pwdsRes, logsRes, activityRes] = await Promise.all([
          axios.get(`${API}/stats`,       { headers }),
          axios.get(`${API}/chart`,       { headers }),
          axios.get(`${API}/recent-pwds`, { headers }),
          axios.get(`${API}/logs`,        { headers }),      // dashboard logs → RecentAlert
          axios.get(`${API_LOGS}`,        { headers }),      // activity logs  → RecentLogs
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
        setRecentPWDs(pwdsRes.data);
        setLogs(logsRes.data);
        setActivityLogs(Array.isArray(activityRes.data) ? activityRes.data : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Modals ──
  const openModal  = (type, data) => setModal({ open: true, type, data });
  const closeModal = () => setModal({ type: null, data: null });

  // ── Open Recent Alerts modal (dashboard logs) ──
  const handleRecentAlerts = () => openModal("alerts", logs);

  // ── Open Recent Logs modal (activity logs) ──
  const handleRecentLogs = () => openModal("logs", activityLogs);

  const maxChart = Math.max(...chartData.map((d) => d.value), 1);

  const statsdata = [
    { label: "Total PWDs",         icon: "groups",          value: stats?.totalPWDs       ?? "—", changeText: "registered",  changeClass: "text-blue-600"    },
    { label: "Recent Releases",    icon: "pending_actions", value: stats?.recentReleases  ?? "—", changeText: "this week",   changeClass: "text-orange-500"  },
    { label: "Active Events",      icon: "event",           value: stats?.activeEvents    ?? "—", changeText: "ongoing",     changeClass: "text-emerald-600" },
    { label: "Donations (Weekly)", icon: "inventory",       value: stats?.weeklyDonations ?? "—", changeText: "this week",   changeClass: "text-slate-500"   },
  ];

 const columns=["PWD_number", "PWD Name", "Disability Type", "Contact", "Status", "Created_Date"];

  // ── Desktop row for recent PWDs ──
  const renderRow = (pwd) => (
    <tr key={pwd.pwd_number} className="text-center align-middle hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150">
      <td className="px-3 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm font-bold text-slate-900 dark:text-white">{pwd.pwd_number}</td>
      <td className="px-3 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400 font-medium">{pwd.full_name}</td>
      <td className="px-3 lg:px-5 2xl:px-6 py-3 lg:py-4">
        <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-lg text-[10px] lg:text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {pwd.disability_type}
        </span>
      </td>
      <td className="px-3 lg:px-5 2xl:px-6 py-3 lg:py-4">{pwd.contact_number}</td>
      <td className="px-3 lg:px-5 2xl:px-6 py-3 lg:py-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] sm:text-xs font-bold flex-shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
          {pwd.status?.charAt(0).toUpperCase() + pwd.status?.slice(1)}
        </span>
      </td>
      <td className="px-3 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">{formatDate(pwd.created_at)}</td>
    </tr>
  );

  // ── Mobile card for recent PWDs ──
  const renderCard = (pwd) => (
    <div key={pwd.pwd_number} className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/40 p-4 sm:p-5 transition-colors active:bg-slate-50 dark:active:bg-slate-800/40">
      <div className="flex justify-between items-start gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">full Name</p>
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{pwd.full_name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2.5">
        {[
          { label: "PWD Number", value: pwd.pwd_number },
          { label: "Disability Type", value: pwd.disability_type },
          { label: "Status", value: pwd.status },
          { label: "Created_Date", value: formatDate(pwd.created_at) },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className={`text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200 ${item.truncate ? "truncate" : ""}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Welcome Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
        bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Managing the PWD System for Barangay Trapiche. Check the latest updates and monitoring stats below.
          </p>
          <div className="mt-2 flex flex-col sm:flex-row flex-wrap gap-2">
            <Buttons icon="person_add" variant="primary" onClick={() => navigate("/PagesProfiling")} className="flex items-center justify-center w-full sm:w-auto">
              Add New PWD
            </Buttons>
            <Buttons icon="history" variant="secondary" onClick={handleRecentLogs} className="flex items-center justify-center w-full sm:w-auto">
              Recent Logs
            </Buttons>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={4} /> : (
        <StatsGrid>
          {statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}
        </StatsGrid>
      )}

      {/* ── Chart + Recent Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-7 shadow-sm">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">System-wide Statistics</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Monthly PWD Registration Growth</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 pt-2 rounded-lg uppercase tracking-wider">
              Updated
            </div>
          </div>

          <div className="relative h-64 md:h-80 w-full">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-t border-slate-200 dark:border-slate-700/40" />
              ))}
            </div>
            <div className="relative h-full overflow-x-auto pb-2">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <SectionLoader message="Loading chart..." />
                </div>
              ) : chartData.length === 0 ? (
                <div className="w-full flex items-center justify-center h-full text-slate-400 text-sm italic">No data available.</div>
              ) : (
                <div className="flex items-end gap-3 sm:gap-4 md:gap-6 min-w-max h-full px-2 pb-10">
                  {chartData.map((item, idx) => {
                    const chartMaxHeight = 180;
                    const isHighest = item.value === maxChart;
                    const barHeight = Math.max((item.value / maxChart) * chartMaxHeight, 10);
                    return (
                      <div key={idx} className="flex flex-col items-center group relative min-w-[40px] sm:min-w-[48px]">
                        <span className={`text-[10px] font-bold mb-2 ${isHighest ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                          {item.value}
                        </span>
                        <div
                          className={`w-8 sm:w-10 md:w-12 rounded-t-lg transition-all duration-500 ${isHighest ? "bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_4px_15px_rgba(37,99,235,0.2)]" : "bg-slate-100 dark:bg-slate-800"}`}
                          style={{ height: `${barHeight}px` }}
                        />
                        <div className="absolute -bottom-8">
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isHighest ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`}>
                            {item.month.slice(0, 3)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Alerts — galing sa /api/dashboard/logs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 dark:text-white text-base font-bold">Recent Alerts</h3>
            <button onClick={handleRecentAlerts} className="text-blue-600 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {loading ? (
              <SectionLoader message="Loading alerts..." />
            ) : logs.slice(0, 3).map((log, idx) => (
              <div key={idx} className="flex gap-3 p-2 md:p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`${alertColors[log.color]?.bg || alertColors.blue.bg} flex items-center justify-center shrink-0 size-9 rounded-full`}>
                  <span className={`material-symbols-outlined ${alertColors[log.color]?.text || alertColors.blue.text} text-lg`}>{log.icon}</span>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="text-xs font-bold dark:text-white truncate">{log.title}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{log.description}</p>
                  <span className="text-[9px] text-slate-400">{formatTimeAgo(log.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent PWDs Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-slate-900 dark:text-white text-base font-bold">Latest PWD Registrations</h3>
        </div>
        {loading ? (
          <TableLoader rows={3} cols={columns.length} />
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={recentPWDs}
              renderRow={renderRow}
              renderCard={renderCard}
              empty="No PWDs registered yet."
            />
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modal.type === "view" && (
        <ViewModal title="View PWD Profile" icon="person" data={modal.data} onClose={closeModal} />
      )}

      {modal.type === "alerts" && (
        <RecentAlert logs={modal.data} onClose={closeModal} />
      )}

      {modal.type === "logs" && (
        <RecentLogs logs={modal.data} onClose={closeModal} />
      )}

      {modal.type === "action" && (
        <PWDActionModal pwd={modal.data} onClose={closeModal} />
      )}
    </div>
  );
};

export default Dashboard;