import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import RecentLogs from "../../features/dashbord/RecentLogs";
import { useNavigate } from "react-router-dom";
import PWDActionModal from "../../features/dashbord/PwdAction";

const BASE_URL = API_URL;
const API = `${BASE_URL}/api/dashboard`;


const getToken = () =>
  localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const trendColors = {
  emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  orange: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
  red: "text-red-500 bg-red-50 dark:bg-red-900/20",
  slate: "text-slate-400 bg-slate-100 dark:bg-slate-800/20",
};

const alertColors = {
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600" },
};

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
};

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalComponent, setModalComponent] = useState(null);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentPWDs, setRecentPWDs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Admin";

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const headers = authHeader();
        const [statsRes, chartRes, pwdsRes, logsRes] = await Promise.all([
          axios.get(`${API}/stats`, { headers }),
          axios.get(`${API}/chart`, { headers }),
          axios.get(`${API}/recent-pwds`, { headers }),
          axios.get(`${API}/logs`, { headers }),
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
        setRecentPWDs(pwdsRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);


  const handleRecentLogs = () => {
    setModalComponent(<RecentLogs logs={logs} onClose={() => setShowModal(false)} />);
    setShowModal(true);
  };

  const handlePWDAction = (pwd) => {
    setModalComponent(<PWDActionModal pwd={pwd} onClose={() => setShowModal(false)} />);
    setShowModal(true);
  };

  const maxChart = Math.max(...chartData.map((d) => d.value), 1);

  const summaryStats = [
    { title: "Total PWDs", value: stats?.totalPWDs ?? "—", icon: "groups", iconBg: "bg-blue-50", trendColor: "emerald" },
    { title: "Recent Releases", value: stats?.recentReleases ?? "—", icon: "pending_actions", iconBg: "bg-orange-50", trendColor: "orange" },
    { title: "Active Events", value: stats?.activeEvents ?? "—", icon: "event", iconBg: "bg-emerald-50", trendColor: "emerald" },
    { title: "Donations (Weekly)", value: stats?.weeklyDonations ?? "—", icon: "inventory", iconBg: "bg-purple-50", trendColor: "slate" },
  ];

  return (
    <div>
      <div className="p-8 max-w-7xl mx-auto w-full space-y-6 scroll-smooth">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl bg-blue-600 text-white p-8 md:p-10 shadow-lg">
          <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome, {userName}</h1>
            <p className="text-white/90 text-base md:text-lg font-medium">
              Managing the PWD System for Barangay Trapiche. Check the latest updates and monitoring stats below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => navigate("/PagesProfiling")} className="bg-white text-blue-600 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">person_add</span> New PWD Registration
              </button>
              <button onClick={handleRecentLogs} className="bg-white/20 border border-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">history</span> Recent Logs
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.title} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className={`${stat.iconBg} dark:${stat.iconBg}/30 rounded-lg flex items-center justify-center text-blue-600 size-10`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">
                  {loading ? <span className="animate-pulse">...</span> : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">System-wide Statistics</h3>
            <p className="text-slate-500 text-sm mb-4">Monthly PWD Registration Growth</p>
            <div className="relative h-64 w-full flex items-end justify-between px-2">
              {loading ? (
                <div className="w-full flex items-center justify-center h-full text-slate-400">Loading chart...</div>
              ) : chartData.length === 0 ? (
                <div className="w-full flex items-center justify-center h-full text-slate-400">No data yet</div>
              ) : (
                chartData.map((item, idx) => {
                  const barHeight = Math.max((item.value / maxChart) * 200, 8);
                  const isHighest = item.value === maxChart;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-3 w-full max-w-[40px]">
                      <div
                        className={`w-full rounded-t-lg relative group transition-all ${isHighest ? "bg-blue-600" : "bg-slate-100 dark:bg-slate-800"}`}
                        style={{ height: `${barHeight}px` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {item.value}
                        </div>
                      </div>
                      <p className={`${isHighest ? "text-blue-600" : "text-slate-400"} text-xs font-bold`}>
                        {item.month.slice(0, 3)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">Recent Alerts</h3>
              <button onClick={handleRecentLogs} className="text-blue-600 text-sm font-bold">View All</button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <p className="text-slate-400 text-sm text-center py-4">Loading...</p>
              ) : logs.slice(0, 3).map((log, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`${alertColors[log.color]?.bg || alertColors.blue.bg} flex items-center justify-center shrink-0 size-10 rounded-full`}>
                    <span className={`material-symbols-outlined ${alertColors[log.color]?.text || alertColors.blue.text} text-xl`}>{log.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold dark:text-white">{log.title}</p>
                    <p className="text-xs text-slate-500">{log.description}</p>
                    <span className="text-[10px] text-slate-400">{formatTimeAgo(log.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent PWD Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Recently Registered PWDs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Name</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Disability Type</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
                ) : recentPWDs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400">No PWDs registered yet</td></tr>
                ) : recentPWDs.map((pwd) => {
                  const initials = pwd.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                  const isActive = pwd.status === "active";
                  return (
                    <tr key={pwd.pwd_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full overflow-hidden shrink-0">
                            {pwd.image ? (
                              <img
                                src={`${BASE_URL}/uploads/${pwd.image}`}
                                alt={pwd.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                {initials}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-semibold dark:text-white">{pwd.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pwd.disability_type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pwd.contact_number}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${isActive ? trendColors.emerald : trendColors.slate}`}>
                          {pwd.status?.charAt(0).toUpperCase() + pwd.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handlePWDAction(pwd)} className="text-slate-400 hover:text-blue-600">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            {modalComponent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;