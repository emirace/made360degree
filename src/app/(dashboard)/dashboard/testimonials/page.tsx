"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Trash2,
  CheckSquare,
  XCircle,
  Star,
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

const mockTestimonials = [
  {
    id: "1",
    name: "Robert Fox",
    role: "CEO at TechFlow",
    content: "The leadership training was transformative...",
    status: "Approved",
    rating: 5,
  },
  {
    id: "2",
    name: "Esther Howard",
    role: "Operations Manager",
    content: "Excellent workshop, highly recommend!",
    status: "Pending",
    rating: 4,
  },
  {
    id: "3",
    name: "Cody Fisher",
    role: "Director of HR",
    content: "Great insights into strategic planning.",
    status: "Approved",
    rating: 5,
  },
];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
            Testimonials
          </h2>
          <p className="text-zinc-400 mt-2">
            Manage and approve client testimonials for the website.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Client</TableHead>
              <TableHead className="text-zinc-400">Testimonial</TableHead>
              <TableHead className="text-zinc-400">Rating</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-right text-zinc-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((test) => (
              <TableRow
                key={test.id}
                className="border-zinc-800 hover:bg-zinc-800/30 transition-colors"
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{test.name}</span>
                    <span className="text-xs text-zinc-500">{test.role}</span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-300 max-w-xs truncate">
                  {test.content}
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <span className="ml-1 text-xs">{test.rating}/5</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      test.status === "Approved" ? "default" : "secondary"
                    }
                    className={
                      test.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }
                  >
                    {test.status}
                  </Badge>
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
                      {test.status === "Pending" ? (
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                          <CheckSquare className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
