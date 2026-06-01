import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

// ── CONTEXT ──
const ToastContext = createContext(null)

// ── ICONS + STYLES per type ──
const TYPES = {
  success: {
    icon: CheckCircle2,
    bar:  'bg-emerald-500',
    bg:   'bg-white border-l-4 border-emerald-500',
    text: 'text-emerald-700',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: XCircle,
    bar:  'bg-rose-500',
    bg:   'bg-white border-l-4 border-rose-500',
    text: 'text-rose-700',
    iconColor: 'text-rose-500',
  },
  warning: {
    icon: AlertCircle,
    bar:  'bg-amber-500',
    bg:   'bg-white border-l-4 border-amber-500',
    text: 'text-amber-700',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: Info,
    bar:  'bg-[#1976D2]',
    bg:   'bg-white border-l-4 border-[#1976D2]',
    text: 'text-[#1976D2]',
    iconColor: 'text-[#1976D2]',
  },
}

// ── SINGLE TOAST ITEM ──
function ToastItem({ toast, onRemove }) {
  const cfg = TYPES[toast.type] || TYPES.info
  const Icon = cfg.icon

  return (
    <div
      className={`relative flex items-start gap-3 rounded-2xl px-4 py-3 shadow-lg shadow-black/10 min-w-[280px] max-w-sm w-full ${cfg.bg} animate-slide-in`}
      style={{ animation: 'slideIn 0.25s ease' }}
    >
      <Icon size={20} className={`mt-0.5 shrink-0 ${cfg.iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-bold ${cfg.text}`}>{toast.title}</p>
        )}
        <p className="text-sm text-slate-600 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition mt-0.5"
      >
        <X size={15} />
      </button>
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 rounded-b-2xl ${cfg.bar} transition-all`}
        style={{
          width: '100%',
          animation: `shrink ${toast.duration}ms linear forwards`,
        }}
      />
    </div>
  )
}

// ── PROVIDER ──
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback((message, { type = 'info', title = '', duration = 3500 } = {}) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, title, type, duration }])
    setTimeout(() => remove(id), duration)
    return id
  }, [remove])

  // Convenience helpers
  const toast = {
    success: (msg, opts) => add(msg, { type: 'success', ...opts }),
    error:   (msg, opts) => add(msg, { type: 'error',   ...opts }),
    warning: (msg, opts) => add(msg, { type: 'warning', ...opts }),
    info:    (msg, opts) => add(msg, { type: 'info',    ...opts }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* TOAST CONTAINER — fixed top-right */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

// ── HOOK ──
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}