"use client";

import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  MapPin,
  DollarSign,
  ExternalLink,
  Users,
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
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { EventEditor } from "./event-editor";
import { deleteEvent } from "@/services/event";

interface EventListClientProps {
  initialEvents: any[];
}

export default function EventListClient({
  initialEvents,
}: EventListClientProps) {
  const [events, setEvents] = useState(initialEvents);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const result = await deleteEvent(id);
      if (result.success) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
      } else {
        alert(result.error);
      }
    }
  };

  const refreshEvents = async () => {
    // In a real app, we'd refetch from the server action here,
    // but for simplicity, we can let revalidatePath handle the next page load.
    // For immediate UI update, we provide this prop to EventEditor to close and potentially we could update local state.
    // Since we want the user to see the change immediately:
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-outfit">
            Events Management
          </h2>
          <p className="text-zinc-400 mt-2">
            Schedule and manage upcoming leadership events and workshops.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-white text-black hover:bg-zinc-200"
        >
          <Plus className="mr-2 h-4 w-4" /> Schedule Event
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Event Title</TableHead>
              <TableHead className="text-zinc-400">Location</TableHead>
              <TableHead className="text-zinc-400">Price</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-right text-zinc-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {events.map((event) => (
                <TableRow
                  key={event._id}
                  className="border-zinc-800 hover:bg-zinc-800/30 transition-colors group"
                >
                  <TableCell className="font-medium text-white group-hover:text-primary transition-colors">
                    {event.title}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-zinc-500" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.isPaid ? (
                      <span className="text-emerald-500 font-medium flex items-center gap-1">
                        <DollarSign size={12} />
                        {event.price}
                      </span>
                    ) : (
                      <span className="text-zinc-500">Free</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "upcoming" ? "default" : "secondary"
                      }
                      className={
                        event.status === "upcoming"
                          ? "bg-pink-500/10 text-pink-500 border-pink-500/20"
                          : event.status === "past"
                            ? "bg-zinc-800 text-zinc-500 border-zinc-700"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {format(new Date(event.date), "MMM d, yyyy")}
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
                          onClick={() => handleEdit(event)}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-zinc-800 cursor-pointer"
                          onClick={() =>
                            (window.location.href = `/dashboard/events/${event._id}/registrations`)
                          }
                        >
                          <Users className="mr-2 h-4 w-4" /> View Registrations
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                          onClick={() => handleDelete(event._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </AnimatePresence>
            {events.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-zinc-500"
                >
                  No events scheduled.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <EventEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        event={selectedEvent}
        onSuccess={refreshEvents}
      />
    </div>
  );
}
