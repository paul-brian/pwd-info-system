import { useState, useEffect } from "react";
import API_URL from "../../../api/api";
import { StatCardsLoader, TableLoader } from "../../../components/ui/Loading";
import StatsCards   from "../../../components/ui/StatsCards";
import StatsGrid    from "../../../components/ui/StatsGrid";
import SearchBar    from "../../../components/ui/SearchBar";
import DataTable    from "../../../components/ui/DataTable";
import Pagination   from "../../../components/ui/Pagination";
import ConfirmModal from "../../../components/modals/ConfirmModal";

const getToken   = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const roleBadge = {
  admin: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  staff: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  user:  "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-PH", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const LastLoginBadge = ({ dateStr }) => {
  if (!dateStr) return <span className="text-slate-400 text-xs italic">Never</span>;
  const diff  = Date.now() - new Date(dateStr).getTime();
  const hours = diff / 3600000;
  const days  = diff / 86400000;
  let color = "text-slate-500 dark:text-slate-400";
  if (hours < 24) color = "text-emerald-600 dark:text-emerald-400";
  else if (days < 7) color = "text-amber-600 dark:text-amber-400";
  const timeAgo = hours < 1 ? "Just now"
    : hours < 24 ? `${Math.floor(hours)}h ago`
    : days < 7   ? `${Math.floor(days)}d ago`
    : formatDate(dateStr);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`text-xs font-semibold ${color} whitespace-nowrap`}>{timeAgo}</span>
      {hours >= 24 && <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatDate(dateStr)}</span>}
    </div>
  );
};

export default function UserList({ showToast }) {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState("");
  const [filterRole, setFilterRole]   = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser]       = useState(null);
  const [toggleUser, setToggleUser]   = useState(null);
  const itemsPerPage = 6;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/api/users`, { headers: authHeader() });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/edit/${editUser.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ full_name: editUser.full_name, role: editUser.role, status: editUser.status }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setEditUser(null); fetchUsers();
      showToast("User updated successfully!", "success");
    } catch (err) { showToast("Failed to update user.", "error"); }
  };

  const handleToggleStatus = async () => {
    const updatedStatus = toggleUser.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`${API_URL}/api/users/status/${toggleUser.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ status: updatedStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setToggleUser(null); fetchUsers();
      showToast(`User ${updatedStatus === "active" ? "activated" : "deactivated"} successfully!`, "success");
    } catch (err) { showToast("Failed to update status.", "error"); }
  };

  const filtered = users.filter((u) =>
    (filterRole === "all" || u.role?.toLowerCase() === filterRole) &&
    ((u.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
     (u.email?.toLowerCase()     || "").includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage   = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  const statsdata = [
    { label: "Total Users", icon: "group",         value: users.length,                                                        changeText: "registered",    changeClass: "text-primary"     },
    { label: "Admin",       icon: "shield_person", value: users.filter(u => u.role?.toLowerCase() === "admin").length,         changeText: "administrators", changeClass: "text-violet-600"  },
    { label: "Staff",       icon: "badge",         value: users.filter(u => u.role?.toLowerCase() === "staff").length,         changeText: "staff members",  changeClass: "text-blue-600"    },
    { label: "User",        icon: "person",        value: users.filter(u => u.role?.toLowerCase() === "user").length,          changeText: "regular users",  changeClass: "text-slate-500"   },
    { label: "Active",      icon: "check_circle",  value: users.filter(u => u.status?.toLowerCase() === "active").length,     changeText: "online",         changeClass: "text-emerald-600" },
    { label: "Inactive",    icon: "block",         value: users.filter(u => u.status?.toLowerCase() === "inactive").length,   changeText: "deactivated",    changeClass: "text-red-500"     },
  ];

  const columns = ["User Profile", "Role", "Status", "Last Login", "Created Date", "Actions"];

  const renderRow = (user) => (
    <tr key={user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex justify-center items-center gap-3">
          <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-600">
            {user.image
              ? <img src={`${API_URL}/uploads/${user.image}`} alt={user.full_name} className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
              : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] font-black">
                  {user.full_name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                </div>
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email || "—"}</p>
          </div>
        </div>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${roleBadge[user.role?.toLowerCase()] || roleBadge.user}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <span className={`flex justify-center items-center gap-1.5 text-xs font-bold ${user.status === "active" ? "text-emerald-600" : "text-red-500"}`}>
          <span className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
        </span>
      </td>
      {/* ✅ Last Login */}
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-center">
        <LastLoginBadge dateStr={user.last_login} />
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(user.created_at)}
      </td>
      <td className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex justify-center gap-1">
          <button onClick={() => setEditUser(user)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button onClick={() => setToggleUser(user)} className={`p-1.5 rounded-lg transition-colors ${user.status === "active" ? "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}>
            <span className="material-symbols-outlined text-lg">{user.status === "active" ? "person_off" : "person"}</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = (user) => (
    <div key={user.user_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 sm:p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2.5">
        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-600">
          {user.image
            ? <img src={`${API_URL}/uploads/${user.image}`} alt={user.full_name} className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
            : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-black">
                {user.full_name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
              </div>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
          <p className="text-xs text-slate-500 truncate">{user.email || "—"}</p>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-bold flex-shrink-0 ${user.status === "active" ? "text-emerald-600" : "text-red-500"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
          {user.status?.charAt(0).toUpperCase() + user.status?.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${roleBadge[user.role?.toLowerCase()] || roleBadge.user}`}>
          {user.role}
        </span>
        <span className="text-[10px] text-slate-400">Created: {formatDate(user.created_at)}</span>
      </div>

      {/* ✅ Last Login on mobile card */}
      <div className="flex justify-center items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400">Last login:</span>
        <span className={`text-[10px] font-bold ${
          user.last_login
            ? (Date.now() - new Date(user.last_login).getTime()) < 86400000
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-500 dark:text-slate-400"
            : "text-slate-400"
        }`}>
          {user.last_login
            ? (Date.now() - new Date(user.last_login).getTime()) < 3600000 ? "Just now"
              : (Date.now() - new Date(user.last_login).getTime()) < 86400000 ? `${Math.floor((Date.now() - new Date(user.last_login).getTime()) / 3600000)}h ago`
              : formatDate(user.last_login)
            : "Never"}
        </span>
      </div>

      <div className="flex gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => setEditUser(user)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors">Edit</button>
        <button onClick={() => setToggleUser(user)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${user.status === "active" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}>
          {user.status === "active" ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">group</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">User List</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Manage all system users and their roles</p>
          </div>
        </div>
      </div>

      {loading ? <StatCardsLoader count={6} /> : (
        <StatsGrid>{statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}</StatsGrid>
      )}

      <SearchBar
        searchValue={search} setSearchValue={val => { setSearch(val); setCurrentPage(1); }}
        filterValue={filterRole} setFilterValue={val => { setFilterRole(val); setCurrentPage(1); }}
        placeholder="Search by name or email..."
        options={[{ value:"all",label:"All Roles"},{value:"admin",label:"Admin"},{value:"staff",label:"Staff"},{value:"user",label:"User"}]}
      />

      {loading ? <TableLoader rows={6} cols={columns.length} /> : (
        <DataTable columns={columns} data={paginated} renderRow={renderRow} renderCard={renderCard} empty="No users found."
          pagination={<Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={goToPage} />}
        />
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={e => e.target === e.currentTarget && setEditUser(null)}>
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-xl">person_edit</span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Edit User</h2>
              </div>

              {/* ✅ Last Login in edit modal */}
              <div className="flex items-center gap-3 mb-4 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Login</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {editUser.last_login ? formatDate(editUser.last_login) : "Never logged in"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input type="text" value={editUser.full_name} onChange={e => setEditUser({...editUser, full_name: e.target.value})}
                    className="border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</label>
                  <select value={editUser.role} onChange={e => setEditUser({...editUser, role: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all appearance-none">
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button onClick={() => setEditUser(null)} className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                <button onClick={handleEdit} className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-all">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toggleUser && (
        <ConfirmModal
          variant={toggleUser.status === "active" ? "danger" : "success"}
          title={toggleUser.status === "active" ? "Deactivate User" : "Activate User"}
          message={toggleUser.status === "active" ? "Are you sure you want to deactivate" : "Are you sure you want to activate"}
          subject={toggleUser.full_name}
          note={toggleUser.status === "active" ? "This user will no longer be able to access the system." : "This user will regain access to the system."}
          confirmText={toggleUser.status === "active" ? "Deactivate" : "Activate"}
          onConfirm={handleToggleStatus}
          onCancel={() => setToggleUser(null)}
        />
      )}
    </div>
  );
}