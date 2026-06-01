
import LandingFooter from "./LandingFooter";
export default function ServicePage() {
  const services = [
    {
      title: "ការពិគ្រោះយោបល់ទូទៅ",
      desc: "ការពិនិត្យសុខភាព និងការថែទាំជាប្រចាំដោយគ្រូពេទ្យជំនាញ។",
      image: "/Image/service2.jpg",
    },
    {
      title: "ការថែទាំធ្មេញ",
      desc: "សេវាកម្មថែទាំ និងព្យាបាលធ្មេញដោយបច្ចេកវិទ្យាទំនើប។",
      image: "/Image/service2.1.jpg",
    },
    {
      title: "វេជ្ជសាស្ត្រកុមារ",
      desc: "ការថែទាំ និងព្យាបាលកុមារដោយវេជ្ជបណ្ឌិតជំនាញ។",
      image: "/Image/service3.jpg",
    },
    {
      title: "មន្ទីរពិសោធន៍",
      desc: "ការធ្វើតេស្ត និងវិភាគលទ្ធផលវេជ្ជសាស្ត្រដោយភាពត្រឹមត្រូវខ្ពស់។",
      image: "/Image/service4.jpg",
    },
    {
      title: "សង្គ្រោះបន្ទាន់",
      desc: "សេវាកម្មសង្គ្រោះបន្ទាន់ 24/7 ដោយក្រុមគ្រូពេទ្យជំនាញ។",
      image: "/Image/service5.jpg",
    },
    {
      title: "ពិនិត្យបេះដូង",
      desc: "ការពិនិត្យ និងព្យាបាលជំងឺបេះដូងដោយឧបករណ៍ទំនើប។",
      image: "/Image/service6.jpg",
    },
  ];

  return (
    <div className="bg-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-br from-[#EAF4FF] via-white to-[#F8FBFF] overflow-hidden">

        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
              សេវាកម្មវេជ្ជសាស្ត្រ
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              សេវាកម្មថែទាំ
              <span className="text-[#1976D2] block mt-2">
                សុខភាពកម្រិតខ្ពស់
              </span>
            </h1>

            <p className="text-gray-500 text-lg leading-9 mb-10 max-w-2xl">
              យើងផ្តល់ជូននូវសេវាកម្មវេជ្ជសាស្ត្រប្រកបដោយគុណភាពខ្ពស់
              ជាមួយបច្ចេកវិទ្យាទំនើប និងក្រុមគ្រូពេទ្យជំនាញ
              ដើម្បីធានាការថែទាំដ៏ល្អបំផុតសម្រាប់អ្នក។
            </p>

            <div className="flex flex-wrap gap-5">
              <button className="bg-[#1976D2] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition shadow-lg">
                កក់ការណាត់ជួប
              </button>

              <button className="border border-gray-300 px-8 py-4 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition">
                ស្វែងយល់បន្ថែម
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-5 -left-5 w-full h-full bg-blue-100 rounded-[40px]"></div>

            <img
             src="/Image/service.jpg"
              alt="Hospital"
              className="relative rounded-[40px] shadow-2xl w-full h-[650px] object-cover"
            />
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-5">
              <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
              សេវាកម្មរបស់យើង
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              សេវាកម្មពេញលេញសម្រាប់អ្នក
            </h2>

            <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-8">
              យើងផ្តល់ជូនសេវាកម្មវេជ្ជសាស្ត្រជាច្រើន
              ដើម្បីបំពេញតម្រូវការសុខភាពរបស់អ្នកគ្រប់វ័យ។
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-500"
              >

                <div className="relative h-[260px] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  <div className="absolute bottom-5 left-5 text-white">
                    <p className="text-sm font-medium opacity-90">
                      សេវាកម្មវេជ្ជសាស្ត្រ
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 leading-8 mb-6">
                    {service.desc}
                  </p>

                  <button className="w-full bg-[#1976D2] text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition">
                    មើលព័ត៌មាន
                  </button>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#F8FBFF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <img
              src="/Image/service2.jpg"
              alt="Medical"
              className="rounded-[40px] shadow-xl w-full h-[600px] object-cover"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
              ហេតុអ្វីជ្រើសរើសយើង
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
              ការថែទាំសុខភាព
              <span className="text-[#1976D2] block mt-2">
                ប្រកបដោយទំនុកចិត្ត
              </span>
            </h2>

            <p className="text-gray-500 text-lg leading-9 mb-10">
              មន្ទីរពេទ្យរបស់យើងផ្តល់ជូននូវការថែទាំសុខភាព
              ប្រកបដោយគុណភាពខ្ពស់ ជាមួយបច្ចេកវិទ្យាទំនើប
              និងក្រុមគ្រូពេទ្យមានបទពិសោធន៍។
            </p>

            <div className="space-y-5">

              {[
                "គ្រូពេទ្យជំនាញ និងបទពិសោធន៍ខ្ពស់",
                "បច្ចេកវិទ្យាវេជ្ជសាស្ត្រទំនើប",
                "ការថែទាំអ្នកជំងឺដោយភាពយកចិត្តទុកដាក់",
                "សេវាកម្មសង្គ្រោះបន្ទាន់ 24/7",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1976D2] font-bold">
                    ✓
                  </div>

                  <p className="text-gray-700 font-medium text-lg">
                    {item}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1976D2] relative overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center text-white">

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            ត្រៀមខ្លួនសម្រាប់
            <span className="block mt-2">
              ការថែទាំសុខភាពល្អបំផុត?
            </span>
          </h2>

          <p className="text-blue-100 text-lg leading-9 mb-10 max-w-3xl mx-auto">
            ទាក់ទងមកកាន់ក្រុមការងាររបស់យើងថ្ងៃនេះ
            ដើម្បីទទួលបានការពិគ្រោះយោបល់ និងការថែទាំប្រកបដោយគុណភាព។
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <button className="bg-white text-[#1976D2] px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition">
              កក់ការណាត់ជួប
            </button>

            <button className="border border-white/40 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition">
              ទាក់ទងមកយើង
            </button>
          </div>

        </div>
      </section>
<LandingFooter />
    </div>
  );
}
