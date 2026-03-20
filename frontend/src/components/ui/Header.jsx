import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { getRouteMeta } from "../../routes/routeUtils";

const Header = ({ onMenu }) => {
  const location = useLocation();
  const { title, icon, path } = getRouteMeta(location.pathname);

  const [darkMode, setDarkMode] = useState(false);

  /* Persist theme */
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 md:px-8 py-2 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Hamburger */}
          <button
            onClick={onMenu}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Title + Icon */}
          <div className="flex items-center gap-2 sm:gap-3 animate-fade-in min-w-0">
            <span className="material-symbols-outlined text-primary text-lg sm:text-2xl flex-shrink-0">
              {icon}
            </span>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate">
                {title}
              </h2>

              {/* Breadcrumb */}
              <nav className="text-[11px] sm:text-xs text-slate-500 truncate">
                <NavLink to="/PagesDashboard" className="hover:underline">
                  Dashboard
                </NavLink>
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

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Search (sm and up) */}
          <label className="hidden sm:flex items-center h-9 sm:h-10 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 sm:px-3 w-32 sm:w-[180px] md:w-[240px] lg:w-[280px]">
            <span className="material-symbols-outlined text-slate-400 text-lg flex-shrink-0">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-xs sm:text-sm outline-none dark:text-white ml-1 sm:ml-2"
            />
          </label>

          {/* Notification */}
          <button className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 touch-target">
            <span className="material-symbols-outlined text-lg sm:text-xl">notifications</span>
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 dark:bg-blue-600 flex items-center justify-center flex-shrink-0 touch-target"
          >
            <span className="material-symbols-outlined text-white text-lg sm:text-xl">
              {darkMode ? "contrast" : "display_settings"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;