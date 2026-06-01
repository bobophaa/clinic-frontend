import { useCallback, useEffect, useState } from 'react'
import { ClipboardPenLine, Plus, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { fetchAppointments } from '../../services/appointmentService'
import { createMedicalRecord, fetchMedicalRecords, storePrescriptions } from '../../services/medicalRecordService'
import { formatAppointmentDate } from '../../utils/appointments'

function emptyRx() {
  return { medicine_name: '', dosage: '', frequency: '', duration_days: '', instructions: '' }
}

export default function MedicalRecords() {
  // ── LIST ──
  const [records, setRecords]   = useState([])
  const [loading, setLoading]   = useState(true)

  const [appointments, setAppointments] = useState([])
  const [loadingAppts, setLoadingAppts] = useState(false)

  // ── MODAL ──
  const [isOpen, setIsOpen]         = useState(false)
  const [mode, setMode]             = useState('create') 
  const [selectedAppt, setSelectedAppt] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)

  // ── FORM ──
  const [symptoms,  setSymptoms]  = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes,     setNotes]     = useState('')
  const [rxRows,    setRxRows]    = useState([emptyRx()])

  // ── SAVE STATE ──
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // ── LOAD RECORDS ──
  const loadRecords = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchMedicalRecords()
      setRecords(Array.isArray(res) ? res : res.data ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadRecords() }, [loadRecords])

  // ── LOAD CONFIRMED APPOINTMENTS ──
  const loadAppointments = useCallback(async () => {
    setLoadingAppts(true)
    try {
      const res = await fetchAppointments()
      const all = Array.isArray(res) ? res : res.data ?? []
      // Only confirmed appointments that don't have a record yet
      const recordedApptIds = new Set(records.map((r) => r.appointment_id))
      setAppointments(
        all.filter((a) =>
          ['confirmed', 'approved'].includes(a.status) &&
          !recordedApptIds.has(a.id)
        )
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingAppts(false)
    }
  }, [records])

  // ── OPEN CREATE MODAL ──
  const openCreate = () => {
    setMode('create')
    setSelectedAppt(null)
    setSelectedRecord(null)
    setSymptoms('')
    setDiagnosis('')
    setNotes('')
    setRxRows([emptyRx()])
    setSaveError('')
    setSaveSuccess(false)
    loadAppointments()
    setIsOpen(true)
  }

  // ── OPEN VIEW MODAL ──
  const openView = (record) => {
    setMode('view')
    setSelectedRecord(record)
    setSymptoms(record.symptoms ?? '')
    setDiagnosis(record.diagnosis ?? '')
    setNotes(record.notes ?? '')
    setRxRows(
      record.prescriptions?.length > 0
        ? record.prescriptions.map((p) => ({
            medicine_name: p.medicine_name,
            dosage:        p.dosage ?? '',
            frequency:     p.frequency ?? '',
            duration_days: p.duration_days ?? '',
            instructions:  p.instructions ?? '',
          }))
        : [emptyRx()]
    )
    setSaveError('')
    setSaveSuccess(false)
    setIsOpen(true)
  }

  // ── UPDATE PRESCRIPTION ROW ──
  const updateRx = (index, field, value) =>
    setRxRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)))

  const addRx    = () => setRxRows((p) => [...p, emptyRx()])
  const removeRx = (i) => setRxRows((p) => p.filter((_, idx) => idx !== i))

  // ── SAVE ──
  const handleSave = async () => {
    if (mode === 'create' && !selectedAppt) {
      setSaveError('សូមជ្រើសការណាត់ជួប')
      return
    }
    if (!diagnosis) {
      setSaveError('សូមបំពេញការវិនិច្ឆ័យ')
      return
    }
    if (rxRows.some((r) => !r.medicine_name)) {
      setSaveError('សូមបំពេញឈ្មោះថ្នាំទាំងអស់')
      return
    }

    setSaveError('')
    setSaving(true)

    try {
      let record

      if (mode === 'create') {
        // 1. Create medical record
        const res = await createMedicalRecord({
          appointment_id: selectedAppt.id,
          patient_id:     selectedAppt.patientId,
          doctor_id:      selectedAppt.doctorId,
          diagnosis,
          symptoms,
          notes,
        })
        record = res.data ?? res
      } else {
        record = selectedRecord
      }

      // 2. Save prescriptions
      const validRx = rxRows.filter((r) => r.medicine_name)
      if (validRx.length > 0) {
        const rxRes = await storePrescriptions(record.id, validRx)
        record = rxRes.data ?? rxRes
      }

      // 3. Update list
      if (mode === 'create') {
        setRecords((prev) => [record, ...prev])
      } else {
        setRecords((prev) => prev.map((r) => (r.id === record.id ? record : r)))
      }

      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        setIsOpen(false)
      }, 1500)
    } catch (e) {
      setSaveError(e.response?.data?.message || 'មិនអាចរក្សាទុកបានទេ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">កំណត់ត្រាវេជ្ជសាស្ត្រ</h1>
          <p className="text-sm text-slate-500">កត់ត្រារោគសញ្ញា វិនិច្ឆ័យ និងវេជ្ជបញ្ជារបស់អ្នកជំងឺ</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          <Plus size={16} /> បង្កើតកំណត់ត្រាថ្មី
        </button>
      </div>

      {/* RECORDS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">អ្នកជំងឺ</th>
              <th className="px-4 py-3">រោគវិនិច្ឆ័យ</th>
              <th className="px-4 py-3">រោគសញ្ញា</th>
              <th className="px-4 py-3">ថ្នាំ</th>
              <th className="px-4 py-3">កាលបរិច្ឆេទ</th>
              <th className="px-4 py-3 text-right">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">កំពុងផ្ទុក...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">មិនមានកំណត់ត្រានៅឡើយ</td></tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-500">#{record.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{record.patientName}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate">{record.diagnosis}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{record.symptoms || '—'}</td>
                  <td className="px-4 py-3">
                    {record.prescriptions?.length > 0 ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        {record.prescriptions.length} មុខ
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatAppointmentDate(record.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openView(record)}
                      className="rounded-lg bg-[#1976D2] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      មើល/កែប្រែ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 overflow-y-auto">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl my-4">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between rounded-t-2xl bg-[#0F172A] px-6 py-4 text-white">
              <h2 className="inline-flex items-center gap-2 text-lg font-semibold">
                <ClipboardPenLine size={20} />
                {mode === 'create' ? 'បង្កើតកំណត់ត្រាវេជ្ជសាស្ត្រថ្មី' : `កំណត់ត្រា — ${selectedRecord?.patientName}`}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">

              {/* SUCCESS */}
              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-700">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold text-sm">រក្សាទុកដោយជោគជ័យ!</span>
                </div>
              )}

              {/* ERROR */}
              {saveError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-red-600">
                  <AlertCircle size={18} />
                  <span className="text-sm">{saveError}</span>
                </div>
              )}

              {/* SELECT APPOINTMENT (create mode only) */}
              {mode === 'create' && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">ជ្រើសការណាត់ជួប (បានអនុម័ត)</p>
                  {loadingAppts ? (
                    <p className="text-sm text-slate-400">កំពុងផ្ទុក...</p>
                  ) : appointments.length === 0 ? (
                    <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                      មិនមានការណាត់ជួបដែលបានអនុម័តទេ — គ្រូពេទ្យត្រូវអនុម័តសិន
                    </p>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {appointments.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setSelectedAppt(a)}
                          className={`rounded-xl border p-3 text-left text-sm transition ${
                            selectedAppt?.id === a.id
                              ? 'border-[#1976D2] bg-blue-50'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <p className="font-bold text-slate-900">{a.patientName}</p>
                          <p className="text-xs text-slate-500">{formatAppointmentDate(a.appointment_date)} · {a.appointment_time}</p>
                          {a.reason && <p className="mt-1 text-xs text-slate-400 truncate">{a.reason}</p>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PATIENT REASON (from booking) */}
              {mode === 'create' && selectedAppt?.reason && (
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">មូលហេតុដែលអ្នកជំងឺបានកក់</p>
                  <p className="text-sm text-blue-800">{selectedAppt.reason}</p>
                </div>
              )}

              {/* SYMPTOMS + DIAGNOSIS */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">រោគសញ្ញា (Symptoms)</label>
                  <textarea
                    rows={4}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                    placeholder="បញ្ចូលរោគសញ្ញា..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">ការវិនិច្ឆ័យ (Diagnosis) *</label>
                  <textarea
                    rows={4}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                    placeholder="ការវិនិច្ឆ័យ..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">កំណត់សម្គាល់ (Notes)</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                  placeholder="ការណែនាំបន្ថែម..."
                />
              </div>

              {/* PRESCRIPTIONS */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#1976D2]">វេជ្ជបញ្ជា (Prescription)</h3>
                  <button
                    onClick={addRx}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1976D2]"
                  >
                    <Plus size={13} /> បន្ថែមថ្នាំ
                  </button>
                </div>

                {/* TABLE HEADER */}
                <div className="mb-2 hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_2fr_auto] gap-2 text-xs font-semibold text-slate-500 px-1">
                  <span>ឈ្មោះថ្នាំ</span>
                  <span>កម្លាំង</span>
                  <span>ប្រេកង់</span>
                  <span>រយៈពេល</span>
                  <span>ការណែនាំ</span>
                  <span></span>
                </div>

                <div className="space-y-2">
                  {rxRows.map((row, idx) => (
                    <div key={idx} className="grid gap-2 md:grid-cols-[2fr_1fr_1fr_1fr_2fr_auto]">
                      <input
                        value={row.medicine_name}
                        onChange={(e) => updateRx(idx, 'medicine_name', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                        placeholder="ថ្នាំ *"
                      />
                      <input
                        value={row.dosage}
                        onChange={(e) => updateRx(idx, 'dosage', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                        placeholder="500mg"
                      />
                      <input
                        value={row.frequency}
                        onChange={(e) => updateRx(idx, 'frequency', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                        placeholder="២ដង/ថ្ងៃ"
                      />
                      <input
                        value={row.duration_days}
                        onChange={(e) => updateRx(idx, 'duration_days', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                        placeholder="៥ថ្ងៃ"
                      />
                      <input
                        value={row.instructions}
                        onChange={(e) => updateRx(idx, 'instructions', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                        placeholder="លេបបន្ទាប់ពីអាហារ..."
                      />
                      <button
                        onClick={() => removeRx(idx)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-slate-200 px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                បោះបង់
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-[#1976D2] px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}