"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  Upload,
  X,
  Copy,
  CheckCircle2,
  Loader2,
  Landmark,
  CreditCard,
} from "lucide-react";
import { IEvent } from "@/models/Event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { toast } from "sonner";
import { uploadFile } from "@/services/client-upload";
import { useRouter } from "next/navigation";
import { normalizeRichTextHtml } from "@/lib/rich-text";

interface EventPaymentClientProps {
  event: IEvent;
  recentEvents: IEvent[];
}

function isCloudinaryImage(src?: string) {
  return src?.startsWith("https://res.cloudinary.com/") ?? false;
}

export function EventPaymentClient({
  event,
  recentEvents,
}: EventPaymentClientProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Manual transfer modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registrationFormRef = useRef<HTMLDivElement>(null);
  const paymentButtonRef = useRef<HTMLDivElement>(null);
  const [isRegistrationFormVisible, setIsRegistrationFormVisible] =
    useState(false);
  const [isPaymentButtonVisible, setIsPaymentButtonVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const amount = event.price || 0;
  const isManual = event.paymentMethod === "manual";
  const isPast =
    new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const eventImages = Array.from(
    new Set(
      [
        ...((event.images || []) as string[]),
        ...(event.image ? [event.image] : []),
      ].filter(Boolean),
    ),
  );

  // ── Flutterwave config (used only for gateway events) ──
  const config = {
    public_key:
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ||
      "FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx-X",
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: email,
      name: name,
      phone_number: phone,
    },
    customizations: {
      title: event.title,
      description: "Event Registration Payment",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-abstract-logo-design.jpg",
    },
  };

  const router = useRouter();

  const handleFlutterPayment = useFlutterwave(config);

  useEffect(() => {
    const registrationForm = registrationFormRef.current;
    const paymentButton = paymentButtonRef.current;

    if (!registrationForm || !paymentButton) return;

    const formObserver = new IntersectionObserver(
      ([entry]) => setIsRegistrationFormVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    const buttonObserver = new IntersectionObserver(
      ([entry]) => setIsPaymentButtonVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );

    formObserver.observe(registrationForm);
    buttonObserver.observe(paymentButton);

    return () => {
      formObserver.disconnect();
      buttonObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  // ── Validate shared fields ──
  const validateDetails = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in your name and email");
      return false;
    }
    return true;
  };

  // ── Gateway payment ──
  const handleGatewayPayment = () => {
    if (!validateDetails()) return;
    if (amount <= 0) {
      toast.error("Invalid event amount");
      return;
    }
    handleFlutterPayment({
      callback: async (response) => {
        if (response.status === "successful") {
          try {
            const res = await fetch("/api/registrations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                eventId: event._id,
                name,
                email,
                phone,
                amount,
                paymentMethod: "card",
                transactionId: response.transaction_id,
                paymentStatus: "completed",
              }),
            });
            if (res.ok) {
              toast.success("Payment successful! Your seat is booked.");
            } else {
              toast.warning(
                "Payment successful, but registration failed to save. Please contact support.",
              );
            }
          } catch {
            toast.warning(
              "Payment successful, but registration failed to save. Please contact support.",
            );
          }
        } else {
          toast.error("Payment was not successful. Please try again.");
        }
        closePaymentModal();
      },
      onClose: () => {},
    });
  };

  // ── Manual transfer: open modal ──
  const handleOpenManualModal = () => {
    if (!validateDetails()) return;
    setShowManualModal(true);
  };

  const handlePaymentAction = () => {
    if (!isRegistrationFormVisible) {
      registrationFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (isManual) {
      handleOpenManualModal();
    } else {
      handleGatewayPayment();
    }
  };

  // ── Receipt file selection ──
  const handleReceiptSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setReceiptFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setReceiptPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── Copy to clipboard ──
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // ── Submit manual transfer ──
  const handleManualSubmit = async () => {
    if (!receiptFile) {
      toast.error("Please upload your payment receipt");
      return;
    }
    setIsSubmitting(true);
    try {
      let receiptUrl = "";
      const uploadResult = await uploadFile(receiptFile, "made360/receipts");
      if (uploadResult.success && uploadResult.url) {
        receiptUrl = uploadResult.url;
      }

      if (!receiptUrl || !uploadResult.success) {
        toast.error(uploadResult.error || "Failed to upload receipt");
        return;
      }

      // Create registration as pending
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          name,
          email,
          phone,
          amount,
          paymentMethod: "manual_transfer",
          paymentStatus: "pending",
          receiptUrl,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-none bg-white p-2">
            <CardContent className="p-0 space-y-6">
              <div>
                <div
                  className="prose prose-lg prose-primary max-w-none w-full 
                    prose-headings:font-bold prose-headings:tracking-tight 
                    prose-p:text-black/70 prose-p:leading-relaxed
                    prose-blockquote:italic prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl
                    prose-img:rounded-[30px] prose-img:shadow-2xl prose-img:mx-auto prose-img:max-h-[400px] prose-img:w-full prose-img:object-cover"
                  dangerouslySetInnerHTML={{
                    __html: normalizeRichTextHtml(event.description),
                  }}
                />
              </div>
              {eventImages.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eventImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedImage(image)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedImage(image);
                        }
                      }}
                      className={
                        eventImages.length === 1
                          ? "relative aspect-video overflow-hidden rounded-lg bg-zinc-100 sm:col-span-2 cursor-zoom-in"
                          : "relative aspect-video overflow-hidden rounded-lg bg-zinc-100 cursor-zoom-in"
                      }
                    >
                      <Image
                        src={image}
                        alt={`${event.title} image ${index + 1}`}
                        fill
                        unoptimized={isCloudinaryImage(image)}
                        sizes={
                          eventImages.length === 1
                            ? "(min-width: 1024px) 66vw, 100vw"
                            : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        }
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <Separator className="bg-zinc-100 pt-5" />

              <div ref={registrationFormRef} className="space-y-6 scroll-mt-24">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    Secure Your Spot.
                  </h3>
                  <p className="text-zinc-500">
                    Your registration provides access to world-class leadership
                    insights and networking.
                  </p>
                </div>

                {/* Personal Details */}
                <div className="space-y-4">
                  <Label className="text-base font-bold text-zinc-900">
                    Personal Details:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isPast}
                      className="bg-zinc-50 border-zinc-200 text-black disabled:opacity-70"
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPast}
                      className="bg-zinc-50 border-zinc-200 text-black disabled:opacity-70"
                    />
                    <Input
                      placeholder="Phone Number (optional)"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isPast}
                      className="bg-zinc-50 border-zinc-200 text-black md:col-span-2 disabled:opacity-70"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-4">
                  <Label className="text-base font-bold text-zinc-900">
                    Registration Fee:
                  </Label>
                  <div className="relative">
                    <div className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                      <div className="flex h-10 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                        NGN
                      </div>
                      <span className="text-2xl font-bold text-zinc-900">
                        {amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment method indicator */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3">
                  {isManual ? (
                    <>
                      <Landmark className="h-4 w-4 text-amber-600" />
                      <span>
                        Payment via{" "}
                        <strong className="text-zinc-700">
                          Manual Bank Transfer
                        </strong>{" "}
                        — upload proof after transfer
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>
                        Payment via{" "}
                        <strong className="text-zinc-700">
                          Secure Payment Gateway
                        </strong>{" "}
                        — card, USSD, bank transfer
                      </span>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                {isPast ? (
                  <div className="space-y-4">
                    <Button
                      disabled
                      className="w-full bg-zinc-200 text-zinc-500 font-bold h-14 text-lg rounded-lg cursor-not-allowed"
                    >
                      Registration Closed
                    </Button>
                    <p className="text-center text-sm text-red-500 font-medium">
                      This event has already taken place. Registration is no
                      longer available.
                    </p>
                  </div>
                ) : (
                  <div ref={paymentButtonRef}>
                    <Button
                      onClick={handlePaymentAction}
                      className="w-full bg-primary text-white font-bold h-14 text-lg rounded-lg shadow-lg"
                    >
                      Confirm Registration & Pay
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <Card className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              More Opportunities
            </h3>
            <div className="space-y-6">
              {recentEvents
                ?.filter((e) => e._id !== event._id)
                .slice(0, 4)
                .map((item) => (
                  <Link
                    key={item._id.toString()}
                    href={`/events/${item._id}`}
                    className="group flex gap-4"
                  >
                    <div className="relative h-16 w-16 flex-none rounded-lg overflow-hidden bg-zinc-100">
                      <Image
                        src={item.image || "/images/audience-executive.png"}
                        alt={item.title}
                        fill
                        unoptimized={isCloudinaryImage(item.image)}
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.date), "MM/dd/yyyy")}
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              {recentEvents.length <= 1 && (
                <p className="text-zinc-500 text-sm">
                  No other upcoming events at the moment.
                </p>
              )}
            </div>
            <div className="mt-8">
              <Link href="/#events">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-zinc-600 hover:text-primary group"
                >
                  View All Events
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="bg-primary text-white rounded-2xl p-8 overflow-hidden relative group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-bold leading-tight">
                Need Group Training?
              </h3>
              <p className="text-white/80 text-sm">
                We offer corporate packages for organizations looking to
                transform their leadership culture.
              </p>
              <Link
                href="/contact"
                className="w-full bg-white text-primary font-bold hover:bg-zinc-100 transition-colors cursor-pointer p-4 py-2 rounded-lg"
              >
                Contact Advisory
              </Link>
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </Card>
        </div>
      </div>

      {!isPast && !isPaymentButtonVisible && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md">
          <div className="mx-auto max-w-7xl">
            <Button
              onClick={handlePaymentAction}
              className="h-14 w-full rounded-lg bg-primary text-base font-bold text-white shadow-lg hover:bg-primary/90"
            >
              Confirm Registration & Pay
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showManualModal} onOpenChange={setShowManualModal}>
        <DialogContent className="max-w-lg bg-white border-zinc-200 text-zinc-900 p-0">
          <div className="overflow-y-auto max-h-[88vh] p-6" data-lenis-prevent>
            {submitted ? (
              /* ── Success state ── */
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900">
                  Submission Received!
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                  Your payment proof has been submitted. Our team will review
                  and confirm your registration within 24 hours. Check your
                  email for updates.
                </p>
                <Button
                  onClick={() => {
                    setShowManualModal(false);
                    setSubmitted(false);
                    setReceiptFile(null);
                    setReceiptPreview(null);
                    router.push("/");
                  }}
                  className="mt-2 bg-primary text-white"
                >
                  Done
                </Button>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-amber-600" />
                    Bank Transfer Details
                  </DialogTitle>
                  <DialogDescription className="text-zinc-500">
                    Transfer the exact amount below to our account, then upload
                    your receipt for confirmation.
                  </DialogDescription>
                </DialogHeader>

                {/* Amount to pay */}
                <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-sm font-medium text-amber-700">
                    Amount to Transfer
                  </span>
                  <span className="text-2xl font-bold text-amber-900">
                    ₦{amount.toLocaleString()}
                  </span>
                </div>

                {/* Bank Details */}
                {event.bankDetails ? (
                  <div className="space-y-3">
                    {[
                      {
                        label: "Bank Name",
                        value: event.bankDetails.bankName,
                        key: "bank",
                      },
                      {
                        label: "Account Name",
                        value: event.bankDetails.accountName,
                        key: "accName",
                      },
                      {
                        label: "Account Number",
                        value: event.bankDetails.accountNumber,
                        key: "accNum",
                      },
                    ].map(({ label, value, key }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-lg"
                      >
                        <div>
                          <p className="text-xs text-zinc-500 mb-0.5">
                            {label}
                          </p>
                          <p className="font-bold text-zinc-900">{value}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(value, key)}
                          className="p-2 rounded-lg hover:bg-zinc-200 transition-colors text-zinc-500 hover:text-zinc-900"
                          title={`Copy ${label}`}
                        >
                          {copiedField === key ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-500 text-sm">
                    Bank details not configured. Please contact the organiser.
                  </div>
                )}

                <Separator className="bg-zinc-100" />

                {/* Receipt upload */}
                <div className="space-y-3 mt-4">
                  <Label className="text-sm font-semibold text-zinc-700">
                    Upload Payment Receipt *
                  </Label>
                  {receiptPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
                      <Image
                        src={receiptPreview}
                        alt="Receipt"
                        width={500}
                        height={300}
                        className="w-full h-48 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null);
                          setReceiptPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400 transition-all cursor-pointer">
                      <Upload className="h-8 w-8 text-zinc-400 mb-2" />
                      <p className="text-sm text-zinc-500 font-medium">
                        Click to upload receipt
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        PNG, JPG, PDF (max 5MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleReceiptSelect}
                      />
                    </label>
                  )}
                </div>

                {/* Registrant summary */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-600 space-y-1">
                  <p>
                    <span className="font-medium text-zinc-800">Name:</span>{" "}
                    {name}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-800">Email:</span>{" "}
                    {email}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-800">Event:</span>{" "}
                    {event.title}
                  </p>
                </div>

                <Button
                  onClick={handleManualSubmit}
                  disabled={isSubmitting || !receiptFile}
                  className="w-full h-12 bg-primary text-white font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Confirm — I Have Made Payment"
                  )}
                </Button>
                <p className="text-xs text-center text-zinc-400 mt-2">
                  Your registration will be confirmed after admin review.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded event image"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close image preview"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative h-full max-h-[90vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt={`${event.title} expanded image`}
              fill
              unoptimized={isCloudinaryImage(selectedImage)}
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
