import { useState, useEffect } from "react";
import API_URL from "../../api/api";
import axios from "axios";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid from "../../components/ui/StatsGrid";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import AddEditModal from "../../components/modals/AddEditModal";
import DeleteModal from "../../components/modals/DeleteModal";
import ViewModal from "../../components/modals/ViewModal";
import Modal from "../../components/modals/Modal"; // ← para sa Attendance modal (wide)

const EVENT_API = `${API_URL}/api/events`;
const ATT_API   = `${API_URL}/api/attendance`;

const statusBadge = {
  Ongoing:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Upcoming:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Scheduled: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function EventAttendance() {
  const [events, setEvents]               = useState([]);
  const [attendance, setAttendance]       = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modal, setModal]                 = useState({ type: null, data: null });
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage = 6;

  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("all");

  const closeModal = () => setModal({ type: null, data: null });

  // ── Fetch Events ──
  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(EVENT_API);
      setEvents(res.data.map((e) => ({
        id:         e.event_id,
        name:       e.event_name,
        desc:       e.description,
        date:       e.event_date,
        venue:      e.location,
        registered: e.registered || 0,
        capacity:   e.capacity || 0,
        status:     e.status || "Scheduled",
      })));
    } catch (err) { console.error(err); }
  };

  // ── Attendance ──
  const openAttendance = async (event) => {
    setSelectedEvent(event);
    try {
      const res = await axios.get(`${ATT_API}/${event.id}`);
      setAttendance(res.data);
    } catch (err) { console.error(err); }
  };

  const markAttendance = async (pwd_id, status) => {
    try {
      await axios.post(`${ATT_API}/mark`, { event_id: selectedEvent.id, pwd_id, status });
      setAttendance((prev) => prev.map((u) => (u.pwd_id === pwd_id ? { ...u, status } : u)));
      fetchEvents();
    } catch (err) { console.error(err); }
  };

  // ── Event CRUD ──
  const handleSave = async (e) => {
    e.preventDefault();
    const f = e.target;
    const payload = {
      event_name:  f.name.value,
      description: f.desc.value,
      event_date:  f.date.value,
      location:    f.venue.value,
      capacity:    Number(f.capacity.value),
      registered:  Number(f.registered.value),
      status:      f.status.value,
      created_by:  1,
    };
    try {
      if (modal.type === "edit") await axios.put(`${EVENT_API}/${modal.data.id}`, payload);
      else await axios.post(EVENT_API, payload);
      fetchEvents();
      closeModal();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${EVENT_API}/${modal.data.id}`);
      fetchEvents();
      closeModal();
    } catch (err) { console.error(err); }
  };

  // ── Filter & Paginate ──
  const filtered = events.filter(ev => {
    const matchStatus = filterStatus === "all" || ev.status === filterStatus;
    const matchSearch =
      ev.name.toLowerCase().includes(search.toLowerCase()) ||
      (ev.desc  || "").toLowerCase().includes(search.toLowerCase()) ||
      (ev.venue || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });
  const totalPages      = Math.ceil(filtered.length / itemsPerPage);
  const paginatedEvents = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── Stats ──
  const today = new Date();
  const ongoingEvents   = events.filter(e => e.status === "Ongoing").length;
  const next30Days      = events.filter(e => { const d = new Date(e.date); const diff = (d - today) / (1000*60*60*24); return diff >= 0 && diff <= 30; }).length;
  const totalAttendees  = events.reduce((sum, e) => sum + e.registered, 0);
  const pendingCheckins = events.reduce((sum, e) => sum + (e.capacity - e.registered), 0);

  const statsdata = [
    { label: "Ongoing Events",        icon: "groups",  value: ongoingEvents,   change: "+12%", changeText: "from last month", changeClass: "text-emerald-600" },
    { label: "Next 30 Days",          icon: "event",   value: next30Days,      change: "+5%",  changeText: "upcoming",        changeClass: "text-emerald-600" },
    { label: "Total Attendees (MTD)", icon: "people",  value: totalAttendees,  change: "",     changeText: "registered",      changeClass: "text-primary" },
    { label: "Pending Check-ins",     icon: "pending", value: pendingCheckins, change: "",     changeText: "remaining slots", changeClass: "text-rose-600" },
  ];

  // ── Desktop row ──
  const renderRow = (ev) => {
    const progress = ev.capacity ? Math.round((ev.registered / ev.capacity) * 100) : 0;
    return (
      <tr key={ev.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
        <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-[#4e7397]">{ev.id}</td>
        <td className="px-4 lg:px-5 py-3 lg:py-4">
          <p className="font-bold text-sm text-[#0e141b] dark:text-white">{ev.name}</p>
          <p className="text-xs text-slate-500 truncate max-w-[200px]">{ev.desc}</p>
        </td>
        <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{ev.date}</td>
        <td className="px-4 lg:px-5 py-3 lg:py-4 text-sm text-slate-600 dark:text-slate-400">{ev.venue}</td>
        <td className="px-4 lg:px-5 py-3 lg:py-4">
          <div className="flex items-center gap-2">
            <div className="w-20 lg:w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
              <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">{ev.registered}/{ev.capacity}</span>
          </div>
        </td>
        <td className="px-4 lg:px-5 py-3 lg:py-4">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge[ev.status]}`}>{ev.status}</span>
        </td>
        <td className="px-4 lg:px-5 py-3 lg:py-4">
          <button onClick={() => openAttendance(ev)}
            className="text-xs font-bold text-primary hover:text-primary/80 hover:underline transition-colors">
            View
          </button>
        </td>
        <td className="px-4 lg:px-5 py-3 lg:py-4">
          <div className="flex gap-1">
            <button onClick={() => setModal({ type: "view", data: ev })}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-lg">visibility</span>
            </button>
            <button onClick={() => setModal({ type: "edit", data: ev })}
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-lg">edit</span>
            </button>
            <button onClick={() => setModal({ type: "delete", data: ev })}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // ── Mobile card ──
  const renderCard = (ev) => {
    const progress = ev.capacity ? Math.round((ev.registered / ev.capacity) * 100) : 0;
    return (
      <div key={ev.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm">

        {/* ── Header: name + status badge ── */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {/* line-clamp-2 para hindi masisira ang layout kahit mahaba ang name */}
            <p className="font-bold text-xs text-[#0e141b] dark:text-white line-clamp-2 leading-snug">{ev.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{ev.desc}</p>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${statusBadge[ev.status]}`}>
            {ev.status}
          </span>
        </div>

        {/* ── Date + Venue ── */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Date</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400">{ev.date}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Venue</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{ev.venue}</p>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap flex-shrink-0">
            {ev.registered}/{ev.capacity}
          </span>
        </div>

        {/* ── Buttons — 2x2 grid sa 320px, 4 columns sa sm+ ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2.5 border-t border-slate-200 dark:border-slate-700">
          <button onClick={() => openAttendance(ev)}
            className="flex items-center justify-center gap-1 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors text-[10px] font-semibold">
            <span className="material-symbols-outlined text-sm">how_to_reg</span>
            <span>Attendance</span>
          </button>
          <button onClick={() => setModal({ type: "view", data: ev })}
            className="flex items-center justify-center gap-1 p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-[10px]">
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>View</span>
          </button>
          <button onClick={() => setModal({ type: "edit", data: ev })}
            className="flex items-center justify-center gap-1 p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors text-[10px]">
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>Edit</span>
          </button>
          <button onClick={() => setModal({ type: "delete", data: ev })}
            className="flex items-center justify-center gap-1 p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-[10px]">
            <span className="material-symbols-outlined text-sm">delete</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };

  // ── Event Form ──
  const EventForm = () => (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      {[
        { name: "name",  placeholder: "Event Name",  defaultValue: modal.data?.name,  required: true },
        { name: "desc",  placeholder: "Description", defaultValue: modal.data?.desc },
        { name: "venue", placeholder: "Venue",       defaultValue: modal.data?.venue },
      ].map(f => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-[#4e7397] uppercase tracking-wider">{f.placeholder}</label>
          <input name={f.name} placeholder={f.placeholder} defaultValue={f.defaultValue || ""} required={f.required}
            className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase tracking-wider">Date</label>
        <input type="date" name="date" defaultValue={modal.data?.date} required
          className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-[#4e7397] uppercase tracking-wider">Registered</label>
          <input type="number" name="registered" defaultValue={modal.data?.registered || 0}
            className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-[#4e7397] uppercase tracking-wider">Capacity</label>
          <input type="number" name="capacity" defaultValue={modal.data?.capacity || 0}
            className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-[#4e7397] uppercase tracking-wider">Status</label>
        <select name="status" defaultValue={modal.data?.status || "Scheduled"}
          className="border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none">
          <option>Scheduled</option>
          <option>Upcoming</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="flex flex-col-reverse lg:flex-row justify-end gap-2 mt-2">
        <button type="button" onClick={closeModal} className="px-4 py-2.5 border rounded-xl text-sm dark:border-slate-700 dark:text-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">Save</button>
      </div>
    </form>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
        bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent
        p-3 sm:p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#0e141b] dark:text-white leading-tight tracking-tight">
            Event Attendance
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 dark:text-slate-400">
            Monitor and manage PWD events
          </p>
        </div>
        <div className="flex-shrink-0">
          <button onClick={() => setModal({ type: "add", data: null })}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5
              bg-primary text-white rounded-xl text-xs sm:text-sm font-bold
              shadow-md hover:bg-primary/90 transition-colors whitespace-nowrap w-full sm:w-auto">
            <span className="material-symbols-outlined text-sm sm:text-base">add</span>
            Create Event
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsGrid>
        {statsdata.map((stat, idx) => (
          <StatsCards key={idx} stat={stat} />
        ))}
      </StatsGrid>

      {/* ── SearchBar ── */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
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
        </div>
      </div>

      {/* ── DataTable ── */}
      <DataTable
        columns={["ID", "Event", "Date", "Venue", "Participants", "Status", "Attendance", "Actions"]}
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

      {/* ── Attendance Modal (wide) ── */}
      {selectedEvent && (
        <Modal wide onClose={() => setSelectedEvent(null)}>
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-xl font-black text-[#0e141b] dark:text-white">
                Attendance — {selectedEvent.name}
              </h2>
              <button onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {attendance.map((user) => (
                <div key={user.pwd_id} className="flex items-center justify-between py-2.5 gap-3">
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.full_name}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => markAttendance(user.pwd_id, "present")}
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                        user.status === "present" ? "bg-green-600 text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-green-50"
                      }`}>Present</button>
                    <button onClick={() => markAttendance(user.pwd_id, "absent")}
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                        user.status === "absent" ? "bg-red-600 text-white" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50"
                      }`}>Absent</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Present: <span className="text-green-600">{attendance.filter(a => a.status === "present").length}</span>
                <span className="text-slate-400 mx-1">/</span>{attendance.length}
              </p>
              <button onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── View Modal ── */}
      {modal.type === "view" && (
        <ViewModal
          title="Event Details" icon="event"
          data={{
            "Event Name":  modal.data.name,
            "Description": modal.data.desc || "—",
            "Date":        modal.data.date,
            "Venue":       modal.data.venue || "—",
            "Registered":  modal.data.registered,
            "Capacity":    modal.data.capacity,
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
        <DeleteModal
          title="Delete Event"
          message="Are you sure you want to delete"
          subject={modal.data?.name}
          confirmText="Delete"
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}