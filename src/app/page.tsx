import { getOrSeedDashboardData } from "@/actions/semai"
import SemaiDashboard from "@/components/SemaiDashboard"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const { user, farms, plots, analytics } = await getOrSeedDashboardData()
  const primaryFarm = farms[0]

  return (
    <SemaiDashboard
      farmerName={user.name}
      farmerLocation={user.location}
      farmId={primaryFarm?.id ?? ""}
      farmName={primaryFarm?.name ?? "Kebun Hijau Ahmad"}
      plots={plots}
      overallAnalytics={analytics}
    />
  )
}
