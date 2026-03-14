import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api/api";
import Cards from "../../components/Cards";
import Buttons from "../../components/Buttons";

// backend base
const API_URL = `${API_URL}/api/pwd`;

// Tailwind-safe dynamic colors mapping
const colorClasses = {
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};


const AdminProfiling = () => {
  const [PWDs, setPWDs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const fetchPWDs = async () => {
    try {
      const { data } = await axios.get(API_URL);
      const mapped = data.map((pwd) => ({
        pwd_id: pwd.pwd_id,
        pwd_number: pwd.pwd_number || "-",
        name: pwd.full_name || "-",
        password: pwd.password || "",
        gender: pwd.gender || "-",
        disability: pwd.disability_type || "-",
        medical_condition: pwd.medical_condition || "-",
        birth_date: pwd.birth_date || "-",
        address: pwd.address || "-",
        contact: pwd.contact_number || "-",
        emergency_contact: pwd.emergency_contact || "-",
        healthStatus: pwd.status === "active" ? "Active" : pwd.status,
        healthColor: pwd.status === "active" ? "emerald" : "rose",
        registered: pwd.created_at ? new Date(pwd.created_at).toLocaleDateString() : "-",
        status: pwd.status,
        canEdit: true,
      }));
      setPWDs(mapped);
    } catch (err) {
      console.error("fetchPWDs", err);
    }
  };

  useEffect(() => { fetchPWDs(); }, []);

  // Filter & paginate
  const filteredPWDs = PWDs.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pwd_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredPWDs.length / itemsPerPage));
  const paginatedPWDs = filteredPWDs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  // Modals
  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });

  // CRUD
  const handleAdd = async (form) => {
    try {
      await axios.post(API_URL, form);
      await fetchPWDs();
      showToast("PWD added successfully!", "success");
      closeModal();
    } catch (err) { console.error("Add error", err); }
      showToast("Failed to add PWD.", "error");
  };

  const handleEdit = async (form) => {
    try {
      const id = form.pwd_id;
      const { pwd_id, ...updateData } = form;
      await axios.put(`${API_URL}/${id}`, updateData);
      await fetchPWDs();
      showToast("PWD updated successfully!", "success");
      closeModal();
    } catch (err) { 
      console.error("Edit error", err); 
      showToast("Failed to update PWD.", "error");
    }
  };

  const handleDelete = async (pwd) => {
    try {
      const id = pwd.pwd_id;
      await axios.delete(`${API_URL}/${id}`);
      await fetchPWDs();
      showToast("PWD profile deactivated successfully!", "success");
      closeModal();
    } catch (err) { 
      console.error("Delete error", err);
      showToast("Failed to deactivate PWD.", "error");
    }
  };

    const statsdata = [
    { label: "Total PWDs", icon: "groups", value: PWDs.length, change: "+12%", changeText: "from last month", changeClass: "text-emerald-600" },
    { label: "Active Profiles", icon: "verified", value: PWDs.filter(p => p.status === "active").length, change: "+5%", changeText: "this week", changeClass: "text-emerald-600" },
    { label: "Inactive Profiles", icon: "block", value: PWDs.filter(p => p.status !== "active").length, change: "-2%", changeText: "vs last month", changeClass: "text-rose-600" }
  ];
  
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

  const showToast = (message, type = "success") => {
  setToast({ message, type, visible: true });
  setTimeout(() => setToast({ ...toast, visible: false }), 3000); 
};

  return (
    <div className="p-2 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">

      {/* Heading + Add Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#0e141b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">Profile Monitoring</h1>
          <p className="text-[#4e7397] dark:text-slate-400 text-sm md:text-base max-w-2xl">Manage and track medical supplies and assistive devices for PWD residents.</p>
        </div>
        <Buttons icon="add_circle" variant="primary" onClick={() => openModal('add')}>
          Add New PWD
        </Buttons>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsdata.map((stat, idx) => (
          <Cards key={idx} stat={stat} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 p-5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="relative flex-1 max-w-md group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-primary transition-colors">search</span>
          <input
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary dark:focus:border-primary outline-none text-slate-900 dark:text-white text-sm transition-all placeholder:text-slate-400"
            placeholder="Search by name, ID, or address..."
            type="text"
          />
        </div>
        <div className="flex gap-3 flex-wrap mt-2 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary/30 transition-all duration-200">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-primary/30 transition-all duration-200">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent border-b border-slate-200 dark:border-slate-700/50">
            <tr>
              {['PWD_Number', 'Full Name', 'Gender', 'Birth Date', 'Disability Type', 'medical Condition', 'Address', 'Contact Number', 'Emergency Contact', 'Status', 'Created', 'Actions'].map(col => (
                <th key={col} className="px-4 md:px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {paginatedPWDs.map(pwd => (
              <tr key={pwd.pwd_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150 group">
                <td className="px-4 md:px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{pwd.pwd_number}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{pwd.name}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pwd.gender}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pwd.birth_date}</td>
                <td className="px-4 md:px-6 py-4"><span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{pwd.disability}</span></td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pwd.medical_condition}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{pwd.address}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pwd.contact}</td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pwd.emergency_contact}</td>
                <td className="px-4 md:px-6 py-4 text-center"><span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${colorClasses[pwd.healthColor]}`}><span className={`w-2 h-2 rounded-full bg-${pwd.healthColor}-500`}></span>{pwd.healthStatus}</span></td>
                <td className="px-4 md:px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{pwd.registered}</td>
                <td className="px-4 md:px-6 py-4 text-right flex justify-end gap-1">
                  <button onClick={() => openModal('view', pwd)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-150" title="View"><span className="material-symbols-outlined text-lg">visibility</span></button>
                  <button onClick={() => pwd.canEdit && openModal('edit', pwd)} className={`p-2 rounded-lg transition-all duration-150 ${pwd.canEdit ? 'text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'}`} disabled={!pwd.canEdit} title="Edit"><span className="material-symbols-outlined text-lg">edit</span></button>
                  <button onClick={() => pwd.canEdit && openModal('delete', pwd)} className={`p-2 rounded-lg transition-all duration-150 ${pwd.canEdit ? 'text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'}`} disabled={!pwd.canEdit} title="Delete"><span className="material-symbols-outlined text-lg">delete</span></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* Pagination */}
        <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent border-t border-slate-200 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredPWDs.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredPWDs.length}</span></p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Previous"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => goToPage(i + 1)} className={`w-9 h-9 flex items-center justify-center rounded-lg border font-bold text-sm transition-all duration-200 ${currentPage === i + 1 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/30 dark:hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>{i + 1}</button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Next"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Modals & Toast */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 w-[520px] max-w-[95%] border border-slate-200 dark:border-slate-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
            {modal.type === 'view' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person_info</span>
                  View PWD Profile
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  {Object.entries(modal.data).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">{key}:</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{value}</span>
                    </div>
                  ))}
                </div>
                <button onClick={closeModal} className="mt-4 w-full px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95">Close</button>
              </div>
            )}
            {modal.type === 'edit' && (
              <EditForm pwd={modal.data} onSave={handleEdit} onCancel={closeModal} />
            )}
            {modal.type === 'delete' && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-2xl">warning</span>
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Deactivate Profile</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Are you sure you want to deactivate <strong className="text-slate-900 dark:text-white">{modal.data.name}</strong>?
                </p>
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl">
                  <p className="text-sm text-amber-900 dark:text-amber-200">This will soft-delete the profile and set the user's status to inactive in User Management.</p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={closeModal} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200">Cancel</button>
                  <button onClick={() => handleDelete(modal.data)} className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-lg active:scale-95">Deactivate</button>
                </div>
              </div>
            )}
            {modal.type === 'add' && (
              <EditForm onSave={handleAdd} onCancel={closeModal} />
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3.5 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 transition-all border
          ${toast.type === "success" ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400/30 shadow-emerald-500/20" : "bg-gradient-to-r from-red-500 to-red-600 border-red-400/30 shadow-red-500/20"}`}>
          <span className="material-symbols-outlined text-lg">{toast.type === "success" ? "check_circle" : "error"}</span>
          {toast.message}
        </div>
      )}
    </div>
  );
};

// Edit/Add Form Component (fields match backend)
const EditForm = ({ pwd = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    pwd_id: pwd.pwd_id || null,
    full_name: pwd.name || '',
    pwd_number: pwd.pwd_number || '',
    password: pwd.password || '',
    disability_type: pwd.disability || '',
    medical_condition: pwd.medical_condition || '',
    birth_date: pwd.birth_date || '',
    gender: pwd.gender || '',
    address: pwd.address || '',
    contact_number: pwd.contact || '',
    emergency_contact: pwd.emergency_contact || '',
    status: pwd.status || 'active',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary text-2xl">person</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formData.pwd_id ? 'Edit PWD Profile' : 'Add New PWD'}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name *</label>
          <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter full name" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">PWD Number *</label>
          <input
            name="pwd_number"
            value={formData.pwd_number}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              if (digits.length > 16) return;

              let formatted = digits;
              if (digits.length > 2) formatted = digits.slice(0, 2) + "-" + digits.slice(2);
              if (digits.length > 6) formatted = formatted.slice(0, 7) + "-" + formatted.slice(7);
              if (digits.length > 9) formatted = formatted.slice(0, 11) + "-" + formatted.slice(11);

              setFormData({ ...formData, pwd_number: formatted });
            }}
            placeholder="00-0000-000-0000000"
            maxLength={19}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {formData.pwd_id ? "New Password (optional)" : "Password *"}
        </label>
        <input className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          name="password" type="password" value={formData.password} onChange={handleChange} placeholder={formData.pwd_id ? "Leave blank to keep current password" : "Enter password"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Birth Date *</label>
          <input name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Gender *</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Disability Type *</label>
        <select name="disability_type" value={formData.disability_type} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer" >
          <option value="">Select Disability Type</option>
          <option value="Physical">Physical Disability</option>
          <option value="Visual">Visual Disability</option>
          <option value="Hearing">Hearing Disability</option>
          <option value="Speech">Speech and Language Impairment</option>
          <option value="Intellectual">Intellectual Disability</option>
          <option value="Learning">Learning Disability</option>
          <option value="Psychosocial">Psychosocial Disability</option>
          <option value="Multiple">Multiple Disabilities</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Medical Condition *</label>
        <select name="medical_condition" value={formData.medical_condition} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
          <option value="">Select Medical Condition</option>
          <option value="Hypertension">Hypertension</option>
          <option value="Diabetes">Diabetes</option>
          <option value="Asthma">Asthma</option>
          <option value="Arthritis">Arthritis</option>
          <option value="Epilepsy">Epilepsy</option>
          <option value="Cerebral">Cerebral Palsy</option>
          <option value="Down Syndrome">Down Syndrome</option>
          <option value="Autism">Autism Spectrum Disorder</option>
          <option value="Bipolar">Bipolar Disorder</option>
          <option value="Schizophrenia">Schizophrenia</option>
          <option value="Stroke">Stroke</option>
          <option value="Heart">Heart Disease</option>
          <option value="Chronic">Chronic Kidney Disease</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Contact Number *</label>
          <input name="contact_number" type="tel" value={formData.contact_number} onChange={handleChange} placeholder="Enter contact number" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Emergency Contact *</label>
          <input name="emergency_contact" type="tel" value={formData.emergency_contact} onChange={handleChange} placeholder="Enter emergency contact" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Address *</label>
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status *</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200">Cancel</button>
        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-95">Save</button>
      </div>
    </form>
  );
};

export default AdminProfiling;

