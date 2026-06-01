import { Bell, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Topbar() {
  const { user, logout } = useAuth()

 
  const getInitials = (name) => {
    if (!name) return 'A'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
  
      <div>
        <h2 className="text-base font-bold text-slate-800 md:text-lg">
          ប្រព័ន្ធគ្រប់គ្រងការណាត់ជួប
        </h2>
      </div>

  
      <div className="flex items-center gap-4">
        
       
        <button 
          type="button" 
          className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <Bell size={20} />
        
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

       
        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

   
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-1.5 pr-3">
        
        
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name || 'អ្នកប្រើប្រាស់'}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              {user?.role || 'Admin'}
            </p>
          </div>
        </div>

       
        <button
          type="button"
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
          title="ចាកចេញពីប្រព័ន្ធ"
        >
          <LogOut size={16} />
        </button>

      </div>
    </header>
  )
}

export default Topbar