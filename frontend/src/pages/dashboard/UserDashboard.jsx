import { useState } from "react";

// Dummy Data
const dummyEvents = [
  { id: "EVT-001", name: "Health & Wellness Seminar", date: "Feb 15, 2026", venue: "Trapiche Covered Court", status: "Upcoming", statusColor: "blue" },
  { id: "EVT-002", name: "Livelihood Training", date: "Feb 10, 2026", venue: "Training Center", status: "Completed", statusColor: "emerald" },
];

const dummyCheckups = [
  { id: "CHK-001", date: "Feb 5, 2026", vitals: "120/80 BP - 60kg", status: "Stable", staff: "Nurse Sarah" },
  { id: "CHK-002", date: "Jan 28, 2026", vitals: "130/85 BP - 62kg", status: "Follow-up", staff: "Dr. Reyes" },
];

const trendColors = {
  emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  orange: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
  blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  slate: "text-slate-400 bg-slate-100 dark:bg-slate-800/20",
};

const UserDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalComponent, setModalComponent] = useState(null);

  const handleEventAction = (event) => {
    setModalComponent(
      <div>
        <h3 className="font-bold text-lg mb-2">{event.name}</h3>
        <p className="mb-1"><span className="font-semibold">Date:</span> {event.date}</p>
        <p className="mb-1"><span className="font-semibold">Venue:</span> {event.venue}</p>
        <p className="mb-1"><span className="font-semibold">Status:</span> {event.status}</p>
      </div>
    );
    setShowModal(true);
  };

  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        {children}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] overflow-x-hidden">
      <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl bg-blue-600 text-white p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            Welcome, John Doe
          </h1>
          <p className="text-white/90 mt-2 text-xs sm:text-sm md:text-base">
            Here's your PWD dashboard overview with live stats and events.
          </p>
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4">
          {[
            { title: "Upcoming Events", value: dummyEvents.length, icon: "event", trendColor: "blue" },
            { title: "Recent Checkups", value: dummyCheckups.length, icon: "health_and_safety", trendColor: "emerald" },
            { title: "Pending Alerts", value: 1, icon: "notifications", trendColor: "orange" },
            { title: "Completed Check-ins", value: 5, icon: "how_to_reg", trendColor: "emerald" },
          ].map((stat) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-slate-900 p-3 sm:p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-2 sm:gap-3"
            >
              <div className="flex justify-between items-start">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center ${trendColors[stat.trendColor]}`}>
                  <span className="material-symbols-outlined text-base sm:text-lg md:text-xl">{stat.icon}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events Table */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-3 md:px-4 lg:px-6 py-3 border-b">
            <h3 className="font-bold text-sm md:text-base lg:text-lg text-slate-900 dark:text-white">
              Upcoming Events
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Event Name", "Date", "Venue", "Status", "Action"].map(h => (
                    <th key={h} className="px-3 md:px-4 lg:px-6 py-3 text-[10px] md:text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dummyEvents.map(event => (
                  <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm font-semibold dark:text-white">{event.name}</td>
                    <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm text-slate-500 dark:text-slate-400">{event.date}</td>
                    <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm text-slate-500 dark:text-slate-400">{event.venue}</td>
                    <td className="px-3 md:px-4 lg:px-6 py-3">
                      <span className={`px-2 py-1 rounded-lg text-[8px] md:text-xs lg:text-sm font-bold ${trendColors[event.statusColor]}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 lg:px-6 py-3">
                      <button
                        onClick={() => handleEventAction(event)}
                        className="text-slate-400 hover:text-blue-600 transition text-sm md:text-base"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Event Cards */}
        <div className="md:hidden space-y-3 sm:space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Upcoming Events
          </h3>
          {dummyEvents.map(event => (
            <div key={event.id} className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5 sm:space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{event.name}</p>
                <span className={`px-2 py-0.5 rounded-lg text-[8px] sm:text-xs font-bold whitespace-nowrap ${trendColors[event.statusColor]}`}>
                  {event.status}
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-slate-600 dark:text-slate-400">{event.date}</p>
              <p className="text-[9px] sm:text-xs text-slate-600 dark:text-slate-400">{event.venue}</p>
              <button
                onClick={() => handleEventAction(event)}
                className="mt-2 text-[9px] sm:text-xs text-primary hover:underline font-medium"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Recent Checkups Table */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-3 md:px-4 lg:px-6 py-3 border-b">
            <h3 className="font-bold text-sm md:text-base lg:text-lg text-slate-900 dark:text-white">
              Recent Checkups
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Date", "Vitals", "Status", "Staff"].map(h => (
                    <th key={h} className="px-3 md:px-4 lg:px-6 py-3 text-[10px] md:text-xs lg:text-sm font-bold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dummyCheckups.map(chk => (
                  <tr key={chk.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm text-slate-600 dark:text-slate-400">{chk.date}</td>
                    <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm text-slate-600 dark:text-slate-400">{chk.vitals}</td>
                    <td className="px-3 md:px-4 lg:px-6 py-3 font-bold text-[9px] md:text-xs lg:text-sm">{chk.status}</td>
                    <td className="px-3 md:px-4 lg:px-6 py-3 text-[9px] md:text-xs lg:text-sm text-slate-600 dark:text-slate-400">{chk.staff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Checkup Cards */}
        <div className="md:hidden space-y-3 sm:space-y-4">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Recent Checkups
          </h3>
          {dummyCheckups.map(chk => (
            <div key={chk.id} className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5 sm:space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{chk.date}</p>
                <span className="px-2 py-0.5 rounded-lg text-[8px] sm:text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                  {chk.status}
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-slate-600 dark:text-slate-400"><span className="font-medium">Vitals:</span> {chk.vitals}</p>
              <p className="text-[9px] sm:text-xs text-slate-600 dark:text-slate-400"><span className="font-medium">Staff:</span> {chk.staff}</p>
            </div>
          ))}
        </div>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            {modalComponent}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;