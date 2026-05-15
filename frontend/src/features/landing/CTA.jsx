// import React from "react";
// import { useNavigate} from "react-router-dom";

// function CTA() {
//   const navigate = useNavigate();
//   return (
//     <div>
//       <section className="py-24 relative" data-purpose="cta-final">
//         <div className="container mx-auto px-6">
//           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center relative overflow-hidden border border-white/10">
//             <div className="relative z-10 space-y-8">
//               <h2 className="text-3xl md:text-5xl font-extrabold text-white">Modernize Your Barangay's <br />PWD Management Today</h2>
//               <p className="text-slate-400 max-w-2xl mx-auto text-lg">Join dozens of barangays leading the digital transformation in public service. Secure, efficient, and user-friendly.</p>
//               <div className="flex justify-center">
//                 <button 
//                 onClick={() => navigate("/Login")}
//                 className="px-12 py-5 gradient-bg text-white font-bold text-xl rounded-twelve hover:scale-105 transition-transform shadow-2xl shadow-brandEmerald/40">
//                   Login to System
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default CTA;

import React from "react";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative" data-purpose="cta-final">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden border border-white/10">

          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              Barangay Trapiche · PWD Information System
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Access the PWD Management<br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                System Portal
              </span>
            </h2>

            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              Log in to manage PWD profiles, health records, event attendance, inventory, and SMS notifications — all in one secure platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/AdminStaffLogin")}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-base rounded-xl hover:scale-105 transition-transform shadow-xl shadow-blue-500/20"
              >
                Login as Admin / Staff
              </button>
              <button
                onClick={() => navigate("/UserLogin")}
                className="w-full sm:w-auto px-10 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold text-base rounded-xl transition-colors border border-slate-600"
              >
                Login as PWD Member
              </button>
            </div>

            <p className="text-slate-600 text-xs">
              For access requests, please coordinate with the Barangay Trapiche PWD coordinator.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;