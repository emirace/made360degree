"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Calendar,
  MapPin,
  Banknote,
} from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { stripHtml } from "@/lib/rich-text";
import { getEventPrice } from "@/lib/event-pricing";

interface HomeEvent {
  _id: string;
  title: string;
  description: string;
  date: string | Date;
  location: string;
  image?: string;
  isPaid?: boolean;
  price?: number;
  earlyBirdFee?: number;
}

interface EventsProps {
  events: HomeEvent[];
}

export default function Events({ events }: EventsProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const slideRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };

  const onScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth } = scrollContainerRef.current;
      const index = Math.round(
        scrollLeft / (scrollWidth / Math.max(events.length, 1)),
      );
      setScrollIndex(index);
    }
  };

  return (
    <section className="bg-white py-16 sm:py-24 overflow-hidden border-t border-black/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-7xl font-bold text-black tracking-tight mb-6"
          >
            Upcoming Events
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-black/60 max-w-2xl mx-auto"
          >
            Upcoming workshops, seminars, and speaking engagements.
          </motion.p>
        </div>

        <div className="relative group/carousel">
          <div
            ref={scrollContainerRef}
            onScroll={onScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12 transition-all scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollPaddingLeft: "24px",
              scrollPaddingRight: "24px",
            }}
          >
            {events.map((event) => {
              const pricing = getEventPrice(event);

              return (
                <div
                  key={event._id}
                  className="flex-none w-75 md:w-100 aspect-4/5 relative rounded-lg overflow-hidden group shadow-2xl snap-center first:ml-6 last:mr-6"
                >
                <Image
                  src={event.image || "/images/audience-executive.png"}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80" />

                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center text-white">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                  >
                    <h3 className="text-xl md:text-3xl font-bold leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-white/70 text-sm max-w-70 mx-auto line-clamp-2">
                      {stripHtml(event.description)}
                    </p>

                    {event.isPaid && pricing.hasEarlyBirdFee && (
                      <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">
                        <span className="text-emerald-700">
                          Early Bird ₦{pricing.amount.toLocaleString()}
                        </span>
                        <span className="text-zinc-400 line-through">
                          ₦{pricing.regularPrice.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="pt-8">
                      <Button
                        className="rounded-full border border-white/30 bg-transparent px-8 py-6 text-base font-medium text-white transition-all hover:bg-white hover:text-black"
                        asChild
                      >
                        <Link href={`/events/${event._id}`}>
                          {event.isPaid
                            ? `Book Seat - ₦${pricing.amount.toLocaleString()}`
                            : "Register Now"}
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
                <div className="absolute top-10 left-0 flex flex-col gap-1 bg-white px-4 py-3 rounded-r-lg shadow-xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                  {event.isPaid && (
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">
                      <Banknote className="h-3 w-3" />
                      <span>
                        {pricing.hasEarlyBirdFee
                          ? `Early Bird ₦${pricing.amount.toLocaleString()}`
                          : "Premium Event"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
            {events.length === 0 && (
              <div className="w-full text-center py-20 text-zinc-400">
                Stay tuned for our upcoming leadership sessions.
              </div>
            )}
          </div>

          {events.length > 1 && (
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none justify-between px-4">
              <button
                onClick={slideLeft}
                className={`h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white hover:text-black pointer-events-auto ${scrollIndex === 0 ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
              >
                <ChevronRight className="h-6 w-6 rotate-180" />
              </button>
              <button
                onClick={slideRight}
                className={`h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white hover:text-black pointer-events-auto ${scrollIndex >= events.length - 1 ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        <div className="md:mt-10 flex justify-center">
          <MagneticButton>
            <Link href="/events">
              <Button className="group rounded-full bg-primary h-14 p-1 text-lg font-medium text-white transition-all hover:bg-primary/90 shadow-2xl">
                <span className="px-6">View All Events</span>
                <div className="ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-1">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </Button>
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
