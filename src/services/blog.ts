"use server";

import dbConnect from "@/lib/dbConnect";
import Blog, { IBlog } from "@/models/Blog";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

function generateSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Append a short random string for uniqueness
  const random = Math.random().toString(36).substring(2, 7);
  return `${base}-${random}`;
}

export async function getAllBlogs() {
  await dbConnect();
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  await dbConnect();
  try {
    const blog = await Blog.findOne({ slug }).lean();
    return blog ? JSON.parse(JSON.stringify(blog)) : null;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}

export async function createBlog(data: Partial<IBlog>) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  await dbConnect();
  try {
    const blogData = {
      ...data,
      slug: data.slug || generateSlug(data.title || ""),
    };
    const blog = new Blog(blogData);
    await blog.save();
    revalidatePath("/dashboard/blogs");
    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { success: false, error: "Failed to create blog" };
  }
}

export async function updateBlog(id: string, data: Partial<IBlog>) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  await dbConnect();
  try {
    const blogData = {
      ...data,
    };

    const blog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
    if (!blog) return { success: false, error: "Blog not found" };
    revalidatePath("/dashboard/blogs");
    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error) {
    console.error("Error updating blog:", error);
    return { success: false, error: "Failed to update blog" };
  }
}

export async function deleteBlog(id: string) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  await dbConnect();
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return { success: false, error: "Blog not found" };
    revalidatePath("/dashboard/blogs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog:", error);
    return { success: false, error: "Failed to delete blog" };
  }
}

export async function toggleBlogStatus(id: string) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  await dbConnect();
  try {
    const blog = await Blog.findById(id);
    if (!blog) return { success: false, error: "Blog not found" };

    blog.isPublished = !blog.isPublished;
    if (blog.isPublished && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }

    await blog.save();
    revalidatePath("/dashboard/blogs");
    return { success: true, data: JSON.parse(JSON.stringify(blog)) };
  } catch (error) {
    console.error("Error toggling blog status:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}
