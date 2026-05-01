import { getAllEvents } from "@/services/event";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { Metadata } from "next";
import EventsPageClient from "@/components/events/events-page-client";

export const metadata: Metadata = {
  title: "Events | Made360",
  description:
    "Browse all upcoming and past leadership events, workshops, and seminars by Made360.",
};

export default async function EventsPage() {
  const events = await getAllEvents();

  // Split & sort on the server
  const now = new Date();

  const upcoming = events
    .filter((e: any) => e.status === "upcoming" && new Date(e.date) >= now)
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  const past = events
    .filter((e: any) => e.status === "past" || new Date(e.date) < now)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  return (
    <main className="relative bg-white font-outfit min-h-screen">
      <Navbar />
      <EventsPageClient upcoming={upcoming} past={past} />
      <Footer />
    </main>
  );
}
