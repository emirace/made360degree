"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { BLOG_POSTS, CATEGORIES } from "@/lib/blog-data";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogListing() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category === activeCategory);

  return (
    <main className="relative bg-black text-white min-h-screen">
      <Navbar />

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
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
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

      <section className="sticky top-[72px] md:top-[88px] z-40 bg-black/80 backdrop-blur-xl border-y border-white/5 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center flex-wrap gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${
                  activeCategory === category
                    ? "bg-primary border-primary text-white scale-105"
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white text-black min-h-[50vh]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block space-y-6"
                  >
                    <div className="relative aspect-video rounded-[30px] overflow-hidden shadow-2xl">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 px-2">
                      <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-black/40">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="text-black/60 line-clamp-2 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest pt-2 group-hover:gap-4 transition-all">
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 bg-black/5 rounded-[40px] border border-dashed border-black/10">
              <p className="text-black/40 font-medium">
                No posts found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
