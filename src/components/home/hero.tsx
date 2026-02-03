"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitText from "@/components/animations/split-text";
import MagneticButton from "@/components/animations/magnetic-button";
import ScrambleText from "@/components/animations/scramble-text";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const statsY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-black"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <Image
          src="/images/hero-home.jpg"
          alt="Leadership Background"
          fill
          className="object-cover hidden md:block opacity-60"
          priority
        />
        <Image
          src="/images/hero-home-mob.jpg"
          alt="Leadership Background"
          fill
          className="object-cover block md:hidden opacity-60 object-bottom-right"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col md:justify-center px-6 pt-32 pb-20 md:pt-40"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
            « <ScrambleText text="MADE360DEGREES" delay={0.5} /> »
          </span>
        </motion.div>

        <SplitText
          text="Developing Leaders Who Create"
          className="max-w-4xl text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl mt-6"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-4xl text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6"
        >
          <span className="text-primary italic">Real Change.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mb-12 max-w-2xl"
        >
          <p className=" text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
            Made360Degrees develops leaders, professionals, and organizations
            through structured coaching and leadership engagements designed for
            clarity, performance, and sustained impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap items-center gap-6 mb-20"
        >
          <MagneticButton>
            <Button className="group rounded-full bg-white h-12  p-1 text-base font-medium text-black transition-all hover:bg-white/90">
              <span className="px-4">Engage Made360Degrees</span>
              <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <button className="text-base font-semibold text-white transition-colors hover:text-primary">
              Explore Our Work
            </button>
          </MagneticButton>
        </motion.div>

        <motion.div
          style={{ y: statsY }}
          className="md:absolute bottom-12 left-6 right-6 border-t border-white/10 pt-8"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-1 text-xl font-bold text-white">500+</div>
              <div className="text-sm text-white/40 uppercase tracking-widest font-medium">
                Successful members
              </div>
            </div>
            <div>
              <div className="mb-1 text-xl font-bold text-white">2014</div>
              <div className="text-sm text-white/40 uppercase tracking-widest font-medium">
                Est. United Kingdom
              </div>
            </div>
            <div>
              <div className="mb-1 text-xl font-bold text-white">10+</div>
              <div className="text-sm text-white/40 uppercase tracking-widest font-medium">
                Years experience
              </div>
            </div>
            <div>
              <div className="mb-1 text-xl font-bold text-white">360°</div>
              <div className="text-sm text-white/40 uppercase tracking-widest font-medium">
                Full Circle Marketing
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
