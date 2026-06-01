import LandingFooter from "./LandingFooter";

export default function DoctorPage() {
  const doctors = [
    {
      name: "លោកគ្រូ ចិន នេរ",
      spec: "ឯកទេសសរីរាង្គ",
      img: "/Image/doctor1.jpg",
    },
    {
      name: "លោកស្រី ងួន ចំរើន",
      spec: "ឯកទេសកុមារ",
      img: "/Image/doctor2.jpg",
    },
    {
      name: "លោកគ្រូ សុខ ដារ៉ា",
      spec: "ឯកទេសខួរក្បាល",
      img: "/Image/doctor5.jpg",
    },
    {
      name: "លោកគ្រូ ហេង សុបិន",
      spec: "ឯកទេសបេះដូង",
      img: "/Image/doctor3.jpg",
    },
    {
      name: "លោកស្រី ទំនើប ថី",
      spec: "ឯកទេសវះកាត់",
      img: "/Image/doctor4.jpg",
    },
    {
      name: "លោកស្រី លី សុភាព",
      spec: "ឯកទេសមហារីក",
      img: "/Image/doctor6.jpg",
    },
  ];

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-[#EAF4FF] to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            ក្រុមគ្រូពេទ្យជំនាញ
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-8">
            យើងមានក្រុមគ្រូពេទ្យជំនាញដែលមានបទពិសោធន៍ខ្ពស់
            និងត្រៀមខ្លួនជួយថែទាំសុខភាពអ្នកគ្រប់ពេល។
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {doctors.map((d, i) => (
              <div
                key={i}
                className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-2xl transition group"
              >

                <div className="h-[400px] overflow-hidden">
                  <img
                    src={d.img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {d.name}
                  </h3>

                  <p className="text-[#1976D2] font-medium mb-5">
                    {d.spec}
                  </p>

                  <button className="w-full border border-[#1976D2] text-[#1976D2] py-3 rounded-xl hover:bg-blue-50 transition">
                    កក់ការណាត់ជួប
                  </button>
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1976D2] text-white text-center">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-4xl font-bold mb-6">
            ត្រូវការគ្រូពេទ្យជំនាញ?
          </h2>

          <p className="text-blue-100 text-lg mb-10">
            ទាក់ទងមកយើង ដើម្បីទទួលបានការពិគ្រោះយោបល់ភ្លាមៗ។
          </p>

          <button className="bg-white text-[#1976D2] px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition">
            ទាក់ទងឥឡូវនេះ
          </button>

        </div>
      </section>
<LandingFooter/>
    </div>
  );
}
