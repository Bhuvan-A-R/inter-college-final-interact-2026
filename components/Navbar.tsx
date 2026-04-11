"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import gatLogo from "@/public/gat-logos/GAT_Linear Logo.png";
// import gat25Logo from "@/public/gat-logos/GAT_Campaign Unit.png";
import interactLogo from "@/public/gat-logos/INTERACT2K26.png";
import LoginLogoutButton from "./LoginLogoutButton";

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "About",
    children: [
      { href: "/about/gat", label: "About GAT" },
      { href: "/about/fest", label: "About Fest" },
      { href: "/about/management", label: "Management Team" },
      { href: "/about/interact-team", label: "Interact Team" },
    ],
  },
  { href: "/events", label: "Events" },
  // { href: "/spoc-details", label: "SPOC's Details" },
  // { href: "/schedule", label: "Schedule" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoOnly, setLogoOnly] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onLogoOnly = (event: Event) => {
      const { detail } = event as CustomEvent<boolean>;
      setLogoOnly(Boolean(detail));
    };
    window.addEventListener("logo-only-navbar", onLogoOnly);
    return () => window.removeEventListener("logo-only-navbar", onLogoOnly);
  }, []);

  useEffect(() => {
    if (logoOnly) setMobileMenuOpen(false);
  }, [logoOnly]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? logoOnly
              ? "bg-transparent text-white border-transparent"
              : "bg-gat-midnight text-white border-gat-cobalt/30 shadow-navy"
            : logoOnly
              ? "bg-transparent text-white border-transparent"
              : "bg-white/95 backdrop-blur-sm text-gat-charcoal border-gat-blue/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 group flex items-center gap-2 sm:gap-3"
            >
              <Image
                src={gatLogo}
                alt="GAT Logo"
                width={160}
                height={90}
                className={`object-contain h-9 sm:h-10 md:h-12 w-auto transition-all duration-300 ${scrolled ? "opacity-90" : "opacity-100"}`}
                priority
              />
              {/* <Image
                src={gat25Logo}
                alt="GAT 25 Logo"
                width={160}
                height={90}
                className={`object-contain h-9 sm:h-10 md:h-12 w-auto transition-all duration-300 ${scrolled ? "opacity-90" : "opacity-100"}`}
                priority
              /> */}
              <Image
                src={interactLogo}
                alt="Interact Logo"
                width={160}
                height={90}
                className={`object-contain h-9 sm:h-10 md:h-12 w-auto transition-all duration-300 ${scrolled ? "opacity-90" : "opacity-100"}`}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            {!logoOnly && (
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => {
                  if (link.children) {
                    return (
                      <div key={link.label} className="relative group">
                        <button
                          type="button"
                          className={`font-body font-semibold transition-colors hover:text-gat-blue ${
                            scrolled ? "text-white/80" : "text-gat-charcoal"
                          }`}
                        >
                          {link.label}
                        </button>
                        <div className="absolute left-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                          <div className="min-w-[220px] rounded-xl border border-gat-blue/10 bg-white shadow-navy p-2">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-3 py-2 rounded-lg text-sm font-semibold text-gat-charcoal hover:bg-gat-blue/10 hover:text-gat-blue"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`font-body font-semibold transition-colors hover:text-gat-blue ${
                        scrolled ? "text-white/80" : "text-gat-charcoal"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Right Cluster */}
            {!logoOnly && (
              <div className="hidden md:flex flex-row items-center gap-4">
                {/* <button className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors ${
                scrolled ? "border-gat-steel/30 text-gat-steel hover:text-white" : "border-gat-steel/30 text-gat-steel hover:text-gat-charcoal bg-transparent"
              }`}>
                <Search className="w-4 h-4" />
                <span>Search events...</span>
                <kbd className="ml-2 px-1.5 py-0.5 text-[10px] uppercase border rounded bg-gat-steel/10 font-mono">⌘K</kbd>
              </button> */}
                <LoginLogoutButton />
              </div>
            )}

            {/* Mobile Nav Toggle */}
            {!logoOnly && (
              <button
                className={`md:hidden p-2 rounded focus:outline-none ${scrolled ? "text-white" : "text-gat-midnight"}`}
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {!logoOnly && isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-gat-midnight text-white border-t border-gat-cobalt/30"
            >
              <div className="px-4 pt-2 pb-6 space-y-4 shadow-xl flex flex-col">
                {navLinks.map((link) => {
                  if (link.children) {
                    return (
                      <div key={link.label} className="space-y-2">
                        <div className="px-3 text-xs font-bold uppercase tracking-wider text-white/60">
                          {link.label}
                        </div>
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-heading font-bold text-white hover:bg-gat-cobalt/30 uppercase tracking-wider"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-3 rounded-md text-base font-heading font-bold text-white hover:bg-gat-cobalt/30 uppercase tracking-wider"
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="pt-4 border-t border-gat-cobalt/30 flex flex-col gap-4">
                  <LoginLogoutButton variant="stacked" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom Nav Bar */}
      {!logoOnly && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gat-blue/10 flex items-center justify-around h-16 px-2 safe-area-pb shadow-[0_-4px_24px_rgba(35,98,236,0.05)]">
          <Link
            href="/"
            className="flex flex-col items-center justify-center w-full text-gat-blue p-2 rounded-lg bg-gat-blue/10"
          >
            <span className="text-xs font-bold mt-1">Home</span>
          </Link>
          <Link
            href="/events"
            className="flex flex-col items-center justify-center w-full text-gat-steel hover:text-gat-blue p-2 transition-colors"
          >
            <span className="text-xs mt-1">Events</span>
          </Link>
          {/* <Link href="/spoc-details" className="flex flex-col items-center justify-center w-full text-gat-steel hover:text-gat-blue p-2 transition-colors">
            <span className="text-xs mt-1">SPOCs Details</span>
          </Link> */}
        </nav>
      )}
    </>
  );
};

export default Navbar;
