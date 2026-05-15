const colorMap = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600",
  },
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila", // ⭐ important
  });
};

const RecentAlert = ({ onClose, logs = [] }) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Logs</h2>
        </div>

        {/* Logs List */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 block">history</span>
              <p className="text-sm font-medium">No recent logs found</p>
            </div>
          ) : (
            logs.map((log, idx) => {
              const colors = colorMap[log.color] || colorMap.blue;
              return (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className={`size-10 rounded-full ${colors.bg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${colors.text} text-xl`}>{log.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold dark:text-white">{log.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{log.description}</p>
                    <span className="text-[10px] text-slate-400">{formatTimeAgo(log.time)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentAlert;