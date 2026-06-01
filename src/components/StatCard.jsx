const COLOR_MAP = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
}

function StatCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorClass = COLOR_MAP[color] || COLOR_MAP.primary

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        {Icon ? (
          <div className={`rounded-lg p-2 ${colorClass}`}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  )
}

export default StatCard
