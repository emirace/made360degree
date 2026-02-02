"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function RevealImage({
  src,
  alt,
  className = "",
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );

  const scale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ clipPath, scale }} className="h-full w-full">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}
