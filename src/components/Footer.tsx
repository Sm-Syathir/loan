
export default function Footer() {
    return (
      <footer className="bg-[#120F36] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Kolom 1 - Kontak */}
          <div>
            <hr className="border-gray-400 mb-6 w-20" />
            <h3 className="font-semibold mb-4">Hubungi Kami</h3>
            <p className="text-sm leading-relaxed">
              QP Office.Perkantoran Tanjung Mas Raya,  <br />
              blok B1 nomor 44, RT.002/RW.001.
              Tanjung Barat,  <br />
              Jagakarsa, Jakarta Selatan.125302
            </p>
            <p className="text-sm mt-4">Phone: 081196963698</p>
            <p className="text-sm">Email: Emailnya : admin@satufin.com</p>
            <p className="text-sm mt-2">
              Our Customer Service team is available weekdays, 8:30 AM to 5:30 PM (WIB).
            </p>
          </div>

          {/* kolom 3 */}
          {/* <div>
            <hr className="border-gray-400 mb-6 w-20" />
            <ul className="space-y-2 text-sm">
              <li>Personal loan</li>
              <li>Business loan</li>
              <li>Property loan</li>
              <li>Auto loan</li>
              <li>Education loan</li>
            </ul>
          </div> */}
  
          {/* Kolom 3 - Deskripsi */}
          <div>
            <hr className="border-gray-400 mb-6 w-20" />
            <p className="text-sm leading-relaxed">
              SatuFin adalah platform agregator keuangan berbasis teknologi yang menghubungkan pengguna dengan berbagai produk dan layanan keuangan dalam satu ekosistem digital yang terintegrasi.
              Kami menyederhanakan proses pencarian, perbandingan, dan akses layanan keuangan melalui satu platform yang user-centric, scalable, dan data-driven.
              Dengan bermitra bersama lebih dari 8+ lembaga keuangan terpercaya, SatuFin hadir untuk menjawab kebutuhan masyarakat modern akan solusi keuangan yang cepat, transparan, dan terpercaya.
            </p>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="text-center text-xs text-gray-400 mt-12">
          Copyright © 2025 SatuFin Indonesia. All Rights Reserved
        </div>
      </footer>
    )
  }
  