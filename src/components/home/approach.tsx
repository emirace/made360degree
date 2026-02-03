"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Check,
  Target,
  Lightbulb,
  Shield,
  BarChart3,
  Users,
  User,
  ArrowRight,
  ClipboardCheck,
  ChevronRight,
} from "lucide-react";
import RevealImage from "@/components/animations/reveal-image";
import MagneticButton from "@/components/animations/magnetic-button";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    title: "Clarity",
    icon: Lightbulb,
    description: "Role, responsibilities, and goals",
    image: "/images/audience-executive.png",
  },
  {
    title: "Capability",
    icon: Target,
    description: "Strategic thinking, emotional intelligence, communication",
    image: "/images/audience-professional.png",
  },
  {
    title: "Discipline",
    icon: Shield,
    description: "Execution, accountability, consistency",
    image: "/images/audience-sme.png",
  },
  {
    title: "Impact",
    icon: BarChart3,
    description: "Measurable organizational and personal outcomes",
    image: "/images/leadership-collaboration.png",
  },
];

const methodology = [
  "Context-specific",
  "Outcome-driven",
  "Practical application",
];

const organizationalEngagements = [
  "Discovery & Context Assessment",
  "Engagement Design",
  "Delivery & Facilitation",
  "Integration & Reinforcement",
];

const individualEngagements = [
  "Leadership identity & presence",
  "Career clarity & progression",
  "Decision-making confidence",
];

const suitabilityPoints = [
  "Leaders who value substance over hype",
  "Organizations seeking structured leadership",
  "Professionals serious about growth",
];

export default function Approach() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section className="relative bg-white py-24 sm:py-32 overflow-hidden border-t border-black/5">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-medium tracking-[0.2em] text-primary uppercase mb-4">
              Our Approach
            </h2>
            <h3 className="text-2xl md:text-6xl font-bold text-black mb-6">
              Leadership Development Grounded in{" "}
              <span className="text-primary italic">Reality</span>
            </h3>
            <p className="text-lg text-black/60 leading-relaxed max-w-2xl">
              Our approach strengthens decision-making, team performance,
              organizational culture, and sustained results.
            </p>
          </motion.div>

          <div className="flex flex-col justify-end gap-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-primary/5 border border-primary/20 backdrop-blur-sm shadow-xl"
            >
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-3">
                Core Belief
              </h4>
              <p className="text-xl font-bold text-black leading-tight">
                Leadership is measured by decisions, influence, discipline, and
                clarity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-black/40 font-bold uppercase tracking-widest text-xs mb-4">
                Structured Methodology
              </h4>
              <div className="flex flex-wrap gap-4">
                {methodology.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-black/80"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-2xl font-bold text-black">Four Pillars</h3>
            <div className="h-px flex-1 bg-black/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-3xl bg-black/5 border border-black/10 hover:border-primary/50 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <pillar.icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold text-black mb-4">
                    <span className="text-primary/50 mr-2">{index + 1}.</span>
                    {pillar.title}
                  </h4>
                  <p className="text-black/50 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-16 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[40px] bg-linear-to-br from-black/5 to-transparent border border-black/10 order-2 lg:order-1"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white">
                  <Users className="h-7 w-7" />
                </div>
                <h4 className="text-2xl font-bold text-black">
                  Organizational Engagements
                </h4>
              </div>
              <ul className="space-y-6">
                {organizationalEngagements.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-black/70 text-base group"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 border border-black/10 text-primary font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="relative aspect-square lg:aspect-video rounded-[40px] overflow-hidden order-1 lg:order-2 shadow-2xl">
              <Image
                fill
                src="/images/org_engage.jpg"
                alt="Organizational Leadership"
                className="object-cover object-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square lg:aspect-video rounded-[40px] overflow-hidden shadow-2xl">
              <Image
                fill
                src="/images/engage.jpg"
                alt="Individual Leadership"
                className="object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[40px] bg-linear-to-br from-black/5 to-transparent border border-black/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center">
                  <User className="h-7 w-7" />
                </div>
                <h4 className="text-2xl font-bold text-black">
                  Individual Engagements
                </h4>
              </div>
              <ul className="space-y-6">
                {individualEngagements.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-black/70 text-base"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <div
          ref={ctaRef}
          className="relative p-12 md:p-20 rounded-[50px] bg-primary/90 overflow-hidden text-white"
        >
          <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
            <Image
              src="/images/leadership-collaboration.png"
              alt="Commitment Background"
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary/40" />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 to-transparent" />
          </motion.div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 text-left">
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg font-bold uppercase tracking-widest opacity-80 mb-6"
              >
                Suitability
              </motion.h4>
              <div className="space-y-4 mb-12">
                {suitabilityPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-4 text-lg">
                    <Check className="h-6 w-6 font-bold shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/20">
                <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                  Our Commitment
                </h4>
                <p className="text-xl md:text-3xl font-bold leading-tight">
                  Thoughtful, grounded, relevant, and sustainable leadership
                  development.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col items-center lg:items-end justify-center">
              <div className="text-center lg:text-right mb-8">
                <p className="text-4xl md:text-6xl font-black mb-2">READY?</p>
                <p className="text-lg opacity-80 font-medium">
                  Let's transform your leadership capacity.
                </p>
              </div>
              <MagneticButton>
                <Button className="group rounded-full bg-white h-12  p-1 text-base font-medium text-black transition-all hover:bg-white/90">
                  <span className="px-4">Engage Made360Degrees</span>
                  <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Button>
              </MagneticButton>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] z-0" />
        </div>
      </div>
    </section>
  );
}
