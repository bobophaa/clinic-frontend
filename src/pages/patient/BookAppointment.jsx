import { useEffect, useMemo, useState } from "react";
import { createAppointment } from "../../services/appointmentService";
import { fetchDoctors, fetchDoctorSchedules } from "../../services/doctorService";
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  CheckCircle2,
  ShieldCheck,
  User,
  FileText,
} from "lucide-react";

const DEFAULT_SLOTS = [
  { id: null, time: "08:00" },
  { id: null, time: "09:00" },
  { id: null, time: "10:00" },
  { id: null, time: "11:00" },
  { id: null, time: "14:00" },
  { id: null, time: "15:00" },
  { id: null, time: "16:00" },
];

function StepPill({ index, step, label }) {
  const active = index === step;
  const done = index < step;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition ${
          active
            ? "bg-[#1976D2] text-white shadow-lg shadow-blue-200"
            : done
              ? "bg-emerald-100 text-emerald-600"
              : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? <CheckCircle2 size={18} /> : index}
      </div>
      <div>
        <p className={`text-sm font-semibold ${active ? "text-slate-900" : "text-slate-500"}`}>
          {label}
        </p>
      </div>
    </div>
  );
}

function BookAppointment() {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState("");

  const [form, setForm] = useState({
    department: "",
    doctor: "",
    date: "",
    time: "",
    reason: "",
    note: "",
    schedule_id: null,
  });

  // ── LOAD DOCTORS ──
  useEffect(() => {
    fetchDoctors()
      .then((data) => {
        const res = Array.isArray(data) ? data : data.data ?? [];
        const formatted = res.map((d) => ({
          id: d.id,
          name: d.user?.name || d.name || "Unknown Doctor",
          dept: d.specialization || "General Medicine",
          title: d.qualification || "General Physician",
          experience: d.experience ? `${d.experience} ឆ្នាំ` : "គ្មានបទពិសោធន៍",
          room: d.room || "General Room",
          fee: d.fee ? `$${d.fee}` : "$10",
          available: Number(d.is_active) === 1 || d.active === true,
        }));
        setDoctors(formatted);
      })
      .catch((err) => console.error("Error fetching doctors:", err))
      .finally(() => setLoadingDoctors(false));
  }, []);

  useEffect(() => {
    if (!form.doctor) {
      setAvailableSlots([]);
      return;
    }
    if (!form.date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    fetchDoctorSchedules(form.doctor, form.date)
      .then((schedules) => {
        if (schedules && schedules.length > 0) {
          setAvailableSlots(
            schedules.map((s) => ({
              id: s.id,
              time: s.start_time ? s.start_time.substring(0, 5) : s.time,
            }))
          );
        } else {
          setAvailableSlots(DEFAULT_SLOTS);
        }
      })
      .catch(() => {
        setAvailableSlots(DEFAULT_SLOTS);
      })
      .finally(() => setLoadingSlots(false));
  }, [form.doctor, form.date]);

  const departments = useMemo(() => {
    const uniqueDepts = [...new Set(doctors.map((d) => d.dept))].filter(Boolean);
    return uniqueDepts.map((dept, index) => ({ id: `dept-${index}`, label: dept }));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!form.department) return doctors;
    return doctors.filter((d) => d.dept === form.department);
  }, [form.department, doctors]);

  const selectedDoctor = useMemo(
    () => doctors.find((d) => String(d.id) === String(form.doctor)) || null,
    [form.doctor, doctors]
  );

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleConfirm = async () => {
    if (!form.doctor) { setBookError("សូមជ្រើសរើសវេជ្ជបណ្ឌិត"); return; }
    if (!form.date || !form.time) { setBookError("សូមជ្រើសកាលបរិច្ឆេទ និងម៉ោង"); return; }

    setBookError("");
    setBooking(true);

    try {
      const appointmentData = {
        doctor_id: Number(form.doctor),
        schedule_id: form.schedule_id,
        department: form.department,
        appointment_date: form.date,
        appointment_time: form.time,
        reason: form.reason,
        notes: form.note,
        status: "pending",
      };

      const response = await createAppointment(appointmentData);
      localStorage.setItem("latest_appointment", JSON.stringify(response));
      setShowSuccess(true);
    } catch (error) {
      if (error.response?.status === 422) {
        setBookError("ម៉ោងនេះត្រូវបានគេកក់រួចហើយ! សូមជ្រើសរើសម៉ោង ឬថ្ងៃផ្សេង។");
      } else {
        setBookError("មិនអាចកក់ការណាត់ជួបបានទេ សូមព្យាយាមម្តងទៀត។");
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-6">
      <div className="max-w-9xl space-y-6">
        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-r from-[#1976D2] to-blue-500 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">កក់ការណាត់ជួបវេជ្ជបណ្ឌិត</h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100">
                ប្រព័ន្ធតភ្ជាប់ផ្ទាល់ជាមួយកាលវិភាគពិតប្រាកដរបស់គ្រូពេទ្យនៅក្នុងគ្លីនិក។
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-white" />
                {/* <div>
                  <p className="font-semibold">ClinicSync Live SQL Connection</p>
                  <p className="text-xs text-blue-100">ទិន្នន័យមានសុវត្ថិភាពខ្ពស់</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* STEPPER */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center gap-8">
            <StepPill index={1} step={step} label="ជ្រើសវេជ្ជបណ្ឌិត" />
            <StepPill index={2} step={step} label="កាលបរិច្ឆេទ" />
            <StepPill index={3} step={step} label="បញ្ជាក់" />
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-5 xl:grid-cols-[1fr_350px]">
          <div className="space-y-5">

            {/* STEP 1 — DOCTOR */}
            {step === 1 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-bold text-slate-900">ជ្រើសរើសផ្នែក និងវេជ្ជបណ្ឌិត</h2>

                {loadingDoctors ? (
                  <p className="mt-5 text-slate-500 text-sm">កំពុងទាញយកទិន្នន័យគ្រូពេទ្យពី SQL Database...</p>
                ) : (
                  <>
                    <div className="mt-5">
                      <p className="mb-3 text-sm font-semibold text-slate-700">ផ្នែកវេជ្ជសាស្ត្រ</p>
                      <div className="grid gap-3 md:grid-cols-3">
                        {departments.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setForm((p) => ({ ...p, department: d.label, doctor: "" }))}
                            className={`rounded-2xl border p-4 text-left transition ${
                              form.department === d.label ? "border-[#1976D2] bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <p className="font-semibold">{d.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <p className="mb-3 text-sm font-semibold text-slate-700">
                        វេជ្ជបណ្ឌិតដែលអាចរកបាន
                        {form.department && <span className="ml-2 text-xs text-slate-400">({filteredDoctors.length} នាក់)</span>}
                      </p>

                      {filteredDoctors.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                          <Stethoscope className="mx-auto mb-3 text-slate-300" size={36} />
                          <p className="font-medium">មិនមានវេជ្ជបណ្ឌិតសម្រាប់ផ្នែកនេះទេ</p>
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          {filteredDoctors.map((doc) => (
                            <button
                              key={doc.id}
                              disabled={!doc.available}
                              onClick={() => setForm((p) => ({ ...p, doctor: String(doc.id) }))}
                              className={`rounded-2xl border p-5 text-left transition ${
                                !doc.available
                                  ? "opacity-50 bg-slate-50 cursor-not-allowed"
                                  : form.doctor === String(doc.id)
                                    ? "border-[#1976D2] bg-blue-50"
                                    : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                                  <Stethoscope className="text-slate-500" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-slate-900">{doc.name}</p>
                                  <p className={`mt-1 text-xs font-medium ${doc.available ? "text-emerald-600" : "text-rose-500"}`}>
                                    {doc.available ? "អាចកក់បាន" : "មិនទាន់មានវេន"}
                                  </p>
                                  <p className="text-sm text-slate-500">{doc.title}</p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                      បទពិសោធន៍ {doc.experience}
                                    </span>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                      {doc.fee}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* STEP 2 — DATE & TIME */}
            {step === 2 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-bold text-slate-900">ជ្រើសរើសថ្ងៃ និងម៉ោង</h2>
                <div className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">កាលបរិច្ឆេទ</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value, time: "", schedule_id: null }))}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1976D2]"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      ម៉ោងដែលអាចកក់បាន
                      {loadingSlots && <span className="ml-2 text-xs font-normal text-slate-400">កំពុងផ្ទុក...</span>}
                    </label>

                    {!form.date ? (
                      <p className="text-xs italic text-slate-400">សូមជ្រើសរើសកាលបរិច្ឆេទមុន</p>
                    ) : loadingSlots ? (
                      <p className="text-xs italic text-slate-400">កំពុងផ្ទុកម៉ោង...</p>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-xs italic text-slate-400">មិនមានម៉ោងទំនេរ</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => setForm((p) => ({ ...p, time: slot.time, schedule_id: slot.id }))}
                            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                              form.time === slot.time
                                ? "border-[#1976D2] bg-blue-50 text-[#1976D2]"
                                : "border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — REASON */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h2 className="text-lg font-bold text-slate-900">ព័ត៌មានបន្ថែម</h2>
                  <div className="mt-5 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">មូលហេតុនៃការមកពិនិត្យ</label>
                      <textarea
                        rows={4}
                        value={form.reason}
                        onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                        placeholder="ឧ. ឈឺក្បាល ឬ តាមដានសម្ពាធឈាម..."
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1976D2]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">កំណត់សម្គាល់បន្ថែម</label>
                      <textarea
                        rows={4}
                        value={form.note}
                        onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                        placeholder="ឧ. ប្រវត្តិជំងឺ ឬ ប្រតិកម្មថ្នាំ..."
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#1976D2]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50"
              >
                ត្រឡប់ក្រោយ
              </button>
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (step === 1 && !form.doctor) ||
                    (step === 2 && (!form.date || !form.time))
                  }
                  className="rounded-xl bg-[#1976D2] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  បន្ត
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={booking}
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 disabled:opacity-60"
                >
                  {booking ? "កំពុងកក់..." : "បញ្ជាក់ការណាត់ជួប"}
                </button>
              )}
            </div>
            {bookError && <p className="mt-3 text-sm text-red-600">{bookError}</p>}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">សង្ខេបការកក់</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500">វេជ្ជបណ្ឌិត</p>
                    <p className="font-semibold text-slate-800">{selectedDoctor?.name || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays size={16} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500">កាលបរិច្ឆេទ</p>
                    <p className="font-semibold text-slate-800">{form.date || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 size={16} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500">ម៉ោង</p>
                    <p className="font-semibold text-slate-800">{form.time || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500">ផ្នែក</p>
                    <p className="font-semibold text-slate-800">{form.department || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 size={45} className="text-emerald-600" />
            </div>
            <div className="mt-5 text-center">
              <h2 className="text-2xl font-bold text-slate-900">កក់ជោគជ័យ</h2>
              <p className="mt-2 text-sm text-slate-500">ការណាត់ជួបរបស់អ្នកត្រូវបានបញ្ចូន​ សូមរងចាំការបញ្ជាក់ពីមន្ទីរពេទ្យ</p>
            </div>
            <button
              onClick={() => { setShowSuccess(false); window.location.href = "/patient/home"; }}
              className="mt-6 w-full rounded-2xl bg-[#1976D2] py-3 text-sm font-semibold text-white"
            >
              ត្រឡប់ទៅកាន់ទំព័រដើម
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;