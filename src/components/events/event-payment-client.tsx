"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ChevronRight, TrendingUp } from "lucide-react";
import { IEvent } from "@/models/Event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { toast } from "sonner";

interface EventPaymentClientProps {
  event: IEvent;
  recentEvents: IEvent[];
}

export function EventPaymentClient({
  event,
  recentEvents,
}: EventPaymentClientProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const amount = event.price || 0;
  const paymentMethod = "card";

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
      phone_number: "",
    },
    customizations: {
      title: event.title,
      description: "Event Registration Payment",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-abstract-logo-design.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!name || !email) {
      toast.error("Please fill in your name and email");
      return;
    }

    if (amount <= 0) {
      toast.error("Please select or enter a valid amount");
      return;
    }

    if (paymentMethod === "card") {
      handleFlutterPayment({
        callback: async (response) => {
          console.log(response);
          if (response.status === "successful") {
            // Save registration to database
            try {
              const registrationResponse = await fetch("/api/registrations", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  eventId: event._id,
                  name,
                  email,
                  amount,
                  paymentMethod: "card",
                  transactionId: response.transaction_id,
                  paymentStatus: "completed",
                }),
              });

              if (registrationResponse.ok) {
                toast.success("Payment successful! Your seat is booked.");
              } else {
                toast.warning(
                  "Payment successful, but registration failed to save. Please contact support.",
                );
              }
            } catch (error) {
              console.error("Error saving registration:", error);
              toast.warning(
                "Payment successful, but registration failed to save. Please contact support.",
              );
            }
          } else {
            toast.error("Payment was not successful. Please try again.");
          }
          closePaymentModal();
        },
        onClose: () => {
          console.log("Payment modal closed");
        },
      });
    } else {
      toast.info("Offline payment instructions sent to your email (Demo)");
      // Provide bank details or similar instructions
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-none bg-white">
            <CardContent className="p-0 space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-zinc-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <Separator className="bg-zinc-100" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">
                    Secure Your Spot.
                  </h3>
                  <p className="text-zinc-500">
                    Your registration provides access to world-class leadership
                    insights and networking.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold text-zinc-900">
                    Personal Details:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-zinc-50 border-zinc-200 text-black"
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-zinc-50 border-zinc-200"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold text-zinc-900">
                    Registration Fee:
                  </Label>
                  <div className="relative">
                    <div className="flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                      <div className="flex h-10 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                        NGN
                      </div>
                      <span className="text-2xl font-bold text-zinc-900">
                        {amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-primary text-white font-bold h-14 text-lg rounded-lg shadow-lg"
                >
                  Confirm Registration & Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
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
    </div>
  );
}
