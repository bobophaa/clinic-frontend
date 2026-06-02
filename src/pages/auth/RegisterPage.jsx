import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// ─── Mini Toast ────────────────────────────────────────────────────────────────
function SuccessToast({ message, onClose }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-white shadow-lg animate-[slideIn_0.3s_ease]">
      <span className="text-xl">✅</span>
      <p className="text-sm font-semibold">{message}</p>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white text-lg leading-none">×</button>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ─── Inline error helper ───────────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null
  return <p className="mt-1 text-xs text-rose-500 font-medium">{msg}</p>
}

// ─── Main Component ────────────────────────────────────────────────────────────
function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', gender: 'ប្រុស',
    password: '', password_confirmation: '', agree: false,
    address: '', nationalId: '', occupation: '', maritalStatus: 'នៅលីវ',
    weight: '', height: '', bloodType: '', allergies: '',
    chronicDisease: '', medicalHistory: '',
    emergencyName: '', emergencyPhone: '', emergencyRelation: '',
    insuranceProvider: '', insuranceNumber: '',
  })

  // Inline field errors
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [key]: val }))
    // Clear that field's error as user types
    setFieldErrors((p) => ({ ...p, [key]: '' }))
  }

  // ── Validate important fields, return errors object ──
  const validate = () => {
    const e = {}

    if (!form.name.trim())
      e.name = 'សូមបញ្ចូលឈ្មោះពេញ'

    if (!form.email.trim())
      e.email = 'សូមបញ្ចូលអ៊ីមែល'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ'

    if (!form.phone.trim())
      e.phone = 'សូមបញ្ចូលលេខទូរស័ព្ទ'
    else if (!/^[0-9]{9,12}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'លេខទូរស័ព្ទត្រូវតែ ៩–១២ ខ្ទង់'

    if (!form.dob)
      e.dob = 'សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើត'

    if (!form.password || form.password.length < 6)
      e.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ'

    if (!form.password_confirmation)
      e.password_confirmation = 'សូមបញ្ជាក់ពាក្យសម្ងាត់'
    else if (form.password !== form.password_confirmation)
      e.password_confirmation = 'ពាក្យសម្ងាត់មិនដូចគ្នា'

    if (!form.address.trim())
      e.address = 'សូមបញ្ចូលអាសយដ្ឋាន'


    if (!form.agree)
      e.agree = 'សូមយល់ព្រមលើលក្ខខណ្ឌប្រើប្រាស់'

    return e
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      // Scroll to first error
      const firstKey = Object.keys(errors)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      const user = await register(form)
      if (!user?.name || !user?.token) {
        setServerError('គណនីមិនត្រូវបានរក្សាទុកពេញលេញ សូមព្យាយាមម្តងទៀត')
      } else {
        setShowToast(true)
        setTimeout(() => navigate('/patient/home', { replace: true }), 2000)
      }
    } catch (err) {
      const apiMessage = err.response?.data?.message || ''
      const emailError = err.response?.data?.errors?.email?.[0]
      let message = 'មិនអាចបង្កើតគណនីបាន សូមព្យាយាមម្តងទៀត'

      if (!err.response) {
        message = 'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានឡើយ។ សូមប្រាកដថាអ្នកបានបើកដំណើរការ Laravel Backend។'
      } else if (emailError?.includes('taken') || apiMessage.toLowerCase().includes('email has already been taken')) {
        setFieldErrors((p) => ({ ...p, email: 'អ៊ីមែលនេះត្រូវបានប្រើរួចហើយ' }))
        document.getElementById('field-email')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setSubmitting(false)
        return
      } else if (err.response?.data?.errors?.password?.[0]) {
        message = err.response.data.errors.password[0]
      } else if (apiMessage) {
        message = apiMessage
      }

      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Shared input class builder
  const inputCls = (key) =>
    `w-full rounded-xl border ${fieldErrors[key] ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-[#F4F6FB]'} px-4 py-3 text-sm outline-none transition focus:border-[#1976D2]`

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      {showToast && (
        <SuccessToast
          message="🎉 គណនីត្រូវបានបង្កើតដោយជោគជ័យ! កំពុងបញ្ជូនទៅ..."
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">ClinicSync</h1>
          <button type="button" onClick={() => navigate('/login')} className="text-sm font-semibold text-[#1976D2]">
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
                  <h2 className="max-w-md text-4xl font-bold leading-tight">បង្កើតគណនីអ្នកជំងឺថ្មី</h2>
                  <p className="mt-5 max-w-md text-sm leading-7 text-blue-100">
                    គ្រប់គ្រងព័ត៌មានសុខភាព កក់វេជ្ជបណ្ឌិត និងទទួលសេវាកម្មសុខភាពបានយ៉ាងងាយស្រួល។
                  </p>
                </div>
                {/* <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg">🛡</div>
                    <div>
                      <p className="font-semibold">Protect Personal Data</p>
                      <p className="text-sm text-blue-100">Secure Standard</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <form onSubmit={onSubmit} noValidate className="max-h-[85vh] overflow-y-auto px-8 py-8">

              {serverError && (
                <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-600 ring-1 ring-rose-200">
                  <p className="font-medium">{serverError}</p>
                </div>
              )}

              <div className="mb-7">
                <h3 className="text-2xl font-bold text-slate-800">ចុះឈ្មោះអ្នកជំងឺ</h3>
                <p className="mt-2 text-sm text-slate-500">
                  សូមបំពេញព័ត៌មានឲ្យបានត្រឹមត្រូវ ដើម្បីបង្កើតគណនីនៅលើប្រព័ន្ធ។
                  <span className="ml-1 text-rose-500 font-medium"></span>
                </p>
              </div>

              {/* ── ACCOUNT INFO ── */}
              <div className="mb-8">
                <h4 className="mb-4 text-lg font-semibold text-slate-800">ព័ត៌មានគណនី</h4>
                <div className="grid gap-4 md:grid-cols-2">

                  <div id="field-name">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      ឈ្មោះពេញ <span className="text-rose-500">*</span>
                    </label>
                    <input type="text" value={form.name} onChange={set('name')} placeholder="បញ្ចូលឈ្មោះ" className={inputCls('name')} />
                    <FieldError msg={fieldErrors.name} />
                  </div>

                  <div id="field-email">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      អ៊ីមែល <span className="text-rose-500">*</span>
                    </label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="example@gmail.com" className={inputCls('email')} />
                    <FieldError msg={fieldErrors.email} />
                  </div>

                  <div id="field-phone">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      លេខទូរស័ព្ទ <span className="text-rose-500">*</span>
                    </label>
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="012345678" className={inputCls('phone')} />
                    <FieldError msg={fieldErrors.phone} />
                  </div>

                  <div id="field-dob">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      ថ្ងៃខែឆ្នាំកំណើត <span className="text-rose-500">*</span>
                    </label>
                    <input type="date" value={form.dob} onChange={set('dob')} className={inputCls('dob')} />
                    <FieldError msg={fieldErrors.dob} />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ភេទ</label>
                    <select value={form.gender} onChange={set('gender')} className={inputCls('gender')}>
                      <option>ប្រុស</option>
                      <option>ស្រី</option>
                    </select>
                  </div>

                  <div id="field-password">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      លេខសម្ងាត់ <span className="text-rose-500">*</span>
                    </label>
                    <input type="password" minLength={6} value={form.password} onChange={set('password')} placeholder="********" className={inputCls('password')} />
                    <FieldError msg={fieldErrors.password} />
                  </div>

                  <div id="field-password_confirmation">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      បញ្ជាក់លេខសម្ងាត់ <span className="text-rose-500">*</span>
                    </label>
                    <input type="password" minLength={6} value={form.password_confirmation} onChange={set('password_confirmation')} placeholder="********" className={inputCls('password_confirmation')} />
                    <FieldError msg={fieldErrors.password_confirmation} />
                  </div>

                </div>
              </div>

              {/* ── PERSONAL INFO ── */}
              <div className="mb-8">
                <h4 className="mb-4 text-lg font-semibold text-slate-800">ព័ត៌មានផ្ទាល់ខ្លួន</h4>
                <div className="grid gap-4 md:grid-cols-2">

                  <div id="field-address" className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      អាសយដ្ឋាន <span className="text-rose-500">*</span>
                    </label>
                    <textarea rows={2} value={form.address} onChange={set('address')}
                      className={`${inputCls('address')} resize-none`} />
                    <FieldError msg={fieldErrors.address} />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">លេខអត្តសញ្ញាណប័ណ្ណ</label>
                    <input value={form.nationalId} onChange={set('nationalId')} className={inputCls('nationalId')} />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">មុខរបរ</label>
                    <input value={form.occupation} onChange={set('occupation')} className={inputCls('occupation')} />
                  </div>

                </div>
              </div>

              {/* ── MEDICAL INFO ── */}
              <div className="mb-8">
                <h4 className="mb-4 text-lg font-semibold text-slate-800">ព័ត៌មានសុខភាព</h4>
                <div className="grid gap-4 md:grid-cols-3">

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">ទម្ងន់ (Kg)</label>
                    <input type="number" value={form.weight} onChange={set('weight')} className={inputCls('weight')} />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">កម្ពស់ (cm)</label>
                    <input type="number" value={form.height} onChange={set('height')} className={inputCls('height')} />
                  </div>

                  <div id="field-bloodType">
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      ប្រភេទឈាម <span className="text-rose-500"></span>
                    </label>
                    <select value={form.bloodType} onChange={set('bloodType')} className={inputCls('bloodType')}>
                      <option value="">ជ្រើសរើស</option>
                      <option>A+</option><option>A-</option><option>B+</option>
                      <option>B-</option><option>AB+</option><option>AB-</option>
                      <option>O+</option><option>O-</option>
                    </select>
                    <FieldError msg={fieldErrors.bloodType} />
                  </div>

                </div>
              </div>

              {/* ── AGREEMENT ── */}
              <div id="field-agree">
                <label className="flex items-start gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={set('agree')}
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <span>
                    ខ្ញុំយល់ព្រមលើ{' '}
                    <span className="font-semibold text-[#1976D2]">លក្ខខណ្ឌប្រើប្រាស់</span>{' '}
                    និង{' '}
                    <span className="font-semibold text-[#1976D2]">គោលការណ៍ឯកជនភាព</span>
                  </span>
                </label>
                <FieldError msg={fieldErrors.agree} />
              </div>

              {/* ── SUBMIT ── */}
              <button
                type="submit"
                disabled={submitting}
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