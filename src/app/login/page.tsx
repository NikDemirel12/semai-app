"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Sprout,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("pakahmad@semai.my")
  const [password, setPassword] = useState("••••••••••••")
  const [loading, setLoading] = useState(false)

  function handleFormLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    router.push("/")
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F5F2EB] text-[#1C251E]">
      {/* Left Panel: Deep Forest Green Agricultural Hero Banner */}
      <div className="relative lg:col-span-6 xl:col-span-7 bg-[#163020] text-[#F5F2EB] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#274B35]">
        {/* Subtle Organic Topographic / Field Grid Pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #86EFAC 1px, transparent 1px), radial-gradient(circle at 80% 70%, #FDE68A 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#2D6A4F]/30 blur-3xl"
        />

        {/* Top Brand Mark */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2D6A4F] border border-[#40916C]/50 text-[#F5F2EB] shadow-sm">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xl font-extrabold tracking-tight text-[#F5F2EB]">
                SEMAI
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#A7C4B5]">
                TUMBUH BERSAMA
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2D6A4F] bg-[#1E3F2B] px-3.5 py-1 text-xs font-medium text-[#D8E6DF]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#74C69D]" />
            Edisi Petani Kedah &amp; Utara
          </span>
        </div>

        {/* Center Editorial Headline */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#95D5B2] mb-4">
            Jurnal Kebun &amp; Kewangan Tani Digital
          </p>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[54px] font-semibold leading-[1.12] tracking-tight text-[#F5F2EB]">
            Kebun terurus.{" "}
            <span className="italic font-normal text-[#B7E4C7]">
              Hidup lebih bermakna.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#C7D8CE]">
            Daripada catatan buku nota lusuh kepada almanak digital yang tenang.
            Jejak kos benih, baja, dan kesan kos tersembunyi seperti minyak
            mesin serta upah harian sebelum ia menghakis hasil titik peluh anda.
          </p>
        </div>

        {/* Bottom Stats Row (Plot, Hektar, Tuaian) */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-[#294D36]">
          <div className="rounded-2xl bg-[#1D3C29]/90 border border-[#2D573D] p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#95D5B2]">
              Plot
            </span>
            <p className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#F5F2EB]">
              120+
            </p>
            <span className="mt-0.5 block text-xs text-[#B8CEC0]">
              Lot Padi &amp; Sayuran
            </span>
          </div>

          <div className="rounded-2xl bg-[#1D3C29]/90 border border-[#2D573D] p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#95D5B2]">
              Hektar
            </span>
            <p className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#F5F2EB]">
              84.5 Ha
            </p>
            <span className="mt-0.5 block text-xs text-[#B8CEC0]">
              Tanah Dipantau Aktif
            </span>
          </div>

          <div className="rounded-2xl bg-[#1D3C29]/90 border border-[#2D573D] p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#95D5B2]">
              Tuaian
            </span>
            <p className="mt-1 font-serif-editorial text-2xl sm:text-3xl font-bold text-[#F5F2EB]">
              +24%
            </p>
            <span className="mt-0.5 block text-xs text-[#B8CEC0]">
              Ketepatan Untung Bersih
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel: Warm Cream Entry & 1-Click Demo Card */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 bg-[#F5F2EB]">
        <div className="w-full max-w-md mx-auto space-y-7">
          <div>
            <span className="inline-block rounded-full bg-[#E6E1D5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
              Selamat Kembali ke Ladang
            </span>
            <h2 className="mt-3 font-serif-editorial text-3xl font-semibold text-[#1C251E]">
              Log Masuk Akaun SEMAI
            </h2>
            <p className="mt-1.5 text-sm text-[#5A655D]">
              Pilih akses demo pantas di bawah atau masukkan e-mel berdaftar anda.
            </p>
          </div>

          {/* Prominent 1-Click Demo Card */}
          <div className="rounded-2xl bg-[#FAF8F3] border-2 border-[#2D6A4F] p-5 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2D6A4F]/12 px-2.5 py-0.5 text-xs font-bold text-[#163020]">
                <Sparkles className="h-3.5 w-3.5 text-[#2D6A4F]" />
                Akses Demo 1-Klik
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A655D]">
                <MapPin className="h-3.5 w-3.5 text-[#B45309]" />
                Pendang, Kedah
              </span>
            </div>

            <h3 className="font-serif-editorial text-lg font-bold text-[#1C251E]">
              Masuk sebagai Pak Ahmad (Kebun Hijau Ahmad — Pendang, Kedah)
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[#5A655D]">
              Terus ke papan pemuka lengkap dengan lakaran peta kebun, almanak
              cuaca Pendang, dan analisis kos tersembunyi bagi Lot Cili &amp; Padi.
            </p>

            <Link
              href="/"
              className="mt-4 flex h-12 w-full items-center justify-between rounded-xl bg-[#163020] px-4 text-sm font-bold text-[#F5F2EB] hover:bg-[#234832] transition-colors shadow-sm"
            >
              <span>Masuk sebagai Pak Ahmad (Kebun Hijau Ahmad — Pendang, Kedah)</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E2DDD2] w-full" />
            <span className="bg-[#F5F2EB] px-3 text-xs font-semibold uppercase tracking-wider text-[#7A847C]">
              atau e-mel
            </span>
            <div className="border-t border-[#E2DDD2] w-full" />
          </div>

          {/* Standard Email / Password Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                Alamat E-mel / ID Petani
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-[#7A847C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@semai.my"
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#FAF8F3] pl-11 pr-4 text-base text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#1C251E]">
                  Kata Laluan
                </label>
                <span className="text-xs font-semibold text-[#2D6A4F]">
                  Lupa kata laluan?
                </span>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-[#7A847C]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#FAF8F3] pl-11 pr-4 text-base text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2D6A4F] px-5 text-base font-bold text-[#FAF8F3] hover:bg-[#23533D] transition-colors shadow-sm"
            >
              <span>{loading ? "Membuka Kebun..." : "Log Masuk ke Papan Pemuka"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
