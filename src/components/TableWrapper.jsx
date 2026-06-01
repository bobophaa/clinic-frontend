function TableWrapper({ children }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">{children}</table>
      </div>
    </div>
  )
}

export default TableWrapper
