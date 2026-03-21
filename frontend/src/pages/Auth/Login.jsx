import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbars";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-darkBg text-slate-200 font-sans">

      <Navbar />

      {/* CENTER CONTAINER */}
      <div className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 2xl:px-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-3xl 2xl:max-w-5xl">

          {/* HEADER */}
          <div className="text-center mb-8 sm:mb-12 2xl:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-6xl font-extrabold text-white mb-3 2xl:mb-5 leading-tight">
              Welcome to PWD Information System
            </h2>
            <p className="text-slate-400 text-sm sm:text-base 2xl:text-xl">
              Please select your access type to continue.
            </p>
          </div>

          {/* GLASS CARD */}
          <div className="glass-effect rounded-2xl 2xl:rounded-3xl p-5 sm:p-8 md:p-12 2xl:p-16 border border-white/10 shadow-2xl space-y-4 sm:space-y-6 2xl:space-y-8">

            {/* ADMIN / STAFF */}
            <button
              onClick={() => navigate("/AdminStaffLogin")}
              className="group w-full flex items-center sm:items-start p-4 sm:p-6 2xl:p-8 bg-slate-800/50 border border-white/10 rounded-xl 2xl:rounded-2xl hover:border-primary hover:shadow-lg transition"
            >
              <div className="p-3 sm:p-4 2xl:p-6 rounded-lg bg-primary/10 group-hover:bg-primary transition mr-4 sm:mr-6 2xl:mr-8 shrink-0">
                <span className="material-icons text-2xl sm:text-4xl 2xl:text-6xl text-primary group-hover:text-white">
                  admin_panel_settings
                </span>
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-base sm:text-xl 2xl:text-3xl font-bold mb-1 sm:mb-2 2xl:mb-3 group-hover:text-primary">
                  Admin / Staff Access
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base 2xl:text-xl hidden sm:block">
                  Secure login for authorized personnel to manage records,
                  verify applications, and update system settings.
                </p>
                <p className="text-slate-400 text-xs sm:hidden">
                  For authorized personnel only.
                </p>
              </div>

              <span className="material-icons text-xl sm:text-3xl 2xl:text-5xl text-primary self-center opacity-0 group-hover:opacity-100 transition shrink-0 ml-2 2xl:ml-4">
                chevron_right
              </span>
            </button>

            {/* PWD USER */}
            <button
              onClick={() => navigate("/UserLogin")}
              className="group w-full flex items-center sm:items-start p-4 sm:p-6 2xl:p-8 bg-slate-800/50 border border-white/10 rounded-xl 2xl:rounded-2xl hover:border-green-500 hover:shadow-lg transition"
            >
              <div className="p-3 sm:p-4 2xl:p-6 rounded-lg bg-green-500/10 group-hover:bg-green-500 transition mr-4 sm:mr-6 2xl:mr-8 shrink-0">
                <span className="material-icons text-2xl sm:text-4xl 2xl:text-6xl text-green-500 group-hover:text-white">
                  accessible
                </span>
              </div>

              <div className="flex-1 text-left">
                <h4 className="text-base sm:text-xl 2xl:text-3xl font-bold mb-1 sm:mb-2 2xl:mb-3 group-hover:text-green-500">
                  PWD User Access
                </h4>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base 2xl:text-xl hidden sm:block">
                  Access your digital ID, update personal information,
                  view government benefits, and track application status.
                </p>
                <p className="text-slate-400 text-xs sm:hidden">
                  Access your digital ID and benefits.
                </p>
              </div>

              <span className="material-icons text-xl sm:text-3xl 2xl:text-5xl text-green-500 self-center opacity-0 group-hover:opacity-100 transition shrink-0 ml-2 2xl:ml-4">
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