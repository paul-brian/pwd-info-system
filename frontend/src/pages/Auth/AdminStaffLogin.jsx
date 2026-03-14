import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api/api";

const AdminStaffLogin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        values
      );

   const { token, role, full_name, image} = response.data;
  
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("userToken", token);
    storage.setItem("userRole", role);
    storage.setItem("userName", full_name);
    storage.setItem("userImage", image || "");

      showToast("Login successful ✅", "success");
      setTimeout(() => navigate("/PagesDashboard"), 1200);
      console.log("ROLE:", role);
      console.log("FULL NAME:", full_name);
      console.log("IMAGE:", image);

    } catch (error) {
      const msg =
        error.response?.data?.Error ||
        "Login failed. Please check credentials ❌";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-200 flex">

      {/* LEFT SIDE */}
      <section className="hidden md:flex md:w-2/5 relative px-12 justify-center flex-col overflow-hidden">

        {/* Glow Background */}
        <div className="absolute w-96 h-96 bg-primary/20 blur-3xl rounded-full top-20 left-10" />
        <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-20 right-10" />

        {/* Back Button */}
        <button
          onClick={() => navigate("/Login")}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-300 hover:text-white transition"
        >
          <span className="material-icons text-2xl">arrow_back</span>
          Back
        </button>

        <div className="relative z-10 text-center">

          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfU84kTLMMyDY39DJnKEm3nYMmvy7Da-VCIZ5z-A4CfhiqNrNJ2cDvZgDhl6SqyPB2r97145a8u-ltQlRnA_obFHZSnvEKv1VFwZA3iUjCJnH9nAXoDFAdjBEMDaiOuvCY_QRzsNLiUsm-7NFFeMaK9skAqzCfCS_Mb27NoNfaGipWeBYwYRpQwzvV5TEjNt1CAj_YqIERRjoQjrqlAim7PYEx8sDUudgPfhZ2U3Cf2UyvVuBMf-Dp4TG9RAxKDDioqGLjCWoO-DOd"
            alt="PWD Logo"
            className="w-36 h-36 rounded-full object-cover shadow-2xl mx-auto mb-6"
          />

          <h1 className="text-3xl font-extrabold mb-4">
            PWD Information System
          </h1>

          <p className="text-slate-400 leading-relaxed mb-8">
            Secure access portal for authorized personnel managing PWD records,
            applications, and system settings.
          </p>

          {/* FEATURES */}
          <div className="space-y-6 text-left">

            <div className="flex gap-4">
              <span className="material-icons bg-white/10 p-2 rounded-lg text-primary">
                verified_user
              </span>
              <div>
                <p className="font-semibold text-white">Authorized Access</p>
                <p className="text-sm text-slate-400">
                  Only registered staff or admin can login
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="material-icons bg-white/10 p-2 rounded-lg text-primary">
                admin_panel_settings
              </span>
              <div>
                <p className="font-semibold text-white">Full Control</p>
                <p className="text-sm text-slate-400">
                  Manage users, verify applications, and update settings
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="w-full md:w-3/5 flex justify-center items-center px-6 py-12 relative">

        {/* Mobile Back */}
        <button
          onClick={() => navigate("/Login")}
          className="md:hidden absolute top-6 left-6 text-slate-300 hover:text-white"
        >
          <span className="material-icons text-2xl">arrow_back</span>
        </button>

        <div className="w-full max-w-md">

          <div className="glass-effect border border-white/10 rounded-2xl p-8 shadow-2xl">

            <header className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Admin / Staff Login
              </h2>
              <p className="text-slate-400 text-sm">
                Please enter your credentials to access the management dashboard.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* EMAIL */}
              <div>
                <label className="block text-sm mb-2 text-slate-300">
                  Email or Username
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    person
                  </span>
                  <input
                    type="text"
                    value={values.email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    placeholder="Enter your email or username"
                    className="w-full pl-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-primary"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full pl-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    required
                  />
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  className="accent-primary w-4 h-4"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>

            </form>
          </div>

          {/* REQUEST ACCESS */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?
              <span
                onClick={() => navigate("/RequestAccess")}
                className="text-primary font-semibold ml-1 cursor-pointer hover:underline"
              >
                Request Access
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-5 py-3 rounded-lg text-white shadow-lg ${
            toast.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminStaffLogin;