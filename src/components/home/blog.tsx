"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/lib/blog-data";
import Link from "next/link";

const blogs = BLOG_POSTS.map((post, index) => ({
  id: index + 1,
  date: post.date,
  title: post.title,
  description: post.excerpt,
  image: post.image,
  slug: post.slug,
  highlight: index === 0,
}));

export default function Blog() {
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const slideRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };

  const onScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth } = scrollContainerRef.current;
      const index = Math.round(scrollLeft / (scrollWidth / blogs.length));
      setScrollIndex(index);
    }
  };

  return (
    <section className="bg-[#F8F9FA] py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium tracking-widest text-black/40 uppercase mb-4">
              <ArrowLeft className="h-4 w-4" />
              Latest Blogs
              <ArrowRight className="h-4 w-4" />
            </div>
            <h2 className="text-3xl md:text-7xl font-bold text-black tracking-tight">
              Master your <br />
              <span className="text-primary italic">performance.</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={slideLeft}
              className={`h-14 w-14 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all ${scrollIndex === 0 ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={slideRight}
              className={`h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg ${scrollIndex >= blogs.length - 1 ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}`}
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="relative group/carousel">
          <div
            ref={scrollContainerRef}
            onScroll={onScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12 transition-all scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollPaddingLeft: "24px",
              scrollPaddingRight: "24px",
            }}
          >
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className={`flex-none w-[300px] md:w-[320px] p-6 rounded-[32px] transition-all duration-500 snap-center first:ml-6 last:mr-6 group/card ${
                  blog.highlight
                    ? "bg-primary text-white shadow-2xl shadow-indigo-500/20"
                    : "bg-white text-black border border-black/5"
                }`}
              >
                <div className="flex justify-between items-start mb-8">
                  <span
                    className={`px-5 py-2 rounded-full text-xs font-bold border transition-colors ${
                      blog.highlight
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-black/5 border-black/10 text-black/60"
                    }`}
                  >
                    {blog.date}
                  </span>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center border transition-transform group-hover/card:scale-110 ${
                      blog.highlight
                        ? "bg-white text-primary border-white"
                        : "bg-white text-black border-black/10"
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-3 leading-[1.2] tracking-tight">
                    {blog.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed line-clamp-2 ${
                      blog.highlight ? "text-white/80" : "text-black/60"
                    }`}
                  >
                    {blog.description}
                  </p>
                </div>

                <div className="relative aspect-square rounded-[30px] overflow-hidden mt-auto">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  {blog.highlight && (
                    <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <MagneticButton>
            <Link href="/blog">
              <Button className="group rounded-full bg-primary h-12  p-1 text-base font-medium text-white transition-all hover:bg-primary/90">
                <span className="px-4">View More</span>
                <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-1">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Button>
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
