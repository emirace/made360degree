"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import RevealImage from "@/components/animations/reveal-image";
import Image from "next/image";

const Transformation = () => {
  const points = [
    "Corporate leadership experience",
    "Global exposure across the UK and Nigeria",
    "Structured coaching frameworks",
    "Human-centered personal development",
  ];

  return (
    <section className="bg-white min-h-screen flex p-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-16 items-center">
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none group h-[400px] sm:h-[500px]">
            <RevealImage
              src="/images/transf.jpg"
              alt="Leadership Transformation"
              className="absolute top-0 left-0 w-[80%] h-[85%] rounded-3xl shadow-xl z-0 object-left"
            />

            <Image
              src="/images/trans2.jpg"
              alt="Team Collaboration"
              width={600}
              height={550}
              className="absolute bottom-0 right-0 w-[60%] h-[55%] rounded-3xl shadow-2xl border-4 border-white z-10 object-cover"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-4 left-10 bg-primary p-4 rounded-xl shadow-lg z-20"
            >
              <div className="text-white">
                <div className="text-2xl font-bold">10+ Years</div>
                <div className="text-xs uppercase tracking-wider opacity-80">
                  Methodical Experience
                </div>
              </div>
            </motion.div>

            <div className="absolute top-1/2 -left-8 -translate-y-1/2 h-24 w-24 rounded-full border border-primary/10 bg-white/10 backdrop-blur-sm lg:flex hidden items-center justify-center -z-10 animate-pulse">
              <span className="text-primary text-2xl font-bold italic opacity-20">
                360°
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-secondary sm:text-4xl mb-4 leading-tight">
              In a world saturated with motivation, <br />
              <span className="text-primary italic">
                Made360Degrees focuses on measurable transformation.
              </span>
            </h2>

            <p className="text-base leading-relaxed text-secondary/70 mb-4">
              Founded in the UK in 2014, we combine:
            </p>

            <ul className="space-y-4 mb-8">
              {points.map((point, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-base font-medium text-secondary/80 group-hover:text-secondary transition-colors">
                    {point}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="border-l-4 border-primary pl-6 py-2"
            >
              <p className="text-lg font-medium leading-relaxed text-secondary italic">
                &quot;To help individuals and organizations lead better, work
                better, and live better. This is leadership development designed
                for execution.&quot;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Transformation;
