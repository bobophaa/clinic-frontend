export default function AboutPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* Hero */}
      <section className="relative py-28 bg-gradient-to-br from-[#EAF4FF] via-white to-[#F8FBFF]">

        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1976D2] px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-[#1976D2] rounded-full"></span>
              អំពីពួកយើង
            </div>

            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-8">
              មន្ទីរពេទ្យទំនើប
              <span className="text-[#1976D2] block mt-2">
                ផ្តោតលើអ្នកជំងឺ
              </span>
            </h1>

            <p className="text-gray-500 text-lg leading-9 mb-10">
              យើងជាមជ្ឈមណ្ឌលសុខភាពដែលផ្តល់សេវាកម្មវេជ្ជសាស្ត្រទំនើប
              ជាមួយក្រុមគ្រូពេទ្យជំនាញ និងបច្ចេកវិទ្យាខ្ពស់
              ដើម្បីផ្តល់ការថែទាំល្អបំផុតសម្រាប់អ្នកជំងឺ។
            </p>

            <button className="bg-[#1976D2] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition">
              ទាក់ទងមកយើង
            </button>
          </div>

          <div>
            <img
              src="/Image/hospitle.png"
              alt="Hospital"
              className="rounded-[40px] shadow-2xl w-full h-[600px] object-cover"
            />
          </div>

        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-24 bg-[#F8FBFF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-10">

          <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              បេសកកម្ម 
            </h2>
            <p className="text-gray-500 leading-8">
              ផ្តល់សេវាកម្មថែទាំសុខភាពប្រកបដោយគុណភាពខ្ពស់
              សុវត្ថិភាព និងមានភាពយកចិត្តទុកដាក់ចំពោះអ្នកជំងឺ
              គ្រប់រូបដោយមិនគិតពីវ័យ ឬស្ថានភាពសុខភាព។
            </p>
          </div>

          <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              ចក្ខុវិស័យ 
            </h2>
            <p className="text-gray-500 leading-8">
              ក្លាយជាមន្ទីរពេទ្យឈានមុខក្នុងតំបន់
              ដែលផ្តល់សេវាកម្មវេជ្ជសាស្ត្រទំនើប
              និងមានទំនុកចិត្តខ្ពស់ពីសាធារណជន។
            </p>
          </div>

        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-5">
              គុណតម្លៃរបស់យើង
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              យើងផ្តោតលើគុណភាព សុវត្ថិភាព និងការយកចិត្តទុកដាក់
              ចំពោះអ្នកជំងឺគ្រប់រូប។
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              "គុណភាពខ្ពស់ក្នុងការព្យាបាល",
              "សេវាកម្មដោយចិត្តមេត្តា",
              "បច្ចេកវិទ្យាវេជ្ជសាស្ត្រទំនើប",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 p-10 rounded-[32px] shadow-sm hover:shadow-xl transition text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1976D2] font-bold">
                  ✓
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {item}
                </h3>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#1976D2] text-white relative overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold mb-6">
            ចាប់ផ្តើមថែទាំសុខភាពរបស់អ្នកថ្ងៃនេះ
          </h2>

          <p className="text-blue-100 text-lg mb-10">
            ទាក់ទងមកយើងដើម្បីទទួលបានការពិគ្រោះយោបល់ពីគ្រូពេទ្យជំនាញ។
          </p>

          <button className="bg-white text-[#1976D2] px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition">
            ទាក់ទងឥឡូវនេះ
          </button>

        </div>
      </section>

    </div>
  );
}
