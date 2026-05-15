import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { getRouteMeta } from "../../routes/routeUtils";
import API_URL from "../../api/api";

const getToken   = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });
const getRole    = () => localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || "user";

const moduleColors = {
  "PWD Profile":   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Health Record": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Event":         "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Inventory":     "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "Donation":      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "SMS":           "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  "Assistance":    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const notifColors = {
  "PWD Registration":       "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  "Health Record":          "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Event Attendance":       "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  "Assistance/Distribution":"bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  "SMS Notification":       "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  "User Login/Logout":      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  "Announcement":           "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  "Health Alert":           "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const notifIcons = {
  "PWD Registration":       "person_add",
  "Health Record":          "health_and_safety",
  "Event Attendance":       "event_available",
  "Assistance/Distribution":"volunteer_activism",
  "SMS Notification":       "sms",
  "User Login/Logout":      "login",
  "Announcement":           "campaign",
  "Health Alert":           "emergency",
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
};

// ─────────────────────────────────────────────────────────────
// ✅ SearchInput — defined OUTSIDE Header to prevent remounting
// This is the key fix for the focus loss bug
// ─────────────────────────────────────────────────────────────
const SearchInput = ({
  inputRef, query, onChange, onFocus, onClear, searching, role, placeholder,
}) => (
  <div className="relative flex items-center h-9 sm:h-10 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 sm:px-3 w-full">
    {searching ? (
      <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0" />
    ) : (
      <span className="material-symbols-outlined text-slate-400 text-lg flex-shrink-0">search</span>
    )}
    <input
      ref={inputRef}
      type="text"
      value={query}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      className="w-full bg-transparent text-xs sm:text-sm outline-none dark:text-white ml-1 sm:ml-2 placeholder-slate-400"
    />
    {query && (
      <button
        onMouseDown={(e) => { e.preventDefault(); onClear(); }} // ✅ onMouseDown prevents blur
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// ✅ SearchDropdown — also outside to prevent remounting
// ─────────────────────────────────────────────────────────────
const SearchDropdown = ({ results, onSelect, onClose }) => (
  <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto">
    {results.length === 0 ? (
      <div className="py-8 text-center">
        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-4xl block mb-2">search_off</span>
        <p className="text-sm text-slate-400 font-medium">No results found</p>
        <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Try different keywords</p>
      </div>
    ) : (
      <>
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          <button
            onMouseDown={(e) => { e.preventDefault(); onClose(); }}
            className="text-slate-400 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        {Object.entries(
          results.reduce((acc, r) => {
            if (!acc[r.module]) acc[r.module] = [];
            acc[r.module].push(r);
            return acc;
          }, {})
        ).map(([module, items]) => (
          <div key={module}>
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">{items[0]?.icon || "folder"}</span>
                {module}
              </p>
            </div>
            {items.map((item, idx) => (
              <button
                key={idx}
                onMouseDown={(e) => { e.preventDefault(); onSelect(item); }} // ✅ onMouseDown to avoid blur
                className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary text-base transition-colors">
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.sub}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${moduleColors[module] || "bg-slate-100 text-slate-600"}`}>
                  {module}
                </span>
              </button>
            ))}
          </div>
        ))}
      </>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// ✅ NotificationsPanel — outside Header to prevent remounting
// ─────────────────────────────────────────────────────────────
const NotificationsPanel = ({ notifications, loading, unreadCount, onMarkAllRead, onClose, role }) => (
  // ✅ Mobile: fixed + centered; Tablet+: absolute right-aligned
  <div className="fixed inset-x-2 top-16 sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[380px] z-50 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">

    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">notifications</span>
        <p className="font-bold text-slate-900 dark:text-white text-sm">Notifications</p>
        {unreadCount > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">{unreadCount}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {unreadCount > 0 && (
          <button
            onMouseDown={(e) => { e.preventDefault(); onMarkAllRead(); }}
            className="text-[10px] font-bold text-primary hover:underline"
          >
            Mark all read
          </button>
        )}
        <button
          onMouseDown={(e) => { e.preventDefault(); onClose(); }}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
      {loading ? (
        <div className="py-10 text-center">
          <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block mb-2" />
          <p className="text-xs text-slate-400">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-10 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-700 block mb-2">notifications_off</span>
          <p className="text-sm font-medium text-slate-400">No notifications yet</p>
        </div>
      ) : (
        notifications.map((notif, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
              !notif.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
            }`}
          >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${notifColors[notif.module] || "bg-slate-100 text-slate-500"}`}>
              <span className="material-symbols-outlined text-base">
                {notifIcons[notif.module] || "notifications"}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {notif.action}
                </p>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                )}
              </div>
              {notif.description && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${notifColors[notif.module] || "bg-slate-100 text-slate-500"}`}>
                  {notif.module}
                </span>
                <p className="text-[10px] text-slate-400">{formatTimeAgo(notif.created_at)}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Footer */}
    {notifications.length > 0 && (
      <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] text-slate-400">Showing latest {notifications.length} notifications</p>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// ✅ MAIN HEADER
// ─────────────────────────────────────────────────────────────
const Header = ({ onMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, icon, path } = getRouteMeta(location.pathname);
  const role = getRole();

  // ── Theme ──
  const [darkMode, setDarkMode] = useState(false);

  // ── Search ──
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop, setShowDrop]   = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  // ── Notifications ──
  const [showNotif, setShowNotif]           = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [notifsLoading, setNotifsLoading]   = useState(false);
  const [unreadCount, setUnreadCount]       = useState(0);
  const [readIds, setReadIds]               = useState(() => {
    try { return JSON.parse(localStorage.getItem("readNotifIds") || "[]"); }
    catch { return []; }
  });

  const inputRef    = useRef(null);
  const searchRef   = useRef(null);
  const notifRef    = useRef(null);
  const debounceRef = useRef(null);

  // ── Theme persist ──
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") { setDarkMode(true); document.documentElement.classList.add("dark"); }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ── Close dropdowns on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDrop(false);
        setMobileSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Search ──
  const doSearch = useCallback(async (q) => {
    if (!q || q.trim().length < 2) { setResults([]); setShowDrop(false); return; }
    setSearching(true);
    try {
      const res  = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q.trim())}`, { headers: authHeader() });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setShowDrop(true);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally { setSearching(false); }
  }, []);

  // ✅ Key fix: onChange is stable, no component recreation
  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) { setResults([]); setShowDrop(false); return; }
    debounceRef.current = setTimeout(() => doSearch(val), 350);
  }, [doSearch]);

  const handleFocus = useCallback(() => {
    if (results.length > 0) setShowDrop(true);
  }, [results.length]);

  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setShowDrop(false);
    inputRef.current?.focus();
  }, []);

  const handleSelect = useCallback((item) => {
    setQuery("");
    setResults([]);
    setShowDrop(false);
    setMobileSearch(false);
    navigate(item.path);
  }, [navigate]);

  // ── Notifications fetch ──
  const fetchNotifications = useCallback(async () => {
    setNotifsLoading(true);
    try {
      if (role === "admin" || role === "staff") {
        // Activity logs + announcements
        const [logsRes, annRes] = await Promise.all([
          fetch(`${API_URL}/api/logs`, { headers: authHeader() }),
          fetch(`${API_URL}/api/announcements`, { headers: authHeader() }),
        ]);
        const logs = await logsRes.json();
        const announcements = await annRes.json();

        const logItems = (Array.isArray(logs) ? logs : []).map(l => ({
          ...l,
          module: l.module || "User Login/Logout",
          type:   "log",
          read:   readIds.includes(`log-${l.log_id}`),
        }));
        const annItems = (Array.isArray(announcements) ? announcements : []).map(a => ({
          action:      a.title,
          description: a.message,
          module:      "Announcement",
          created_at:  a.created_at,
          ann_id:      a.announcement_id,
          type:        "announcement",
          read:        readIds.includes(`ann-${a.announcement_id}`),
        }));

        // Merge and sort by date
        const merged = [...logItems, ...annItems].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 20);

        setNotifications(merged);
        setUnreadCount(merged.filter(n => !n.read).length);

      } else {
        // User — announcements + personal health alerts
        const [annRes, healthRes] = await Promise.all([
          fetch(`${API_URL}/api/announcements`, { headers: authHeader() }),
          fetch(`${API_URL}/api/health/me`,      { headers: authHeader() }),
        ]);
        const announcements = await annRes.json();
        const healthRecords = await healthRes.json();

        const annItems = (Array.isArray(announcements) ? announcements : []).map(a => ({
          action:      a.title,
          description: a.message,
          module:      "Announcement",
          created_at:  a.created_at,
          ann_id:      a.announcement_id,
          type:        "announcement",
          read:        readIds.includes(`ann-${a.announcement_id}`),
        }));

        // Personal health alerts — follow-up and critical
        const healthAlerts = (Array.isArray(healthRecords) ? healthRecords : [])
          .filter(h => h.health_status === "Follow-up" || h.health_status === "Critical")
          .map(h => ({
            action:      `Health Alert: ${h.health_status}`,
            description: h.remarks || `Your latest checkup requires attention.`,
            module:      "Health Alert",
            created_at:  h.recorded_at,
            health_id:   h.health_id,
            type:        "health",
            read:        readIds.includes(`health-${h.health_id}`),
          }));

        const merged = [...healthAlerts, ...annItems].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 20);

        setNotifications(merged);
        setUnreadCount(merged.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally { setNotifsLoading(false); }
  }, [role, readIds]);

  // ✅ Fetch notifications on mount so unreadCount badge appears immediately
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleOpenNotif = useCallback(() => {
    setShowNotif(prev => {
      if (!prev) fetchNotifications(); // refresh when opening
      return !prev;
    });
    setShowDrop(false);
  }, [fetchNotifications]);

  const handleMarkAllRead = useCallback(() => {
    const newIds = [
      ...readIds,
      ...notifications.map(n => {
        if (n.type === "log")          return `log-${n.log_id}`;
        if (n.type === "announcement") return `ann-${n.ann_id}`;
        if (n.type === "health")       return `health-${n.health_id}`;
        return null;
      }).filter(Boolean),
    ];
    setReadIds(newIds);
    localStorage.setItem("readNotifIds", JSON.stringify(newIds));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [notifications, readIds]);

  const searchPlaceholder = role === "admin"
    ? "Search anything..."
    : role === "staff"
    ? "Search PWD, health, events..."
    : "Search your records...";

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 md:px-8 py-2 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">

        {/* ── LEFT ── */}
        <div className={`flex items-center gap-2 sm:gap-4 min-w-0 ${mobileSearch ? "hidden sm:flex" : "flex"}`}>
          <button onClick={onMenu}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="material-symbols-outlined text-primary text-lg sm:text-2xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate">{title}</h2>
              <nav className="text-[11px] sm:text-xs text-slate-500 truncate">
                <NavLink to="/PagesDashboard" className="hover:underline">Dashboard</NavLink>
                {path !== "/PagesDashboard" && (
                  <>
                    <span className="mx-1 hidden sm:inline">/</span>
                    <span className="text-slate-400 hidden sm:inline">{title}</span>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* ── MOBILE SEARCH (full width when open) ── */}
        {mobileSearch && (
          <div className="flex-1 relative sm:hidden" ref={searchRef}>
            <SearchInput
              inputRef={inputRef}
              query={query}
              onChange={handleChange}
              onFocus={handleFocus}
              onClear={handleClear}
              searching={searching}
              placeholder={searchPlaceholder}
            />
            {showDrop && (
              <SearchDropdown results={results} onSelect={handleSelect} onClose={() => setShowDrop(false)} />
            )}
          </div>
        )}

        {/* ── RIGHT ── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Desktop Search */}
          <div className="relative hidden sm:block w-[180px] md:w-[240px] lg:w-[300px]" ref={searchRef}>
            <SearchInput
              inputRef={inputRef}
              query={query}
              onChange={handleChange}
              onFocus={handleFocus}
              onClear={handleClear}
              searching={searching}
              placeholder={searchPlaceholder}
            />
            {showDrop && (
              <SearchDropdown results={results} onSelect={handleSelect} onClose={() => setShowDrop(false)} />
            )}
          </div>

          {/* Mobile Search Toggle */}
          {!mobileSearch && (
            <button
              onClick={() => {
                setMobileSearch(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="sm:hidden w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0"
            >
              <span className="material-symbols-outlined text-lg">search</span>
            </button>
          )}

          {/* ── Notifications ── */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleOpenNotif}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl text-slate-600 dark:text-slate-300">
                notifications
              </span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <NotificationsPanel
                notifications={notifications}
                loading={notifsLoading}
                unreadCount={unreadCount}
                onMarkAllRead={handleMarkAllRead}
                onClose={() => setShowNotif(false)}
                role={role}
              />
            )}
          </div>

          {/* ✅ Dark Mode — modern sun/moon toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 overflow-hidden
              ${darkMode
                ? "bg-slate-800 hover:bg-slate-700 shadow-inner shadow-blue-900/30"
                : "bg-amber-50 hover:bg-amber-100 border border-amber-200"
              }`}
          >
            {/* Sun (light mode) */}
            <span className={`material-symbols-outlined absolute transition-all duration-300
              ${darkMode
                ? "opacity-0 rotate-90 scale-50 text-amber-400"
                : "opacity-100 rotate-0 scale-100 text-amber-500"
              } text-lg sm:text-xl`}>
              light_mode
            </span>
            {/* Moon (dark mode) */}
            <span className={`material-symbols-outlined absolute transition-all duration-300
              ${darkMode
                ? "opacity-100 rotate-0 scale-100 text-blue-300"
                : "opacity-0 -rotate-90 scale-50 text-blue-400"
              } text-lg sm:text-xl`}>
              dark_mode
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;