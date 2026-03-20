import React, { useState, useEffect } from "react";
import ProfileSettings from "./profileSettings";
import API_URL from "../../api/api";

const AdminSettings = () => {

  const [activeTab, setActiveTab] = useState("User List");

  const [toast, setToast] = useState(null);

  // User List
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "User List") fetchUsers();
  }, [activeTab]);

  const filteredUsers = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleEdit = async () => {
    try {
      await fetch(`${API_URL}/api/users/edit/${editUser.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: editUser.full_name,
          role: editUser.role,
          status: editUser.status,
        }),
      });
      setEditUser(null);
      fetchUsers();
      setToast("User updated successfully");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (user) => {
    const updatedStatus = user.status === "active" ? "inactive" : "active";
    try {
      await fetch(`${API_URL}/api/users/status/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });
      fetchUsers();
      setToast(`User ${updatedStatus}`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Access Requests
  const [accessRequests, setAccessRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchRequest, setSearchRequest] = useState("");

  const fetchAccessRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await fetch(`${API_URL}/api/access/requests`);
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : data.data || []).map((r) => ({
        id: r.request_id,
        full_name: r.full_name,
        email: r.email,
        role: r.role,
        created_at: r.created_at,
        status: r.status,
      }));
      setAccessRequests(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Access Requests") fetchAccessRequests();
  }, [activeTab]);

  const updateRequestStatus = async (status) => {
    if (!selectedRequest) return;
    try {
      const endpoint =
        status === "approved"
          ? `${API_URL}/api/access/approve/${selectedRequest.id}`
          : `${API_URL}/api/access/reject/${selectedRequest.id}`;
      const res = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error("Failed to update status");
      setAccessRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? { ...r, status } : r))
      );
      setActiveModal(null);
      setSelectedRequest(null);
      setToast(`Request ${status} successfully`);
      setTimeout(() => setToast(null), 3000);
      fetchAccessRequests();
    } catch (err) {
      console.error(err);
      setToast(err.message);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredRequests = accessRequests.filter(
    (r) =>
      (filterStatus === "all" || r.status === filterStatus) &&
      (r.full_name.toLowerCase().includes(searchRequest.toLowerCase()) ||
        r.email.toLowerCase().includes(searchRequest.toLowerCase()))
  );

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 md:gap-6 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800/50 mb-6 sm:mb-8">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              User Management
            </p>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Manage system users, define access roles, and monitor account statuses.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button className="flex items-center justify-center rounded-lg sm:rounded-xl h-9 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200">
              <span className="material-symbols-outlined mr-1.5 sm:mr-2 text-base sm:text-lg">download</span>
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
            <button className="flex items-center justify-center rounded-lg sm:rounded-xl h-9 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-white text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl">
              <span className="material-symbols-outlined mr-1.5 sm:mr-2 text-base sm:text-lg">person_add</span>
              <span className="hidden sm:inline">Invite New User</span>
              <span className="sm:hidden">Invite</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 sm:gap-6 border-b border-slate-200 dark:border-slate-700/50 mb-6 sm:mb-8 px-1 sm:px-2 overflow-x-auto">
          {["User List", "Roles & Permissions", "Pending Invitations", "Access Requests", "Account Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 sm:pb-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab}
              {tab === "Access Requests" && filteredRequests.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-1.5 sm:ml-2 px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-[9px] sm:text-[10px] font-bold uppercase">
                  {filteredRequests.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User List Tab */}
        {activeTab === "User List" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            {/* Search */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 flex flex-col gap-3 sm:gap-4">
              <label className="flex flex-col flex-1 w-full">
                <div className="flex w-full items-center rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary bg-white dark:bg-slate-800 transition-all">
                  <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-3 sm:pl-4">
                    <span className="material-symbols-outlined text-base sm:text-lg">search</span>
                  </div>
                  <input
                    className="flex-1 border-none bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                    placeholder="Search users by name, email or role..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                </div>
              </label>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border-b border-slate-200 dark:border-slate-700/50">
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">User Profile</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Role</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Created Date</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 border border-slate-300 dark:border-slate-600 overflow-hidden">
                            {user.image ? (
                              <img
                                src={`${API_URL}/uploads/${user.image}`}
                                alt={user.full_name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[9px] sm:text-xs font-black">
                                {user.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</span>
                            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 uppercase border border-blue-200 dark:border-blue-700/30">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <span className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold ${user.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                          <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[10px] sm:text-sm text-slate-600 dark:text-slate-400">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleString("en-PH", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "-"}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => setEditUser(user)}
                            className="p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-150" title="Edit"
                          >
                            <span className="material-symbols-outlined text-base sm:text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-150 ${
                              user.status === "active"
                                ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            }`}
                            title={user.status === "active" ? "Deactivate" : "Activate"}
                          >
                            <span className="material-symbols-outlined text-base sm:text-lg">{user.status === "active" ? "check_circle" : "block"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Access Requests Tab */}
        {activeTab === "Access Requests" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-3 sm:p-4 md:p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-200 dark:border-slate-700/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="flex w-full items-center rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary bg-white dark:bg-slate-800 transition-all">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-3 sm:pl-4">
                  <span className="material-symbols-outlined text-base sm:text-lg">search</span>
                </div>
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchRequest}
                  onChange={(e) => setSearchRequest(e.target.value)}
                  className="flex-1 border-none bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Loading / Empty state */}
            {loadingRequests && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Loading requests...</p>}
            {!loadingRequests && filteredRequests.length === 0 && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No matching requests found.</p>
            )}

            {/* Requests List */}
            <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-50 dark:bg-slate-900">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border-b border-slate-200 dark:border-slate-700/50">
                    <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">User</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Email</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Role</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-left text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Created Date</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-right text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                      >
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {req.full_name}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          {req.email}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {req.role}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span
                            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-white text-[10px] sm:text-xs font-bold uppercase border ${req.status === "approved"
                                ? "bg-emerald-600/90 dark:bg-emerald-600/70 border-emerald-500/30"
                                : req.status === "rejected"
                                  ? "bg-red-600/90 dark:bg-red-600/70 border-red-500/30"
                                  : "bg-yellow-500/90 dark:bg-yellow-600/70 border-yellow-400/30"
                              }`}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[10px] sm:text-sm text-slate-600 dark:text-slate-400">
                        {req.created_at
                          ? new Date(req.created_at).toLocaleString("en-PH", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "-"}
                      </td>

                        <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                          {req.status === "pending" && (
                            <div className="flex justify-end gap-1 sm:gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setActiveModal("approve");
                                }}
                                className="px-2 sm:px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] sm:text-sm font-bold transition-all duration-200 shadow-sm flex items-center gap-0.5 sm:gap-1 whitespace-nowrap"
                              >
                                <span className="material-symbols-outlined text-xs sm:text-sm">check_circle</span>
                                <span className="hidden sm:inline">Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setActiveModal("reject");
                                }}
                                className="px-2 sm:px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] sm:text-sm font-bold transition-all duration-200 shadow-sm flex items-center gap-0.5 sm:gap-1 whitespace-nowrap"
                              >
                                <span className="material-symbols-outlined text-xs sm:text-sm">close</span>
                                <span className="hidden sm:inline">Reject</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 sm:px-4 md:px-6 py-4 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        No requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === "Account Settings" && <ProfileSettings />}

      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-7 border border-slate-200 dark:border-slate-700/50 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">person_edit</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Edit User</h2>
            </div>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={editUser.full_name}
                  onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Role</label>
                <select 
                  name="role" 
                  value={editUser.role} 
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} 
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setEditUser(null)} 
                className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleEdit} 
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {activeModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-7 border border-slate-200 dark:border-slate-700/50 shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                activeModal === "approve" 
                  ? "bg-emerald-100 dark:bg-emerald-900/20" 
                  : "bg-red-100 dark:bg-red-900/20"
              }`}>
                <span className={`material-symbols-outlined text-lg sm:text-2xl ${
                  activeModal === "approve" 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {activeModal === "approve" ? "check_circle" : "warning"}
                </span>
              </div>
              <h2 className={`text-lg sm:text-2xl font-bold ${
                activeModal === "approve" 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {activeModal === "approve" ? "Approve Request" : "Reject Request"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">
              Confirm this action for <strong className="text-slate-900 dark:text-white">{selectedRequest.full_name}</strong>?
            </p>
            <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl ${
              activeModal === "approve" 
                ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700/30" 
                : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700/30"
            }`}>
              <p className={`text-xs sm:text-sm ${
                activeModal === "approve" 
                  ? "text-emerald-900 dark:text-emerald-200" 
                  : "text-red-900 dark:text-red-200"
              }`}>
                {activeModal === "approve" 
                  ? "This will grant access to the system for the requested user." 
                  : "This will deny access and notify the user."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateRequestStatus(activeModal === "approve" ? "approved" : "rejected")
                }
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-lg ${
                  activeModal === "approve" 
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30" 
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg hover:shadow-red-500/30"
                }`}
              >
                {activeModal === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl shadow-2xl shadow-emerald-500/20 text-xs sm:text-sm flex items-center gap-2 sm:gap-3 animate-in fade-in slide-in-from-bottom-2 transition-all border border-emerald-400/30 max-w-sm sm:max-w-none">
          <span className="material-symbols-outlined text-base sm:text-lg flex-shrink-0">check_circle</span>
          <span className="truncate">{toast}</span>
        </div>
      )}
    </main>
  );
};

export default AdminSettings;