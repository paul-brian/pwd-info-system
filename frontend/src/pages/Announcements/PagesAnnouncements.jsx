import React, { useState, useEffect } from "react";

// Sample data
const initialAnnouncements = [
  {
    id: 1,
    title: "PWD ID Renewal Deadline",
    desc: "Renew your PWD ID before Sept 1 to continue receiving assistance.",
    timestamp: new Date(Date.now() - 3600 * 1000), // 1 hour ago
    important: true,
  },
  {
    id: 2,
    title: "Wheelchair Donation Drive",
    desc: "Donation drive on Aug 20, 2026. Volunteers needed!",
    timestamp: new Date(Date.now() - 24 * 3600 * 1000), // 1 day ago
    important: false,
  },
];

// Helper function for time ago
const timeAgo = (date) => {
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // Live updates simulation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newAnnouncement = {
        id: announcements.length + 1,
        title: "New Assistance Available",
        desc: "Check the dashboard for newly available assistance items.",
        timestamp: new Date(),
        important: Math.random() > 0.5, // randomly important
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    }, 10000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
          Announcements
        </h3>
        <button className="text-primary text-xs sm:text-sm md:text-base font-bold hover:underline whitespace-nowrap">
          View All
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="flex gap-2.5 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-100 dark:border-slate-800"
          >
            {/* Icon */}
            <div
              className={`w-9 sm:w-10 md:w-12 h-9 sm:h-10 md:h-12 rounded-full flex items-center justify-center shrink-0 text-base sm:text-lg md:text-xl font-medium ${
                ann.important
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              <span className="material-symbols-outlined">
                {ann.important ? "priority_high" : "announcement"}
              </span>
            </div>

            {/* Text */}
            <div className="flex-1 flex flex-col gap-1 sm:gap-1.5">
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {ann.title}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400">
                {ann.desc}
              </p>
              <span className="text-[8px] sm:text-[10px] md:text-xs text-slate-400 mt-0.5">
                {timeAgo(ann.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAnnouncements;