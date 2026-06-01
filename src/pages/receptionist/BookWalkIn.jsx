import { useState, useEffect, useCallback } from 'react'
import {
  UserPlus, X, KeyRound, Eye, EyeOff, AlertCircle,
  CheckCircle2, Calendar, Save
} from 'lucide-react'
import { fetchPatients, createPatient } from '../../services/patientService.js'
import { fetchDoctors } from '../../services/doctorService.js'
import { createAppointment } from '../../services/appointmentService.js'
import { useToast } from '../../context/ToastContext'
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

function emptyPatient() {
  return {
    name: '', email: '', password: '', phone: '', date_of_birth: '',
    gender: '', address: '', national_id: '', occupation: '',
    blood_type: '', weight_kg: '', height: '', allergies: '', chronic_disease: '',
  }
}

export default function WalkIn() {
  const [patients, setPatients]     = useState([])
  const [doctors, setDoctors]       = useState([])
  const [loadingData, setLoadingData] = useState(true)

  // ── BOOKING FORM ──
  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedDoctor, setSelectedDoctor]   = useState('')
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().slice(0, 10))
  const [appointmentTime, setAppointmentTime] = useState('')
  const [notes, setNotes]                     = useState('')
  const [submitting, setSubmitting]           = useState(false)
  // const [submitError, setSubmitError]         = useState('')
  // const [submitSuccess, setSubmitSuccess]     = useState(false)

  // ── ADD PATIENT MODAL ──
  const [addOpen, setAddOpen]           = useState(false)
  const [patientForm, setPatientForm]   = useState(emptyPatient())
  const [showPass, setShowPass]         = useState(false)
  const [savingPatient, setSavingPatient] = useState(false)
  const [patientError, setPatientError] = useState('')
  const [createdCreds, setCreatedCreds] = useState(null)


  const toast = useToast()

  const setField = (field) => (e) => setPatientForm((p) => ({ ...p, [field]: e.target.value }))

  // ── LOAD DATA ──
  const loadData = useCallback(async () => {
    setLoadingData(true)
    try {
      const [pRes, dRes] = await Promise.all([fetchPatients(), fetchDoctors()])
      const pList = Array.isArray(pRes) ? pRes : pRes.data ?? []
      const dList = Array.isArray(dRes) ? dRes : dRes.data ?? []
      setPatients(pList)
      setDoctors(dList.filter((d) => Number(d.is_active) === 1 || d.active === true))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])
const handleAddPatient = async () => {
  if (!patientForm.name)   { toast.warning('សូមបំពេញឈ្មោះ'); return }
  if (!patientForm.email)  { toast.warning('សូមបំពេញអ៊ីមែល'); return }
  if (!patientForm.password || patientForm.password.length < 6) {
    toast.warning('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ ខ្ទង់'); return
  }
  // keep patientError for inside the modal only
  setPatientError('')
  setSavingPatient(true)
  try {
    const res = await createPatient(patientForm)
    const newPatient = res.data ?? res
    setPatients((prev) => [newPatient, ...prev])
    setSelectedPatient(String(newPatient.id))
    setCreatedCreds({ name: patientForm.name, email: patientForm.email, password: patientForm.password })
    toast.success('បង្កើតគណនីអ្នកជំងឺដោយជោគជ័យ!')
  } catch (e) {
    setPatientError(e.response?.data?.message || 'មិនអាចបន្ថែមបានទេ')
  } finally {
    setSavingPatient(false)
  }
}
  const openAdd = () => {
    setPatientForm(emptyPatient())
    setPatientError('')
    setCreatedCreds(null)
    setShowPass(false)
    setAddOpen(true)
  }

const handleBook = async (e) => {
  e.preventDefault()
  if (!selectedPatient) { toast.warning('សូមជ្រើសរើសអ្នកជំងឺ'); return }
  if (!selectedDoctor)  { toast.warning('សូមជ្រើសរើសគ្រូពេទ្យ'); return }
  if (!appointmentTime) { toast.warning('សូមជ្រើសរើសម៉ោងពិនិត្យ'); return }

  setSubmitting(true)
  try {
    await createAppointment({
      patient_id:       Number(selectedPatient),
      doctor_id:        Number(selectedDoctor),
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status:           'confirmed',
      notes:            notes,
      reason:           notes || 'Walk-in ចូលពិនិត្យផ្ទាល់',
    })
    toast.success('បានកក់ការណាត់ជួបដោយជោគជ័យ!', { title: 'ជោគជ័យ' })
    setNotes('')
    setAppointmentTime('')
    setSelectedPatient('')
    setSelectedDoctor('')
  } catch (err) {
    toast.error(err.response?.data?.message || 'មានបញ្ហាក្នុងការរក្សាទុក', { title: 'មានបញ្ហា' })
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className="space-y-6 p-1">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ចុះឈ្មោះអ្នកជំងឺផ្ទាល់</h1>
        <p className="text-sm text-slate-500">កក់ការណាត់ជួបសម្រាប់អ្នកជំងឺដើរចូលមកផ្ទាល់ (Walk-In)</p>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center gap-2 py-20 text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1976D2] border-t-transparent" />
          <span>កំពុងផ្ទុកទិន្នន័យ...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">

          {/* MAIN FORM */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calendar size={18} className="text-[#1976D2]" /> ព័ត៌មានជំនួបពិនិត្យ
            </h2>

            <form onSubmit={handleBook} className="space-y-4">

              {/* PATIENT SELECT + ADD */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">ជ្រើសរើសអ្នកជំងឺ *</label>
                <div className="flex gap-2">
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1976D2]"
                  >
                    <option value="">-- ជ្រើសរើសអ្នកជំងឺ --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.phone || 'គ្មានលេខ'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={openAdd}
                    className="inline-flex h-[42px] items-center gap-1.5 rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-700 transition shrink-0"
                  >
                    <UserPlus size={14} /> ថែមអ្នកជំងឺថ្មី
                  </button>
                </div>
              </div>

              {/* DOCTOR SELECT */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">ជ្រើសរើសគ្រូពេទ្យ *</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1976D2]"
                >
                  <option value="">-- ជ្រើសរើសគ្រូពេទ្យ --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user?.name || d.name} ({d.specialization || 'ទូទៅ'})
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE + TIME */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">កាលបរិច្ឆេទ *</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">ម៉ោងពិនិត្យ *</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2]"
                  />
                </div>
              </div>

              {/* NOTES */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">រោគសញ្ញា / កំណត់សម្គាល់</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="បញ្ជាក់ពីអាការៈជំងឺ ឬចំណាំផ្សេងៗ..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#1976D2]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
                >
                  <Save size={16} />
                  {submitting ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកការណាត់ជួប'}
                </button>
              </div>
            </form>
          </div>

          {/* SIDEBAR INSTRUCTIONS */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 h-fit">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">របៀបចុះឈ្មោះ</h3>
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              {[
                'សួររកឈ្មោះ ឬលេខទូរស័ព្ទអ្នកជំងឺ ដើម្បីជ្រើសក្នុង dropdown។',
                'បើជាអ្នកជំងឺថ្មី សូមចុច «ថែមអ្នកជំងឺថ្មី» ដើម្បីបង្កើតគណនីភ្លាមៗ ហើយប្រព័ន្ធនឹងជ្រើសគាត់ស្វ័យប្រវត្តិ។',
                'ជ្រើសគ្រូពេទ្យ, ថ្ងៃ, ម៉ោង រួចចុចរក្សាទុក — គាត់នឹងចូលទៅជួររង់ចាំភ្លាមៗ។',
              ].map((text, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#1976D2]">{i + 1}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700">
              <strong>Walk-In</strong> — ការណាត់ជួបនឹងត្រូវបានកំណត់ជា <strong>«បានអនុម័ត»</strong> ភ្លាមៗ ដោយមិនបាច់ឆ្លងកាត់ការអនុម័តពីគ្រូពេទ្យទេ។
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ADD PATIENT MODAL ══════════ */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl my-4">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between rounded-t-3xl bg-[#0F172A] px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><UserPlus size={18} /></div>
                <div>
                  <h2 className="text-lg font-bold">បង្កើតគណនីអ្នកជំងឺ</h2>
                  <p className="text-xs text-slate-400">បន្ទាប់ពីបង្កើត ប្រព័ន្ធនឹងជ្រើសឈ្មោះស្វ័យប្រវត្តិ</p>
                </div>
              </div>
              <button onClick={() => setAddOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20">
                <X size={16} />
              </button>
            </div>

            {/* CREDENTIALS SUCCESS */}
            {createdCreds ? (
              <div className="p-6 space-y-4">
                <div className="rounded-2xl bg-emerald-500 p-5 text-white text-center">
                  <CheckCircle2 size={40} className="mx-auto mb-2" />
                  <h3 className="text-lg font-bold">បង្កើតគណនីជោគជ័យ!</h3>
                  <p className="text-sm text-emerald-100 mt-1">ឈ្មោះអ្នកជំងឺត្រូវបានជ្រើសរើសសម្រាប់កក់ម៉ោងរួចហើយ</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5 space-y-3 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">ព័ត៌មានចូលប្រព័ន្ធ</p>
                  <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                    <div><p className="text-xs text-slate-400">ឈ្មោះ</p><p className="font-semibold">{createdCreds.name}</p></div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                    <div><p className="text-xs text-slate-400">អ៊ីមែល</p><p className="font-semibold">{createdCreds.email}</p></div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3">
                    <div><p className="text-xs text-emerald-300">ពាក្យសម្ងាត់</p><p className="font-bold text-emerald-300 text-lg tracking-widest">{createdCreds.password}</p></div>
                  </div>
                </div>
                <button
                  onClick={() => { setCreatedCreds(null); setAddOpen(false) }}
                  className="w-full rounded-xl bg-[#1976D2] py-3 text-sm font-semibold text-white"
                >
                  រួចរាល់ — បន្តបំពេញម៉ោងកក់
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
                  {patientError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
                      <AlertCircle size={16} /><span className="text-sm">{patientError}</span>
                    </div>
                  )}

                  {/* ACCOUNT INFO */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1976D2]">ព័ត៌មានគណនី</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ឈ្មោះពេញ *</label>
                        <input value={patientForm.name} onChange={setField('name')} placeholder="ឧ. ហ៊ីង ចន្ទបុប្ផា" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">អ៊ីមែល *</label>
                        <input type="email" value={patientForm.email} onChange={setField('email')} placeholder="email@example.com" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">លេខទូរស័ព្ទ</label>
                        <input value={patientForm.phone} onChange={setField('phone')} placeholder="012 345 678" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ពាក្យសម្ងាត់ *</label>
                        <div className="relative">
                          <KeyRound size={14} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={patientForm.password}
                            onChange={setField('password')}
                            placeholder="យ៉ាងតិច ៦ ខ្ទង់"
                            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-8 text-sm outline-none focus:border-[#1976D2]"
                          />
                          <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-2.5 top-2.5 text-slate-400">
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PERSONAL INFO */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1976D2]">ព័ត៌មានផ្ទាល់ខ្លួន</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ថ្ងៃខែឆ្នាំកំណើត</label>
                        <input type="date" value={patientForm.date_of_birth} onChange={setField('date_of_birth')} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ភេទ</label>
                        <select value={patientForm.gender} onChange={setField('gender')} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]">
                          <option value="">-- ជ្រើសភេទ --</option>
                          <option value="male">ប្រុស</option>
                          <option value="female">ស្រី</option>
                          <option value="other">ផ្សេងៗ</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-600">អាសយដ្ឋាន</label>
                        <input value={patientForm.address} onChange={setField('address')} placeholder="ភូមិ សង្កាត់ ក្រុង..." className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                    </div>
                  </div>

                  {/* HEALTH INFO */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#1976D2]">ព័ត៌មានសុខភាព</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ក្រុមឈាម</label>
                        <select value={patientForm.blood_type} onChange={setField('blood_type')} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]">
                          <option value="">-- ក្រុមឈាម --</option>
                          {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ប្រតិកម្មថ្នាំ</label>
                        <input value={patientForm.allergies} onChange={setField('allergies')} placeholder="ឧ. Penicillin..." className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ទម្ងន់ (kg)</label>
                        <input type="number" value={patientForm.weight_kg} onChange={setField('weight_kg')} placeholder="ឧ. 60" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">កម្ពស់ (cm)</label>
                        <input type="number" value={patientForm.height} onChange={setField('height')} placeholder="ឧ. 165" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-600">ជំងឺរ៉ាំរ៉ៃ</label>
                        <input value={patientForm.chronic_disease} onChange={setField('chronic_disease')} placeholder="ឧ. ទឹកនោមផ្អែម, សម្ពាធឈាមខ្ពស់..." className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 rounded-b-3xl border-t border-slate-200 px-6 py-4">
                  <button onClick={() => setAddOpen(false)} className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    បោះបង់
                  </button>
                  <button onClick={handleAddPatient} disabled={savingPatient} className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-6 py-2 text-sm font-semibold text-white disabled:opacity-60">
                    <UserPlus size={15} />
                    {savingPatient ? 'កំពុងបង្កើត...' : 'បង្កើតគណនី'}
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