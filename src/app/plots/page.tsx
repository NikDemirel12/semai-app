import { getOrSeedDashboardData } from "@/actions/semai"
import PlotsPageView from "@/components/PlotsPageView"

export const dynamic = "force-dynamic"

export default async function PlotsPage() {
  const { user, farms, plots } = await getOrSeedDashboardData()
  const primaryFarm = farms[0]

  return (
    <PlotsPageView
      farmerName={user.name}
      farmerLocation={user.location}
      farmId={primaryFarm?.id ?? ""}
      farmName={primaryFarm?.name ?? "Kebun Hijau Ahmad"}
      plots={plots}
    />
  )
}
