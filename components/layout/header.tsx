"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/components/ui/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "Company", href: "/company" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors h-[var(--header-height)]">
      <Container size="lg" className="h-full">
        <div className="flex h-full items-center justify-between gap-4">
          {/* Official Brand Logo */}
          <Link
            href="/"
            className="group flex items-center py-1 text-foreground hover:no-underline transition-opacity hover:opacity-90"
            aria-label="TechSphere Technology Home"
          >
            <Image
              src="/brand/logo-light.png"
              alt="TechSphere Technology"
              width={2400}
              height={2035}
              priority
              className="h-12 sm:h-14 lg:h-[4.25rem] w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                variant="nav"
                className="px-3 py-2 rounded-md hover:bg-card/70"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "hover:no-underline")}
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-[80px] sm:top-[88px] bottom-0 z-40 bg-background/98 backdrop-blur-lg border-t border-border flex flex-col justify-between p-6 md:hidden overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <nav className="flex flex-col gap-2 pt-2" aria-label="Mobile Navigation Links">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between py-3 px-4 rounded-lg text-lg font-medium text-foreground hover:bg-card active:bg-card transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-border flex flex-col gap-3">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full justify-center hover:no-underline"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              Schedule Consultation
            </Link>
            <p className="text-center font-mono text-xs text-muted-foreground pt-2">
              Building Technology That Moves Businesses Forward
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
