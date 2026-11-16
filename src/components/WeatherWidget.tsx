"use client"

import { useEffect, useState } from "react"
import {
  CloudRain,
  Sun,
  Cloud,
  Droplets,
  CalendarClock,
  Sprout,
} from "lucide-react"

interface WeatherWidgetProps {
  nextHarvestPlotName?: string
  nextHarvestDate?: Date | string
  nextHarvestYieldKg?: number
}

interface HourlyPoint {
  time: string
  temp: number
  rainProb: number
}

interface WeatherData {
  temperature: number
  humidity: number
  weatherCode: number
  hourly: HourlyPoint[]
}

const DEFAULT_HOURLY: HourlyPoint[] = [
  { time: "08:00", temp: 27, rainProb: 15 },
  { time: "11:00", temp: 31, rainProb: 20 },
  { time: "14:00", temp: 33, rainProb: 45 },
  { time: "17:00", temp: 29, rainProb: 60 },
  { time: "20:00", temp: 26, rainProb: 25 },
]

function getWeatherInfoBM(code: number): {
  label: string
  advice: string
  isRainy: boolean
} {
  if (code === 0 || code === 1) {
    return {
      label: "Cerah & Berangin",
      advice: "Masa sesuai untuk semburan Baja AB & kawalan serangga pagi.",
      isRainy: false,
    }
  }
  if (code === 2 || code === 3) {
    return {
      label: "Berawan Redup",
      advice: "Cuaca nyaman untuk merumpai batas & pemeriksaan paip titis.",
      isRainy: false,
    }
  }
  if (code >= 51 && code <= 67) {
    return {
      label: "Hujan Renyai",
      advice: "Tangguh dahulu semburan racun / baja daun agar tidak luntur.",
      isRainy: true,
    }
  }
  if (code >= 80) {
    return {
      label: "Hujan Petang",
      advice: "Periksa tali air petak padi & saliran batas cili.",
      isRainy: true,
    }
  }
  return {
    label: "Redup Sejuk",
    advice: "Sesuai untuk pemantauan daun dan tabur baja butir.",
    isRainy: false,
  }
}

export default function WeatherWidget({
  nextHarvestPlotName = "Lot A - Cili Fertigasi",
  nextHarvestDate,
  nextHarvestYieldKg = 2000,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 31,
    humidity: 74,
    weatherCode: 2,
    hourly: DEFAULT_HOURLY,
  })

  useEffect(() => {
    let active = true
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=6.00&longitude=100.47&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,precipitation_probability&timezone=Asia%2FKuala_Lumpur"
        )
        if (!res.ok) return
        const data = await res.json()
        if (active && data?.current) {
          const targetHours = [8, 11, 14, 17, 20]
          const extractedHourly: HourlyPoint[] = targetHours.map((hr, idx) => ({
            time: `${String(hr).padStart(2, "0")}:00`,
            temp: Math.round(
              data.hourly?.temperature_2m?.[hr] ?? DEFAULT_HOURLY[idx].temp
            ),
            rainProb: Math.round(
              data.hourly?.precipitation_probability?.[hr] ??
                DEFAULT_HOURLY[idx].rainProb
            ),
          }))

          setWeather({
            temperature: Math.round(data.current.temperature_2m ?? 31),
            humidity: Math.round(data.current.relative_humidity_2m ?? 74),
            weatherCode: data.current.weather_code ?? 2,
            hourly: extractedHourly,
          })
        }
      } catch {
        // Keep realistic Pendang/Kubang Pasu fallback
      }
    }
    fetchWeather()
    return () => {
      active = false
    }
  }, [])

  const info = getWeatherInfoBM(weather.weatherCode)

  const daysUntilHarvest = nextHarvestDate
    ? Math.max(
        1,
        Math.ceil(
          (new Date(nextHarvestDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 45

  const harvestDateFormatted = nextHarvestDate
    ? new Date(nextHarvestDate).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Musim Ini"

  return (
    <section className="rounded-2xl bg-[#163020] text-[#F5F2EB] border border-[#294D36] p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#274B35]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#95D5B2]">
              Almanak Hari Ini
            </span>
            <p className="text-xs text-[#B8CEC0] mt-0.5">
              Pendang / Kubang Pasu (6.00°U, 100.47°T)
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[#1F412C] border border-[#2D5A3F] px-2.5 py-1 text-xs font-semibold text-[#D8E6DF]">
            <Droplets className="h-3.5 w-3.5 text-[#74C69D]" />
            <span>{weather.humidity}% Lembap</span>
          </div>
        </div>

        {/* Current Temp + Condition */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="font-serif-editorial text-4xl font-bold text-[#F5F2EB]">
              {weather.temperature}°C
            </span>
            <span className="text-sm font-semibold text-[#B7E4C7]">
              {info.label}
            </span>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#224630] border border-[#316043] text-[#95D5B2]">
            {info.isRainy ? (
              <CloudRain className="h-6 w-6 text-[#FCD34D]" />
            ) : weather.weatherCode <= 1 ? (
              <Sun className="h-6 w-6 text-[#FCD34D]" />
            ) : (
              <Cloud className="h-6 w-6 text-[#B7E4C7]" />
            )}
          </div>
        </div>

        {/* Spraying / Fertilizing Advice Box */}
        <div className="mt-3 rounded-xl bg-[#1E3F2B] border border-[#2D573D] px-3.5 py-2.5 text-xs leading-relaxed text-[#E2ECE6]">
          <strong className="text-[#95D5B2] uppercase tracking-wider block text-[10px] mb-0.5">
            Saranan Kerja Kebun:
          </strong>
          {info.advice}
        </div>

        {/* Hourly Bar Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-[#A7C4B5] mb-2">
            <span className="font-semibold uppercase tracking-wider">
              Unjuran Suhu &amp; Hujan Harian
            </span>
            <span> Kebarangkalian Hujan (%)</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {weather.hourly.map((pt) => {
              const barHeight = Math.max(24, Math.min(100, pt.rainProb + 20))
              return (
                <div
                  key={pt.time}
                  className="flex flex-col items-center rounded-xl bg-[#1B3926] border border-[#274B35] p-2"
                >
                  <span className="text-[11px] font-bold text-[#F5F2EB]">
                    {pt.temp}°
                  </span>
                  <div className="my-1.5 flex h-10 w-2.5 items-end rounded-full bg-[#12261A] p-0.5">
                    <div
                      className={`w-full rounded-full ${
                        pt.rainProb >= 50 ? "bg-[#F59E0B]" : "bg-[#52B788]"
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#95D5B2]">
                    {pt.rainProb}%
                  </span>
                  <span className="mt-0.5 text-[10px] text-[#A7C4B5]">
                    {pt.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Countdown Box for Next Upcoming Harvest (Tuaian Seterusnya) */}
      <div className="mt-4 rounded-xl bg-[#1E3F2B] border border-[#346346] p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2D6A4F] text-[#F5F2EB]">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#95D5B2]">
              Tuaian Seterusnya
            </span>
            <p className="text-sm font-bold text-[#F5F2EB] truncate">
              {nextHarvestPlotName}
            </p>
            <p className="text-xs text-[#B8CEC0] flex items-center gap-1">
              <Sprout className="h-3 w-3 text-[#74C69D]" />
              Sasaran {nextHarvestYieldKg.toLocaleString("ms-MY")} kg •{" "}
              {harvestDateFormatted}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-[#163020] border border-[#3B7050] px-3 py-1.5 text-center">
          <span className="block font-serif-editorial text-xl font-bold text-[#B7E4C7] leading-none">
            {daysUntilHarvest}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A7C4B5]">
            Hari Lagi
          </span>
        </div>
      </div>
    </section>
  )
}
