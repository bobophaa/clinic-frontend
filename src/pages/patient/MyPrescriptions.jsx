import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyPrescriptions } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

function MyPrescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   fetchMyPrescriptions()
  .then((res) => {
    setPrescriptions(Array.isArray(res) ? res : res.data ?? [])
    setLoading(false)
  })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-5 p-1">
      {/* TOP HERO */}
      <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
        <div className="rounded-2xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-7 text-white">
          <h2 className="text-4xl font-bold">សួស្តី, {user?.name}!</h2>
          <p className="mt-2 text-sm text-blue-100">សូមអានវេជ្ជបញ្ជាថ្នាំរបស់អ្នកឱ្យបានត្រឹមត្រូវ និងពិនិត្យតាមដានសុខភាព</p>
          <Link to="/patient/book" className="mt-6 inline-block rounded-xl bg-white px-5 py-2 text-sm font-semibold text-[#1976D2]">
            កក់ការណាត់ជួបថ្មី
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-center">
          <p className="text-sm text-slate-500">ស្ថានភាពទូទៅ</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">ធម្មតា</p>
        </div>
      </div>

      {/* DYNAMIC PRESCRIPTIONS LIST */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-4">បញ្ជីវេជ្ជបញ្ជាពីគ្រូពេទ្យ</h3>
        
        {loading ? (
          <p className="text-sm text-slate-500">កំពុងផ្ទុកទិន្នន័យថ្នាំ...</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-sm text-slate-400 italic">មិនទាន់មានប្រវត្តិទទួលបានវេជ្ជបញ្ជាថ្នាំនៅឡើយទេ។</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {prescriptions.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-[#1976D2]">
                  {item.frequency || "រៀងរាល់ថ្ងៃ"}
                </span>
             <p className="mt-2 text-2xl font-bold">{item.medicine_name} {item.dosage}</p>
<p>ប្រេកង់៖ {item.frequency || "—"}</p>
<p>រយៈពេល៖ {item.duration_days ? `${item.duration_days} ថ្ងៃ` : "—"}</p>
<span>ការណែនាំ៖ {item.instructions || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPrescriptions;