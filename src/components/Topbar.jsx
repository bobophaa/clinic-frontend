import { Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Topbar({ setOpen }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>

        <h2 className="font-bold text-slate-800">
          Clinic Dashboard
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Bell className="text-slate-500" />

        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>

        <button onClick={logout}>
          <LogOut className="text-red-500" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;