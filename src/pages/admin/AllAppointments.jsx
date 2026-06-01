import { useCallback, useEffect, useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import AppointmentDetailModal from '../../components/AppointmentDetailModal'
import {
  approveAppointment,
  fetchAppointmentDetail,
  fetchAppointments,
  rejectAppointment,
} from '../../services/appointmentService'
import {
  formatAppointmentDate,
  statusBadgeClass,
  statusLabel,
} from '../../utils/appointments'

const STATUS_FILTER = {
  'គ្រប់ស្ថានភាព': null,
  'កំពុងរង់ចាំ': 'pending',
  'បានអនុម័ត': 'approved',
  'បានបដិសេធ': 'rejected',
}

function AllAppointments() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('គ្រប់ស្ថានភាព')
  const [actionId, setActionId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchAppointments()
      setData(Array.isArray(res) ? res : res.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const statusKey = STATUS_FILTER[status]
    return data.filter((row) => {
      const keywordOk = `${row.patientName} ${row.id}`.toLowerCase().includes(keyword.toLowerCase())
      const statusOk = !statusKey || row.status === statusKey || (statusKey === 'approved' && row.status === 'confirmed')
      return keywordOk && statusOk
    })
  }, [data, keyword, status])

  const openDetail = async (id) => {
    try {
   const res = await fetchAppointmentDetail(id)
setDetail(res.data ?? res)

      setDetailOpen(true)
    } catch {
      alert('មិនអាចផ្ទុកលម្អិតបាន')
    }
  }

 const handleApprove = async (id) => {
  setActionId(id)
  try {
    const res = await approveAppointment(id)
    const updated = res.data ?? res 
    setData((prev) => prev.map((r) => (r.id === id ? updated : r)))
    setDetailOpen(false)
  } finally {
    setActionId(null)
  }
}

const handleReject = async (id) => {
  setActionId(id)
  try {
    const res = await rejectAppointment(id)
    const updated = res.data ?? res 
    setData((prev) => prev.map((r) => (r.id === id ? updated : r)))
    setDetailOpen(false)
  } finally {
    setActionId(null)
  }
}

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_auto]">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="ស្វែងរកតាមឈ្មោះអ្នកជំងឺ..."
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            {Object.keys(STATUS_FILTER).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white">
            <Filter size={16} />
            ផ្ទុកឡើងវិញ
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">កំពុងផ្ទុក...</p>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">ឈ្មោះអ្នកជំងឺ</th>
                <th className="px-4 py-3">វេជ្ជបណ្ឌិត</th>
                <th className="px-4 py-3">កាលបរិច្ឆេទ</th>
                <th className="px-4 py-3">ពេល</th>
                <th className="px-4 py-3">ប្រភព</th>
                <th className="px-4 py-3">ស្ថានភាព</th>
                <th className="px-4 py-3 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{row.patientName || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{row.doctorName || '—'}</td>
                <td>{formatAppointmentDate(row.appointment_date)}</td>
<td>{row.appointment_time}</td>
                  <td className="px-4 py-3">{row.source === 'walk-in' ? 'មុខទទួល' : 'Online'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}>{statusLabel(row.status)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => openDetail(row.id)} className="rounded-lg bg-[#1976D2] px-3 py-1 text-xs font-semibold text-white">
                      មើលលម្អិត
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AppointmentDetailModal
        appointment={detail}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        canManage
        actionLoading={Boolean(actionId)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}

export default AllAppointments
