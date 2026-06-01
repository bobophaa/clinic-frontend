import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Calendar, Download, TrendingUp, DollarSign, CalendarCheck } from 'lucide-react'
import { fetchBills } from '../../services/billingService'

export default function Reports() {
  // ── DYNAMIC STATES ──
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState('2026-01-01')
  const [toDate, setToDate] = useState('2026-12-31') 
  const [message, setMessage] = useState('')

  // ── FETCH REAL DATA FROM API ──
  const loadRealData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchBills()
      setBills(Array.isArray(res) ? res : res.data ?? [])
    } catch (e) {
      console.error('Failed to fetch billing reports:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRealData()
  }, [loadRealData])

  // ── FILTER DATA BY DATE ──
  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      if (!b.appointment_date) return false
      const billDate = b.appointment_date.split(' ')[0] // ករណីមានភ្ជាប់ម៉ោង YYYY-MM-DD
      return billDate >= fromDate && billDate <= toDate
    })
  }, [bills, fromDate, toDate])

  const { totals, chartData } = useMemo(() => {
    const monthsKhmer = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
    
    const monthlyMap = monthsKhmer.reduce((acc, month, index) => {
      acc[index + 1] = { month, appointments: 0, revenue: 0 }
      return acc
    }, {})

    let totalAppointments = 0
    let totalRevenue = 0

    filteredBills.forEach((b) => {
      totalAppointments += 1 
      
      const amount = parseFloat(b.total_amount) || 0
      if (b.payment_status === 'paid') {
        totalRevenue += amount
      }

      const dateObj = new Date(b.appointment_date)
      const monthKey = dateObj.getMonth() + 1

      if (monthlyMap[monthKey]) {
        monthlyMap[monthKey].appointments += 1
        if (b.payment_status === 'paid') {
          monthlyMap[monthKey].revenue += amount
        }
      }
    })

    const formattedChartData = Object.values(monthlyMap).filter(m => m.appointments > 0 || m.revenue > 0)

    return {
      totals: { appointments: totalAppointments, revenue: totalRevenue },
      chartData: formattedChartData.length > 0 ? formattedChartData : Object.values(monthlyMap).slice(0, 4) // បើអត់ទាន់មានទិន្នន័យ ឱ្យបង្ហាញ ៤ខែដំបូងសិន
    }
  }, [filteredBills])

  const handleExport = () => {
    setMessage('បាននាំចេញរបាយការណ៍ជោគជ័យ')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="space-y-6 p-1">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">របាយការណ៍ និងស្ថិតិ</h1>
          <p className="text-sm text-slate-500">វិភាគស្ថិតិនៃការណាត់ជួប និងប្រភពចំណូលផ្ទាល់ចេញពីប្រព័ន្ធ</p>
        </div>

        {/* DATE FILTERS & EXPORT BUTTON */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
              <input
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              />
              <span className="text-slate-300">|</span>
              <input
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Download size={16} />
            នាំចេញរបាយការណ៍
          </button>
        </div>
      </div>

      {/* TOAST MESSAGE */}
      {message && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {message}
        </div>
      )}

      {/* STATS CARDS SECTION */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">ការណាត់ជួបសរុប (តាមកាលបរិច្ឆេទរើស)</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {loading ? (
                  <span className="inline-block h-7 w-16 animate-pulse rounded bg-slate-200"></span>
                ) : (
                  `${totals.appointments.toLocaleString()} ដង`
                )}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-blue-50 border-blue-100 text-blue-600">
              <CalendarCheck size={22} />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">ចំណូលពិតប្រាកដសរុប (Paid)</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
                {loading ? (
                  <span className="inline-block h-7 w-24 animate-pulse rounded bg-slate-200"></span>
                ) : (
                  `$${totals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                )}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-emerald-50 border-emerald-100 text-emerald-600">
              <DollarSign size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CHART SECTION */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">ក្រាហ្វិកវិភាគលំហូរទិន្នន័យប្រចាំខែ (Real-time)</h2>
        </div>
        
        <div className="h-80 w-full">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
              កំពុងគណនាទិន្នន័យក្រាហ្វិក...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} axisLine={false} tickLine={false} />
                
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1E293B' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px', fontWeight: 600 }} />
                
                <Line yAxisId="left" type="monotone" name="ចំនួនការណាត់ជួប" dataKey="appointments" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" name="ចំណូលសរុប ($)" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}