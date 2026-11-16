import { getOrSeedDashboardData } from "@/actions/semai"
import FinancePageView from "@/components/FinancePageView"

export const dynamic = "force-dynamic"

export default async function FinancePage() {
  const { user, farms, plots, analytics } = await getOrSeedDashboardData()
  const primaryFarm = farms[0]

  return (
    <FinancePageView
      farmerName={user.name}
      farmerLocation={user.location}
      farmId={primaryFarm?.id ?? ""}
      farmName={primaryFarm?.name ?? "Kebun Hijau Ahmad"}
      plots={plots}
      overallAnalytics={analytics}
    />
  )
}
