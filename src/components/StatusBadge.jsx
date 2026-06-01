const STYLE_MAP = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  info: 'bg-info/15 text-info',
  default: 'bg-slate-200 text-slate-700',
}

function StatusBadge({ status = 'default', children }) {
  const style = STYLE_MAP[status] || STYLE_MAP.default

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {children}
    </span>
  )
}

export default StatusBadge
