import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import { StatCardsLoader, TableLoader } from "../../components/ui/Loading";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid  from "../../components/ui/StatsGrid";
import DataTable  from "../../components/ui/DataTable";
import ViewModal  from "../../components/modals/ViewModal";

const API_BASE = `${API_URL}/api`;

const getToken   = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";

const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
};

const trendColors = {
  emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  orange:  "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
  blue:    "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  slate:   "text-slate-400 bg-slate-100 dark:bg-slate-800/20",
};

const statusColorMap = {
  Scheduled: "blue", Upcoming: "blue", Ongoing: "emerald", Completed: "slate",
};


const UserDashboard = () => {
  const [events, setEvents]     = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [viewEvent, setViewEvent] = useState(null);

const userName = localStorage.getItem("userName") || sessionStorage.getItem("userName") || "Guest";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = authHeader();
        // ✅ Backend already limits to 5 records
        const [eventsRes, healthRes, distributionRes] = await Promise.all([
          axios.get(`${API_BASE}/events/upcoming`,    { headers }),
          axios.get(`${API_BASE}/health/me`,          { headers }),
          axios.get(`${API_BASE}/distribution/me`,    { headers }),
        ]);
        setEvents(Array.isArray(eventsRes.data)       ? eventsRes.data       : []);
        setCheckups(Array.isArray(healthRes.data)     ? healthRes.data       : []);
        setDonations(Array.isArray(distributionRes.data) ? distributionRes.data : []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear(); sessionStorage.clear();
          window.location.href = "/login";
        } else { console.error("Failed to fetch dashboard data:", err); }
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const pendingAlerts = checkups.filter(c => c.health_status?.toLowerCase() === "follow-up").length;

  const statsdata = [
    { label: "Upcoming Events",    icon: "event",             value: events.length,    changeText: "events",          changeClass: "text-blue-600"    },
    { label: "Recent Checkups",    icon: "health_and_safety", value: checkups.length,  changeText: "health records",  changeClass: "text-emerald-600" },
    { label: "Pending Alerts",     icon: "notifications",     value: pendingAlerts,    changeText: "need attention",  changeClass: "text-orange-500"  },
    { label: "Received Donations", icon: "volunteer_activism", value: donations.length, changeText: "items received", changeClass: "text-emerald-600" },
  ];

  // ── Event columns with Start/End time ──
  const eventColumns = ["Event Name", "Date", "Start Time", "End Time", "Venue", "Status", "View"];

  const renderEventRow = (event) => {
    const color = statusColorMap[event.status] || "slate";
    return (
      <tr key={event.event_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td className="px-3 py-2.5 text-xs font-semibold dark:text-white whitespace-nowrap">{event.event_name}</td>
        <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(event.event_date)}</td>
        <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatTime(event.start_time)}</td>
        <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatTime(event.end_time)}</td>
        <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{event.location}</td>
        <td className="px-3 py-2.5">
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${trendColors[color]}`}>{event.status}</span>
        </td>
        <td className="px-3 py-2.5">
          <button onClick={() => setViewEvent(event)} className="text-slate-400 hover:text-blue-600 transition">
            <span className="material-symbols-outlined text-base">more_vert</span>
          </button>
        </td>
      </tr>
    );
  };

  const renderEventCard = (event) => {
    const color = statusColorMap[event.status] || "slate";
    return (
      <div key={event.event_id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-xs font-bold text-slate-900 dark:text-white">{event.event_name}</p>
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap ${trendColors[color]}`}>{event.status}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">Date</p><p className="text-[10px] text-slate-600 dark:text-slate-400">{formatDate(event.event_date)}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">Venue</p><p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{event.location}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">Start</p><p className="text-[10px] text-slate-600 dark:text-slate-400">{formatTime(event.start_time)}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">End</p><p className="text-[10px] text-slate-600 dark:text-slate-400">{formatTime(event.end_time)}</p></div>
        </div>
        <button onClick={() => setViewEvent(event)}
          className="w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          View Details
        </button>
      </div>
    );
  };

  const checkupColumns = ["Date", "BP", "Heart Rate", "Temp", "Weight", "Blood Sugar", "Status", "Remarks"];

  const renderCheckupRow = (chk, i) => (
    <tr key={chk.health_id ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(chk.recorded_at)}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400">{chk.blood_pressure ?? "—"}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400">{chk.heart_rate ? `${chk.heart_rate} bpm` : "—"}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400">{chk.temperature ? `${chk.temperature}°C` : "—"}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400">{chk.weight ? `${chk.weight} kg` : "—"}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400">{chk.blood_sugar ? `${chk.blood_sugar} mg/dL` : "—"}</td>
      <td className="px-3 py-2.5 text-xs font-bold dark:text-white">{chk.health_status ?? "—"}</td>
      <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate">{chk.remarks ?? "—"}</td>
    </tr>
  );

  const renderCheckupCard = (chk, i) => (
    <div key={chk.health_id ?? i} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{formatDate(chk.recorded_at)}</p>
        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">{chk.health_status ?? "—"}</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "BP",          value: chk.blood_pressure },
          { label: "Heart Rate",  value: chk.heart_rate ? `${chk.heart_rate} bpm` : null },
          { label: "Temp",        value: chk.temperature ? `${chk.temperature}°C` : null },
          { label: "Weight",      value: chk.weight ? `${chk.weight} kg` : null },
          { label: "Blood Sugar", value: chk.blood_sugar ? `${chk.blood_sugar} mg/dL` : null },
        ].map(v => (
          <p key={v.label} className="text-[10px] text-slate-500 dark:text-slate-400">
            <span className="font-medium">{v.label}:</span> {v.value ?? "—"}
          </p>
        ))}
      </div>
      {chk.remarks && <p className="text-[10px] text-slate-500 mt-1.5"><span className="font-medium">Remarks:</span> {chk.remarks}</p>}
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Welcome Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
        bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1">Barangay Trapiche · PWD System</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's your PWD dashboard overview with live stats and upcoming events.</p>
        </div>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={4} /> : (
        <StatsGrid>
          {statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}
        </StatsGrid>
      )}

      {/* ── Upcoming Events — no pagination, backend limits to 5 ── */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Upcoming Events</h3>
        {loading ? <TableLoader rows={5} cols={eventColumns.length} /> : (
          <DataTable
            columns={eventColumns}
            data={events}
            renderRow={renderEventRow}
            renderCard={renderEventCard}
            empty="No upcoming events."
          />
        )}
      </div>

      {/* ── Recent Checkups — no pagination, backend limits to 5 ── */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Recent Checkups</h3>
        {loading ? <TableLoader rows={5} cols={checkupColumns.length} /> : (
          <DataTable
            columns={checkupColumns}
            data={checkups}
            renderRow={renderCheckupRow}
            renderCard={renderCheckupCard}
            empty="No checkup records found."
          />
        )}
      </div>

      {/* ── View Event Modal ── */}
      {viewEvent && (
        <ViewModal title="Event Details" icon="event"
          data={{
            "Event Name":  viewEvent.event_name,
            "Date":        formatDate(viewEvent.event_date),
            "Start Time":  formatTime(viewEvent.start_time),
            "End Time":    formatTime(viewEvent.end_time),
            "Venue":       viewEvent.location,
            "Status":      viewEvent.status,
            "Description": viewEvent.description || "—",
          }}
          onClose={() => setViewEvent(null)}
        />
      )}
    </div>
  );
};

export default UserDashboard;