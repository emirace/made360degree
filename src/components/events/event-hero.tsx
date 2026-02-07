"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { IEvent } from "@/models/Event";

interface EventHeroProps {
  event: IEvent;
}

export default function EventHero({ event }: EventHeroProps) {
  return (
    <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-black overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/10 to-black z-10" />
        <Image
          src={event.image || "/images/audience-executive.png"}
          alt={event.title}
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      <div className="container relative z-20 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium mb-4">
            <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-white/80">
              {event.isPaid ? "Premium Event" : "Free Event"}
            </span>
          </div>

          <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm font-medium pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-medium pt-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/#events"
              className="hover:text-white transition-colors"
            >
              Events
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white truncate max-w-[200px]">
              {event.title}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
