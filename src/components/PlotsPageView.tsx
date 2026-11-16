"use client"

import { useState } from "react"
import {
  Plus,
  ClipboardPlus,
  Calendar,
  Sprout,
  Clock,
  Droplets,
  Bug,
  Wrench,
} from "lucide-react"
import AppShell from "./AppShell"
import type { DashboardPlot } from "./SemaiDashboard"
import QuickActionModals from "./QuickActionModals"

interface PlotsPageViewProps {
  farmerName: string
  farmerLocation: string
  farmId: string
  farmName: string
  plots: DashboardPlot[]
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

function getLifecycleInfo(
  plantingDate: Date | string,
  expectedHarvest: Date | string
) {
  const start = new Date(plantingDate).getTime()
  const end = new Date(expectedHarvest).getTime()
  const now = Date.now()
  const pct =
    end > start
      ? Math.max(8, Math.min(98, Math.round(((now - start) / (end - start)) * 100)))
      : 50
  const daysLeft = Math.max(1, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
  const stage =
    pct < 25
      ? "Peringkat Anak Benih"
      : pct < 60
      ? "Vegetatif & Pembajaan"
      : pct < 85
      ? "Berbunga & Pembuahan"
      : "Matang / Sedia Dituai"

  return { pct, daysLeft, stage }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "PEMBAJAAN":
      return <Sprout className="h-4 w-4 text-[#2D6A4F]" />
    case "KAWALAN_PEROSAK":
      return <Bug className="h-4 w-4 text-[#B45309]" />
    case "MENYIRAM":
    case "KAWALAN_AIR":
      return <Droplets className="h-4 w-4 text-[#163020]" />
    default:
      return <Wrench className="h-4 w-4 text-[#5A655D]" />
  }
}

export default function PlotsPageView({
  farmerName,
  farmerLocation,
  farmId,
  farmName,
  plots,
}: PlotsPageViewProps) {
  const [selectedPlotFilter, setSelectedPlotFilter] = useState<string>("ALL")
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL")
  const [activeModal, setActiveModal] = useState<"EXPENSE" | "ACTIVITY" | null>(
    null
  )
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false)
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false)
  const [activePlotIdForModal, setActivePlotIdForModal] = useState(
    plots[0]?.id ?? ""
  )

  const allActivities = plots
    .flatMap((plot) =>
      plot.activities.map((act) => ({
        ...act,
        plotId: plot.id,
        plotName: plot.name,
        cropType: plot.cropType,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const filteredActivities = allActivities.filter((item) => {
    if (selectedPlotFilter !== "ALL" && item.plotId !== selectedPlotFilter) {
      return false
    }
    if (selectedTypeFilter !== "ALL" && item.type !== selectedTypeFilter) {
      return false
    }
    return true
  })

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
              Pengurusan Kitaran Tanaman
            </span>
            <h1 className="mt-1 font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C251E]">
              Plot &amp; Aktiviti Kebun
            </h1>
            <p className="mt-1 text-sm text-[#5A655D]">
              Pantau kemajuan pertumbuhan setiap petak dan rekod kerja harian
              pembajaan, meracun, serta pengairan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddPlotOpen(true)}
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#2D6A4F] bg-[#FAF8F3] px-4 text-sm font-bold text-[#163020] hover:bg-[#EAE5D9] transition-colors"
            >
              <Plus className="h-4 w-4 text-[#2D6A4F]" />
              <span>+ Lot Baru</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("ACTIVITY")}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#163020] px-5 text-sm font-bold text-[#F5F2EB] hover:bg-[#234832] transition-colors shadow-sm"
            >
              <ClipboardPlus className="h-4 w-4" />
              <span>+ Log Aktiviti</span>
            </button>
          </div>
        </header>

        {/* Full Plot Lifecycle Cards */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-editorial text-xl font-semibold text-[#1C251E]">
              Kad Kitaran Hayat Plot ({plots.length} Petak Aktif)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plots.map((plot) => {
              const info = getLifecycleInfo(
                plot.plantingDate,
                plot.expectedHarvest
              )
              const plantedStr = new Date(plot.plantingDate).toLocaleDateString(
                "ms-MY",
                { day: "numeric", month: "short", year: "numeric" }
              )
              const harvestStr = new Date(
                plot.expectedHarvest
              ).toLocaleDateString("ms-MY", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })

              return (
                <div
                  key={plot.id}
                  className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block rounded-lg bg-[#2D6A4F]/15 px-2.5 py-0.5 text-xs font-bold text-[#163020]">
                          {plot.cropType} • {plot.areaSize} {plot.areaUnit}
                        </span>
                        <h3 className="mt-1.5 font-serif-editorial text-2xl font-bold text-[#1C251E]">
                          {plot.name}
                        </h3>
                      </div>

                      <div className="rounded-xl bg-[#163020] text-[#F5F2EB] px-3 py-1.5 text-center shrink-0">
                        <span className="block font-serif-editorial text-lg font-bold text-[#B7E4C7] leading-none">
                          {info.daysLeft}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A7C4B5]">
                          Hari ke Tuai
                        </span>
                      </div>
                    </div>

                    {/* Growth Progress Bar */}
                    <div className="mt-4 rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-3.5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-[#163020]">
                          {info.stage}
                        </span>
                        <span className="font-extrabold text-[#2D6A4F]">
                          {info.pct}% Kemajuan
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E2DDD2]">
                        <div
                          className="h-full rounded-full bg-[#2D6A4F] transition-all"
                          style={{ width: `${info.pct}%` }}
                        />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-xs text-[#5A655D]">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-[#2D6A4F]" />
                          Tanam: {plantedStr}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-[#B45309]" />
                          Jangka Tuai: {harvestStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2DDD2] flex items-center justify-between text-xs">
                    <span className="text-[#5A655D]">
                      Sasaran Hasil:{" "}
                      <strong className="text-[#1C251E]">
                        {plot.forecast.projectedYieldKg.toLocaleString("ms-MY")}{" "}
                        kg
                      </strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setActivePlotIdForModal(plot.id)
                        setActiveModal("ACTIVITY")
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2D6A4F]/12 px-3 py-1.5 font-bold text-[#163020] hover:bg-[#2D6A4F] hover:text-[#F5F2EB] transition-colors"
                    >
                      <ClipboardPlus className="h-3.5 w-3.5" />
                      <span>Log Aktiviti Petak Ini</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Filterable Activity Timeline */}
        <section className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2DDD2]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D6A4F]">
                Buku Rekod Kerja Ladang
              </span>
              <h2 className="font-serif-editorial text-xl font-semibold text-[#1C251E]">
                Garis Masa Aktiviti ({filteredActivities.length} Rekod)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedPlotFilter}
                onChange={(e) => setSelectedPlotFilter(e.target.value)}
                className="h-10 rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-xs font-bold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
              >
                <option value="ALL">Semua Plot ({plots.length})</option>
                {plots.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="h-10 rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-xs font-bold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
              >
                <option value="ALL">Semua Jenis Kerja</option>
                <option value="PEMBAJAAN">Membaja</option>
                <option value="KAWALAN_PEROSAK">Meracun &amp; Perosak</option>
                <option value="MENYIRAM">Menyiram &amp; Air</option>
                <option value="MERUMPAI">Merumpai</option>
                <option value="PENYEDIAAN_TANAH">Penyediaan Tanah</option>
                <option value="PENYELENGGARAAN">Penyelenggaraan</option>
              </select>
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="py-10 text-center text-sm text-[#5A655D]">
              Tiada rekod aktiviti ditemui untuk tapisan ini. Klik &ldquo;+ Log
              Aktiviti&rdquo; di atas untuk menambah rekod.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3.5 rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-4"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F3] border border-[#E2DDD2]">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#163020]">
                          {ACTIVITY_LABELS_BM[act.type] ?? act.type}
                        </span>
                        <span className="rounded-md bg-[#EAE5D9] px-2 py-0.5 text-xs font-semibold text-[#4A554E]">
                          {act.plotName}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#5A655D]">
                        {new Date(act.date).toLocaleDateString("ms-MY", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {act.notes && (
                      <p className="mt-1 text-sm text-[#4A554E] leading-relaxed">
                        {act.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <QuickActionModals
        selectedPlotId={activePlotIdForModal}
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
