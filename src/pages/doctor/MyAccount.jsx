import { useState } from 'react'
import { Bell, Lock, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function MyAccount() {
  const { user } = useAuth()

  const [profile, setProfile] = useState({
    name: user?.name || 'វេជ្ជ. សាកល្បង',
    specialty: 'វេជ្ជសាស្ត្រទូទៅ',
    phone: '012 234 567',
    email: 'doctor@clinic.local',
  })

  const [security, setSecurity] = useState({
    current: '',
    next: '',
    confirm: '',
  })

  const [notifications, setNotifications] = useState(true)

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            គណនីរបស់ខ្ញុំ
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន សុវត្ថិភាព និងការជូនដំណឹង
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT - PROFILE CARD */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROFILE CARD */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-[#1976D2]">
                  <UserCircle2 size={34} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {profile.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    តួនាទី៖ {user?.role || 'doctor'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input label="ឈ្មោះ" value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} />

                <Input label="ឯកទេស" value={profile.specialty}
                  onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} />

                <Input label="លេខទូរស័ព្ទ" value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />

                <Input label="អ៊ីមែល" full value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>

              <div className="mt-6 flex justify-end">
                <button className="rounded-xl bg-[#1976D2] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1565C0]">
                  រក្សាទុកការផ្លាស់ប្តូរ
                </button>
              </div>
            </div>

            {/* NOTIFICATION CARD */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-slate-500" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    ការជូនដំណឹង
                  </h3>
                </div>

                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    notifications ? 'bg-[#1976D2]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                      notifications ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                ទទួលការជូនដំណឹងពេលមានការណាត់ថ្មី ឬលទ្ធផលអ្នកជំងឺ
              </p>
            </div>
          </div>

          {/* RIGHT - SECURITY */}
          <div className="space-y-6">

            {/* PASSWORD */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-slate-500" />
                <h3 className="text-lg font-semibold text-slate-900">
                  សុវត្ថិភាព
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                <Input type="password" placeholder="ពាក្យសម្ងាត់ចាស់"
                  value={security.current}
                  onChange={(e) => setSecurity({ ...security, current: e.target.value })} />

                <Input type="password" placeholder="ពាក្យសម្ងាត់ថ្មី"
                  value={security.next}
                  onChange={(e) => setSecurity({ ...security, next: e.target.value })} />

                <Input type="password" placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                  value={security.confirm}
                  onChange={(e) => setSecurity({ ...security, confirm: e.target.value })} />
              </div>

              <button className="mt-4 w-full rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white hover:bg-rose-600">
                ផ្លាស់ប្តូរពាក្យសម្ងាត់
              </button>
            </div>

            {/* SECURITY STATUS */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck size={18} />
                <h3 className="font-semibold">ស្ថានភាពសុវត្ថិភាព</h3>
              </div>

              <p className="mt-2 text-sm text-emerald-700">
                គណនីមានសុវត្ថិភាព និងបានបើក 2FA
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* SMALL REUSABLE INPUT */
function Input({ label, full, ...props }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-2.5 text-sm outline-none focus:border-[#1976D2]"
      />
    </div>
  )
}

export default MyAccount