import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">

      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main */}
      <div className="flex flex-1 flex-col">

        {/* Topbar */}
        <Topbar setOpen={setOpen} />

        {/* Page content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default MainLayout;