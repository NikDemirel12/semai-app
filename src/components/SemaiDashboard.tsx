"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  ClipboardPlus,
  AlertTriangle,
  ArrowRight,
  Sprout,
  Receipt,
} from "lucide-react"
import type { PlotForecast } from "@/lib/forecasting"
import AppShell from "./AppShell"
import WeatherWidget from "./WeatherWidget"
import FarmMapCard from "./FarmMapCard"
import FinancialSummaryCard, {
  formatRM,
  type HarvestLogItem,
} from "./FinancialSummaryCard"
import type { FeedActivity, FeedExpense } from "./ActivityExpenseFeed"
import QuickActionModals from "./QuickActionModals"

export interface DashboardPlot {
  id: string
  name: string
  areaSize: number
  areaUnit: string
  cropType: string
  plantingDate: Date | string
  expectedHarvest: Date | string
  baselineYield: number
  marketPriceEst: number
  status: string
  farmId: string
  activities: FeedActivity[]
  expenses: FeedExpense[]
  harvests: HarvestLogItem[]
  forecast: PlotForecast
}

interface SemaiDashboardProps {
  farmerName: string
  farmerLocation: string
  farmId: string
  farmName: string
  plots: DashboardPlot[]
  overallAnalytics: PlotForecast
}

const ACTIVITY_LABELS_BM: Record<string, string> = {
  PEMBAJAAN: "Membaja",
  KAWALAN_PEROSAK: "Meracun & Kawalan Perosak",
  MENYIRAM: "Menyiram & Pengairan",
  KAWALAN_AIR: "Kawalan Air Sawah",
  PENYEDIAAN_TANAH: "Penyediaan Tanah & Bajak",
  PENYELENGGARAAN: "Penyelenggaraan Kebun",
  MERUMPAI: "Merumpai & Bersih Batas",
}

export default function SemaiDashboard({
  farmerName,
  farmerLocation,
  farmId,
  farmName,
  plots,
  overallAnalytics,
}: SemaiDashboardProps) {
  const [selectedPlotId, setSelectedPlotId] = useState<string>(
    plots[0]?.id ?? ""
  )
  const [showOverallSummary, setShowOverallSummary] = useState(false)
  const [activeModal, setActiveModal] = useState<"EXPENSE" | "ACTIVITY" | null>(
    null
  )
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false)
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false)

  const selectedPlot =
    plots.find((p) => p.id === selectedPlotId) ?? plots[0]

  if (!selectedPlot) {
    return null
  }

  const todayFormatted = new Intl.DateTimeFormat("ms-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())

  const displayFarmer = farmerName || "Pak Ahmad"
  const displayFarmBadge = `${farmName || "Kebun Hijau Ahmad"} — ${
    farmerLocation || "Pendang, Kedah"
  }`

  // Gather top 3 latest alerts / activities for the executive summary
  const criticalPlots = plots.filter((p) => p.forecast.isHiddenCostCritical)
  const recentActivities = selectedPlot.activities.slice(0, 2)

  return (
    <AppShell
      farmerName={displayFarmer}
      farmerLocation={farmerLocation || "Pendang, Kedah"}
      farmName={farmName || "Kebun Hijau Ahmad"}
      activePlotCount={plots.length}
    >
      <div className="space-y-6">
        {/* 1. Editorial Greeting & Quick Actions */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E2DDD2]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2D6A4F]">
              {todayFormatted} • Minggu ke-13
            </p>
            <h1 className="mt-1 font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C251E]">
              Selamat pagi, {displayFarmer}
            </h1>
            <p className="mt-1 text-sm text-[#5A655D]">
              {displayFarmBadge} • Memantau{" "}
              <strong className="text-[#1C251E]">
                {plots.length} plot aktif
              </strong>{" "}
              dengan sasaran hasil{" "}
              <strong className="text-[#2D6A4F]">
                {overallAnalytics.projectedYieldKg.toLocaleString("ms-MY")} kg
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveModal("ACTIVITY")}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#E2DDD2] bg-[#FAF8F3] px-4 text-sm font-bold text-[#1C251E] hover:border-[#2D6A4F] transition-colors shadow-2xs"
            >
              <ClipboardPlus className="h-4 w-4 text-[#2D6A4F]" />
              <span>Log Aktiviti</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("EXPENSE")}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#163020] px-5 text-sm font-bold text-[#F5F2EB] hover:bg-[#234832] transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>+ Rekod baharu</span>
            </button>
          </div>
        </header>

        {/* 2. Interactive Farm Map ("Peta Kebun — Lakaran") & Almanak Hari Ini Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 flex">
            <div className="w-full">
              <FarmMapCard
                plots={plots}
                selectedPlotId={selectedPlot.id}
                showOverall={showOverallSummary}
                onSelectPlot={(id) => {
                  setSelectedPlotId(id)
                  setShowOverallSummary(false)
                }}
                onSelectOverall={() => setShowOverallSummary(true)}
                onOpenAddPlot={() => setIsAddPlotOpen(true)}
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <div className="w-full">
              <WeatherWidget
                nextHarvestPlotName={selectedPlot.name}
                nextHarvestDate={selectedPlot.expectedHarvest}
                nextHarvestYieldKg={selectedPlot.forecast.projectedYieldKg}
              />
            </div>
          </div>
        </div>

        {/* 3. 4 Financial & Yield KPI Cards */}
        <FinancialSummaryCard
          plotName={selectedPlot.name}
          cropType={selectedPlot.cropType}
          areaSize={selectedPlot.areaSize}
          areaUnit={selectedPlot.areaUnit}
          marketPriceEst={selectedPlot.marketPriceEst}
          expectedHarvest={selectedPlot.expectedHarvest}
          forecast={selectedPlot.forecast}
          overallForecast={overallAnalytics}
          harvests={selectedPlot.harvests}
          showOverall={showOverallSummary}
          onToggleScope={setShowOverallSummary}
          onOpenHarvestModal={() => setIsHarvestModalOpen(true)}
        />

        {/* 4. Top 3 Latest Alerts & Activities (Compact Executive Digest) */}
        <section className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#E2DDD2]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D6A4F]">
                Sorotan Ringkas Hari Ini
              </span>
              <h2 className="font-serif-editorial text-xl font-semibold text-[#1C251E]">
                3 Amaran &amp; Aktiviti Terkini ({selectedPlot.name})
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <Link
                href="/plots"
                className="inline-flex items-center gap-1 text-[#2D6A4F] hover:text-[#163020]"
              >
                <span>Semua Aktiviti</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-[#E2DDD2]">•</span>
              <Link
                href="/finance"
                className="inline-flex items-center gap-1 text-[#B45309] hover:text-[#9A3412]"
              >
                <span>Audit Kewangan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Item 1: Hidden Cost Alert or Budget Status */}
            {criticalPlots[0] ? (
              <Link
                href="/finance"
                className="group flex flex-col justify-between rounded-xl border border-[#C2410C]/40 bg-[#FEF7F0] p-4 transition-all hover:border-[#C2410C]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#C2410C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FAF8F3]">
                      <AlertTriangle className="h-3 w-3" />
                      Amaran Kos &gt;20%
                    </span>
                    <span className="text-xs font-extrabold text-[#C2410C]">
                      {criticalPlots[0].forecast.hiddenCostPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <h3 className="mt-2 font-bold text-sm text-[#1C251E]">
                    {criticalPlots[0].name}
                  </h3>
                  <p className="mt-1 text-xs text-[#4A554E] leading-relaxed">
                    Kos tersembunyi mencecah RM{" "}
                    {formatRM(criticalPlots[0].forecast.totalHiddenCost)} (upah,
                    minyak &amp; baiki paip).
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#C2410C] group-hover:underline">
                  Semak lejar kos penuh <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ) : (
              <Link
                href="/finance"
                className="flex flex-col justify-between rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] p-4"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#2D6A4F]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#163020]">
                    <Receipt className="h-3 w-3" />
                    Status Bajet
                  </span>
                  <h3 className="mt-2 font-bold text-sm text-[#1C251E]">
                    Kos Tersembunyi Terkawal
                  </h3>
                  <p className="mt-1 text-xs text-[#5A655D]">
                    Semua perbelanjaan sampingan berada di bawah paras 20%.
                  </p>
                </div>
                <span className="mt-3 text-xs font-bold text-[#2D6A4F]">
                  Lihat Kewangan &rarr;
                </span>
              </Link>
            )}

            {/* Items 2 & 3: Top 2 Latest Activities */}
            {recentActivities.map((act) => (
              <Link
                key={act.id}
                href="/plots"
                className="group flex flex-col justify-between rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] p-4 hover:border-[#2D6A4F] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#2D6A4F]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#163020]">
                      <Sprout className="h-3 w-3 text-[#2D6A4F]" />
                      {ACTIVITY_LABELS_BM[act.type] ?? act.type}
                    </span>
                    <span className="text-xs text-[#5A655D]">
                      {new Date(act.date).toLocaleDateString("ms-MY", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <h3 className="mt-2 font-bold text-sm text-[#1C251E]">
                    {selectedPlot.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#4A554E] leading-relaxed line-clamp-2">
                    {act.notes || "Rekod kerja penyelenggaraan petak tanaman."}
                  </p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#2D6A4F] group-hover:underline">
                  Lihat garis masa plot <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Action Modals */}
      <QuickActionModals
        selectedPlotId={selectedPlot.id}
        plots={plots.map((p) => ({
          id: p.id,
          name: p.name,
          cropType: p.cropType,
          projectedYieldKg: p.forecast.projectedYieldKg,
          projectedRevenue: p.forecast.projectedRevenue,
          marketPriceEst: p.marketPriceEst,
          harvests: p.harvests,
        }))}
        farmId={farmId}
        activeModal={activeModal}
        onSetActiveModal={setActiveModal}
        isAddPlotOpen={isAddPlotOpen}
        onCloseAddPlot={() => setIsAddPlotOpen(false)}
        isHarvestModalOpen={isHarvestModalOpen}
        onCloseHarvestModal={() => setIsHarvestModalOpen(false)}
      />
    </AppShell>
  )
}
