// import React from "react";

// function DashboardPreview() {
//   return (
//     <div>
//       <section className="py-24" data-purpose="dashboard-preview">
//         <div className="container mx-auto px-6">
//           <div className="max-w-6xl mx-auto">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-bold text-white mb-4">Command Center Overview</h2>
//               <p className="text-slate-400">Everything you need to manage your community, right at your fingertips.</p>
//             </div>
//             <div className="glass-effect rounded-2xl p-6 md:p-10 shadow-3xl border-white/10 relative overflow-hidden">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//                 {/* <!-- Metric 1 --> */}
//                 <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5">
//                   <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Registered PWD</span>
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-3xl font-bold text-white">4,291</span>
//                     <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-full">+4.5%</span>
//                   </div>
//                 </div>
//                 {/* <!-- Metric 2 --> */}
//                 <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5">
//                   <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Approved Requests</span>
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-3xl font-bold text-white">3,850</span>
//                     <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-full">92%</span>
//                   </div>
//                 </div>
//                 {/* <!-- Metric 3 --> */}
//                 <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5">
//                   <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending Approvals</span>
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-3xl font-bold text-white">441</span>
//                     <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full">Action Required</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//                 {/* <!-- Analytics Graph Mockup --> */}
//                 <div className="lg:col-span-3 bg-slate-800/50 rounded-xl border border-white/5 p-6 h-[300px] flex flex-col">
//                   <h4 className="text-white font-semibold mb-6 flex items-center justify-between">
//                     Registration Trends
//                     <select className="bg-slate-900 border-none text-xs rounded-md text-slate-400">
//                       <option>Last 30 Days</option>
//                     </select>
//                   </h4>
//                   <div className="flex-1 flex items-end gap-2 px-2">
//                     <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[40%] rounded-t"></div>
//                     <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[60%] rounded-t"></div>
//                     <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[45%] rounded-t"></div>
//                     <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[80%] rounded-t"></div>
//                     <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[95%] rounded-t"></div>
//                     <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[70%] rounded-t"></div>
//                     <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors h-[85%] rounded-t"></div>
//                   </div>
//                 </div>
//                 {/* <!-- Table Preview Mockup --> */}
//                 <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-white/5 p-6">
//                   <h4 className="text-white font-semibold mb-6">Recent Applications</h4>
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
//                       <span className="text-slate-400">Juan Dela Cruz</span>
//                       <span className="px-2 py-0.5 bg-brandEmerald/10 text-brandEmerald rounded">Approved</span>
//                     </div>
//                     <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
//                       <span className="text-slate-400">Maria Santos</span>
//                       <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded">Pending</span>
//                     </div>
//                     <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
//                       <span className="text-slate-400">Ricardo Reyes</span>
//                       <span className="px-2 py-0.5 bg-brandEmerald/10 text-brandEmerald rounded">Approved</span>
//                     </div>
//                     <div className="flex items-center justify-between text-xs">
//                       <span className="text-slate-400">Elena Gomez</span>
//                       <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded">Pending</span>
//                     </div>
//                   </div>
//                   <button className="w-full mt-6 text-xs text-primary font-bold hover:underline">View All Records →</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default DashboardPreview;

import React, { useState, useEffect } from "react";
import API_URL from "../../api/api";

// ✅ Single public endpoint — aggregate counts only, no personal data
const usePublicStats = () => {
  const [stats, setStats]     = useState({ total_pwd: 0, active_pwd: 0, total_events: 0, pending_requests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
};

const StatCard = ({ label, value, badge, badgeColor, loading }) => (
  <div className="p-6 bg-slate-800/60 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
    <div className="flex items-end justify-between mt-2 gap-2">
      {loading ? (
        <div className="h-8 w-20 bg-slate-700 rounded-lg animate-pulse" />
      ) : (
        <span className="text-3xl font-bold text-white">{Number(value).toLocaleString()}</span>
      )}
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${badgeColor}`}>
        {badge}
      </span>
    </div>
  </div>
);

function DashboardPreview() {
  const { stats, loading } = usePublicStats();

  const barHeights = [40, 60, 45, 80, 95, 70, 85];
  const months     = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  return (
    <section className="py-24" data-purpose="dashboard-preview">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className="text-center mb-12 space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              System Overview
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Real-Time PWD Management Dashboard
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Monitor all PWD records, health status, events, and assistance distribution from a single unified dashboard.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">

            {/* ── Stats Cards — live from backend ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Registered PWDs"
                value={stats.total_pwd}
                badge="In System"
                badgeColor="bg-blue-500/20 text-blue-400"
                loading={loading}
              />
              <StatCard
                label="Active PWD Members"
                value={stats.active_pwd}
                badge="Active"
                badgeColor="bg-emerald-500/20 text-emerald-400"
                loading={loading}
              />
              <StatCard
                label="Total Events"
                value={stats.total_events}
                badge="Recorded"
                badgeColor="bg-amber-500/20 text-amber-400"
                loading={loading}
              />
              <StatCard
                label="Pending Requests"
                value={stats.pending_requests}
                badge={Number(stats.pending_requests) > 0 ? "Needs Action" : "All Clear"}
                badgeColor={Number(stats.pending_requests) > 0 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}
                loading={loading}
              />
            </div>

            {/* ── Chart + Info ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

              {/* Bar chart mockup */}
              <div className="lg:col-span-3 bg-slate-800/50 rounded-xl border border-white/5 p-5 h-[260px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-bold text-sm">Registration Trend</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Illustrative monthly overview</p>
                  </div>
                  <span className="text-[10px] bg-slate-700/60 text-slate-400 px-2 py-1 rounded-full">
                    Last 7 months
                  </span>
                </div>
                <div className="flex-1 flex items-end gap-2">
                  {months.map((month, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className="w-full bg-blue-500/25 hover:bg-blue-500/45 transition-colors rounded-t cursor-default"
                        style={{ height: `${barHeights[i]}%` }}
                      />
                      <span className="text-[9px] text-slate-500">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System info cards */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {[
                  { icon: "👤", label: "PWD Profiling",      desc: "Full registration with disability type, contact info, and emergency details" },
                  { icon: "🏥", label: "Health Monitoring",  desc: "Vital signs tracking and health status alerts for each PWD member" },
                  { icon: "📦", label: "Assistance Tracking", desc: "Inventory management with automatic stock adjustment on distribution" },
                  { icon: "📢", label: "SMS Notifications",  desc: "Broadcast messages to all active PWD members instantly" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-xl border border-white/5 p-3.5 hover:border-white/10 transition-colors">
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Login prompt ── */}
            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-slate-500 text-xs">
                Login required to access full dashboard, records, and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;