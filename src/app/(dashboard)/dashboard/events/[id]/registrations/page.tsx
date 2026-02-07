import { getRegistrationsByEvent } from "@/services/registration";
import { getEventById } from "@/services/event";
import { redirect } from "next/navigation";
import RegistrationListClient from "@/components/dashboard/registration-list-client";

export default async function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    redirect("/dashboard/events");
  }

  const registrations = await getRegistrationsByEvent(id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
          Registrations for {event.title}
        </h2>
        <p className="text-zinc-400 mt-2">
          View all registered attendees for this event.
        </p>
      </div>

      <RegistrationListClient
        registrations={registrations}
        eventTitle={event.title}
      />
    </div>
  );
}
