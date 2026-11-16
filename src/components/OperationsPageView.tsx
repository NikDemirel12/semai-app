"use client"

import { useState } from "react"
import {
  PackageCheck,
  CheckSquare,
  Square,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react"
import AppShell from "./AppShell"

interface OperationsPageViewProps {
  farmerName: string
  farmerLocation: string
  farmName: string
  activePlotCount: number
}

interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  minThreshold: number
  unit: string
  notes: string
}

interface WorkerTask {
  id: string
  title: string
  assignee: string
  plotTarget: string
  timeSlot: string
  completed: boolean
}

const INITIAL_STOCK: StockItem[] = [
  {
    id: "stk-1",
    name: "Baja Sebatian NPK 15:15:15",
    category: "Baja",
    quantity: 6,
    minThreshold: 3,
    unit: "Beg (50kg)",
    notes: "Stok mencukupi untuk Petak Padi MR297",
  },
  {
    id: "stk-2",
    name: "Set Baja AB Fertigasi Pekat",
    category: "Baja",
    quantity: 35,
    minThreshold: 20,
    unit: "Liter",
    notes: "Bancuhan harian EC 1.8 di Lot A Cili",
  },
  {
    id: "stk-3",
    name: "Racun Kulat & Kawalan Thrips (Neem)",
    category: "Racun",
    quantity: 2,
    minThreshold: 3,
    unit: "Botol (1L)",
    notes: "Stok rendah — perlu beli sebelum minggu depan",
  },
  {
    id: "stk-4",
    name: "Benih Padi Sah MR297 & Cili F1",
    category: "Benih",
    quantity: 4,
    minThreshold: 2,
    unit: "Pek / Beg",
    notes: "Disimpan di bilik kering stor kebun",
  },
  {
    id: "stk-5",
    name: "Minyak Petrol Mesin Rumput & Pam Air",
    category: "Operasi",
    quantity: 5,
    minThreshold: 10,
    unit: "Liter",
    notes: "Pantau penggunaan untuk elak kos tersembunyi >20%",
  },
]

const INITIAL_TASKS: WorkerTask[] = [
  {
    id: "tsk-1",
    title: "Periksa tekanan paip drip & penapis air polibeg",
    assignee: "Pak Ahmad",
    plotTarget: "Lot A - Cili Fertigasi",
    timeSlot: "08:00 Pagi",
    completed: true,
  },
  {
    id: "tsk-2",
    title: "Semburan kawalan serangga organik (bawah permukaan daun)",
    assignee: "Man (Pekerja Harian)",
    plotTarget: "Lot A - Cili Fertigasi",
    timeSlot: "09:15 Pagi",
    completed: false,
  },
  {
    id: "tsk-3",
    title: "Periksa paras air tali air & tebas rumput batas sawah",
    assignee: "Pak Ahmad & Man",
    plotTarget: "Petak 1 - Padi",
    timeSlot: "05:00 Petang",
    completed: false,
  },
  {
    id: "tsk-4",
    title: "Rekod resit belian petrol & semak baki stor baja",
    assignee: "Pak Ahmad",
    plotTarget: "Stor Kebun Hijau",
    timeSlot: "06:30 Petang",
    completed: false,
  },
]

export default function OperationsPageView({
  farmerName,
  farmerLocation,
  farmName,
  activePlotCount,
}: OperationsPageViewProps) {
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCK)
  const [tasks, setTasks] = useState<WorkerTask[]>(INITIAL_TASKS)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskPlot, setNewTaskPlot] = useState("Lot A - Cili Fertigasi")

  function adjustStock(id: string, delta: number) {
    setStocks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    )
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    const created: WorkerTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignee: farmerName || "Pak Ahmad",
      plotTarget: newTaskPlot,
      timeSlot: "Hari Ini",
      completed: false,
    }
    setTasks((prev) => [created, ...prev])
    setNewTaskTitle("")
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const lowStockCount = stocks.filter(
    (s) => s.quantity <= s.minThreshold
  ).length

  return (
    <AppShell
      farmerName={farmerName}
      farmerLocation={farmerLocation}
      farmName={farmName}
      activePlotCount={activePlotCount}
    >
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E2DDD2]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2D6A4F]">
              Pengurusan Stor &amp; Tenaga Kerja
            </span>
            <h1 className="mt-1 font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C251E]">
              Inventori &amp; Tugasan Harian
            </h1>
            <p className="mt-1 text-sm text-[#5A655D]">
              Semak baki stok Baja NPK, Racun Kulat, serta Benih dan urus
              senarai semak kerja harian kebun.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#FAF8F3] border border-[#E2DDD2] px-4 py-2.5 text-xs font-bold">
              <span className="text-[#5A655D] block">Tugasan Selesai</span>
              <span className="font-serif-editorial text-lg text-[#2D6A4F]">
                {completedCount} / {tasks.length}
              </span>
            </div>

            <div className="rounded-xl bg-[#FAF8F3] border border-[#E2DDD2] px-4 py-2.5 text-xs font-bold">
              <span className="text-[#5A655D] block">Amaran Stok Rendah</span>
              <span
                className={`font-serif-editorial text-lg ${
                  lowStockCount > 0 ? "text-[#C2410C]" : "text-[#2D6A4F]"
                }`}
              >
                {lowStockCount} Barang
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Farm Stock Level Tracker */}
          <section className="lg:col-span-7 rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD2]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Inventori Stor Kebun
                </span>
                <h2 className="font-serif-editorial text-xl font-bold text-[#1C251E] flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-[#2D6A4F]" />
                  Paras Stok Baja, Racun &amp; Benih
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {stocks.map((item) => {
                const isLow = item.quantity <= item.minThreshold
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isLow
                        ? "bg-[#FEF7F0] border-[#C2410C]/40"
                        : "bg-[#F5F2EB] border-[#E2DDD2]"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-md bg-[#EAE5D9] px-2 py-0.5 text-[11px] font-bold text-[#163020]">
                            {item.category}
                          </span>
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#C2410C]/15 px-2.5 py-0.5 text-[11px] font-extrabold text-[#C2410C]">
                              <AlertTriangle className="h-3 w-3" />
                              Perlu Tambah Stok
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#2D6A4F]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#2D6A4F]">
                              <CheckCircle2 className="h-3 w-3" />
                              Mencukupi
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1.5 font-bold text-base text-[#1C251E]">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#5A655D] mt-0.5">
                          {item.notes}
                        </p>
                      </div>

                      {/* Thumb-friendly +/- Stock Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, -1)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2DDD2] bg-[#FAF8F3] text-[#1C251E] hover:border-[#2D6A4F]"
                          aria-label="Kurangkan stok"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <div className="min-w-[82px] text-center">
                          <span
                            className={`block font-serif-editorial text-xl font-bold leading-none ${
                              isLow ? "text-[#C2410C]" : "text-[#1C251E]"
                            }`}
                          >
                            {item.quantity}
                          </span>
                          <span className="text-[11px] text-[#5A655D]">
                            {item.unit}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => adjustStock(item.id, 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163020] text-[#F5F2EB] hover:bg-[#2D6A4F]"
                          aria-label="Tambah stok"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Right: Daily Worker Task Checklist */}
          <section className="lg:col-span-5 rounded-2xl bg-[#FAF8F3] border border-[#E2DDD2] p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-[#E2DDD2]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
                Jadual Operasi Harian
              </span>
              <h2 className="font-serif-editorial text-xl font-bold text-[#1C251E] flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-[#2D6A4F]" />
                Senarai Tugasan Pekerja
              </h2>
            </div>

            {/* Add Quick Task Form */}
            <form onSubmit={handleAddTask} className="space-y-2.5">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Tambah tugasan baharu (cth: Tabur baja urea)..."
                className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-sm text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
              />
              <div className="flex gap-2">
                <select
                  value={newTaskPlot}
                  onChange={(e) => setNewTaskPlot(e.target.value)}
                  className="h-11 flex-1 rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-xs font-bold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                >
                  <option value="Lot A - Cili Fertigasi">
                    Lot A - Cili Fertigasi
                  </option>
                  <option value="Petak 1 - Padi">Petak 1 - Padi</option>
                  <option value="Stor Kebun Hijau">Stor Kebun Hijau</option>
                </select>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#163020] px-4 text-xs font-bold text-[#F5F2EB] hover:bg-[#2D6A4F]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah</span>
                </button>
              </div>
            </form>

            {/* Checklist Items */}
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    task.completed
                      ? "bg-[#EFF5F1] border-[#2D6A4F]/30 opacity-80"
                      : "bg-[#F5F2EB] border-[#E2DDD2] hover:border-[#2D6A4F]"
                  }`}
                >
                  <div className="mt-0.5 text-[#2D6A4F] shrink-0">
                    {task.completed ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5 text-[#7A847C]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold leading-snug ${
                        task.completed
                          ? "line-through text-[#5A655D]"
                          : "text-[#1C251E]"
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[#5A655D]">
                      <span className="font-semibold text-[#163020]">
                        {task.plotTarget}
                      </span>
                      <span>•</span>
                      <span>{task.assignee}</span>
                      <span>•</span>
                      <span>{task.timeSlot}</span>
                    </div>
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
