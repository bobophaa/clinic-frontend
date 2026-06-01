import { useState } from 'react'
import { 
  User, Mail, Phone, Lock, Bell, ShieldCheck, 
  Globe, Sun, Moon, CheckCircle2, AlertCircle, Eye, EyeOff 
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function MyAccount() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile') 
  
  
  const [profile, setProfile] = useState({
    name: user?.name || 'អ្នកគ្រប់គ្រងប្រព័ន្ធ',
    email: 'admin@clinic.local',
    phone: '012 888 999',
  })
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [showPassword, setShowPassword] = useState({ current: false, next: false, confirm: false })
  

  const [notifications, setNotifications] = useState({ appointments: true, reports: false, system: true })
  const [language, setLanguage] = useState('kh') 
  const [darkMode, setDarkMode] = useState(false)


  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'bg-slate-200', text: 'text-slate-400', width: 'w-0' }
    if (pwd.length < 6) return { label: 'ខ្សោយពេក', color: 'bg-red-500', text: 'text-red-500', width: 'w-1/3' }
    if (pwd.length < 10) return { label: 'មធ្យម (សុវត្ថិភាពល្មម)', color: 'bg-amber-500', text: 'text-amber-500', width: 'w-2/3' }
    return { label: 'ខ្លាំងល្អណាស់ (សុវត្ថិភាពខ្ពស់)', color: 'bg-emerald-500', text: 'text-emerald-500', width: 'w-full' }
  }
  const pwdStrength = getPasswordStrength(passwordForm.next)

  return (
    <div className="space-y-6 p-1 animate-fade-in">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ការកំណត់គណនី</h1>
        <p className="text-sm text-slate-500">រៀបចំប្រវត្តិរូបផ្ទាល់ខ្លួន គ្រប់គ្រងសុវត្ថិភាព និងការកំណត់ប្រព័ន្ធគ្លីនិក</p>
      </div>

      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          ព័ត៌មានផ្ទាល់ខ្លួន
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          សុវត្ថិភាព និងពាក្យសម្ងាត់
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold border-b-2 px-2 transition-all ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          ការកំណត់ប្រព័ន្ធ & ភាសា
        </button>
      </div>

  
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        
       
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-bold text-lg text-white shadow-md">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{profile.name}</h3>
                  <p className="text-xs font-semibold text-slate-400 uppercase mt-0.5 tracking-wider">តួនាទី៖ {user?.role || 'Admin'}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><User size={14} /> ឈ្មោះគណនី</label>
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Mail size={14} /> អ៊ីមែលទំនាក់ទំនង</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Phone size={14} /> លេខទូរស័ព្ទ</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all">រក្សាទុកទិន្នន័យ</button>
            </div>
          )}

   
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid gap-4">
           
                {['current', 'next', 'confirm'].map((field) => (
                  <div key={field} className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-500 capitalize">
                      {field === 'current' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' : field === 'next' ? 'ពាក្យសម្ងាត់ថ្មី' : 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword[field] ? 'text' : 'password'}
                        value={passwordForm[field]}
                        onChange={(e) => setPasswordForm(p => ({ ...p, [field]: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 pl-3 pr-10 py-2.5 text-sm font-medium focus:border-blue-500 focus:outline-none"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => ({ ...p, [field]: !p[field] }))}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {field === 'next' && passwordForm.next && (
                      <div className="mt-2 space-y-1.5 animate-fade-in">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${pwdStrength.color} ${pwdStrength.width}`} />
                        </div>
                        <p className={`text-xs font-bold ${pwdStrength.text}`}>កម្រិតកូដ៖ {pwdStrength.label}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-900 transition-all">ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់</button>
            </div>
          )}

      
          {activeTab === 'settings' && (
            <div className="space-y-6">
      
              <div className="space-y-3 border-b border-slate-100 pb-5">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Globe size={16} className="text-slate-500" /> ភាសាប្រើប្រាស់ក្នុងប្រព័ន្ធ (Language)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLanguage('kh')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${language === 'kh' ? 'border-blue-600 bg-blue-50/50 text-blue-600' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    🇰🇭 ភាសាខ្មែរ
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold transition-all ${language === 'en' ? 'border-blue-600 bg-blue-50/50 text-blue-600' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              </div>

              
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  {darkMode ? <Moon size={16} className="text-slate-500" /> : <Sun size={16} className="text-slate-500" />} ទម្រង់បង្ហាញ (Interface Theme)
                </h3>
                <div className="flex gap-2 rounded-xl bg-slate-100 p-1 w-fit">
                  <button 
                    onClick={() => setDarkMode(false)} 
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${!darkMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Sun size={14} /> ពន្លឺ (Light)
                  </button>
                  <button 
                    onClick={() => setDarkMode(true)} 
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${darkMode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Moon size={14} /> ងងឹត (Dark)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="space-y-4">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Bell size={16} className="text-slate-400" /> កំណត់ការជូនដំណឹង</h3>
            
            <div className="space-y-3 divide-y divide-slate-50">
              {[
                { id: 'appointments', title: 'ការណាត់ជួបអ្នកជំងឺ', desc: 'ដំណឹងនៅពេលមានការកក់ថ្មី' },
                { id: 'reports', title: 'របាយការណ៍ហិរញ្ញវត្ថុ', desc: 'ផ្ញើសេចក្តីសង្ខេបប្រចាំខែ' },
                { id: 'system', title: 'បច្ចុប្បន្នភាពប្រព័ន្ធ', desc: 'ដំណឹងពីមុខងារថ្មីៗ' }
              ].map((item, index) => (
                <div key={item.id} className={`flex items-center justify-between ${index > 0 ? 'pt-3' : ''}`}>
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-700">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(n => ({ ...n, [item.id]: !n[item.id] }))}
                    className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${notifications[item.id] ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${notifications[item.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-sm border-l-4 border-l-emerald-500">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-emerald-600 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold text-sm text-emerald-800">ប្រព័ន្ធសុវត្ថិភាពសកម្ម</p>
                <p className="text-[11px] font-medium text-emerald-600/90 mt-0.5 leading-relaxed">
                  គណនីរបស់អ្នកត្រូវបានការពារដោយជញ្ជាំងភ្លើងប្រព័ន្ធ និងការផ្ទៀងផ្ទាត់កម្រិត ២ជំហាន (2FA)។
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default MyAccount