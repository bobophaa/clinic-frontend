export default function ContactPage() {
  return (
    <div className="bg-white overflow-hidden">

      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-[#EAF4FF] to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            ទាក់ទងមកយើង
          </h1>

          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-8">
            យើងតែងតែរីករាយក្នុងការជួយអ្នក
            សម្រាប់សំណួរ ការពិគ្រោះ ឬការណាត់ជួប។
          </p>

        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

          {/* Form */}
          <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ផ្ញើសារមកយើង
            </h2>

            <div className="space-y-5">

              <input
                placeholder="ឈ្មោះ"
                className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#1976D2] outline-none"
              />

              <input
                placeholder="អ៊ីមែល"
                className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#1976D2] outline-none"
              />

              <input
                placeholder="លេខទូរស័ព្ទ"
                className="w-full h-14 px-5 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#1976D2] outline-none"
              />

              <textarea
                placeholder="សាររបស់អ្នក"
                className="w-full h-40 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#1976D2] outline-none resize-none"
              />

              <button className="w-full h-14 bg-[#1976D2] text-white rounded-2xl font-semibold hover:bg-blue-700 transition">
                ផ្ញើសារ
              </button>

            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">

            <div className="bg-[#1976D2] text-white p-8 rounded-[32px]">
              <h3 className="text-xl font-bold mb-3">អាសយដ្ឋាន</h3>
              <p className="text-blue-100 leading-8">
                ផ្លូវ 123, រាជធានីភ្នំពេញ
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-bold text-gray-900 mb-2">ទូរស័ព្ទ</h3>
              <p className="text-gray-600">012 345 678</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-bold text-gray-900 mb-2">អ៊ីមែល</h3>
              <p className="text-gray-600">info@hospital.com</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-bold text-gray-900 mb-4">ម៉ោងធ្វើការ</h3>

              <div className="text-sm text-gray-600 space-y-2">
                <p>ចន្ទ - សុក្រ: 6:00 - 21:00</p>
                <p>សៅរ៍ - អាទិត្យ: 6:00 - 12:00</p>
                <p className="text-red-500 font-semibold">ថ្ងៃបុណ្យ: បិទ</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
