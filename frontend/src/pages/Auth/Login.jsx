// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-[100dvh] flex flex-col md:flex-row font-['Public_Sans'] bg-[#f6f6f8]">

//       {/* LEFT – BRANDING */}
//       <aside className="md:w-5/12 lg:w-4/12 bg-[#135bec] text-white p-6 md:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
//         {/* Pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full" />
//           <div className="absolute bottom-0 -right-10 w-80 h-80 bg-white rounded-xl" />
//         </div>

//         <div className="relative z-10 flex flex-col px-5 py-12">
//           {/* LOGO – CENTER */}
//           <div className="flex flex-col items-center mb-6">
//             <img
//               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfU84kTLMMyDY39DJnKEm3nYMmvy7Da-VCIZ5z-A4CfhiqNrNJ2cDvZgDhl6SqyPB2r97145a8u-ltQlRnA_obFHZSnvEKv1VFwZA3iUjCJnH9nAXoDFAdjBEMDaiOuvCY_QRzsNLiUsm-7NFFeMaK9skAqzCfCS_Mb27NoNfaGipWeBYwYRpQwzvV5TEjNt1CAj_YqIERRjoQjrqlAim7PYEx8sDUudgPfhZ2U3Cf2UyvVuBMf-Dp4TG9RAxKDDioqGLjCWoO-DOd"
//               alt="PWD Logo"
//               className="w-36 h-36 rounded-full object-cover shadow-xl"
//             />
//             <h1 className="text-1xl font-bold mb-4 text-center">
//               Barangay Trapiche
//             </h1>
//           </div>

//           {/* System Title & Description */}
//           <div className="text-left max-w-sm pt-5">
//             <h2 className="text-2xl lg:text-3xl font-extrabold mb-2 pt-2">
//               PWD Information System
//             </h2>
//             <p className="text-lg font-light leading-relaxed pt-5">
//               A centralized portal providing accessible government services and
//               digital identity management for Persons with Disability.
//             </p>
//           </div>
//         </div>
//       </aside>

//       {/* RIGHT – ACCESS SELECTION */}
//       <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12 lg:p-20 bg-white overflow-y-auto">
//         <div className="w-full max-w-2xl">
//           <header className="mb-10 text-center md:text-left">
//             <h3 className="text-3xl font-bold mb-2">Welcome</h3>
//             <p className="text-slate-500">
//               Please select your access type to continue.
//             </p>
//           </header>

//           <div className="space-y-6">
//             {/* ADMIN / STAFF */}
//             <button
//               onClick={() => navigate("/AdminStaffLogin")}
//               className="group w-full flex items-start p-6 border-2 border-slate-200 rounded-xl hover:border-[#135bec] hover:shadow-lg transition"
//             >
//               <div className="p-4 rounded-lg bg-[#135bec]/10 group-hover:bg-[#135bec] transition mr-6">
//                 <span className="material-icons text-4xl text-[#135bec] group-hover:text-white">
//                   admin_panel_settings
//                 </span>
//               </div>

//               <div className="flex-1 text-left">
//                 <h4 className="text-xl font-bold mb-2 group-hover:text-[#135bec]">
//                   Secure Access
//                 </h4>
//                 <p className="text-slate-500">
//                   Access your digital ID, update personal information, view
//                   government benefits, and track application status.
//                 </p>
//               </div>

//               <span className="material-icons text-3xl text-[#135bec] self-center opacity-0 group-hover:opacity-100 transition">
//                 chevron_right
//               </span>
//             </button>

//             {/* PWD USER */}
//             <button
//               onClick={() => navigate("/UserLogin")}
//               className="group w-full flex items-start p-6 border-2 border-slate-200 rounded-xl hover:border-[#135bec] hover:shadow-lg transition"
//             >
//               <div className="p-4 rounded-lg bg-[#135bec]/10 group-hover:bg-[#135bec] transition mr-6">
//                 <span className="material-icons text-4xl text-[#135bec] group-hover:text-white">
//                   accessible
//                 </span>
//               </div>

//               <div className="flex-1 text-left">
//                 <h4 className="text-xl font-bold mb-2 group-hover:text-[#135bec]">
//                   Fully Access Accessible
//                 </h4>
//                 <p className="text-slate-500">
//                   Secure login for authorized government personnel to manage
//                   records, verify applications, and update system settings.
//                 </p>
//               </div>

//               <span className="material-icons text-3xl text-[#135bec] self-center opacity-0 group-hover:opacity-100 transition">
//                 chevron_right
//               </span>
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Login;

import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbars"

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-darkBg text-slate-200 font-sans">
      
      {/* SAME NAVBAR AS LANDING */}
      <Navbar />

      {/* CENTER CONTAINER */}
      <div className="pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="w-full max-w-3xl">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white mb-3">
              Welcome to PWD Information System
            </h2>
            <p className="text-slate-400">
              Please select your access type to continue.
            </p>
          </div>

          {/* GLASS CARD */}
          <div className="glass-effect rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl space-y-6">

            {/* ADMIN / STAFF */}
            <button
              onClick={() => navigate("/AdminStaffLogin")}
              className="group w-full flex items-start p-6 bg-slate-800/50 border border-white/10 rounded-xl hover:border-primary hover:shadow-lg transition"
            >
              <div className="p-4 rounded-lg bg-primary/10 group-hover:bg-primary transition mr-6">
                <span className="material-icons text-4xl text-primary group-hover:text-white">
                  admin_panel_settings
                </span>
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-xl font-bold mb-2 group-hover:text-primary">
                  Admin / Staff Access
                </h4>
                <p className="text-slate-400">
                  Secure login for authorized personnel to manage records,
                  verify applications, and update system settings.
                </p>
              </div>

              <span className="material-icons text-3xl text-primary self-center opacity-0 group-hover:opacity-100 transition">
                chevron_right
              </span>
            </button>

            {/* PWD USER */}
            <button
              onClick={() => navigate("/UserLogin")}
              className="group w-full flex items-start p-6 bg-slate-800/50 border border-white/10 rounded-xl hover:border-green-500 hover:shadow-lg transition"
            >
              <div className="p-4 rounded-lg bg-green-500/10 group-hover:bg-green-500 transition mr-6">
                <span className="material-icons text-4xl text-green-500 group-hover:text-white">
                  accessible
                </span>
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-xl font-bold mb-2 group-hover:text-green-500">
                  PWD User Access
                </h4>
                <p className="text-slate-400">
                  Access your digital ID, update personal information,
                  view government benefits, and track application status.
                </p>
              </div>

              <span className="material-icons text-3xl text-green-500 self-center opacity-0 group-hover:opacity-100 transition">
                chevron_right
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;