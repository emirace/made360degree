"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Youtube,
  Send,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate api call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Message sent successfully!");
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: "info@made360degrees.com",
      subDetails: "Official inquiries and support",
      href: "mailto:info@made360degrees.com",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: "+234 70 879 7200",
      subDetails: "Mon-Fri from 9am to 6pm",
      href: "tel:+234708797200",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      details: "United Kingdom & Nigeria",
      subDetails:
        "7 LFS Maben Road, off northern foreshore estate, Chevron Drive, Lekki",
      href: "#",
    },
  ];

  return (
    <section className="py-24 bg-white text-black">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase"
              >
                <span>Social Connections</span>
                <div className="h-px w-10 bg-primary/30" />
              </motion.div>
              <h2 className="text-2xl md:text-5xl font-bold tracking-tight">
                Connect with our <br />
                <span className="text-primary italic">leadership network.</span>
              </h2>
              <p className="text-black/60 text-base leading-relaxed">
                Whether you're looking for corporate training or 1-on-1
                coaching, we're here to guide your transformation journey.
              </p>
            </div>

            <div className="space-y-8">
              {contactInfo.map((info, idx) => (
                <motion.a
                  key={idx}
                  href={info.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-6 group hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="h-14 w-14 rounded-2xl bg-[#F8F9FA] border border-black/5 flex items-center justify-center text-black group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{info.title}</h3>
                    <p className="text-black/80 font-medium text-sm">
                      {info.details}
                    </p>
                    <p className="text-[10px] text-black/40 mt-1 uppercase tracking-widest font-bold">
                      {info.subDetails}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="pt-8 border-t border-black/5 flex items-center gap-6">
              <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                Follow us:
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Linkedin className="h-5 w-5" />, href: "#" },
                  { icon: <Youtube className="h-5 w-5" />, href: "#" },
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    className="h-10 w-10 rounded-full border border-black/5 bg-[#F8F9FA] flex items-center justify-center text-black/60 hover:text-primary hover:border-primary transition-all duration-300"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F8F9FA] rounded-[48px] p-8 md:p-12 border border-black/5 shadow-2xl shadow-black/5"
            >
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-2">
                    First Name
                  </label>
                  <Input
                    placeholder="John"
                    className="h-14 rounded-2xl bg-white border-black/5 focus:border-primary/50 transition-all px-6"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-2">
                    Last Name
                  </label>
                  <Input
                    placeholder="Doe"
                    className="h-14 rounded-2xl bg-white border-black/5 focus:border-primary/50 transition-all px-6"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-14 rounded-2xl bg-white border-black/5 focus:border-primary/50 transition-all px-6"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-2">
                    Subject
                  </label>
                  <Input
                    placeholder="Inquiry about Leadership Coaching"
                    className="h-14 rounded-2xl bg-white border-black/5 focus:border-primary/50 transition-all px-6"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-black/40 px-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    className="min-h-[160px] rounded-[32px] bg-white border-black/5 focus:border-primary/50 transition-all p-6 resize-none"
                    required
                  />
                </div>
                <div className="md:col-span-2 pt-4">
                  <Button
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-full bg-black text-white text-lg font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-xl shadow-black/10 group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
