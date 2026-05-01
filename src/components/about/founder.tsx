"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Award,
  BookOpen,
  MapPin,
  Briefcase,
  ExternalLink,
  Target,
} from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";

const Founder = () => {
  const credentials = [
    { icon: <Briefcase className="h-4 w-4" />, text: "BSc in Economics" },
    {
      icon: <BookOpen className="h-4 w-4" />,
      text: "MSc in International Business (Coventry University)",
    },
    { icon: <Award className="h-4 w-4" />, text: "PMP & PRINCE2 Certified" },
    {
      icon: <Target className="h-4 w-4" />,
      text: "Chartered Institute of Personnel Development Member",
    },
  ];

  const industries = [
    "Oil & Gas",
    "Sales & Marketing",
    "Automotive (JLR UK)",
    "Project Management",
    "HR & L&D",
  ];

  return (
    <section className="bg-black text-white py-24 md:py-32 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -mr-64 -mt-64" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Portrait Column */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-2/3 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl"
            >
              <Image
                src="/images/visionary.jpeg"
                alt="Mr. Kevin Dada"
                fill
                className="object-cover "
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="h-1px w-8 bg-primary" />
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                    Founder & Principal Coach
                  </p>
                </div>
                <h3 className="text-2xl font-bold mt-2">Mr. Kevin Dada</h3>
              </div>
            </motion.div>

            {/* Experience Tag */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-primary flex flex-col items-center justify-center border-4 border-black text-center shadow-2xl"
            >
              <span className="text-2xl font-bold italic lowercase">10+</span>
              <span className="text-[10px] font-bold uppercase tracking-wide">
                Years Exp.
              </span>
            </motion.div>
          </div>

          {/* Biography Column */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase"
              >
                <span>The Visionary</span>
                <div className="h-px w-10 bg-primary/30" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
              >
                Leadership Built on <span className="italic">Experience.</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-white/70 leading-relaxed text-base font-light"
            >
              <p>
                <span className="text-white font-medium">Mr. Kevin Dada</span>{" "}
                is a visionary strategist and mentor with over a decade of
                experience across the UK and Nigeria. His career spans{" "}
                <span className="text-white font-medium">
                  Jaguar Land Rover UK
                </span>
                , oil and gas, human resources, and learning and development.
              </p>
              <p>
                Grounded in the philosophy that true leadership is defined by{" "}
                <span className="text-white italic">
                  clarity, discipline, and courage
                </span>
                , Kevin combines practical experience with formal credentials to
                shape emerging leaders.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {credentials.map((cred, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {cred.icon}
                  </div>
                  <span className="text-sm font-medium text-white/60 leading-tight pt-1">
                    {cred.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 flex flex-wrap gap-3">
              {industries.map((item, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40"
                >
                  {item}
                </span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-10 border-t border-white/10 flex items-center justify-between gap-8"
            >
              <div className="flex items-center gap-4 text-white/40 italic text-sm">
                <Target className="h-4 w-4" />
                <p>
                  Passionate about basketball, golf, and raising a family with
                  leadership principles.
                </p>
              </div>

              <MagneticButton>
                <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-white transition-colors group">
                  <span>Connect</span>
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
