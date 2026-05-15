import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import { StatCardsLoader, SectionLoader } from "../../components/ui/Loading";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid  from "../../components/ui/StatsGrid";
import Pagination from "../../components/ui/Pagination";
import SearchBar  from "../../components/ui/SearchBar";
import ViewModal  from "../../components/modals/ViewModal";

const API = `${API_URL}/api`;

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";

const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now  = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60)     return "Just now";
  if (diff < 3600)   return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";
  return formatDate(dateStr);
};

const categoryConfig = {
  Health:  { color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",     icon: "health_and_safety", dot: "bg-rose-500",   accent: "border-rose-200 dark:border-rose-800"   },
  Event:   { color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",     icon: "event",             dot: "bg-blue-500",   accent: "border-blue-200 dark:border-blue-800"   },
  General: { color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", icon: "campaign",          dot: "bg-amber-500",  accent: "border-amber-200 dark:border-amber-800" },
};
const getConfig = (cat) => categoryConfig[cat] || categoryConfig["General"];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch]               = useState("");
  const [expanded, setExpanded]           = useState(null);
  const [viewItem, setViewItem]           = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API}/announcements`);
        setAnnouncements(Array.isArray(res.data) ? res.data : []);
      } catch (err) { console.error("Failed to fetch announcements:", err); }
      finally { setLoading(false); }
    };
    fetchAnnouncements();
  }, []);

  // ── Filter options ──
  const categoryOptions = [
    { value: "all",     label: "All Categories" },
    { value: "Health",  label: "Health" },
    { value: "Event",   label: "Event" },
    { value: "General", label: "General" },
  ];



  // ── Filter ──
  const filtered = announcements.filter((a) => {
    const matchSearch =
      (a.title   || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.message || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || a.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const latest = announcements[0];

  // ── Stats ──
  const statsdata = [
    { label: "Total",   icon: "campaign",          value: announcements.length,                                         change: "", changeText: "announcements",  changeClass: "text-violet-600"  },
    { label: "Health",  icon: "health_and_safety", value: announcements.filter((a) => a.category === "Health").length,  change: "", changeText: "health updates", changeClass: "text-rose-500"    },
    { label: "Events",  icon: "event",             value: announcements.filter((a) => a.category === "Event").length,   change: "", changeText: "upcoming events", changeClass: "text-blue-600"    },
    { label: "General", icon: "info",              value: announcements.filter((a) => a.category === "General").length, change: "", changeText: "general news",   changeClass: "text-amber-500"   },
  ];

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-lg">campaign</span>
            <span className=" text-xs font-semibold uppercase tracking-widest">Barangay Trapiche</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Announcements</h1>
          <p className="mt-1 text-xs sm:text-sm">
            Stay updated with the latest news and updates from the PWD office
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={4} /> :
        <StatsGrid>
          {statsdata.map((stat, idx) => (
            <StatsCards key={idx} stat={stat} />
          ))}
        </StatsGrid>}

      {/* ── Latest Announcement highlight ── */}
      {
        loading ? (
          <div className="w-full flex items-center justify-center h-full">
            <SectionLoader message="Loading Announcements..." />
          </div>
        ) : !latest ? (
          <div className="w-full flex items-center justify-center h-full text-slate-400 text-sm">
            No data yet
          </div>
        ) : (
          <div className={`bg-white dark:bg-slate-900 rounded-xl border-2 ${getConfig(latest.category).accent} shadow-sm p-4 sm:p-6`}>

            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${getConfig(latest.category).dot} animate-pulse flex-shrink-0`} />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Latest
              </span>
              <span className={`ml-auto px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${getConfig(latest.category).color}`}>
                {latest.category}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
              {latest.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{latest.message}</p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-slate-400 text-sm">
                person
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {latest.posted_by_name}
              </span>
              <span className="ml-auto text-xs text-slate-400">
                {formatTimeAgo(latest.created_at)}
              </span>
              <button
                onClick={() => setViewItem(latest)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/20 text-xs font-bold hover:bg-violet-200 dark:hover:bg-violet-900/30 transition-colors">
                <span className="font-bold">
                 View
                </span>
              </button>
            </div>
          </div>
        )
      }
      
      {/* ── Search ── */}
      <SearchBar
        searchValue={search}
        setSearchValue={setSearch}
        filterValue={filterCategory}
        setFilterValue={setFilterCategory}
        placeholder="Search announcements..."
        options={categoryOptions}
      />

      {/* ── Announcement Cards ── */}
      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <SectionLoader message="Loading Announcements..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <p className="font-semibold text-sm">No announcements found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {paginatedData.map((announcement) => {
              const config = getConfig(announcement.category);
              const isExpanded = expanded === announcement.announcement_id;
              return (
                <div key={announcement.announcement_id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                  <div className={`h-1 w-full ${config.dot}`} />
                  <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${config.color}`}>
                        <span className="material-symbols-outlined text-xs">{config.icon}</span>
                        {announcement.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatTimeAgo(announcement.created_at)}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {announcement.title}
                    </h3>
                    <p className={`text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex-1 ${isExpanded ? "" : "line-clamp-3"}`}>
                      {announcement.message}
                    </p>
                    {announcement.message?.length > 120 && (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : announcement.announcement_id)}
                        className="text-xs font-bold text-violet-600 self-start">
                        <span className="font-bold">View</span>
                      </button>
                    )}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                      <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate flex-1">
                        {announcement.posted_by_name}
                      </span>
                      <button onClick={() => setViewItem(announcement)}
                        className="p-1 text-[10px] sm:text-xs hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors flex-shrink-0">
                        <span className="font-bold">View</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* YOUR PERFECT PAGINATION */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {/* ── View Modal ── */}
      {viewItem && (
        <ViewModal
          title="Announcement Details"
          icon="campaign"
          data={{
            "Title":     viewItem.title,
            "Category":  viewItem.category,
            "Message":   viewItem.message,
            "Posted By": viewItem.posted_by_name,
            "Date":      formatDate(viewItem.created_at),
          }}
          onClose={() => setViewItem(null)}
        />
      )}
    </div>
  );
};

export default Announcements;