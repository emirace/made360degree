"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight, Calendar, MapPin, ArrowRight } from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "Leadership DNA Summit",
    subtitle: "High-level strategic foresight for senior executives.",
    date: "Jan 15, 2026",
    location: "Virtual Experience",
    image: "/images/audience-executive.png",
  },
  {
    id: 2,
    title: "Emotional Intelligence Masterclass",
    subtitle: "Practical EI frameworks for emerging and senior leaders.",
    date: "Feb 10, 2026",
    location: "London, UK / Hybrid",
    image: "/images/audience-professional.png",
  },
  {
    id: 3,
    title: "Executive Presence Gala",
    subtitle:
      "Networking and impact strategies for high-performing professionals.",
    date: "March 22, 2026",
    location: "Lagos, Nigeria",
    image: "/images/transformation-leader.png",
  },
  {
    id: 4,
    title: "SME Transformation Workshop",
    subtitle:
      "Build leadership capability and team alignment in growth-phase companies.",
    date: "April 05, 2026",
    location: "Virtual Workshop",
    image: "/images/audience-sme.png",
  },
];

export default function Events() {
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth * 0.8; // Approximate card width
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
      const { scrollLeft, scrollWidth, offsetWidth } =
        scrollContainerRef.current;
      const index = Math.round(
        scrollLeft / (scrollWidth / upcomingEvents.length),
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
            className="text-5xl md:text-7xl font-bold text-black tracking-tight mb-6"
          >
            Upcoming Events
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-black/60 max-w-2xl mx-auto"
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
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex-none w-[300px] md:w-[400px] aspect-4/5 relative rounded-lg overflow-hidden group shadow-2xl snap-center first:ml-6 last:mr-6"
              >
                <Image
                  src={event.image}
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
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-white/70 text-md max-w-[280px] mx-auto">
                      {event.subtitle}
                    </p>

                    <div className="pt-8">
                      <Button className="rounded-full border border-white/30 bg-transparent px-8 py-6 text-lg font-medium text-white transition-all hover:bg-white hover:text-black">
                        Register Now
                      </Button>
                    </div>
                  </motion.div>
                </div>
                <div className="absolute top-10 left-0 flex flex-col gap-1 bg-white px-4 py-2 rounded-r-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none justify-between px-4">
            <button
              onClick={slideLeft}
              className={`h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white hover:text-black pointer-events-auto ${scrollIndex === 0 ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </button>
            <button
              onClick={slideRight}
              className={`h-14 w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white hover:text-black pointer-events-auto ${scrollIndex >= upcomingEvents.length - 1 ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="md:mt-10 flex justify-center">
          <MagneticButton>
            <Button className="group rounded-full bg-primary h-14 p-1 text-xl font-medium text-white transition-all hover:bg-primary/90 shadow-2xl">
              <span className="px-6">View All Events</span>
              <div className="ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-1">
                <ChevronRight className="h-5 w-5" />
              </div>
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
