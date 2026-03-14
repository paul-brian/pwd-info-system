import React, { useState, useEffect, useRef } from "react";
import API_URL from "../api/api";
import axios from "axios";

const BASE_URL = API_URL;
const API = `${BASE_URL}/api`;

// ✅ FIX: "userToken" — same key na ginagamit sa login
const getToken = () =>
  localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const ProfileSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  const [editForm, setEditForm] = useState({ full_name: "", email: "" });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });

  const showToast = (msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/profile`, {
        headers: authHeader(),
      });
      setProfile(data);
      setEditForm({ full_name: data.full_name, email: data.email });
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdateProfile = async () => {
    if (!editForm.full_name || !editForm.email)
      return showToast("All fields required", "error");
    try {
      setSaving(true);
      await axios.put(`${API}/profile`, editForm, { headers: authHeader() });
      await fetchProfile();
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to update profile", "error");
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

  const getRoleBadge = (role) => {
    const map = {
      Admin: { color: "from-violet-500 to-purple-600", icon: "shield_person" },
      Staff: { color: "from-blue-500 to-cyan-600", icon: "badge" },
      User: { color: "from-slate-500 to-slate-600", icon: "person" },
    };
    return map[role] || map["User"];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(profile?.role);
  const avatarUrl = profile?.image ? `${BASE_URL}/uploads/${profile.image}` : null;
  const initials = profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Profile Card */}
        <div className="lg:col-span-1 flex flex-col gap-4">

          {/* Avatar Card */}
          <div className="relative bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
            <div className={`h-20 w-full bg-gradient-to-r ${roleBadge.color} opacity-90`} />
            <div className="px-6 pb-6 -mt-10 flex flex-col items-center text-center">
              <div className="relative group mb-3">
                <div className="w-20 h-20 rounded-2xl ring-4 ring-white dark:ring-slate-800 overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-xl">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${roleBadge.color} text-white text-2xl font-black`}>
                      {initials}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{profile?.full_name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-all">{profile?.email}</p>

              <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${roleBadge.color} text-white text-xs font-bold shadow-md`}>
                <span className="material-symbols-outlined text-sm">{roleBadge.icon}</span>
                {profile?.role}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm font-semibold hover:border-primary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-base">upload</span>
                Change Photo
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-5 shadow-sm space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Account Info</p>
            {[
              { icon: "person_outline", label: "Full Name", value: profile?.full_name },
              { icon: "mail", label: "Email", value: profile?.email },
              { icon: "manage_accounts", label: "Role", value: profile?.role },
              { icon: "verified_user", label: "Status", value: "Active" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-base">{item.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Nav */}
          <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-2 shadow-sm">
            {[
              { key: "profile", icon: "person_edit", label: "Edit Profile" },
              { key: "password", icon: "lock_reset", label: "Change Password" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeSection === item.key
                    ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/40"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Forms */}
        <div className="lg:col-span-2">

          {/* Edit Profile */}
          {activeSection === "profile" && (
            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-700/20 dark:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">person_edit</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Profile</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Update your display name and email address.</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Role</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">manage_accounts</span>
                    <input
                      type="text"
                      value={profile?.role || ""}
                      disabled
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500 font-semibold">Read-only</span>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/80 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">save</span>}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          {activeSection === "password" && (
            <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-700/20 dark:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-amber-500 text-xl">lock_reset</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Change Password</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Keep your account secure with a strong password.</p>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5">info</span>
                    <div className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                      <p className="font-bold">Password Requirements</p>
                      <p>• At least 6 characters long</p>
                      <p>• Use a mix of letters, numbers, and symbols for better security</p>
                    </div>
                  </div>
                </div>
                {[
                  { key: "old", field: "oldPassword", label: "Current Password", icon: "lock", placeholder: "Enter current password" },
                  { key: "new", field: "newPassword", label: "New Password", icon: "lock_open", placeholder: "Enter new password" },
                  { key: "confirm", field: "confirmPassword", label: "Confirm New Password", icon: "lock_clock", placeholder: "Re-enter new password" },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">{item.label}</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">{item.icon}</span>
                      <input
                        type={showPw[item.key] ? "text" : "password"}
                        value={pwForm[item.field]}
                        onChange={(e) => setPwForm({ ...pwForm, [item.field]: e.target.value })}
                        className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-slate-400"
                        placeholder={item.placeholder}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((p) => ({ ...p, [item.key]: !p[item.key] }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">{showPw[item.key] ? "visibility_off" : "visibility"}</span>
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
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">lock_reset</span>}
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-bold text-white border z-50 ${
          toastType === "success"
            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400/30 shadow-emerald-500/20"
            : "bg-gradient-to-r from-red-500 to-red-600 border-red-400/30 shadow-red-500/20"
        }`}>
          <span className="material-symbols-outlined text-lg">{toastType === "success" ? "check_circle" : "error"}</span>
          {toast}
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;