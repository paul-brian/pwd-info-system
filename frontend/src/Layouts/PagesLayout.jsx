import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";
import API_URL from "../api/api";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`${API_URL}/api/access/requests`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setPendingCount(list.filter((r) => r.status === "pending").length);
      } catch (err) { console.error(err); }
    };
    fetchPending();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-900">
      <Sidebar open={open} setOpen={setOpen} pendingAccessCount={pendingCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenu={() => setOpen(true)} />

        <main className="bg-white dark:bg-slate-900 flex-1 overflow-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;