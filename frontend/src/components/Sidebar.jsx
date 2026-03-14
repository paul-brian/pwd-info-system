import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { menuItems } from "../config/menu";
import API_URL from "../api/api";

const BASE_URL = API_URL;

/* Nav Item */
const NavItem = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
      ${
        isActive
          ? "bg-blue-600 text-white shadow"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`
    }
  >
    <span className="material-symbols-outlined text-[22px]">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);

const Sidebar = ({ open, setOpen }) => {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const storedName =
      localStorage.getItem("userName") || sessionStorage.getItem("userName");
    const storedImage =
      localStorage.getItem("userImage") || sessionStorage.getItem("userImage");

    setRole(storedRole);
    setUserName(storedName || "");
    setUserImage(storedImage || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/Login");
  };

  const closeSidebarMobile = () => {
    if (window.innerWidth < 768) setOpen(false);
  };

  // initials fallback
  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : role?.charAt(0).toUpperCase();

  const avatarUrl = userImage ? `${BASE_URL}/uploads/${userImage}` : null;

  if (!role) return null;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-40 h-full w-72 bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 flex flex-col flex-shrink-0 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">
                accessible_forward
              </span>
            </div>
            <div>
              <h1 className="text-primary font-bold">PWD System</h1>
              <p className="text-xs text-slate-500">Brgy. Trapiche</p>
            </div>
          </div>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Menu */}
        <nav className="p-5 flex flex-col gap-3 flex-1">
          {menuItems
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.name}
                onClick={closeSidebarMobile}
              />
            ))}
        </nav>

        {/* ── User Profile + Logout ── */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">

          {/* Profile Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 mb-3">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center shadow-sm">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <span className="text-white font-black text-sm">{initials}</span>
                )}
              </div>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
            </div>

            {/* Name + Role */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {userName || (role === "Admin" ? "Admin User" : role === "Staff" ? "Staff User" : "User")}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide mt-0.5
                ${role === "Admin"
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                  : role === "Staff"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                {role}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;