import TripDashboardClient from "@/components/TripDashboardClient";
import Footer from "@/components/Footer";

export default function TripsPage() {
  return (
    <>
      <main className="bg-[#F4EFE6] min-h-screen">
        <TripDashboardClient />
      </main>
      <Footer />
    </>
  );
}
