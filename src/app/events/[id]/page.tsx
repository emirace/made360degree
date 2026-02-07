import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { getEventById, getUpcomingEvents } from "@/services/event";
import { notFound } from "next/navigation";
import { EventPaymentClient } from "@/components/events/event-payment-client";
import EventHero from "@/components/events/event-hero";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  const recentEvents = await getUpcomingEvents();

  if (!event) {
    notFound();
  }

  return (
    <main className="relative bg-zinc-50 text-black min-h-screen">
      <Navbar />
      <EventHero event={event} />
      <div className="pt-12 pb-16">
        <EventPaymentClient event={event} recentEvents={recentEvents} />
      </div>
      <Footer />
    </main>
  );
}
