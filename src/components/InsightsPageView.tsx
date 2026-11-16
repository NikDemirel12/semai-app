"use client"

import { useState } from "react"
import {
  Sparkles,
  Award,
  CheckSquare,
  Square,
  Sliders,
  ShieldCheck,
  TrendingUp,
} from "lucide-react"
import AppShell from "./AppShell"
import type { DashboardPlot } from "./SemaiDashboard"
import { formatRM } from "./FinancialSummaryCard"

interface InsightsPageViewProps {
  farmerName: string
  farmerLocation: string
  farmName: string
  plots: DashboardPlot[]
}

interface MyGapItem {
  id: string
  code: string
  title: string
  description: string
  completed: boolean
}

const INITIAL_MYGAP_ITEMS: MyGapItem[] = [
  {
    id: "gap-1",
    code: "MyGAP 1.1",
    title: "Rekod Penggunaan Racun Perosak & Patuh Tempoh PHI",
    description:
      "Semua semburan racun dicatat tarikh, sukatan, dan mematuhi Tempoh Dilarang Mengutip Hasil (Pre-Harvest Interval).",
    completed: true,
  },
  {
    id: "gap-2",
    code: "MyGAP 2.3",
    title: "Stor Penyimpanan Baja & Racun Berasingan dan Berkunci",
    description:
      "Racun makhluk perosak disimpan berasingan daripada benih dan baja di bilik berventilasi.",
    completed: true,
  },
  {
    id: "gap-3",
    code: "MyGAP 3.1",
    title: "Amalan Kawalan Perosak Bersepadu (IPM) & Perangkap Kuning",
    description:
      "Menggunakan perangkap lekat kuning dan kawalan biologi (Neem) sebelum racun kimia.",
    completed: true,
  },
  {
    id: "gap-4",
    code: "MyGAP 4.2",
    title: "Sumber Air Pengairan Bersih & Saliran Parit Terkawal",
    description:
      "Air kolam / tali air bebas pencemaran sisa industri dan penapis paip drip dicuci mingguan.",
    completed: true,
  },
  {
    id: "gap-5",
    code: "MyGAP 5.1",
    title: "Amalan Bilas Tiga Kali (Triple Rinsing) Bekas Racun Kosong",
    description:
      "Bekas racun kosong dibilas 3 kali, ditebuk, dan dikumpul untuk pelupusan selamat Jabatan Pertanian.",
    completed: false,
  },
  {
    id: "gap-6",
    code: "MyGAP 6.4",
    title: "Kebersihan Bakul Tuai & Tempat Penggredan Hasil",
    description:
      "Bakul cili dan guni padi dibersihkan serta diletakkan di atas palet kering semasa tuaian.",
    completed: true,
  },
]

export default function InsightsPageView({
  farmerName,
  farmerLocation,
  farmName,
  plots,
}: InsightsPageViewProps) {
  const [selectedPlotId, setSelectedPlotId] = useState(plots[0]?.id ?? "")
  const [healthFactor, setHealthFactor] = useState<number>(1.0)
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1.0)
  const [hiddenCostSavingPct, setHiddenCostSavingPct] = useState<number>(25)
  const [myGapItems, setMyGapItems] = useState<MyGapItem[]>(INITIAL_MYGAP_ITEMS)

  const selectedPlot =
    plots.find((p) => p.id === selectedPlotId) ?? plots[0]

  if (!selectedPlot) {
    return null
  }

  // Scenario Calculator Computations
  const baseYieldKg = selectedPlot.areaSize * selectedPlot.baselineYield
  const simulatedYieldKg = Math.round(baseYieldKg * healthFactor)
  const simulatedMarketPrice = +(
    selectedPlot.marketPriceEst * priceMultiplier
  ).toFixed(2)
  const simulatedRevenue = simulatedYieldKg * simulatedMarketPrice

  const savedHiddenCost =
    selectedPlot.forecast.totalHiddenCost * (hiddenCostSavingPct / 100)
  const simulatedTotalCost =
    selectedPlot.forecast.totalCost - savedHiddenCost
  const simulatedNetProfit = simulatedRevenue - simulatedTotalCost
  const profitDelta =
    simulatedNetProfit - selectedPlot.forecast.projectedNetProfit

  function toggleMyGap(id: string) {
    setMyGapItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const completedMyGap = myGapItems.filter((i) => i.completed).length
  const myGapScore = Math.round((completedMyGap / myGapItems.length) * 100)

  return (
    <AppShell
      farmerName={farmerName}
      farmerLocation={farmerLocation}
      farmName={farmName}
      activePlotCount={plots.length}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E2DDD2]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2D6A4F]">
              Simulasi Pintar &amp; Pensijilan Ladang
            </span>
            <h1 className="mt-1 font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C251E]">
              SEMAI Insights &amp; MyGAP
            </h1>
            <p className="mt-1 text-sm text-[#5A655D]">
              Uji senario harga pasaran dan kesihatan tanaman serta semak
              kesediaan pensijilan MyGAP Jabatan Pertanian Malaysia.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-[#163020] text-[#F5F2EB] px-4 py-2.5">
            <Award className="h-5 w-5 text-[#95D5B2]" />
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#95D5B2] font-bold">
                Skor Kesediaan MyGAP
              </span>
              <span className="font-serif-editorial text-lg font-bold">
                {myGapScore}% ({completedMyGap}/{myGapItems.length} Kriteria)
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Yield Forecast Scenario Calculator */}
          <section className="lg:col-span-6 rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Simulasi Unjuran Hasil
                </span>
                <h2 className="font-serif-editorial text-xl font-bold text-[#1C251E] flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#2D6A4F]" />
                  Kalkulator Senario Hasil &amp; Untung
                </h2>
              </div>
            </div>

            {/* Plot Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5A655D] mb-2">
                Pilih Plot untuk Simulasi
              </label>
              <div className="grid grid-cols-2 gap-2">
                {plots.map((plot) => (
                  <button
                    key={plot.id}
                    type="button"
                    onClick={() => setSelectedPlotId(plot.id)}
                    className={`h-11 rounded-xl border px-3 text-xs font-bold transition-colors ${
                      plot.id === selectedPlot.id
                        ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                        : "border-[#E2DDD2] bg-[#F5F2EB] text-[#4A554E]"
                    }`}
                  >
                    {plot.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 rounded-2xl bg-[#F5F2EB] border border-[#E2DDD2] p-4">
              {/* Slider 1: Health Factor */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#1C251E]">
                    1. Faktor Kesihatan Tanaman &amp; Cuaca
                  </span>
                  <span className="font-extrabold text-[#2D6A4F]">
                    {Math.round(healthFactor * 100)}% ({healthFactor.toFixed(2)}x)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.25"
                  step="0.05"
                  value={healthFactor}
                  onChange={(e) => setHealthFactor(parseFloat(e.target.value))}
                  className="w-full accent-[#163020]"
                />
                <div className="flex justify-between text-[11px] text-[#5A655D]">
                  <span>0.70x (Cuaca Ekstrem)</span>
                  <span>1.00x (Normal)</span>
                  <span>1.25x (Optimum)</span>
                </div>
              </div>

              {/* Slider 2: Market Price Multiplier */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#1C251E]">
                    2. Simulasi Harga PasaranBorong
                  </span>
                  <span className="font-extrabold text-[#2D6A4F]">
                    RM {simulatedMarketPrice.toFixed(2)} / kg
                  </span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={priceMultiplier}
                  onChange={(e) =>
                    setPriceMultiplier(parseFloat(e.target.value))
                  }
                  className="w-full accent-[#163020]"
                />
                <div className="flex justify-between text-[11px] text-[#5A655D]">
                  <span>-25% Harga Jatuh</span>
                  <span>Harga Asal (RM {selectedPlot.marketPriceEst.toFixed(2)})</span>
                  <span>+35% Musim Perayaan</span>
                </div>
              </div>

              {/* Slider 3: Hidden Cost Reduction */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#1C251E]">
                    3. Sasaran Penjimatan Kos Tersembunyi
                  </span>
                  <span className="font-extrabold text-[#B45309]">
                    -{hiddenCostSavingPct}% (Jimat RM {formatRM(savedHiddenCost)})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={hiddenCostSavingPct}
                  onChange={(e) =>
                    setHiddenCostSavingPct(parseInt(e.target.value, 10))
                  }
                  className="w-full accent-[#B45309]"
                />
              </div>
            </div>

            {/* Simulated Results Box */}
            <div className="rounded-2xl bg-[#163020] text-[#F5F2EB] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#95D5B2] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Keputusan Simulasi ({selectedPlot.name})
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    profitDelta >= 0
                      ? "bg-[#2D6A4F] text-[#B7E4C7]"
                      : "bg-[#C2410C] text-[#FAF8F3]"
                  }`}
                >
                  {profitDelta >= 0 ? "+" : "-"} RM{" "}
                  {formatRM(Math.abs(profitDelta))} berbanding asal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="rounded-xl bg-[#1E3F2B] border border-[#2D573D] p-3">
                  <span className="text-[11px] text-[#A7C4B5] block">
                    Hasil Simulasi
                  </span>
                  <strong className="font-serif-editorial text-lg text-[#F5F2EB]">
                    {simulatedYieldKg.toLocaleString("ms-MY")} kg
                  </strong>
                </div>

                <div className="rounded-xl bg-[#1E3F2B] border border-[#2D573D] p-3">
                  <span className="text-[11px] text-[#A7C4B5] block">
                    Jualan Kasar
                  </span>
                  <strong className="font-serif-editorial text-lg text-[#F5F2EB]">
                    RM {formatRM(simulatedRevenue)}
                  </strong>
                </div>

                <div className="rounded-xl bg-[#2D6A4F] border border-[#52B788]/40 p-3">
                  <span className="text-[11px] text-[#D8E6DF] block font-semibold">
                    Untung Bersih
                  </span>
                  <strong className="font-serif-editorial text-lg text-[#F5F2EB]">
                    RM {formatRM(simulatedNetProfit)}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Interactive MyGAP Compliance Checklist */}
          <section className="lg:col-span-6 rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Malaysian Good Agricultural Practices
                </span>
                <h2 className="font-serif-editorial text-xl font-bold text-[#1C251E] flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#2D6A4F]" />
                  Senarai Semak Pematuhan MyGAP
                </h2>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#2D6A4F]/15 px-3 py-1 text-xs font-extrabold text-[#163020]">
                <TrendingUp className="h-3.5 w-3.5 text-[#2D6A4F]" />
                {myGapScore}% Sedia Audit
              </span>
            </div>

            {/* Progress Bar */}
            <div className="rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-3.5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-[#4A554E]">
                  Tahap Pematuhan Standard Jabatan Pertanian
                </span>
                <span className="font-extrabold text-[#163020]">
                  {completedMyGap} daripada {myGapItems.length} Lengkap
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E2DDD2]">
                <div
                  className="h-full rounded-full bg-[#2D6A4F] transition-all duration-300"
                  style={{ width: `${myGapScore}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5">
              {myGapItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleMyGap(item.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    item.completed
                      ? "bg-[#EFF5F1] border-[#2D6A4F]/35"
                      : "bg-[#F5F2EB] border-[#E2DDD2] hover:border-[#2D6A4F]"
                  }`}
                >
                  <div className="mt-0.5 text-[#2D6A4F] shrink-0">
                    {item.completed ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5 text-[#7A847C]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#163020] px-2 py-0.5 text-[10px] font-bold text-[#F5F2EB]">
                        {item.code}
                      </span>
                      <span className="text-sm font-bold text-[#1C251E]">
                        {item.title}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#4A554E] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
