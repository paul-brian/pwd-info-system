import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/image/logo_trapiche.jpg";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hideLinks = location.pathname === "/Login";

  const handleClose = () => setMenuOpen(false);

  return (
    <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="glass-effect rounded-twelve px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-2xl">

        {/* Top Bar */}
        <div className="flex items-center justify-between gap-2">

          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={logo}
              alt="PWD Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <span className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
              PWD Information System
            </span>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 shrink-0">

            {/* Desktop Nav Links + Button — nasa right side lahat */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-white">
              {!hideLinks && (
                <>
                  <a href="/" className="hover:text-primary transition">Home</a>
                  <a href="#features" className="hover:text-primary transition">Features</a>
                  <a href="#about" className="hover:text-primary transition">About</a>
                  <a href="#contact" className="hover:text-primary transition">Contact</a>
                </>
              )}
              <a
                onClick={() => { handleClose(); navigate(hideLinks ? "/" : "/Login"); }}
                className="gradient-bg text-white text-sm px-5 lg:px-6 py-2 rounded-twelve shadow-lg hover:opacity-90 transition cursor-pointer"
              >
                {hideLinks ? "Home" : "Login"}
              </a>
            </div>

            {/* Mobile: Login/Home button — visible kahit walang dropdown */}
            {hideLinks && (
              <a
                onClick={() => { handleClose(); navigate("/"); }}
                className="md:hidden gradient-bg text-white text-xs px-3 py-1.5 rounded-twelve shadow-lg hover:opacity-90 transition cursor-pointer"
              >
                Home
              </a>
            )}

            {/* Mobile Toggle */}
            {!hideLinks && (
              <button
                className="md:hidden text-white p-1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Dropdown */}
        {!hideLinks && (
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 mt-3 sm:mt-4" : "max-h-0"}`}>
            <div className="flex flex-col gap-3 sm:gap-4 text-sm font-medium text-white border-t border-white/10 pt-3 sm:pt-4">
              <a href="/" onClick={handleClose} className="hover:text-primary transition">Home</a>
              <a href="#features" onClick={handleClose} className="hover:text-primary transition">Features</a>
              <a href="#about" onClick={handleClose} className="hover:text-primary transition">About</a>
              <a href="#contact" onClick={handleClose} className="hover:text-primary transition">Contact</a>
              <a
                onClick={() => { handleClose(); navigate("/Login"); }}
                className="gradient-bg text-white px-6 py-2 rounded-twelve text-center shadow-lg hover:opacity-90 transition cursor-pointer"
              >
                Login
              </a>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;