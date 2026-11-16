"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sprout,
  MapPin,
  LayoutDashboard,
  Map,
  Wallet,
  PackageCheck,
  Sparkles,
  LogOut,
  Menu,
  X,
} from "lucide-react"

interface AppShellProps {
  farmerName?: string
  farmerLocation?: string
  farmName?: string
  activePlotCount?: number
  children: React.ReactNode
}

const NAV_LINKS = [
  { href: "/", label: "Dashboard", shortLabel: "Utama", icon: LayoutDashboard },
  { href: "/plots", label: "Plot & Aktiviti", shortLabel: "Plot", icon: Map },
  {
    href: "/finance",
    label: "Kewangan & Tuaian",
    shortLabel: "Kewangan",
    icon: Wallet,
  },
  {
    href: "/operations",
    label: "Inventori & Tugasan",
    shortLabel: "Inventori",
    icon: PackageCheck,
  },
  {
    href: "/insights",
    label: "SEMAI Insights & MyGAP",
    shortLabel: "MyGAP",
    icon: Sparkles,
  },
]

export default function AppShell({
  farmerName = "Pak Ahmad",
  farmerLocation = "Pendang, Kedah",
  farmName = "Kebun Hijau Ahmad",
  activePlotCount = 2,
  children,
}: AppShellProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const displayFarmBadge = `${farmName} — ${farmerLocation}`

  function isRouteActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1C251E] flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar (#163020) */}
      <aside className="hidden lg:flex lg:w-72 xl:w-76 shrink-0 flex-col justify-between bg-[#163020] text-[#F5F2EB] border-r border-[#274B35] p-6 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link
            href="/"
            className="flex items-center gap-3 pb-4 border-b border-[#274B35]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2D6A4F] border border-[#40916C]/40 text-[#F5F2EB] shadow-xs">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xl font-extrabold tracking-tight text-[#F5F2EB]">
                SEMAI
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#95D5B2]">
                TUMBUH BERSAMA
              </span>
            </div>
          </Link>

          {/* Farm Selector Badge */}
          <div className="rounded-2xl bg-[#1E3F2B] border border-[#2F5E41] p-3.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#95D5B2]">
              Ladang Berdaftar • {farmerName}
            </span>
            <p className="mt-1 text-sm font-bold text-[#F5F2EB] leading-snug">
              {displayFarmBadge}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#B8CEC0]">
              <MapPin className="h-3.5 w-3.5 text-[#74C69D]" />
              <span>{activePlotCount} Petak Tanaman Aktif</span>
            </div>
          </div>

          {/* 5 Dedicated Route Links */}
          <nav aria-label="Navigasi Utama SEMAI" className="space-y-1.5">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon
              const active = isRouteActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#2D6A4F] text-[#F5F2EB] shadow-xs"
                      : "text-[#B8CEC0] hover:bg-[#1E3F2B] hover:text-[#F5F2EB]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Season Progress Widget + Login Link */}
        <div className="space-y-4 pt-6 border-t border-[#274B35]">
          <div className="rounded-2xl bg-[#1B3926] border border-[#2D573D] p-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold uppercase tracking-wider text-[#95D5B2]">
                Kemajuan Musim
              </span>
              <span className="font-extrabold text-[#F5F2EB]">
                Minggu ke-13
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#12261A]">
              <div
                className="h-full rounded-full bg-[#52B788]"
                style={{ width: "68%" }}
              />
            </div>
            <p className="mt-2 text-xs text-[#B8CEC0]">
              Musim Timur Laut • 68% kitaran tanaman selesai
            </p>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-between rounded-xl border border-[#2D573D] bg-[#1E3F2B]/70 px-3.5 py-2.5 text-xs font-semibold text-[#D8E6DF] hover:bg-[#2D6A4F] transition-colors"
          >
            <span>Halaman Log Masuk / Demo</span>
            <LogOut className="h-4 w-4 text-[#95D5B2]" />
          </Link>
        </div>
      </aside>

      {/* Mobile Top Header & Collapsible Drawer */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#163020] text-[#F5F2EB] border-b border-[#274B35] px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D6A4F] text-[#F5F2EB]">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-base font-extrabold leading-none">
                SEMAI — TUMBUH BERSAMA
              </span>
              <span className="block text-[11px] text-[#95D5B2] mt-0.5">
                {displayFarmBadge}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3F2B] text-[#F5F2EB]"
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-[#274B35] space-y-1.5">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon
              const active = isRouteActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                    active
                      ? "bg-[#2D6A4F] text-[#F5F2EB]"
                      : "text-[#B8CEC0] hover:bg-[#1E3F2B]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#274B35] text-xs text-[#95D5B2]">
              <span>Musim Semasa: Minggu ke-13</span>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="underline font-bold text-[#F5F2EB]"
              >
                Tukar Akaun / Login
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Warm-Cream Workspace */}
      <div className="flex-1 min-w-0 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (5 Consolidated Tabs, h-12 thumb-friendly) */}
      <nav
        aria-label="Navigasi Bawah Mudah Alih"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E2DDD2] bg-[#FAF8F3]/95 backdrop-blur-md lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1 px-2 py-1.5">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon
            const active = isRouteActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-12 flex-col items-center justify-center rounded-xl px-1 text-[11px] font-bold transition-colors ${
                  active
                    ? "bg-[#163020] text-[#F5F2EB]"
                    : "text-[#5A655D] hover:text-[#1C251E]"
                }`}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span className="truncate max-w-full">{item.shortLabel}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
