import { useState } from 'react'
import { CalendarClock, Plus } from 'lucide-react'

const columns = ['ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍', 'អាទិត្យ']
const seeds = {
  ច័ន្ទ: [{ title: 'ពិនិត្យទូទៅ', start: '08:00', end: '09:00' }, { title: 'ពិនិត្យលទ្ធផល', start: '10:30', end: '11:00' }],
  អង្គារ: [{ title: 'ពិនិត្យទូទៅ', start: '08:00', end: '09:00' }],
  ពុធ: [{ title: 'វេនជំងឺបេះដូង', start: '09:00', end: '10:00' }],
  ព្រហស្បតិ៍: [{ title: 'ពិនិត្យទូទៅ', start: '08:00', end: '09:00' }],
  សុក្រ: [{ title: 'ពិនិត្យទូទៅ', start: '08:00', end: '09:00' }],
  សៅរ៍: [{ title: 'វេនបន្ទាន់', start: '08:00', end: '09:00' }],
  អាទិត្យ: [],
}

function MySchedule() {
  const [calendar, setCalendar] = useState(seeds)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">កាលវិភាគការងារប្រចាំសប្តាហ៍</h1>
          <p className="text-sm text-slate-500">គ្រប់គ្រងពេលវេលាការងារ និងចំនួនអ្នកជំងឺក្នុងមួយម៉ោង</p>
        </div>
        <button className="rounded-xl bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white">រក្សាទុក</button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-7 divide-x divide-slate-200 overflow-x-auto rounded-xl border border-slate-200">
          {columns.map((day) => (
            <div key={day} className={`min-h-[360px] p-3 ${day === 'អាទិត្យ' ? 'bg-amber-50' : 'bg-white'}`}>
              <p className={`mb-3 text-center font-semibold ${day === 'អាទិត្យ' ? 'text-amber-700' : 'text-slate-800'}`}>{day}</p>
              <div className="space-y-2">
                {calendar[day].map((slot) => (
                  <div key={`${day}-${slot.start}`} className="rounded-lg border-l-4 border-[#1976D2] bg-blue-50 px-2 py-2">
                    <p className="text-xs font-semibold text-[#1565C0]">{slot.title}</p>
                    <p className="mt-1 text-[11px] text-slate-500">ចាប់ផ្តើម: {slot.start}</p>
                    <p className="text-[11px] text-slate-500">បញ្ចប់: {slot.end}</p>
                    <p className="text-[11px] font-semibold text-slate-700">៣០ នាទី / ករណី</p>
                  </div>
                ))}
                {calendar[day].length === 0 ? (
                  <div className="mt-16 text-center text-xs text-slate-400">
                    <CalendarClock className="mx-auto mb-1" size={18} />
                    គ្មានកាលវិភាគ
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-3 text-xl font-semibold text-slate-900">សង្ខេបកាលវិភាគប្រចាំសប្តាហ៍</h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="mb-1 flex justify-between"><span className="text-slate-500">ចំនួនម៉ោងពិនិត្យ (ព្រឹក)</span><span className="font-semibold text-slate-800">១២ ម៉ោង</span></div>
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[76%] rounded-full bg-[#3B82F6]" /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between"><span className="text-slate-500">ចំនួនម៉ោងពិនិត្យ (ល្ងាច)</span><span className="font-semibold text-slate-800">១២ ម៉ោង</span></div>
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 w-[46%] rounded-full bg-[#60A5FA]" /></div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="mb-3 text-xl font-semibold text-slate-900">ការណាត់ពិសេស</h3>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 p-3"><p className="font-semibold text-slate-800">០២ វិច្ឆិកា</p><p className="text-sm text-slate-500">វេនបន្ថែមពេលល្ងាច</p></div>
            <div className="rounded-xl border border-slate-200 p-3"><p className="font-semibold text-slate-800">១០ វិច្ឆិកា</p><p className="text-sm text-slate-500">សិក្ខាសាលាអ្នកជំងឺផ្លូវដង្ហើម</p></div>
          </div>
          <button
            onClick={() =>
              setCalendar((prev) => ({
                ...prev,
                សៅរ៍: [...prev.សៅរ៍, { title: 'វេនបន្ថែម', start: '10:30', end: '11:00' }],
              }))
            }
            className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1976D2] text-white"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MySchedule
