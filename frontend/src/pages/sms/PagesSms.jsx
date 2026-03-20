import { useState } from "react";

const dummyMessages = [
  { id: 1, date: "Oct 24, 2023 · 10:30 AM", recipient: "All PWD Members (842)", icon: "groups", preview: "Reminder: Quarterly financial assistance distribution starting tomorrow at 8:00 AM...", status: "Sent", color: "green" },
  { id: 2, date: "Oct 24, 2023 · 11:15 AM", recipient: "Juan Dela Cruz", icon: "person", preview: "Your application for the specialized wheelchair program has been approved. Please...", status: "Pending", color: "amber" },
  { id: 3, date: "Oct 23, 2023 · 02:45 PM", recipient: "Senior PWDs (120)", icon: "groups", preview: "Important: Health wellness seminar moved to Friday, 9:00 AM at the Barangay Hall.", status: "Failed", color: "red" },
  { id: 4, date: "Oct 23, 2023 · 09:00 AM", recipient: "Barangay Staff (15)", icon: "groups", preview: "System maintenance scheduled for 10 PM tonight. Expect 1 hour downtime.", status: "Sent", color: "green" },
];

const AdminSms = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(dummyMessages.length / itemsPerPage);
  const paginatedMessages = dummyMessages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }
  return (
    <div>
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6 md:gap-8">
          {/* Heading + Compose Button */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 md:gap-6">
            <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                SMS Notifications
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                Manage and monitor automated and manual broadcasts to PWD members in Barangay Trapiche.
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-xl h-10 sm:h-11 md:h-12 px-4 sm:px-5 md:px-6 bg-primary text-white text-xs sm:text-sm md:text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all touch-target whitespace-nowrap">
              <span className="material-symbols-outlined text-lg md:text-xl">send</span>
              <span>Compose</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[
              { label: "Total Sent Today", value: "1,284", icon: "outbox", extra: "+12.5% from yesterday", color: "green-600", trendIcon: "trending_up" },
              { label: "Pending Queue", value: "12", icon: "pending_actions", extra: "Currently in processing", color: "amber-600" },
              { label: "Failed Deliveries", value: "5", icon: "error", extra: "Requires attention", color: "red-600" },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-2 rounded-xl p-3 sm:p-4 md:p-6 bg-white dark:bg-slate-800 border border-[#d0dbe7] dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <span className={`material-symbols-outlined text-lg sm:text-xl text-${stat.color}`}>{stat.icon}</span>
                </div>
                <p className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">{stat.value}</p>
                {stat.trendIcon ? (
                  <p className={`flex items-center gap-1 text-${stat.color} text-xs sm:text-sm font-bold`}>
                    <span className="material-symbols-outlined text-sm md:text-base">{stat.trendIcon}</span>
                    <span>{stat.extra}</span>
                  </p>
                ) : <p className="text-slate-600 dark:text-slate-500 text-xs sm:text-sm font-medium">{stat.extra}</p>}
              </div>
            ))}
          </div>

          {/* Tabs + Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-[#d0dbe7] dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-[#d0dbe7] dark:border-slate-700 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 flex flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
              {/* Tabs */}
              <div className="flex gap-1 sm:gap-2 md:gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {["Message History", "Scheduled", "Templates"].map((tab, idx) => (
                  <a key={idx} className={`border-b-2 py-2 px-2 sm:px-1 md:px-2 text-xs sm:text-sm font-bold flex items-center gap-0.5 sm:gap-1 md:gap-2 transition-colors ${
                    idx === 0
                      ? "border-primary text-slate-900 dark:text-white"
                      : "border-transparent text-slate-600 dark:text-slate-400 hover:text-primary"
                  }`} href="#">
                    {tab}
                  </a>
                ))}
              </div>

              {/* Mobile Filter Toggle */}
              <div className="sm:hidden relative">
                <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)} className="p-2 rounded-lg border border-[#d0dbe7] dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#4e7397] dark:text-slate-400 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">filter_alt</span>
                </button>
                {mobileFilterOpen && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 border border-[#d0dbe7] dark:border-slate-700 rounded-lg shadow-lg flex flex-col gap-2 p-2">
                    <button className="p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-left">Filter</button>
                    <button className="p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-left">Download</button>
                  </div>
                )}
              </div>

              {/* Desktop Filter Buttons */}
              <div className="hidden sm:flex gap-2">
                <button className="p-2 rounded-lg border border-[#d0dbe7] dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#4e7397] dark:text-slate-400 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">filter_alt</span>
                </button>
                <button className="p-2 rounded-lg border border-[#d0dbe7] dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#4e7397] dark:text-slate-400 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">download</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left border-collapse">
                <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                  {["Date & Time", "Recipient(s)", "Message Preview", "Status", "Actions"].map((col, idx) => (
                    <th key={idx} className="px-4 md:px-6 py-3 text-xs md:text-sm font-bold text-[#4e7397] dark:text-slate-400 uppercase tracking-wider text-center">{col}</th>
                  ))}
                </thead>
                <tbody className="divide-y divide-[#d0dbe7] dark:divide-slate-700">
                  {paginatedMessages.map(msg => (
                    <tr key={msg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-4 md:px-6 py-3 whitespace-nowrap text-sm text-[#0e141b] dark:text-white font-medium">{msg.date}</td>
                      <td className="px-4 md:px-6 py-3 text-sm text-[#0e141b] dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 text-primary p-1 rounded">
                            <span className="material-symbols-outlined text-[16px]">{msg.icon}</span>
                          </span>
                          <span className="truncate max-w-[150px] md:max-w-xs">{msg.recipient}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-sm text-[#4e7397] dark:text-slate-400 max-w-xs truncate">{msg.preview}</td>
                      <td className="px-4 md:px-6 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${msg.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            msg.color === "amber" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {msg.status === "Sent" ? "check_circle" : msg.status === "Pending" ? "hourglass_empty" : "error"}
                          </span>
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-right flex justify-end gap-2">
                        {msg.status === "Failed" && (
                          <button className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Retry">
                            <span className="material-symbols-outlined text-[18px]">replay</span>
                          </button>
                        )}
                        <button className="text-[#4e7397] dark:text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-[#d0dbe7] dark:border-slate-700 flex flex-col gap-2 sm:gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium order-2 sm:order-1">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, dummyMessages.length)} of {dummyMessages.length} messages
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 order-1 sm:order-2">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#d0dbe7] dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 touch-target">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => goToPage(i + 1)} className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold ${
                    currentPage === i + 1 ? "bg-primary text-white" : "border border-[#d0dbe7] dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}>{i + 1}</button>
                ))}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#d0dbe7] dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 touch-target">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSms;
