import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="glass-effect rounded-twelve px-4 md:px-6 py-4 shadow-2xl">

        {/* Top Bar */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-bold text-white">
              PWD Digital System
            </span>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white">
            <a href="/" className="hover:text-primary transition">
              Home
            </a>
            <a href="#features" className="hover:text-primary transition">
              Features
            </a>
            <a href="#about" className="hover:text-primary transition">
              About
            </a>
            <a href="#contact" className="hover:text-primary transition">
              Contact
            </a>
            <a
              onClick={() => {
                handleClose();
                navigate("/Login");
              }}
              className="gradient-bg text-white px-6 py-2 rounded-twelve shadow-lg hover:opacity-90 transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4 text-sm font-medium text-white border-t border-white/10 pt-4">
            <a href="/" onClick={handleClose} className="hover:text-primary transition">
              Home
            </a>
            <a href="#features" onClick={handleClose} className="hover:text-primary transition">
              Features
            </a>
            <a href="#about" onClick={handleClose} className="hover:text-primary transition">
              About
            </a>
            <a href="#contact" onClick={handleClose} className="hover:text-primary transition">
              Contact
            </a>
            <a
              onClick={() => {
                handleClose();
                navigate("/Login");
              }}
              className="gradient-bg text-white px-6 py-2 rounded-twelve text-center shadow-lg hover:opacity-90 transition"
            >
              Login
            </a>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;