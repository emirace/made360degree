"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import FloatingLines from "@/components/FloatingLines";

const ContactHero = () => {
  return (
    <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-black overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black z-10" />
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={6}
          lineDistance={10}
          bendRadius={5}
          bendStrength={-0.3}
          interactive={true}
          parallax={true}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(124,93,250,0.1),transparent)]" />
      </div>

      <div className="container relative z-20 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
              Get in touch
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
            Let's Build Something{" "}
            <span className="text-primary italic">Great.</span>
          </h1>

          <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-medium pt-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Contact Us</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactHero;
