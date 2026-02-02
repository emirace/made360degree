"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/animations/spotlight-card";

const audiences = [
  {
    title: "SMEs and Growing Organizations",
    description:
      "We support SMEs requiring structure, accountability, and capable leaders to scale sustainably.",
    image: "/images/audience-sme.png",
    outcomes: [
      "Stronger leadership alignment",
      "Improved team performance",
      "Healthier workplace culture",
    ],
  },
  {
    title: "Professionals and Emerging Leaders",
    description:
      "We equip professionals who carry responsibility with clarity, confidence, and leadership presence to advance in their careers.",
    image: "/images/audience-professional.png",
    outcomes: [
      "Clear career direction",
      "Improved decision-making",
      "Stronger leadership confidence",
    ],
  },
  {
    title: "Senior Leaders and Executives",
    description:
      "We support leaders managing growth, complexity, people, and change at scale.",
    image: "/images/audience-executive.png",
    outcomes: [
      "Strategic clarity",
      "Improved leadership judgment",
      "Stronger organizational influence",
    ],
  },
];

const Audience = () => {
  return (
    <section className="bg-black py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
                « Who We Work With »
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Leadership development <br />
              <span className="text-white/40 italic">designed for you.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-md text-lg text-white/60 leading-relaxed md:mb-2"
          >
            Made360Degrees partners with organizations and individuals at
            critical stages of growth and transformation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <SpotlightCard className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-white/10 transition-all hover:border-white/20">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h3 className="text-xl font-bold text-white pr-4">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-8">
                  <p className="text-white/70 mb-8 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-auto">
                    <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                      Outcomes:
                    </p>
                    <ul className="space-y-3">
                      {item.outcomes.map((outcome, oIndex) => (
                        <li
                          key={oIndex}
                          className="flex items-center gap-3 text-white/80 group/item"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 transition-transform group-hover/item:scale-125" />
                          <span className="text-sm font-medium">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
