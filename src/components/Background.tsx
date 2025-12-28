"use client";

export default function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-10 max-w-screen">
      {/* Lapisan utama */}
      <div className="w-full h-full bg-gradient-to-br from-blue-200 via-white to-white" />

      {/* Efek lingkaran halus */}
      <div className="absolute hidden lg:block top-1/4 left-1/3 w-[600px] h-[600px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[180px] opacity-40" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[180px] opacity-40" />
    </div>
  );
}