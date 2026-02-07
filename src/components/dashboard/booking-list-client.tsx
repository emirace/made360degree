"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Mail,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateBookingStatus } from "@/services/booking";
import { toast } from "sonner";

interface Booking {
  _id: string;
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  preferredDate: string;
  sessionType: string;
  notes?: string;
  status: string;
  createdAt: string;
}

interface BookingListClientProps {
  bookings: Booking[];
}

const serviceNames: Record<string, string> = {
  "leadership-training": "Leadership Training",
  "strategic-planning": "Strategic Planning",
  "executive-coaching": "Executive Coaching",
  "organizational-development": "Organizational Development",
};

export default function BookingListClient({
  bookings: initialBookings,
}: BookingListClientProps) {
  const [bookings, setBookings] = useState(initialBookings);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <CheckCircle2 size={12} className="mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock size={12} className="mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusUpdate = async (
    id: string,
    status: "pending" | "confirmed" | "cancelled",
  ) => {
    const result = await updateBookingStatus(id, status);
    if (result.success) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b)),
      );
      toast.success(`Booking ${status}`);
    } else {
      toast.error(result.error || "Failed to update booking");
    }
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-zinc-400">Total Bookings</p>
          <p className="text-3xl font-bold text-white mt-2">
            {bookings.length}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-zinc-400">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-500 mt-2">
            {pendingCount}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-zinc-400">Confirmed</p>
          <p className="text-3xl font-bold text-emerald-500 mt-2">
            {confirmedCount}
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Client</TableHead>
              <TableHead className="text-zinc-400">Service</TableHead>
              <TableHead className="text-zinc-400">Preferred Date</TableHead>
              <TableHead className="text-zinc-400">Session Type</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Submitted</TableHead>
              <TableHead className="text-right text-zinc-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell
                  colSpan={7}
                  className="text-center text-zinc-500 py-8"
                >
                  No bookings yet.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  className="border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        {booking.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {booking.company || "Individual"}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`mailto:${booking.email}`}
                          className="text-xs text-zinc-400 hover:text-primary flex items-center gap-1"
                        >
                          <Mail size={12} />
                          {booking.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone size={12} className="text-zinc-500" />
                        <span className="text-xs text-zinc-400">
                          {booking.phone}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {serviceNames[booking.serviceType] || booking.serviceType}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {format(new Date(booking.preferredDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-zinc-700 text-zinc-400 capitalize"
                    >
                      {booking.sessionType}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-zinc-400">
                    {format(new Date(booking.createdAt), "MMM dd, yyyy")}
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
                        {booking.status !== "confirmed" && (
                          <DropdownMenuItem
                            className="hover:bg-zinc-800 cursor-pointer text-emerald-400"
                            onClick={() =>
                              handleStatusUpdate(booking._id, "confirmed")
                            }
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "cancelled" && (
                          <DropdownMenuItem
                            className="hover:bg-zinc-800 cursor-pointer text-red-400"
                            onClick={() =>
                              handleStatusUpdate(booking._id, "cancelled")
                            }
                          >
                            <XCircle className="mr-2 h-4 w-4" /> Cancel
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "pending" && (
                          <>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem
                              className="hover:bg-zinc-800 cursor-pointer"
                              onClick={() =>
                                handleStatusUpdate(booking._id, "pending")
                              }
                            >
                              <Clock className="mr-2 h-4 w-4" /> Mark as Pending
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
