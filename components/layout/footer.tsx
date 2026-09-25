import * as React from "react";
import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";
import { Eyebrow, Text } from "@/components/ui/typography";

const SOLUTIONS = [
  { label: "Custom Software Solutions", href: "/services/custom-software-solutions" },
  { label: "AI & Automation", href: "/services/ai-automation" },
  { label: "Web & Application Development", href: "/services/web-application-development" },
  { label: "E-Commerce Solutions", href: "/services/ecommerce-solutions" },
  { label: "Cybersecurity Solutions", href: "/services/cybersecurity-solutions" },
  { label: "Cloud & IT Solutions", href: "/services/cloud-it-solutions" },
  { label: "Data & Business Intelligence", href: "/services/data-business-intelligence" },
  { label: "Technology Consulting", href: "/services/technology-consulting" },
];

const INDUSTRIES = [
  { label: "Real Estate", href: "/industries/real-estate" },
  { label: "E-Commerce", href: "/industries/ecommerce" },
  { label: "Manufacturing", href: "/industries/manufacturing" },
  { label: "Professional Services", href: "/industries/professional-services" },
  { label: "Startups & SMEs", href: "/industries/startups-smes" },
  { label: "Healthcare", href: "/industries/healthcare" },
];

const COMPANY = [
  { label: "About TechSphere", href: "/company" },
  { label: "Case Studies", href: "/work" },
  { label: "Insights & Articles", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-card/60 pt-16 pb-12 transition-colors">
      <Container size="lg">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Brand Column (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-sans font-semibold text-xl tracking-tight text-foreground hover:no-underline"
              aria-label="TechSphere Technology Home"
            >
              <span
                className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-mono text-xs font-bold shadow-xs"
                aria-hidden="true"
              >
                ::
              </span>
              <span className="flex flex-col">
                <span className="leading-tight text-foreground font-semibold">
                  TechSphere
                </span>
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase leading-none">
                  Technology
                </span>
              </span>
            </Link>

            <Text variant="small" intent="muted" className="leading-relaxed max-w-sm">
              Building technology that moves businesses forward. A technology
              solutions partner delivering practical, secure, and future-ready
              solutions across Web, Software, AI, Cloud, and Cybersecurity.
            </Text>

            <div className="mt-4 pt-4 border-t border-border/80">
              <Eyebrow intent="muted" dot={false} className="text-[11px] mb-1.5 block">
                Growth Trajectory
              </Eyebrow>
              <Text variant="mono" intent="muted" className="text-xs">
                India → UAE → USA → Global As Per Demand
              </Text>
            </div>
          </div>

          {/* Solutions Column (Col Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground select-none">
              Technology Solutions
            </h4>
            <ul className="flex flex-col gap-2 mt-1" role="list">
              {SOLUTIONS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} variant="footer">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries Column (Col Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground select-none">
              Industries
            </h4>
            <ul className="flex flex-col gap-2 mt-1" role="list">
              {INDUSTRIES.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} variant="footer">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Column (Col Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground select-none">
                Company
              </h4>
              <ul className="flex flex-col gap-2 mt-1" role="list">
                {COMPANY.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} variant="footer">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground select-none">
                Legal
              </h4>
              <ul className="flex flex-col gap-2 mt-1" role="list">
                {LEGAL.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} variant="footer">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Text variant="caption" intent="muted">
            © {currentYear} TechSphere Technology. All rights reserved.
          </Text>
          <Text variant="caption" intent="muted" className="font-mono text-[11px]">
            Connected Technology Systems
          </Text>
        </div>
      </Container>
    </footer>
  );
}
