"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const journeySteps = [
  {
    title: "Executive Coaching Engagement",
    description:
      "For Senior Leaders – Strengthens judgment, strategic thinking, and organizational influence.",
    image: "/images/audience-executive.png",
  },
  {
    title: "Leadership Coaching Engagement",
    description:
      "For Emerging Leaders – Builds leadership confidence, communication, and career progression.",
    image: "/images/audience-professional.png",
  },
  {
    title: "Organizational Leadership Development",
    description:
      "For SMEs – Enhances leadership capability, team alignment, and workplace culture.",
    image: "/images/audience-sme.png",
  },
  {
    title: "Team Performance & Collaboration Intervention",
    description: "Improves communication, trust, and execution across teams.",
    image: "/images/leadership-collaboration.png",
  },
  {
    title: "Change & Transition Leadership Engagement",
    description:
      "Supports leaders navigating growth, restructuring, or cultural change.",
    image: "/images/transformation-leader.png",
  },
  {
    title: "Sales & Performance Leadership Engagement",
    description:
      "Strengthens mindset, consistency, and performance in sales teams.",
    image: "/images/hero-home.jpg",
  },
  {
    title: "Work-Life Balance & Leadership Well-Being",
    description:
      "Focuses on sustainable productivity, stress management, and resilience.",
    image: "/images/work_life.jpg",
  },
  {
    title: "Executive & Corporate Speaking Engagements",
    description: "Purpose-driven keynotes aligned with organizational goals.",
    image: "/images/speaker.jpg",
  },
];

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "0%",
      typeof window !== "undefined" && window.innerWidth < 768
        ? "-650%"
        : "-210%",
    ],
  );

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden mx-auto max-w-7xl">
        <div className="container mx-auto px-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-4">
              Our Services
            </h2>
            <h3 className="text-2xl md:text-6xl font-bold text-white mb-6">
              Leadership{" "}
              <span className="text-primary italic">Engagements</span>
            </h3>
            <p className="text-base text-white/60">
              Explore our structured coaching and development engagements
              designed for sustainable impact.
            </p>
          </motion.div>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-6 md:px-24">
          {journeySteps.map((step, index) => (
            <div key={index} className="shrink-0  w-[85vw] md:w-[450px]">
              <div className="group relative  h-96 md:h-72 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-primary/50">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-4 md:p-8">
                  <span className="text-primary font-bold text-4xl mb-4 block opacity-40">
                    0{index + 1}
                  </span>
                  <h4 className="text-lg md:text-2xl font-bold text-white mb-2 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-white/70">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="shrink-0 w-[40vw]" />
        </motion.div>
      </div>
    </section>
  );
}
