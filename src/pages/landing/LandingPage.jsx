import { Link } from "react-router-dom";
import {
  HeartPulse,
  Microscope,
  Stethoscope,
  Clock3,
  CheckCircle2,
  Calendar, Star, MapPin, Phone, Mail, ArrowRight
} from "lucide-react";
import LandingFooter from "./LandingFooter";

const reviews = [
  {
    stars: 5,
    text: "សេវាកម្មល្អណាស់ គ្រូពេទ្យមានភាពរសាយរាក់ទាក់ និងយកចិត្តទុកដាក់ខ្ពស់។ ខ្ញុំមានអារម្មណ៍សុវត្ថិភាព និងទុកចិត្តពេលមកពិនិត្យនៅទីនេះ។",
    name: "មន្ត្រី ចំ",
    role: "អ្នកជំងឺ",
  },
  {
    stars: 5,
    text: "មន្ទីរពេទ្យមានបរិយាកាសស្អាត ទំនើប និងមានបុគ្គលិកជួយណែនាំបានល្អ។ ការព្យាបាលមានប្រសិទ្ធភាព និងរហ័សទាន់ចិត្ត។",
    name: "ស្រី សុភា",
    role: "អ្នកជំងឺ",
  },
  {
    stars: 5,
    text: "ការថែទាំអ្នកជំងឺពិតជាអស្ចារ្យ។ គ្រូពេទ្យពន្យល់បានច្បាស់លាស់ និងផ្តល់ការយកចិត្តទុកដាក់ដូចជាសមាជិកគ្រួសារ។",
    name: "ចំរើន ដារ៉ា",
    role: "អ្នកជំងឺ",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white font-['Kantumruy_Pro',sans-serif]">
     
      <section className="bg-[#F1F5F9] py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Text Content */}
          <div className="flex-1 space-y-6">
            <p className="text-[#1976D2] text-sm font-bold tracking-wide flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#1976D2] inline-block"></span>
              ស្វាគមន៍មកកាន់គ្លីនិក <h1 className="text-2xl font-bold text-[#1976D2]">ClinicSync</h1>
            </p>
            
            <h1 className="text-4xl md:text-[46px] font-bold text-gray-800 leading-tight">
              សុខភាពរបស់អ្នកគឺជា&nbsp;
              <span className="text-[#1976D2] text-[52px] font-extrabold block mt-2 leading-none">
                អាទិភាពចម្បងបំផុត
              </span>
              <span className="text-[#1976D2] text-[52px] font-extrabold block leading-normal">
                របស់យើង
              </span>
            </h1>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              បទពិសោធន៍នៃការថែទាំសុខភាពកម្រិតពិភពលោកប្រកបដោយភាពស្និទ្ធស្នាល។
              ក្រុមអ្នកជំនាញដែលខិតខំប្រឹងប្រែងរបស់យើងប្រើប្រាស់បច្ចេកវិជ្ជាទំនើប
              ដើម្បីធានាថាអ្នកទទួលបានការថែទាំដែលច្បាស់លាស់ និងប្រកបដោយក្តីមេត្តាបំផុត។
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/login"
                className="bg-[#1976D2] text-white px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <Calendar size={16} /> កក់ការណាត់ជួប
              </Link>
              <Link
                to="/services"
                className="border border-slate-300 text-slate-700 px-7 py-3.5 rounded-xl text-sm font-bold hover:border-[#1976D2] hover:text-[#1976D2] bg-white transition flex items-center gap-1"
              >
                ស្វែងយល់បន្ថែម <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 relative w-full">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-[32px] overflow-hidden p-1 shadow-lg">
              <img
                src="/Image/landing.jpg"
                alt="Landing Hero"
                className="w-full h-[400px] object-cover rounded-[30px]"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F8FBFF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-[#1976D2] font-semibold tracking-wide uppercase text-sm mb-3">
              ជំនាញវេជ្ជសាស្ត្ររបស់យើង
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              សេវាកម្មឯកទេសសម្រាប់អ្នក
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-8">
              យើងផ្តល់ជូននូវសេវាកម្មវេជ្ជសាស្ត្រទំនើប ដើម្បីថែរក្សាសុខភាព និងផ្តល់បទពិសោធន៍ល្អបំផុតសម្រាប់អ្នក។
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Main Large Card */}
            <div className="lg:col-span-7 bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:scale-105 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-[#1976D2]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-3-3v6m8 4H4a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h6l2 2h3a2 2 0 012 2v10a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-5">
                  ការពិគ្រោះយោបល់ទូទៅ
                </h3>

                <p className="text-gray-500 leading-8 mb-8">
                  ការពិនិត្យសុខភាព និងការថែទាំជាប្រចាំដោយគ្រូពេទ្យជំនាញ ដើម្បីជួយថែរក្សាសុខភាពរបស់អ្នកក្នុងរយៈពេលវែង។
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    "ការណាត់ជួប",
                    "ប្រវត្តិវេជ្ជសាស្ត្រ",
                    "ការតាមដានសុខភាព",
                    "ការចាក់វ៉ាក់សាំង",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[#1976D2] text-xs font-bold">
                        ✓
                      </div>
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                to="/login"
                className="mt-10 w-fit bg-[#1976D2] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
              >
                កក់ការណាត់ជួប
              </Link>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">

              {/* Dental — កែសម្រួលប៊ូតុងខាងក្រោមឱ្យស្អាត */}
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-lg transition flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                    <Stethoscope className="w-7 h-7 text-[#1976D2]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    ការថែទាំធ្មេញ
                  </h3>
                  <p className="text-gray-500 leading-8 mb-6">
                    សេវាកម្មថែទាំ និងព្យាបាលធ្មេញដោយបច្ចេកវិទ្យាទំនើប។
                  </p>
                </div>
                <Link
                  to="/services"
                  className="w-fit border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:border-[#1976D2] hover:text-[#1976D2] transition"
                >
                  ស្វែងយល់បន្ថែម
                </Link>
              </div>

              {/* Card Medical */}
              <div className="bg-[#1976D2] text-white rounded-[32px] p-8 relative overflow-hidden shadow-md">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <HeartPulse className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    វេជ្ជសាស្ត្រ
                  </h3>
                  <p className="text-blue-100 leading-8 mb-6">
                    ការពិនិត្យ និងព្យាបាលដោយក្រុមគ្រូពេទ្យជំនាញវិជ្ជាជីវៈ។
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-white text-[#1976D2] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 transition"
                  >
                    ពិនិត្យឥឡូវនេះ
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Large Image Card */}
            <div className="lg:col-span-12 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden grid md:grid-cols-2">
              <div className="relative h-[320px] md:h-auto">
                <img
                  src="/Image/lab.jpg"
                  alt="Medical Laboratory"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
              </div>

              <div className="p-10 flex flex-col justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <Microscope className="w-8 h-8 text-[#1976D2]" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-5">
                  ការពិនិត្យមន្ទីរពិសោធន៍
                </h3>
                <p className="text-gray-500 leading-8 mb-8">
                  ការធ្វើតេស្ត និងវិភាគលទ្ធផលវេជ្ជសាស្ត្រដោយប្រើបច្ចេកវិទ្យាទំនើប និងមានភាពត្រឹមត្រូវខ្ពស់។
                </p>
                <Link
                  to="/login"
                  className="w-fit bg-[#1976D2] text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition"
                >
                  កក់ការពិនិត្យ
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-24 bg-gradient-to-b from-white to-[#F7FAFF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Image */}
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-full h-full bg-blue-100 rounded-[40px] blur-2xl opacity-40"></div>
              <div className="relative overflow-hidden rounded-[38px] shadow-2xl">
                <img
                  src="/Image/hospitle.png"
                  alt="Clinic Center"
                  className="w-full h-[620px] object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl px-8 py-6 rounded-3xl shadow-xl border border-white/50">
                <h1 className="text-5xl font-bold text-[#1976D2] mb-1">25+</h1>
                <p className="text-gray-600 font-medium">ឆ្នាំបទពិសោធន៍</p>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
                អំពីគ្លីនិកយើង
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-8">
                មជ្ឈមណ្ឌលសេវាកម្មវេជ្ជសាស្ត្រ
                <span className="text-[#1976D2] text-[52px] font-extrabold pt-2 block">
                  ដ៏ទំនើបបំផុត
                </span>
              </h2>
              <p className="text-gray-500 text-lg leading-9 mb-10">
                គ្លីនិករបស់យើងផ្តល់ជូននូវសេវាកម្មវេជ្ជសាស្ត្រប្រកបដោយគុណភាពខ្ពស់ ជាមួយក្រុមគ្រូពេទ្យជំនាញ បច្ចេកវិទ្យាទំនើប និងការថែទាំអ្នកជំងឺប្រកបដោយភាពយកចិត្តទុកដាក់ខ្ពស់។
              </p>

              <div className="space-y-5">
                {[
                  "ក្រុមគ្រូពេទ្យជំនាញមានបទពិសោធន៍ខ្ពស់",
                  "បច្ចេកវិទ្យាវេជ្ជសាស្ត្រទំនើបចុងក្រោយ",
                  "បុគ្គលិកល្អ មានមនោសញ្ចេតនា និងសុវត្ថិភាព",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="min-w-[52px] h-[52px] rounded-2xl bg-blue-50 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-[#1976D2]" />
                    </div>
                    <p className="text-gray-800 font-semibold text-lg leading-8">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/services"
                  className="border border-slate-300 text-slate-700 px-7 py-3.5 rounded-xl text-sm font-bold hover:border-[#1976D2] hover:text-[#1976D2] transition"
                >
                  ស្វែងយល់បន្ថែម
                </Link>
                <button className="border border-slate-300 text-slate-700 px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
                  ទំនាក់ទំនងយើង
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-24 bg-gradient-to-b from-[#F8FAFC] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-5">
                <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
                ក្រុមការងាររបស់យើង
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                វេជ្ជបណ្ឌិតជំនាញ
              </h2>
              <p className="text-gray-500 text-lg leading-8 max-w-2xl">
                ក្រុមវេជ្ជបណ្ឌិតដែលមានបទពិសោធន៍ខ្ពស់ និងផ្តល់ការថែទាំប្រកបដោយវិជ្ជាជីវៈសម្រាប់អ្នកជំងឺគ្រប់រូប។
              </p>
            </div>
            <Link
              to="/doctors"
              className="group w-fit flex items-center gap-3 border border-[#1976D2] text-[#1976D2] px-6 py-3 rounded-2xl font-semibold hover:bg-[#1976D2] hover:text-white transition duration-300"
            >
              មើលទាំងអស់
              <span className="group-hover:translate-x-1 transition">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "វេជ្ជបណ្ឌិត ចិន នេរ", spec: "ឯកទេសសរីរាង្គ", img: "/Image/doctor1.jpg" },
              { name: "លោកវេជ្ជបណ្ឌិត ងួន ចំរើន", spec: "ឯកទេសសម្ភព", img: "/Image/doctor2.jpg" },
              { name: "លោកវេជ្ជបណ្ឌិត ហេង សុប្ញ", spec: "ឯកទេសកុមារ", img: "/Image/doctor3.jpg" },
              { name: "វេជ្ជបណ្ឌិត ទំនើប ថ្ញ", spec: "ឯកទេសសរសៃប្រសាទ", img: "/Image/doctor4.jpg" }
            ].map((doc, idx) => (
              <div key={idx} className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-500">
                <div className="relative h-[320px] overflow-hidden">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow text-xs font-semibold text-[#1976D2]">
                    ឯកទេស
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{doc.name}</h3>
                  <p className="text-[#1976D2] font-medium mb-5">{doc.spec}</p>
                  <Link to="/login" className="block w-full bg-[#1976D2] text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition">
                    កក់ការណាត់ជួប
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F8FBFF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-5">
              <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
              ការវាយតម្លៃ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">តើអ្នកជំងឺនិយាយអ្វីខ្លះ?</h2>
            <p className="text-gray-500 text-lg leading-8 max-w-2xl mx-auto">
              មតិយោបល់ និងបទពិសោធន៍ពិតពីអ្នកជំងឺដែលបានប្រើប្រាស់សេវាកម្មនៅមជ្ឈមណ្ឌលវេជ្ជសាស្ត្ររបស់យើង។
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div key={i} className="group relative bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-500">
                <div className="absolute top-6 right-6 text-6xl text-blue-50 font-bold select-none">"</div>
                <div className="flex items-center gap-1 mb-6">
                  {Array(r.stars).fill(0).map((_, j) => (
                    <Star key={j} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-8 mb-8 relative z-10">{r.text}</p>
                <div className="w-full h-[1px] bg-gray-100 mb-6"></div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-lg font-bold text-[#1976D2]">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{r.name}</h4>
                    <p className="text-gray-400 text-sm">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{num: "15K+", label: "អ្នកជំងឺ"}, {num: "25+", label: "ឆ្នាំបទពិសោធន៍"}, {num: "98%", label: "ការពេញចិត្ត"}, {num: "24/7", label: "សេវាកម្ម"}].map((s, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
                <h3 className="text-4xl font-bold text-[#1976D2] mb-2">{s.num}</h3>
                <p className="text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-b from-[#F8FBFF] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-5">
              <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
              ទាក់ទងមកយើង
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">យើងរីករាយក្នុងការជួយអ្នក</h2>
            <p className="text-gray-500 text-lg leading-8 max-w-3xl mx-auto">
              ក្រុមការងាររបស់យើងតែងតែត្រៀមខ្លួនជាស្រេច ដើម្បីផ្តល់ព័ត៌មាន ការណែនាំ និងការថែទាំសុខភាពប្រកបដោយគុណភាពខ្ពស់សម្រាប់អ្នក។
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-[36px] border border-gray-100 shadow-xl p-8 md:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ផ្ញើសារមកយើង</h3>
              <p className="text-gray-500 mb-8">បំពេញព័ត៌មានខាងក្រោម ហើយក្រុមការងារយើងនឹងទាក់ទងអ្នកវិញឆាប់ៗនេះ។</p>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">ឈ្មោះ</label>
                    <input type="text" placeholder="បញ្ចូលឈ្មោះ" className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#1976D2] outline-none transition" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">អ៊ីមែល</label>
                    <input type="email" placeholder="example@email.com" className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#1976D2] outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">លេខទូរស័ព្ទ</label>
                  <input type="text" placeholder="០១២ ៣៤៥ ៦៧៨" className="w-full h-14 px-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#1976D2] outline-none transition" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">សាររបស់អ្នក</label>
                  <textarea placeholder="តើអ្នកត្រូវការជំនួយអ្វី?" className="w-full h-40 px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#1976D2] outline-none resize-none transition" />
                </div>
                <button className="w-full h-14 bg-[#1976D2] text-white rounded-2xl font-semibold hover:bg-blue-700 transition shadow-lg">ផ្ញើសារ</button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[#1976D2] rounded-[36px] p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="relative z-10 flex gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0"><MapPin size={28} /></div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3">អាសយដ្ឋាន</h4>
                    <p className="text-blue-100 leading-8">ផ្លូវ ១២៣ សង្កាត់បឹងកេងកង <br />រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5"><Phone size={24} className="text-[#1976D2]" /></div>
                  <p className="text-sm text-gray-400 mb-2">លេខទូរស័ព្ទ</p>
                  <h4 className="text-lg font-bold text-gray-900 leading-8">០២៣ ៤៥៦ ៧៨៨ <br />០១២ ៣៤៥ ៦៧៨</h4>
                </div>
                <div className="bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm hover:shadow-lg transition">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5"><Mail size={24} className="text-[#1976D2]" /></div>
                  <p className="text-sm text-gray-400 mb-2">អ៊ីមែល</p>
                  <h4 className="text-lg font-bold text-gray-900 break-all">info@clinicsync.kh</h4>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-[36px] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center"><Clock3 size={24} className="text-[#1976D2]" /></div>
                  <div>
                    <p className="text-sm text-[#1976D2] font-semibold">ម៉ោងធ្វើការ</p>
                    <h4 className="text-2xl font-bold text-gray-900">ពេលវេលាបម្រើសេវា</h4>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100"><span className="text-gray-500">ចន្ទ - សុក្រ</span><span className="font-semibold text-gray-900">០៦:០០ ព្រឹក - ០៩:០០ ល្ងាច</span></div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100"><span className="text-gray-500">សៅរ៍ - អាទិត្យ</span><span className="font-semibold text-gray-900">០៦:០០ ព្រឹក - ១២:០០ ថ្ងៃត្រង់</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-400">ថ្ងៃបុណ្យ</span><span className="text-red-500 font-bold">បិទ</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}