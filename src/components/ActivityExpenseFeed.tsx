"use client"

import { useState } from "react"
import {
  Receipt,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Sprout,
  Droplets,
  Bug,
  Wrench,
} from "lucide-react"
import { formatRM } from "./FinancialSummaryCard"

export interface FeedExpense {
  id: string
  title: string
  amount: number
  category: string
  isHidden: boolean
  date: Date | string
}

export interface FeedActivity {
  id: string
  type: string
  notes: string | null
  date: Date | string
}

interface ActivityExpenseFeedProps {
  expenses: FeedExpense[]
  activities: FeedActivity[]
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

function formatDateBM(dateInput: Date | string): string {
  return new Date(dateInput).toLocaleDateString("ms-MY", {
    day: "numeric",
    month: "short",
  })
}

export default function ActivityExpenseFeed({
  expenses,
  activities,
}: ActivityExpenseFeedProps) {
  const [filter, setFilter] = useState<"ALL" | "EXPENSES" | "ACTIVITIES">("ALL")

  return (
    <section className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E2DDD2]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D6A4F]">
            Jurnal Kebun &amp; Resit
          </span>
          <h3 className="font-serif-editorial text-lg font-bold text-[#1C251E]">
            Log Aktiviti &amp; Perbelanjaan
          </h3>
        </div>

        <div className="flex rounded-xl bg-[#EAE5D9] p-1 border border-[#E2DDD2] text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              filter === "ALL"
                ? "bg-[#163020] text-[#F5F2EB]"
                : "text-[#5A655D] hover:text-[#1C251E]"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setFilter("EXPENSES")}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              filter === "EXPENSES"
                ? "bg-[#163020] text-[#F5F2EB]"
                : "text-[#5A655D] hover:text-[#1C251E]"
            }`}
          >
            Kos ({expenses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ACTIVITIES")}
            className={`px-2.5 py-1.5 rounded-lg transition-colors ${
              filter === "ACTIVITIES"
                ? "bg-[#163020] text-[#F5F2EB]"
                : "text-[#5A655D] hover:text-[#1C251E]"
            }`}
          >
            Aktiviti ({activities.length})
          </button>
        </div>
      </div>

      {/* Expenses Section */}
      {(filter === "ALL" || filter === "EXPENSES") && (
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A655D] flex items-center gap-1.5 mb-2.5">
            <Receipt className="h-3.5 w-3.5 text-[#B45309]" />
            Catatan Perbelanjaan
          </h4>

          {expenses.length === 0 ? (
            <p className="rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-4 text-center text-sm text-[#5A655D]">
              Belum ada rekod kos dicatat untuk petak ini.
            </p>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${
                    expense.isHidden
                      ? "bg-[#FEF7F0] border-[#C2410C]/35"
                      : "bg-[#F5F2EB] border-[#E2DDD2]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {expense.isHidden ? (
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
                      <span className="text-xs text-[#5A655D]">
                        {formatDateBM(expense.date)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-[#1C251E] truncate">
                      {expense.title}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-serif-editorial text-base font-bold ${
                        expense.isHidden ? "text-[#C2410C]" : "text-[#1C251E]"
                      }`}
                    >
                      - RM {formatRM(expense.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activities Section */}
      {(filter === "ALL" || filter === "ACTIVITIES") && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A655D] flex items-center gap-1.5 mb-2.5">
            <ClipboardList className="h-3.5 w-3.5 text-[#2D6A4F]" />
            Rekod Kerja Kebun
          </h4>

          {activities.length === 0 ? (
            <p className="rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-4 text-center text-sm text-[#5A655D]">
              Belum ada aktiviti dicatat untuk petak ini.
            </p>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-3"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F3] border border-[#E2DDD2]">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#163020]">
                        {ACTIVITY_LABELS_BM[activity.type] ?? activity.type}
                      </span>
                      <span className="text-xs text-[#5A655D]">
                        {formatDateBM(activity.date)}
                      </span>
                    </div>
                    {activity.notes && (
                      <p className="mt-0.5 text-xs text-[#4A554E] leading-relaxed">
                        {activity.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
