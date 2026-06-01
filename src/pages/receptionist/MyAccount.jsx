import { useState } from 'react'
import { Bell, Lock, ShieldCheck, UserCircle2, Calendar, Phone, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function MyAccount() {
  const { user } = useAuth()
  
  const [profile, setProfile] = useState({
    name: user?.name || 'អ្នកជំងឺ',
    phone: user?.phone || '012 456 789',
    email: user?.email || 'patient@clinicsync.com',
    dob: '2007-01-01', 
    gender: 'ប្រុស',   
  })


  const [password, setPassword] = useState({
    current: '',
    next: '',
    confirm: '',
  })
  
  const [notify, setNotify] = useState(true)

  return (
    <div className="space-y-5">
   
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">គណនីរបស់ខ្ញុំ</h1>
        <p className="text-sm text-slate-500">គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងសុវត្ថិភាពគណនីរបស់អ្នកជំងឺ</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        
      
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1976D2]">
              <UserCircle2 size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm font-medium text-slate-400">ប្រភេទគណនី: អ្នកជំងឺ (Patient)</p>
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">ឈ្មោះពេញ</label>
              <input 
                value={profile.name} 
                onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} 
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-blue-500/20 transition-all" 
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">លេខទូរស័ព្ទ</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Phone size={14} /></span>
                <input 
                  value={profile.phone} 
                  onChange={(event) => setProfile((prev) => ({ ...prev, phone: event.target.value }))} 
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">ថ្ងៃខែឆ្នាំកំណើត</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Calendar size={14} /></span>
                <input 
                  type="date"
                  value={profile.dob} 
                  onChange={(event) => setProfile((prev) => ({ ...prev, dob: event.target.value }))} 
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">ភេទ</label>
              <select 
                value={profile.gender} 
                onChange={(event) => setProfile((prev) => ({ ...prev, gender: event.target.value }))} 
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="ប្រុស">ប្រុស</option>
                <option value="ស្រី">ស្រី</option>
                <option value="ផ្សេងៗ">ផ្សេងៗ</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold text-slate-500 uppercase tracking-wider">អាសយដ្ឋានអ៊ីមែល</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={14} /></span>
                <input 
                  type="email"
                  value={profile.email} 
                  onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))} 
                  className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#1976D2] focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
            </div>
          </div>

          <button type="button" className="mt-5 rounded-xl bg-[#1976D2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
            រក្សាទុកព័ត៌មាន
          </button>
        </div>


        <div className="space-y-4">
          
ឪ
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex items-center gap-2">
              <Lock size={15} className="text-slate-500" />
              <h3 className="font-bold text-slate-900">ប្តូរពាក្យសម្ងាត់</h3>
            </div>
            <div className="space-y-2">
              <input value={password.current} onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))} type="password" placeholder="ពាក្យសម្ងាត់បច្ចុប្បន្ន" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
              <input value={password.next} onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))} type="password" placeholder="ពាក្យសម្ងាត់ថ្មី" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
              <input value={password.confirm} onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))} type="password" placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
            </div>
            <button className="mt-3 w-full rounded-xl bg-rose-500 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 transition-colors">អាប់ដេតពាក្យសម្ងាត់</button>
          </div>

         
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <Bell size={15} className="text-slate-500" />
                <h3 className="font-bold text-slate-900">ការជូនដំណឹង</h3>
              </div>
              <button onClick={() => setNotify((prev) => !prev)} className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${notify ? 'bg-[#1976D2]' : 'bg-slate-300'}`}>
                <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${notify ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">ទទួលការជូនដំណឹងតាម SMS ឬ អ៊ីមែល រាល់ពេលគ្រូពេទ្យអនុម័តការណាត់ជួប ឬចេញវេជ្ជបញ្ជាថ្មី។</p>
          </div>

        
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
            <div className="inline-flex items-center gap-2 text-emerald-700">
              <ShieldCheck size={16} />
              <h3 className="font-bold text-sm">ស្ថានភាពសុវត្ថិភាព</h3>
            </div>
            <p className="mt-1.5 text-xs text-emerald-600 font-medium leading-relaxed">ទិន្នន័យប្រវត្តិវេជ្ជសាស្ត្រ និងព័ត៌មានឯកជនរបស់អ្នកត្រូវបានការពារដោយប្រព័ន្ធកូដនីយកម្មសុវត្ថិភាពខ្ពស់។</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default MyAccount