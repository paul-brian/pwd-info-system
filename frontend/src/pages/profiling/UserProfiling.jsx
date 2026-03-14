// import { useState } from "react";

// const dummyAssistance = [
//   { date: "Oct 12, 2023", type: "Financial Aid", provider: "DSWD Central", status: "Received", statusColor: "green" },
//   { date: "Aug 05, 2023", type: "Wheelchair Repair", provider: "Barangay Health", status: "Received", statusColor: "green" },
// ];

// const medicalSummary = [
//   { title: "Blood Type", value: "O+" },
//   { title: "Allergies", value: "Penicillin" },
//   { title: "Maintenance Meds", value: "Losartan 50mg (Daily)" },
//   { title: "Assistive Device", value: "Manual Wheelchair" },
// ];

// const UserProfile = () => {
//   const [activeTab, setActiveTab] = useState("personal");

//   const tabs = [
//     { id: "personal", label: "Personal Information" },
//     { id: "medical", label: "Medical & Health" },
//     { id: "assistance", label: "Assistance History" },
//     { id: "attendance", label: "Event Attendance" },
//   ];

//   return (
//     <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
//         <div className="max-w-6xl mx-auto space-y-6">

//           {/* Profile Header */}
//           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//               <div className="flex items-center gap-6">
//                 <div className="relative">
//                   <div
//                     className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-sm bg-center bg-cover"
//                     style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwF1rzmmFEmWhs7EJP20SvRA9DHVFM-uwFicHiabdphSS5R20EgqRt30JpFn4Vfr4ChxifLKnJ17dPzk5yEj0fd9oXZAFkkK9bN9Ls7u8Yzk30Ufm2yfNrqNLcfO02drmGQ3UJSwX32LcnPst41ydCpZJ5ycbsgqpJFrAXxYILhOPI_o_kBxrcOfuX-w8WkVejedSpZvn7LcMn7vITvRVFSaVbho0amw_2HJGO1taSnioXGZ53UYJ6RxWYELwsf2xN92NjOcUKvb8")' }}
//                   ></div>
//                   <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Juan Dela Cruz</h3>
//                   <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
//                     <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
//                       <span className="material-symbols-outlined text-[16px]">badge</span> PWD ID: 04-1234-567
//                     </p>
//                     <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>
//                     <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">Orthopedic Disability</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
//             <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 overflow-x-auto no-scrollbar">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`py-4 px-4 sm:px-6 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${
//                     activeTab === tab.id
//                       ? "border-primary text-primary"
//                       : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Tab Content */}
//             <div className="p-6 sm:p-8">
              
//               {/* Personal Info Tab */}
//               {activeTab === "personal" && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                   {/* Basic Details */}
//                   <div className="space-y-6">
//                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Details</h4>
//                     <div className="space-y-4">
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Full Name</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Juan Miguel Garcia Dela Cruz</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Date of Birth</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">May 15, 1988 (36 years old)</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Gender</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Male</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Civil Status</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Married</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Contact & Location */}
//                   <div className="space-y-6">
//                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact & Location</h4>
//                     <div className="space-y-4">
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Address</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Blk 12 Lot 5, Sampaguita St., Barangay Trapiche</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Phone Number</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">+63 917 123 4567</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Email Address</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">juan.delacruz@email.com</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Educational Attainment</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">College Graduate</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Disability Details */}
//                   <div className="space-y-6">
//                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disability Details</h4>
//                     <div className="space-y-4">
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Type of Disability</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Orthopedic (Lower Limb Mobility)</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Inborn/Acquired</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Acquired (Accident, 2015)</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">PhilHealth Number</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">19-023456789-1</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 mb-1">Occupation</p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">Home-based Virtual Assistant</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Assistance Tab */}
//               {activeTab === "assistance" && (
//                 <div>
//                   <h4 className="text-base font-bold text-slate-900 dark:text-white mb-6">Recent Assistance</h4>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                       <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
//                         <tr>
//                           {["Date","Type","Provider","Status"].map(h => (
//                             <th key={h} className="pb-3 px-2">{h}</th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
//                         {dummyAssistance.map((item, i)=>(
//                           <tr key={i}>
//                             <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{item.date}</td>
//                             <td className="py-4 px-2 font-medium text-slate-900 dark:text-white">{item.type}</td>
//                             <td className="py-4 px-2 text-slate-600 dark:text-slate-400">{item.provider}</td>
//                             <td className="py-4 px-2 text-right">
//                               <span className={`text-xs font-bold ${item.statusColor === "green" ? "text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded" : ""}`}>{item.status}</span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               {/* You can add medical & attendance tabs similarly */}
//             </div>
//           </div>

//         </div>
//       </div>
//     </main>
//   );
// };

// export default UserProfile;

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
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ── Profile Header ── */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden bg-slate-200 dark:bg-slate-700">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 text-white text-3xl font-black">
                        {initials}
                      </div>
                    )}
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{profile?.full_name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      PWD ID: {profile?.pwd_number}
                    </p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      profile?.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {profile?.status?.charAt(0).toUpperCase() + profile?.status?.slice(1)}
                    </span>
                    {profile?.disability_type && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {profile.disability_type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 sm:px-5 border-b-2 text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">

              {/* ── Personal Info ── */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                  {/* Basic Details */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">person</span>
                      Basic Details
                    </h4>
                    {[
                      { label: "Full Name", value: profile?.full_name },
                      { label: "Date of Birth", value: formatDate(profile?.birth_date) },
                      { label: "Gender", value: profile?.gender },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Contact & Location */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">contact_phone</span>
                      Contact & Location
                    </h4>
                    {[
                      { label: "Address", value: profile?.address },
                      { label: "Phone Number", value: profile?.contact_number },
                      { label: "Email Address", value: profile?.email },
                      { label: "Emergency Contact", value: profile?.emergency_contact },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white break-words">{item.value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {/* Disability Details */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary">accessibility</span>
                      Disability Details
                    </h4>
                    {[
                      { label: "Type of Disability", value: profile?.disability_type },
                      { label: "Medical Condition", value: profile?.medical_condition },
                      { label: "PWD Number", value: profile?.pwd_number },
                      { label: "Registered", value: formatDate(profile?.created_at) },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Medical & Health ── */}
              {activeTab === "medical" && (
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-6">Health Records</h4>
                  {health.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <span className="material-symbols-outlined text-5xl mb-3 block">favorite_border</span>
                      <p className="font-medium">No health records found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                          <tr>
                            {["Date", "Blood Pressure", "Heart Rate", "Temp (°C)", "Weight (kg)", "Blood Sugar", "Status", "Remarks"].map((h) => (
                              <th key={h} className="pb-3 px-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                          {health.map((record) => (
                            <tr key={record.health_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(record.recorded_at)}</td>
                              <td className="py-4 px-3 font-medium text-slate-900 dark:text-white">{record.blood_pressure || "—"}</td>
                              <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{record.heart_rate ? `${record.heart_rate} bpm` : "—"}</td>
                              <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{record.temperature}</td>
                              <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{record.weight}</td>
                              <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{record.blood_sugar || "—"}</td>
                              <td className="py-4 px-3">
                                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-primary/10 text-primary">{record.health_status}</span>
                              </td>
                              <td className="py-4 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">{record.remarks || "—"}</td>
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
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-6">Assistance History</h4>
                  {assistance.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <span className="material-symbols-outlined text-5xl mb-3 block">volunteer_activism</span>
                      <p className="font-medium">No assistance records found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                          <tr>
                            {["Date", "Item", "Category", "Quantity", "Remarks"].map((h) => (
                              <th key={h} className="pb-3 px-3">{h}</th>
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