"use client"

import { AlertTriangle, ShieldCheck } from "lucide-react"
import type { PlotForecast } from "@/lib/forecasting"
import { formatRM } from "./FinancialSummaryCard"

interface HiddenCostAlertBannerProps {
  plotName: string
  forecast: PlotForecast
}

export default function HiddenCostAlertBanner({
  plotName,
  forecast,
}: HiddenCostAlertBannerProps) {
  const {
    isHiddenCostCritical,
    hiddenCostPercentage,
    totalHiddenCost,
    totalCost,
  } = forecast

  if (isHiddenCostCritical) {
    return (
      <div
        role="alert"
        className="rounded-2xl border-2 border-[#C2410C]/45 bg-[#FEF7F0] p-4 shadow-xs"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C2410C]/15 text-[#C2410C] border border-[#C2410C]/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full bg-[#C2410C] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FAF8F3]">
                Amaran Kos Tersembunyi &gt; 20%
              </span>
              <span className="text-xs font-extrabold text-[#B45309]">
                {hiddenCostPercentage.toFixed(1)}% daripada perbelanjaan
              </span>
            </div>
            <h3 className="mt-1.5 font-serif-editorial text-lg font-bold text-[#1C251E]">
              Perhatian: Kos Sampingan Tinggi di {plotName}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#4A554E]">
              Sebanyak{" "}
              <strong className="font-bold text-[#C2410C]">
                RM {formatRM(totalHiddenCost)}
              </strong>{" "}
              daripada jumlah kos{" "}
              <strong className="font-semibold text-[#1C251E]">
                RM {formatRM(totalCost)}
              </strong>{" "}
              telah dibelanjakan pada kos tersembunyi seperti{" "}
              <span className="underline decoration-[#B45309]/60 underline-offset-2 font-medium text-[#1C251E]">
                minyak mesin, upah harian, pengangkutan &amp; baiki alat
              </span>
              . Pantau perbelanjaan kecil harian supaya anggaran untung bersih kekal terjamin.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#2D6A4F]/30 bg-[#FAF8F3] px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F]/15 text-[#2D6A4F]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1C251E]">
            Kos Tersembunyi Terkawal ({hiddenCostPercentage.toFixed(1)}%)
          </p>
          <p className="text-xs text-[#5A655D]">
            RM {formatRM(totalHiddenCost)} kos sampingan — di bawah paras amaran 20%
          </p>
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-[#2D6A4F]/15 px-3 py-1 text-xs font-bold text-[#163020]">
        Terkawal
      </span>
    </div>
  )
}
