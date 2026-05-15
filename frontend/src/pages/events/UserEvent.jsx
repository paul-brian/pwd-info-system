import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid  from "../../components/ui/StatsGrid";
import SearchBar  from "../../components/ui/SearchBar";
import DataTable  from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import { StatCardsLoader, TableLoader } from "../../components/ui/Loading";

const BASE_URL = `${API_URL}/api`;

const getToken   = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const formatDate = (dateStr) =>
  dateStr ? new Date(dateStr).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";

const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

const statusColors = {
  present:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  absent:    "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  Scheduled: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Upcoming:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Ongoing:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

const statusIcon = {
  present: "check_circle", absent: "cancel",
  Scheduled: "schedule", Upcoming: "pending_actions", Ongoing: "play_circle", Completed: "task_alt",
};

const statusLabel = { present: "Attended", absent: "Absent" };

const UserEventAttendance = () => {
  const [activeTab, setActiveTab]   = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [allEvents, setAllEvents]   = useState([]);  // ✅ All events from /api/events
  const [upcoming, setUpcoming]     = useState([]);
  const [loading, setLoading]       = useState(true);

  const [allPage, setAllPage]           = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [historyPage, setHistoryPage]   = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const headers = authHeader();
        const [attendanceRes, upcomingRes, allEventsRes] = await Promise.all([
          axios.get(`${BASE_URL}/attendance/me`,   { headers }),
          axios.get(`${BASE_URL}/events/upcoming`, { headers }),
          axios.get(`${BASE_URL}/events`,          { headers: {} }), // public
        ]);
        setAttendance(attendanceRes.data);
        setUpcoming(upcomingRes.data);
        setAllEvents(Array.isArray(allEventsRes.data) ? allEventsRes.data : []);
      } catch (err) { console.error("Fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const stats = {
    total:    allEvents.length,
    present:  attendance.filter(e => e.status === "present").length,
    absent:   attendance.filter(e => e.status === "absent").length,
    upcoming: upcoming.length,
  };

  const statsdata = [
    { label: "Total Events", icon: "event",           value: stats.total,    changeText: "events",   changeClass: "text-slate-500"   },
    { label: "Attended",     icon: "how_to_reg",      value: stats.present,  changeText: "attended",  changeClass: "text-emerald-600" },
    { label: "Absent",       icon: "event_busy",      value: stats.absent,   changeText: "missed",    changeClass: "text-red-500"     },
    { label: "Upcoming",     icon: "pending_actions", value: stats.upcoming, changeText: "scheduled", changeClass: "text-blue-600"    },
  ];

  const columns = ["Event Name", "Date", "Start Time", "End Time", "Location", "Check-in", "Status"];

  // ✅ All events tab — from /api/events
  const allEventsWithStatus = allEvents.map(e => {
    const myRecord = attendance.find(a => a.event_name === e.event_name && a.event_date?.slice(0,10) === e.event_date?.slice(0,10));
    return {
      ...e,
      _key:         `all-${e.event_id}`,
      _type:        "all",
      displayStatus: myRecord ? myRecord.status : e.status,
      check_in_time: myRecord?.check_in_time || null,
    };
  });

  const historyEvents = attendance.map(e => ({ ...e, _key: `history-${e.attendance_id}`, _type: "history" }));
  const upcomingEvents = upcoming.map(e => ({ ...e, _key: `upcoming-${e.event_id}`, _type: "upcoming", displayStatus: e.status }));

  const applySearch = (list) => list.filter(e => {
    const name = (e.event_name || "").toLowerCase();
    const loc  = (e.location   || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || loc.includes(q);
  });

  const filteredAll      = applySearch(allEventsWithStatus);
  const filteredUpcoming = applySearch(upcomingEvents);
  const filteredHistory  = applySearch(historyEvents);

  const totalAllPages      = Math.max(1, Math.ceil(filteredAll.length / itemsPerPage));
  const totalUpcomingPages = Math.max(1, Math.ceil(filteredUpcoming.length / itemsPerPage));
  const totalHistoryPages  = Math.max(1, Math.ceil(filteredHistory.length / itemsPerPage));

  const paginatedAll      = filteredAll.slice((allPage - 1) * itemsPerPage, allPage * itemsPerPage);
  const paginatedUpcoming = filteredUpcoming.slice((upcomingPage - 1) * itemsPerPage, upcomingPage * itemsPerPage);
  const paginatedHistory  = filteredHistory.slice((historyPage - 1) * itemsPerPage, historyPage * itemsPerPage);

  const currentData       = activeTab === "All" ? paginatedAll : activeTab === "Upcoming" ? paginatedUpcoming : paginatedHistory;
  const currentTotal      = activeTab === "All" ? filteredAll.length : activeTab === "Upcoming" ? filteredUpcoming.length : filteredHistory.length;
  const currentTotalPages = activeTab === "All" ? totalAllPages : activeTab === "Upcoming" ? totalUpcomingPages : totalHistoryPages;
  const currentPage       = activeTab === "All" ? allPage : activeTab === "Upcoming" ? upcomingPage : historyPage;
  const setCurrentPage    = activeTab === "All" ? setAllPage : activeTab === "Upcoming" ? setUpcomingPage : setHistoryPage;

  const renderRow = (event) => {
    const isHistory  = event._type === "history";
    const dispStatus = event.displayStatus || event.status;
    const colorKey   = isHistory ? (event.status || "absent") : (event.status || "Scheduled");
    return (
      <tr key={event._key} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
        <td className="px-3 py-2.5 text-xs font-medium text-slate-900 dark:text-white whitespace-nowrap">{event.event_name}</td>
        <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDate(event.event_date)}</td>
        <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatTime(event.start_time)}</td>
        <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatTime(event.end_time)}</td>
        <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400">{event.location || "—"}</td>
        <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {event.check_in_time
            ? new Date(event.check_in_time).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })
            : "—"}
        </td>
        <td className="px-3 py-2.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${statusColors[colorKey] || statusColors.Scheduled}`}>
            <span className="material-symbols-outlined text-[10px]">{statusIcon[colorKey] || "schedule"}</span>
            {isHistory ? (statusLabel[event.status] || event.status) : dispStatus}
          </span>
        </td>
      </tr>
    );
  };

  const renderCard = (event) => {
    const isHistory = event._type === "history";
    const colorKey  = isHistory ? (event.status || "absent") : (event.status || "Scheduled");
    return (
      <div key={event._key} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
        <div className="flex justify-between items-start gap-2 mb-2">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate flex-1">{event.event_name}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${statusColors[colorKey] || statusColors.Scheduled}`}>
            <span className="material-symbols-outlined text-[10px]">{statusIcon[colorKey] || "schedule"}</span>
            {isHistory ? (statusLabel[event.status] || event.status) : event.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">Date</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(event.event_date)}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">Location</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{event.location || "—"}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">Start</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatTime(event.start_time)}</p></div>
          <div><p className="text-[9px] text-slate-400 uppercase font-semibold">End</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatTime(event.end_time)}</p></div>
          {event.check_in_time && (
            <div className="col-span-2"><p className="text-[9px] text-slate-400 uppercase font-semibold">Check-in</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{new Date(event.check_in_time).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col overflow-y-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
      <div className="flex flex-col gap-4 sm:gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
          bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-lg">event_available</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">PWD Event Attendance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Event Attendance</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">View and manage your event participation records</p>
          </div>
        </div>

        {/* ── Stats ── */}
        {loading ? <StatCardsLoader count={4} /> : (
          <StatsGrid>
            {statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}
          </StatsGrid>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1 sm:gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {["All", "Upcoming", "History"].map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setAllPage(1); setUpcomingPage(1); setHistoryPage(1); }}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-primary"}`}>
              {tab} Events
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                {tab === "All" ? filteredAll.length : tab === "Upcoming" ? filteredUpcoming.length : filteredHistory.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <SearchBar
          searchValue={searchQuery}
          setSearchValue={(val) => { setSearchQuery(val); setAllPage(1); setUpcomingPage(1); setHistoryPage(1); }}
          placeholder="Search event or location..."
        />

        {/* ── Table ── */}
        {loading ? <TableLoader rows={6} cols={columns.length} /> : (
          <DataTable
            columns={columns}
            data={currentData}
            renderRow={renderRow}
            renderCard={renderCard}
            empty={activeTab === "Upcoming" ? "No upcoming events." : "No events found."}
            pagination={
              <Pagination
                currentPage={currentPage}
                totalPages={currentTotalPages}
                totalItems={currentTotal}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            }
          />
        )}
      </div>
    </main>
  );
};

export default UserEventAttendance;