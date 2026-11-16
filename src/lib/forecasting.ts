export interface ExpenseItem {
  id?: string
  title?: string
  amount: number
  category: string
  isHidden: boolean
  date?: Date | string
}

export interface PlotInput {
  id: string
  name: string
  areaSize: number
  areaUnit: string
  cropType: string
  plantingDate: Date | string
  expectedHarvest: Date | string
  baselineYield: number
  marketPriceEst: number
  status: string
  expenses: ExpenseItem[]
}

export interface PlotForecast {
  projectedYieldKg: number
  projectedRevenue: number
  totalDirectCost: number
  totalHiddenCost: number
  totalCost: number
  hiddenCostPercentage: number
  isHiddenCostCritical: boolean
  projectedNetProfit: number
}

export function calculateProjectedYieldKg(
  areaSize: number,
  baselineYield: number,
  healthFactor: number = 1.0
): number {
  return areaSize * baselineYield * healthFactor
}

export function calculateProjectedRevenue(
  projectedYieldKg: number,
  marketPriceEst: number
): number {
  return projectedYieldKg * marketPriceEst
}

export function calculateTotalDirectCost(expenses: Pick<ExpenseItem, 'amount' | 'isHidden'>[]): number {
  return expenses
    .filter((expense) => expense.isHidden === false)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export function calculateTotalHiddenCost(expenses: Pick<ExpenseItem, 'amount' | 'isHidden'>[]): number {
  return expenses
    .filter((expense) => expense.isHidden === true)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export function calculateHiddenCostPercentage(
  totalHiddenCost: number,
  totalCost: number
): number {
  if (totalCost <= 0) return 0
  return (totalHiddenCost / totalCost) * 100
}

export function calculatePlotForecast(
  plot: Pick<PlotInput, 'areaSize' | 'baselineYield' | 'marketPriceEst' | 'expenses'>,
  healthFactor: number = 1.0
): PlotForecast {
  const projectedYieldKg = calculateProjectedYieldKg(
    plot.areaSize,
    plot.baselineYield,
    healthFactor
  )
  const projectedRevenue = calculateProjectedRevenue(
    projectedYieldKg,
    plot.marketPriceEst
  )
  const totalDirectCost = calculateTotalDirectCost(plot.expenses)
  const totalHiddenCost = calculateTotalHiddenCost(plot.expenses)
  const totalCost = totalDirectCost + totalHiddenCost
  const hiddenCostPercentage = calculateHiddenCostPercentage(
    totalHiddenCost,
    totalCost
  )
  const isHiddenCostCritical = hiddenCostPercentage > 20
  const projectedNetProfit = projectedRevenue - totalCost

  return {
    projectedYieldKg,
    projectedRevenue,
    totalDirectCost,
    totalHiddenCost,
    totalCost,
    hiddenCostPercentage,
    isHiddenCostCritical,
    projectedNetProfit,
  }
}

export function calculateOverallForecast(
  plots: Pick<PlotInput, 'areaSize' | 'baselineYield' | 'marketPriceEst' | 'expenses'>[],
  healthFactor: number = 1.0
): PlotForecast {
  const plotForecasts = plots.map((plot) => calculatePlotForecast(plot, healthFactor))

  const projectedYieldKg = plotForecasts.reduce((sum, f) => sum + f.projectedYieldKg, 0)
  const projectedRevenue = plotForecasts.reduce((sum, f) => sum + f.projectedRevenue, 0)
  const totalDirectCost = plotForecasts.reduce((sum, f) => sum + f.totalDirectCost, 0)
  const totalHiddenCost = plotForecasts.reduce((sum, f) => sum + f.totalHiddenCost, 0)
  const totalCost = totalDirectCost + totalHiddenCost
  const hiddenCostPercentage = calculateHiddenCostPercentage(totalHiddenCost, totalCost)
  const isHiddenCostCritical = hiddenCostPercentage > 20
  const projectedNetProfit = projectedRevenue - totalCost

  return {
    projectedYieldKg,
    projectedRevenue,
    totalDirectCost,
    totalHiddenCost,
    totalCost,
    hiddenCostPercentage,
    isHiddenCostCritical,
    projectedNetProfit,
  }
}
