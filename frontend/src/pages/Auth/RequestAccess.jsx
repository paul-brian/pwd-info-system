import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import API_URL from "../api/api";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ✅ Correct endpoint and field names to match backend
      const res = await axios.post(`${API_URL}/api/access/request`, 
        {
          full_name: form.fullName,  // matches DB column
          email: form.email,
          role: form.role,
          reason: form.reason,
        },
      );

      setSuccess("Request submitted successfully ✅");

      // Clear form
      setForm({
        fullName: "",
        email: "",
        role: "",
        office: "",
        reason: "",
      });

      // Redirect after 1.5 sec
      setTimeout(() => {
        navigate("/AdminStaffLogin");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.Error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-200 flex">
      <main className="flex flex-1">

        {/* LEFT BRANDING */}
        <section className="hidden md:flex md:w-2/5 relative px-12 justify-center flex-col overflow-hidden">
          
          <div className="absolute w-96 h-96 bg-primary/20 blur-3xl rounded-full top-20 left-10" />
          <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-20 right-10" />


          <div className="relative z-10">
            <div className="flex flex-col items-center mb-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfU84kTLMMyDY39DJnKEm3nYMmvy7Da-VCIZ5z-A4CfhiqNrNJ2cDvZgDhl6SqyPB2r97145a8u-ltQlRnA_obFHZSnvEKv1VFwZA3iUjCJnH9nAXoDFAdjBEMDaiOuvCY_QRzsNLiUsm-7NFFeMaK9skAqzCfCS_Mb27NoNfaGipWeBYwYRpQwzvV5TEjNt1CAj_YqIERRjoQjrqlAim7PYEx8sDUudgPfhZ2U3Cf2UyvVuBMf-Dp4TG9RAxKDDioqGLjCWoO-DOd"
                alt="PWD Logo"
                className="w-36 h-36 rounded-full object-cover shadow-xl"
              />
              <h1 className="text-1xl font-bold mb-4 text-center">Barangay Trapiche</h1>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold mb-2 pt-2 text-center">
              PWD Information System
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-8 text-center">
              Centralized management and secure database for Persons with Disabilities within the jurisdiction of Barangay Trapiche.
            </p>
          </div>
        </section>

        {/* RIGHT FORM PANEL */}
        <section className="w-full md:w-3/5 bg-darkBg flex justify-center items-center px-6 md:px-20 py-10">
          <div className="max-w-md w-full">
            <div>
              <header className="mb-8">
                <h2 className="text-3xl font-extrabold mb-2 text-center">Request Access</h2>
                <p className="text-slate-500 text-center">
                  Fill out the form below to request admin or staff access.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-5">

                {error && <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
                {success && <div className="bg-green-100 text-green-600 text-sm p-3 rounded-lg">{success}</div>}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Requested Role</label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    >
                      <option value="">Select Role</option>
                      <option value="staff">Barangay Staff</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Office / Department</label>
                    <input
                      name="office"
                      value={form.office}
                      onChange={handleChange}
                      required
                      placeholder="PWD Office"
                      className="w-full pl-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for Request</label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Explain why you are requesting access..."
                    className="w-full pl-11 py-3 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#135bec] hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex justify-center items-center gap-2 shadow-lg"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                  <span className="material-icons">send</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/AdminStaffLogin")}
                    className="text-primary font-semibold ml-1 cursor-pointer hover:underline"
                  >
                    ← Back to Login
                  </button>
                </div>

              </form>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default RequestAccess;