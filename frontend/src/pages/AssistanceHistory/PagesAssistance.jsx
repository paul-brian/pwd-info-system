import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import { StatCardsLoader, TableLoader} from "../../components/ui/Loading";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid  from "../../components/ui/StatsGrid";
import SearchBar  from "../../components/ui/SearchBar";
import DataTable  from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";

const BASE_URL = API_URL;
const API      = `${BASE_URL}/api`;

const getToken    = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader  = () => ({ Authorization: `Bearer ${getToken()}` });
const formatDate  = (date) =>
  date ? new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";

const categoryColors = {
  Medicine:  "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  Food:      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  Clothing:  "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
  Equipment: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  Financial: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  Other:     "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};
const getCategoryColor = (cat) => categoryColors[cat] || categoryColors["Other"];

const AssistanceHistory = () => {
  const [assistance, setAssistance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/distribution/me`, { headers: authHeader() });
        setAssistance(Array.isArray(res.data) ? res.data : []);
        setData(res.data);
      } catch (err) { console.error("Failed to fetch assistance history:", err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // ── Filter & Paginate ──
  const filtered = assistance.filter((item) => {
    const matchSearch =
      (item.item_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.remarks   || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || item.category === filterCategory;
    return matchSearch && matchCategory;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage   = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  // ── Stats ──
  const totalQty   = assistance.reduce((sum, a) => sum + (a.quantity || 0), 0);
  const latestDate = assistance[0]?.release_date;

  const statsdata = [
    { label: "Total Records",   icon: "volunteer_activism", value: assistance.length, change: "", changeText: "assistance received", changeClass: "text-emerald-600" },
    { label: "Total Items",     icon: "inventory_2",        value: totalQty,          change: "", changeText: "items received",      changeClass: "text-blue-600"    },
    { label: "Last Received",   icon: "event",              value: latestDate ? formatDate(latestDate) : "—", change: "", changeText: "latest release", changeClass: "text-slate-500" },
  ];

  const columns= ["Date Released", "Item", "Category", "Quantity", "Remarks"];

  // ── Desktop Row ──
  const renderRow = (item) => (
    <tr key={item.assistance_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(item.release_date)}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.item_name}</p>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryColor(item.category)}`}>
          {item.category || "—"}
        </span>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          {item.quantity}
          <span className="text-xs font-normal text-slate-400 ml-1">pcs</span>
        </span>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
        {item.remarks || "—"}
      </td>
    </tr>
  );

  // ── Mobile Card ──
  const renderCard = (item) => (
    <div key={item.assistance_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">{item.item_name}</p>
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${getCategoryColor(item.category)}`}>
          {item.category || "—"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div>
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Date Released</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(item.release_date)}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Quantity</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {item.quantity} <span className="font-normal text-slate-400">pcs</span>
          </p>
        </div>
      </div>
      {item.remarks && (
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Remarks</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{item.remarks}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-lg">volunteer_activism</span>
              <span className="text-xs font-semibold uppercase tracking-widest">
                PWD Assistance Program
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Assistance History
            </h1>
            <p className="mt-1 text-xs sm:text-sm">
              Complete record of all assistance received from Barangay Trapiche
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={4} /> :
        <StatsGrid>
          {statsdata.map((stat, idx) => (
            <StatsCards key={idx} stat={stat} />
          ))}
        </StatsGrid>}

      {/* ── Search ── */}
      <SearchBar
        searchValue={search}
        setSearchValue={(val) => { setSearch(val); setCurrentPage(1); }}
        filterValue={filterCategory}
        setFilterValue={(val) => { setFilterCategory(val); setCurrentPage(1); }}
        placeholder="Search item or remarks..."
      />

      {/* ── Table ── */}
      {loading ? (
        <TableLoader rows={6} cols={columns.length} />
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          renderRow={renderRow}
          renderCard={renderCard}
          empty="No assistance records found."
          pagination={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          }
        />
      )}
    </div>
  );
};

export default AssistanceHistory;