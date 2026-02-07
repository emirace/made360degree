"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BlogEditor } from "@/components/dashboard/blog-editor";
import { getAllBlogs, deleteBlog, toggleBlogStatus } from "@/services/blog";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleCreate = () => {
    setEditingBlog(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        fetchBlogs();
      } catch (error) {
        console.error("Failed to delete blog:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleBlogStatus(id);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
            Blogs Management
          </h2>
          <p className="text-zinc-400 mt-2">
            Create, edit, and manage your website&apos;s blog posts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchBlogs}
            className="border-zinc-800 text-zinc-400 hover:text-white"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-white text-black hover:bg-zinc-200"
          >
            <Plus className="mr-2 h-4 w-4" /> New Blog Post
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Title</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Author</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-right text-zinc-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-zinc-500"
                >
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading blogs...
                </TableCell>
              </TableRow>
            ) : blogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-zinc-500"
                >
                  No blogs found. Create your first post!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow
                  key={blog._id}
                  className="border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                >
                  <TableCell className="font-medium text-white max-w-xs truncate">
                    {blog.title}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {blog.category || "N/A"}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {blog.author?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={blog.isPublished ? "default" : "secondary"}
                      className={
                        blog.isPublished
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }
                      onClick={() => handleToggleStatus(blog._id)}
                      style={{ cursor: "pointer" }}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-900 border-zinc-800 text-zinc-300"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="hover:bg-zinc-800 cursor-pointer"
                          onClick={() =>
                            window.open(`/blog/${blog.slug}`, "_blank")
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Post
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-zinc-800 cursor-pointer"
                          onClick={() => handleEdit(blog)}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit Post
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                          onClick={() => handleDelete(blog._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BlogEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        blog={editingBlog}
        onSuccess={fetchBlogs}
      />
    </motion.div>
  );
}

// Add Loader2 import since it's used in the loading state
import { Loader2 } from "lucide-react";
