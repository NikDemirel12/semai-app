"use client"

import { useState, useTransition } from "react"
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Scale,
} from "lucide-react"
import {
  addExpenseAction,
  addActivityAction,
  addPlotAction,
  addHarvestAction,
} from "@/actions/semai"
import { formatRM, type HarvestLogItem } from "./FinancialSummaryCard"

interface PlotOption {
  id: string
  name: string
  cropType: string
  projectedYieldKg: number
  projectedRevenue: number
  marketPriceEst: number
  harvests: HarvestLogItem[]
}

interface QuickActionModalsProps {
  selectedPlotId: string
  plots: PlotOption[]
  farmId: string
  activeModal: "EXPENSE" | "ACTIVITY" | null
  onSetActiveModal: (modal: "EXPENSE" | "ACTIVITY" | null) => void
  isAddPlotOpen: boolean
  onCloseAddPlot: () => void
  isHarvestModalOpen: boolean
  onCloseHarvestModal: () => void
}

const DIRECT_PRESETS = [
  "Baja AB / Urea",
  "Benih Tanaman",
  "Racun Serangga / Rumpai",
  "Baja Organik / Foliar",
]

const HIDDEN_PRESETS = [
  "Minyak Mesin Rumput & Pam",
  "Upah Harian Pekerja",
  "Pengangkutan & Logistik",
  "Baiki Paip / Alat Kebun",
]

const QUICK_AMOUNTS = [30, 50, 100, 200, 350]

const ACTIVITY_TYPES = [
  {
    value: "PEMBAJAAN",
    label: "Membaja",
    defaultNote: "Tabur / sembur baja mengikut jadual",
  },
  {
    value: "KAWALAN_PEROSAK",
    label: "Meracun",
    defaultNote: "Semburan kawalan serangga & kulat",
  },
  {
    value: "MENYIRAM",
    label: "Menyiram",
    defaultNote: "Pengairan & periksa sistem paip/air",
  },
  {
    value: "MERUMPAI",
    label: "Merumpai",
    defaultNote: "Potong rumput keliling batas & petak",
  },
  {
    value: "PENYELENGGARAAN",
    label: "Baiki Kebun",
    defaultNote: "Pemeriksaan pagar, batas & peralatan",
  },
]

const CROP_PRESETS = [
  {
    label: "Padi",
    cropType: "Padi MR297",
    unit: "RELUNG",
    yield: "1800",
    price: "1.50",
  },
  {
    label: "Cili",
    cropType: "Cili Kulai Fertigasi",
    unit: "EKAR",
    yield: "4000",
    price: "8.50",
  },
  {
    label: "Timun",
    cropType: "Timun Batang Hibrid",
    unit: "EKAR",
    yield: "6000",
    price: "2.20",
  },
  {
    label: "Jagung",
    cropType: "Jagung Manis Mutiara",
    unit: "RELUNG",
    yield: "3200",
    price: "2.80",
  },
]

export default function QuickActionModals({
  selectedPlotId,
  plots,
  farmId,
  activeModal,
  onSetActiveModal,
  isAddPlotOpen,
  onCloseAddPlot,
  isHarvestModalOpen,
  onCloseHarvestModal,
}: QuickActionModalsProps) {
  const [expenseCategory, setExpenseCategory] = useState<"HIDDEN" | "DIRECT">(
    "HIDDEN"
  )
  const [expenseTitle, setExpenseTitle] = useState("")
  const [expenseAmount, setExpenseAmount] = useState("")
  const [activityType, setActivityType] = useState("PEMBAJAAN")
  const [activityNotes, setActivityNotes] = useState("")
  const [plotIdForForm, setPlotIdForForm] = useState(selectedPlotId)

  const todayISO = new Date().toISOString().split("T")[0]
  const defaultHarvestISO = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0]
  const [newCropType, setNewCropType] = useState("Padi MR297")
  const [newAreaUnit, setNewAreaUnit] = useState("RELUNG")
  const [newBaselineYield, setNewBaselineYield] = useState("1800")
  const [newMarketPrice, setNewMarketPrice] = useState("1.50")

  const [harvestWeight, setHarvestWeight] = useState("")
  const [harvestPrice, setHarvestPrice] = useState("")

  const [isPending, startTransition] = useTransition()

  const currentPlotId = plotIdForForm || selectedPlotId
  const currentPlot =
    plots.find((p) => p.id === selectedPlotId) ?? plots[0]

  function handleExpenseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await addExpenseAction(formData)
      onSetActiveModal(null)
    })
  }

  function handleActivitySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await addActivityAction(formData)
      onSetActiveModal(null)
    })
  }

  function handleAddPlotSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await addPlotAction(formData)
      onCloseAddPlot()
    })
  }

  function handleHarvestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await addHarvestAction(formData)
      setHarvestWeight("")
      setHarvestPrice("")
      onCloseHarvestModal()
    })
  }

  const presets =
    expenseCategory === "HIDDEN" ? HIDDEN_PRESETS : DIRECT_PRESETS

  const existingHarvestWeight =
    currentPlot?.harvests.reduce((s, h) => s + h.actualWeight, 0) ?? 0
  const existingHarvestRevenue =
    currentPlot?.harvests.reduce((s, h) => s + h.totalRevenue, 0) ?? 0
  const enteredWeight = parseFloat(harvestWeight) || 0
  const enteredPrice =
    parseFloat(harvestPrice) || (currentPlot?.marketPriceEst ?? 0)
  const previewTotalWeight = existingHarvestWeight + enteredWeight
  const previewTotalRevenue =
    existingHarvestRevenue + enteredWeight * enteredPrice
  const forecastedYield = currentPlot?.projectedYieldKg ?? 0
  const forecastedRevenue = currentPlot?.projectedRevenue ?? 0

  return (
    <>
      {/* Modal: + Catat Kos */}
      {activeModal === "EXPENSE" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C251E]/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 text-[#1C251E] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Jurnal Kewangan Kebun
                </span>
                <h3 className="font-serif-editorial text-xl font-bold text-[#1C251E]">
                  Catat Kos Baharu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSetActiveModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE5D9] text-[#4A554E] hover:text-[#1C251E]"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="mt-4 space-y-4">
              <input type="hidden" name="category" value={expenseCategory} />
              <input
                type="hidden"
                name="isHidden"
                value={expenseCategory === "HIDDEN" ? "true" : "false"}
              />

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                  Pilih Lot Tanaman
                </label>
                <select
                  name="plotId"
                  value={currentPlotId}
                  onChange={(e) => setPlotIdForForm(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-base font-medium text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                >
                  {plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.cropType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                  Jenis Perbelanjaan
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setExpenseCategory("HIDDEN")}
                    className={`flex h-14 flex-col items-center justify-center rounded-xl border px-3 text-center transition-colors ${
                      expenseCategory === "HIDDEN"
                        ? "border-[#C2410C] bg-[#FEF7F0] text-[#C2410C] font-bold"
                        : "border-[#E2DDD2] bg-[#F5F2EB] text-[#5A655D]"
                    }`}
                  >
                    <span className="flex items-center gap-1 text-sm font-extrabold">
                      <AlertTriangle className="h-4 w-4 text-[#C2410C]" />
                      Kos Tersembunyi
                    </span>
                    <span className="text-[11px] opacity-85">
                      Minyak, Upah, Baiki, Lori
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpenseCategory("DIRECT")}
                    className={`flex h-14 flex-col items-center justify-center rounded-xl border px-3 text-center transition-colors ${
                      expenseCategory === "DIRECT"
                        ? "border-[#2D6A4F] bg-[#2D6A4F]/12 text-[#163020] font-bold"
                        : "border-[#E2DDD2] bg-[#F5F2EB] text-[#5A655D]"
                    }`}
                  >
                    <span className="flex items-center gap-1 text-sm font-extrabold">
                      <CheckCircle2 className="h-4 w-4 text-[#2D6A4F]" />
                      Kos Langsung
                    </span>
                    <span className="text-[11px] opacity-85">
                      Benih, Baja, Racun
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                  Butiran Kos (Pilih Pantas atau Taip)
                </label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setExpenseTitle(preset)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        expenseTitle === preset
                          ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                          : "border-[#E2DDD2] bg-[#F5F2EB] text-[#4A554E] hover:border-[#2D6A4F]"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  name="title"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="Contoh: Minyak Mesin Rumput / Baja AB"
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-base text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                  Jumlah Bayaran (RM)
                </label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {QUICK_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setExpenseAmount(String(amt))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                        expenseAmount === String(amt)
                          ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                          : "border-[#E2DDD2] bg-[#F5F2EB] text-[#4A554E] hover:border-[#2D6A4F]"
                      }`}
                    >
                      RM {amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="1"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="Masukkan nilai RM (cth: 85)"
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-lg font-bold text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#163020] text-base font-bold text-[#F5F2EB] shadow-sm hover:bg-[#234832] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Menyimpan Rekod...</span>
                  </>
                ) : (
                  <span>Simpan Rekod Kos</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: + Log Aktiviti */}
      {activeModal === "ACTIVITY" && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C251E]/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 text-[#1C251E] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Buku Log Kebun
                </span>
                <h3 className="font-serif-editorial text-xl font-bold text-[#1C251E]">
                  Log Aktiviti Tanaman
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onSetActiveModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE5D9] text-[#4A554E] hover:text-[#1C251E]"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleActivitySubmit} className="mt-4 space-y-4">
              <input type="hidden" name="type" value={activityType} />

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                  Pilih Lot Tanaman
                </label>
                <select
                  name="plotId"
                  value={currentPlotId}
                  onChange={(e) => setPlotIdForForm(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-base font-medium text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                >
                  {plots.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.cropType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                  Jenis Kerja Kebun
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIVITY_TYPES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setActivityType(item.value)
                        if (!activityNotes) setActivityNotes(item.defaultNote)
                      }}
                      className={`flex h-12 items-center justify-center rounded-xl border px-3 text-sm font-bold transition-colors ${
                        activityType === item.value
                          ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                          : "border-[#E2DDD2] bg-[#F5F2EB] text-[#4A554E] hover:border-[#2D6A4F]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                  Catatan Ringkas
                </label>
                <input
                  type="text"
                  name="notes"
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  placeholder="Contoh: Semburan Baja AB (EC 1.8) waktu pagi"
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-base text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#163020] text-base font-bold text-[#F5F2EB] shadow-sm hover:bg-[#234832] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Menyimpan Aktiviti...</span>
                  </>
                ) : (
                  <span>Simpan Log Aktiviti</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: + Lot Baru (Add New Plot) */}
      {isAddPlotOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C251E]/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 text-[#1C251E] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Pengurusan Ladang
                </span>
                <h3 className="font-serif-editorial text-xl font-bold text-[#1C251E]">
                  Tambah Lot Tanaman Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseAddPlot}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE5D9] text-[#4A554E] hover:text-[#1C251E]"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlotSubmit} className="mt-4 space-y-3.5">
              <input type="hidden" name="farmId" value={farmId} />

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                  Nama Lot / Petak
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Petak 2 - Timun / Lot B - Jagung"
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-base text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                  Jenis Tanaman (Padi / Cili / Timun / Jagung)
                </label>
                <div className="mb-2 grid grid-cols-4 gap-1.5">
                  {CROP_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setNewCropType(preset.cropType)
                        setNewAreaUnit(preset.unit)
                        setNewBaselineYield(preset.yield)
                        setNewMarketPrice(preset.price)
                      }}
                      className={`h-10 rounded-xl border text-xs font-bold transition-colors ${
                        newCropType === preset.cropType
                          ? "border-[#163020] bg-[#163020] text-[#F5F2EB]"
                          : "border-[#E2DDD2] bg-[#F5F2EB] text-[#4A554E] hover:border-[#2D6A4F]"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  name="cropType"
                  required
                  value={newCropType}
                  onChange={(e) => setNewCropType(e.target.value)}
                  placeholder="Contoh: Padi MR297 / Cili Kulai / Timun / Jagung"
                  className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-base text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                    Keluasan
                  </label>
                  <input
                    type="number"
                    name="areaSize"
                    step="0.1"
                    min="0.1"
                    required
                    defaultValue="1.0"
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-base font-bold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                    Unit Keluasan
                  </label>
                  <select
                    name="areaUnit"
                    value={newAreaUnit}
                    onChange={(e) => setNewAreaUnit(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-base font-semibold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                  >
                    <option value="RELUNG">RELUNG</option>
                    <option value="EKAR">EKAR</option>
                    <option value="HEKTAR">HEKTAR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                    Tarikh Tanam
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    required
                    defaultValue={todayISO}
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-sm font-semibold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                    Jangkaan Tuai
                  </label>
                  <input
                    type="date"
                    name="expectedHarvest"
                    required
                    defaultValue={defaultHarvestISO}
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3 text-sm font-semibold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                    Hasil Asas (kg/unit)
                  </label>
                  <input
                    type="number"
                    name="baselineYield"
                    step="50"
                    min="50"
                    required
                    value={newBaselineYield}
                    onChange={(e) => setNewBaselineYield(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-base font-semibold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1">
                    Harga Pasaran (RM/kg)
                  </label>
                  <input
                    type="number"
                    name="marketPriceEst"
                    step="0.1"
                    min="0.2"
                    required
                    value={newMarketPrice}
                    onChange={(e) => setNewMarketPrice(e.target.value)}
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-base font-semibold text-[#1C251E] focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#163020] text-base font-bold text-[#F5F2EB] shadow-sm hover:bg-[#234832] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Menambah Lot...</span>
                  </>
                ) : (
                  <span>Simpan Lot Tanaman Baru</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Rekod Tuai (Record Harvest) */}
      {isHarvestModalOpen && currentPlot && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C251E]/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 text-[#1C251E] shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2DDD2] pb-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Hasil Sebenar Ladang
                </span>
                <h3 className="font-serif-editorial text-xl font-bold text-[#1C251E] flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[#2D6A4F]" />
                  Rekod Tuai ({currentPlot.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseHarvestModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAE5D9] text-[#4A554E] hover:text-[#1C251E]"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHarvestSubmit} className="mt-4 space-y-4">
              <input type="hidden" name="plotId" value={currentPlot.id} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                    Berat Dituai (kg)
                  </label>
                  <input
                    type="number"
                    name="actualWeight"
                    step="1"
                    min="1"
                    required
                    value={harvestWeight}
                    onChange={(e) => setHarvestWeight(e.target.value)}
                    placeholder="cth: 1850"
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-lg font-bold text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1C251E] mb-1.5">
                    Harga Jualan (RM/kg)
                  </label>
                  <input
                    type="number"
                    name="soldPrice"
                    step="0.05"
                    min="0.1"
                    required
                    value={harvestPrice}
                    onChange={(e) => setHarvestPrice(e.target.value)}
                    placeholder={currentPlot.marketPriceEst.toFixed(2)}
                    className="h-12 w-full rounded-xl border border-[#E2DDD2] bg-[#F5F2EB] px-3.5 text-lg font-bold text-[#1C251E] placeholder:text-[#7A847C] focus:border-[#2D6A4F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#2D6A4F]/30 bg-[#F5F2EB] p-3.5 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Perbandingan Unjuran vs Hasil Sebenar
                </p>
                <div className="grid grid-cols-2 gap-2.5 text-sm">
                  <div className="rounded-xl bg-[#FAF8F3] border border-[#E2DDD2] p-2.5">
                    <span className="text-xs text-[#5A655D] block">
                      Hasil Dijangka
                    </span>
                    <span className="font-serif-editorial text-base font-bold text-[#1C251E]">
                      {forecastedYield.toLocaleString("ms-MY")} kg
                    </span>
                    <span className="text-xs text-[#5A655D] block mt-0.5">
                      RM {formatRM(forecastedRevenue)}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#2D6A4F]/12 border border-[#2D6A4F]/35 p-2.5">
                    <span className="text-xs text-[#163020] block font-semibold">
                      Jumlah Hasil Sebenar
                    </span>
                    <span className="font-serif-editorial text-base font-bold text-[#2D6A4F]">
                      {previewTotalWeight.toLocaleString("ms-MY")} kg
                    </span>
                    <span className="text-xs text-[#163020] block mt-0.5 font-medium">
                      RM {formatRM(previewTotalRevenue)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#163020] text-base font-bold text-[#F5F2EB] shadow-sm hover:bg-[#234832] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Menyimpan Rekod Tuai...</span>
                  </>
                ) : (
                  <span>Simpan Rekod Tuai</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
