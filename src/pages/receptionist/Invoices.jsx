import { useCallback, useEffect, useState } from 'react'
import { Eye, Printer, X, Search, CheckCircle2, Clock3 } from 'lucide-react'
import { fetchBills } from '../../services/billingService'
import { formatAppointmentDate } from '../../utils/appointments'

const METHOD_LABEL = { cash: 'សាច់ប្រាក់', card: 'កាតធនាគារ', transfer: 'ផ្ទេរប្រាក់' }
const TYPE_LABEL   = { service: 'សេវាកម្ម', medicine: 'ថ្នាំ', test: 'Lab/វិភាគ' }
const TYPE_COLOR   = {
  service:  'bg-blue-100 text-blue-700',
  medicine: 'bg-emerald-100 text-emerald-700',
  test:     'bg-purple-100 text-purple-700',
}

function InvoiceModal({ bill, onClose }) {
  if (!bill) return null

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-print-area').innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Invoice #${bill.id}</title>
      <style>
        body { font-family: sans-serif; padding: 32px; color: #1e293b; }
        h1 { color: #1976D2; } table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #f8fafc; padding: 8px 12px; text-align: left; font-size: 12px; color: #64748b; }
        td { padding: 8px 12px; border-top: 1px solid #e2e8f0; font-size: 13px; }
        .total { font-size: 18px; font-weight: bold; color: #1976D2; }
        .badge { display:inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .paid { background: #d1fae5; color: #065f46; }
        .unpaid { background: #fef3c7; color: #92400e; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
        .label { font-size: 12px; color: #64748b; }
        .value { font-size: 15px; font-weight: 600; }
        @media print { button { display: none; } }
      </style></head>
      <body>${printContent}</body></html>
    `)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  const itemsTotal = (bill.items ?? []).reduce((s, i) => s + i.subtotal, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-xl font-bold text-slate-900">វិក្កយបត្រ #{bill.id}</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* PRINTABLE AREA */}
        <div id="invoice-print-area" className="space-y-5 px-6 py-6">
          {/* CLINIC + INVOICE ID */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#1976D2]">ClinicSync</h1>
              <p className="text-sm text-slate-500">គ្លីនិក ភ្នំពេញ, កម្ពុជា</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">វិក្កយបត្រ</p>
              <p className="text-2xl font-bold text-slate-800">#{String(bill.id).padStart(4, '0')}</p>
              <p className="text-sm text-slate-500">{formatAppointmentDate(bill.appointment_date)}</p>
              <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${bill.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {bill.payment_status === 'paid' ? 'បានទូទាត់' : 'មិនទាន់បង់'}
              </span>
            </div>
          </div>

          {/* PATIENT + DOCTOR INFO */}
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">អ្នកជំងឺ</p>
              <p className="text-lg font-bold text-slate-900">{bill.patientName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">វេជ្ជបណ្ឌិត</p>
              <p className="text-lg font-bold text-slate-900">{bill.doctorName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">ម៉ោងណាត់ជួប</p>
              <p className="font-semibold text-slate-700">{formatAppointmentDate(bill.appointment_date)} · {bill.appointment_time}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">វិធីទូទាត់</p>
              <p className="font-semibold text-slate-700">{METHOD_LABEL[bill.payment_method] ?? bill.payment_method ?? '—'}</p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">មុខទំនិញ / សេវា</th>
                  <th className="px-4 py-3">ប្រភេទ</th>
                  <th className="px-4 py-3">ចំនួន</th>
                  <th className="px-4 py-3">តម្លៃ</th>
                  <th className="px-4 py-3 text-right">សរុប</th>
                </tr>
              </thead>
              <tbody>
                {/* Consultation fee row */}
                <tr className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">ថ្លៃពិនិត្យវេជ្ជបណ្ឌិត</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">សេវាកម្ម</span></td>
                  <td className="px-4 py-3">1</td>
                  <td className="px-4 py-3">${bill.consultation_fee?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${bill.consultation_fee?.toFixed(2)}</td>
                </tr>
                {/* Extra items */}
                {(bill.items ?? []).map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{item.item_name}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLOR[item.item_type] ?? 'bg-slate-100 text-slate-600'}`}>
                        {TYPE_LABEL[item.item_type] ?? item.item_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">${item.unit_price?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${item.subtotal?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">ថ្លៃពិនិត្យ</span>
              <span>${bill.consultation_fee?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">សេវា/ថ្នាំ/Lab</span>
              <span>${itemsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-xl font-bold text-[#1976D2]">
              <span>សរុបត្រូវបង់</span>
              <span>${bill.total_amount?.toFixed(2)}</span>
            </div>
          </div>

          {/* PAID STAMP */}
          {bill.payment_status === 'paid' && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-300 bg-emerald-50 py-3 text-emerald-700">
              <CheckCircle2 size={20} />
              <span className="font-bold">បានទូទាត់រួចរាល់</span>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            បិទ
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Printer size={16} />
            បោះពុម្ព
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Invoices() {
  const [bills, setBills]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchBills()
      setBills(Array.isArray(res) ? res : res.data ?? [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = bills.filter((b) => {
    const matchSearch = `${b.patientName} ${b.id}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || b.payment_status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = bills.filter((b) => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0)

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">បញ្ជីវិក្កយបត្រ</h1>
          <p className="text-sm text-slate-500">ពិនិត្យ និងបោះពុម្ពវិក្កយបត្របានឆាប់រហ័ស</p>
        </div>
        <button onClick={load} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          ផ្ទុកឡើងវិញ
        </button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-slate-500">វិក្កយបត្រសរុប</p>
          <p className="text-3xl font-bold text-slate-900">{bills.length}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-slate-500">បានទូទាត់</p>
          <p className="text-3xl font-bold text-emerald-600">{bills.filter((b) => b.payment_status === 'paid').length}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-sm text-slate-500">ចំណូលសរុប</p>
          <p className="text-3xl font-bold text-[#1976D2]">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 rounded-2xl border bg-white p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកអ្នកជំងឺ..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#1976D2]"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all',    label: 'ទាំងអស់' },
            { key: 'paid',   label: 'បានទូទាត់' },
            { key: 'unpaid', label: 'មិនទាន់បង់' },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${statusFilter === s.key ? 'bg-[#1976D2] text-white' : 'border border-slate-300 text-slate-600'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">អ្នកជំងឺ</th>
              <th className="px-4 py-3">វេជ្ជបណ្ឌិត</th>
              <th className="px-4 py-3">កាលបរិច្ឆេទ</th>
              <th className="px-4 py-3">វិធីទូទាត់</th>
              <th className="px-4 py-3">សរុប</th>
              <th className="px-4 py-3">ស្ថានភាព</th>
              <th className="px-4 py-3 text-right">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">កំពុងផ្ទុក...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">មិនមានវិក្កយបត្រ</td></tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-500">#{String(b.id).padStart(4, '0')}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{b.patientName}</td>
                  <td className="px-4 py-3 text-slate-600">{b.doctorName}</td>
                  <td className="px-4 py-3 text-slate-600">{formatAppointmentDate(b.appointment_date)}</td>
                  <td className="px-4 py-3 text-slate-600">{METHOD_LABEL[b.payment_method] ?? '—'}</td>
                  <td className="px-4 py-3 font-bold text-[#1976D2]">${b.total_amount?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {b.payment_status === 'paid'
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={12} />បានទូទាត់</span>
                      : <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"><Clock3 size={12} />មិនទាន់បង់</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(b)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[#1976D2] hover:bg-blue-50"
                    >
                      <Eye size={13} /> មើល/បោះពុម្ព
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <InvoiceModal bill={selected} onClose={() => setSelected(null)} />
    </div>
  )
}