import Navbar from "@/components/navbar";
import Footer from "@/components/home/footer";
import { getBlogBySlug } from "@/services/blog";
import { notFound } from "next/navigation";
import { BlogDetailClient } from "@/components/blog/blog-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative bg-black text-white min-h-screen">
      <Navbar />
      <BlogDetailClient post={post} />
      <Footer />
    </main>
  );
}
