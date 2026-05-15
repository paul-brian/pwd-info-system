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
import Modal from "../../components/modals/Modal";
import useToast from "../../hooks/useToast";

const EVENT_API = `${API_URL}/api/events`;
const ATT_API   = `${API_URL}/api/attendance`;

// ✅ Proper date format: March 1, 2026
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

// ✅ Format time: 08:00 → 8:00 AM
const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

// ✅ Convert to YYYY-MM-DD for input[type=date]
const toInputDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toISOString().slice(0, 10);
};

const statusBadge = {
  Ongoing:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Upcoming:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Scheduled: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const VENUE_OPTIONS = ["Barangay Hall", "Covered Court", "Health Center", "Others"];

// ✅ Per-event progress bar component
const ProgressBar = ({ present, total }) => {
  const progress  = total > 0 ? Math.round((present / total) * 100) : 0;
  const barColor  = progress >= 75 ? "bg-emerald-500" : progress >= 40 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {present}/{total}
      </span>
    </div>
  );
};

export default function EventAttendance() {
  const [events, setEvents]               = useState([]);
  const [attendance, setAttendance]       = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modal, setModal]                 = useState({ type: null, data: null });
  const [currentPage, setCurrentPage]     = useState(1);
  const { toasts, showToast, removeToast } = useToast();
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [loading, setLoading]             = useState(true);
  const [venueOther, setVenueOther]       = useState(false);
  const [editVenueOther, setEditVenueOther] = useState(false);
  const itemsPerPage = 6;

  const closeModal = () => {
    setModal({ type: null, data: null });
    setVenueOther(false);
    setEditVenueOther(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(EVENT_API);
      setEvents(res.data.map((e) => ({
        id:            e.event_id,
        name:          e.event_name,
        desc:          e.description,
        date:          e.event_date,
        start_time:    e.start_time || "",
        end_time:      e.end_time   || "",
        venue:         e.location,
        status:        e.status || "Scheduled",
        present_count: e.present_count || 0,
        absent_count:  e.absent_count  || 0,
        total_pwd:     e.total_pwd     || 0,
      })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // ── Attendance ──
  const openAttendance = async (event) => {
    setSelectedEvent(event);
    try {
      const res = await axios.get(`${ATT_API}/${event.id}`);
      setAttendance(res.data.map(u => ({ ...u, status: u.status || "default" })));
    } catch (err) { console.error(err); }
  };

  const markAttendance = async (pwd_id, status) => {
    try {
      await axios.post(`${ATT_API}/mark`, { event_id: selectedEvent.id, pwd_id, status });
      setAttendance((prev) => prev.map((u) => (u.pwd_id === pwd_id ? { ...u, status } : u)));
      fetchEvents();
      showToast("Attendance marked successfully!", "success");
    } catch (err) {
      showToast("Failed to mark attendance!", "error");
    }
  };

  // ── Event CRUD ──
  const handleSave = async (e) => {
    e.preventDefault();
    const f = e.target;
    const venueVal = f.venue_select.value === "Others"
      ? (f.venue_other?.value || "")
      : f.venue_select.value;

    const payload = {
      event_name:  f.event_name.value,
      description: f.desc.value,
      event_date:  f.event_date.value,
      start_time:  f.start_time.value || null,
      end_time:    f.end_time.value   || null,
      location:    venueVal,
      status:      f.status.value,
      created_by:  1,
    };
    try {
      if (modal.type === "edit") await axios.put(`${EVENT_API}/${modal.data.id}`, payload);
      else await axios.post(EVENT_API, payload);
      fetchEvents();
      closeModal();
      showToast(modal.type === "edit" ? "Event updated!" : "Event created!", "success");
    } catch (err) { showToast("Failed to save event.", "error"); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${EVENT_API}/${modal.data.id}`);
      fetchEvents();
      closeModal();
      showToast("Event deleted successfully!", "success");
    } catch (err) { showToast("Failed to delete event.", "error"); }
  };

  // ── Filter & Search ──
  const filtered = events.filter(ev => {
    const matchStatus = filterStatus === "all" || ev.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      ev.name.toLowerCase().includes(q) ||
      (ev.desc  || "").toLowerCase().includes(q) ||
      (ev.venue || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });
  const totalPages      = Math.ceil(filtered.length / itemsPerPage);
  const paginatedEvents = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── Stats — derived from all events ──
  const totalEvents    = events.length;
  const totalPresent   = events.reduce((s, e) => s + e.present_count, 0);
  const totalAbsent    = events.reduce((s, e) => s + e.absent_count,  0);
  const ongoingCount   = events.filter(e => e.status === "Ongoing").length;

  const statsdata = [
    { label: "Total Events",    icon: "event",       value: totalEvents,  changeText: "all events",  changeClass: "text-blue-600"    },
    { label: "Total Attendees", icon: "groups",      value: totalPresent, changeText: "present",     changeClass: "text-emerald-600" },
    { label: "Absent",          icon: "person_off",  value: totalAbsent,  changeText: "absent",      changeClass: "text-rose-600"    },
    { label: "Ongoing Events",  icon: "play_circle", value: ongoingCount, changeText: "ongoing",     changeClass: "text-green-600"   },
  ];

  const columns = ["ID", "Event", "Date", "Start", "End", "Venue", "Participants", "Status", "Attendance", "Actions"];

  const renderRow = (ev) => (
    <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-3 py-2.5 text-sm text-slate-500">{ev.id}</td>
      <td className="px-3 py-2.5">
        <p className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap">{ev.name}</p>
        <p className="text-xs text-slate-500 truncate max-w-[160px]">{ev.desc}</p>
      </td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDateDisplay(ev.date)}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatTime(ev.start_time)}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatTime(ev.end_time)}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{ev.venue}</td>
      <td className="px-3 py-2.5">
        <ProgressBar present={ev.present_count} total={ev.total_pwd} />
      </td>
      <td className="px-3 py-2.5">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${statusBadge[ev.status]}`}>{ev.status}</span>
      </td>
      <td className="px-3 py-2.5">
        <button onClick={() => openAttendance(ev)} className="text-xs font-bold text-primary hover:underline whitespace-nowrap">
          Attendance
        </button>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex gap-1">
          <button onClick={() => setModal({ type: "view", data: ev })} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          <button onClick={() => { setEditVenueOther(!VENUE_OPTIONS.slice(0,-1).includes(ev.venue)); setModal({ type: "edit", data: ev }); }}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button onClick={() => setModal({ type: "delete", data: ev })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-base">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = (ev) => (
    <div key={ev.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">{ev.name}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{ev.desc}</p>
        </div>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${statusBadge[ev.status]}`}>
          {ev.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Date</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400">{formatDateDisplay(ev.date)}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Venue</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{ev.venue}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Start</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400">{formatTime(ev.start_time)}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">End</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400">{formatTime(ev.end_time)}</p>
        </div>
      </div>

      <div className="mb-2.5">
        <ProgressBar present={ev.present_count} total={ev.total_pwd} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2.5 border-t border-slate-200 dark:border-slate-700">
        <button onClick={() => openAttendance(ev)} className="py-2 text-primary hover:bg-primary/10 rounded-lg text-[10px] font-semibold">Attendance</button>
        <button onClick={() => setModal({ type: "view", data: ev })} className="py-2 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-[10px] font-bold">View</button>
        <button onClick={() => { setEditVenueOther(!VENUE_OPTIONS.slice(0,-1).includes(ev.venue)); setModal({ type: "edit", data: ev }); }}
          className="py-2 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg text-[10px] font-bold">Edit</button>
        <button onClick={() => setModal({ type: "delete", data: ev })} className="py-2 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-[10px] font-bold">Delete</button>
      </div>
    </div>
  );

  const inputClass = "border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  const EventForm = () => {
    const isEdit     = modal.type === "edit";
    const d          = modal.data;
    const isOther    = isEdit ? editVenueOther : venueOther;
    const setIsOther = isEdit ? setEditVenueOther : setVenueOther;
    const defaultVenueSelect = isEdit
      ? (VENUE_OPTIONS.slice(0,-1).includes(d?.venue) ? d?.venue : "Others")
      : "";

    return (
      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Event Name *</label>
          <input name="event_name" placeholder="Enter event name" defaultValue={d?.name || ""} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Description</label>
          <textarea name="desc" placeholder="Enter description" defaultValue={d?.desc || ""} rows={2} className={inputClass + " resize-none"} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Date *</label>
          <input type="date" name="event_date" defaultValue={toInputDate(d?.date)} required className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Start Time</label>
            <input type="time" name="start_time" defaultValue={d?.start_time || ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">End Time</label>
            <input type="time" name="end_time" defaultValue={d?.end_time || ""} className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Venue *</label>
          <select name="venue_select" defaultValue={defaultVenueSelect}
            onChange={(e) => setIsOther(e.target.value === "Others")}
            required className={inputClass + " appearance-none"}>
            <option value="">— Select Venue —</option>
            {VENUE_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          {isOther && (
            <input name="venue_other" placeholder="Please specify venue..."
              defaultValue={isEdit && !VENUE_OPTIONS.slice(0,-1).includes(d?.venue) ? d?.venue : ""}
              required className={inputClass + " mt-1.5"} />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
          <select name="status" defaultValue={d?.status || "Scheduled"} className={inputClass + " appearance-none"}>
            <option value="Scheduled">Scheduled</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-2">
          <button type="button" onClick={closeModal} className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-slate-300">Cancel</button>
          <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">Save</button>
        </div>
      </form>
    );
  };

  // ── Attendance counts from current attendance state ──
  const presentCount = attendance.filter(a => a.status === "present").length;
  const absentCount  = attendance.filter(a => a.status === "absent").length;
  const defaultCount = attendance.filter(a => !a.status || a.status === "default").length;

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Event Attendance</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Monitor and manage PWD events</p>
        </div>
        <Buttons variant="primary" onClick={() => setModal({ type: "add", data: null })} className="flex items-center justify-center w-full sm:w-auto">
          Create Event
        </Buttons>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={4} /> : (
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
        placeholder="Search by event name, venue..."
        options={[
          { value: "all",       label: "All Status" },
          { value: "Scheduled", label: "Scheduled" },
          { value: "Upcoming",  label: "Upcoming" },
          { value: "Ongoing",   label: "Ongoing" },
          { value: "Completed", label: "Completed" },
        ]}
      />

      {/* ── Table ── */}
      {loading ? (
        <TableLoader rows={6} cols={columns.length} />
      ) : (
        <DataTable
          columns={columns}
          data={paginatedEvents}
          renderRow={renderRow}
          renderCard={renderCard}
          empty="No events found."
          pagination={
            totalPages > 1 ? (
              <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={(p) => setCurrentPage(p)} />
            ) : null
          }
        />
      )}

      {/* ── Attendance Modal ── */}
      {selectedEvent && (
        <Modal wide onClose={() => { setSelectedEvent(null); setAttendance([]); }}>
          <div className="p-4 sm:p-6">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{selectedEvent.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{formatDateDisplay(selectedEvent.date)}{selectedEvent.start_time ? ` · ${formatTime(selectedEvent.start_time)}` : ""}</p>
              </div>
              <button onClick={() => { setSelectedEvent(null); setAttendance([]); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>


            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Present: {presentCount}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Absent: {absentCount}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Default: {defaultCount}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold ml-auto">
                Total: {attendance.length}
              </span>
            </div>


            <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              {attendance.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">group_off</span>
                  <p className="text-sm font-medium">No PWD members found</p>
                </div>
              ) : attendance.map((user) => {
                const status = user.status || "default";
                return (
                  <div key={user.pwd_id} className="flex items-center justify-between px-3 py-2.5 gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Name + status indicator */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        status === "present" ? "bg-emerald-500" :
                        status === "absent"  ? "bg-rose-500" : "bg-slate-300 dark:bg-slate-600"
                      }`} />
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.full_name}</span>
                    </div>


                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => markAttendance(user.pwd_id, "default")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                          status === "default"
                            ? "bg-slate-500 text-white shadow-sm"
                            : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >Default</button>
                      <button
                        onClick={() => markAttendance(user.pwd_id, "present")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                          status === "present"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        }`}
                      >Present</button>
                      <button
                        onClick={() => markAttendance(user.pwd_id, "absent")}
                        className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                          status === "absent"
                            ? "bg-rose-600 text-white shadow-sm"
                            : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                        }`}
                      >Absent</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => { setSelectedEvent(null); setAttendance([]); }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── View Modal ── */}
      {modal.type === "view" && (
        <ViewModal title="Event Details" icon="event"
          data={{
            "Event Name":  modal.data.name,
            "Description": modal.data.desc || "—",
            "Date":        formatDateDisplay(modal.data.date),
            "Start Time":  formatTime(modal.data.start_time),
            "End Time":    formatTime(modal.data.end_time),
            "Venue":       modal.data.venue || "—",
            "Status":      modal.data.status,
          }}
          onClose={closeModal}
        />
      )}

      {/* ── Add Modal ── */}
      {modal.type === "add" && (
        <AddEditModal isOpen isEdit={false} title="Event" icon="event" onCancel={closeModal}>
          <EventForm />
        </AddEditModal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === "edit" && (
        <AddEditModal isOpen isEdit={true} title="Event" icon="event" onCancel={closeModal}>
          <EventForm />
        </AddEditModal>
      )}

      {/* ── Delete Modal ── */}
      {modal.type === "delete" && (
        <DeleteModal title="Delete Event" message="Are you sure you want to delete" subject={modal.data?.name}
          confirmText="Delete" onConfirm={handleDelete} onCancel={closeModal} />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}