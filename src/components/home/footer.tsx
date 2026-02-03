"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  ArrowUp,
  ChevronRight,
  Send,
} from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com" },
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com" },
  ];

  const footerLinks = [
    {
      title: "About",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Leadership Team", href: "/about" },
        { name: "Methodology", href: "/#approach" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Executive Coaching", href: "/#journey" },
        { name: "Strategy Workshops", href: "/#journey" },
        { name: "Leadership Audits", href: "/#journey" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Insights", href: "/blog" },
        { name: "Case Studies", href: "/blog" },
        { name: "Free Toolkits", href: "/blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "Careers", href: "#" },
        { name: "Events", href: "#" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-white mt-24">
      {/* CTA Banner Section */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative h-[400px] md:h-[500px] rounded-[40px] overflow-hidden group -mt-40"
        >
          <Image
            src="/images/cta.jpg" // Placeholder cinematic asset
            alt="Personal Branding"
            fill
            className="object-cover md:object-top-right transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16">
            <h2 className="text-xl md:text-4xl  max-w-3xl leading-tight mb-8">
              Leadership responsibility demands more than intention.
              <span className="font-bold">
                {" "}
                Engage Made360Degrees to develop the clarity, capability, and
                discipline required to lead well.
              </span>
            </h2>

            <div className="flex">
              <Link href="/contact">
                <MagneticButton>
                  <Button className="group rounded-full bg-primary h-14 p-1 text-base font-medium text-white transition-all hover:bg-primary/80">
                    <span className="px-6">Engage Made360Degrees</span>
                    <div className="ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-1">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </Button>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
          {/* Logo & Socials */}
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="relative h-12 w-48 block">
              <Image
                src="/images/logo_white.png"
                alt="Made360Degrees"
                fill
                className="object-contain"
              />
            </Link>

            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all hover:scale-110"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Newsletter */}
          <div className="md:col-span-7">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
              <div className="max-w-xs">
                <h3 className="text-lg font-bold mb-2">
                  Join the inner circle
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Subscribe to receive exclusive leadership insights and digital
                  assets strategy.
                </p>
              </div>

              <div className="relative flex-1 md:max-w-md w-full">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full bg-black/50 border border-white/10 rounded-full h-14 px-6 focus:outline-none focus:border-primary transition-colors pr-16"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 transition-transform active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          {footerLinks.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-base font-bold">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link, lidx) => (
                  <li key={lidx}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 h-px bg-primary mr-0 group-hover:mr-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/10 pt-8">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Made360Degrees. All rights
            reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors pb-1"
          >
            <span>Back to top</span>
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
              <ArrowUp className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
