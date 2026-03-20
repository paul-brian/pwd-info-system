import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-900">
      <Sidebar open={open} setOpen={setOpen} />

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