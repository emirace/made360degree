import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { CATEGORIES } from "@/lib/blog-data";
import { getAllBlogs } from "@/services/blog";
import BlogListClient from "@/components/blog/blog-list-client";
import BlogHero from "@/components/blog/blog-hero";

export default async function BlogListing() {
  const blogs = await getAllBlogs();

  return (
    <main className="relative bg-black text-white min-h-screen">
      <Navbar />
      <BlogHero />
      <BlogListClient initialBlogs={blogs} categories={CATEGORIES} />
      <Footer />
    </main>
  );
}
