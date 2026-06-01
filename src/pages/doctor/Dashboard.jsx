import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { fetchDashboardStats } from '../../services/dashboardService'
import {
  formatAppointmentDate,
  statusBadgeClass,
  statusLabel,
} from '../../utils/appointments'
import { useAuth } from '../../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDashboardStats().then(setData).catch(console.error)
  }, [])

  const stats = data?.stats
  const today = data?.todayAppointments || []

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-7 text-white">
        <h2 className="text-3xl font-bold">សួស្តី, {user?.name || 'វេជ្ជបណ្ឌិត'}!</h2>
        <p className="mt-2 text-blue-100">
          ថ្ងៃនេះមានការណាត់ជួប {today.length} — រង់ចាំអនុម័ត {stats?.appointmentsPending ?? 0}
        </p>
        <Link to="/doctor/appointments" className="mt-6 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#1565C0]">
          គ្រប់គ្រងការណាត់ជួប →
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4"><p className="text-sm text-slate-500">សរុប</p><p className="text-3xl font-bold">{stats?.appointmentsTotal ?? 0}</p></div>
        <div className="rounded-2xl border bg-white p-4"><p className="text-sm text-slate-500">រង់ចាំ</p><p className="text-3xl font-bold text-amber-600">{stats?.appointmentsPending ?? 0}</p></div>
        <div className="rounded-2xl border bg-white p-4"><p className="text-sm text-slate-500">បានអនុម័ត</p><p className="text-3xl font-bold text-emerald-600">{stats?.appointmentsApproved ?? 0}</p></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Activity size={18} /> ការណាត់ជួបថ្ងៃនេះ</h3>
        {today.length === 0 ? (
          <p className="text-sm text-slate-500">គ្មានការណាត់ជួបថ្ងៃនេះ</p>
        ) : (
          <div className="space-y-3">
            {today.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="font-semibold text-slate-800">{row.patientName}</p>
                  <p className="text-xs text-slate-500">{formatAppointmentDate(row.date)} • {row.time}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}>{statusLabel(row.status)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
