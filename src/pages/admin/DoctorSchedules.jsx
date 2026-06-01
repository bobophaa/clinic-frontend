import { useState } from 'react'
import { CalendarDays, Clock3, Plus, Save, Coffee, CheckCircle, XCircle } from 'lucide-react'

const scheduleRows = [
  { dayKh: 'ច័ន្ទ', dayEn: 'Monday', enabled: true, start: '08:00', end: '12:00', duration: '30', status: 'សកម្ម' },
  { dayKh: 'អង្គារ', dayEn: 'Tuesday', enabled: true, start: '08:00', end: '12:00', duration: '30', status: 'សកម្ម' },
  { dayKh: 'ពុធ', dayEn: 'Wednesday', enabled: true, start: '08:00', end: '12:00', duration: '30', status: 'សកម្ម' },
  { dayKh: 'ព្រហស្បតិ៍', dayEn: 'Thursday', enabled: false, start: '', end: '', duration: '30', status: 'បិទ' },
  { dayKh: 'សុក្រ', dayEn: 'Friday', enabled: true, start: '08:00', end: '12:00', duration: '30', status: 'សកម្ម' },
  { dayKh: 'សៅរ៍', dayEn: 'Saturday', enabled: true, start: '08:00', end: '11:00', duration: '30', status: 'សកម្ម' },
  { dayKh: 'អាទិត្យ', dayEn: 'Sunday', enabled: false, start: '', end: '', duration: '30', status: 'ថ្ងៃសម្រាក' },
]

function DoctorSchedules() {
  const [rows, setRows] = useState(scheduleRows)

  const handleRowChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">កាលវិភាគការងារគ្រូពេទ្យ</h1>
          <p className="text-sm text-slate-500">កំណត់ពេលវេលាបំពេញការងារ និងគម្លាតម៉ោងណាត់ជួបប្រចាំសប្តាហ៍</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all">
          <Save size={16} />
          <span>រក្សាទុកកាលវិភាគ</span>
        </button>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={row.dayKh}
            className={`rounded-2xl border p-4 transition-all duration-200 ${
              row.enabled 
                ? 'border-slate-200 bg-white shadow-sm' 
                : 'border-slate-100 bg-slate-50/70 opacity-75'
            }`}
          >
            <div className="grid items-center gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-[160px_100px_1fr_1fr_1fr_130px]">
              
      
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 border ${row.enabled ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{row.dayKh}</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{row.dayEn}</p>
                </div>
              </div>

          
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRowChange(index, 'enabled', !row.enabled)}
                  className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${row.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${row.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <span className={`text-xs font-bold ${row.enabled ? 'text-blue-600' : 'text-slate-400'}`}>
                  {row.enabled ? 'ការងារ' : 'សម្រាក'}
                </span>
              </div>

             
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block md:hidden">ម៉ោងចាប់ផ្តើម</label>
                <input
                  type="time"
                  disabled={!row.enabled}
                  value={row.start}
                  onChange={(e) => handleRowChange(index, 'start', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none disabled:bg-slate-100/50 disabled:text-slate-400"
                />
              </div>

            
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block md:hidden">ម៉ោងបញ្ចប់</label>
                <input
                  type="time"
                  disabled={!row.enabled}
                  value={row.end}
                  onChange={(e) => handleRowChange(index, 'end', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none disabled:bg-slate-100/50 disabled:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block md:hidden">គម្លាតពិនិត្យ</label>
                <select
                  disabled={!row.enabled}
                  value={row.duration}
                  onChange={(e) => handleRowChange(index, 'duration', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none disabled:bg-slate-100/50 disabled:text-slate-400 appearance-none"
                >
                  <option value="15">15 នាទី / ម្នាក់</option>
                  <option value="20">20 នាទី / ម្នាក់</option>
                  <option value="30">30 នាទី / ម្នាក់</option>
                  <option value="45">45 នាទី / ម្នាក់</option>
                  <option value="60">60 នាទី / ម្នាក់</option>
                </select>
              </div>

              <div className="text-right hidden md:block">
                {row.enabled ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle size={13} /> សកម្មជាប់
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border ${row.status === 'ថ្ងៃសម្រាក' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                    {row.status === 'ថ្ងៃសម្រាក' ? <Coffee size={13} /> : <XCircle size={13} />} {row.status}
                  </span>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800">សេចក្ដីសង្ខេបកាលវិភាគ</h3>
          <p className="text-xs text-slate-400 mt-0.5">ការវិភាគសរុបនៃការកំណត់ពេលវេលាប្រចាំសប្តាហ៍</p>
          
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-2xl font-bold text-slate-800">០២ ថ្ងៃ</p>
              <p className="text-xs font-medium text-slate-400 mt-1">ថ្ងៃសម្រាកប្រចាំសប្តាហ៍</p>
            </div>
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
              <p className="text-2xl font-bold text-blue-600">២៣ ម៉ោង</p>
              <p className="text-xs font-medium text-blue-500 mt-1">ពេលវេលាសកម្មសរុប</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              <Clock3 size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">បន្ថែមវេនការងារពិសេស</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                អ្នកអាចបង្កើតវេនពិនិត្យបន្ថែម (Overtime) សម្រាប់ថ្ងៃដែលមានអ្នកជំងឺច្រើន។
              </p>
            </div>
          </div>
          
          <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all">
            <Plus size={14} />
            <span>បន្ថែមវេនការងារថ្មី</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default DoctorSchedules