// import { useState } from "react";

// const initialEvents = [
//   { id: "EVT-001", name: "PWD General Assembly", desc: "Annual community planning session", date: "2023-10-24", venue: "Barangay Hall", registered: 45, capacity: 50, status: "Ongoing" },
//   { id: "EVT-002", name: "Health & Wellness Seminar", desc: "Focus on mobility exercises", date: "2023-11-05", venue: "Trapiche Covered Court", registered: 30, capacity: 40, status: "Upcoming" },
//   { id: "EVT-003", name: "Livelihood Training", desc: "Skills development workshop", date: "2023-10-15", venue: "Training Center", registered: 25, capacity: 25, status: "Completed" },
//   { id: "EVT-004", name: "Annual Sports Fest", desc: "Municipal-wide athletic event", date: "2023-12-12", venue: "Municipal Plaza", registered: 0, capacity: 100, status: "Scheduled" },
// ];

// const statusBadge = {
//   Ongoing: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//   Upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//   Completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
//   Scheduled: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
// };

// const EventAttendance = () => {
//   const [events, setEvents] = useState(initialEvents);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [modal, setModal] = useState({ type: null, data: null });

//   const itemsPerPage = 4;
//   const totalPages = Math.ceil(events.length / itemsPerPage);
//   const paginatedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const ongoingEvents = events.filter(e => e.status === "Ongoing").length;
//   const today = new Date();
//   const next30Days = events.filter(e => {
//     const d = new Date(e.date);
//     const diff = (d - today) / (1000 * 60 * 60 * 24);
//     return diff >= 0 && diff <= 30;
//   }).length;
//   const totalAttendees = events.reduce((sum, e) => sum + e.registered, 0);
//   const pendingCheckins = events.reduce((sum, e) => sum + (e.capacity - e.registered), 0);

//   const handleSave = (e) => {
//     e.preventDefault();
//     const f = e.target;
//     const newEvent = {
//       id: modal.data?.id || `EVT-${Date.now()}`,
//       name: f.name.value,
//       desc: f.desc.value,
//       date: f.date.value,
//       venue: f.venue.value,
//       registered: Number(f.registered.value),
//       capacity: Number(f.capacity.value),
//       status: f.status.value,
//     };
//     setEvents(prev => modal.type === "edit" ? prev.map(ev => ev.id === newEvent.id ? newEvent : ev) : [...prev, newEvent]);
//     setModal({ type: null, data: null });
//   };

//   const handleDelete = () => {
//     setEvents(events.filter(e => e.id !== modal.data.id));
//     setModal({ type: null, data: null });
//   };

//   return (
//     <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-black dark:text-white">Event Attendance</h1>
//           <p className="text-slate-500 text-sm">Monitor and manage PWD events</p>
//         </div>
//         <button onClick={() => setModal({ type: "add", data: null })} className="bg-primary text-white px-5 py-2 rounded-lg font-bold">+ Create Event</button>
//       </div>

//       {/* STATS */}
//       <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         {[{ label: "Ongoing Events", value: ongoingEvents }, { label: "Next 30 Days", value: next30Days }, { label: "Total Attendees (MTD)", value: totalAttendees }, { label: "Pending Check-ins", value: pendingCheckins, highlight: true }].map((s,i) => (
//           <div key={i} className="p-4 bg-white dark:bg-slate-900 border rounded-xl">
//             <p className="text-xs text-slate-500 font-bold uppercase">{s.label}</p>
//             <p className={`text-2xl font-black ${s.highlight ? "text-primary" : "dark:text-white"}`}>{s.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* TABLE (Desktop) */}
//       <div className="hidden md:block bg-white dark:bg-slate-900 border rounded-xl overflow-x-auto">
//         <table className="min-w-[900px] w-full">
//           <thead className="bg-slate-50 dark:bg-slate-800">
//             <tr>{["ID","Event","Date","Venue","Participants","Status","Actions"].map(h=>(
//               <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">{h}</th>
//             ))}</tr>
//           </thead>
//           <tbody>
//             {paginatedEvents.map(ev => {
//               const progress = Math.round((ev.registered / ev.capacity) * 100);
//               return (
//                 <tr key={ev.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800">
//                   <td className="px-4 py-3 text-sm">{ev.id}</td>
//                   <td className="px-4 py-3">
//                     <p className="font-bold dark:text-white">{ev.name}</p>
//                     <p className="text-xs text-slate-500">{ev.desc}</p>
//                   </td>
//                   <td className="px-4 py-3">{ev.date}</td>
//                   <td className="px-4 py-3">{ev.venue}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-24 h-1.5 bg-slate-200 rounded-full">
//                         <div className="bg-primary h-full" style={{ width: `${progress}%` }} />
//                       </div>
//                       <span className="text-xs font-bold">{ev.registered}/{ev.capacity}</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge[ev.status]}`}>{ev.status}</span>
//                   </td>
//                   <td className="px-4 py-3 flex gap-2">
//                     <button onClick={() => setModal({ type: "edit", data: ev })}>✏️</button>
//                     <button onClick={() => setModal({ type: "delete", data: ev })}>🗑️</button>
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* MOBILE CARDS */}
//       <div className="md:hidden flex flex-col gap-4">
//         {paginatedEvents.map(ev => {
//           const progress = Math.round((ev.registered / ev.capacity) * 100);
//           return (
//             <div key={ev.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
//               <div className="flex justify-between mb-2">
//                 <p className="font-bold dark:text-white">{ev.name}</p>
//                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge[ev.status]}`}>{ev.status}</span>
//               </div>
//               <p className="text-xs text-slate-500 mb-1">{ev.desc}</p>
//               <p className="text-xs text-slate-500">Date: {ev.date}</p>
//               <p className="text-xs text-slate-500 mb-1">Venue: {ev.venue}</p>
//               <div className="flex items-center gap-2 mb-2">
//                 <div className="w-full h-1.5 bg-slate-200 rounded-full">
//                   <div className="bg-primary h-full" style={{ width: `${progress}%` }} />
//                 </div>
//                 <span className="text-xs font-bold">{ev.registered}/{ev.capacity}</span>
//               </div>
//               <div className="flex gap-2">
//                 <button onClick={() => setModal({ type: "edit", data: ev })} className="p-2 border rounded w-full text-center">Edit</button>
//                 <button onClick={() => setModal({ type: "delete", data: ev })} className="p-2 border rounded w-full text-center">Delete</button>
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* MODAL (same as before) */}
//       {modal.type && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-md">
//             {modal.type === "delete" ? (
//               <>
//                 <h2 className="font-black mb-4">Delete Event?</h2>
//                 <div className="flex justify-end gap-2">
//                   <button onClick={() => setModal({ type: null })}>Cancel</button>
//                   <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
//                 </div>
//               </>
//             ) : (
//               <form onSubmit={handleSave} className="space-y-3">
//                 <h2 className="font-black">{modal.type === "add" ? "Create Event" : "Edit Event"}</h2>
//                 <input className="w-full p-2 border rounded" name="name" defaultValue={modal.data?.name} placeholder="Event name" required />
//                 <input className="w-full p-2 border rounded" name="desc" defaultValue={modal.data?.desc} placeholder="Description" />
//                 <input className="w-full p-2 border rounded" type="date" name="date" defaultValue={modal.data?.date} required />
//                 <input className="w-full p-2 border rounded" name="venue" defaultValue={modal.data?.venue} placeholder="Venue" />
//                 <input className="w-full p-2 border rounded" type="number" name="registered" defaultValue={modal.data?.registered || 0} />
//                 <input className="w-full p-2 border rounded" type="number" name="capacity" defaultValue={modal.data?.capacity || 0} />
//                 <select className="w-full p-2 border rounded" name="status" defaultValue={modal.data?.status || "Scheduled"}>
//                   <option>Scheduled</option>
//                   <option>Upcoming</option>
//                   <option>Ongoing</option>
//                   <option>Completed</option>
//                 </select>
//                 <div className="flex justify-end gap-2">
//                   <button type="button" onClick={() => setModal({ type: null })}>Cancel</button>
//                   <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save</button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default EventAttendance;

import { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../../components/Cards";
import API_URL from "../../api/api";

/* ================= API ================= */
const EVENT_API = `${API_URL}/api/events`;
const ATT_API = `${API_URL}/api/attendance`;

/* ================= STATUS BADGE ================= */
const statusBadge = {
  Ongoing:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Upcoming:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Completed:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Scheduled:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function EventAttendance() {
  /* ================= STATES ================= */
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modal, setModal] = useState({ type: null, data: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(EVENT_API);
      const formatted = res.data.map((e) => ({
        id: e.event_id,
        name: e.event_name,
        desc: e.description,
        date: e.event_date,
        venue: e.location,
        registered: e.registered || 0,
        capacity: e.capacity || 0,
        status: e.status || "Scheduled",
      }));
      setEvents(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ATTENDANCE ================= */
  const openAttendance = async (event) => {
  setSelectedEvent(event);
  try {
    const res = await axios.get(`${ATT_API}/${event.id}`);
    setAttendance(res.data); // only active users returned
  } catch (err) {
    console.error(err);
  }
};

const markAttendance = async (pwd_id, status) => {
  try {
    await axios.post(`${ATT_API}/mark`, {
      event_id: selectedEvent.id,
      pwd_id,
      status,
    });
    // update locally
    setAttendance((prev) =>
      prev.map((u) => (u.pwd_id === pwd_id ? { ...u, status } : u))
    );

    // optional: refresh events registered count
    fetchEvents();
  } catch (err) {
    console.error(err);
  }
};

  /* ================= EVENT CRUD ================= */
  const handleSave = async (e) => {
    e.preventDefault();
    const f = e.target;
    const payload = {
      event_name: f.name.value,
      description: f.desc.value,
      event_date: f.date.value,
      location: f.venue.value,
      capacity: Number(f.capacity.value),
      registered: Number(f.registered.value),
      status: f.status.value,
      created_by: 1,
    };
    try {
      if (modal.type === "edit") {
        await axios.put(`${EVENT_API}/${modal.data.id}`, payload);
      } else {
        await axios.post(EVENT_API, payload);
      }
      fetchEvents();
      setModal({ type: null, data: null });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${EVENT_API}/${modal.data.id}`);
      fetchEvents();
      setModal({ type: null, data: null });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ================= DASHBOARD STATS ================= */
  const ongoingEvents = events.filter((e) => e.status === "Ongoing").length;
  const today = new Date();
  const next30Days = events.filter((e) => {
    const d = new Date(e.date);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  }).length;
  const totalAttendees = events.reduce((sum, e) => sum + e.registered, 0);
  const pendingCheckins = events.reduce(
    (sum, e) => sum + (e.capacity - e.registered),
    0
  );

  const statsdata = [
    { label: "Ongoing Events", icon: "groups", value: ongoingEvents , change: "+12%", changeText: "from last month", changeClass: "text-emerald-600" },
    { label: "Next 30 Days", icon: "verified", value: next30Days, change: "+5%", changeText: "this week", changeClass: "text-emerald-600" },
    { label: "Total Attendees (MTD)", icon: "block", value: totalAttendees, change: "-2%", changeText: "vs last month", changeClass: "text-rose-600" },
    { label: "Pending Check-ins", icon: "pending", value: pendingCheckins, change: "-2%", changeText: "vs last month", changeClass: "text-rose-600" }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black dark:text-white">
            Event Attendance
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor and manage PWD events
          </p>
        </div>
        <button
          onClick={() => setModal({ type: "add", data: null })}
          className="bg-primary text-white px-5 py-2 rounded-lg font-bold"
        >
          + Create Event
        </button>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statsdata.map((stat, idx) => (
             <Cards key={idx} stat={stat} />
      ))}
      </div>

      {/* TABLE (Desktop) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border rounded-xl overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              {["ID", "Event", "Date", "Venue", "Participants", "Status", "Attendance", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-bold text-slate-500 uppercase"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((ev) => {
              const progress = ev.capacity
                ? Math.round((ev.registered / ev.capacity) * 100)
                : 0;
              return (
                <tr
                  key={ev.id}
                  className="border-t hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <td className="px-4 py-3 text-sm">{ev.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold dark:text-white">{ev.name}</p>
                    <p className="text-xs text-slate-500">{ev.desc}</p>
                  </td>
                  <td className="px-4 py-3">{ev.date}</td>
                  <td className="px-4 py-3">{ev.venue}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">
                        {ev.registered}/{ev.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        statusBadge[ev.status]
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openAttendance(ev)}
                      className="text-blue-600"
                    >
                      Attendance
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setModal({ type: "edit", data: ev })}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setModal({ type: "delete", data: ev })}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden flex flex-col gap-4">
        {paginatedEvents.map((ev) => {
          const progress = ev.capacity
            ? Math.round((ev.registered / ev.capacity) * 100)
            : 0;
          return (
            <div
              key={ev.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <p className="font-bold dark:text-white">{ev.name}</p>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    statusBadge[ev.status]
                  }`}
                >
                  {ev.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-1">{ev.desc}</p>
              <p className="text-xs text-slate-500">Date: {ev.date}</p>
              <p className="text-xs text-slate-500 mb-1">Venue: {ev.venue}</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-full h-1.5 bg-slate-200 rounded-full">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold">
                  {ev.registered}/{ev.capacity}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openAttendance(ev)}
                  className="p-2 border rounded w-full text-center text-sm"
                >
                  Attendance
                </button>
                <button
                  onClick={() => setModal({ type: "edit", data: ev })}
                  className="p-2 border rounded w-full text-center text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setModal({ type: "delete", data: ev })}
                  className="p-2 border rounded w-full text-center text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ATTENDANCE MODAL ================= */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl p-6 rounded-xl">
            <h2 className="text-xl font-black mb-4">
              Attendance — {selectedEvent.name}
            </h2>
            <div className="max-h-[400px] overflow-y-auto">
              {attendance.map((user) => (
                <div
                  key={user.pwd_id}
                  className="flex justify-between border-b py-2"
                >
                  <span>{user.full_name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        markAttendance(user.pwd_id, "present")
                      }
                      className={`px-3 py-1 rounded ${
                        user.status === "present"
                          ? "bg-green-600 text-white"
                          : "border"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(user.pwd_id, "absent")}
                      className={`px-3 py-1 rounded ${
                        user.status === "absent"
                          ? "bg-red-600 text-white"
                          : "border"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <p className="font-bold">
                Present: {attendance.filter((a) => a.status === "present").length}
              </p>
              <button
                onClick={() => setSelectedEvent(null)}
                className="border px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EVENT MODAL ================= */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-md">
            {modal.type === "delete" ? (
              <>
                <h2 className="font-black mb-4">Delete Event?</h2>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal({ type: null })}>
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSave} className="space-y-3">
                <h2 className="font-black">
                  {modal.type === "add" ? "Create Event" : "Edit Event"}
                </h2>
                <input
                  name="name"
                  placeholder="Event Name"
                  className="w-full p-2 border rounded"
                  defaultValue={modal.data?.name}
                  required
                />
                <input
                  name="desc"
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  defaultValue={modal.data?.desc}
                />
                <input
                  type="date"
                  name="date"
                  className="w-full p-2 border rounded"
                  defaultValue={modal.data?.date}
                  required
                />
                <input
                  name="venue"
                  placeholder="Venue"
                  className="w-full p-2 border rounded"
                  defaultValue={modal.data?.venue}
                />
                <input
                  type="number"
                  name="registered"
                  placeholder="Registered"
                  className="w-full p-2 border rounded"
                  defaultValue={modal.data?.registered || 0}
                />
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  className="w-full p-2 border rounded"
                  defaultValue={modal.data?.capacity || 0}
                />
                <select
                  name="status"
                  className="w-full p-2 border rounded"
                  defaultValue={modal.data?.status || "Scheduled"}
                >
                  <option>Scheduled</option>
                  <option>Upcoming</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModal({ type: null })}
                  >
                    Cancel
                  </button>
                  <button className="bg-primary text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}