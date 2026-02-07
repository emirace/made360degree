"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  image: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  createdAt: string;
}

interface BlogListClientProps {
  initialBlogs: BlogPost[];
  categories: string[];
}

export default function BlogListClient({
  initialBlogs,
  categories,
}: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? initialBlogs
      : initialBlogs.filter((post) => post.category === activeCategory);

  return (
    <>
      <section className="sticky top-[72px] md:top-[88px] z-40 bg-black/80 backdrop-blur-xl border-y border-white/5 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center flex-wrap gap-4">
            {categories.map((category) => (
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
                        src={post.image || "/images/placeholder.png"}
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
                          {new Date(
                            post.publishedAt || post.createdAt,
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
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
    </>
  );
}
