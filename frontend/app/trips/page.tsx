import { getTrips } from "@/services/tripService";
import TripDashboardClient from "@/components/TripDashboardClient";

export default async function TripsPage() {
  let trips = [];
  try {
    trips = await getTrips();
  } catch (error) {
    console.error("Failed to fetch trips:", error);
  }

  return (
    <main className="bg-[#F4EFE6] min-h-screen">
      <TripDashboardClient initialTrips={trips} />
    </main>
  );
}
