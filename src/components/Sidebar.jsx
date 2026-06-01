import { NavLink } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { roleMenus, user } = useAuth();

  return (
    <aside className="sticky top-0 h-screen w-[240px] shrink-0 bg-white border-r border-slate-200 text-slate-800 shadow-sm">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
          <div className="rounded-xl bg-blue-50 p-2.5 border border-blue-100">
            <CalendarDays size={20} className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-base font-bold tracking-wide text-slate-900">
              ClinicSync
            </h1>
            {/* ប្តូរអក្ខរាវិរុទ្ធពាក្យ ផ្ទាំង ឱ្យត្រូវស្តង់ដារ */}
            <p className="text-xs text-slate-500">ប្រព័ន្ធគ្រប់គ្រងការណាត់ជួប</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {roleMenus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Role */}
        <div className="border-t border-slate-100 px-5 py-4">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
            <p className="text-xs font-medium text-slate-400">តួនាទីបច្ចុប្បន្ន</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-700 capitalize">
              {user?.role || "-"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;