// import React from "react";
// import { useNavigate} from "react-router-dom";

// function Hero() {

//   const navigate = useNavigate();

//   return (
//     <div>
//       <section
//         className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
//         data-purpose="hero"
//       >
//         {/* <!-- Abstract Background Shapes --> */}
//         <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full"></div>
//         <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-brandEmerald/10 blur-[100px] rounded-full"></div>
//         <div className="container mx-auto px-6">
//           <div className="flex flex-col lg:flex-row items-center gap-16">
//             <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
//               <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
//                 Next-Gen Barangay Management
//               </span>
//               <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
//                 Smart Digital Platform for <span className="gradient-text">PWD Record Management</span>
//               </h1>
//               <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
//                 Centralized and secure barangay profiling for efficient data management. Streamline registrations, approvals, and reporting in one unified dashboard.
//               </p>
//               <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
//                 <button 
//                 onClick={() => navigate("#")}
//                 className="w-full sm:w-auto px-8 py-4 gradient-bg text-white font-bold rounded-twelve hover:scale-105 transition-transform shadow-xl shadow-brandEmerald/20">
//                   Explore System
//                 </button>
//                 <button 
//                 onClick={() => navigate("/Login")}
//                 className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-twelve hover:bg-slate-700 transition-colors border border-slate-700">
//                   Login to Portal
//                 </button>
//               </div>
//             </div>
//             <div className="w-full lg:w-1/2 relative animate-float">
//               {/* <!-- Mockup Dashboard Container --> */}
//               <div className="glass-effect rounded-2xl p-4 shadow-2xl border-white/5">
//                 <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
//                   <div className="flex gap-2">
//                     <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
//                     <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
//                     <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
//                   </div>
//                   <div className="h-2 w-32 bg-slate-700 rounded-full"></div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 mb-6">
//                   <div className="bg-white/5 p-4 rounded-xl border border-white/5">
//                     <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total PWDs</p>
//                     <h4 className="text-2xl font-bold text-white">1,284</h4>
//                   </div>
//                   <div className="bg-white/5 p-4 rounded-xl border border-white/5">
//                     <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Growth Rate</p>
//                     <h4 className="text-2xl font-bold text-brandEmerald">+12.5%</h4>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="h-32 bg-gradient-to-t from-primary/20 to-transparent rounded-xl flex items-end justify-around p-4 border border-white/5">
//                     <div className="w-4 h-16 bg-brandEmerald rounded-t"></div>
//                     <div className="w-4 h-24 bg-brandBlue rounded-t"></div>
//                     <div className="w-4 h-12 bg-brandEmerald rounded-t"></div>
//                     <div className="w-4 h-20 bg-brandBlue rounded-t"></div>
//                     <div className="w-4 h-14 bg-brandEmerald rounded-t"></div>
//                     <div className="w-4 h-28 bg-brandBlue rounded-t"></div>
//                   </div>
//                   <div className="h-20 bg-white/5 rounded-xl flex items-center px-4 gap-4">
//                     <div className="w-10 h-10 rounded-full bg-slate-700"></div>
//                     <div className="flex-1 space-y-2">
//                       <div className="h-2 w-1/2 bg-slate-700 rounded-full"></div>
//                       <div className="h-2 w-1/4 bg-slate-800 rounded-full"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Hero;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/api";

function Hero() {
  const navigate = useNavigate();

  // ✅ Live stats from backend — same /api/stats endpoint
  const [stats, setStats]     = useState({ total_pwd: 0, active_pwd: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const barHeights = [40, 60, 45, 80, 95, 70, 85];

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" data-purpose="hero">
      {/* Background glows */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-emerald-500/10 blur-[100px] rounded-full" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* ── Left: Text ── */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              Barangay Trapiche · Official PWD System
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Digital Management System for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Persons with Disability
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A centralized platform for managing PWD profiles, health records, event attendance,
              assistance distribution, and SMS notifications — all in one secure and accessible system.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/Login")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-xl shadow-blue-500/20"
              >
                Login to Portal
              </button>
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Explore Features
              </button>
            </div>
          </div>

          {/* ── Right: Dashboard Mockup ── */}
          <div className="w-full lg:w-1/2 relative">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/10">

              {/* Fake browser bar */}
              <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="h-2 w-32 bg-slate-700 rounded-full" />
              </div>

              {/* ✅ Live Stats — from /api/stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Registered PWDs</p>
                  {loading ? (
                    <div className="h-7 w-16 bg-slate-700 rounded-lg animate-pulse mt-1" />
                  ) : (
                    <h4 className="text-2xl font-bold text-white">
                      {Number(stats.total_pwd).toLocaleString()}
                    </h4>
                  )}
                  <p className="text-[10px] text-emerald-400 mt-1">Total in system</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Active Members</p>
                  {loading ? (
                    <div className="h-7 w-16 bg-slate-700 rounded-lg animate-pulse mt-1" />
                  ) : (
                    <h4 className="text-2xl font-bold text-emerald-400">
                      {Number(stats.active_pwd).toLocaleString()}
                    </h4>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1">Currently active</p>
                </div>
              </div>

              {/* Bar chart mockup */}
              <div className="h-28 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl flex items-end justify-around p-4 border border-white/5 mb-3">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-4 rounded-t transition-all duration-500"
                    style={{ height: `${h}%`, background: i % 2 === 0 ? "#10b981" : "#3b82f6" }}
                  />
                ))}
              </div>

              {/* ✅ System modules preview — no personal data */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">System Modules</p>
                {[
                  { icon: "person",             label: "PWD Profile Management",  color: "text-blue-400"    },
                  { icon: "health_and_safety",   label: "Health Record Monitoring", color: "text-emerald-400" },
                  { icon: "event_available",     label: "Event Attendance Tracking", color: "text-amber-400"  },
                  { icon: "inventory_2",         label: "Inventory & Assistance",   color: "text-violet-400"  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                    <span className={`material-symbols-outlined text-base flex-shrink-0 ${item.color}`}>
                      {item.icon}
                    </span>
                    <p className="text-[11px] text-slate-300 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;