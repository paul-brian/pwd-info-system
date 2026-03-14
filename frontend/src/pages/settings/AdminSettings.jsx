// import React, { useState, useEffect } from "react";

// const AdminSettings = () => {

//   const [activeTab, setActiveTab] = useState("User List");

//   const [toast, setToast] = useState(null);

//   // User List
//   const [users, setUsers] = useState([]);
//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [searchUser, setSearchUser] = useState("");
//   const [editUser, setEditUser] = useState(null);

//   const fetchUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       const res = await fetch("http://localhost:5000/api/users");
//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "User List") fetchUsers();
//   }, [activeTab]);

//   const filteredUsers = users.filter(
//     (u) =>
//       u.full_name.toLowerCase().includes(searchUser.toLowerCase()) ||
//       u.email.toLowerCase().includes(searchUser.toLowerCase())
//   );

//   const handleEdit = async () => {
//     try {
//       await fetch(`http://localhost:5000/api/users/edit/${editUser.user_id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           full_name: editUser.full_name,
//           role: editUser.role,
//           status: editUser.status,
//         }),
//       });
//       setEditUser(null);
//       fetchUsers();
//       setToast("User updated successfully");
//       setTimeout(() => setToast(null), 3000);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleToggleStatus = async (user) => {
//     const updatedStatus = user.status === "active" ? "inactive" : "active";
//     try {
//       await fetch(`http://localhost:5000/api/users/status/${user.user_id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: updatedStatus }),
//       });
//       fetchUsers();
//       setToast(`User ${updatedStatus}`);
//       setTimeout(() => setToast(null), 3000);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Access Requests
//   const [accessRequests, setAccessRequests] = useState([]);
//   const [loadingRequests, setLoadingRequests] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [activeModal, setActiveModal] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [searchRequest, setSearchRequest] = useState("");

//   const fetchAccessRequests = async () => {
//     try {
//       setLoadingRequests(true);
//       const res = await fetch("http://localhost:5000/api/access/requests");
//       const data = await res.json();
//       const mapped = (Array.isArray(data) ? data : data.data || []).map((r) => ({
//         id: r.request_id,
//         full_name: r.full_name,
//         email: r.email,
//         role: r.role,
//         status: r.status,
//       }));
//       setAccessRequests(mapped);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingRequests(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "Access Requests") fetchAccessRequests();
//   }, [activeTab]);

//   const updateRequestStatus = async (status) => {
//     if (!selectedRequest) return;
//     try {
//       const endpoint =
//         status === "approved"
//           ? `http://localhost:5000/api/access/approve/${selectedRequest.id}`
//           : `http://localhost:5000/api/access/reject/${selectedRequest.id}`;
//       const res = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" } });
//       if (!res.ok) throw new Error("Failed to update status");
//       setAccessRequests((prev) =>
//         prev.map((r) => (r.id === selectedRequest.id ? { ...r, status } : r))
//       );
//       setActiveModal(null);
//       setSelectedRequest(null);
//       setToast(`Request ${status} successfully`);
//       setTimeout(() => setToast(null), 3000);
//       fetchAccessRequests();
//     } catch (err) {
//       console.error(err);
//       setToast(err.message);
//       setTimeout(() => setToast(null), 3000);
//     }
//   };

//   const filteredRequests = accessRequests.filter(
//     (r) =>
//       (filterStatus === "all" || r.status === filterStatus) &&
//       (r.full_name.toLowerCase().includes(searchRequest.toLowerCase()) ||
//         r.email.toLowerCase().includes(searchRequest.toLowerCase()))
//   );

//   return (
//     <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
//       <div className="max-w-6xl mx-auto px-6 py-10">
//         {/* Header */}
//         <div className="flex flex-wrap justify-between items-center gap-3 mb-8 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
//           <div className="flex flex-col gap-1 min-w-[18rem]">
//             <p className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
//               User Management
//             </p>
//             <p className="text-base font-normal text-slate-500 dark:text-slate-400">
//               Manage system users, define access roles, and monitor account statuses.
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button className="flex min-w-[84px] items-center justify-center rounded-lg h-11 px-6 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700">
//               Export CSV
//             </button>
//             <button className="flex min-w-[120px] items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 shadow-md">
//               <span className="material-symbols-outlined mr-2 text-lg">person_add</span>
//               Invite New User
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 mb-8 px-2">
//           {["User List", "Roles & Permissions", "Pending Invitations", "Access Requests"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`pb-4 text-sm font-bold border-b-2 ${
//                 activeTab === tab
//                   ? "border-primary text-primary"
//                   : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
//               }`}
//             >
//               {tab}
//               {tab === "Access Requests" && filteredRequests.filter(r => r.status === "pending").length > 0 && (
//                 <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase">
//                   {filteredRequests.filter(r => r.status === "pending").length} New
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* User List Tab */}
//         {activeTab === "User List" && (
//           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
//             {/* Search */}
//             <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col md:flex-row gap-4 items-center">
//               <label className="flex flex-col flex-1 h-12 w-full">
//                 <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/50 bg-white dark:bg-slate-900">
//                   <div className="text-slate-400 flex items-center justify-center pl-4 rounded-l-lg">
//                     <span className="material-symbols-outlined">search</span>
//                   </div>
//                   <input
//                     className="flex-1 border-none bg-transparent px-4 placeholder:text-slate-400 text-sm text-slate-900 dark:text-white focus:outline-none"
//                     placeholder="Search users by name, email or role..."
//                     value={searchUser}
//                     onChange={(e) => setSearchUser(e.target.value)}
//                   />
//                 </div>
//               </label>
//             </div>

//             {/* Users Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
//                     <th className="px-6 py-4 text-left text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">User Profile</th>
//                     <th className="px-6 py-4 text-left text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Role</th>
//                     <th className="px-6 py-4 text-left text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-4 text-left text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Created Date</th>
//                     <th className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                   {filteredUsers.map((user) => (
//                     <tr key={user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div
//                             className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"
//                             style={{ backgroundImage: `url(${user.avatar || ""})`, backgroundSize: "cover" }}
//                           ></div>
//                           <div className="flex flex-col">
//                             <span className="text-sm font-bold text-slate-900 dark:text-white">{user.full_name}</span>
//                             <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 uppercase">
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`flex items-center gap-1.5 text-sm font-bold ${user.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
//                           <span className={`w-3 h-3 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
//                           {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
//                         {user.created_at
//                           ? new Date(user.created_at).toLocaleString("en-PH", {
//                             weekday: "short",
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })
//                           : "-"}
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <div className="flex justify-end gap-2">
//                           <button
//                             onClick={() => setEditUser(user)}
//                             className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
//                           >
//                             <span className="material-symbols-outlined text-base">edit</span>
//                             <span>Edit</span>
                            
//                           </button>
//                           <button
//                             onClick={() => handleToggleStatus(user)}
//                             className={`px-3 py-1 rounded text-sm font-bold transition-colors ${user.status === "active"
//                                 ? "bg-emerald-600 text-white hover:bg-emerald-700"
//                                 : "bg-red-600 text-white hover:bg-red-700"
//                               }`}
//                           >
//                             {user.status === "active" ? "Active" : "Inactive"}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Access Requests Tab */}
//         {activeTab === "Access Requests" && (
//           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden p-6">
//             {/* Filters */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-6">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none transition"
//               >
//                 <option value="all">All</option>
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//                 <option value="rejected">Rejected</option>
//               </select>

//               <input
//                 type="text"
//                 placeholder="Search name or email..."
//                 value={searchRequest}
//                 onChange={(e) => setSearchRequest(e.target.value)}
//                 className="border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm flex-1 focus:ring-2 focus:ring-primary/50 focus:outline-none transition"
//               />
//             </div>

//             {/* Loading / Empty state */}
//             {loadingRequests && <p className="text-sm text-slate-500 dark:text-slate-400">Loading requests...</p>}
//             {!loadingRequests && filteredRequests.length === 0 && (
//               <p className="text-sm text-slate-500 dark:text-slate-400">No matching requests found.</p>
//             )}

//             {/* Requests List */}
//             <div className="space-y-4">
//               {filteredRequests.map((req) => (
//                 <div
//                   key={req.id}
//                   className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:shadow-lg transition-shadow"
//                 >
//                   {/* User Info */}
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
//                     <div className="flex flex-col">
//                       <p className="font-semibold text-slate-900 dark:text-white">{req.full_name}</p>
//                       <p className="text-sm text-slate-500 dark:text-slate-400">{req.email}</p>
//                     </div>

//                     <div className="text-xs text-slate-400 mt-1 sm:mt-0 flex items-center gap-2">
//                       Role: {req.role}
//                       <span
//                         className={`px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase ${req.status === "approved"
//                             ? "bg-emerald-600"
//                             : req.status === "rejected"
//                               ? "bg-red-600"
//                               : "bg-yellow-500"
//                           }`}
//                       >
//                         {req.status.toUpperCase()}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   {req.status === "pending" && (
//                     <div className="flex gap-2 mt-2 sm:mt-0">
//                       <button
//                         onClick={() => {
//                           setSelectedRequest(req);
//                           setActiveModal("approve");
//                         }}
//                         className="px-4 py-1 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
//                       >
//                         Approve
//                       </button>

//                       <button
//                         onClick={() => {
//                           setSelectedRequest(req);
//                           setActiveModal("reject");
//                         }}
//                         className="px-4 py-1 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>

//       {/* Edit Modal */}
//       {editUser && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-6 border shadow-xl">
//             <h2 className="text-lg font-black mb-4">Edit User</h2>
//             <input
//               type="text"
//               value={editUser.full_name}
//               onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
//               className="border rounded px-3 py-2 mb-3 w-full"
//             />
//             <select name="role" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} className="w-full p-2 border rounded-lg text-sm" >
//               <option value="">Select Role</option>
//               <option value="Admin">Admin</option>
//               <option value="Staff">Staff</option>
//               <option value="User">User</option>
//             </select>
//             <div className="flex justify-end gap-2">
//               <button onClick={() => setEditUser(null)} className="px-4 py-2 border rounded text-sm">
//                 Cancel
//               </button>
//               <button onClick={handleEdit} className="px-4 py-2 bg-emerald-600 text-white rounded text-sm">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Modal */}
//       {activeModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl p-6 border shadow-xl">
//             <h2 className="text-lg font-black mb-4">
//                             {activeModal === "approve" ? "Approve Request" : "Reject Request"}
//             </h2>
//             <p className="text-sm text-slate-500 mb-6">
//               Confirm action for {selectedRequest.full_name}?
//             </p>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setActiveModal(null)}
//                 className="px-4 py-2 border rounded-lg text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() =>
//                   updateRequestStatus(activeModal === "approve" ? "approved" : "rejected")
//                 }
//                 className={`px-4 py-2 text-white rounded-lg text-sm font-bold ${
//                   activeModal === "approve" ? "bg-emerald-600" : "bg-red-600"
//                 }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast Notification */}
//       {toast && (
//         <div className="fixed bottom-5 right-5 bg-black text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-fadeInOut">
//           {toast}
//         </div>
//       )}
//     </main>
//   );
// };

// export default AdminSettings;



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
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 mb-8">
          <div className="flex flex-col gap-2">
            <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              User Management
            </p>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Manage system users, define access roles, and monitor account statuses.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center justify-center rounded-xl h-11 px-6 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200">
              <span className="material-symbols-outlined mr-2 text-lg">download</span>
              Export CSV
            </button>
            <button className="flex items-center justify-center rounded-xl h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl">
              <span className="material-symbols-outlined mr-2 text-lg">person_add</span>
              Invite New User
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-200 dark:border-slate-700/50 mb-8 px-2 overflow-x-auto">
          {["User List", "Roles & Permissions", "Pending Invitations", "Access Requests", "Account Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab}
              {tab === "Access Requests" && filteredRequests.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-2 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-[10px] font-bold uppercase">
                  {filteredRequests.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User List Tab */}
        {activeTab === "User List" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            {/* Search */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 flex flex-col md:flex-row gap-4 items-center">
              <label className="flex flex-col flex-1 w-full">
                <div className="flex w-full items-center rounded-xl border border-slate-200 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary bg-white dark:bg-slate-800 transition-all">
                  <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    className="flex-1 border-none bg-transparent px-4 py-2.5 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm text-slate-900 dark:text-white focus:outline-none"
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
                    <th className="px-6 py-4 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">User Profile</th>
                    <th className="px-6 py-4 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Created Date</th>
                    <th className="px-6 py-4 text-right text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 border border-slate-300 dark:border-slate-600 overflow-hidden">
                            {user.image ? (
                              <img
                                src={`${API_URL}/uploads/${user.image}`}
                                alt={user.full_name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-black">
                                {user.full_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{user.full_name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 uppercase border border-blue-200 dark:border-blue-700/30">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-sm font-bold ${user.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
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
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditUser(user)}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-150" title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-all duration-150 ${
                              user.status === "active"
                                ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            }`}
                            title={user.status === "active" ? "Deactivate" : "Activate"}
                          >
                            <span className="material-symbols-outlined text-lg">{user.status === "active" ? "check_circle" : "block"}</span>
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <div className="flex w-full items-center rounded-xl border border-slate-200 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary bg-white dark:bg-slate-800 transition-all">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchRequest}
                  onChange={(e) => setSearchRequest(e.target.value)}
                  className="flex-1 border-none bg-transparent px-4 py-2.5 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Loading / Empty state */}
            {loadingRequests && <p className="text-sm text-slate-500 dark:text-slate-400">Loading requests...</p>}
            {!loadingRequests && filteredRequests.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No matching requests found.</p>
            )}

            {/* Requests List */}
            <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-50 dark:bg-slate-900">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border-b border-slate-200 dark:border-slate-700/50">
                    <th className="px-6 py-3 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">User</th>
                    <th className="px-6 py-3 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Email</th>
                    <th className="px-6 py-3 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Role</th>
                    <th className="px-6 py-3 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Status</th>
                    <th className="px-6 py-3 text-left text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Created Date</th>
                    <th className="px-6 py-3 text-right text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                          {req.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                          {req.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                          {req.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-lg text-white text-xs font-bold uppercase border ${req.status === "approved"
                                ? "bg-emerald-600/90 dark:bg-emerald-600/70 border-emerald-500/30"
                                : req.status === "rejected"
                                  ? "bg-red-600/90 dark:bg-red-600/70 border-red-500/30"
                                  : "bg-yellow-500/90 dark:bg-yellow-600/70 border-yellow-400/30"
                              }`}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
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

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {req.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setActiveModal("approve");
                                }}
                                className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-all duration-200 shadow-sm flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Approve
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setActiveModal("reject");
                                }}
                                className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all duration-200 shadow-sm flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">close</span>
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-7 border border-slate-200 dark:border-slate-700/50 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">person_edit</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit User</h2>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={editUser.full_name}
                  onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Role</label>
                <select 
                  name="role" 
                  value={editUser.role} 
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setEditUser(null)} 
                className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleEdit} 
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {activeModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-7 border border-slate-200 dark:border-slate-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${
                activeModal === "approve" 
                  ? "bg-emerald-100 dark:bg-emerald-900/20" 
                  : "bg-red-100 dark:bg-red-900/20"
              }`}>
                <span className={`material-symbols-outlined text-2xl ${
                  activeModal === "approve" 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {activeModal === "approve" ? "check_circle" : "warning"}
                </span>
              </div>
              <h2 className={`text-2xl font-bold ${
                activeModal === "approve" 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {activeModal === "approve" ? "Approve Request" : "Reject Request"}
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Confirm this action for <strong className="text-slate-900 dark:text-white">{selectedRequest.full_name}</strong>?
            </p>
            <div className={`mt-4 p-4 rounded-xl ${
              activeModal === "approve" 
                ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-700/30" 
                : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700/30"
            }`}>
              <p className={`text-sm ${
                activeModal === "approve" 
                  ? "text-emerald-900 dark:text-emerald-200" 
                  : "text-red-900 dark:text-red-200"
              }`}>
                {activeModal === "approve" 
                  ? "This will grant access to the system for the requested user." 
                  : "This will deny access and notify the user."}
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateRequestStatus(activeModal === "approve" ? "approved" : "rejected")
                }
                className={`px-6 py-2.5 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg ${
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
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3.5 rounded-xl shadow-2xl shadow-emerald-500/20 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 transition-all border border-emerald-400/30">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {toast}
        </div>
      )}
    </main>
  );
};

export default AdminSettings;