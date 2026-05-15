import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import DataTable  from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import { SectionLoader } from "../../components/ui/Loading";

const BASE_URL = API_URL;
const API = `${BASE_URL}/api`;

const getToken   = () => localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : "—";
const formatDateTime = (dt) =>
  dt ? new Date(dt).toLocaleString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

const UserProfile = () => {
  const [activeTab, setActiveTab]   = useState("personal");
  const [profile, setProfile]       = useState(null);
  const [health, setHealth]         = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assistance, setAssistance] = useState([]);
  const [loading, setLoading]       = useState(true);

  // Pagination
  const [healthPage, setHealthPage]         = useState(1);
  const [assistancePage, setAssistancePage] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const itemsPerPage = 6;

  const tabs = [
    { id: "personal",   label: "Personal Information", icon: "person" },
    { id: "medical",    label: "Medical & Health",     icon: "favorite" },
    { id: "assistance", label: "Assistance History",   icon: "volunteer_activism" },
    { id: "attendance", label: "Event Attendance",     icon: "event_available" },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const headers = authHeader();
        const [profileRes, healthRes, attendanceRes, assistanceRes] = await Promise.all([
          axios.get(`${API}/pwd/me`,          { headers }),
          axios.get(`${API}/health/me`,       { headers }),
          axios.get(`${API}/attendance/me`,   { headers }),
          axios.get(`${API}/distribution/me`, { headers }),
        ]);
        setProfile(profileRes.data);
        setHealth(healthRes.data);
        setAttendance(attendanceRes.data);
        setAssistance(assistanceRes.data);
      } catch (err) { console.error("Fetch error:", err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const avatarUrl = profile?.image ? `${BASE_URL}/uploads/${profile.image}` : null;
  const initials  = profile?.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  // ── Health pagination ──
  const totalHealthPages  = Math.max(1, Math.ceil(health.length / itemsPerPage));
  const paginatedHealth   = health.slice((healthPage - 1) * itemsPerPage, healthPage * itemsPerPage);

  // ── Assistance pagination ──
  const totalAssistPages  = Math.max(1, Math.ceil(assistance.length / itemsPerPage));
  const paginatedAssist   = assistance.slice((assistancePage - 1) * itemsPerPage, assistancePage * itemsPerPage);

  // ── Attendance pagination ──
  const totalAttendPages  = Math.max(1, Math.ceil(attendance.length / itemsPerPage));
  const paginatedAttend   = attendance.slice((attendancePage - 1) * itemsPerPage, attendancePage * itemsPerPage);

  // ── Health renderRow ──
  const renderHealthRow = (record) => (
    <tr key={record.health_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-2.5 px-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(record.recorded_at)}</td>
      <td className="py-2.5 px-3 text-xs font-medium text-slate-900 dark:text-white">{record.blood_pressure || "—"}</td>
      <td className="py-2.5 px-6 text-xs text-slate-600 dark:text-slate-400">{record.heart_rate ? `${record.heart_rate}` : "—"}</td>
      <td className="py-2.5 px-6 text-xs text-slate-600 dark:text-slate-400">{record.temperature || "—"}</td>
      <td className="py-2.5 px-7 text-xs text-slate-600 dark:text-slate-400">{record.weight || "—"}</td>
      <td className="py-2.5 px-6 text-xs text-slate-600 dark:text-slate-400">{record.blood_sugar || "—"}</td>
      <td className="py-2.5 px-3">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary whitespace-nowrap">{record.health_status}</span>
      </td>
      <td className="py-2.5 px-6 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate hidden md:table-cell">{record.remarks || "—"}</td>
    </tr>
  );

  const renderHealthCard = (record) => (
    <div key={record.health_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-bold text-slate-900 dark:text-white">{formatDate(record.recorded_at)}</p>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary whitespace-nowrap">{record.health_status}</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        {[
          { label: "BP",          value: record.blood_pressure },
          { label: "Heart Rate",  value: record.heart_rate },
          { label: "Temperature", value: record.temperature },
          { label: "Weight",      value: record.weight },
          { label: "Blood Sugar", value: record.blood_sugar },
        ].map((v) => (
          <div key={v.label}>
            <p className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">{v.label}</p>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v.value || "—"}</p>
          </div>
        ))}
      </div>
      {record.remarks && (
        <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="font-medium">Remarks:</span> {record.remarks}
        </p>
      )}
    </div>
  );

  // ── Assistance renderRow ──
  const renderAssistRow = (item) => (
    <tr key={item.assistance_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-3 px-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(item.release_date)}</td>
      <td className="py-3 px-3 text-sm font-medium text-slate-900 dark:text-white">{item.item_name}</td>
      <td className="py-3 px-3">
        <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">{item.category}</span>
      </td>
      <td className="py-3 px-8 text-sm text-slate-600 dark:text-slate-400">{item.quantity}</td>
      <td className="py-3 px-8 text-sm text-slate-500 dark:text-slate-400">{item.remarks || "—"}</td>
    </tr>
  );

  const renderAssistCard = (item) => (
    <div key={item.assistance_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
      <div className="flex justify-between items-start gap-2 mb-2">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.item_name}</p>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex-shrink-0">
          {item.category}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-semibold">Date</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(item.release_date)}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-semibold">Quantity</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.quantity}</p>
        </div>
      </div>
      {item.remarks && <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">{item.remarks}</p>}
    </div>
  );

  // ── Attendance renderRow ──
  const renderAttendRow = (record) => (
    <tr key={record.attendance_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-3 px-3 text-sm font-medium text-slate-900 dark:text-white">{record.event_name}</td>
      <td className="py-3 px-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(record.event_date)}</td>
      <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(record.start_time)}</td>
      <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(record.end_time)}</td>
      <td className="py-3 px-3 text-sm text-slate-600 dark:text-slate-400">{record.location || "—"}</td>
      <td className="py-3 px-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDateTime(record.check_in_time)}</td>
      <td className="py-3 px-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg
          ${record.status === "present"
            ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
            : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </span>
      </td>
    </tr>
  );

  const renderAttendCard = (record) => (
    <div key={record.attendance_id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
      <div className="flex justify-between items-start gap-2 mb-2">
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{record.event_name}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0
          ${record.status === "present"
            ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
            : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-semibold">Date</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDate(record.event_date)}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-semibold">Start</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400">{formatDate(record.start_time)}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-semibold">End</p>
          <p className="text-[10px] text-slate-600 dark:text-slate-400">{formatDate(record.end_time)}</p
        ></div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-semibold">Location</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{record.location || "—"}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-400 uppercase font-semibold">Check-in</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatDateTime(record.check_in_time)}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
          bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-lg">person</span>
              <span className="text-xs font-semibold uppercase tracking-widest">
                PWD Information
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              User Profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              View and manage your personal information, registration details, and account records.
            </p>
          </div>
        </div>


        {/* ── Profile Header ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-md overflow-hidden bg-slate-200 dark:bg-slate-700">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 text-white text-3xl sm:text-4xl font-black">
                    {initials}
                  </div>
                )}
              </div>

              {/* Account Status Indicator */}
              <span className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 space-y-2">

              {/* Name */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white truncate">
                {profile?.full_name || "—"}
              </h3>

              {/* Meta Information */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">

                {/* PWD ID */}
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  PWD ID Number: {profile?.pwd_number || "—"}
                </p>

                {/* Account Status */}
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${profile?.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                >
                  {profile?.status
                    ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1)
                    : "Unknown"}
                </span>

                {/* Disability Type */}
                {profile?.disability_type && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {profile.disability_type}
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>

          {/* ── Tabs ── */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex justify-between sm:justify-start lg:justify-between border-b border-slate-200 dark:border-slate-800 px-2 sm:px-4 overflow-x-auto lg:overflow-visible gap-1 sm:gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 lg:flex-1 py-3 sm:py-4 px-3 sm:px-4 border-b-2 text-[10px] sm:text-xs md:text-sm font-semibold whitespace-nowrap transition-colors flex items-center justify-center gap-1 sm:gap-2
                     ${activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                >
                  <span className="material-symbols-outlined text-xs md:text-base">
                    {tab.icon}
                  </span>

                  <span className="hidden sm:inline">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              {/* ── Personal Info ── */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  {[
                    { title: "Basic Details", icon: "person", fields: [
                      { label: "Full Name",    value: profile?.full_name },
                      { label: "Date of Birth", value: formatDate(profile?.birth_date) },
                      { label: "Gender",       value: profile?.gender },
                    ]},
                    { title: "Contact & Location", icon: "contact_phone", fields: [
                      { label: "Address",           value: profile?.address },
                      { label: "Phone Number",      value: profile?.contact_number },
                      { label: "Email Address",     value: profile?.email },
                      { label: "Emergency Contact", value: profile?.emergency_contact },
                    ]},
                    { title: "Disability Details", icon: "accessibility", fields: [
                      { label: "Type of Disability", value: profile?.disability_type },
                      { label: "Medical Condition",  value: profile?.medical_condition },
                      { label: "PWD Number",         value: profile?.pwd_number },
                      { label: "Registered",         value: formatDate(profile?.created_at) },
                    ]},
                  ].map((section) => (
                    <div key={section.title} className="space-y-3 sm:space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-primary">{section.icon}</span>
                        {section.title}
                      </h4>
                      {section.fields.map((item) => (
                        <div key={item.label}>
                          <p className="text-[9px] sm:text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-semibold">{item.label}</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white break-words">{item.value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Medical & Health ── */}
              {activeTab === "medical" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Health Records</h4>
                  {loading ? <SectionLoader message="Loading health records..." /> : (
                    <DataTable
                      columns={["Date", "BP", "HR", "Temp", "Weight", "Blood Sugar", "Status", "Remarks"]}
                      data={paginatedHealth}
                      renderRow={renderHealthRow}
                      renderCard={renderHealthCard}
                      empty="No health records found."
                      pagination={
                        <Pagination
                          currentPage={healthPage}
                          totalPages={totalHealthPages}
                          totalItems={health.length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={(p) => setHealthPage(p)}
                        />
                      }
                    />
                  )}
                </div>
              )}

              {/* ── Assistance History ── */}
              {activeTab === "assistance" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Assistance History</h4>
                  {loading ? <SectionLoader message="Loading assistance records..." /> : (
                    <DataTable
                      columns={["Date", "Item", "Category", "Qty", "Remarks"]}
                      data={paginatedAssist}
                      renderRow={renderAssistRow}
                      renderCard={renderAssistCard}
                      empty="No assistance records found."
                      pagination={
                        <Pagination
                          currentPage={assistancePage}
                          totalPages={totalAssistPages}
                          totalItems={assistance.length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={(p) => setAssistancePage(p)}
                        />
                      }
                    />
                  )}
                </div>
              )}

              {/* ── Event Attendance ── */}
              {activeTab === "attendance" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Event Attendance</h4>
                  {loading ? <SectionLoader message="Loading attendance records..." /> : (
                    <DataTable
                      columns={["Event", "Date", "Start Time", "End Time", "Location", "Check-in Time", "Status"]}
                      data={paginatedAttend}
                      renderRow={renderAttendRow}
                      renderCard={renderAttendCard}
                      empty="No attendance records found."
                      pagination={
                        <Pagination
                          currentPage={attendancePage}
                          totalPages={totalAttendPages}
                          totalItems={attendance.length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={(p) => setAttendancePage(p)}
                        />
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
    </main>
  );
};

export default UserProfile;