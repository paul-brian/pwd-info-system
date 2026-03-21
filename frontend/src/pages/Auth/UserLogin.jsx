import React, { useState } from "react";
import { ToastContainer } from "../../components/ui/Toast";
import LoginSuccessLoading from "../../components/ui/LoginSuccessLoding";
import useToast from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/api";
import axios from "axios";

const UserLogin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ pwd_number: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const [rememberMe, setRememberMe] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login/pwd`, values);
      const { token, role, full_name, image } = response.data;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("userToken", token);
      storage.setItem("userRole", role);
      storage.setItem("userName", full_name);
      storage.setItem("userImage", image || "");
      setShowSuccess(true);
    } catch (error) {
      showToast(error.response?.data?.error || error.response?.data?.message || "Invalid PWD number or password.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-200 flex">

      {/* ── LEFT SIDE (desktop only) ── */}
      <section className="hidden md:flex md:w-2/5 relative px-12 justify-center flex-col overflow-hidden border-r border-white/5">

        {/* Glow */}
        <div className="absolute w-96 h-96 bg-primary/20 blur-3xl rounded-full top-20 left-10 pointer-events-none" />
        <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-20 right-10 pointer-events-none" />

        {/* Back */}
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
            className="w-36 h-36 rounded-full object-cover shadow-2xl mx-auto mb-6 ring-2 ring-primary/30"
          />
          <h1 className="text-3xl font-extrabold mb-4">PWD Information System</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            Digital platform for inclusive, secure and accessible services
            for persons with disabilities.
          </p>

          <div className="space-y-6 text-left">
            <div className="flex gap-4 items-start">
              <span className="material-icons bg-white/10 p-2 rounded-lg text-primary shrink-0">
                verified_user
              </span>
              <div>
                <p className="font-semibold text-white">Secure Records</p>
                <p className="text-sm text-slate-400">Protected and encrypted data</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-icons bg-white/10 p-2 rounded-lg text-primary shrink-0">
                accessibility
              </span>
              <div>
                <p className="font-semibold text-white">Accessible Design</p>
                <p className="text-sm text-slate-400">Inclusive and responsive interface</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RIGHT SIDE ── */}
      <section className="w-full md:w-3/5 flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative min-h-screen">

        {/* Mobile Back */}
        <button
          onClick={() => navigate("/Login")}
          className="md:hidden absolute top-5 left-5 flex items-center gap-1 text-slate-300 hover:text-white transition"
        >
          <span className="material-icons text-2xl">arrow_back</span>
        </button>

        <div className="w-full max-w-md">

          {/* LOGO + TITLE — mobile only */}
          <div className="flex flex-col items-center mb-6 md:hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfU84kTLMMyDY39DJnKEm3nYMmvy7Da-VCIZ5z-A4CfhiqNrNJ2cDvZgDhl6SqyPB2r97145a8u-ltQlRnA_obFHZSnvEKv1VFwZA3iUjCJnH9nAXoDFAdjBEMDaiOuvCY_QRzsNLiUsm-7NFFeMaK9skAqzCfCS_Mb27NoNfaGipWeBYwYRpQwzvV5TEjNt1CAj_YqIERRjoQjrqlAim7PYEx8sDUudgPfhZ2U3Cf2UyvVuBMf-Dp4TG9RAxKDDioqGLjCWoO-DOd"
              alt="PWD Logo"
              className="w-24 h-24 rounded-full object-cover shadow-2xl mb-3 ring-2 ring-primary/40"
            />
            <h1 className="text-xl font-extrabold text-white text-center">
              PWD Information System
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
              User Portal
            </p>
          </div>

          {/* FORM CARD */}
          <div className="glass-effect border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

            <header className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                PWD User Login
              </h2>
              <p className="text-slate-400 text-sm">
                Please enter your credentials to access your dashboard.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* PWD ID NUMBER */}
              <div>
                <label className="block text-sm mb-2 text-slate-300">
                  PWD ID Number
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    person
                  </span>
                  <input
                    type="text"
                    value={values.pwd_number}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      if (digits.length > 16) return;
                      let formatted = digits;
                      if (digits.length > 2) formatted = digits.slice(0, 2) + "-" + digits.slice(2);
                      if (digits.length > 6) formatted = formatted.slice(0, 7) + "-" + formatted.slice(7);
                      if (digits.length > 9) formatted = formatted.slice(0, 11) + "-" + formatted.slice(11);
                      setValues({ ...values, pwd_number: formatted });
                    }}
                    placeholder="00-0000-000-0000000"
                    maxLength={19}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white text-sm placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm mb-2 text-slate-300">Password</label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white text-sm placeholder:text-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    <span className="material-icons text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="accent-primary w-4 h-4 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-600 active:scale-[0.98] text-white font-bold py-3 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </button>

            </form>
          </div>

        </div>
      </section>

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {showSuccess && (
        <LoginSuccessLoading onComplete={() => navigate("/PagesDashboard")} />
      )}

    </div>
  );
};

export default UserLogin;