import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Clock3, Plus } from 'lucide-react'
import { fetchAppointments } from '../../services/appointmentService'
import { formatAppointmentDate, statusBadgeClass, statusLabel } from '../../utils/appointments'

function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  fetchAppointments()
  .then((data) => setAppointments(Array.isArray(data) ? data : data.data ?? []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(
    () => ({
      total: appointments.length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      rejected: appointments.filter((a) => ['rejected', 'cancelled'].includes(a.status)).length,
    }),
    [appointments]
  )

  const upcoming = useMemo(
    () => appointments.filter((a) => ['pending', 'approved', 'confirmed'].includes(a.status)),
    [appointments]
  )

  const history = useMemo(
    () => appointments.filter((a) => ['completed', 'rejected', 'cancelled'].includes(a.status)),
    [appointments]
  )

  return (
    <div className="space-y-5 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">ការណាត់ជួបរបស់ខ្ញុំ</h1>
          <p className="text-sm text-slate-500">ពិនិត្យ និងគ្រប់គ្រងការណាត់ជួបជាមួយវេជ្ជបណ្ឌិត</p>
        </div>
        <Link to="/patient/book" className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white shadow-sm">
          <Plus size={16} /> កក់ការណាត់ជួបថ្មី
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">សរុប</p><p className="text-3xl font-bold text-slate-900">{stats.total}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">បានបញ្ចប់</p><p className="text-3xl font-bold text-slate-900">{stats.completed}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">កំពុងរង់ចាំ</p><p className="text-3xl font-bold text-amber-600">{stats.pending}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">បានបដិសេធ</p><p className="text-3xl font-bold text-rose-600">{stats.rejected}</p></div>
      </div>

      {loading ? (
      <p className="mt-5 text-slate-500 text-sm">សូមរង់ចាំបន្តិច...</p>
      ) : (
        <>
          {/* UPCOMING */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">ការណាត់ជួបបច្ចុប្បន្ន</h3>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-500">មិនមានការណាត់ជួបសកម្មទេ — <Link to="/patient/book" className="text-[#1976D2] font-semibold">កក់ឥឡូវ</Link></p>
              ) : (
                upcoming.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xl font-semibold text-slate-900">{item.doctorName || item.doctor?.user?.name || 'វេជ្ជបណ្ឌិត'}</p>
                        <p className="text-sm text-slate-500">{item.department}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-8 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1"><CalendarDays size={14} />{formatAppointmentDate(item.appointment_date || item.date)}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 size={14} />{item.appointment_time || item.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* HISTORY */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-xl font-semibold text-slate-900">ប្រវត្តិការណាត់ជួបកន្លងមក</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">វេជ្ជបណ្ឌិត</th>
                    <th className="px-4 py-3">កាលបរិច្ឆេទ</th>
                    <th className="px-4 py-3">មូលហេតុ</th>
                    <th className="px-4 py-3">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">គ្មានប្រវត្តិការណាត់ជួបចាស់ៗឡើយ</td></tr>
                  ) : (
                    history.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-700">{row.doctorName || row.doctor?.user?.name}</td>
                        <td className="px-4 py-3 text-slate-600">{formatAppointmentDate(row.appointment_date || row.date)}</td>
                        <td className="px-4 py-3 text-slate-600">{row.reason || row.symptoms || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}>
                            {statusLabel(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MyAppointments