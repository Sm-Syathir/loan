"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type StatusType = "loading" | "success" | "error";

interface VerifyResponse {
  message?: string;
}

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<StatusType>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan.");
      return;
    }

    const verify = async (): Promise<void> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email?token=${token}`
        );

        const data: VerifyResponse = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Verifikasi gagal");
        }

        setStatus("success");
        setMessage(data.message || "Email berhasil diverifikasi.");
      } catch (err: unknown) {
        setStatus("error");

        if (err instanceof Error) {
          setMessage(err.message);
        } else {
          setMessage("Terjadi kesalahan saat verifikasi.");
        }
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold">
              Memverifikasi Email...
            </h2>
            <p className="text-gray-500 mt-2">
              Mohon tunggu sebentar
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-5xl mb-4">✔</div>
            <h2 className="text-2xl font-bold mb-2">
              Verifikasi Berhasil
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg w-full transition"
            >
              Login Sekarang
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-5xl mb-4">✖</div>
            <h2 className="text-2xl font-bold mb-2">
              Verifikasi Gagal
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <button
              onClick={() => router.push("/resend-verification")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg w-full transition"
            >
              Kirim Ulang Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}