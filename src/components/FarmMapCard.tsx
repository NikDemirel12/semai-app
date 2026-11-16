"use client"

import { Plus, AlertTriangle, CheckCircle2, Layers } from "lucide-react"
import type { DashboardPlot } from "./SemaiDashboard"

interface FarmMapCardProps {
  plots: DashboardPlot[]
  selectedPlotId: string
  showOverall: boolean
  onSelectPlot: (plotId: string) => void
  onSelectOverall: () => void
  onOpenAddPlot: () => void
}

function getGrowthPercentage(
  plantingDate: Date | string,
  expectedHarvest: Date | string
): { pct: number; stageLabel: string } {
  const start = new Date(plantingDate).getTime()
  const end = new Date(expectedHarvest).getTime()
  const now = Date.now()
  if (end <= start) return { pct: 50, stageLabel: "Pertumbuhan Aktif" }
  const raw = Math.round(((now - start) / (end - start)) * 100)
  const pct = Math.max(8, Math.min(98, raw))

  if (pct < 25) return { pct, stageLabel: "Peringkat Anak Benih" }
  if (pct < 60) return { pct, stageLabel: "Vegetatif & Pembajaan" }
  if (pct < 85) return { pct, stageLabel: "Berbunga & Berbuah" }
  return { pct, stageLabel: "Hampir Matang / Tuai" }
}

function getCropTheme(cropType: string) {
  const lower = cropType.toLowerCase()
  if (lower.includes("padi")) {
    return {
      badgeBg: "bg-[#2D6A4F]/15 text-[#163020] border-[#2D6A4F]/30",
      barColor: "#2D6A4F",
      dotColor: "#2D6A4F",
      patternBg: "bg-[#EFF5F1]",
    }
  }
  if (lower.includes("cili") || lower.includes("lada")) {
    return {
      badgeBg: "bg-[#C2410C]/12 text-[#9A3412] border-[#C2410C]/30",
      barColor: "#C2410C",
      dotColor: "#C2410C",
      patternBg: "bg-[#FDF6F0]",
    }
  }
  if (lower.includes("jagung")) {
    return {
      badgeBg: "bg-[#B45309]/15 text-[#92400E] border-[#B45309]/30",
      barColor: "#B45309",
      dotColor: "#D97706",
      patternBg: "bg-[#FEFBF3]",
    }
  }
  return {
    badgeBg: "bg-[#15803D]/15 text-[#166534] border-[#15803D]/30",
    barColor: "#15803D",
    dotColor: "#15803D",
    patternBg: "bg-[#F3F8F4]",
  }
}

export default function FarmMapCard({
  plots,
  selectedPlotId,
  showOverall,
  onSelectPlot,
  onSelectOverall,
  onOpenAddPlot,
}: FarmMapCardProps) {
  return (
    <section className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#E2DDD2]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2D6A4F]">
              Susun Atur Petak Ladang
            </span>
            <h2 className="font-serif-editorial text-xl font-semibold text-[#1C251E]">
              Peta Kebun — Lakaran
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectOverall}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${
                showOverall
                  ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                  : "border-[#E2DDD2] bg-[#F5F2EB] text-[#4A554E] hover:border-[#2D6A4F]"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Semua Plot ({plots.length})</span>
            </button>
          </div>
        </div>

        {/* 2D Schematic Plot Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {plots.map((plot, index) => {
            const isSelected = !showOverall && plot.id === selectedPlotId
            const growth = getGrowthPercentage(
              plot.plantingDate,
              plot.expectedHarvest
            )
            const theme = getCropTheme(plot.cropType)
            const isCritical = plot.forecast.isHiddenCostCritical

            return (
              <button
                key={plot.id}
                type="button"
                onClick={() => onSelectPlot(plot.id)}
                className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                  theme.patternBg
                } ${
                  isSelected
                    ? "border-[#163020] ring-2 ring-[#2D6A4F]/25 shadow-sm"
                    : "border-[#E2DDD2] hover:border-[#2D6A4F]/60"
                }`}
              >
                {/* Top Row: Plot Code + Area Size */}
                <div className="flex items-start justify-between gap-2 w-full">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: theme.dotColor }}
                      />
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5A655D]">
                        PETAK 0{index + 1} • {plot.areaSize} {plot.areaUnit}
                      </span>
                    </div>
                    <h3 className="mt-1 font-serif-editorial text-lg font-bold text-[#1C251E] group-hover:text-[#163020]">
                      {plot.name}
                    </h3>
                  </div>

                  {isCritical ? (
                    <span
                      title="Kos Tersembunyi Melebihi 20%"
                      className="inline-flex items-center gap-1 rounded-full bg-[#C2410C]/15 border border-[#C2410C]/35 px-2.5 py-0.5 text-[11px] font-bold text-[#C2410C]"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Kos {plot.forecast.hiddenCostPercentage.toFixed(0)}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#2D6A4F]/15 border border-[#2D6A4F]/30 px-2 py-0.5 text-[11px] font-bold text-[#2D6A4F]">
                      <CheckCircle2 className="h-3 w-3" />
                      Aktif
                    </span>
                  )}
                </div>

                {/* Crop Type Tag */}
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-lg border px-2.5 py-0.5 text-xs font-bold ${theme.badgeBg}`}
                  >
                    {plot.cropType}
                  </span>
                  <span className="text-xs font-bold text-[#1C251E]">
                    RM{" "}
                    {Math.round(
                      plot.forecast.projectedNetProfit
                    ).toLocaleString("ms-MY")}{" "}
                    <span className="font-normal text-[#5A655D]">untung</span>
                  </span>
                </div>

                {/* Growth Stage Bar */}
                <div className="mt-3.5 pt-2.5 border-t border-[#E2DDD2]/80 w-full">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#5A655D]">
                      {growth.stageLabel}
                    </span>
                    <span className="font-extrabold text-[#1C251E]">
                      {growth.pct}% Matang
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2DDD2]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${growth.pct}%`,
                        backgroundColor: theme.barColor,
                      }}
                    />
                  </div>
                </div>
              </button>
            )
          })}

          {/* "+ Tambah" Empty Plot Slot */}
          <button
            type="button"
            onClick={onOpenAddPlot}
            className="flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#C8C1B2] bg-[#F5F2EB]/70 p-4 text-center text-[#4A554E] hover:border-[#2D6A4F] hover:bg-[#FAF8F3] hover:text-[#163020] transition-all"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6E1D5] text-[#163020]">
              <Plus className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="block font-serif-editorial text-base font-bold text-[#1C251E]">
                + Tambah Lot Baru
              </span>
              <span className="text-xs text-[#5A655D]">
                Lakar petak Padi, Cili, Timun atau Jagung
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Color-Coded Crop Legend */}
      <div className="mt-4 pt-3 border-t border-[#E2DDD2] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A655D]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#2D6A4F]" />
            Padi Sawah
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C2410C]" />
            Cili / Fertigasi
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D97706]" />
            Jagung / Sayuran
          </span>
        </div>
        <span className="text-[11px] italic text-[#6C776F]">
          Klik mana-mana petak untuk tapis kewangan di bawah
        </span>
      </div>
    </section>
  )
}
