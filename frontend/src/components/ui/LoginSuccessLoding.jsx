import React, { useEffect, useState } from "react";

const LoginSuccess = ({ onComplete }) => {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 3000);
    const t2 = setTimeout(() => setPhase("exit"), 3500);
    const t3 = setTimeout(() => onComplete(), 3500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div
      className={`
        fixed inset-0 z-[999] flex flex-col items-center justify-center
        bg-[#0a0f1e] px-4 transition-opacity duration-300
        ${phase === "exit" ? "opacity-0" : "opacity-100"}
      `}
    >
      {/* BG GLOWS */}
      <div className="absolute w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full -top-20 -left-20 blur-[70px] pointer-events-none" />
      <div className="absolute w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/8 rounded-full -bottom-16 -right-16 blur-[60px] pointer-events-none" />

      {/* SPINNER */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6 sm:mb-8">

        {/* Track */}
        <svg className="absolute inset-0" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="56" stroke="rgba(255,255,255,0.04)" strokeWidth="5"/>
        </svg>

        {/* Spinning arc */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 120 120"
          fill="none"
          style={{ animation: "spin 1.2s cubic-bezier(0.5,0,0.5,1) infinite" }}
        >
          <defs>
            <linearGradient id="blue-grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="100%" stopColor="#2563eb"/>
            </linearGradient>
          </defs>
          <circle
            cx="60" cy="60" r="56"
            stroke="url(#blue-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="351"
            strokeDashoffset="263"
          />
        </svg>

        {/* Check circle */}
        <div
          className="absolute inset-[18px] rounded-full flex items-center justify-center"
          style={{
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(37,99,235,0.2)",
            animation: "pulse-glow 2.4s ease-in-out infinite",
          }}
        >
          <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8 sm:w-9 sm:h-9">
            <path
              d="M7 18 L15 26 L29 10"
              stroke="#93c5fd"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 50,
                strokeDashoffset: 50,
                animation: "draw-check 0.5s ease forwards 0.2s",
              }}
            />
          </svg>
        </div>
      </div>

      {/* TEXT */}
      <p className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight mb-1 text-center">
        Login Successful
      </p>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 text-center">
        Preparing your dashboard...
      </p>

      {/* PROGRESS BAR */}
      <div className="w-36 sm:w-44 h-[3px] bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ animation: "fill-progress 2s cubic-bezier(0.4,0,0.2,1) forwards" }}
        />
      </div>

      {/* STEPS */}
      <div className="mt-6 flex flex-col gap-2 w-44 sm:w-52">
        {[
          { label: "Verifying credentials",    delay: "0.2s" },
          { label: "Loading your profile",     delay: "0.7s" },
          { label: "Redirecting to dashboard", delay: "1.2s" },
        ].map(({ label, delay }) => (
          <div
            key={label}
            className="flex items-center gap-2"
            style={{
              opacity: 0,
              transform: "translateX(-8px)",
              animation: `step-in 0.4s ease forwards ${delay}`,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
            <span className="text-[11px] sm:text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.2); }
          50%       { box-shadow: 0 0 0 10px rgba(37,99,235,0); }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fill-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes step-in {
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginSuccess;