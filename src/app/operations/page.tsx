import { getOrSeedDashboardData } from "@/actions/semai"
import OperationsPageView from "@/components/OperationsPageView"

export const dynamic = "force-dynamic"

export default async function OperationsPage() {
  const { user, farms, plots } = await getOrSeedDashboardData()
  const primaryFarm = farms[0]

  return (
    <OperationsPageView
      farmerName={user.name}
      farmerLocation={user.location}
      farmName={primaryFarm?.name ?? "Kebun Hijau Ahmad"}
      activePlotCount={plots.length}
    />
  )
}
