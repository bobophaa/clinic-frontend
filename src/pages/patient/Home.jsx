import { useEffect, useState, useCallback } from 'react'
import { Calendar, Clipboard, Pill, Clock, ArrowRight } from 'lucide-react'
import { fetchAppointments } from '../../services/appointmentService'
import { fetchMedicalRecords } from '../../services/medicalRecordService'
import { formatAppointmentDate } from '../../utils/appointments'

export default function Home() {
  const [appointments, setAppointments] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [loading, setLoading] = useState(true)


  const loadPatientDashboard = useCallback(async () => {
    setLoading(true)
    try {

      const apptRes = await fetchAppointments()
      const allAppts = Array.isArray(apptRes) ? apptRes : apptRes.data ?? []
      setAppointments(allAppts)

      const recordRes = await fetchMedicalRecords()
      const allRecords = Array.isArray(recordRes) ? recordRes : recordRes.data ?? []
      setMedicalRecords(allRecords)
    } catch (error) {
      console.error("Error loading patient dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPatientDashboard()
  }, [loadPatientDashboard])

  const recentAppointment = appointments[0] || null

  return (
    <div className="space-y-6">
  
      <div className="relative overflow-hidden rounded-3xl bg-[#1976D2] p-6 text-white shadow-md md:p-8">
        <div className="relative z-10 max-w-xl space-y-2">
          <p className="text-sm font-medium text-blue-100">សួស្តី, អ្នកជំងឺ!</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">តាមដានសុខភាពរបស់អ្នក</h1>
          <p className="text-sm text-blue-100/90">
            ប្រព័ន្ធគ្រប់គ្រងគ្លីនិកឆ្លាតវៃ សម្រាប់តាមដានការណាត់ជួប លទ្ធផលពិនិត្យ និងព័ត៌មានសុខភាពប្រចាំថ្ងៃ។
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#1976D2] shadow-sm hover:bg-blue-50 transition-colors">
              <Calendar size={14} /> កក់ការណាត់ជួប
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600/40 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm hover:bg-blue-600/60 transition-colors">
              មើលប្រវត្តិព្យាបាល
            </button>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 md:h-56 md:w-56" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-[#1976D2]">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">ការណាត់ជួបសរុប</p>
            <p className="text-xl font-bold text-slate-800">{appointments.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Clipboard size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">ប្រវត្តិពិនិត្យជំងឺ</p>
            <p className="text-xl font-bold text-slate-800">{medicalRecords.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">រង់ចាំការពិនិត្យ</p>
            <p className="text-xl font-bold text-slate-800">
              {appointments.filter(a => ['pending', 'confirmed', 'approved'].includes(a.status)).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
      
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">ការណាត់ជួបរបស់អ្នក</h2>
            <button className="text-xs font-bold text-[#1976D2] inline-flex items-center gap-1 hover:underline">
              មើលទាំងអស់ <ArrowRight size={12} />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            {loading ? (
              <p className="text-sm text-slate-400 text-center py-6">កំពុងផ្ទុកទិន្នន័យ...</p>
            ) : !recentAppointment ? (
              <p className="text-sm text-slate-400 text-center py-6">មិនមានការណាត់ជួប — <span className="text-[#1976D2] font-semibold cursor-pointer hover:underline">កក់ឥឡូវនេះ</span></p>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4 border-l-4 border-[#1976D2] bg-slate-50/50 p-3 rounded-r-xl">
                <div>
                  <p className="font-bold text-slate-800">{recentAppointment.doctorName || 'លោកគ្រូពេទ្យជំនាញ'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatAppointmentDate(recentAppointment.appointment_date)} · {recentAppointment.appointment_time}
                  </p>
                  {recentAppointment.reason && (
                    <p className="mt-2 text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-lg border border-slate-100 inline-block">
                      មូលហេតុ៖ {recentAppointment.reason}
                    </p>
                  )}
                </div>
                
                {/* STATUS BADGE */}
                <div>
                  {recentAppointment.status === 'completed' && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">បានបញ្ចប់</span>
                  )}
                  {['confirmed', 'approved'].includes(recentAppointment.status) && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">បានអនុម័ត</span>
                  )}
                  {recentAppointment.status === 'pending' && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">កំពុងរង់ចាំ</span>
                  )}
                  {recentAppointment.status === 'cancelled' && (
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">បានបោះបង់</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>


        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-800">វេជ្ជបញ្ជាចុងក្រោយ</h2>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm min-h-[140px]">
            {loading ? (
              <p className="text-sm text-slate-400 text-center py-6">កំពុងផ្ទុក...</p>
            ) : medicalRecords.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">មិនទាន់មានវេជ្ជបញ្ជាថ្នាំនៅឡើយទេ</p>
            ) : (
              <div className="space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <p className="text-xs font-bold text-slate-400">រោគវិនិច្ឆ័យ (Diagnosis)</p>
                  <p className="text-sm font-bold text-slate-800">{medicalRecords[0]?.diagnosis}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1.5">បញ្ជីថ្នាំត្រូវលេប៖</p>
                  <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1">
                    {medicalRecords[0]?.prescriptions?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100">
                        <div className="rounded-lg bg-blue-50 p-1.5 text-[#1976D2] mt-0.5">
                          <Pill size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800">{item.medicine_name} {item.dosage}</p>
                          <p className="text-slate-500 font-medium">{item.frequency} · {item.duration_days}</p>
                          {item.instructions && <p className="text-slate-400 italic">*{item.instructions}</p>}
                        </div>
                      </div>
                    ))}
                    {(!medicalRecords[0]?.prescriptions || medicalRecords[0]?.prescriptions.length === 0) && (
                      <p className="text-xs text-slate-400 italic">គ្មានថ្នាំក្នុងបញ្ជី</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}