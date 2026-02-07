"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  Quote,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";

const routes = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Blogs",
    icon: FileText,
    href: "/dashboard/blogs",
    color: "text-violet-500",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/dashboard/events",
    color: "text-pink-700",
  },
  {
    label: "Bookings",
    icon: Calendar,
    href: "/dashboard/bookings",
    color: "text-blue-500",
  },
  {
    label: "Contact Us",
    icon: MessageSquare,
    href: "/dashboard/contact",
    color: "text-orange-700",
  },
  // {
  //   label: "Testimonials",
  //   icon: Quote,
  //   href: "/dashboard/testimonials",
  //   color: "text-emerald-500",
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo_white.png"
              alt="MADE360"
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
        )}
        <Button
          onClick={() => setCollapsed(!collapsed)}
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-white"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <div className="flex-1 px-4 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-zinc-800 rounded-lg transition-colors",
              pathname === route.href
                ? "bg-zinc-800 text-white"
                : "text-zinc-400",
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {!collapsed && <span>{route.label}</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <Button
          onClick={() => signOut({ callbackUrl: "/login" })}
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
        >
          <LogOut className="h-5 w-5 mr-3" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
