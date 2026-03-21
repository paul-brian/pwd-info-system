import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "../../components/ui/Toast";
import useToast from "../../hooks/useToast";
import axios from 'axios';
import API_URL from "../../api/api";

const RequestAccess = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "",
    office: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/access/request`, {
        full_name: form.fullName,
        email: form.email,
        role: form.role,
        reason: form.reason,
      });
      showToast("Request submitted successfully", "success");
      setForm({ fullName: "", email: "", role: "", office: "", reason: "" });
      setTimeout(() => navigate("/AdminStaffLogin"), 4000);
    } catch (err) {
      showToast(error.response?.data?.error || error.response?.data?.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-200 flex">
      <main className="flex flex-1">

        {/* ── LEFT BRANDING (desktop only) ── */}
        <section className="hidden md:flex md:w-2/5 relative px-12 justify-center flex-col overflow-hidden border-r border-white/5">

          <div className="absolute w-96 h-96 bg-primary/20 blur-3xl rounded-full top-20 left-10 pointer-events-none" />
          <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-20 right-10 pointer-events-none" />

          <div className="relative z-10 text-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfU84kTLMMyDY39DJnKEm3nYMmvy7Da-VCIZ5z-A4CfhiqNrNJ2cDvZgDhl6SqyPB2r97145a8u-ltQlRnA_obFHZSnvEKv1VFwZA3iUjCJnH9nAXoDFAdjBEMDaiOuvCY_QRzsNLiUsm-7NFFeMaK9skAqzCfCS_Mb27NoNfaGipWeBYwYRpQwzvV5TEjNt1CAj_YqIERRjoQjrqlAim7PYEx8sDUudgPfhZ2U3Cf2UyvVuBMf-Dp4TG9RAxKDDioqGLjCWoO-DOd"
              alt="PWD Logo"
              className="w-36 h-36 rounded-full object-cover shadow-xl mx-auto mb-4 ring-2 ring-primary/30"
            />
            <h1 className="text-lg font-bold mb-1">Barangay Trapiche</h1>
            <h2 className="text-2xl lg:text-3xl font-extrabold mb-3">
              PWD Information System
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Centralized management and secure database for Persons with
              Disabilities within the jurisdiction of Barangay Trapiche.
            </p>
          </div>
        </section>

        {/* ── RIGHT FORM PANEL ── */}
        <section className="w-full md:w-3/5 flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 py-10 min-h-screen">

          <div className="w-full max-w-md">

            {/* LOGO — mobile only */}
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
                Barangay Trapiche
              </p>
            </div>

            {/* FORM CARD */}
            <div className="glass-effect border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

              <header className="mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
                  Request Access
                </h2>
                <p className="text-slate-400 text-sm">
                  Fill out the form below to request admin or staff access.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* FULL NAME */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                      person
                    </span>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white text-sm placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                      email
                    </span>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white text-sm placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* ROLE + OFFICE — stack on mobile, grid on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">Requested Role</label>
                    <div className="relative">
                      <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        badge
                      </span>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white text-sm appearance-none"
                      >
                        <option value="">Select Role</option>
                        <option value="staff">Barangay Staff</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">Office / Department</label>
                    <div className="relative">
                      <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                        business
                      </span>
                      <input
                        name="office"
                        value={form.office}
                        onChange={handleChange}
                        required
                        placeholder="PWD Office"
                        className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white text-sm placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* REASON */}
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Reason for Request</label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Explain why you are requesting access..."
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white text-sm placeholder:text-slate-500 resize-none"
                  />
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                  {!loading && <span className="material-icons text-[18px]">send</span>}
                </button>

                {/* BACK */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/AdminStaffLogin")}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Back to Login
                  </button>
                </div>

              </form>
            </div>

          </div>
        </section>

      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default RequestAccess;