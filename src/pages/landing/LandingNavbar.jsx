import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "ទំព័រដើម", href: "/" },
    { label: "សេវាកម្ម", href: "/services" },
    { label: "អំពីយើង", href: "/about" },
    { label: "វេជ្ជបណ្ឌិត", href: "/doctors" },
    { label: "ទំនាក់ទំនង", href: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[#1976D2]">
          ClinicSync
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`text-lg font-semibold transition ${
                location.pathname === l.href
                  ? "text-[#1976D2] border-b-2 border-[#1976D2] pb-0.5"
                  : "text-gray-600 hover:text-[#1976D2]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-lg text-gray-600 hover:text-[#1976D2] font-medium">
            ចូលប្រើ
          </Link>
          <Link
            to="/login"
            className="bg-[#1976D2] text-white text-lg px-5 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
          >
        កក់ការណាត់ជួប
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-gray-600 hover:text-[#1976D2]"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="block mt-2 bg-[#1976D2] text-white text-sm px-4 py-2 rounded-xl text-center">
            ណាត់ជួបថ្មី
          </Link>
        </div>
      )}
    </nav>
  );
}