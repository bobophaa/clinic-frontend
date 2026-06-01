import { Download, Eye, Filter, Printer, Search } from 'lucide-react'

const prescriptions = [
  {
    id: 'RX-8821',
    patient: 'សុន សុខា',
    info: 'ភេទ ប្រុស',
    medicine: 'Amoxicillin',
    dosage: '500mg',
    instruction: '៣ ដង/ថ្ងៃ (បន្ទាប់បាយ)',
    issueDate: '២០ សីហា ២០២៦',
    status: 'បានមកដល់',
  },
  {
    id: 'RX-8822',
    patient: 'គីម កានា',
    info: 'ភេទ ស្រី',
    medicine: 'Paracetamol',
    dosage: '500mg',
    instruction: '២ ដង/ថ្ងៃ (ក្រោយបាយ)',
    issueDate: '២០ សីហា ២០២៦',
    status: 'បានមកដល់',
  },
  {
    id: 'RX-8823',
    patient: 'ចន វិរៈ',
    info: 'ភេទ ប្រុស',
    medicine: 'Cetirizine',
    dosage: '10mg',
    instruction: '១ ដង/ថ្ងៃ (មុនគេង)',
    issueDate: '១៥ សីហា ២០២៦',
    status: 'កំពុងរង់ចាំ',
  },
  {
    id: 'RX-8824',
    patient: 'លី ម៉ី',
    info: 'ភេទ ស្រី',
    medicine: 'Metformin',
    dosage: '850mg',
    instruction: '២ ដង/ថ្ងៃ (ក្រោយបាយ)',
    issueDate: '១៥ សីហា ២០២៦',
    status: 'បានមកដល់',
  },
]

function Prescriptions() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">វេជ្ជបញ្ជា</h1>
          <p className="text-sm text-slate-500">គ្រប់គ្រង និងតាមដានការចេញវេជ្ជបញ្ជាថ្នាំរបស់អ្នកជំងឺ</p>
        </div>
        <button className="rounded-xl bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white">+ បន្ថែមវេជ្ជបញ្ជា</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">សរុបវេជ្ជបញ្ជា</p><p className="text-3xl font-bold text-slate-900">១២៨</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">បានមកដល់</p><p className="text-3xl font-bold text-slate-900">១១៥</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">កំពុងរង់ចាំ</p><p className="text-3xl font-bold text-slate-900">១៣</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-500">អ្នកជំងឺសកម្ម</p><p className="text-3xl font-bold text-slate-900">៥៥០</p></div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-500"><Search size={15} />ស្វែងរក...</div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"><Filter size={14} />តម្រៀប</button>
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"><Download size={14} />ទាញយក</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">លេខកូដ</th>
                <th className="px-4 py-3">អ្នកជំងឺ</th>
                <th className="px-4 py-3">ឱសថ</th>
                <th className="px-4 py-3">កម្លាំង</th>
                <th className="px-4 py-3">បរិមាណ</th>
                <th className="px-4 py-3">ចេញថ្ងៃ</th>
                <th className="px-4 py-3">ស្ថានភាព</th>
                <th className="px-4 py-3 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{item.id}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-slate-800">{item.patient}</p><p className="text-xs text-slate-400">{item.info}</p></td>
                  <td className="px-4 py-3 text-slate-700">{item.medicine}</td>
                  <td className="px-4 py-3 text-slate-700">{item.dosage}</td>
                  <td className="px-4 py-3 text-slate-700">{item.instruction}</td>
                  <td className="px-4 py-3 text-slate-700">{item.issueDate}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'បានមកដល់' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span></td>
                  <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2 text-slate-400"><Eye size={16} /><Printer size={16} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-xl font-semibold text-slate-900">ស្ថិតិការប្រើប្រាស់ថ្នាំ</h3><button className="text-sm font-semibold text-[#1976D2]">មើលលម្អិត</button></div>
          <div className="h-32 rounded-xl bg-slate-50" />
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E3A8A] p-5 text-white">
          <h3 className="text-xl font-semibold">ចំណាំពិសេស</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-blue-100">
            <li>ថ្នាំ Amoxicillin ត្រូវរក្សាទុកសីតុណ្ហភាពបន្ទប់</li>
            <li>អ្នកជំងឺកុមារ ត្រូវកំណត់បរិមាណតាមទម្ងន់ខ្លួន</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Prescriptions
