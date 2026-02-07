import { getAllEvents } from "@/services/event";
import EventListClient from "@/components/dashboard/event-list-client";

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="space-y-6">
      <EventListClient initialEvents={events} />
    </div>
  );
}
