import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays, Clock3, Users, CheckCircle2, Search,
  UserPlus, Stethoscope, Receipt, RefreshCw, Circle
} from 'lucide-react'
import { fetchAppointments } from '../../services/appointmentService'
import { fetchDoctors } from '../../services/doctorService'
import { formatAppointmentDate, statusBadgeClass, statusLabel } from '../../utils/appointments'
import BillingModal from './BillingModal' 
import { fetchBills } from '../../services/billingService'
function StatCard({ icon: Icon, label, value, variant = 'primary' }) {
  const styles = {
    primary:   { bg: 'bg-gradient-to-br from-blue-600 to-[#1976D2]', text: 'text-white', labelText: 'text-blue-100', iconBg: 'bg-white/15', iconColor: 'text-white' },
    warning:   { bg: 'bg-white', text: 'text-amber-600', labelText: 'text-slate-500', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    info:      { bg: 'bg-white', text: 'text-[#1976D2]', labelText: 'text-slate-500', iconBg: 'bg-blue-50', iconColor: 'text-[#1976D2]' },
    success:   { bg: 'bg-white', text: 'text-emerald-600', labelText: 'text-slate-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  }

  const currentStyle = styles[variant] || styles.primary

  return (
    <div className={`rounded-2xl border ${variant === 'primary' ? 'border-blue-700' : 'border-slate-200'} ${currentStyle.bg} p-5 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${currentStyle.labelText}`}>{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${currentStyle.iconBg}`}>
          <Icon size={18} className={currentStyle.iconColor} />
        </div>
      </div>
      <p className={`mt-3 text-3xl font-bold ${currentStyle.text}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors]           = useState([])
  const [bills, setBills]               = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [date, setDate]                 = useState(new Date().toISOString().slice(0, 10))

  const [isBillingOpen, setIsBillingOpen] = useState(false)
  const [selectedAppt, setSelectedAppt]   = useState(null)
const load = useCallback(async () => {
    setLoading(true)
    try {
      // 🟢 ថែម fetchBills() ទៅក្នុង Promise.all
      const [apptRes, docRes, billRes] = await Promise.all([
        fetchAppointments(), 
        fetchDoctors(),
        fetchBills()
      ])
      
      setAppointments(Array.isArray(apptRes) ? apptRes : apptRes.data ?? [])
      
      // 🟢 រក្សាទុកទិន្នន័យ Bills ចូលក្នុង State
      setBills(Array.isArray(billRes) ? billRes : billRes.data ?? [])

      const docs = Array.isArray(docRes) ? docRes : docRes.data ?? []
      setDoctors(docs.map((d) => ({
        id: d.id,
        name: d.user?.name || d.name || 'វេជ្ជបណ្ឌិត',
        specialization: d.specialization || d.dept || '—',
        available: Number(d.is_active) === 1 || d.active === true,
      })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])


  useEffect(() => { load() }, [load])

  const handleOpenBilling = (appt) => {
    setSelectedAppt(appt)
    setIsBillingOpen(true)
  }

  const today = new Date().toISOString().slice(0, 10)

  const todayAppts = appointments.filter((a) => {
    const d = a.appointment_date || a.date || ''
    return d.slice(0, 10) === date
  })

  const filtered = todayAppts.filter((a) =>
    `${a.patientName || a.patient_name || ''} ${a.id}`.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total:     todayAppts.length,
    waiting:   todayAppts.filter((a) => a.status === 'confirmed' || a.status === 'approved').length,
    inConsult: todayAppts.filter((a) => a.status === 'in_progress').length,
    done:      todayAppts.filter((a) => a.status === 'completed').length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
  }

  const pendingPayments = appointments.filter((a) => {
    const isCompleted = a.status === 'completed'
    const hasBill = bills.some((b) => Number(b.appointment_id) === Number(a.id))
    

    return isCompleted && !hasBill
  }).slice(0, 5)
  return (
    <div className="space-y-5">

   
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ផ្ទាំងគ្រប់គ្រងបុគ្គលិកទទួលភ្ញៀវ</h1>
          <p className="text-sm text-slate-500">ស្ថានភាពការណាត់ជួប និងការគ្រប់គ្រងអ្នកជំងឺប្រចាំថ្ងៃ</p>
        </div>
        <div className="flex gap-2">
          <Link to="/receptionist/patients" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            <UserPlus size={16} className="text-slate-500" /> បន្ថែមអ្នកជំងឺ
          </Link>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition">
            <RefreshCw size={16} /> ផ្ទុកឡើងវិញ
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={CalendarDays} label="ការណាត់ជួបថ្ងៃនេះ"    value={stats.total}     variant="primary" />
        <StatCard icon={Users}        label="កំពុងរង់ចាំ"           value={stats.waiting}   variant="warning" />
        <StatCard icon={Stethoscope}  label="កំពុងពិនិត្យ"          value={stats.inConsult} variant="info"    />
        <StatCard icon={CheckCircle2} label="បានបញ្ចប់"             value={stats.done}      variant="success" />
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-5 xl:grid-cols-[1fr_310px]">

        {/* LEFT — QUEUE TABLE & PENDING PAYMENTS */}
        <div className="space-y-4">

          {/* SEARCH + DATE FILTER */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ស្វែងរកតាមឈ្មោះអ្នកជំងឺ..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none bg-white focus:border-[#1976D2] focus:ring-2 focus:ring-blue-500/10 transition"
              />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-[#1976D2] transition"
            />
          </div>

          {/* PENDING PAYMENTS */}
          {pendingPayments.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50/60 to-transparent border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                <h3 className="font-bold text-amber-700">រង់ចាំទូទាត់ប្រាក់</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">{pendingPayments.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {pendingPayments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/40 transition">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{a.patientName || a.patient_name}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{a.doctorName || a.doctor_name} · {a.appointment_time || a.time}</p>
                    </div>
               
                    <button
                      onClick={() => handleOpenBilling(a)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1976D2] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition"
                    >
                      <Receipt size={13} /> ទូទាត់ប្រាក់
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TABLE LIST */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-blue-50/50 to-transparent border-b border-slate-100 px-5 py-4">
              <h3 className="font-bold text-[#1976D2]">
                បញ្ជីអ្នកជំងឺ — {date === today ? 'ថ្ងៃនេះ' : formatAppointmentDate(date)}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">អ្នកជំងឺ</th>
                    <th className="px-5 py-3.5">វេជ្ជបណ្ឌិត</th>
                    <th className="px-5 py-3.5">ម៉ោង</th>
                    <th className="px-5 py-3.5">ស្ថានភាព</th>
                    <th className="px-5 py-3.5 text-right">សកម្មភាព</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400 font-medium">កំពុងផ្ទុក...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400 font-medium">មិនមានការណាត់ជួបនៅថ្ងៃនេះ</td></tr>
                  ) : filtered.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-[#1976D2] border border-blue-100">
                            {(a.patientName || 'P').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{a.patientName || '—'}</p>
                            <p className="text-xs font-medium text-slate-400">#{a.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">{a.doctorName || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock3 size={14} className="text-slate-400" />
                          {a.appointment_time || a.time || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(a.status)}`}>
                          {statusLabel(a.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 🟢 កែប្រែពី Link ទៅជាប៊ូតុងបើក Modal គិតលុយ */}
                          <button
                            onClick={() => handleOpenBilling(a)}
                            className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            គិតលុយ
                          </button>
                          <Link
                            to="/receptionist/all-appointments"
                            className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                          >
                            លម្អិត
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">

          {/* DOCTOR AVAILABILITY */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50/50 to-transparent border-b border-slate-100 px-5 py-4">
              <h3 className="font-bold text-slate-900">ស្ថានភាពវេជ្ជបណ្ឌិត</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {doctors.length === 0 ? (
                <p className="px-5 py-4 text-sm text-slate-400">មិនមានទ្និន្ន័យ</p>
              ) : doctors.slice(0, 8).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/40 transition">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-[#1976D2] border border-blue-100">
                    {doc.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">{doc.name}</p>
                    <p className="truncate text-xs font-medium text-slate-400 mt-0.5">{doc.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <Circle
                      size={6}
                      className={doc.available ? 'fill-emerald-500 text-emerald-500' : 'fill-rose-500 text-rose-500'}
                    />
                    <span className={`text-xs font-bold ${doc.available ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {doc.available ? 'ទំនេរ' : 'រវល់'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MINI CALENDAR */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-bold text-slate-900">ប្រតិទិន</h3>
            <MiniCalendar selectedDate={date} onSelect={setDate} appointments={appointments} />
          </div>

          {/* QUICK LINKS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-bold text-slate-900">ផ្លូវកាត់</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/receptionist/all-appointments', icon: CalendarDays, label: 'ការណាត់ជួប' },
                { to: '/receptionist/billing',          icon: Receipt,      label: 'វិក្កយបត្រ' },
                { to: '/receptionist/invoices',         icon: Receipt,      label: 'Invoice' },
                { to: '/receptionist/patients',         icon: Users,        label: 'អ្នកជំងឺ' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-[#1976D2] hover:border-blue-200 transition-all"
                >
                  <item.icon size={14} className="text-slate-400" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 ដាក់ BillingModal Component នៅទីនេះដើម្បីរង់ចាំទាញបើក Popup */}
      <BillingModal
        isOpen={isBillingOpen}
        onClose={() => {
          setIsBillingOpen(false)
          setSelectedAppt(null)
        }}
        appointment={selectedAppt}
        onSaveSuccess={load} // រក្សាទុកជោគជ័យ វានឹងដំណើរការ Function load() ដើម្បី Refresh ទិន្នន័យលើ Dashboard
      />
    </div>
  )
}

// ── MiniCalendar Helper Component ──
function MiniCalendar({ selectedDate, onSelect, appointments }) {
  const today = new Date()
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const apptDates = new Set(
    appointments.map((a) => (a.appointment_date || a.date || '').slice(0, 10))
  )

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const MONTHS = ['មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា','កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ']
  const DAYS   = ['អា','ច','អ','ព','ព្រ','សុ','ស']

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) } else setViewMonth((m) => m - 1) }
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) } else setViewMonth((m) => m + 1) }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
        <button onClick={prev} className="rounded-lg px-2 py-0.5 text-slate-500 hover:bg-white hover:shadow-xs font-bold transition">‹</button>
        <p className="text-xs font-bold text-slate-800">{MONTHS[viewMonth]} {viewYear}</p>
        <button onClick={next} className="rounded-lg px-2 py-0.5 text-slate-500 hover:bg-white hover:shadow-xs font-bold transition">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-xs font-bold text-slate-400">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isToday    = dateStr === new Date().toISOString().slice(0, 10)
          const isSelected = dateStr === selectedDate
          const hasAppt    = apptDates.has(dateStr)
          return (
            <button
              key={day}
              onClick={() => onSelect(dateStr)}
              className={`relative flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold transition ${
                isSelected
                  ? 'bg-[#1976D2] font-bold text-white shadow-sm'
                  : isToday
                    ? 'border border-[#1976D2] text-[#1976D2] bg-blue-50/50'
                    : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {day}
              {hasAppt && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-emerald-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}