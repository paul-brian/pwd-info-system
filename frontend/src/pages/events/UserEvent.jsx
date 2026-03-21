// import React, { useState, useEffect } from "react";

// const dummyEvents = [
//   { name: "PWD General Assembly", date: "Oct 12, 2023 • 09:00 AM", venue: "Barangay Hall", status: "Attended" },
//   { name: "Assistive Device Distribution", date: "Nov 05, 2023 • 01:30 PM", venue: "Covered Court", status: "Registered" },
//   { name: "Health and Wellness Seminar", date: "Sep 20, 2023 • 08:00 AM", venue: "Multi-purpose Bldg", status: "Absent" },
//   { name: "Year-end Celebration", date: "Dec 15, 2023 • 05:00 PM", venue: "Trapiche Plaza", status: "Registered" },
//   { name: "Disability Rights Forum", date: "Aug 12, 2023 • 10:00 AM", venue: "Barangay Hall", status: "Attended" },
// ];

// const statusColors = {
//   Attended: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//   Registered: "bg-primary/10 text-primary dark:bg-primary/20",
//   Absent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
// };

// const EventAttendance = () => {
//   const [activeTab, setActiveTab] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [stats, setStats] = useState({ Attended: 0, Registered: 0, Missed: 0 });

//   // Filter events based on tab and search
//   const filteredEvents = dummyEvents
//     .filter((event) => {
//       if (activeTab === "Upcoming") return event.status === "Registered";
//       if (activeTab === "History") return event.status === "Attended" || event.status === "Absent";
//       return true;
//     })
//     .filter((event) =>
//       event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.venue.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   // Live stats calculation
//   useEffect(() => {
//     const calculateStats = () => {
//       let attended = 0, registered = 0, missed = 0;
//       dummyEvents.forEach((e) => {
//         if (e.status === "Attended") attended++;
//         else if (e.status === "Registered") registered++;
//         else if (e.status === "Absent") missed++;
//       });
//       setStats({ Attended: attended, Registered: registered, Missed: missed });
//     };
//     calculateStats();
//     const interval = setInterval(calculateStats, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <main className="flex-1 flex flex-col overflow-y-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
//       {/* Header */}
//       <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
//         <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">My Event Attendance</h2>

//       </header>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
//         {["Attended", "Registered", "Missed"].map((key) => (
//           <div key={key} className="bg-white dark:bg-slate-900 p-3 sm:p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4">
//             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-2xl">
//               <span className="material-symbols-outlined">
//                 {key === "Attended" ? "how_to_reg" : key === "Registered" ? "pending_actions" : "event_busy"}
//               </span>
//             </div>
//             <div>
//               <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">{key}</p>
//               <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{stats[key]}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
//         {["All", "Upcoming", "History"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`pb-2 text-xs sm:text-sm md:text-base font-bold whitespace-nowrap ${
//               activeTab === tab ? "border-b-2 border-primary text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
//             }`}
//           >
//             {tab} Events
//           </button>
//         ))}
//       </div>

//       {/* Search */}
//       <div className="mb-4 sm:mb-6 w-full sm:max-w-md">
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-base md:text-lg">search</span>
//           <input
//             type="text"
//             placeholder="Search event..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-primary transition-all"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-50 dark:bg-slate-800/50">
//               <th className="px-3 md:px-4 lg:px-6 py-3 text-[10px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Event Name</th>
//               <th className="px-3 md:px-4 lg:px-6 py-3 text-[10px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Date</th>
//               <th className="px-3 md:px-4 lg:px-6 py-3 text-[10px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white">Venue</th>
//               <th className="px-3 md:px-4 lg:px-6 py-3 text-[10px] md:text-xs lg:text-sm font-bold text-slate-900 dark:text-white text-center">My Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
//             {filteredEvents.map((event, i) => (
//               <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
//                 <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm font-medium text-slate-900 dark:text-white">{event.name}</td>
//                 <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm text-slate-600 dark:text-slate-400">{event.date}</td>
//                 <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm text-slate-600 dark:text-slate-400">{event.venue}</td>
//                 <td className="px-3 md:px-4 lg:px-6 py-3 text-center">
//                   <span className={`inline-flex items-center px-2.5 md:px-3 py-1 rounded-full text-[8px] md:text-xs lg:text-sm font-bold ${statusColors[event.status]}`}>
//                     {event.status === "Attended" && <span className="material-symbols-outlined text-[10px] md:text-xs mr-1">check_circle</span>}
//                     {event.status === "Registered" && <span className="material-symbols-outlined text-[10px] md:text-xs mr-1">app_registration</span>}
//                     {event.status === "Absent" && <span className="material-symbols-outlined text-[10px] md:text-xs mr-1">cancel</span>}
//                     {event.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </main>
//   );
// };

// export default EventAttendance;

import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";


const BASE_URL = `${API_URL}/api`;

const getToken = () =>
  localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const statusColors = {
  present: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  absent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  upcoming: "bg-primary/10 text-primary dark:bg-primary/20",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const EventAttendance = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = () => {
      setLoading(true);
      Promise.all([
        axios.get(`${BASE_URL}/attendance/me`, { headers: authHeader() }),
        axios.get(`${BASE_URL}/events/upcoming`, { headers: authHeader() }),
      ])
        .then(([attendanceRes, upcomingRes]) => {
          setAttendance(attendanceRes.data);
          setUpcoming(upcomingRes.data);
        })
        .catch((err) => console.error("Fetch error:", err))
        .finally(() => setLoading(false));
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: attendance.length,
    present: attendance.filter((e) => e.status === "present").length,
    absent: attendance.filter((e) => e.status === "absent").length,
    upcoming: upcoming.length,
  };

  const getFilteredEvents = () => {
    let list = [];
    if (activeTab === "All") {
      list = [
        ...attendance.map((e) => ({ ...e, _type: "history" })),
        ...upcoming.map((e) => ({ ...e, _type: "upcoming", status: "upcoming" })),
      ];
    } else if (activeTab === "Upcoming") {
      list = upcoming.map((e) => ({ ...e, _type: "upcoming", status: "upcoming" }));
    } else if (activeTab === "History") {
      list = attendance.map((e) => ({ ...e, _type: "history" }));
    }

    return list.filter((event) => {
      const name = event.event_name?.toLowerCase() || "";
      const loc = event.location?.toLowerCase() || "";
      return name.includes(searchQuery.toLowerCase()) || loc.includes(searchQuery.toLowerCase());
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <main className="flex-1 flex flex-col overflow-y-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
          My Event Attendance
        </h2>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {[
          { key: "total", label: "Total", icon: "event", value: stats.total },
          { key: "present", label: "Attended", icon: "how_to_reg", value: stats.present },
          { key: "absent", label: "Absent", icon: "event_busy", value: stats.absent },
          { key: "upcoming", label: "Upcoming", icon: "pending_actions", value: stats.upcoming },
        ].map((stat) => (
          <div key={stat.key} className="bg-white dark:bg-slate-900 p-3 sm:p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] sm:text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? <span className="animate-pulse">...</span> : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {["All", "Upcoming", "History"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-xs sm:text-sm md:text-base font-bold whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
            }`}
          >
            {tab} Events
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="w-full sm:max-w-md">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-base">search</span>
          <input
            type="text"
            placeholder="Search event or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-bold text-slate-900 dark:text-white">Event Name</th>
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-bold text-slate-900 dark:text-white">Date</th>
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-bold text-slate-900 dark:text-white">Location</th>
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-bold text-slate-900 dark:text-white">Check-in Time</th>
              <th className="px-3 md:px-6 py-3 text-[10px] md:text-xs font-bold text-slate-900 dark:text-white text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">event_busy</span>
                  <p className="text-sm font-medium">No events found</p>
                </td>
              </tr>
            ) : filteredEvents.map((event, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-3 md:px-6 py-3 text-xs md:text-sm font-medium text-slate-900 dark:text-white">
                  {event.event_name}
                </td>
                <td className="px-3 md:px-6 py-3 text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(event.event_date)}
                </td>
                <td className="px-3 md:px-6 py-3 text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  {event.location || "—"}
                </td>
                <td className="px-3 md:px-6 py-3 text-xs md:text-sm text-slate-600 dark:text-slate-400">
                  {event.check_in_time
                    ? new Date(event.check_in_time).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })
                    : "—"}
                </td>
                <td className="px-3 md:px-6 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold ${statusColors[event.status] || statusColors.absent}`}>
                    <span className="material-symbols-outlined text-[10px] md:text-xs">
                      {event.status === "present" ? "check_circle" : event.status === "upcoming" ? "pending_actions" : "cancel"}
                    </span>
                    {event.status === "present" ? "Attended" : event.status === "upcoming" ? "Upcoming" : "Absent"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default EventAttendance;