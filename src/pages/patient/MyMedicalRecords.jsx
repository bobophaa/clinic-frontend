import { useEffect, useState } from "react";
import { fetchMyMedicalRecords } from "../../services/patientService";

function MyMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchMyMedicalRecords()
  .then((res) => {
    setRecords(Array.isArray(res) ? res : res.data ?? [])
    setLoading(false)
  })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-5 p-1">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">កំណត់ត្រាវេជ្ជសាស្ត្រ</h1>
        <p className="text-sm text-slate-500">ប្រវត្តិ និងលទ្ធផលពិនិត្យសុខភាពពិតប្រាកដរបស់អ្នក</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        {/* LEFT: VITALS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 h-fit space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">ព័ត៌មានទូទៅ</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between rounded-lg bg-slate-100 p-2"><span>ប្រភេទឈាម</span><span className="font-semibold text-rose-600">O+</span></div>
            <div className="flex justify-between rounded-lg bg-slate-100 p-2"><span>អាលែកហ្ស៊ីឱសថ</span><span className="font-semibold text-slate-700">គ្មាន</span></div>
          </div>
        </div>

        {/* RIGHT: LIVE MEDICAL RECORDS */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">ប្រវត្តិពិនិត្យជំងឺ</h3>

            {loading ? (
              <p className="text-sm text-slate-500">កំពុងផ្ទុកទិន្នន័យ...</p>
            ) : records.length === 0 ? (
              <p className="text-sm text-slate-400 italic">មិនទាន់មានកំណត់ត្រាវេជ្ជសាស្ត្រចូលក្នុងប្រព័ន្ធទេ។</p>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => (
                  <div key={rec.id} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">រោគវិនិច្ឆ័យ៖ {rec.diagnosis}</h4>
                        <p className="text-sm text-slate-600 mt-1">រោគសញ្ញា៖ {rec.symptoms || "មិនបានបញ្ជាក់"}</p>
<p className="text-xs text-slate-400 mt-2">ពិនិត្យដោយ៖  {rec.doctorName || "គ្រូពេទ្យ"}</p>
<span>{rec.created_at || "—"}</span>                      </div>
                      <span className="text-xs font-medium bg-blue-50 text-[#1976D2] px-2.5 py-1 rounded-md">
                        {rec.appointment?.appointment_date || "—"}
                      </span>
                    </div>
                    {rec.treatments && (
                      <p className="mt-2 text-sm text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                        <strong>ការព្យាបាល៖</strong> {rec.treatments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyMedicalRecords;