import React, { useState, useEffect, useRef } from "react";
import API_URL from "../api/api";
import axios from "axios";

const BASE_URL = API_URL;
const API = `${BASE_URL}/api`;

const getToken = () =>
  localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const DISABILITY_TYPES = [
  "Visual Impairment",
  "Hearing Impairment",
  "Physical Disability",
  "Intellectual Disability",
  "Psychosocial Disability",
  "Learning Disability",
  "Speech and Language Impairment",
  "Others",
];

const UserSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const fileInputRef = useRef();

  const [pwdForm, setPwdForm] = useState({
    contact_number: "",
    disability_type: "",
    medical_condition: "",
    address: "",
    emergency_contact: "",
  });

  const [accountForm, setAccountForm] = useState({ full_name: "", email: "" });

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/pwd/me`, { headers: authHeader() });
      setProfile(data);
      setPwdForm({
        contact_number: data.contact_number || "",
        disability_type: data.disability_type || "",
        medical_condition: data.medical_condition || "",
        address: data.address || "",
        emergency_contact: data.emergency_contact || "",
      });
      setAccountForm({ full_name: data.full_name || "", email: data.email || "" });
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdatePWD = async () => {
    try {
      setSaving(true);
      await axios.put(`${API}/pwd/me/update`, pwdForm, { headers: authHeader() });
      await fetchProfile();
      showToast("PWD profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!accountForm.full_name || !accountForm.email)
      return showToast("All fields required", "error");
    try {
      setSaving(true);
      await axios.put(`${API}/profile`, accountForm, { headers: authHeader() });
      await fetchProfile();
      showToast("Account info updated successfully");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update account", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword)
      return showToast("All fields required", "error");
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return showToast("New passwords don't match", "error");
    if (pwForm.newPassword.length < 6)
      return showToast("Password must be at least 6 characters", "error");
    try {
      setSaving(true);
      await axios.put(
        `${API}/profile/password`,
        { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword },
        { headers: authHeader() }
      );
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password changed successfully");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await axios.put(`${API}/profile/image`, formData, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });
      await fetchProfile();
      showToast("Profile photo updated");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to upload image", "error");
    }
  };

  const avatarUrl = profile?.image ? `${BASE_URL}/uploads/${profile.image}` : null;
  const initials = profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const tabs = [
    { key: "personal", icon: "accessibility", label: "PWD Information" },
    { key: "account", icon: "person_edit", label: "Account Info" },
    { key: "password", icon: "lock_reset", label: "Change Password" },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">

        <div>
          <h2 className="text-slate-900 dark:text-slate-50 text-4xl font-black tracking-tight">Profile Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">Manage your personal information and account security.</p>
        </div>

        {/* Profile Header */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 text-white text-4xl font-black">{initials}</div>
                )}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-900 hover:bg-blue-600 transition-all">
                <span className="material-symbols-outlined text-base">photo_camera</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-slate-900 dark:text-slate-50 text-2xl font-bold">{profile?.full_name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">PWD ID: <span className="font-bold text-slate-700 dark:text-slate-300">{profile?.pwd_number}</span></p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{profile?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                {profile?.disability_type && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">accessibility</span>
                    {profile.disability_type}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  {profile?.status}
                </span>
              </div>
              <div className="pt-2">
                <button onClick={() => fileInputRef.current?.click()} className="px-5 h-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-base">upload</span>
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveSection(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${activeSection === tab.key ? "border-primary text-primary" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}`}>
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* PWD Information */}
        {activeSection === "personal" && (
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3 px-2 border-l-4 border-primary">
              <h3 className="text-slate-900 dark:text-slate-50 text-xl font-bold">PWD Information</h3>
              <span className="ml-auto text-xs text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                Read-only
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: "badge", label: "PWD ID Number", value: profile?.pwd_number },
                { icon: "phone", label: "Contact Number", value: profile?.contact_number },
                { icon: "accessibility", label: "Type of Disability", value: profile?.disability_type },
                { icon: "medical_information", label: "Medical Condition", value: profile?.medical_condition },
                { icon: "emergency", label: "Emergency Contact", value: profile?.emergency_contact },
                { icon: "cake", label: "Birth Date", value: profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : null },
                { icon: "wc", label: "Gender", value: profile?.gender },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-base">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 break-words">
                      {item.value || <span className="text-slate-400 italic">Not provided</span>}
                    </p>
                  </div>
                </div>
              ))}

              {/* Address — full width */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 md:col-span-2">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-base">location_on</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">Address</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 break-words">
                    {profile?.address || <span className="text-slate-400 italic">Not provided</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700/30">
              <span className="material-symbols-outlined text-blue-500 text-lg mt-0.5">info</span>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                To update your PWD information, please contact your barangay PWD coordinator.
              </p>
            </div>
          </section>
        )}


        {/* Account Info */}
        {activeSection === "account" && (
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3 px-2 border-l-4 border-primary">
              <h3 className="text-slate-900 dark:text-slate-50 text-xl font-bold">Account Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                  <input type="text" value={accountForm.full_name} onChange={(e) => setAccountForm({ ...accountForm, full_name: e.target.value })}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Enter your full name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                  <input type="email" value={accountForm.email} onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                    placeholder="Enter your email" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleUpdateAccount} disabled={saving}
                className="flex items-center gap-2 px-8 h-12 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60">
                {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined">save</span>}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        )}

        {/* Change Password */}
        {activeSection === "password" && (
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3 px-2 border-l-4 border-amber-500">
              <h3 className="text-slate-900 dark:text-slate-50 text-xl font-bold">Change Password</h3>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5">info</span>
              <div className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
                <p className="font-bold">Password Requirements</p>
                <p>• At least 6 characters long</p>
                <p>• Use a mix of letters, numbers, and symbols</p>
              </div>
            </div>
            <div className="space-y-5">
              {[
                { key: "old", field: "oldPassword", label: "Current Password", icon: "lock", placeholder: "Enter current password" },
                { key: "new", field: "newPassword", label: "New Password", icon: "lock_open", placeholder: "Enter new password" },
                { key: "confirm", field: "confirmPassword", label: "Confirm New Password", icon: "lock_clock", placeholder: "Re-enter new password" },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{item.icon}</span>
                    <input type={showPw[item.key] ? "text" : "password"} value={pwForm[item.field]}
                      onChange={(e) => setPwForm({ ...pwForm, [item.field]: e.target.value })}
                      className="w-full h-12 pl-12 pr-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                      placeholder={item.placeholder} />
                    <button type="button" onClick={() => setShowPw((p) => ({ ...p, [item.key]: !p[item.key] }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      <span className="material-symbols-outlined">{showPw[item.key] ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                  {item.key === "confirm" && pwForm.confirmPassword && (
                    <p className={`text-xs font-semibold flex items-center gap-1 ${pwForm.newPassword === pwForm.confirmPassword ? "text-emerald-500" : "text-red-500"}`}>
                      <span className="material-symbols-outlined text-sm">{pwForm.newPassword === pwForm.confirmPassword ? "check_circle" : "cancel"}</span>
                      {pwForm.newPassword === pwForm.confirmPassword ? "Passwords match" : "Passwords don't match"}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleChangePassword} disabled={saving}
                className="flex items-center gap-2 px-8 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-60">
                {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined">lock_reset</span>}
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </section>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold text-white z-50 ${toastType === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-red-600"}`}>
          <span className="material-symbols-outlined text-lg">{toastType === "success" ? "check_circle" : "error"}</span>
          {toast}
        </div>
      )}
    </main>
  );
};

export default UserSettings;