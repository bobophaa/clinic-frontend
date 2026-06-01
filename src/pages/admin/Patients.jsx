import { useEffect, useMemo, useState } from 'react'
import {
  Eye, Plus, Search, User, Phone, Mail, IdCard,
  X, Droplets, MapPin, Calendar, UserPlus, CheckCircle2,
  AlertCircle, KeyRound, EyeOff, Copy, LogIn
} from 'lucide-react'
import { fetchPatients, createPatient } from '../../services/patientService.js'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

function emptyForm() {
  return {
    name: '', email: '', password: '', phone: '', date_of_birth: '',
    gender: '', address: '', national_id: '', occupation: '',
    blood_type: '', weight_kg: '', height: '', allergies: '', chronic_disease: '',
  }
}

function getInitials(name) {
  if (!name) return 'PT'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-800">{value || '—'}</p>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2] ${className}`}
    />
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="ml-2 rounded-lg bg-white/20 px-2 py-0.5 text-xs font-semibold hover:bg-white/30 transition"
    >
      {copied ? '✓' : <Copy size={12} />}
    </button>
  )
}

export default function Patients() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected]     = useState(null)

  const [addOpen, setAddOpen]           = useState(false)
  const [form, setForm]                 = useState(emptyForm())
  const [showPass, setShowPass]         = useState(false)
  const [saving, setSaving]             = useState(false)
  const [saveError, setSaveError]       = useState('')
  const [createdCreds, setCreatedCreds] = useState(null)

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  useEffect(() => {
    fetchPatients()
      .then((data) => setRows(Array.isArray(data) ? data : data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((item) =>
      item.name?.toLowerCase().includes(term) ||
      String(item.id).includes(term) ||
      item.phone?.includes(term) ||
      item.email?.toLowerCase().includes(term)
    )
  }, [rows, search])

  const openAdd = () => {
    setForm(emptyForm())
    setSaveError('')
    setCreatedCreds(null)
    setShowPass(false)
    setAddOpen(true)
  }

  const handleAdd = async () => {
    if (!form.name)   { setSaveError('សូមបំពេញឈ្មោះ'); return }
    if (!form.email)  { setSaveError('សូមបំពេញអ៊ីមែល'); return }
    if (!form.password || form.password.length < 6) { setSaveError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ ខ្ទង់'); return }
    setSaveError('')
    setSaving(true)
    try {
      const res = await createPatient(form)
      setRows((prev) => [res.data ?? res, ...prev])
      setCreatedCreds({ name: form.name, email: form.email, password: form.password })
      setForm(emptyForm())
    } catch (e) {
      setSaveError(e.response?.data?.message || 'មិនអាចបន្ថែមបានទេ — អ៊ីមែលនេះប្រហែលជាមានរួចហើយ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 p-1">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">បញ្ជីអ្នកជំងឺ</h1>
          <p className="text-sm text-slate-500">គ្រប់គ្រង និងពិនិត្យព័ត៌មានប្រវត្តិអ្នកជំងឺក្នុងប្រព័ន្ធ</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all">
          <Plus size={18} /> បន្ថែមអ្នកជំងឺថ្មី
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1976D2] border-t-transparent" />
          <span>កំពុងផ្ទុក...</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ស្វែងរកតាមឈ្មោះ, អ៊ីមែល ឬលេខទូរស័ព្ទ..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-[#1976D2] focus:outline-none transition-all" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 text-left">ឈ្មោះអ្នកជំងឺ</th>
                  <th className="px-5 py-3.5 text-left">អ៊ីមែល</th>
                  <th className="px-5 py-3.5 text-left">លេខទូរស័ព្ទ</th>
                  <th className="px-5 py-3.5 text-left">ភេទ</th>
                  <th className="px-5 py-3.5 text-left">ក្រុមឈាម</th>
                  <th className="px-5 py-3.5 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400">មិនមានទិន្នន័យអ្នកជំងឺ</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs bg-blue-50 text-[#1976D2] border border-blue-100">{getInitials(item.name)}</span>
                        {item.name}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">{item.email || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">{item.phone || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">{item.gender === 'male' ? 'ប្រុស' : item.gender === 'female' ? 'ស្រី' : '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {item.blood_type ? <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600 border border-red-100">{item.blood_type}</span> : '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <button onClick={() => { setSelected(item); setDetailOpen(true) }} className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-[#1976D2] hover:text-white transition-colors">
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl my-4">
            <div className="relative rounded-t-3xl bg-gradient-to-r from-[#1976D2] to-blue-400 px-6 py-6 text-white">
              <button onClick={() => setDetailOpen(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30"><X size={16} /></button>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">{getInitials(selected.name)}</div>
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-sm text-blue-100">អ្នកជំងឺ #{selected.id}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Personal */}
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">ព័ត៌មានផ្ទាល់ខ្លួន</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow icon={IdCard}   label="លេខសម្គាល់"       value={`#${selected.id}`} />
                  <InfoRow icon={Mail}     label="អ៊ីមែល"            value={selected.email} />
                  <InfoRow icon={Phone}    label="លេខទូរស័ព្ទ"       value={selected.phone} />
                  <InfoRow icon={User}     label="ភេទ"               value={selected.gender === 'male' ? 'ប្រុស' : selected.gender === 'female' ? 'ស្រី' : selected.gender} />
                  <InfoRow icon={Calendar} label="ថ្ងៃខែឆ្នាំកំណើត" value={selected.date_of_birth} />
                  <InfoRow icon={MapPin}   label="អាសយដ្ឋាន"         value={selected.address} />
                  <InfoRow icon={IdCard}   label="លេខអត្តសញ្ញាណបណ្ណ" value={selected.national_id} />
                  <InfoRow icon={User}     label="មុខរបរ"            value={selected.occupation} />
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">ព័ត៌មានសុខភាព</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow icon={Droplets} label="ក្រុមឈាម"   value={selected.blood_type} />
                  <InfoRow icon={User}     label="ទម្ងន់ (kg)" value={selected.weight_kg} />
                  <InfoRow icon={User}     label="កម្ពស់ (cm)" value={selected.height} />
                  <InfoRow icon={AlertCircle} label="ប្រតិកម្មថ្នាំ"  value={selected.allergies} />
                  <InfoRow icon={AlertCircle} label="ជំងឺរ៉ាំរ៉ៃ"     value={selected.chronic_disease} />
                </div>
              </div>
            </div>
            <div className="flex justify-end px-6 pb-6">
              <button onClick={() => setDetailOpen(false)} className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">បិទ</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PATIENT MODAL */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl my-4">

            <div className="flex items-center justify-between rounded-t-3xl bg-[#0F172A] px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><UserPlus size={18} /></div>
                <div>
                  <h2 className="text-lg font-bold">បន្ថែមអ្នកជំងឺថ្មី</h2>
                  <p className="text-xs text-slate-400">បង្កើតគណនីពេញលេញ — អ្នកជំងឺចូលប្រើ App បាន</p>
                </div>
              </div>
              <button onClick={() => setAddOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20"><X size={16} /></button>
            </div>

            {createdCreds ? (
              <div className="p-6 space-y-4">
                <div className="rounded-2xl bg-emerald-500 p-5 text-white text-center">
                  <CheckCircle2 size={40} className="mx-auto mb-2" />
                  <h3 className="text-lg font-bold">បង្កើតគណនីដោយជោគជ័យ!</h3>
                  <p className="text-sm text-emerald-100 mt-1">សូមប្រាប់ព័ត៌មានខាងក្រោមទៅអ្នកជំងឺ</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5 space-y-3 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">ព័ត៌មានចូលប្រព័ន្ធ</p>
                  <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                    <div><p className="text-xs text-slate-400">ឈ្មោះ</p><p className="font-semibold">{createdCreds.name}</p></div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                    <div><p className="text-xs text-slate-400">អ៊ីមែល</p><p className="font-semibold">{createdCreds.email}</p></div>
                    <CopyButton text={createdCreds.email} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3">
                    <div><p className="text-xs text-emerald-300">ពាក្យសម្ងាត់</p><p className="font-bold text-emerald-300 text-lg tracking-widest">{createdCreds.password}</p></div>
                    <CopyButton text={createdCreds.password} />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-blue-500/20 border border-blue-400/30 px-4 py-3 text-sm text-blue-300">
                    <LogIn size={14} /><span>អ្នកជំងឺចូល App: <strong>localhost:5173/login</strong></span>
                  </div>
                </div>
                <button onClick={() => { setCreatedCreds(null); setAddOpen(false) }} className="w-full rounded-xl bg-[#1976D2] py-3 text-sm font-semibold text-white">រួចរាល់</button>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                  {saveError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
                      <AlertCircle size={16} /><span className="text-sm">{saveError}</span>
                    </div>
                  )}

                  {/* SECTION: Account */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1976D2]">ព័ត៌មានគណនី</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="ឈ្មោះពេញ *">
                        <Input value={form.name} onChange={set('name')} placeholder="ឧ. ហ៊ីង ចន្ទបុប្ផា" />
                      </Field>
                      <Field label="អ៊ីមែល *">
                        <Input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" />
                      </Field>
                      <Field label="លេខទូរស័ព្ទ">
                        <Input value={form.phone} onChange={set('phone')} placeholder="012 345 678" />
                      </Field>
                      <Field label="ពាក្យសម្ងាត់ * (អ្នកជំងឺប្រើចូល App)">
                        <div className="relative">
                          <KeyRound size={15} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={form.password}
                            onChange={set('password')}
                            placeholder="យ៉ាងតិច ៦ ខ្ទង់"
                            className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-10 text-sm outline-none focus:border-[#1976D2]"
                          />
                          <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3 top-3 text-slate-400">
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1976D2]">ព័ត៌មានផ្ទាល់ខ្លួន</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="ថ្ងៃខែឆ្នាំកំណើត">
                        <Input type="date" value={form.date_of_birth} onChange={set('date_of_birth')} />
                      </Field>
                      <Field label="ភេទ">
                        <select value={form.gender} onChange={set('gender')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2]">
                          <option value="">-- ជ្រើសភេទ --</option>
                          <option value="male">ប្រុស</option>
                          <option value="female">ស្រី</option>
                          <option value="other">ផ្សេងៗ</option>
                        </select>
                      </Field>
                      <Field label="លេខអត្តសញ្ញាណបណ្ណ">
                        <Input value={form.national_id} onChange={set('national_id')} placeholder="លេខ ID Card" />
                      </Field>
                      <Field label="មុខរបរ">
                        <Input value={form.occupation} onChange={set('occupation')} placeholder="ឧ. គ្រូ, វិស្វករ..." />
                      </Field>
                      <Field label="អាសយដ្ឋាន">
                        <Input value={form.address} onChange={set('address')} placeholder="ភូមិ សង្កាត់ ក្រុង..." />
                      </Field>
                    </div>
                  </div>

         
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#1976D2]">ព័ត៌មានសុខភាព</p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="ក្រុមឈាម">
                        <select value={form.blood_type} onChange={set('blood_type')} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2]">
                          <option value="">-- ក្រុមឈាម --</option>
                          {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </Field>
                      <Field label="ទម្ងន់ (Kg)">
                        <Input type="number" value={form.weight_kg} onChange={set('weight_kg')} placeholder="ឧ. 60" />
                      </Field>
                      <Field label="កម្ពស់ (cm)">
                        <Input type="number" value={form.height} onChange={set('height')} placeholder="ឧ. 170" />
                      </Field>
                      <Field label="ប្រតិកម្មថ្នាំ (Allergies)">
                        <Input value={form.allergies} onChange={set('allergies')} placeholder="ឧ. Penicillin..." />
                      </Field>
                      <Field label="ជំងឺរ៉ាំរ៉ៃ (Chronic Disease)">
                        <Input value={form.chronic_disease} onChange={set('chronic_disease')} placeholder="ឧ. ទឹកនោមផ្អែម..." />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 rounded-b-3xl border-t border-slate-200 px-6 py-4">
                  <button onClick={() => setAddOpen(false)} className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">បោះបង់</button>
                  <button onClick={handleAdd} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-6 py-2 text-sm font-semibold text-white disabled:opacity-60">
                    <UserPlus size={15} />
                    {saving ? 'កំពុងបង្កើត...' : 'បង្កើតគណនី'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}