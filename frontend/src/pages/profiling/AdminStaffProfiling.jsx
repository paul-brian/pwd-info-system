import { useState, useEffect } from "react";
import { ToastContainer } from "../../components/ui/Toast";
import axios from "axios";
import API_URL from "../../api/api";
import StatsCards from "../../components/ui/StatsCards";
import StatsGrid from "../../components/ui/StatsGrid";
import Buttons from "../../components/ui/Buttons";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import SearchBar from "../../components/ui/SearchBar";
import AddEditModal from "../../components/modals/AddEditModal";
import DeleteModal from "../../components/modals/DeleteModal";
import ViewModal from "../../components/modals/ViewModal";
import useToast from "../../hooks/useToast";

const API_BASE = `${API_URL}/api/pwd`;

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
  const [filterStatus, setFilterStatus] = useState("all");
  const { toasts, showToast, removeToast } = useToast();
  const itemsPerPage = 6;

  const fetchPWDs = async () => {
    try {
      const { data } = await axios.get(API_BASE);
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

  // ── Filter & Paginate ──
  const filteredPWDs = PWDs.filter((p) =>
    (filterStatus === "all" || p.status === filterStatus) &&
    (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pwd_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const totalPages = Math.max(1, Math.ceil(filteredPWDs.length / itemsPerPage));
  const paginatedPWDs = filteredPWDs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  // ── Modals ──
  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });


  // ── CRUD ──
  const handleAdd = async (form) => {
    try {
      await axios.post(API_BASE, form);
      await fetchPWDs();
      showToast("PWD added successfully!", "success");
      closeModal();
    } catch (err) {
      console.error("Add error", err);
      showToast("Failed to add PWD.", "error");
    }
  };

  const handleEdit = async (form) => {
    try {
      const id = form.pwd_id;
      const { pwd_id, ...updateData } = form;
      await axios.put(`${API_BASE}/${id}`, updateData);
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
      await axios.delete(`${API_BASE}/${pwd.pwd_id}`);
      await fetchPWDs();
      showToast("PWD profile deactivated successfully!", "success");
      closeModal();
    } catch (err) {
      console.error("Delete error", err);
      showToast("Failed to deactivate PWD.", "error");
    }
  };


  // ── Stats ──
  const statsdata = [
    { label: "Total PWDs", icon: "groups", value: PWDs.length, change: "+12%", changeText: "from last month", changeClass: "text-emerald-600" },
    { label: "Active Profiles", icon: "verified", value: PWDs.filter(p => p.status === "active").length, change: "+5%", changeText: "this week", changeClass: "text-emerald-600" },
    { label: "Inactive Profiles", icon: "block", value: PWDs.filter(p => p.status !== "active").length, change: "-2%", changeText: "vs last month", changeClass: "text-rose-600" },
  ];

  // ── Table columns ──
  const columns = [
    "PWD Number", "Full Name", "Gender", "Birth Date",
    "Disability Type", "Medical Condition", "Address",
    "Contact Number", "Emergency Contact", "Status", "Created", "Actions"
  ];

  // ── Desktop row ──
  const renderRow = (pwd) => (
    <tr key={pwd.pwd_number} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150">
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm font-bold text-slate-900 dark:text-white">{pwd.pwd_number}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400 font-medium">{pwd.name}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">{pwd.gender}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">{pwd.birth_date}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4">
        <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-lg text-[10px] lg:text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {pwd.disability}
        </span>
      </td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">{pwd.medical_condition}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{pwd.address}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">{pwd.contact}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">{pwd.emergency_contact}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 rounded-lg text-[10px] lg:text-xs font-bold border ${colorClasses[pwd.healthColor]}`}>
          <span className={`w-2 h-2 rounded-full bg-${pwd.healthColor}-500`}></span>
          {pwd.healthStatus}
        </span>
      </td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4 text-xs text-slate-500 dark:text-slate-400">{pwd.registered}</td>
      <td className="px-4 lg:px-5 2xl:px-6 py-3 lg:py-4">
        <div className="flex justify-end gap-1 lg:gap-2">
          <button onClick={() => openModal('view', pwd)} className="p-1.5 lg:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="View">
            <span className="material-symbols-outlined text-lg lg:text-xl">visibility</span>
          </button>
          <button onClick={() => pwd.canEdit && openModal('edit', pwd)} disabled={!pwd.canEdit}
            className={`p-1.5 lg:p-2 rounded-lg transition-all ${pwd.canEdit ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'}`} title="Edit">
            <span className="material-symbols-outlined text-lg lg:text-xl">edit</span>
          </button>
          <button onClick={() => pwd.canEdit && openModal('delete', pwd)} disabled={!pwd.canEdit}
            className={`p-1.5 lg:p-2 rounded-lg transition-all ${pwd.canEdit ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'}`} title="Delete">
            <span className="material-symbols-outlined text-lg lg:text-xl">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );

  // ── Mobile card ──
  const renderCard = (pwd) => (
    <div key={pwd.pwd_number} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Name</p>
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">{pwd.name}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-bold border flex-shrink-0 ${colorClasses[pwd.healthColor]}`}>
          <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-${pwd.healthColor}-500`}></span>
          <span className="hidden sm:inline">{pwd.healthStatus}</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2.5">
        {[
          { label: "PWD Number", value: pwd.pwd_number },
          { label: "Gender",     value: pwd.gender },
          { label: "Birth Date", value: pwd.birth_date },
          { label: "Contact",    value: pwd.contact, truncate: true },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className={`text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200 ${item.truncate ? "truncate" : ""}`}>{item.value}</p>
          </div>
        ))}
        <div className="col-span-2">
          <p className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Disability Type</p>
          <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200">{pwd.disability}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
          <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-200 line-clamp-2">{pwd.address}</p>
        </div>
      </div>
      <div className="flex gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-700">
        <button onClick={() => openModal('view', pwd)} className="flex-1 flex items-center justify-center gap-1.5 p-2 sm:p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all text-xs sm:text-sm">
          <span className="font-bold text-sm">View</span>
        </button>
        <button onClick={() => pwd.canEdit && openModal('edit', pwd)} disabled={!pwd.canEdit}
          className={`flex-1 flex items-center justify-center gap-1.5 p-2 sm:p-2.5 rounded-lg transition-all text-xs sm:text-sm ${pwd.canEdit ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-slate-200 cursor-not-allowed'}`}>
          <span className="font-bold text-sm">Edit</span>
        </button>
        <button onClick={() => pwd.canEdit && openModal('delete', pwd)} disabled={!pwd.canEdit}
          className={`flex-1 flex items-center justify-center gap-1.5 p-2 sm:p-2.5 rounded-lg transition-all text-xs sm:text-sm ${pwd.canEdit ? 'text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-200 cursor-not-allowed'}`}>
          <span className="font-bold text-sm">Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
        bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/30 dark:to-transparent
        p-3 sm:p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Profile Monitoring
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400">
            Manage and track medical supplies and assistive devices for PWD residents.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Buttons icon="add_circle" variant="primary" onClick={() => openModal('add')} className="w-full sm:w-auto">
            Add New PWD
          </Buttons>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsGrid>
        {statsdata.map((stat, idx) => (
          <StatsCards key={idx} stat={stat} />
        ))}
      </StatsGrid>

      {/* ── Search + Filter ── */}
      <SearchBar
        searchValue={searchTerm}
        setSearchValue={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        filterValue={filterStatus}
        setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
        placeholder="Search by name, ID, or address..."
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />

      {/* ── DataTable ── */}
      <DataTable
        columns={columns}
        data={paginatedPWDs}
        renderRow={renderRow}
        renderCard={renderCard}
        empty="No PWD profiles found."
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPWDs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        }
      />

      {/* ── View Modal ── */}
      {modal.type === 'view' && (
        <ViewModal
          title="View PWD Profile"
          icon="person_info"
          data={modal.data}
          onClose={closeModal}
        />
      )}

      {/* ── Add Modal ── */}
      {modal.type === 'add' && (
        <AddEditModal
          isOpen
          isEdit={false}
          title="PWD Profile"
          icon="person"
          onCancel={closeModal}
        >
          <EditForm onSave={handleAdd} onCancel={closeModal} />
        </AddEditModal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === 'edit' && (
        <AddEditModal
          isOpen
          isEdit={true}
          title="PWD Profile"
          icon="person"
          onCancel={closeModal}
        >
          <EditForm pwd={modal.data} onSave={handleEdit} onCancel={closeModal} />
        </AddEditModal>
      )}

      {/* ── Delete Modal ── */}
      {modal.type === 'delete' && (
        <DeleteModal
          title="Deactivate Profile"
          message="Are you sure you want to deactivate"
          subject={modal.data.name}
          warning="This will soft-delete the profile and set the user's status to inactive."
          confirmText="Deactivate"
          onConfirm={() => handleDelete(modal.data)}
          onCancel={closeModal}
        />
      )}

      {/* ── Toast ── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// ── Edit / Add Form ──
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">person</span>
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">{formData.pwd_id ? 'Edit PWD Profile' : 'Add New PWD'}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name *</label>
          <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter full name"
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">PWD Number *</label>
          <input name="pwd_number" value={formData.pwd_number}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              if (digits.length > 16) return;
              let formatted = digits;
              if (digits.length > 2) formatted = digits.slice(0, 2) + "-" + digits.slice(2);
              if (digits.length > 6) formatted = formatted.slice(0, 7) + "-" + formatted.slice(7);
              if (digits.length > 9) formatted = formatted.slice(0, 11) + "-" + formatted.slice(11);
              setFormData({ ...formData, pwd_number: formatted });
            }}
            placeholder="00-0000-000-0000000" maxLength={19}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {formData.pwd_id ? "New Password (optional)" : "Password *"}
        </label>
        <input name="password" type="password" value={formData.password} onChange={handleChange}
          placeholder={formData.pwd_id ? "Leave blank to keep current password" : "Enter password"}
          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Birth Date *</label>
          <input name="birth_date" type="date" value={formData.birth_date} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Gender *</label>
          <select name="gender" value={formData.gender} onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Disability Type *</label>
        <select name="disability_type" value={formData.disability_type} onChange={handleChange}
          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none">
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
        <select name="medical_condition" value={formData.medical_condition} onChange={handleChange}
          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Contact Number *</label>
          <input name="contact_number" type="tel" value={formData.contact_number} onChange={handleChange} placeholder="Enter contact number"
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Emergency Contact *</label>
          <input name="emergency_contact" type="tel" value={formData.emergency_contact} onChange={handleChange} placeholder="Enter emergency contact"
            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Address *</label>
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Enter address"
          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status *</label>
        <select name="status" value={formData.status} onChange={handleChange}
          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all appearance-none">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button type="button" onClick={onCancel} className="px-4 sm:px-6 py-2.5 text-sm sm:text-base bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 transition-all">Cancel</button>
        <button type="submit" className="px-4 sm:px-6 py-2.5 text-sm sm:text-base bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">Save</button>
      </div>
    </form>
  );
};

export default AdminProfiling;