import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'

const records = [
  {
    id: 'MR-2201',
    patient: 'កែវ សុវី',
    doctor: 'វេជ្ជ. សុខ រ័ត្ន',
    date: '១២ កក្កដា ២០២៦',
    diagnosis: 'ជំងឺផ្លូវដង្ហើម',
    prescriptions: ['Amoxicillin 500mg - ២គ្រាប់/ថ្ងៃ', 'Salbutamol - ១ដងពេលចាំបាច់'],
  },
  {
    id: 'MR-2202',
    patient: 'សេង កាណា',
    doctor: 'វេជ្ជ. ចាន់ណា',
    date: '១៥ កក្កដា ២០២៦',
    diagnosis: 'លើសឈាម',
    prescriptions: ['Losartan 50mg - ១គ្រាប់/ថ្ងៃ', 'Amlodipine 5mg - ១គ្រាប់/ថ្ងៃ'],
  },
  {
    id: 'MR-2203',
    patient: 'នួន ស្រីល័ក្ខ',
    doctor: 'វេជ្ជ. ដារ៉ា',
    date: '២០ កក្កដា ២០២៦',
    diagnosis: 'ឈឺក្រពះ',
    prescriptions: ['Omeprazole 20mg - មុនបាយព្រឹក', 'Antacid - ២ដង/ថ្ងៃ'],
  },
]

function MedicalRecords() {
  const [openId, setOpenId] = useState(records[0].id)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">កំណត់ត្រាវេជ្ជសាស្ត្រ</h1>
        <p className="text-sm text-slate-500">ពិនិត្យព័ត៌មានព្យាបាល និងវេជ្ជបញ្ជារបស់អ្នកជំងឺ</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {records.map((item, idx) => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} className={idx !== 0 ? 'border-t border-slate-200' : ''}>
              <button
                onClick={() => setOpenId(isOpen ? '' : item.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2 text-[#1976D2]">
                    <FileText size={17} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.patient}</p>
                    <p className="text-xs text-slate-500">
                      {item.id} • {item.doctor} • {item.date}
                    </p>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="text-slate-400" size={18} /> : <ChevronDown className="text-slate-400" size={18} />}
              </button>

              {isOpen ? (
                <div className="grid gap-4 border-t border-slate-100 bg-slate-50 px-5 py-4 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-sm font-semibold text-slate-700">រោគវិនិច្ឆ័យ</p>
                    <p className="rounded-xl bg-white p-3 text-sm text-slate-600">{item.diagnosis}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-slate-700">វេជ្ជបញ្ជា</p>
                    <ul className="space-y-2 rounded-xl bg-white p-3 text-sm text-slate-600">
                      {item.prescriptions.map((med) => (
                        <li key={med} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#1976D2]" />
                          {med}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MedicalRecords
