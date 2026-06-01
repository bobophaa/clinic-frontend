import {
  X,
  User,
  Stethoscope,
  CalendarDays,
  Clock3,
  Phone,
  Droplets,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Activity,
} from 'lucide-react'
import { formatAppointmentDate, statusBadgeClass, statusLabel } from '../utils/appointments'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon size={15} className="text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-slate-800 break-words">{value || '—'}</p>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  )
}

export default function AppointmentDetailModal({
  appointment,
  isOpen,
  onClose,
  canManage = false,
  actionLoading = false,
  onApprove,
  onReject,
}) {
  if (!isOpen || !appointment) return null

  const isPending = appointment.status === 'pending'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER BANNER */}
        <div className="sticky top-0 z-10 rounded-t-3xl bg-gradient-to-r from-[#1976D2] to-blue-400 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <User size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {appointment.patientName || 'Unknown Patient'}
                </h2>
                <p className="text-sm text-blue-100">លេខណាត់ # {appointment.id}</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusBadgeClass(appointment.status)}`}>
                    {statusLabel(appointment.status)}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-white">
                    {appointment.source === 'walk-in' ? 'មុខទទួល' : 'Online'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white transition hover:bg-white/30"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-6 p-6">

          {/* APPOINTMENT INFO */}
          <Section title="ព័ត៌មានការណាត់ជួប">
            <InfoRow
              icon={Stethoscope}
              label="វេជ្ជបណ្ឌិត"
              value={appointment.doctorName}
            />
            <InfoRow
              icon={Activity}
              label="ផ្នែកវេជ្ជសាស្ត្រ"
              value={appointment.department}
            />
            <InfoRow
              icon={CalendarDays}
              label="កាលបរិច្ឆេទ"
              value={formatAppointmentDate(appointment.appointment_date)}
            />
            <InfoRow
              icon={Clock3}
              label="ម៉ោង"
              value={appointment.appointment_time}
            />
          </Section>

          <hr className="border-slate-100" />

          {/* PATIENT INFO */}
          <Section title="ព័ត៌មានអ្នកជំងឺ">
            <InfoRow
              icon={User}
              label="ឈ្មោះ"
              value={appointment.patientName}
            />
            <InfoRow
              icon={Phone}
              label="លេខទូរស័ព្ទ"
              value={appointment.patientPhone}
            />
            <InfoRow
              icon={CalendarDays}
              label="ថ្ងៃខែឆ្នាំកំណើត"
              value={appointment.patientDob}
            />
            <InfoRow
              icon={User}
              label="ភេទ"
              value={
                appointment.patientGender === 'male'
                  ? 'ប្រុស'
                  : appointment.patientGender === 'female'
                  ? 'ស្រី'
                  : appointment.patientGender
              }
            />
            <InfoRow
              icon={Droplets}
              label="ក្រុមឈាម"
              value={appointment.patientBloodType}
            />
            <InfoRow
              icon={MapPin}
              label="អាសយដ្ឋាន"
              value={appointment.patientAddress}
            />
          </Section>

          <hr className="border-slate-100" />

          {/* SYMPTOMS & NOTES */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              មូលហេតុ / រោគសញ្ញា
            </p>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                <p className="text-sm text-slate-700 leading-relaxed">
                  {appointment.reason || '—'}
                </p>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                កំណត់សម្គាល់
              </p>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <FileText size={16} className="mt-0.5 shrink-0 text-slate-400" />
                  <p className="text-sm text-slate-700 leading-relaxed">{appointment.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          {canManage && isPending && (
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                បិទ
              </button>
              <button
                disabled={actionLoading}
                onClick={() => onReject(appointment.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-600 disabled:opacity-60"
              >
                <XCircle size={16} />
                បដិសេធ
              </button>
              <button
                disabled={actionLoading}
                onClick={() => onApprove(appointment.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600 disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                អនុម័ត
              </button>
            </div>
          )}

          {/* If not pending, just show close */}
          {(!canManage || !isPending) && (
            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                បិទ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}