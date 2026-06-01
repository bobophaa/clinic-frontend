import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck2, CalendarClock, Clock, Users, Search, Filter, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react'
import { fetchDashboardStats } from '../../services/dashboardService'
import { fetchBills } from '../../services/billingService' 
import {
  formatAppointmentDate,
  patientInitials,
  statusBadgeClass,
  statusLabel,
} from '../../utils/appointments'

function Dashboard() {
  const [data, setData] = useState(null)
  const [bills, setBills] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 4

  useEffect(() => {
  
    Promise.all([fetchDashboardStats(), fetchBills()])
      .then(([statsRes, billsRes]) => {
        setData(statsRes)
        setBills(Array.isArray(billsRes) ? billsRes : billsRes.data ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats
  const recent = data?.recentAppointments || []

  const realRevenue = useMemo(() => {
    return bills
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)
  }, [bills])


  const statCards = [
    { title: 'អ្នកជំងឺសរុប', value: stats?.patientsTotal ?? '—', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { title: 'វេជ្ជបណ្ឌិតសកម្ម', value: stats?.doctorsTotal ?? '—', icon: CalendarCheck2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { title: 'ការណាត់ជួបសរុប', value: stats?.appointmentsTotal ?? '—', icon: CalendarClock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { title: 'កំពុងរង់ចាំ', value: stats?.appointmentsPending ?? '—', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { title: 'ចំណូលសរុប', value: `$${realRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
  ]

  const filteredAppointments = useMemo(() => {
    return recent.filter((row) => {
      const matchesSearch = 
        row.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        row.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [recent, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)

  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAppointments.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAppointments, currentPage])

  const renderDate = (row) => {
    const formatted = formatAppointmentDate(row.date || row.appointment_date);
    return formatted && formatted !== '—' ? formatted : (row.date || row.appointment_date || '—');
  }

  return (
    <div className="space-y-6 p-1">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">ផ្ទាំងគ្រប់គ្រង</h1>
          <p className="text-sm text-slate-500">ស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងគ្លីនិក ClinicSync</p>
        </div>
        <Link to="/admin/appointments" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all">
          + បង្កើតការណាត់ជួប
        </Link>
      </div>

      {/* STATS CARDS SECTION (Updated grid columns to handle 5 cards cleanly) */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {statCards.map((item) => (
          <div key={item.title} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.title}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 truncate max-w-[140px]">
                  {loading ? <span className="inline-block h-6 w-12 animate-pulse rounded bg-slate-200"></span> : item.value}
                </p>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${item.bg} transition-transform group-hover:scale-110`}>
                <item.icon size={22} className={item.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">ការណាត់ជួបថ្មីៗ</h2>
            {/* <p className="text-xs text-slate-400">តារាងបង្ហាញទិន្នន័យចុងក្រោយដែលបានទាញយក</p> */}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ស្វែងរកឈ្មោះអ្នកជំងឺ..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
            
            <div className="relative flex items-center">
              <Filter className="absolute left-2.5 h-3.5 w-3.5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">ស្ថានភាពទាំងអស់</option>
                <option value="pending">កំពុងរង់ចាំ</option>
                <option value="completed">បានបញ្ចប់</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">ឈ្មោះអ្នកជំងឺ</th>
                <th className="px-5 py-3.5">វេជ្ជបណ្ឌិត</th>
                <th className="px-5 py-3.5">កាលបរិច្ឆេទ</th>
                <th className="px-5 py-3.5">ពេលវេលា</th>
                <th className="px-5 py-3.5">ស្ថានភាព</th>
                {/* <th className="px-5 py-3.5 text-right">សកម្មភាព</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                      <span>កំពុងទាញយកទិន្នន័យ...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center font-medium text-slate-400">
                    មិនមានទិន្នន័យការណាត់ជួបឡើយ។
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        {/* <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600 text-xs shadow-sm border border-blue-100">
                          {patientInitials(row.patientName)}
                        </span> */}
                        <span>{row.patientName || '—'}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">{row.doctorName || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-700">
                      {renderDate(row)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                      {row.time || row.appointment_time || '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold border ${statusBadgeClass(row.status)}`}>
                        {statusLabel(row.status)}
                      </span>
                    </td>
                    {/* <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <Link to={`/admin/appointments/${row.id}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        ពិនិត្យ
                      </Link>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL (The Ultimate Clean Style - text removed & centered buttons) */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center border-t border-slate-200 bg-white px-5 py-3.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index + 1)}
                  className={`h-8 w-8 rounded-xl text-xs font-bold transition-all ${
                    currentPage === index + 1 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard