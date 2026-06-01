import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Plus, Trash2, Receipt, CheckCircle2, Clock3, Search
} from 'lucide-react'
import { fetchBills, createBill } from '../../services/billingService'
import { fetchAppointments } from '../../services/appointmentService'
import { formatAppointmentDate } from '../../utils/appointments'

const ITEM_TYPES = [
  { value: 'service',  label: 'សេវាកម្ម' },
  { value: 'medicine', label: 'ថ្នាំ' },
  { value: 'test',     label: 'ការវិភាគ/Lab' },
]

const TYPE_COLORS = {
  service:  'bg-blue-100 text-blue-700',
  medicine: 'bg-emerald-100 text-emerald-700',
  test:     'bg-purple-100 text-purple-700',
}

const PAYMENT_METHODS = [
  { id: 'cash',     label: 'សាច់ប្រាក់ 💵' },
  { id: 'card',     label: 'កាតធនាគារ 💳' },
  { id: 'transfer', label: 'ផ្ទេរប្រាក់ 📲' },
]

function emptyItem() {
  return { item_name: '', item_type: 'service', unit_price: '', quantity: 1 }
}

export default function Billing() {

  const [bills, setBills]         = useState([])
  const [loadingBills, setLoadingBills] = useState(true)
  const [search, setSearch]       = useState('')
  const [tab, setTab]             = useState('list') 

  const [appointments, setAppointments] = useState([])
  const [loadingAppts, setLoadingAppts] = useState(false)
  const [saving, setSaving]             = useState(false)
  const [saveError, setSaveError]       = useState('')
  const [saveSuccess, setSaveSuccess]   = useState(false)

  const [form, setForm] = useState({
    appointment_id:   '',
    consultation_fee: '',
    payment_method:   'cash',
    items: [emptyItem()],
  })


  const loadBills = useCallback(async () => {
    setLoadingBills(true)
    try {
      const res = await fetchBills()
      setBills(Array.isArray(res) ? res : res.data ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingBills(false)
    }
  }, [])

  useEffect(() => { loadBills() }, [loadBills])

  // ── LOAD CONFIRMED APPOINTMENTS (for create form) ──
  useEffect(() => {
    if (tab !== 'create') return
    setLoadingAppts(true)
    fetchAppointments()
      .then((res) => {
        const all = Array.isArray(res) ? res : res.data ?? []
        // Only show confirmed appointments that don't have a bill yet
        setAppointments(all.filter((a) => ['confirmed', 'approved'].includes(a.status)))
      })
      .catch(console.error)
      .finally(() => setLoadingAppts(false))
  }, [tab])

  // ── SELECTED APPOINTMENT ──
  const selectedAppt = useMemo(
    () => appointments.find((a) => String(a.id) === String(form.appointment_id)) || null,
    [appointments, form.appointment_id]
  )

  // ── TOTALS ──
  const itemsTotal = useMemo(
    () => form.items.reduce((sum, i) => sum + (parseFloat(i.unit_price) || 0) * (parseInt(i.quantity) || 0), 0),
    [form.items]
  )
  const grandTotal = (parseFloat(form.consultation_fee) || 0) + itemsTotal

  // ── ITEM HELPERS ──
  const updateItem = (index, field, value) => {
    setForm((p) => {
      const items = [...p.items]
      items[index] = { ...items[index], [field]: value }
      return { ...p, items }
    })
  }
  const addItem    = () => setForm((p) => ({ ...p, items: [...p.items, emptyItem()] }))
  const removeItem = (i) => setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))

  // ── SUBMIT ──
  const handleSubmit = async () => {
    if (!form.appointment_id) { setSaveError('សូមជ្រើសការណាត់ជួប'); return }
    if (!form.consultation_fee) { setSaveError('សូមបំពេញថ្លៃពិនិត្យ'); return }
    if (form.items.some((i) => !i.item_name || !i.unit_price)) {
      setSaveError('សូមបំពេញព័ត៌មានមុខទំនិញឱ្យគ្រប់')
      return
    }
    setSaveError('')
    setSaving(true)
    try {
      const res = await createBill({
        appointment_id:   Number(form.appointment_id),
        consultation_fee: parseFloat(form.consultation_fee),
        payment_method:   form.payment_method,
        items: form.items.map((i) => ({
          item_name:  i.item_name,
          item_type:  i.item_type,
          unit_price: parseFloat(i.unit_price),
          quantity:   parseInt(i.quantity),
        })),
      })
      const newBill = res.data ?? res
      setBills((prev) => [newBill, ...prev])
      setSaveSuccess(true)
      setForm({ appointment_id: '', consultation_fee: '', payment_method: 'cash', items: [emptyItem()] })
      setTimeout(() => { setSaveSuccess(false); setTab('list') }, 1800)
    } catch (e) {
      setSaveError(e.response?.data?.message || 'មិនអាចរក្សាទុកបានទេ')
    } finally {
      setSaving(false)
    }
  }

  // ── FILTERED BILLS ──
  const filtered = useMemo(
    () => bills.filter((b) =>
      `${b.patientName} ${b.id}`.toLowerCase().includes(search.toLowerCase())
    ),
    [bills, search]
  )

  const stats = useMemo(() => ({
    total: bills.length,
    paid:   bills.filter((b) => b.payment_status === 'paid').length,
    unpaid: bills.filter((b) => b.payment_status === 'unpaid').length,
    revenue: bills.filter((b) => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0),
  }), [bills])

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">គ្រប់គ្រងវិក្កយបត្រ</h1>
          <p className="text-sm text-slate-500">បង្កើត និងតាមដានការទូទាត់របស់អ្នកជំងឺ</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('list')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === 'list' ? 'bg-[#1976D2] text-white' : 'border border-slate-300 text-slate-600'}`}
          >
            វិក្កយបត្រទាំងអស់
          </button>
          <button
            onClick={() => { setTab('create'); setSaveError(''); setSaveSuccess(false) }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === 'create' ? 'bg-[#1976D2] text-white' : 'border border-slate-300 text-slate-600'}`}
          >
            <Plus size={16} /> បង្កើតថ្មី
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4"><p className="text-sm text-slate-500">វិក្កយបត្រសរុប</p><p className="text-3xl font-bold text-slate-900">{stats.total}</p></div>
        <div className="rounded-2xl border bg-white p-4"><p className="text-sm text-slate-500">បានទូទាត់</p><p className="text-3xl font-bold text-emerald-600">{stats.paid}</p></div>
        <div className="rounded-2xl border bg-white p-4"><p className="text-sm text-slate-500">មិនទាន់បង់</p><p className="text-3xl font-bold text-amber-600">{stats.unpaid}</p></div>
        <div className="rounded-2xl border bg-white p-4"><p className="text-sm text-slate-500">ចំណូលសរុប</p><p className="text-3xl font-bold text-[#1976D2]">${stats.revenue.toFixed(2)}</p></div>
      </div>

      {/* ══════════ LIST TAB ══════════ */}
      {tab === 'list' && (
        <>
          <div className="rounded-2xl border bg-white p-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ស្វែងរកតាមឈ្មោះអ្នកជំងឺ..."
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#1976D2]"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">អ្នកជំងឺ</th>
                  <th className="px-4 py-3">វេជ្ជបណ្ឌិត</th>
                  <th className="px-4 py-3">កាលបរិច្ឆេទ</th>
                  <th className="px-4 py-3">សរុប</th>
                  <th className="px-4 py-3">វិធីទូទាត់</th>
                  <th className="px-4 py-3">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody>
                {loadingBills ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">កំពុងផ្ទុក...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">មិនមានវិក្កយបត្រ</td></tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-500">#{b.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{b.patientName}</td>
                      <td className="px-4 py-3 text-slate-600">{b.doctorName}</td>
                      <td className="px-4 py-3">{formatAppointmentDate(b.appointment_date)}</td>
                      <td className="px-4 py-3 font-bold text-[#1976D2]">${b.total_amount?.toFixed(2)}</td>
                      <td className="px-4 py-3 capitalize text-slate-600">{b.payment_method || '—'}</td>
                      <td className="px-4 py-3">
                        {b.payment_status === 'paid'
                          ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={12} />បានទូទាត់</span>
                          : <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"><Clock3 size={12} />មិនទាន់បង់</span>
                        }
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'create' && (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-5">

            {/* SUCCESS */}
            {saveSuccess && (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
                <CheckCircle2 size={20} />
                <p className="font-semibold">វិក្កយបត្រត្រូវបានរក្សាទុកដោយជោគជ័យ!</p>
              </div>
            )}

            {saveError && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{saveError}</div>
            )}

            {/* SELECT APPOINTMENT */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-bold text-slate-900">ជ្រើសរើសការណាត់ជួប</h2>
              {loadingAppts ? (
                <p className="text-sm text-slate-400">កំពុងផ្ទុក...</p>
              ) : appointments.length === 0 ? (
                <p className="text-sm text-slate-400">មិនមានការណាត់ជួបដែលបានអនុម័តទេ</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {appointments.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setForm((p) => ({ ...p, appointment_id: String(a.id) }))}
                      className={`rounded-2xl border p-4 text-left transition ${String(form.appointment_id) === String(a.id) ? 'border-[#1976D2] bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <p className="font-bold text-slate-900">{a.patientName}</p>
                      <p className="text-xs text-slate-500">{a.doctorName} · {formatAppointmentDate(a.appointment_date)}</p>
                      <p className="text-xs text-slate-400">{a.appointment_time}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CONSULTATION FEE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-bold text-slate-900">ថ្លៃពិនិត្យ</h2>
              <input
                type="number"
                value={form.consultation_fee}
                onChange={(e) => setForm((p) => ({ ...p, consultation_fee: e.target.value }))}
                placeholder="ថ្លៃពិនិត្យ (USD)"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1976D2]"
              />
            </div>

            {/* ITEMS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">មុខទំនិញ / សេវាកម្ម</h2>
                <button onClick={addItem} className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1976D2]">
                  <Plus size={14} /> បន្ថែម
                </button>
              </div>
              <div className="space-y-3">
                {form.items.map((item, i) => (
                  <div key={i} className="grid gap-2 rounded-xl border border-slate-200 p-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                    <input
                      value={item.item_name}
                      onChange={(e) => updateItem(i, 'item_name', e.target.value)}
                      placeholder="ឈ្មោះមុខទំនិញ/សេវា"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                    />
                    <select
                      value={item.item_type}
                      onChange={(e) => updateItem(i, 'item_type', e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                    >
                      {ITEM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItem(i, 'unit_price', e.target.value)}
                      placeholder="តម្លៃ $"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                      placeholder="ចំនួន"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976D2]"
                    />
                    <button onClick={() => removeItem(i)} className="flex h-10 w-10 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-50">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-bold text-slate-900">វិធីទូទាត់</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setForm((p) => ({ ...p, payment_method: m.id }))}
                    className={`rounded-xl border p-4 text-sm font-semibold transition ${form.payment_method === m.id ? 'border-[#1976D2] bg-blue-50 text-[#1976D2]' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR SUMMARY */}
          <aside className="space-y-4">
            {selectedAppt && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">ព័ត៌មានការណាត់ជួប</p>
                <p className="font-bold text-slate-900">{selectedAppt.patientName}</p>
                <p className="text-sm text-slate-500">{selectedAppt.doctorName}</p>
                <p className="mt-1 text-sm text-slate-500">{formatAppointmentDate(selectedAppt.appointment_date)} · {selectedAppt.appointment_time}</p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">សេចក្ដីសង្ខេប</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">ថ្លៃពិនិត្យ</span>
                  <span>${(parseFloat(form.consultation_fee) || 0).toFixed(2)}</span>
                </div>
                {form.items.map((item, i) => item.item_name && (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-500 truncate max-w-[160px]">{item.item_name} ×{item.quantity}</span>
                    <span>${((parseFloat(item.unit_price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-xl font-bold text-[#1976D2]">
                  <span>សរុបត្រូវបង់</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600 disabled:opacity-60"
              >
                <Receipt size={16} />
                {saving ? 'កំពុងរក្សាទុក...' : 'បញ្ជាក់វិក្កយបត្រ'}
              </button>
            </div>

            <div className="rounded-2xl bg-[#1976D2] p-5 text-white">
              <h4 className="font-semibold">គន្លឹះ KHQR / ABA</h4>
              <p className="mt-2 text-sm text-blue-100">សម្រាប់ការទូទាត់តាម QR Code សូមពិនិត្យលេខគណនី ABA ឬ ACLEDA ឲ្យបានត្រឹមត្រូវ</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}