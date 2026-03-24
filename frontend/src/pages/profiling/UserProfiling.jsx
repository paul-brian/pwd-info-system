import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";

const BASE_URL = API_URL;
const API = `${BASE_URL}/api`;

const getToken = () =>
  localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [health, setHealth] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assistance, setAssistance] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "personal", label: "Personal Information", icon: "person" },
    { id: "medical", label: "Medical & Health", icon: "favorite" },
    { id: "assistance", label: "Assistance History", icon: "volunteer_activism" },
    { id: "attendance", label: "Event Attendance", icon: "event_available" },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const headers = authHeader();
        const [profileRes, healthRes, attendanceRes, assistanceRes] = await Promise.all([
          axios.get(`${API}/pwd/me`, { headers }),
          axios.get(`${API}/health/me`, { headers }),
          axios.get(`${API}/attendance/me`, { headers }),
          axios.get(`${API}/distribution/me`, { headers }),
        ]);
        setProfile(profileRes.data);
        setHealth(healthRes.data);
        setAttendance(attendanceRes.data);
        setAssistance(assistanceRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const avatarUrl = profile?.image ? `${BASE_URL}/uploads/${profile.image}` : null;
  const initials = profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";

  const formatDateTime = (dt) =>
    dt ? new Date(dt).toLocaleString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

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
    <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">

          {/* ── Profile Header ── */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-6">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="relative">
                  <div className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 text-white text-2xl sm:text-3xl font-black">
                        {initials}
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 sm:w-5 h-4 sm:h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white truncate">{profile?.full_name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-x-3 gap-y-1 mt-1.5 sm:mt-2">
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs md:text-sm">badge</span>
                      <span className="truncate">PWD ID: {profile?.pwd_number}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] md:text-xs font-bold whitespace-nowrap ${
                        profile?.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {profile?.status?.charAt(0).toUpperCase() + profile?.status?.slice(1)}
                      </span>
                      {profile?.disability_type && (
                        <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] md:text-xs font-bold bg-primary/10 text-primary whitespace-nowrap">
                          {profile.disability_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-2 sm:px-4 md:px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-2.5 sm:px-3 md:px-5 border-b-2 text-[10px] sm:text-xs md:text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1 sm:gap-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-xs md:text-base">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-3 sm:p-4 md:p-6 lg:p-8">

              {/* ── Personal Info ── */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">

                  {/* Basic Details */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="material-symbols-outlined text-xs md:text-sm text-primary">person</span>
                      Basic Details
                    </h4>
                    {[
                      { label: "Full Name", value: profile?.full_name },
                      { label: "Date of Birth", value: formatDate(profile?.birth_date) },
                      { label: "Gender", value: profile?.gender },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[8px] sm:text-[9px] md:text-xs text-slate-400 mb-0.5 sm:mb-1 uppercase tracking-wider font-semibold">{item.label}</p>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{item.value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Contact & Location */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="material-symbols-outlined text-xs md:text-sm text-primary">contact_phone</span>
                      Contact & Location
                    </h4>
                    {[
                      { label: "Address", value: profile?.address },
                      { label: "Phone Number", value: profile?.contact_number },
                      { label: "Email Address", value: profile?.email },
                      { label: "Emergency Contact", value: profile?.emergency_contact },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[8px] sm:text-[9px] md:text-xs text-slate-400 mb-0.5 sm:mb-1 uppercase tracking-wider font-semibold">{item.label}</p>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white break-words">{item.value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Disability Details */}
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                      <span className="material-symbols-outlined text-xs md:text-sm text-primary">accessibility</span>
                      Disability Details
                    </h4>
                    {[
                      { label: "Type of Disability", value: profile?.disability_type },
                      { label: "Medical Condition", value: profile?.medical_condition },
                      { label: "PWD Number", value: profile?.pwd_number },
                      { label: "Registered", value: formatDate(profile?.created_at) },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-[8px] sm:text-[9px] md:text-xs text-slate-400 mb-0.5 sm:mb-1 uppercase tracking-wider font-semibold">{item.label}</p>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{item.value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Medical & Health ── */}
              {activeTab === "medical" && (
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Health Records</h4>
                  {health.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 text-slate-400">
                      <span className="material-symbols-outlined text-4xl sm:text-5xl mb-3 block">favorite_border</span>
                      <p className="font-medium text-xs sm:text-sm">No health records found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left">
                        <thead className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                            {["Date", "BP", "HR", "Temp", "Weight", "Blood Sugar", "Status", "Remarks"].map((h) => (
                              <th key={h} className="py-2.5 sm:py-3 px-2 sm:px-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-[9px] sm:text-xs md:text-sm divide-y divide-slate-50 dark:divide-slate-800">
                          {health.map((record) => (
                            <tr key={record.health_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(record.recorded_at)}</td>
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3 font-medium text-slate-900 dark:text-white">{record.blood_pressure || "—"}</td>
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-slate-600 dark:text-slate-400">{record.heart_rate ? `${record.heart_rate}` : "—"}</td>
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-slate-600 dark:text-slate-400">{record.temperature || "—"}</td>
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-slate-600 dark:text-slate-400">{record.weight || "—"}</td>
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-slate-600 dark:text-slate-400">{record.blood_sugar || "—"}</td>
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3">
                                <span className="text-[8px] sm:text-[9px] md:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-lg bg-primary/10 text-primary whitespace-nowrap">{record.health_status}</span>
                              </td>
                              <td className="py-2.5 sm:py-3 px-2 sm:px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate hidden md:table-cell">{record.remarks || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Assistance History ── */}
              {activeTab === "assistance" && (
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Assistance History</h4>
                  {assistance.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 text-slate-400">
                      <span className="material-symbols-outlined text-4xl sm:text-5xl mb-3 block">volunteer_activism</span>
                      <p className="font-medium text-xs sm:text-sm">No assistance records found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left">
                        <thead className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                          <tr>
                            {["Date", "Item", "Category", "Qty", "Remarks"].map((h) => (
                              <th key={h} className="py-2.5 sm:py-3 px-2 sm:px-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                          {assistance.map((item) => (
                            <tr key={item.assistance_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(item.release_date)}</td>
                              <td className="py-4 px-3 font-medium text-slate-900 dark:text-white">{item.item_name}</td>
                              <td className="py-4 px-3">
                                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{item.category}</span>
                              </td>
                              <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{item.quantity}</td>
                              <td className="py-4 px-3 text-slate-500 dark:text-slate-400">{item.remarks || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── Event Attendance ── */}
              {activeTab === "attendance" && (
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-6">Event Attendance</h4>
                  {attendance.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <span className="material-symbols-outlined text-5xl mb-3 block">event_busy</span>
                      <p className="font-medium">No attendance records found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                          <tr>
                            {["Event", "Date", "Location", "Check-in Time", "Status"].map((h) => (
                              <th key={h} className="pb-3 px-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                          {attendance.map((record) => (
                            <tr key={record.attendance_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 px-3 font-medium text-slate-900 dark:text-white">{record.event_name}</td>
                              <td className="py-4 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(record.event_date)}</td>
                              <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{record.location || "—"}</td>
                              <td className="py-4 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDateTime(record.check_in_time)}</td>
                              <td className="py-4 px-3">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                  record.status === "present"
                                    ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                    : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                }`}>
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;