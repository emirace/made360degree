"use client";

import { motion } from "framer-motion";

export default function Noise() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-9999 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/feTurbulence%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    >
      <motion.div
        animate={{
          x: [0, -10, 10, -10, 0],
          y: [0, 10, -10, 10, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="h-full w-full"
      />
    </div>
  );
}
