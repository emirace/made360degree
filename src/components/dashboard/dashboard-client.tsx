"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  MessageSquare,
  Quote,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DashboardClientProps {
  stats: {
    title: string;
    value: string;
    icon: string; // Icon name as string
    description: string;
    color: string;
    bg: string;
  }[];
  recentActivity: {
    id: string;
    type: string;
    title: string;
    content: string;
    time: string;
  }[];
}

export default function DashboardClient({
  stats,
  recentActivity,
}: DashboardClientProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
          Dashboard Overview
        </h2>
        <p className="text-zinc-400 mt-2">
          Welcome back! Here&apos;s a summary of what&apos;s happening on your
          website.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent =
            stat.icon === "FileText"
              ? FileText
              : stat.icon === "Calendar"
                ? Calendar
                : stat.icon === "MessageSquare"
                  ? MessageSquare
                  : Quote;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-default">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                    <IconComponent size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center">
                    <TrendingUp size={12} className="mr-1 text-emerald-500" />
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-zinc-500">
              Latest updates across blogs, events, and communications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mr-4 border border-zinc-700">
                    {activity.type === "blog" && (
                      <FileText size={16} className="text-violet-500" />
                    )}
                    {activity.type === "message" && (
                      <MessageSquare size={16} className="text-orange-500" />
                    )}
                    {activity.type === "event" && (
                      <Calendar size={16} className="text-pink-500" />
                    )}
                    {activity.type === "testimonial" && (
                      <Quote size={16} className="text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {activity.content}
                    </p>
                  </div>
                  <div className="text-xs text-zinc-500">{activity.time}</div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="text-center text-zinc-500 py-4">
                  No recent activity.
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-6 text-zinc-400 hover:text-white hover:bg-zinc-800"
              asChild
            >
              {/* Could link to a notification center or just activity log if exists */}
              <span className="cursor-default">View Activity Log</span>
              {/* Changed to span as there is no specific activity page yet */}
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-zinc-900 border-zinc-800 overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-zinc-500">
              Common administrative tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-violet-600 hover:bg-violet-700 text-white border-none"
              asChild
            >
              <Link href="/dashboard/blogs/new">Create New Blog Post</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              asChild
            >
              <Link href="/dashboard/events">Schedule an Event</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              asChild
            >
              <Link href="/dashboard/testimonials">Approve Testimonials</Link>
            </Button>

            <div className="mt-8 pt-8 border-t border-zinc-800">
              <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
                <span>Website Health</span>
                <span>98%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98%]" />
              </div>
            </div>
          </CardContent>

          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
        </Card>
      </div>
    </div>
  );
}
