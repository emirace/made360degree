"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { createBlog, updateBlog } from "@/services/blog";
import { uploadFile } from "@/services/client-upload";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  { ssr: false },
);

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  readTime: z.string().min(1, "Read time is required"),
  author: z.object({
    name: z.string().min(1, "Author name is required"),
    role: z.string().min(1, "Author role is required"),
    avatar: z.string().optional(),
  }),
  image: z.string().optional(),
  tags: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: any;
  onSuccess: () => void;
}

export function BlogEditor({
  isOpen,
  onClose,
  blog,
  onSuccess,
}: BlogEditorProps) {
  const quillRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingEditor, setIsUploadingEditor] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      readTime: "",
      author: {
        name: "Mr. Kevin Dada",
        role: "Principal Coach",
        avatar: "/images/visionary.jpeg",
      },
      image: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || "",
        readTime: blog.readTime || "",
        author: {
          name: blog.author?.name || "Mr. Kevin Dada",
          role: blog.author?.role || "Principal Coach",
          avatar: blog.author?.avatar || "/images/visionary.jpeg",
        },
        image: blog.image || "",
        tags: blog.tags?.join(", ") || "",
      });
      setImagePreview(blog.image || null);
    } else {
      form.reset({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        readTime: "",
        author: {
          name: "Mr. Kevin Dada",
          role: "Principal Coach",
          avatar: "/images/visionary.jpeg",
        },
        image: "",
        tags: "",
      });
      setImagePreview(null);
    }
  }, [blog, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB.");
      e.target.value = "";
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingCover(true);
    try {
      const result = await uploadFile(file);
      if (result.success && result.url) {
        form.setValue("image", result.url);
      } else {
        alert(result.error || "Upload failed");
        setImagePreview(blog?.image || null);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload");
      setImagePreview(blog?.image || null);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const onSubmit = async (values: BlogFormValues) => {
    setLoading(true);
    const formattedData = {
      ...values,
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
    };

    try {
      let result;
      if (blog?._id) {
        result = await updateBlog(blog._id, formattedData);
      } else {
        result = await createBlog(formattedData);
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB.");
        return;
      }

      setIsUploadingEditor(true);
      try {
        const result = await uploadFile(file);
        if (result.success && result.url) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", result.url);
        } else {
          alert(result.error || "Upload failed");
        }
      } catch (error) {
        console.error("Quill image upload error:", error);
      } finally {
        setIsUploadingEditor(false);
      }
    };
  }, []);

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[900px] bg-zinc-900 border-zinc-800 text-white max-h-[95vh] overflow-y-auto"
        data-lenis-prevent
      >
        <DialogHeader>
          <DialogTitle>
            {blog ? "Edit Blog Post" : "Create New Blog Post"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Fill in the details for your blog post below. Content supports HTML
            tags.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mastering Leadership..."
                        {...field}
                        className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leadership"
                        {...field}
                        className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="readTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="5 min read"
                        {...field}
                        className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leadership, Growth"
                        {...field}
                        className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt (Short summary)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of the blog post..."
                      className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Rich Text Editor)</FormLabel>
                  <FormControl>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden min-h-[300px] relative">
                      {isUploadingEditor && (
                        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                            <span className="text-xs font-medium text-white">
                              Uploading image to content...
                            </span>
                          </div>
                        </div>
                      )}
                      <ReactQuill
                        forwardedRef={quillRef}
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        modules={quillModules}
                        className="h-[250px] text-zinc-100"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 border-t border-zinc-800 pt-6">
              <h3 className="text-sm font-medium text-zinc-400">
                Author Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="author.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="author.role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Role</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-zinc-800 border-zinc-700 focus:ring-violet-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormLabel>Cover Image</FormLabel>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-6 hover:border-violet-500/50 transition-colors bg-zinc-800/50 relative overflow-hidden group">
                {imagePreview ? (
                  <div className="relative w-full aspect-video">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${isUploadingCover ? "opacity-50" : "opacity-100"}`}
                    />
                    {isUploadingCover && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                        <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-2" />
                        <p className="text-sm font-bold text-white uppercase tracking-widest drop-shadow-lg">
                          Uploading...
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    {isUploadingCover ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-3" />
                        <p className="text-sm font-medium text-zinc-300">
                          Uploading cover image...
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                        <p className="text-sm text-zinc-400">
                          Click to upload or drag and drop
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-zinc-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {blog ? "Update Blog" : "Create Blog"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
