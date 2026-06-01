import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Clock3 } from "lucide-react";
import AppointmentDetailModal from "../../components/AppointmentDetailModal";
import {
  approveAppointment,
  fetchAppointmentDetail,
  fetchAppointments,
  rejectAppointment,
} from "../../services/appointmentService";
import {
  formatAppointmentDate,
  patientInitials,
  statusBadgeClass,
  statusLabel,
} from "../../utils/appointments";

function MyAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAppointments();
      setRows(Array.isArray(res) ? res : (res.data ?? []));
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((r) => r.status === "pending").length,
      approved: rows.filter((r) => ["approved", "confirmed"].includes(r.status))
        .length,
      rejected: rows.filter((r) => ["rejected", "cancelled"].includes(r.status))
        .length,
    }),
    [rows],
  );

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
    const updated = res.data ?? res   // ← add this
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)))
    if (detail?.id === id) setDetail(updated)
    setDetailOpen(false)
  } catch {
    alert('មិនអាចអនុម័តបាន')
  } finally {
    setActionId(null)
  }
}

const handleReject = async (id) => {
  setActionId(id)
  try {
    const res = await rejectAppointment(id)
    const updated = res.data ?? res   
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)))
    if (detail?.id === id) setDetail(updated)
    setDetailOpen(false)
  } catch {
    alert('មិនអាចបដិសេធបាន')
  } finally {
    setActionId(null)
  }
}
  const todayRows = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return rows.filter((r) => r.appointment_date === today);
  }, [rows]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            ការណាត់ជួបរបស់ខ្ញុំ
          </h1>
          <p className="text-sm text-slate-500">
            អនុម័ត ឬបដិសេធបន្ទាប់ពីមើលលម្អិតអ្នកជំងឺ
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          <CalendarClock size={16} />
          ផ្ទុកឡើងវិញ
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">សរុប</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">រង់ចាំ</p>
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">បានអនុម័ត</p>
          <p className="text-3xl font-bold text-emerald-600">
            {stats.approved}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">បានបដិសេធ</p>
          <p className="text-3xl font-bold text-rose-600">{stats.rejected}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">កំពុងផ្ទុក...</p>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">អ្នកជំងឺ</th>
                <th className="px-4 py-3">កាលបរិច្ឆេទ</th>
                <th className="px-4 py-3">ពេល</th>
                <th className="px-4 py-3">ផ្នែក</th>
                <th className="px-4 py-3">ស្ថានភាព</th>
                <th className="px-4 py-3 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    មិនមានការណាត់ជួប
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#1976D2]">
                          {patientInitials(row.patientName)}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {row.patientName || "—"}
                        </span>
                      </div>
                    </td>
                    <td>{formatAppointmentDate(row.appointment_date)}</td>
                    <td>
                      <Clock3 size={13} className="inline mr-1" />
                      {row.appointment_time}
                    </td>
                    <td className="px-4 py-3">{row.department || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(row.status)}`}
                      >
                        {statusLabel(row.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(row.id)}
                        className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-[#1976D2] hover:bg-blue-50"
                      >
                        មើលលម្អិត
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
  );
}

export default MyAppointments;
