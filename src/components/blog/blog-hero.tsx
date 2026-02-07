"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-black overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/80 to-black z-10" />
        <Image
          src="/images/leadership-collaboration.png"
          alt="Blog Hero"
          fill
          className="object-cover opacity-40 grayscale"
        />
      </div>

      <div className="container relative z-20 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
            The leadership journal
          </span>
          <h1 className="text-3xl md:text-7xl font-bold tracking-tight text-white">
            Insights for <span className="text-primary italic">Impact.</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-medium pt-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Blog</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
