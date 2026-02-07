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
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface Registration {
  _id: string;
  name: string;
  email: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  createdAt: string;
}

interface RegistrationListClientProps {
  registrations: Registration[];
  eventTitle: string;
}

export default function RegistrationListClient({
  registrations,
  eventTitle,
}: RegistrationListClientProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <CheckCircle2 size={12} className="mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock size={12} className="mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle size={12} className="mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const completedCount = registrations.filter(
    (r) => r.paymentStatus === "completed",
  ).length;
  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === "completed")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-zinc-400">Total Registrations</p>
          <p className="text-3xl font-bold text-white mt-2">
            {registrations.length}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-zinc-400">Confirmed Attendees</p>
          <p className="text-3xl font-bold text-emerald-500 mt-2">
            {completedCount}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <p className="text-sm text-zinc-400">Total Revenue</p>
          <p className="text-3xl font-bold text-white mt-2">
            ₦{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">Amount</TableHead>
              <TableHead className="text-zinc-400">Payment Method</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.length === 0 ? (
              <TableRow className="border-zinc-800">
                <TableCell
                  colSpan={6}
                  className="text-center text-zinc-500 py-8"
                >
                  No registrations yet for this event.
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((registration) => (
                <TableRow
                  key={registration._id}
                  className="border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                >
                  <TableCell className="font-medium text-white">
                    {registration.name}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {registration.email}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    ₦{registration.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-zinc-700 text-zinc-400"
                    >
                      {registration.paymentMethod === "card"
                        ? "Card"
                        : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(registration.paymentStatus)}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {format(new Date(registration.createdAt), "MMM dd, yyyy")}
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
