// import { NavLink, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { menuItems } from "../../config/menu";
// import API_URL from "../../api/api";

// const BASE_URL = API_URL;

// const NavItem = ({ to, icon, label, onClick }) => (
//   <NavLink
//     to={to}
//     onClick={onClick}
//     className={({ isActive }) =>
//       `flex items-center gap-3 px-3 py-3 rounded-lg transition-all
//       ${isActive
//         ? "bg-blue-600 text-white shadow"
//         : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
//       }`
//     }
//   >
//     <span className="material-symbols-outlined text-[22px] flex-shrink-0">{icon}</span>
//     <span className="text-sm font-medium truncate">{label}</span>
//   </NavLink>
// );

// const Sidebar = ({ open, setOpen }) => {
//   const [role, setRole] = useState(null);
//   const [userName, setUserName] = useState("");
//   const [userImage, setUserImage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
//     const storedName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
//     const storedImage = localStorage.getItem("userImage") || sessionStorage.getItem("userImage");
//     setRole(storedRole);
//     setUserName(storedName || "");
//     setUserImage(storedImage || "");
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate("/Login");
//   };

//   // Close on any screen below lg (mobile + tablet)
//   const closeSidebar = () => {
//     if (window.innerWidth < 1024) setOpen(false);
//   };

//   const initials = userName
//     ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
//     : role?.charAt(0).toUpperCase();

//   const avatarUrl = userImage ? `${BASE_URL}/uploads/${userImage}` : null;

//   if (!role) return null;

//   return (
//     <>
//       {/* Overlay — shows on mobile AND tablet (below lg) */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       <aside
//         className={`
//           fixed z-40 h-full
//           w-72
//           bg-white dark:bg-slate-900
//           border-r border-slate-200 dark:border-slate-800
//           flex flex-col flex-shrink-0
//           transition-transform duration-300
//           lg:static lg:translate-x-0
//           ${open ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         {/* ── Brand ── */}
//         <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
//               <span className="material-symbols-outlined text-lg">accessible_forward</span>
//             </div>
//             <div>
//               <h1 className="text-primary font-bold text-sm">PWD System</h1>
//               <p className="text-xs text-slate-500">Brgy. Trapiche</p>
//             </div>
//           </div>
//           {/* Close button — visible on mobile & tablet */}
//           <button
//             onClick={() => setOpen(false)}
//             className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//           >
//             <span className="material-symbols-outlined text-slate-500">close</span>
//           </button>
//         </div>

//         {/* ── Nav Menu ── */}
//         <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
//           {menuItems
//             .filter((item) => item.roles.includes(role))
//             .map((item) => (
//               <NavItem
//                 key={item.path}
//                 to={item.path}
//                 icon={item.icon}
//                 label={item.name}
//                 onClick={closeSidebar}
//               />
//             ))}
//         </nav>

//         {/* ── User + Logout ── */}
//         <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
//           {/* Profile Card */}
//           <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
//             <div className="relative flex-shrink-0">
//               <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center shadow-sm">
//                 {avatarUrl ? (
//                   <img
//                     src={avatarUrl}
//                     alt="avatar"
//                     className="w-full h-full object-cover"
//                     onError={(e) => { e.target.style.display = "none"; }}
//                   />
//                 ) : (
//                   <span className="text-white font-black text-sm">{initials}</span>
//                 )}
//               </div>
//               <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
//                 {userName || (role === "Admin" ? "Admin User" : role === "Staff" ? "Staff User" : "User")}
//               </p>
//               <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide mt-0.5
//                 ${role === "Admin"
//                   ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
//                   : role === "Staff"
//                   ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
//                   : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
//                 }`}>
//                 {role}
//               </span>
//             </div>
//           </div>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
//           >
//             <span className="material-symbols-outlined text-[20px]">logout</span>
//             <span className="text-sm font-semibold">Sign Out</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { menuItems } from "../../config/menu";
import { ROLES } from '../../pages/Auth/roles';
import API_URL from "../../api/api";

const BASE_URL = API_URL;

const navGroups = [
  {
    key:   "user-management",
    label: "User Management",
    roles: [ROLES.ADMIN],
    icon:  "group",
    items: [
      { key: "user-list",           label: "User List",           icon: "person",               path: "/PagesSettings/user-list" },
      { key: "roles-permissions",   label: "Roles & Permissions", icon: "admin_panel_settings", path: "/PagesSettings/roles-permissions" },
      { key: "pending-invitations", label: "Pending Invitations", icon: "mail",                 path: "/PagesSettings/pending-invitations" },
    ],
  },
  {
    key:   "access-control",
    label: "Access Control",
    roles: [ROLES.ADMIN],
    icon:  "lock",
    items: [
      { key: "access-requests", label: "Access Requests", icon: "key", path: "/PagesSettings/access-requests", badge: true },
    ],
  },
  {
    key:   "account",
    label: "Account",
    roles: [ROLES.ADMIN],
    icon:  "manage_accounts",
    items: [
      { key: "account-settings", label: "Account Settings", icon: "settings", path: "/PagesSettings/profileSettings" },
    ],
  },
];

const Sidebar = ({ open, setOpen, pendingAccessCount = 0 }) => {
  const [role, setRole]                 = useState(null);
  const [userName, setUserName]         = useState("");
  const [userImage, setUserImage]       = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openGroups, setOpenGroups]     = useState(["user-management", "access-control", "account"]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/PagesSettings")) setSettingsOpen(true);
  }, [location.pathname]);

  useEffect(() => {
    const storedRole  = localStorage.getItem("userRole")  || sessionStorage.getItem("userRole");
    const storedName  = localStorage.getItem("userName")  || sessionStorage.getItem("userName");
    const storedImage = localStorage.getItem("userImage") || sessionStorage.getItem("userImage");
    setRole(storedRole);
    setUserName(storedName || "");
    setUserImage(storedImage || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/Login");
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) setOpen(false);
  };

  const toggleGroup = (key) =>
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const initials     = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : role?.charAt(0).toUpperCase();
  const avatarUrl        = userImage ? `${BASE_URL}/uploads/${userImage}` : null;
  const regularItems     = (menuItems || []).filter((item) => item.roles?.includes(role) && item.path !== "/PagesSettings");
  const hasSettingsItem  = (menuItems || []).some((item)  => item.roles?.includes(role) && item.path === "/PagesSettings");
  const isSettingsActive = location.pathname.startsWith("/PagesSettings");

  if (!role) return null;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`
        fixed z-40 h-full w-[268px]
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        flex flex-col
        transition-transform duration-300 ease-out
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">

          {/* ── Brand ── */}
          <div className="px-4 py-5 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-primary/30">
                <span className="material-symbols-outlined text-[18px]">accessible_forward</span>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">PWD System</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Brgy. Trapiche</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* ── Nav ── */}
          <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-0.5 scrollbar-none">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-1">
              Main Menu
            </p>

            {regularItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                  ${isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="material-symbols-outlined text-[20px] flex-shrink-0">{item.icon}</span>
                    <span className="text-[13px] font-semibold truncate flex-1">{item.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />}
                  </>
                )}
              </NavLink>
            ))}

            {/* ── Settings ── */}
            {hasSettingsItem && (
              <div className="mt-3">
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 mb-1">
                  Settings
                </p>

                {role === ROLES.ADMIN ? (
                  <>
                    {/* Settings toggle */}
                    <button
                      onClick={() => setSettingsOpen((v) => !v)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 group
                        ${isSettingsActive
                          ? "bg-primary/10 dark:bg-primary/10"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/70"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* ── Settings icon + red dot ── */}
                        <span className="relative flex-shrink-0">
                          <span className={`material-symbols-outlined text-[20px]
                            ${isSettingsActive ? "text-primary" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`}>
                            settings
                          </span>
                          {pendingAccessCount > 0 &&  (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                          )}
                        </span>
                        <span className={`text-[13px] font-semibold
                          ${isSettingsActive ? "text-primary" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                          Settings
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {pendingAccessCount > 0 &&  (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400">
                            {pendingAccessCount}
                          </span>
                        )}
                        <span className={`material-symbols-outlined text-[18px] text-slate-400 transition-transform duration-200
                          ${settingsOpen ? "rotate-180" : ""}`}>
                          expand_more
                        </span>
                      </div>
                    </button>

                    {/* navGroups dropdown */}
                    <div className={`overflow-hidden transition-all duration-200
                      ${settingsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="ml-3 pl-3 border-l border-slate-200 dark:border-slate-700/50 mt-1 flex flex-col gap-1">
                        {navGroups.filter((group) => group.roles.includes(role)).map((group) => {
                          const isGroupOpen = openGroups.includes(group.key);
                          const hasActive   = group.items.some((i) => location.pathname === i.path);
                          return (
                            <div key={group.key}>
                              <button
                                onClick={() => toggleGroup(group.key)}
                                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all duration-150 group
                                  ${hasActive ? "bg-primary/8 dark:bg-primary/10" : "hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className={`material-symbols-outlined text-[16px] flex-shrink-0
                                    ${hasActive ? "text-primary" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
                                    {group.icon}
                                  </span>
                                  <span className={`text-[11px] font-bold
                                    ${hasActive ? "text-primary" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white"}`}>
                                    {group.label}
                                  </span>
                                </div>
                                <span className={`material-symbols-outlined text-[14px] text-slate-400 transition-transform duration-200
                                  ${isGroupOpen ? "rotate-180" : ""}`}>
                                  expand_more
                                </span>
                              </button>

                              <div className={`overflow-hidden transition-all duration-200
                                ${isGroupOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className="ml-3 pl-2.5 border-l border-slate-200 dark:border-slate-700/50 mt-0.5 mb-0.5 flex flex-col gap-0.5">
                                  {group.items.map((item) => (
                                    <NavLink
                                      key={item.path}
                                      to={item.path}
                                      onClick={closeSidebar}
                                      className={({ isActive }) =>
                                        `flex items-center justify-between px-2.5 py-2 rounded-lg transition-all duration-150
                                        ${isActive
                                          ? "bg-primary text-white shadow-sm shadow-primary/25"
                                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                                        }`
                                      }
                                    >
                                      {({ isActive }) => (
                                        <>
                                          <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[15px] flex-shrink-0">{item.icon}</span>
                                            <span className="text-[11px] font-semibold truncate">{item.label}</span>
                                          </div>
                                          {item.badge && pendingAccessCount > 0 && (
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0
                                              ${isActive ? "bg-white/20 text-white" : "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"}`}>
                                              {pendingAccessCount}
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </NavLink>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  // ── Staff & User — direct link lang ──
                  <NavLink
                    to="/PagesSettings"
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                      ${isActive
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="material-symbols-outlined text-[20px] flex-shrink-0">settings</span>
                        <span className="text-[13px] font-semibold flex-1">Settings</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />}
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            )}
          </nav>

          {/* ── User Profile + Logout ── */}
          <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700/50 flex flex-col gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
              bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-blue-600 flex items-center justify-center shadow-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <span className="text-white font-black text-sm">{initials}</span>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-slate-800 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {userName || (role === ROLES.ADMIN ? "Admin User" : role === ROLES.STAFF ? "Staff User" : "User")}
                </p>
                <span className={`inline-block text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-md mt-0.5
                  ${role === ROLES.ADMIN ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                  : role === ROLES.STAFF ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  :                        "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                  {role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-slate-500 dark:text-slate-400
                hover:bg-red-50 dark:hover:bg-red-900/15
                hover:text-red-600 dark:hover:text-red-400
                transition-all duration-150"
            >
              <span className="material-symbols-outlined text-[20px] flex-shrink-0">logout</span>
              <span className="text-[13px] font-semibold">Log Out</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;