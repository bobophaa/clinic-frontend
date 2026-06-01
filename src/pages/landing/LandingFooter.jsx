import { Link } from "react-router-dom";
import { Globe, Mail, Phone, Share2 } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-[#0F172A] text-gray-300 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-white text-xl font-bold mb-3">គ្លីនិកយើង</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              យើងផ្ដល់សេវាសុខភាពគុណភាពខ្ពស់ ដែលចំណូលបន្ថែមការព្យាបាល
              ប្រកបដោយការយកចិត្តទុកដាក់ និងអ្នកជំនាញ។
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">តំណរភ្ជាប់រហ័ស</h4>
            <ul className="space-y-2 text-sm">
              {["ការណាត់ជួបថ្មី", "លទ្ធផលពិនិត្យ", "ស័ណ្ណដែលបន្ត"].map((item) => (
                <li key={item}>
                  <Link to="/login" className="text-gray-400 hover:text-white transition">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3">វត័ិតរីង</h4>
            <ul className="space-y-2 text-sm">
              {["ពិគ្រោះជំងឺ", "វះកាត់", "ត្រពេទ្យ", "ទំនាក់ទំនង"].map((item) => (
                <li key={item}>
                  <Link to="/services" className="text-gray-400 hover:text-white transition">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">ទំនាក់ទំនង</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={14} /> ០២៣ ៤៥៦ ៧៨៩
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={14} /> info@clinicsync.kh
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-5 flex items-center justify-between">
          <p className="text-xs text-gray-500">រក្សាសិទ្ធិគ្រប់យ៉ាង © ២០២៥ គ្លីនិកយើង</p>
          <div className="flex gap-3">
            <button className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:border-white transition">
              <Globe size={14} className="text-gray-400" />
            </button>
            <button className="w-8 h-8 border border-gray-600 rounded-full flex items-center justify-center hover:border-white transition">
              <Share2 size={14} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}