import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../../api/api";
import { ToastContainer } from "../../components/ui/Toast";
import { StatCardsLoader, TableLoader } from "../../components/ui/Loading";
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
  rose:    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  orange:  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const formatDateDisplay = (dateStr) => {
  if (!dateStr || dateStr === "-") return "—";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};


const toInputDate = (dateStr) => {
  if (!dateStr || dateStr === "-") return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toISOString().slice(0, 10);
};

const AdminProfiling = () => {
  const [PWDs, setPWDs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, data: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toasts, showToast, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  const fetchPWDs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE);
      const mapped = data.map((pwd) => ({
        pwd_id:            pwd.pwd_id,
        pwd_number:        pwd.pwd_number || "-",
        name:              pwd.full_name || "-",
        password:          pwd.password || "",
        gender:            pwd.gender || "-",
        disability:        pwd.disability_type || "-",
        medical_condition: pwd.medical_condition || "-",
        birth_date:        pwd.birth_date || "-",
        address:           pwd.address || "-",
        contact:           pwd.contact_number || "-",
        emergency_contact: pwd.emergency_contact || "-",
        healthStatus:      pwd.status === "active" ? "Active" : pwd.status,
        healthColor:       pwd.status === "active" ? "emerald" : "rose",
        registered:        pwd.created_at || "-",
        status:            pwd.status,
        canEdit:           true,
      }));
      setPWDs(mapped);
    } catch (err) {
      console.error("fetchPWDs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPWDs(); }, []);

  const filteredPWDs = PWDs.filter((p) =>
    (filterStatus === "all" || p.status === filterStatus) &&
    (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pwd_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const totalPages    = Math.max(1, Math.ceil(filteredPWDs.length / itemsPerPage));
  const paginatedPWDs = filteredPWDs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage      = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  const openModal  = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });

  const handleAdd = async (form) => {
    try {
      await axios.post(API_BASE, form);
      await fetchPWDs();
      showToast("PWD added successfully!", "success");
      closeModal();
    } catch (err) {
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
      showToast("Failed to deactivate PWD.", "error");
    }
  };

  const statsdata = [
    { label: "Total PWDs",       icon: "groups",   value: PWDs.length,                                    changeText: "registered",    changeClass: "text-emerald-600" },
    { label: "Active Profiles",  icon: "verified", value: PWDs.filter(p => p.status === "active").length, changeText: "this week",     changeClass: "text-emerald-600" },
    { label: "Inactive Profiles",icon: "block",    value: PWDs.filter(p => p.status !== "active").length, changeText: "vs last month", changeClass: "text-rose-600"    },
  ];

  const columns = [
    "PWD Number", "Full Name", "Gender", "Birth Date",
    "Disability Type", "Medical Condition", "Address",
    "Contact Number", "Emergency Contact", "Status", "Registered", "Actions"
  ];

  const renderRow = (pwd) => (
    <tr key={pwd.pwd_number} className="text-center align-middle hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150">
      <td className="px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">{pwd.pwd_number}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">{pwd.name}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{pwd.gender}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{formatDateDisplay(pwd.birth_date)}</td>
      <td className="px-3 py-2.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
          {pwd.disability}
        </span>
      </td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{pwd.medical_condition}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 max-w-[140px] truncate">{pwd.address}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{pwd.contact}</td>
      <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{pwd.emergency_contact}</td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border whitespace-nowrap ${colorClasses[pwd.healthColor]}`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-${pwd.healthColor}-500`} />
          {pwd.healthStatus}
        </span>
      </td>
      <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDateDisplay(pwd.registered)}</td>
      <td className="px-3 py-2.5">
        <div className="flex justify-center gap-1">
          <button onClick={() => openModal('view', pwd)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="View">
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          <button onClick={() => pwd.canEdit && openModal('edit', pwd)} disabled={!pwd.canEdit}
            className={`p-1.5 rounded-lg transition-all ${pwd.canEdit ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'}`} title="Edit">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
          <button onClick={() => pwd.canEdit && openModal('delete', pwd)} disabled={!pwd.canEdit}
            className={`p-1.5 rounded-lg transition-all ${pwd.canEdit ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-200 dark:text-slate-700 cursor-not-allowed'}`} title="Deactivate">
            <span className="material-symbols-outlined text-base">person_off</span>
          </button>
        </div>
      </td>
    </tr>
  );

  const renderCard = (pwd) => (
    <div key={pwd.pwd_number} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/50 p-3 sm:p-4 shadow-sm">
      <div className="flex justify-between items-start gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Name</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{pwd.name}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border flex-shrink-0 ${colorClasses[pwd.healthColor]}`}>
          {pwd.healthStatus}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        {[
          { label: "PWD Number", value: pwd.pwd_number },
          { label: "Gender",     value: pwd.gender },
          { label: "Birth Date", value: formatDateDisplay(pwd.birth_date) },
          { label: "Contact",    value: pwd.contact },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</p>
            <p className="text-xs font-medium text-slate-900 dark:text-slate-200">{item.value}</p>
          </div>
        ))}
        <div className="col-span-2">
          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Disability Type</p>
          <p className="text-xs font-medium text-slate-900 dark:text-slate-200">{pwd.disability}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Address</p>
          <p className="text-xs font-medium text-slate-900 dark:text-slate-200 line-clamp-2">{pwd.address}</p>
        </div>
      </div>
      <div className="flex gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-700">
        <button onClick={() => openModal('view', pwd)}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
          View
        </button>
        <button onClick={() => pwd.canEdit && openModal('edit', pwd)} disabled={!pwd.canEdit}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${pwd.canEdit ? 'text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-slate-300 cursor-not-allowed'}`}>
          Edit
        </button>
        <button onClick={() => pwd.canEdit && openModal('delete', pwd)} disabled={!pwd.canEdit}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all ${pwd.canEdit ? 'text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-slate-300 cursor-not-allowed'}`}>
          <span className="text-sm">Deactivate</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 w-full flex flex-col gap-4 sm:gap-6 md:gap-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4
         bg-white dark:bg-slate-900 p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Profile Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage and track PWD profiles and records.
          </p>
        </div>
        <Buttons variant="primary" onClick={() => openModal('add')} className="flex items-center justify-center w-full sm:w-auto">
          Add New PWD
        </Buttons>
      </div>

      {/* ── Stats ── */}
      {loading ? <StatCardsLoader count={3} /> : (
        <StatsGrid>
          {statsdata.map((stat, idx) => <StatsCards key={idx} stat={stat} />)}
        </StatsGrid>
      )}

      {/* ── Search ── */}
      <SearchBar
        searchValue={searchTerm}
        setSearchValue={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        filterValue={filterStatus}
        setFilterValue={(val) => { setFilterStatus(val); setCurrentPage(1); }}
        placeholder="Search by name, ID, or address..."
        options={[
          { value: "all",      label: "All" },
          { value: "active",   label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />

      {/* ── Table ── */}
      {loading ? (
        <TableLoader rows={6} cols={columns.length} />
      ) : (
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
      )}

      {/* ── View Modal ── ✅ Fix 2 — filtered out canEdit, healthColor, password */}
      {modal.type === 'view' && (() => {
        const d = modal.data;
        return (
          <ViewModal
            title="View PWD Profile"
            icon="person"
            data={{
              "PWD Number":       d.pwd_number,
              "Full Name":        d.name,
              "Gender":           d.gender,
              "Birth Date":       formatDateDisplay(d.birth_date),
              "Disability Type":  d.disability,
              "Medical Condition":d.medical_condition,
              "Address":          d.address,
              "Contact Number":   d.contact,
              "Emergency Contact":d.emergency_contact,
              "Status":           d.healthStatus,
              "Registered":       formatDateDisplay(d.registered),
            }}
            onClose={closeModal}
          />
        );
      })()}

      {/* ── Add Modal ── */}
      {modal.type === 'add' && (
        <AddEditModal isOpen isEdit={false} title="PWD Profile" icon="person" onCancel={closeModal}>
          <EditForm onSave={handleAdd} onCancel={closeModal} />
        </AddEditModal>
      )}

      {/* ── Edit Modal ── */}
      {modal.type === 'edit' && (
        <AddEditModal isOpen isEdit={true} title="PWD Profile" icon="person" onCancel={closeModal}>
          <EditForm pwd={modal.data} onSave={handleEdit} onCancel={closeModal} />
        </AddEditModal>
      )}

      {/* ── Delete Modal ── ✅ Fix 4 — improved wording */}
      {modal.type === 'delete' && (
        <DeleteModal
          title="Deactivate PWD Profile"
          message="Are you sure you want to deactivate the profile of"
          subject={modal.data.name}
          warning="This will set the profile and user account to inactive. The record will still be kept in the system."
          confirmText="Deactivate Profile"
          onConfirm={() => handleDelete(modal.data)}
          onCancel={closeModal}
        />
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

// ── Edit / Add Form ── ✅ Fix 3 — birth_date preserved on edit
const EditForm = ({ pwd = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    pwd_id:            pwd.pwd_id    || null,
    full_name:         pwd.name      || "",
    pwd_number:        pwd.pwd_number || "",
    password:          "",  // always blank — only submit if changed
    disability_type:   pwd.disability || "",
    medical_condition: pwd.medical_condition || "",
    birth_date:        toInputDate(pwd.birth_date),  // ✅ properly converted
    gender:            pwd.gender    || "",
    address:           pwd.address   || "",
    contact_number:    pwd.contact   || "",
    emergency_contact: pwd.emergency_contact || "",
    status:            pwd.status    || "active",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ If password is blank on edit, remove it from payload
    const payload = { ...formData };
    if (pwd.pwd_id && !payload.password) delete payload.password;
    onSave(payload);
  };

  const inputClass = "w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all placeholder:text-slate-400";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name *</label>
          <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter full name" className={inputClass} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">PWD Number *</label>
          <input name="pwd_number" value={formData.pwd_number}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              if (digits.length > 16) return;
              let f = digits;
              if (digits.length > 2) f = f.slice(0, 2) + "-" + f.slice(2);
              if (digits.length > 6) f = f.slice(0, 7) + "-" + f.slice(7);
              if (digits.length > 9) f = f.slice(0, 11) + "-" + f.slice(11);
              setFormData({ ...formData, pwd_number: f });
            }}
            placeholder="00-0000-000-0000000" maxLength={19} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {formData.pwd_id ? "New Password (leave blank to keep current)" : "Password *"}
        </label>
        <input name="password" type="password" value={formData.password} onChange={handleChange}
          placeholder={formData.pwd_id ? "Leave blank to keep current" : "Enter password"}
          className={inputClass} required={!formData.pwd_id} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Birth Date *</label>
          {/* ✅ Fix 3 — value properly set, not defaultValue */}
          <input name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} className={inputClass} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Gender *</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass + " appearance-none"} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Disability Type *</label>
        <select name="disability_type" value={formData.disability_type} onChange={handleChange} className={inputClass + " appearance-none"} required>
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
        <select name="medical_condition" value={formData.medical_condition} onChange={handleChange} className={inputClass + " appearance-none"} required>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Contact Number *</label>
          <input name="contact_number" type="tel" value={formData.contact_number} onChange={handleChange} placeholder="09XXXXXXXXX" className={inputClass} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Emergency Contact *</label>
          <input name="emergency_contact" type="tel" value={formData.emergency_contact} onChange={handleChange} placeholder="09XXXXXXXXX" className={inputClass} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Address *</label>
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" className={inputClass} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status *</label>
        <select name="status" value={formData.status} onChange={handleChange} className={inputClass + " appearance-none"}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 transition-all">Cancel</button>
        <button type="submit" className="px-6 py-2.5 text-sm bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95">Save</button>
      </div>
    </form>
  );
};

export default AdminProfiling;