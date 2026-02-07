import { getAllBookings } from "@/services/booking";
import BookingListClient from "@/components/dashboard/booking-list-client";

export default async function BookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
          Consultation Bookings
        </h2>
        <p className="text-zinc-400 mt-2">
          View and manage all consultation booking requests.
        </p>
      </div>

      <BookingListClient bookings={bookings} />
    </div>
  );
}
