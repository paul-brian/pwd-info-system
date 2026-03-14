import API_URL from "../api/api";

const BASE_URL = API_URL;

const PWDActionModal = ({ pwd, onClose }) => {
  const initials = pwd?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const isActive = pwd?.status === "active";
  const avatarUrl = pwd?.image ? `${BASE_URL}/uploads/${pwd.image}` : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">

      <div className="flex items-center gap-4 mb-6">
        <div className="size-14 rounded-full overflow-hidden shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={pwd?.full_name} className="w-full h-full object-cover" />
          ) : (
            <div className={`size-14 rounded-full flex items-center justify-center font-bold text-lg ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              {initials}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{pwd?.full_name}</h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {pwd?.status?.charAt(0).toUpperCase() + pwd?.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined text-base text-primary">accessibility</span>
          <span>{pwd?.disability_type || "—"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined text-base text-primary">call</span>
          <span>{pwd?.contact_number || "—"}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PWDActionModal;