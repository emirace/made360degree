"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Linkedin, Youtube, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/#services" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-100 flex justify-center transition-all duration-300",
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-4 md:py-4",
      )}
    >
      <div className="flex w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-12 w-24 md:h-16 md:w-32">
            <Image
              src="/images/logo_white.png"
              alt="Made360Degrees Logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          <div className="flex items-center gap-8 rounded-full border border-white/10 bg-black/20 px-8 py-2 backdrop-blur-md">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white transition-all hover:text-primary hover:scale-110"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="rounded-full border border-white/10 p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-white/10 p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
            <Link href="/book">
              <Button className="rounded-full bg-white px-6 font-bold text-black transition-all hover:scale-105 hover:bg-white/90">
                Engage Made360Degrees
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/book">
            <Button
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black md:px-6"
              size="sm"
            >
              Engage
            </Button>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full border border-white/10 bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[88px] mx-4 overflow-hidden rounded-3xl border border-white/10 bg-black/90 p-6 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-white transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px w-full bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="rounded-full border border-white/10 p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#"
                    className="rounded-full border border-white/10 p-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <Youtube className="h-5 w-5" />
                  </Link>
                </div>
                <Button className="rounded-full bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20">
                  Book Call
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
