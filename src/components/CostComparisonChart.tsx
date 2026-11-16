"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { BarChart3, PieChart as PieChartIcon } from "lucide-react"
import type { PlotForecast } from "@/lib/forecasting"
import { formatRM } from "./FinancialSummaryCard"

interface CostComparisonChartProps {
  plotName: string
  forecast: PlotForecast
}

export default function CostComparisonChart({
  plotName,
  forecast,
}: CostComparisonChartProps) {
  const [chartType, setChartType] = useState<"bar" | "donut">("bar")

  const hiddenColor = forecast.isHiddenCostCritical ? "#C2410C" : "#B45309"

  const data = [
    {
      name: "Kos Langsung",
      shortName: "Langsung",
      value: Math.max(0, Math.round(forecast.totalDirectCost)),
      color: "#163020",
      desc: "Benih, Baja, Racun",
    },
    {
      name: "Kos Tersembunyi",
      shortName: "Tersembunyi",
      value: Math.max(0, Math.round(forecast.totalHiddenCost)),
      color: hiddenColor,
      desc: "Minyak, Upah, Logistik",
    },
    {
      name: "Anggaran Untung",
      shortName: "Untung",
      value: Math.max(0, Math.round(forecast.projectedNetProfit)),
      color: "#2D6A4F",
      desc: "Hasil Tolak Kos",
    },
  ]

  return (
    <section className="rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E2DDD2]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#2D6A4F]">
            Analisis Aliran Tunai
          </span>
          <h3 className="font-serif-editorial text-lg font-bold text-[#1C251E]">
            Pecahan Kos &amp; Untung ({plotName})
          </h3>
        </div>

        <div className="flex rounded-xl bg-[#EAE5D9] p-1 border border-[#E2DDD2] text-xs font-bold">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
              chartType === "bar"
                ? "bg-[#163020] text-[#F5F2EB]"
                : "text-[#5A655D] hover:text-[#1C251E]"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Bar
          </button>
          <button
            type="button"
            onClick={() => setChartType("donut")}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
              chartType === "donut"
                ? "bg-[#163020] text-[#F5F2EB]"
                : "text-[#5A655D] hover:text-[#1C251E]"
            }`}
          >
            <PieChartIcon className="h-3.5 w-3.5" />
            Donat
          </button>
        </div>
      </div>

      <div className="h-56 w-full">
        {chartType === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis
                dataKey="shortName"
                stroke="#5A655D"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#E2DDD2" }}
              />
              <YAxis
                stroke="#5A655D"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `RM${val}`}
              />
              <Tooltip
                cursor={{ fill: "rgba(45, 106, 79, 0.08)" }}
                contentStyle={{
                  backgroundColor: "#FAF8F3",
                  borderColor: "#E2DDD2",
                  borderRadius: "0.75rem",
                  color: "#1C251E",
                  fontSize: "13px",
                }}
                formatter={(value: unknown) => [
                  `RM ${formatRM(Number(value ?? 0))}`,
                  "Jumlah",
                ]}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {data.map((entry, idx) => (
                  <Cell key={`bar-cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={4}
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`pie-cell-${idx}`}
                    fill={entry.color}
                    stroke="#FAF8F3"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FAF8F3",
                  borderColor: "#E2DDD2",
                  borderRadius: "0.75rem",
                  color: "#1C251E",
                  fontSize: "13px",
                }}
                formatter={(value: unknown) => [
                  `RM ${formatRM(Number(value ?? 0))}`,
                  "Jumlah",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend Breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-[#E2DDD2] pt-3.5">
        {data.map((item) => (
          <div
            key={item.name}
            className="rounded-xl bg-[#F5F2EB] border border-[#E2DDD2] p-2.5"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold text-[#4A554E] truncate">
                {item.shortName}
              </span>
            </div>
            <p className="mt-1 font-serif-editorial text-base font-bold text-[#1C251E]">
              RM {formatRM(item.value)}
            </p>
            <p className="text-[11px] text-[#5A655D] truncate">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
