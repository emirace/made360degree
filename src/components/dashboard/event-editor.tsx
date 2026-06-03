"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
  CreditCard,
  Landmark,
} from "lucide-react";
import { IEvent } from "@/models/Event";
import { createEvent, updateEvent } from "@/services/event";
import { uploadFile } from "@/services/client-upload";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { normalizeRichTextHtml } from "@/lib/rich-text";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),
  status: z.enum(["upcoming", "past", "cancelled"]),
  isPaid: z.boolean(),
  price: z.string().min(0, "Price cannot be negative").optional(),
  paymentMethod: z.enum(["gateway", "manual"]).optional(),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export interface PlainEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  images?: string[];
  status: "upcoming" | "past" | "cancelled";
  isPaid: boolean;
  price?: string;
  paymentMethod?: "gateway" | "manual";
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
      paymentMethod: "gateway",
      bankName: "",
      accountName: "",
      accountNumber: "",
      image: "",
      images: [],
    },
  });

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    [],
  );

  useEffect(() => {
    if (event) {
      const images =
        event.images && event.images.length > 0
          ? event.images
          : event.image
            ? [event.image]
            : [];

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
        paymentMethod: event.paymentMethod || "gateway",
        bankName: event.bankDetails?.bankName || "",
        accountName: event.bankDetails?.accountName || "",
        accountNumber: event.bankDetails?.accountNumber || "",
        image: images[0] || "",
        images,
      });
      setImagePreviews(images);
    } else {
      form.reset({
        title: "",
        description: "",
        date: "",
        location: "",
        status: "upcoming",
        isPaid: false,
        price: "",
        paymentMethod: "gateway",
        bankName: "",
        accountName: "",
        accountNumber: "",
        image: "",
        images: [],
      });
      setImagePreviews([]);
    }
  }, [event, form, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const oversizedFile = files.find((file) => file.size > 5 * 1024 * 1024);

    if (oversizedFile) {
      toast.error(`${oversizedFile.name} is too large. Max 5MB.`);
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const result = await uploadFile(file, "made360/events");

        if (result.success && result.url) {
          uploadedUrls.push(result.url);
        } else {
          toast.error(result.error || `Upload failed for ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        const nextImages = [...imagePreviews, ...uploadedUrls];
        form.setValue("images", nextImages, { shouldDirty: true });
        form.setValue("image", nextImages[0] || "", { shouldDirty: true });
        setImagePreviews(nextImages);
        toast.success(
          uploadedUrls.length === 1
            ? "Image uploaded"
            : `${uploadedUrls.length} images uploaded`,
        );
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const nextImages = imagePreviews.filter(
      (_, imageIndex) => imageIndex !== index,
    );
    setImagePreviews(nextImages);
    form.setValue("images", nextImages, { shouldDirty: true });
    form.setValue("image", nextImages[0] || "", { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<EventFormValues> = async (values) => {
    setLoading(true);
    try {
      const images = values.images || [];

      const eventData: Partial<IEvent> = {
        title: values.title,
        description: normalizeRichTextHtml(values.description),
        date: new Date(values.date),
        location: values.location,
        status: values.status,
        isPaid: values.isPaid,
        price: Number(values.price),
        image: images[0] || "",
        images,
        paymentMethod: values.isPaid ? (values.paymentMethod || "gateway") : "gateway",
        bankDetails:
          values.isPaid && values.paymentMethod === "manual"
            ? {
                bankName: values.bankName || "",
                accountName: values.accountName || "",
                accountNumber: values.accountNumber || "",
              }
            : undefined,
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

  const isPaid = form.watch("isPaid");
  const paymentMethod = form.watch("paymentMethod");

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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden min-h-[240px] [&_.ql-toolbar]:border-zinc-700 [&_.ql-toolbar]:bg-zinc-100 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[180px] [&_.ql-editor]:text-zinc-100 [&_.ql-editor.ql-blank::before]:text-zinc-500">
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          modules={quillModules}
                          placeholder="Short summary of the event..."
                          className="text-zinc-100"
                        />
                      </div>
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

              {/* ── Payment Section ── */}
              <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg space-y-5 md:col-span-2">
                {/* isPaid toggle */}
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
                          Is this a premium event that requires payment?
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

                {isPaid && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
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

                    {/* Payment Method */}
                    <div>
                      <FormLabel className="text-sm font-semibold text-zinc-300 mb-3 block">
                        Payment Method
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-3">
                                {/* Gateway option */}
                                <button
                                  type="button"
                                  onClick={() => field.onChange("gateway")}
                                  className={cn(
                                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                                    field.value === "gateway"
                                      ? "border-primary bg-primary/10 text-white"
                                      : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500",
                                  )}
                                >
                                  <CreditCard
                                    className={cn(
                                      "h-5 w-5 shrink-0",
                                      field.value === "gateway"
                                        ? "text-primary"
                                        : "text-zinc-500",
                                    )}
                                  />
                                  <div>
                                    <p className="font-semibold text-sm">
                                      Payment Gateway
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                      Card, USSD, bank transfer
                                    </p>
                                  </div>
                                </button>

                                {/* Manual option */}
                                <button
                                  type="button"
                                  onClick={() => field.onChange("manual")}
                                  className={cn(
                                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                                    field.value === "manual"
                                      ? "border-amber-500 bg-amber-500/10 text-white"
                                      : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500",
                                  )}
                                >
                                  <Landmark
                                    className={cn(
                                      "h-5 w-5 shrink-0",
                                      field.value === "manual"
                                        ? "text-amber-500"
                                        : "text-zinc-500",
                                    )}
                                  />
                                  <div>
                                    <p className="font-semibold text-sm">
                                      Manual Transfer
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                      Bank account details
                                    </p>
                                  </div>
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Bank Details – shown only when manual is selected */}
                    {paymentMethod === "manual" && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                        <p className="text-xs text-amber-400 font-medium uppercase tracking-wider">
                          Bank Account Details
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-zinc-300">
                                  Bank Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g. First Bank Nigeria"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accountName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-zinc-300">
                                  Account Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g. Made360 Leadership Ltd"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-zinc-300">
                                  Account Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g. 0123456789"
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <FormLabel>Event Images</FormLabel>
                  {imagePreviews.length > 0 && (
                    <span className="text-xs text-zinc-500">
                      First image is used as the cover
                    </span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {imagePreviews.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-700"
                    >
                      <Image
                        src={image}
                        alt={`Event image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove event image ${index + 1}`}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}

                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-500 transition-all cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-zinc-500 mb-2" />
                            <p className="text-sm text-zinc-400">
                              Click to upload event images
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                              SVG, PNG, JPG (max. 5MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
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
