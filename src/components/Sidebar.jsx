import { NavLink } from "react-router-dom";
import { CalendarDays, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar({ open, setOpen }) {
  const { roleMenus, user } = useAuth();

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
        fixed md:static z-50
        h-screen w-[260px] bg-white border-r border-slate-200
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex items-center justify-between border-b px-5 py-5">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-blue-600" />
              <div>
                <h1 className="font-bold">ClinicSync</h1>
                <p className="text-xs text-gray-500">Clinic System</p>
              </div>
            </div>

            {/* Close button (mobile only) */}
            <button
              onClick={() => setOpen(false)}
              className="md:hidden"
            >
              <X />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {roleMenus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm transition
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="border-t p-4 text-sm text-gray-600">
            Role: <span className="font-semibold">{user?.role}</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;