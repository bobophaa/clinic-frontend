import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    // Account
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'ប្រុស',
    password: '',
    password_confirmation: '',
    agree: false,

    // Personal Info
    address: '',
    nationalId: '',
    occupation: '',
    maritalStatus: 'នៅលីវ',

    // Medical Info
    weight: '',
    height: '',
    bloodType: '',
    allergies: '',
    chronicDisease: '',
    medicalHistory: '',

    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',

    // Insurance
    insuranceProvider: '',
    insuranceNumber: '',
  })
  

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')


    if (!form.name?.trim()) {
      setError('សូមបញ្ចូលឈ្មោះពេញ')
      return
    }
    if (!form.email?.trim()) {
      setError('សូមបញ្ចូលអ៊ីមែល')
      return
    }
    if (!form.password || form.password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ')
      return
    }
    if (form.password !== form.password_confirmation) {
      setError('ពាក្យសម្ងាត់មិនដូចគ្នា សូមពិនិត្យម្តងទៀត')
      return
    }
    if (!form.agree) {
      setError('សូមយល់ព្រមលើលក្ខខណ្ឌប្រើប្រាស់')
      return
    }

    setSubmitting(true)

    try {
      const user = await register(form)
      if (!user?.name || !user?.token) {
        setError('គណនីមិនត្រូវបានរក្សាទុកពេញលេញ សូមព្យាយាមម្តងទៀត')
      } else {
        navigate('/patient/home', { replace: true })
      }
    } catch (err) {
      // ត្រួតពិនិត្យ និងចាប់យកសារកំហុស (Error Responses) ពី Laravel API
      const apiMessage = err.response?.data?.message || ''
      const emailError = err.response?.data?.errors?.email?.[0]

      let message = 'មិនអាចបង្កើតគណនីបាន សូមព្យាយាមម្តងទៀត'

      if (!err.response) {
    
        message = 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានឡើយ។ សូមប្រាកដថាអ្នកបានបើកដំណើរការ Laravel Backend (php artisan serve)។'
      } else if (
        emailError?.includes('taken') ||
        apiMessage.toLowerCase().includes('email has already been taken')
      ) {
        message = 'អ៊ីមែលនេះត្រូវបានប្រើរួចហើយ។ សូមប្រើប្រាស់អ៊ីមែលផ្សេង។'
      } else if (err.response?.data?.errors?.password?.[0]) {
        message = err.response.data.errors.password[0]
      } else if (err.response?.data?.errors?.name?.[0]) {
        message = err.response.data.errors.name[0]
      } else if (emailError) {
        message = emailError
      } else if (apiMessage) {
        message = apiMessage
      }

      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">ClinicSync</h1>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-[#1976D2]"
          >
            ត្រឡប់ទៅការចូលប្រើ
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="grid lg:grid-cols-[40%_60%]">
            {/* LEFT SIDE */}
            <div className="relative overflow-hidden">
              <img
                src="https://i.pinimg.com/736x/86/fc/32/86fc32f973bb2d7d654a45d91496dfa8.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1976D2]/70" />

              <div className="relative z-10 flex h-full flex-col justify-between px-8 py-10 text-white">
                <div>
                  <div className="mb-8 inline-flex rounded-2xl bg-white/15 px-4 py-2 text-sm backdrop-blur">
                    ប្រព័ន្ធគ្រប់គ្រងមន្ទីរពេទ្យទំនើប
                  </div>
                  <h2 className="max-w-md text-4xl font-bold leading-tight">
                    បង្កើតគណនីអ្នកជំងឺថ្មី
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-7 text-blue-100">
                    គ្រប់គ្រងព័ត៌មានសុខភាព កក់វេជ្ជបណ្ឌិត និងទទួលសេវាកម្មសុខភាពបានយ៉ាងងាយស្រួល។
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg">🛡</div>
                    <div>
                      <p className="font-semibold">Protect Personal Data</p>
                      <p className="text-sm text-blue-100">Secure Standard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <form onSubmit={onSubmit} className="max-h-[85vh] overflow-y-auto px-8 py-8">
              {/* ប្រអប់បង្ហាញសារកំហុស (Error Alert) */}
              {error && (
                <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-600 ring-1 ring-rose-200">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <div className="mb-7">
                <h3 className="text-2xl font-bold text-slate-800">ចុះឈ្មោះអ្នកជំងឺ</h3>
                <p className="mt-2 text-sm text-slate-500">សូមបំពេញព័ត៌មានឲ្យបានត្រឹមត្រូវ ដើម្បីបង្កើតគណនីនៅលើប្រព័ន្ធ។</p>
              </div>

              {/* ACCOUNT INFO */}
              <div className="mb-8">
                <h4 className="mb-4 text-lg font-semibold text-slate-800">ព័ត៌មានគណនី</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ឈ្មោះពេញ</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="បញ្ចូលឈ្មោះ"
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">អ៊ីមែល</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="example@gmail.com"
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">លេខទូរស័ព្ទ</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="012345678"
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ថ្ងៃខែឆ្នាំកំណើត</label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm((p) => ({ ...p, dob: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ភេទ</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    >
                      <option>ប្រុស</option>
                      <option>ស្រី</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">លេខសម្ងាត់</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      placeholder="********"
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">បញ្ជាក់លេខសម្ងាត់</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={form.password_confirmation}
                      onChange={(e) => setForm((p) => ({ ...p, password_confirmation: e.target.value }))}
                      placeholder="********"
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>
                </div>
              </div>

              {/* PERSONAL INFO */}
              <div className="mb-8">
                <h4 className="mb-4 text-lg font-semibold text-slate-800">ព័ត៌មានផ្ទាល់ខ្លួន</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">អាសយដ្ឋាន</label>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">លេខអត្តសញ្ញាណប័ណ្ណ</label>
                    <input
                      value={form.nationalId}
                      onChange={(e) => setForm((p) => ({ ...p, nationalId: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">មុខរបរ</label>
                    <input
                      value={form.occupation}
                      onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>
                </div>
              </div>

              {/* MEDICAL INFO */}
              <div className="mb-8">
                <h4 className="mb-4 text-lg font-semibold text-slate-800">ព័ត៌មានសុខភាព</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ទម្ងន់ (Kg)</label>
                    <input
                      type="number"
                      value={form.weight}
                      onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">កម្ពស់ (cm)</label>
                    <input
                      type="number"
                      value={form.height}
                      onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ប្រភេទឈាម</label>
                    <select
                      value={form.bloodType}
                      onChange={(e) => setForm((p) => ({ ...p, bloodType: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 bg-[#F4F6FB] px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]"
                    >
                      <option value="">ជ្រើសរើស</option>
                      <option>A+</option><option>A-</option><option>B+</option>
                      <option>B-</option><option>AB+</option><option>AB-</option>
                      <option>O+</option><option>O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AGREEMENT */}
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => setForm((p) => ({ ...p, agree: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <span>
                  ខ្ញុំយល់ព្រមលើ{' '}
                  <span className="font-semibold text-[#1976D2]">លក្ខខណ្ឌប្រើប្រាស់</span>{' '}
                  និង{' '}
                  <span className="font-semibold text-[#1976D2]">គោលការណ៍ឯកជនភាព</span>
                </span>
              </label>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={!form.agree || submitting}
                className="mt-6 w-full rounded-2xl bg-[#1976D2] py-3.5 text-base font-semibold text-white transition hover:bg-[#1565C0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'កំពុងបង្កើត...' : 'បង្កើតគណនីថ្មី'}
              </button>

              <p className="mt-4 text-center text-sm text-slate-500">
                មានគណនីរួចហើយ?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-semibold text-[#1976D2]">
                  ចូលប្រើ
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage