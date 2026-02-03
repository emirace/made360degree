"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MoveRight, Play, Users } from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";

const OurStory = () => {
  const stats = [
    { label: "Completed Projects", value: "10k+" },
    { label: "Satisfied Customers", value: "15k" },
    { label: "Years Of Mastery", value: "10k+" },
    { label: "Worldwide Honors", value: "45+" },
  ];

  return (
    <section className="bg-black text-white py-12 sm:py-16 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/50 text-xs font-bold tracking-[0.2em] uppercase">
                <span>Our Story</span>
                <div className="h-px w-10 bg-white/20" />
                <MoveRight className="h-3 w-3" />
              </div>

              <h2 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight">
                Empowering Leaders & Organizations{" "}
                <span className="text-primary italic">Since 2014.</span>
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/about.jpg"
                alt="Leadership Transformation"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>
          </div>

          <div className="flex flex-col pt-4 lg:pt-0">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-2xl overflow-hidden group"
              >
                <Image
                  src="/images/about2.jpg"
                  alt="Innovation"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[8px] uppercase font-bold text-white border border-white/10">
                    Leadership
                  </span>
                  <span className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[8px] uppercase font-bold text-white border border-white/10">
                    Growth
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative aspect-video rounded-2xl overflow-hidden group"
              >
                <Image
                  src="/images/about3.jpg"
                  alt="Teamwork"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[8px] uppercase font-bold text-white border border-white/10">
                    Strategy
                  </span>
                  <span className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full text-[8px] uppercase font-bold text-white border border-white/10">
                    Impact
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="space-y-8 flex-1 flex flex-col justify-center">
              <div className="space-y-4">
                <p className="text-base text-white/80 leading-relaxed font-light">
                  <span className="text-white font-bold">Made360Degrees</span>{" "}
                  is a personal development and leadership training organization
                  founded in 2014 in the United Kingdom.
                </p>
                <p className="text-base text-white/60 leading-relaxed">
                  We empower individuals and organizations through tailored
                  training and coaching that fosters leadership, collaboration,
                  and personal growth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-white">Our Vision</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    To be the catalyst for positive change, guiding individuals
                    on their journey to self-discovery and success.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-primary text-white space-y-3 shadow-xl shadow-primary/20"
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Play className="h-4 w-4 fill-white" />
                  </div>
                  <h3 className="font-bold">Our Mission</h3>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Igniting your aspirations to achieve the highest level
                    possible in your corporate career and life.
                  </p>
                </motion.div>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-black overflow-hidden relative"
                    >
                      <Image
                        src={`/images/audience-${i === 1 ? "executive" : i === 2 ? "professional" : "sme"}.png`}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <MagneticButton>
                  <button className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center transition-all bg-white/5 group-hover:bg-primary group-hover:border-primary">
                      <Play className="h-3 w-3 fill-white text-white ml-0.5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold group-hover:text-primary transition-colors">
                      Watch Intro
                    </span>
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
