export const STATUS_LABELS = {
  pending: 'កំពុងរង់ចាំ',
  approved: 'បានអនុម័ត',
  rejected: 'បានបដិសេធ',
  completed: 'បានបញ្ចប់',
  cancelled: 'បានលុបចោល',
  confirmed: 'បានអនុម័ត',
}

export function statusLabel(status) {
  return STATUS_LABELS[status] || status || '—'
}

export function statusBadgeClass(status) {
  switch (status) {
    case 'approved':
    case 'confirmed':
    case 'completed':
      return 'bg-emerald-100 text-emerald-700'
    case 'pending':
      return 'bg-amber-100 text-amber-700'
    case 'rejected':
    case 'cancelled':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export function formatAppointmentDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('km-KH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function patientInitials(name) {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`
  }
  return name.slice(0, 2)
}
