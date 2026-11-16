import { getOrSeedDashboardData } from "@/actions/semai"
import InsightsPageView from "@/components/InsightsPageView"

export const dynamic = "force-dynamic"

export default async function InsightsPage() {
  const { user, farms, plots } = await getOrSeedDashboardData()
  const primaryFarm = farms[0]

  return (
    <InsightsPageView
      farmerName={user.name}
      farmerLocation={user.location}
      farmName={primaryFarm?.name ?? "Kebun Hijau Ahmad"}
      plots={plots}
    />
  )
}
