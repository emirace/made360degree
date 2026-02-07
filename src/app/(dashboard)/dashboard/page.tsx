import { getAllBlogs } from "@/services/blog";
import { getUpcomingEvents, getAllEvents } from "@/services/event";
import { getAllContacts } from "@/services/contact";
import { getAllTestimonials } from "@/services/testimonial";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { FileText, Calendar, MessageSquare, Quote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  // Fetch all data
  const [blogs, events, contacts, testimonials] = await Promise.all([
    getAllBlogs(),
    getAllEvents(), // Using all events to get stats
    getAllContacts(),
    getAllTestimonials(),
  ]);

  // Calculate Stats
  const activeEvents = events.filter((e: any) => e.status === "upcoming");
  const unreadMessages = contacts.filter((c: any) => !c.isRead);
  const pendingTestimonials = testimonials.filter((t: any) => !t.isApproved);

  const stats = [
    {
      title: "Total Blogs",
      value: blogs.length.toString(),
      icon: "FileText",
      description: `${blogs.filter((b: any) => b.isPublished).length} published`,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      title: "Active Events",
      value: activeEvents.length.toString(),
      icon: "Calendar",
      description: `${events.length} total events`,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
    {
      title: "Messages",
      value: contacts.length.toString(),
      icon: "MessageSquare",
      description: `${unreadMessages.length} unread messages`,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Testimonials",
      value: testimonials.length.toString(),
      icon: "Quote",
      description: `${pendingTestimonials.length} pending approval`,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  // Process Recent Activity
  const blogActivity = blogs.map((b: any) => ({
    id: b._id,
    type: "blog",
    title: "New Blog Post",
    content: b.title,
    time: b.createdAt,
    originalTime: new Date(b.createdAt).getTime(),
  }));

  const messageActivity = contacts.map((c: any) => ({
    id: c._id,
    type: "message",
    title: `Inquiry from ${c.name}`,
    content: c.subject,
    time: c.createdAt,
    originalTime: new Date(c.createdAt).getTime(),
  }));

  const eventActivity = events.map((e: any) => ({
    id: e._id,
    type: "event",
    title: "Event Created",
    content: e.title,
    time: e.createdAt,
    originalTime: new Date(e.createdAt).getTime(),
  }));

  const testimonialActivity = testimonials.map((t: any) => ({
    id: t._id,
    type: "testimonial",
    title: "New Testimonial",
    content: `${t.name} submitted a review`,
    time: t.createdAt,
    originalTime: new Date(t.createdAt).getTime(),
  }));

  // Combine and sort
  const recentActivity = [
    ...blogActivity,
    ...messageActivity,
    ...eventActivity,
    ...testimonialActivity,
  ]
    .sort((a, b) => b.originalTime - a.originalTime)
    .slice(0, 5) // Get top 5
    .map((item) => ({
      ...item,
      time: formatDistanceToNow(new Date(item.time), { addSuffix: true }),
    }));

  return <DashboardClient stats={stats} recentActivity={recentActivity} />;
}
