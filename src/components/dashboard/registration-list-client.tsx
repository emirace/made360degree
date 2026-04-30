"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ArrowLeft,
  Landmark,
  CreditCard,
  Search,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { updateRegistrationStatus } from "@/services/registration";

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  amount: number;
  paymentMethod: "card" | "manual_transfer";
  paymentStatus: "pending" | "completed" | "failed";
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
}

interface RegistrationListClientProps {
  registrations: Registration[];
  eventTitle: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: Clock,
  },
  completed: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle2,
  },
  failed: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
};

export default function RegistrationListClient({
  registrations: initialRegistrations,
  eventTitle,
}: RegistrationListClientProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [receiptModal, setReceiptModal] = useState<{
    open: boolean;
    url: string;
    name: string;
  }>({ open: false, url: "", name: "" });

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  const completedCount = registrations.filter(
    (r) => r.paymentStatus === "completed",
  ).length;
  const pendingCount = registrations.filter(
    (r) => r.paymentStatus === "pending",
  ).length;
  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === "completed")
    .reduce((sum, r) => sum + r.amount, 0);

  const handleUpdateStatus = async (
    id: string,
    status: "completed" | "failed",
  ) => {
    setLoadingId(id);
    try {
      const result = await updateRegistrationStatus(id, status);
      if (result.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r._id === id ? { ...r, paymentStatus: status } : r)),
        );
        toast.success(
          status === "completed"
            ? "Registration approved ✓"
            : "Registration rejected",
        );
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/events"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm mb-3 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
            Registrations
          </h2>
          <p className="text-zinc-400 mt-1 text-sm">{eventTitle}</p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg self-start mt-1">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-amber-400 text-sm font-medium">
              {pendingCount} pending review
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Registrant</TableHead>
              <TableHead className="text-zinc-400">Amount</TableHead>
              <TableHead className="text-zinc-400">Method</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Receipt</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-16 text-zinc-500"
                >
                  {search
                    ? "No registrations match your search."
                    : "No registrations yet for this event."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((reg) => {
                const status =
                  statusConfig[reg.paymentStatus as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                const isLoading = loadingId === reg._id;

                return (
                  <TableRow
                    key={reg._id}
                    className="border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Registrant */}
                    <TableCell>
                      <p className="font-medium text-white">{reg.name}</p>
                      <p className="text-xs text-zinc-500">{reg.email}</p>
                      {reg.phone && (
                        <p className="text-xs text-zinc-600">{reg.phone}</p>
                      )}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-emerald-400 font-semibold">
                      ₦{reg.amount.toLocaleString()}
                    </TableCell>

                    {/* Method */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        {reg.paymentMethod === "manual_transfer" ? (
                          <>
                            <Landmark className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-zinc-400">Manual</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-3.5 w-3.5 text-primary" />
                            <span className="text-zinc-400">Gateway</span>
                          </>
                        )}
                      </div>
                      {reg.transactionId && (
                        <p className="text-[10px] text-zinc-600 mt-0.5 font-mono truncate max-w-[110px]">
                          {reg.transactionId}
                        </p>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-zinc-500 text-xs">
                      {format(new Date(reg.createdAt), "MMM d, yyyy")}
                      <br />
                      <span className="text-zinc-600">
                        {format(new Date(reg.createdAt), "h:mm a")}
                      </span>
                    </TableCell>

                    {/* Receipt */}
                    <TableCell>
                      {reg.receiptUrl ? (
                        <button
                          onClick={() =>
                            setReceiptModal({
                              open: true,
                              url: reg.receiptUrl!,
                              name: reg.name,
                            })
                          }
                          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          View
                        </button>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      {reg.paymentMethod === "manual_transfer" &&
                      reg.paymentStatus === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={isLoading}
                            onClick={() =>
                              handleUpdateStatus(reg._id, "completed")
                            }
                            className="h-7 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            {isLoading ? "..." : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isLoading}
                            onClick={() =>
                              handleUpdateStatus(reg._id, "failed")
                            }
                            className="h-7 px-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : reg.transactionId ? (
                        <a
                          href="https://dashboard.flutterwave.com/dashboard/transactions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-end gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Verify
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-600">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Receipt Preview Modal */}
      <Dialog
        open={receiptModal.open}
        onOpenChange={(open) => setReceiptModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-lg bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Payment Receipt
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Submitted by {receiptModal.name}
            </DialogDescription>
          </DialogHeader>
          {receiptModal.url && (
            <div className="rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800">
              <Image
                src={receiptModal.url}
                alt="Payment receipt"
                width={500}
                height={600}
                className="w-full object-contain max-h-[60vh]"
              />
            </div>
          )}
          <a
            href={receiptModal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open full size
          </a>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
