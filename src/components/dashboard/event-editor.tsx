"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Upload,
  X,
  Calendar as CalendarIcon,
  MapPin,
  Link as LinkIcon,
  DollarSign,
} from "lucide-react";
import { IEvent } from "@/models/Event";
import { createEvent, updateEvent } from "@/services/event";
import { uploadImage } from "@/services/upload";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),
  status: z.enum(["upcoming", "past", "cancelled"]),
  isPaid: z.boolean(),
  price: z.string().min(0, "Price cannot be negative").optional(),
  image: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export interface PlainEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  status: "upcoming" | "past" | "cancelled";
  isPaid: boolean;
  price?: string;
}

interface EventEditorProps {
  isOpen: boolean;
  onClose: () => void;
  event: PlainEvent | null;
  onSuccess: () => void;
}

export function EventEditor({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventEditorProps) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      status: "upcoming",
      isPaid: false,
      price: "",
      image: "",
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description,
        date: event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : "",
        location: event.location,
        status: event.status,
        isPaid: event.isPaid || false,
        price: event.price ?? "",
        image: event.image || "",
      });
      setImagePreview(event.image || null);
    } else {
      form.reset({
        title: "",
        description: "",
        date: "",
        location: "",
        status: "upcoming",
        isPaid: false,
        price: "",
        image: "",
      });
      setImagePreview(null);
    }
  }, [event, form, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Convert to base64 for server action
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const result = await uploadImage(base64, "made360/events");
      if (result.success && result.url) {
        form.setValue("image", result.url);
        setImagePreview(result.url);
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit: SubmitHandler<EventFormValues> = async (values) => {
    setLoading(true);
    try {
      const eventData: Partial<IEvent> = {
        ...values,
        price: Number(values.price),
        date: new Date(values.date),
      };

      const result = event
        ? await updateEvent(event._id, eventData)
        : await createEvent(eventData);

      if (result.success) {
        toast.success(
          event ? "Event updated successfully" : "Event created successfully",
        );
        onSuccess();
        onClose();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        data-lenis-prevent
        className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-outfit">
            {event ? "Edit Event" : "Schedule New Event"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Fill in the details for your leadership event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Leadership DNA Summit"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description / Subtitle</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Short summary of the event..."
                        className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white",
                              !field.value && "text-zinc-500",
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-zinc-900 border-zinc-800"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? date.toISOString() : "")
                          }
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input
                          {...field}
                          placeholder="e.g. Lagos, Nigeria / Virtual"
                          className="bg-zinc-800 border-zinc-700 text-white pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg gap-4 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-bold">
                            Paid Event
                          </FormLabel>
                          <FormDescription className="text-zinc-500">
                            Is this a premium event requires payment?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("isPaid") && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <FormLabel>Ticket Price (₦)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 flex items-center justify-center text-zinc-500 font-bold">
                              ₦
                            </span>
                            <Input
                              {...field}
                              type="number"
                              className="bg-zinc-800 border-zinc-700 text-white pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <FormLabel>Event Image</FormLabel>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-700">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          form.setValue("image", "");
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-500 transition-all cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-zinc-500 mb-2" />
                            <p className="text-sm text-zinc-400">
                              Click to upload event image
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              SVG, PNG, JPG (max. 10MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-zinc-800">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || isUploading}
                className="bg-primary text-white hover:bg-primary/90 min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : event ? (
                  "Update Event"
                ) : (
                  "Create Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
