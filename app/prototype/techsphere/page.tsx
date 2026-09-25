"use client";

import * as React from "react";
import { useState } from "react";
import { TechSphereScene } from "@/components/three/TechSphereScene";
import { TechSphereState, TechSphereTheme } from "@/components/three/types";
import { Container } from "@/components/ui/container";
import { Heading, Text, Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATES: { id: TechSphereState; label: string; description: string }[] = [
  {
    id: "sphere",
    label: "Sphere",
    description: "Primary branded state matching the TechSphere logo mark.",
  },
  {
    id: "particles",
    label: "Particles",
    description: "Controlled outward dispersion along normal flow lines.",
  },
  {
    id: "connections",
    label: "Connections",
    description: "Sparse architectural lines representing connected technology.",
  },
  {
    id: "system",
    label: "System",
    description: "Concentric streamline organization representing scalable infrastructure.",
  },
];

export default function TechSpherePrototypePage() {
  const [activeState, setActiveState] = useState<TechSphereState>("sphere");
  const [activeTheme, setActiveTheme] = useState<TechSphereTheme>("light");
  const [interactive, setInteractive] = useState(true);

  const isDark = activeTheme === "dark";

  return (
    <main
      className={cn(
        "min-h-screen py-10 sm:py-16 transition-colors duration-300",
        isDark ? "bg-[#35261A] text-[#F6EDE3]" : "bg-[#FFF6ED] text-[#111111]"
      )}
    >
      <Container size="lg">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12 max-w-3xl">
          <Eyebrow intent={isDark ? "inverted" : "default"} className="mb-3">
            Prototype Evaluation
          </Eyebrow>
          <Heading
            as="h1"
            size="h1"
            intent={isDark ? "inverted" : "default"}
            className="mb-3"
          >
            TechSphere 3D Prototype
          </Heading>
          <Text
            variant="lead"
            intent={isDark ? "invertedMuted" : "muted"}
            className="text-base sm:text-lg"
          >
            Interactive 3D interpretation of the TechSphere dotted sphere mark.
            Preserves the distinctive halftone crescent, dot-size progression, and
            asymmetric silhouette of the official brand identity.
          </Text>
        </div>

        {/* 3D Visual Preview Stage */}
        <div
          className={cn(
            "relative w-full rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col items-center justify-center min-h-[480px] sm:min-h-[580px] lg:min-h-[640px]",
            isDark
              ? "bg-[#35261A] border-[#4A3725]/50 shadow-lg"
              : "bg-[#FFF6ED] border-[#E3D2C0] shadow-xs"
          )}
        >
          {/* Subtle Stage Indicators */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span
              className={cn(
                "px-2.5 py-1 rounded-md border",
                isDark
                  ? "bg-[#35261A]/80 border-[#4A3725] text-[#F6EDE3]"
                  : "bg-white/80 border-[#E3D2C0] text-[#4A3725]"
              )}
            >
              STATE: <strong className="uppercase">{activeState}</strong>
            </span>
            <span
              className={cn(
                "px-2.5 py-1 rounded-md border hidden sm:inline-block",
                isDark
                  ? "bg-[#35261A]/80 border-[#4A3725] text-[#F6EDE3]/80"
                  : "bg-white/80 border-[#E3D2C0] text-[#6A5644]"
              )}
            >
              CANVAS: WEBGL (ADAPTIVE) / 2D (FALLBACK)
            </span>
          </div>

          {/* The TechSphere 3D Object */}
          <TechSphereScene
            state={activeState}
            theme={activeTheme}
            interactive={interactive}
            className="h-[480px] sm:h-[580px] lg:h-[640px] w-full"
          />
        </div>

        {/* Interactive Controls Panel */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* State Controls (Col Span 8) */}
          <div
            className={cn(
              "lg:col-span-8 p-6 sm:p-8 rounded-xl border transition-colors",
              isDark
                ? "bg-[#2A1F16] border-[#4A3725]/40"
                : "bg-[#F6EDE3] border-[#E3D2C0]"
            )}
          >
            <div className="mb-4">
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider mb-1">
                Transformation States
              </h3>
              <p
                className={cn(
                  "text-xs leading-normal",
                  isDark ? "text-[#F6EDE3]/70" : "text-[#6A5644]"
                )}
              >
                Select a state to evaluate smooth coordinate interpolation on all devices.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {STATES.map((s) => {
                const isActive = activeState === s.id;
                return (
                  <Button
                    key={s.id}
                    variant={
                      isActive
                        ? isDark
                          ? "inverted"
                          : "default"
                        : "outline"
                    }
                    size="sm"
                    className={cn(
                      "w-full uppercase font-mono text-xs tracking-wider min-h-[44px]",
                      !isActive &&
                        (isDark
                          ? "border-[#4A3725] text-[#F6EDE3] hover:bg-[#35261A]"
                          : "border-[#E3D2C0] text-[#111111] hover:bg-white")
                    )}
                    onClick={() => setActiveState(s.id)}
                  >
                    {s.label}
                  </Button>
                );
              })}
            </div>

            <p
              className={cn(
                "mt-4 font-mono text-xs pt-3 border-t",
                isDark
                  ? "border-[#4A3725]/50 text-[#F6EDE3]/70"
                  : "border-[#E3D2C0] text-[#6A5644]"
              )}
            >
              {STATES.find((s) => s.id === activeState)?.description}
            </p>
          </div>

          {/* Environment & Background Controls (Col Span 4) */}
          <div
            className={cn(
              "lg:col-span-4 p-6 sm:p-8 rounded-xl border transition-colors flex flex-col gap-4",
              isDark
                ? "bg-[#2A1F16] border-[#4A3725]/40"
                : "bg-[#F6EDE3] border-[#E3D2C0]"
            )}
          >
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider mb-1">
                Background Evaluation
              </h3>
              <p
                className={cn(
                  "text-xs leading-normal",
                  isDark ? "text-[#F6EDE3]/70" : "text-[#6A5644]"
                )}
              >
                Test contrast across both core brand palettes.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={activeTheme === "light" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-1 font-mono text-xs min-h-[44px]",
                  activeTheme !== "light" &&
                    (isDark
                      ? "border-[#4A3725] text-[#F6EDE3] hover:bg-[#35261A]"
                      : "border-[#E3D2C0] text-[#111111] hover:bg-white")
                )}
                onClick={() => setActiveTheme("light")}
              >
                Warm Cream
              </Button>
              <Button
                variant={activeTheme === "dark" ? "inverted" : "outline"}
                size="sm"
                className={cn(
                  "flex-1 font-mono text-xs min-h-[44px]",
                  activeTheme !== "dark" &&
                    (isDark
                      ? "border-[#4A3725] text-[#F6EDE3] hover:bg-[#35261A]"
                      : "border-[#E3D2C0] text-[#111111] hover:bg-white")
                )}
                onClick={() => setActiveTheme("dark")}
              >
                Deep Brown
              </Button>
            </div>


            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                Pointer Parallax
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-xs h-8 px-2.5"
                onClick={() => setInteractive(!interactive)}
              >
                {interactive ? "ENABLED" : "DISABLED"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
