"use client";

import { use } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { BLOG_POSTS } from "@/lib/blog-data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetail({ params }: PageProps) {
  const { slug } = use(params);
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative bg-black text-white min-h-screen">
      <Navbar />

      <section className="relative h-[60vh] md:h-[70vh] flex items-end bg-black overflow-hidden pb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="w-full h-full"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        <div className="container relative z-20 mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Link
              href="/blog"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>

            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-primary rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                {post.category}
              </span>
              <div className="h-px w-12 bg-white/20" />
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {post.readTime}
                </span>
              </div>
            </div>

            <h1 className="text-2xl md:text-6xl font-bold leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-widest">
                    {post.author.name}
                  </p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {post.author.role}
                  </p>
                </div>
              </div>

              <button className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Share2 className="h-5 w-5 text-white/60" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white text-black min-h-[50vh]">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg prose-primary max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight 
                    prose-p:text-black/70 prose-p:leading-relaxed
                    prose-blockquote:italic prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-20 pt-10 border-t border-black/5 flex items-center justify-between">
            <div className="flex gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-black/40">
                Share:
              </span>
              <div className="flex gap-3">
                {["Twitter", "LinkedIn", "Facebook"].map((platform) => (
                  <button
                    key={platform}
                    className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F8F9FA] text-black">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-12">Continue Reading</h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-4 px-10 py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-primary hover:scale-105 transition-all shadow-2xl"
          >
            View all insights
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return <ChevronRight className={className} />;
}
