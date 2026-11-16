"use client"

import { useState } from "react"
import {
  Plus,
  Scale,
  AlertCircle,
  CheckCircle2,
  Receipt,
  Sprout,
} from "lucide-react"
import type { PlotForecast } from "@/lib/forecasting"
import AppShell from "./AppShell"
import type { DashboardPlot } from "./SemaiDashboard"
import HiddenCostAlertBanner from "./HiddenCostAlertBanner"
import CostComparisonChart from "./CostComparisonChart"
import { formatRM } from "./FinancialSummaryCard"
import QuickActionModals from "./QuickActionModals"

interface FinancePageViewProps {
  farmerName: string
  farmerLocation: string
  farmId: string
  farmName: string
  plots: DashboardPlot[]
  overallAnalytics: PlotForecast
}

export default function FinancePageView({
  farmerName,
  farmerLocation,
  farmId,
  farmName,
  plots,
  overallAnalytics,
}: FinancePageViewProps) {
  const [selectedPlotId, setSelectedPlotId] = useState<string>(
    plots[0]?.id ?? ""
  )
  const [showOverall, setShowOverall] = useState(false)
  const [costTypeFilter, setCostTypeFilter] = useState<
    "ALL" | "DIRECT" | "HIDDEN"
  >("ALL")
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

  const activeForecast = showOverall ? overallAnalytics : selectedPlot.forecast
  const activeExpenses = showOverall
    ? plots
        .flatMap((p) =>
          p.expenses.map((e) => ({ ...e, plotName: p.name }))
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : selectedPlot.expenses.map((e) => ({
        ...e,
        plotName: selectedPlot.name,
      }))

  const filteredExpenses = activeExpenses.filter((exp) => {
    if (costTypeFilter === "DIRECT") return !exp.isHidden
    if (costTypeFilter === "HIDDEN") return exp.isHidden
    return true
  })

  const activeHarvests = showOverall
    ? plots.flatMap((p) =>
        p.harvests.map((h) => ({ ...h, plotName: p.name }))
      )
    : selectedPlot.harvests.map((h) => ({
        ...h,
        plotName: selectedPlot.name,
      }))

  const totalActualWeight = activeHarvests.reduce(
    (s, h) => s + h.actualWeight,
    0
  )
  const totalActualRevenue = activeHarvests.reduce(
    (s, h) => s + h.totalRevenue,
    0
  )

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
              Audit Aliran Tunai &amp; Hasil Tuai
            </span>
            <h1 className="mt-1 font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C251E]">
              Kewangan &amp; Tuaian
            </h1>
            <p className="mt-1 text-sm text-[#5A655D]">
              Pecahan terperinci Kos Langsung lawan Kos Tersembunyi (&gt;20%
              amaran bajet) serta buku rekod hasil tuaian sebenar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsHarvestModalOpen(true)}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#2D6A4F] bg-[#FAF8F3] px-4 text-sm font-bold text-[#163020] hover:bg-[#EAE5D9] transition-colors"
            >
              <Scale className="h-4 w-4 text-[#2D6A4F]" />
              <span>Rekod Tuai</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("EXPENSE")}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#163020] px-5 text-sm font-bold text-[#F5F2EB] hover:bg-[#234832] transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>+ Catat Kos</span>
            </button>
          </div>
        </header>

        {/* Plot / Scope Selector Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOverall(true)}
            className={`h-11 rounded-xl border px-4 text-xs font-bold transition-colors ${
              showOverall
                ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                : "border-[#E2DDD2] bg-[#FAF8F3] text-[#4A554E] hover:border-[#2D6A4F]"
            }`}
          >
            Semua Petak ({plots.length})
          </button>

          {plots.map((plot) => {
            const active = !showOverall && plot.id === selectedPlot.id
            return (
              <button
                key={plot.id}
                type="button"
                onClick={() => {
                  setSelectedPlotId(plot.id)
                  setShowOverall(false)
                }}
                className={`h-11 rounded-xl border px-4 text-xs font-bold transition-colors ${
                  active
                    ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                    : "border-[#E2DDD2] bg-[#FAF8F3] text-[#4A554E] hover:border-[#2D6A4F]"
                }`}
              >
                {plot.name}
              </button>
            )
          })}
        </div>

        {/* Hidden Cost (>20%) Audit Alert */}
        <HiddenCostAlertBanner
          plotName={showOverall ? "Semua Petak Kebun" : selectedPlot.name}
          forecast={activeForecast}
        />

        {/* Detailed Direct vs Hidden Cost Breakdown + Recharts Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Direct vs Hidden Breakdown Cards & Harvest Recording Section */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Perincian Struktur Kos
                </span>
                <h2 className="font-serif-editorial text-xl font-bold text-[#1C251E]">
                  Kos Langsung vs Kos Tersembunyi
                </h2>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#163020]">
                      Kos Langsung (DIRECT)
                    </span>
                    <span className="font-semibold text-[#5A655D]">
                      {(100 - activeForecast.hiddenCostPercentage).toFixed(1)}%
                    </span>
                  </div>
                  <p className="mt-1 font-serif-editorial text-2xl font-bold text-[#1C251E]">
                    RM {formatRM(activeForecast.totalDirectCost)}
                  </p>
                  <p className="text-xs text-[#5A655D] mt-0.5">
                    Benih tanaman, Baja AB/NPK, dan Racun perosak/rumpai.
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3.5 ${
                    activeForecast.isHiddenCostCritical
                      ? "bg-[#FEF7F0] border-[#C2410C]/40"
                      : "bg-[#F5F2EB] border-[#E2DDD2]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C2410C]">
                      Kos Tersembunyi (HIDDEN)
                    </span>
                    <span className="font-extrabold text-[#C2410C]">
                      {activeForecast.hiddenCostPercentage.toFixed(1)}% (Had:
                      20%)
                    </span>
                  </div>
                  <p className="mt-1 font-serif-editorial text-2xl font-bold text-[#C2410C]">
                    RM {formatRM(activeForecast.totalHiddenCost)}
                  </p>
                  <p className="text-xs text-[#4A554E] mt-0.5">
                    Minyak mesin rumput/pam, upah harian, pengangkutan &amp;
                    baiki alat.
                  </p>
                </div>
              </div>
            </div>

            {/* HarvestLog Recording Section */}
            <div className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                    Rekod Hasil Tuai (HarvestLog)
                  </span>
                  <h2 className="font-serif-editorial text-xl font-bold text-[#1C251E]">
                    Sasaran vs Tuaian Sebenar
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHarvestModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#163020] px-3.5 py-2 text-xs font-bold text-[#F5F2EB] hover:bg-[#2D6A4F]"
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>+ Rekod Tuai</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-3">
                  <span className="text-xs text-[#5A655D] block">
                    Hasil Dijangka
                  </span>
                  <strong className="font-serif-editorial text-lg text-[#1C251E]">
                    {activeForecast.projectedYieldKg.toLocaleString("ms-MY")} kg
                  </strong>
                  <span className="text-xs text-[#5A655D] block">
                    RM {formatRM(activeForecast.projectedRevenue)}
                  </span>
                </div>

                <div className="rounded-xl bg-[#2D6A4F]/12 border border-[#2D6A4F]/30 p-3">
                  <span className="text-xs font-semibold text-[#163020] block">
                    Tuaian Sebenar
                  </span>
                  <strong className="font-serif-editorial text-lg text-[#2D6A4F]">
                    {totalActualWeight.toLocaleString("ms-MY")} kg
                  </strong>
                  <span className="text-xs font-semibold text-[#163020] block">
                    RM {formatRM(totalActualRevenue)}
                  </span>
                </div>
              </div>

              {activeHarvests.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E2DDD2]">
                  {activeHarvests.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-xl bg-[#F5F2EB] px-3 py-2 text-xs"
                    >
                      <span className="font-bold text-[#1C251E] inline-flex items-center gap-1.5">
                        <Sprout className="h-3.5 w-3.5 text-[#2D6A4F]" />
                        {h.actualWeight.toLocaleString("ms-MY")} kg @ RM{" "}
                        {h.soldPrice.toFixed(2)}/kg
                      </span>
                      <span className="font-extrabold text-[#2D6A4F]">
                        + RM {formatRM(h.totalRevenue)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Interactive Recharts Comparison */}
          <div className="lg:col-span-7">
            <CostComparisonChart
              plotName={
                showOverall ? "Keseluruhan Ladang" : selectedPlot.name
              }
              forecast={activeForecast}
            />
          </div>
        </div>

        {/* Full Expense Ledger Table */}
        <section className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2DDD2]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D6A4F]">
                Buku Lejar Perbelanjaan
              </span>
              <h2 className="font-serif-editorial text-xl font-semibold text-[#1C251E] flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#B45309]" />
                Senarai Penuh Kos ({filteredExpenses.length} Transaksi)
              </h2>
            </div>

            <div className="flex rounded-xl bg-[#EAE5D9] p-1 border border-[#E2DDD2] text-xs font-bold">
              <button
                type="button"
                onClick={() => setCostTypeFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  costTypeFilter === "ALL"
                    ? "bg-[#163020] text-[#F5F2EB]"
                    : "text-[#5A655D]"
                }`}
              >
                Semua ({activeExpenses.length})
              </button>
              <button
                type="button"
                onClick={() => setCostTypeFilter("DIRECT")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  costTypeFilter === "DIRECT"
                    ? "bg-[#163020] text-[#F5F2EB]"
                    : "text-[#5A655D]"
                }`}
              >
                Langsung
              </button>
              <button
                type="button"
                onClick={() => setCostTypeFilter("HIDDEN")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  costTypeFilter === "HIDDEN"
                    ? "bg-[#C2410C] text-[#FAF8F3]"
                    : "text-[#5A655D]"
                }`}
              >
                Tersembunyi
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2DDD2] text-xs font-bold uppercase tracking-wider text-[#5A655D]">
                  <th className="py-3 px-3">Tarikh</th>
                  <th className="py-3 px-3">Butiran Perbelanjaan</th>
                  <th className="py-3 px-3">Lot Tanaman</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3 text-right">Jumlah (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD2]">
                {filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className={
                      exp.isHidden ? "bg-[#FEF7F0]/70" : "hover:bg-[#F5F2EB]/60"
                    }
                  >
                    <td className="py-3.5 px-3 text-xs font-medium text-[#5A655D] whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString("ms-MY", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#1C251E]">
                      {exp.title}
                    </td>
                    <td className="py-3.5 px-3 text-xs text-[#4A554E]">
                      {exp.plotName}
                    </td>
                    <td className="py-3.5 px-3">
                      {exp.isHidden ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#C2410C]/15 border border-[#C2410C]/30 px-2 py-0.5 text-[11px] font-extrabold text-[#C2410C]">
                          <AlertCircle className="h-3 w-3" />
                          KOS TERSEMBUNYI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 px-2 py-0.5 text-[11px] font-bold text-[#163020]">
                          <CheckCircle2 className="h-3 w-3" />
                          KOS LANGSUNG
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3.5 px-3 text-right font-serif-editorial font-bold whitespace-nowrap ${
                        exp.isHidden ? "text-[#C2410C]" : "text-[#1C251E]"
                      }`}
                    >
                      RM {formatRM(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

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
