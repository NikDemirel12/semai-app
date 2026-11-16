"use client"

import {
  TrendingUp,
  Wallet,
  Sprout,
  Scale,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import type { PlotForecast } from "@/lib/forecasting"

export interface HarvestLogItem {
  id: string
  actualWeight: number
  soldPrice: number
  totalRevenue: number
  date: Date | string
}

interface FinancialSummaryCardProps {
  plotName: string
  cropType: string
  areaSize: number
  areaUnit: string
  marketPriceEst: number
  expectedHarvest: Date | string
  forecast: PlotForecast
  overallForecast: PlotForecast
  harvests: HarvestLogItem[]
  showOverall: boolean
  onToggleScope: (showOverall: boolean) => void
  onOpenHarvestModal: () => void
}

export function formatRM(value: number): string {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export default function FinancialSummaryCard({
  plotName,
  cropType,
  areaSize,
  areaUnit,
  marketPriceEst,
  forecast,
  overallForecast,
  harvests,
  showOverall,
  onToggleScope,
  onOpenHarvestModal,
}: FinancialSummaryCardProps) {
  const activeForecast = showOverall ? overallForecast : forecast

  const totalActualWeight = harvests.reduce(
    (sum, h) => sum + h.actualWeight,
    0
  )
  const totalActualRevenue = harvests.reduce(
    (sum, h) => sum + h.totalRevenue,
    0
  )

  return (
    <section aria-label="4 Kad Ringkasan Kewangan dan Tuaian" className="space-y-3">
      {/* Scope Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#2D6A4F]">
            Prestasi Kewangan &amp; Hasil
          </span>
          <h2 className="font-serif-editorial text-xl font-semibold text-[#1C251E]">
            {showOverall
              ? "Ringkasan Semua Petak Kebun"
              : `${plotName} (${cropType} • ${areaSize} ${areaUnit})`}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-[#EAE5D9] p-1 border border-[#E2DDD2] text-xs font-bold">
            <button
              type="button"
              onClick={() => onToggleScope(false)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                !showOverall
                  ? "bg-[#163020] text-[#F5F2EB]"
                  : "text-[#4A554E] hover:text-[#1C251E]"
              }`}
            >
              Plot Dipilih
            </button>
            <button
              type="button"
              onClick={() => onToggleScope(true)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                showOverall
                  ? "bg-[#163020] text-[#F5F2EB]"
                  : "text-[#4A554E] hover:text-[#1C251E]"
              }`}
            >
              Keseluruhan Kebun
            </button>
          </div>
        </div>
      </div>

      {/* 4 Financial & Yield KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* KPI 1: Jualan (RM) */}
        <div className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A655D]">
              1. Jualan (RM)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F]/12 text-[#2D6A4F]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="my-2">
            <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C251E]">
              RM {formatRM(activeForecast.projectedRevenue)}
            </p>
          </div>

          <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs text-[#5A655D]">
            <span>Anggaran RM {marketPriceEst.toFixed(2)}/kg</span>
            {totalActualRevenue > 0 && (
              <span className="font-bold text-[#2D6A4F]">
                Sebenar: RM {formatRM(totalActualRevenue)}
              </span>
            )}
          </div>
        </div>

        {/* KPI 2: Perbelanjaan (RM) */}
        <div className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A655D]">
              2. Perbelanjaan (RM)
            </span>
            {activeForecast.isHiddenCostCritical ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C2410C]/15 border border-[#C2410C]/35 px-2 py-0.5 text-[11px] font-extrabold text-[#C2410C]">
                <AlertTriangle className="h-3 w-3" />
                Tersembunyi {activeForecast.hiddenCostPercentage.toFixed(0)}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#2D6A4F]/15 px-2 py-0.5 text-[11px] font-bold text-[#2D6A4F]">
                <CheckCircle2 className="h-3 w-3" />
                Tersembunyi {activeForecast.hiddenCostPercentage.toFixed(0)}%
              </span>
            )}
          </div>

          <div className="my-2">
            <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C251E]">
              RM {formatRM(activeForecast.totalCost)}
            </p>
          </div>

          <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs">
            <span className="text-[#5A655D]">
              Langsung: RM {formatRM(activeForecast.totalDirectCost)}
            </span>
            <span
              className={
                activeForecast.isHiddenCostCritical
                  ? "font-bold text-[#C2410C]"
                  : "font-semibold text-[#B45309]"
              }
            >
              Sampingan: RM {formatRM(activeForecast.totalHiddenCost)}
            </span>
          </div>
        </div>

        {/* KPI 3: Anggaran Untung (RM) */}
        <div className="rounded-2xl bg-[#FAF8F3] border-2 border-[#2D6A4F]/35 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
              3. Anggaran Untung
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2D6A4F] text-[#F5F2EB]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>

          <div className="my-2">
            <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2D6A4F]">
              RM {formatRM(activeForecast.projectedNetProfit)}
            </p>
          </div>

          <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs text-[#5A655D]">
            <span>Margin Bersih Musim Ini</span>
            <span className="font-bold text-[#163020]">
              {activeForecast.projectedRevenue > 0
                ? `${Math.round(
                    (activeForecast.projectedNetProfit /
                      activeForecast.projectedRevenue) *
                      100
                  )}%`
                : "0%"}
            </span>
          </div>
        </div>

        {/* KPI 4: Tuaian (kg) */}
        <div className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A655D]">
              4. Tuaian (kg)
            </span>
            <button
              type="button"
              onClick={onOpenHarvestModal}
              className="inline-flex items-center gap-1 rounded-lg bg-[#163020] px-2.5 py-1 text-xs font-bold text-[#F5F2EB] hover:bg-[#2D6A4F] transition-colors"
            >
              <Scale className="h-3 w-3" />
              <span>Rekod Tuai</span>
            </button>
          </div>

          <div className="my-2 flex items-baseline gap-1.5">
            <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C251E]">
              {activeForecast.projectedYieldKg.toLocaleString("ms-MY")} kg
            </p>
            <span className="text-xs font-medium text-[#5A655D]">sasaran</span>
          </div>

          <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 text-[#5A655D]">
              <Sprout className="h-3.5 w-3.5 text-[#2D6A4F]" />
              Dituai:{" "}
              <strong className="text-[#1C251E]">
                {totalActualWeight.toLocaleString("ms-MY")} kg
              </strong>
            </span>
            <span className="font-semibold text-[#B45309]">
              {harvests.length} rekod
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
