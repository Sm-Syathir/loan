export default function About() {
  return (
    <section id="About" className="py-20 px-6 mb-10 ">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-black">
          Tentang SatuFin
        </h2>
        
        <p className="text-center text-gray-600 font-normal mb-12 text-lg">
          Satu Platform untuk Semua Kebutuhan Finansial Anda
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-3 text-center">Cepat & Mudah</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Akses berbagai produk keuangan dalam hitungan menit tanpa proses yang rumit
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-3 text-center">Aman & Terpercaya</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Bermitra dengan lembaga keuangan resmi dan berizin untuk keamanan maksimal
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-950 mb-3 text-center">Transparan</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Bandingkan berbagai penawaran dengan informasi yang jelas dan lengkap
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-10 shadow-xl max-w-4xl mx-auto text-center">
  <div className="space-y-6 text-gray-700 leading-relaxed">
    <p className="text-lg text-gray-950">
      <span className="font-bold text-gray-950">SatuFin</span> adalah platform agregator keuangan berbasis teknologi yang menghubungkan pengguna dengan berbagai produk dan layanan keuangan dalam satu ekosistem digital yang terintegrasi.
    </p>
    
    <p className="text-lg text-gray-950">
      Kami menyederhanakan proses pencarian, perbandingan, dan akses layanan keuangan melalui satu platform yang{" "}
      <span className="text-blue-600 font-semibold">user-centric</span>,{" "}
      <span className="text-blue-600 font-semibold">scalable</span>, dan{" "}
      <span className="text-blue-600 font-semibold">data-driven</span>.
    </p>
    
    <p className="text-lg text-gray-950">
      Dengan bermitra bersama lebih dari <span className="font-bold text-gray-950">8+ lembaga keuangan terpercaya</span>, SatuFin hadir untuk menjawab kebutuhan masyarakat modern akan solusi keuangan yang cepat, transparan, dan terpercaya.
    </p>

    <div className="pt-6 mt-6 border-t border-gray-200">
      <p className="text-center text-xl font-bold text-black">
        Satu Pintu untuk Semua Kebutuhan Finansial Anda
      </p>
    </div>
  </div>
</div>

      </div>
    </section>
  );
}