
export default function Footer() {
    return (
      <footer className="bg-[#120F36] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Kolom 1 - Kontak */}
          <div>
            <hr className="border-gray-400 mb-6 w-20" />
            <h3 className="font-semibold mb-4">Hubungi Kami</h3>
            <p className="text-sm leading-relaxed">
              Sahid Sudirman Center 43E floor <br />
              Jl. Jend. Sudirman No.86 Jakarta Pusat <br />
              DKI Jakarta, Indonesia 10220
            </p>
            <p className="text-sm mt-4">Phone: wmdawmda</p>
            <p className="text-sm">Email: lorem</p>
            <p className="text-sm mt-2">
              Our Customer Service team is available weekdays, 8:30 AM to 5:30 PM (WIB).
            </p>
          </div>
  
          {/* Kolom 2 - Layanan */}
          <div>
            <hr className="border-gray-400 mb-6 w-20" />
            <ul className="space-y-2 text-sm">
              <li>Personal loan</li>
              <li>Business loan</li>
              <li>Property loan</li>
              <li>Auto loan</li>
              <li>Education loan</li>
            </ul>
          </div>
  
          {/* Kolom 3 - Deskripsi */}
          <div>
            <hr className="border-gray-400 mb-6 w-20" />
            <p className="text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad
            </p>
          </div>
        </div>
  
        {/* Copyright */}
        <div className="text-center text-xs text-gray-400 mt-12">
          Copyright © 2025 Loan Market Indonesia. All Rights Reserved
        </div>
      </footer>
    )
  }
  