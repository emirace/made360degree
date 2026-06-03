"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Search,
  ArrowRight,
  Banknote,
  Clock,
  CheckCircle2,
  Landmark,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { stripHtml } from "@/lib/rich-text";

type ActiveFilter = "all" | "upcoming" | "past" | "free" | "premium";

const eventFilters: { id: ActiveFilter; label: string }[] = [
  { id: "all", label: "All Events" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "free", label: "Free" },
  { id: "premium", label: "Premium" },
];

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  status: "upcoming" | "past" | "cancelled";
  isPaid: boolean;
  price?: number;
  paymentMethod?: "gateway" | "manual";
}

interface EventsPageClientProps {
  upcoming: Event[];
  past: Event[];
}

function EventCard({
  event,
  index,
  currentTime,
}: {
  event: Event;
  index: number;
  currentTime: number;
}) {
  const isUpcoming = event.status === "upcoming";
  const eventDate = new Date(event.date);
  const daysUntil = Math.ceil(
    (eventDate.getTime() - currentTime) / (1000 * 60 * 60 * 24),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-zinc-100">
        <Image
          src={event.image || "/images/audience-executive.png"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isUpcoming ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              <Clock className="h-3 w-3" />
              {daysUntil <= 0
                ? "Today"
                : daysUntil === 1
                  ? "Tomorrow"
                  : daysUntil <= 7
                    ? `In ${daysUntil} days`
                    : "Upcoming"}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 backdrop-blur-sm text-zinc-300 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-3 w-3" />
              Past
            </span>
          )}
          {event.isPaid && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              <Banknote className="h-3 w-3" />
              Premium
            </span>
          )}
        </div>

        {/* Price overlay */}
        {event.isPaid && event.price && (
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
            <p className="text-xs text-zinc-500 font-medium leading-none mb-0.5">
              Fee
            </p>
            <p className="text-base font-bold text-zinc-900 leading-none">
              ₦{event.price.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Date & Location */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5" />
            {format(eventDate, "EEEE, MMMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </div>
        </div>

        {/* Title & description */}
        <div>
          <h3 className="text-lg font-bold text-zinc-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
            {stripHtml(event.description)}
          </p>
        </div>

        {/* Payment method hint */}
        {event.isPaid && event.paymentMethod && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            {event.paymentMethod === "manual" ? (
              <>
                <Landmark className="h-3.5 w-3.5 text-amber-500" />
                <span>Bank transfer accepted</span>
              </>
            ) : (
              <>
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                <span>Online payment</span>
              </>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="pt-2">
          {isUpcoming ? (
            <Button
              asChild
              className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl font-semibold group/btn"
            >
              <Link href={`/events/${event._id}`}>
                {event.isPaid
                  ? `Book Seat — ₦${(event.price || 0).toLocaleString()}`
                  : "Register Now"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              className="w-full border-zinc-200 text-zinc-500 hover:text-zinc-800 rounded-xl font-semibold"
            >
              <Link href={`/events/${event._id}`}>View Event Details</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function EventsPageClient({
  upcoming,
  past,
}: EventsPageClientProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [currentTime] = useState(() => Date.now());

  const filter = (arr: Event[], type: "upcoming" | "past") => {
    let result = arr;

    // Filter by category
    if (activeFilter === "upcoming" && type !== "upcoming") return [];
    if (activeFilter === "past" && type !== "past") return [];
    if (activeFilter === "free") result = result.filter(e => !e.isPaid);
    if (activeFilter === "premium") result = result.filter(e => e.isPaid);

    // Filter by search
    if (search.trim()) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return result;
  };

  const filteredUpcoming = filter(upcoming, "upcoming");
  const filteredPast = filter(past, "past");
  const hasResults = filteredUpcoming.length > 0 || filteredPast.length > 0;

  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative pt-32 pb-20 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/audience-executive.png"
            alt="Events"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Decorative glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] z-0" />

        <div className="container relative z-10 mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-white/80">
              Events & Workshops
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Shape the Leader <span className="text-primary">Within You</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Attend world-class workshops, summits, and seminars designed to
              transform your leadership capacity.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-8 mt-10 flex-wrap"
          >
            {[
              { label: "Upcoming", value: upcoming.length },
              { label: "Past Events", value: past.length },
              {
                label: "Total",
                value: upcoming.length + past.length,
              },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/50 uppercase tracking-widest font-medium mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16 bg-zinc-50">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Search & Filters */}
          <div className="flex flex-col items-center mb-14 gap-6">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
              <Input
                placeholder="Search events by title, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 rounded-2xl bg-white border-zinc-200 text-zinc-900 shadow-sm focus-visible:ring-primary text-base"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {eventFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                    activeFilter === f.id
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {!hasResults && search && (
            <div className="text-center py-20 text-zinc-400">
              <p className="text-lg font-medium">
                No events found for &ldquo;{search}&rdquo;
              </p>
              <p className="text-sm mt-2">Try a different search term.</p>
            </div>
          )}

          {/* ── Upcoming ── */}
          {filteredUpcoming.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 tracking-tight">
                    Coming Soon
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1">
                    {filteredUpcoming.length} upcoming event
                    {filteredUpcoming.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex-1 h-px bg-zinc-200" />
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUpcoming.map((event, i) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    index={i}
                    currentTime={currentTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Past Events ── */}
          {filteredPast.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 tracking-tight">
                    Past Events
                  </h2>
                  <p className="text-zinc-500 text-sm mt-1">
                    {filteredPast.length} completed event
                    {filteredPast.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex-1 h-px bg-zinc-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
                {filteredPast.map((event, i) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    index={i}
                    currentTime={currentTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!search && upcoming.length === 0 && past.length === 0 && (
            <div className="text-center py-24">
              <div className="h-24 w-24 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">
                No events yet
              </h3>
              <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                Stay tuned — upcoming leadership workshops and summits will
                appear here.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-primary text-white"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
