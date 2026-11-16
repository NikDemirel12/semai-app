"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import {
  calculatePlotForecast,
  calculateOverallForecast,
  type PlotForecast,
} from "@/lib/forecasting"

export async function getOrSeedDashboardData() {
  let user = await prisma.user.findFirst({
    include: {
      farms: {
        include: {
          plots: {
            include: {
              activities: {
                orderBy: { date: "desc" },
              },
              expenses: {
                orderBy: { date: "desc" },
              },
              harvests: {
                orderBy: { date: "desc" },
              },
            },
            orderBy: { plantingDate: "desc" },
          },
        },
      },
    },
  })

  if (!user) {
    const now = new Date()
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    user = await prisma.user.create({
      data: {
        name: "Pak Ahmad",
        email: "pakahmad@semai.my",
        location: "Pendang, Kedah",
        farms: {
          create: {
            name: "Kebun Hijau Ahmad",
            plots: {
              create: [
                {
                  name: "Lot A - Cili Fertigasi",
                  areaSize: 0.5,
                  areaUnit: "EKAR",
                  cropType: "Cili Kulai Fertigasi",
                  plantingDate: daysAgo(45),
                  expectedHarvest: daysFromNow(45),
                  baselineYield: 4000,
                  marketPriceEst: 8.5,
                  status: "ACTIVE",
                  activities: {
                    create: [
                      {
                        type: "PEMBAJAAN",
                        notes: "Semburan Baja AB ke semua polibeg (EC 1.8)",
                        date: daysAgo(2),
                      },
                      {
                        type: "KAWALAN_PEROSAK",
                        notes: "Semburan kawalan kutu thrips dan lalat putih",
                        date: daysAgo(6),
                      },
                      {
                        type: "PENYELENGGARAAN",
                        notes: "Ikat dahan cili dan periksa tekanan paip drip",
                        date: daysAgo(12),
                      },
                    ],
                  },
                  expenses: {
                    create: [
                      {
                        title: "Set Baja AB (50L)",
                        amount: 450,
                        category: "DIRECT",
                        isHidden: false,
                        date: daysAgo(30),
                      },
                      {
                        title: "Anak Benih Cili Kulai F1",
                        amount: 350,
                        category: "DIRECT",
                        isHidden: false,
                        date: daysAgo(44),
                      },
                      {
                        title: "Racun Organik Neem & Kawalan Serangga",
                        amount: 180,
                        category: "DIRECT",
                        isHidden: false,
                        date: daysAgo(15),
                      },
                      {
                        title: "Upah Harian Ikat Pokok & Merumpai",
                        amount: 280,
                        category: "HIDDEN",
                        isHidden: true,
                        date: daysAgo(10),
                      },
                      {
                        title: "Minyak Mesin Rumput & Pam Air",
                        amount: 120,
                        category: "HIDDEN",
                        isHidden: true,
                        date: daysAgo(5),
                      },
                      {
                        title: "Baiki Paip Drip & Penyambung Bocor",
                        amount: 90,
                        category: "HIDDEN",
                        isHidden: true,
                        date: daysAgo(3),
                      },
                    ],
                  },
                },
                {
                  name: "Petak 1 - Padi",
                  areaSize: 2.0,
                  areaUnit: "RELUNG",
                  cropType: "Padi MR297",
                  plantingDate: daysAgo(35),
                  expectedHarvest: daysFromNow(70),
                  baselineYield: 1800,
                  marketPriceEst: 1.5,
                  status: "ACTIVE",
                  activities: {
                    create: [
                      {
                        type: "PEMBAJAAN",
                        notes: "Tabur baja urea pusingan pertama",
                        date: daysAgo(4),
                      },
                      {
                        type: "KAWALAN_AIR",
                        notes: "Periksa paras air petak sawah dan batas",
                        date: daysAgo(9),
                      },
                      {
                        type: "PENYEDIAAN_TANAH",
                        notes: "Bajak pusingan kedua dan ratakan petak sawah",
                        date: daysAgo(36),
                      },
                    ],
                  },
                  expenses: {
                    create: [
                      {
                        title: "Benih Padi Sah MR297 (6 Beg)",
                        amount: 360,
                        category: "DIRECT",
                        isHidden: false,
                        date: daysAgo(34),
                      },
                      {
                        title: "Baja Tambahan NPK & Urea",
                        amount: 540,
                        category: "DIRECT",
                        isHidden: false,
                        date: daysAgo(18),
                      },
                      {
                        title: "Racun Rumpai Sawah",
                        amount: 220,
                        category: "DIRECT",
                        isHidden: false,
                        date: daysAgo(20),
                      },
                      {
                        title: "Minyak Mesin Rumput Batas",
                        amount: 85,
                        category: "HIDDEN",
                        isHidden: true,
                        date: daysAgo(7),
                      },
                      {
                        title: "Pengangkutan Angkut Benih & Baja",
                        amount: 95,
                        category: "HIDDEN",
                        isHidden: true,
                        date: daysAgo(18),
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
      include: {
        farms: {
          include: {
            plots: {
              include: {
                activities: {
                  orderBy: { date: "desc" },
                },
                expenses: {
                  orderBy: { date: "desc" },
                },
                harvests: {
                  orderBy: { date: "desc" },
                },
              },
              orderBy: { plantingDate: "desc" },
            },
          },
        },
      },
    })
  }

  if (user.name === "Pak Din") {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: "Pak Ahmad", location: "Pendang, Kedah" },
    })
    user.name = "Pak Ahmad"
    user.location = "Pendang, Kedah"
    if (user.farms[0] && user.farms[0].name === "Kebun Kampung Naga") {
      await prisma.farm.update({
        where: { id: user.farms[0].id },
        data: { name: "Kebun Hijau Ahmad" },
      })
      user.farms[0].name = "Kebun Hijau Ahmad"
    }
  }

  const farms = user.farms
  const allPlots = farms.flatMap((farm) => farm.plots)

  const plotsWithForecast = allPlots.map((plot) => {
    const forecast: PlotForecast = calculatePlotForecast(plot)
    return {
      ...plot,
      forecast,
    }
  })

  const analytics = calculateOverallForecast(allPlots)

  return {
    user,
    farms,
    plots: plotsWithForecast,
    analytics,
  }
}

export async function addExpenseAction(formData: FormData) {
  const plotId = String(formData.get("plotId") ?? "").trim()
  const title = String(formData.get("title") ?? "").trim()
  const amount = parseFloat(String(formData.get("amount") ?? "0"))
  const category = String(formData.get("category") ?? "DIRECT").trim().toUpperCase()
  const receiptUrlRaw = formData.get("receiptUrl")
  const receiptUrl = receiptUrlRaw ? String(receiptUrlRaw).trim() : null
  const dateRaw = formData.get("date")
  const date = dateRaw ? new Date(String(dateRaw)) : new Date()

  if (!plotId || !title || isNaN(amount) || amount <= 0) {
    throw new Error("Sila lengkapkan maklumat kos dengan betul.")
  }

  const isHidden =
    category === "HIDDEN" ||
    String(formData.get("isHidden") ?? "").toLowerCase() === "true"

  await prisma.expense.create({
    data: {
      plotId,
      title,
      amount,
      category,
      isHidden,
      receiptUrl,
      date,
    },
  })

  revalidatePath("/")
}

export async function addActivityAction(formData: FormData) {
  const plotId = String(formData.get("plotId") ?? "").trim()
  const type = String(formData.get("type") ?? "").trim()
  const notesRaw = formData.get("notes")
  const notes = notesRaw ? String(notesRaw).trim() : null
  const dateRaw = formData.get("date")
  const date = dateRaw ? new Date(String(dateRaw)) : new Date()

  if (!plotId || !type) {
    throw new Error("Sila pilih lot tanaman dan jenis aktiviti.")
  }

  await prisma.activityLog.create({
    data: {
      plotId,
      type,
      notes,
      date,
    },
  })

  revalidatePath("/")
}

export async function addPlotAction(formData: FormData) {
  let farmId = String(formData.get("farmId") ?? "").trim()
  const name = String(formData.get("name") ?? "").trim()
  const areaSize = parseFloat(String(formData.get("areaSize") ?? "0"))
  const areaUnit = String(formData.get("areaUnit") ?? "RELUNG").trim().toUpperCase()
  const cropType = String(formData.get("cropType") ?? "").trim()
  const baselineYield = parseFloat(String(formData.get("baselineYield") ?? "0"))
  const marketPriceEst = parseFloat(String(formData.get("marketPriceEst") ?? "0"))
  const plantingDateRaw = formData.get("plantingDate")
  const expectedHarvestRaw = formData.get("expectedHarvest")

  const plantingDate = plantingDateRaw
    ? new Date(String(plantingDateRaw))
    : new Date()
  const expectedHarvest = expectedHarvestRaw
    ? new Date(String(expectedHarvestRaw))
    : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)

  if (!farmId) {
    const firstFarm = await prisma.farm.findFirst()
    if (!firstFarm) {
      throw new Error("Tiada rekod ladang ditemui.")
    }
    farmId = firstFarm.id
  }

  if (!name || !cropType || isNaN(areaSize) || areaSize <= 0) {
    throw new Error("Sila lengkapkan maklumat lot tanaman dengan betul.")
  }

  await prisma.plot.create({
    data: {
      farmId,
      name,
      areaSize,
      areaUnit,
      cropType,
      plantingDate,
      expectedHarvest,
      baselineYield: isNaN(baselineYield) || baselineYield <= 0 ? 1500 : baselineYield,
      marketPriceEst: isNaN(marketPriceEst) || marketPriceEst <= 0 ? 2.5 : marketPriceEst,
      status: "ACTIVE",
    },
  })

  revalidatePath("/")
}

export async function addHarvestAction(formData: FormData) {
  const plotId = String(formData.get("plotId") ?? "").trim()
  const actualWeight = parseFloat(String(formData.get("actualWeight") ?? "0"))
  const soldPrice = parseFloat(String(formData.get("soldPrice") ?? "0"))
  const dateRaw = formData.get("date")
  const date = dateRaw ? new Date(String(dateRaw)) : new Date()

  if (!plotId || isNaN(actualWeight) || actualWeight <= 0 || isNaN(soldPrice) || soldPrice <= 0) {
    throw new Error("Sila masukkan berat hasil (kg) dan harga jualan (RM/kg) yang sah.")
  }

  const totalRevenue = actualWeight * soldPrice

  await prisma.harvestLog.create({
    data: {
      plotId,
      actualWeight,
      soldPrice,
      totalRevenue,
      date,
    },
  })

  revalidatePath("/")
}
