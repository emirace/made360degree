"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  CalendarRange,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { deleteContact, markContactAsRead } from "@/services/contact";
import { format } from "date-fns";

interface ContactListClientProps {
  initialContacts: any[];
}

export default function ContactListClient({
  initialContacts,
}: ContactListClientProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewMessage = async (contact: any) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);

    if (!contact.isRead) {
      const result = await markContactAsRead(contact._id);
      if (result.success) {
        setContacts((prev) =>
          prev.map((c) => (c._id === contact._id ? { ...c, isRead: true } : c)),
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      const result = await deleteContact(id);
      if (result.success) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(result.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Visitor</TableHead>
              <TableHead className="text-zinc-400">Subject</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-right text-zinc-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {contacts.map((msg) => (
                <TableRow
                  key={msg._id}
                  className="border-zinc-800 hover:bg-zinc-800/30 transition-colors group"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white group-hover:text-primary transition-colors">
                        {msg.name}
                      </span>
                      <span className="text-xs text-zinc-500">{msg.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300 max-w-[200px] truncate">
                    {msg.subject}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={!msg.isRead ? "default" : "secondary"}
                      className={
                        !msg.isRead
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700"
                      }
                    >
                      {!msg.isRead ? (
                        <Clock size={12} className="mr-1.5" />
                      ) : (
                        <CheckCircle size={12} className="mr-1.5" />
                      )}
                      {!msg.isRead ? "New Submission" : "Read"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {format(new Date(msg.createdAt), "MMM d, yyyy")}
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
                          onClick={() => handleViewMessage(msg)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                          onClick={() => handleDelete(msg._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
            {contacts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-zinc-500"
                >
                  No contact submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[10px] font-bold">
                Inquiry Details
              </Badge>
              <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {selectedContact &&
                  format(
                    new Date(selectedContact.createdAt),
                    "MMMM d, yyyy 'at' p",
                  )}
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold font-outfit">
              {selectedContact?.subject}
            </DialogTitle>
            <DialogDescription className="text-zinc-400 pt-2 border-t border-zinc-800 mt-4">
              From:{" "}
              <span className="text-white font-medium">
                {selectedContact?.name}
              </span>{" "}
              ({selectedContact?.email})
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {selectedContact?.message}
            </p>
          </div>

          <DialogFooter className="mt-8">
            <Button
              className="bg-zinc-800 hover:bg-zinc-700 text-white"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close Inquiry
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                window.location.href = `mailto:${selectedContact?.email}?subject=Re: ${selectedContact?.subject}`;
              }}
            >
              <Mail className="w-4 h-4 mr-2" />
              Reply via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
