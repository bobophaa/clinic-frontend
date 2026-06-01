import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  UserCircle2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

function MyAccount() {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const [profile, setProfile] = useState({
    name: user?.name || 'លី រដ្ឋា',
    phone: '+855 88 888 888',
    email: user?.email || 'uthy.ly@gmail.com',
    address: 'ភ្នំពេញ, កម្ពុជា',
  })

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSaving(false)
    setShowToast(true)
    
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 antialiased sm:px-6 lg:px-8">
      
      {/* SUCCESS TOAST ALERTS */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 shadow-xl animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="text-emerald-500" size={20} />
          <p className="text-sm font-medium text-emerald-800">
            រក្សាទុកទិន្នន័យបានជោគជ័យ!
          </p>
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col gap-2 border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            គណនីរបស់ខ្ញុំ
          </h1>
          <p className="text-base text-slate-500">
            គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងព័ត៌មានទំនាក់ទំនងរបស់អ្នកឱ្យមានសុវត្ថិភាព
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          
          {/* LEFT COLUMN: VISUAL PROFILE CARD (NO CAMERA/EDIT STATE) */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              {/* Clean Decorative Top Banner */}
              <div className="h-28 bg-gradient-to-tr from-blue-600 to-indigo-500" />

              <div className="-mt-12 px-6 pb-8 text-center">
                {/* Avatar Display Only */}
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-50 shadow-sm">
                  <UserCircle2 size={64} className="text-blue-600" />
                </div>

                {/* Identity Info */}
                <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-blue-700">
                  គណនីអ្នកជំងឺ
                </span>

                {/* Account Security Badge */}
                <div className="mt-6 flex items-start gap-3.5 rounded-2xl bg-slate-50 p-4 text-left border border-slate-100">
                  <div className="mt-0.5 rounded-xl bg-white p-2.5 text-blue-600 shadow-sm layer-blur">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">គណនីមានសុវត្ថិភាព</h4>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      ព័ត៌មានឯកជនរបស់អ្នកត្រូវបានការពារយ៉ាងតឹងរ៉ឹង
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CORE FORM MANAGEMENT */}
          <form onSubmit={handleSave} className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <div>
              {/* Form Section Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">ព័ត៌មានផ្ទាល់ខ្លួន</h3>
                <p className="mt-1 text-sm text-slate-500">អ្នកអាចធ្វើការផ្លាស់ប្តូរ និងកែប្រែប្រវត្តិរូបរបស់អ្នកនៅទីនេះ</p>
              </div>

              {/* Input Layout Elements Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  icon={<UserCircle2 size={20} />}
                  label="ឈ្មោះពេញ"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  required
                />

                <Input
                  icon={<Phone size={20} />}
                  label="លេខទូរស័ព្ទ"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    icon={<Mail size={20} />}
                    label="អ៊ីមែល"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>

                {/* Textarea Address Component Block */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    អាសយដ្ឋាន
                  </label>
                  <div className="flex rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
                    <div className="mr-3 mt-0.5 text-slate-400">
                      <MapPin size={20} />
                    </div>
                    <textarea
                      rows={3}
                      value={profile.address}
                      onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                      className="w-full resize-none bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                      placeholder="បញ្ចូលអាសយដ្ឋានបច្ចុប្បន្នរបស់អ្នក"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER BUTTONS */}
            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100"
              >
                បោះបង់
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 active:scale-98 disabled:pointer-events-none disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>កំពុងរក្សាទុក...</span>
                  </>
                ) : (
                  <span>រក្សាទុកការផ្លាស់ប្តូរ</span>
                )}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}

/* INPUT REUSABLE SUB-COMPONENT */
function Input({ label, icon, ...props }) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
        <div className="mr-3 text-slate-400 shrink-0">
          {icon}
        </div>
        <input
          {...props}
          className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  )
}

export default MyAccount