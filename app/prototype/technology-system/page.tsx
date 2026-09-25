"use client";

import * as React from "react";
import { useState } from "react";
import { TechnologySystemScene } from "@/components/three/TechnologySystemScene";
import { TechnologySystemTheme } from "@/components/three/technology-system-types";
import { Container } from "@/components/ui/container";
import { Heading, Text, Eyebrow } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Sun, Moon, RotateCcw, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TechnologySystemPrototypePage() {
  const [theme, setTheme] = useState<TechnologySystemTheme>("light");
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const isDark = theme === "dark";

  return (
    <main
      className={cn(
        "min-h-screen py-10 sm:py-16 transition-colors duration-500",
        isDark ? "bg-[#35261A] text-[#FFF6ED]" : "bg-[#FFF6ED] text-[#111111]"
      )}
    >
      <Container size="lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-12 border-b pb-8 border-current/10">
          <div className="max-w-2xl">
            <Eyebrow intent={isDark ? "inverted" : "default"} className="mb-3">
              02 // Technology Solutions
            </Eyebrow>
            <Heading
              as="h1"
              size="h1"
              intent={isDark ? "inverted" : "default"}
              className="mb-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight uppercase"
            >
              Technology System 3D
            </Heading>
            <Text
              variant="lead"
              intent={isDark ? "invertedMuted" : "muted"}
              className="text-base sm:text-lg leading-relaxed font-light"
            >
              Connected 3D architectural model representing one unified system with
              eight capability nodes anchored along a continuous open spatial spline (01 → 08).
            </Text>
          </div>

          {/* Controls: Theme & Motion Toggles */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Rotation Play/Pause */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className={cn(
                "h-9 px-3.5 gap-2 font-mono text-xs uppercase tracking-wider",
                isDark
                  ? "bg-[#4A3725]/60 border-[#FFF6ED]/20 text-[#FFF6ED] hover:bg-[#4A3725]"
                  : "bg-white border-[#E3D2C0] text-[#4A3725] hover:bg-[#F6EDE3]"
              )}
            >
              {autoRotate ? (
                <>
                  <Pause className="size-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  <span>Rotate</span>
                </>
              )}
            </Button>

            {/* Theme Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "h-9 px-3.5 gap-2 font-mono text-xs uppercase tracking-wider",
                isDark
                  ? "bg-[#4A3725]/60 border-[#FFF6ED]/20 text-[#FFF6ED] hover:bg-[#4A3725]"
                  : "bg-white border-[#E3D2C0] text-[#4A3725] hover:bg-[#F6EDE3]"
              )}
            >
              {isDark ? (
                <>
                  <Sun className="size-3.5 text-[#B88E68]" />
                  <span>Light Canvas</span>
                </>
              ) : (
                <>
                  <Moon className="size-3.5 text-[#4A3725]" />
                  <span>Dark Canvas</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 3D Visual Stage */}
        <div
          className={cn(
            "relative w-full rounded-2xl border transition-all duration-500 overflow-hidden flex flex-col items-center justify-center h-[65vh] sm:h-[72vh] min-h-[500px]",
            isDark
              ? "bg-[#2A1D14] border-[#4A3725]/60 shadow-2xl"
              : "bg-[#FAF2EB] border-[#E3D2C0] shadow-sm"
          )}
        >
          {/* Subtle Stage Indicators */}
          <div className="absolute top-5 left-5 z-10 flex flex-wrap items-center gap-2 font-mono text-xs select-none">
            <span
              className={cn(
                "px-3 py-1.5 rounded-md border text-[11px] tracking-widest",
                isDark
                  ? "bg-[#35261A]/90 border-[#4A3725] text-[#FFF6ED]"
                  : "bg-white/90 border-[#E3D2C0] text-[#4A3725]"
              )}
            >
              TRAJECTORY: <strong>01 → 08 (OPEN SPLINE)</strong>
            </span>
          </div>

          {/* Node Active State Tester (Minimal Pill Row) */}
          <div className="absolute bottom-5 z-10 flex items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-xs select-none max-w-[95vw] overflow-x-auto">
            <button
              onClick={() => setActiveNode(null)}
              className={cn(
                "px-2.5 py-1 rounded-lg font-mono text-xs transition-colors",
                activeNode === null
                  ? isDark
                    ? "bg-[#FFF6ED] text-[#35261A] font-semibold"
                    : "bg-[#4A3725] text-[#FFF6ED] font-semibold"
                  : isDark
                  ? "text-[#FFF6ED]/60 hover:text-[#FFF6ED]"
                  : "text-[#4A3725]/70 hover:text-[#4A3725]"
              )}
            >
              All
            </button>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
              const label = String(idx + 1).padStart(2, "0");
              const isSelected = activeNode === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveNode(isSelected ? null : idx)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-mono text-xs transition-colors",
                    isSelected
                      ? isDark
                        ? "bg-[#B88E68] text-white font-semibold shadow-xs"
                        : "bg-[#4A3725] text-[#FFF6ED] font-semibold shadow-xs"
                      : isDark
                      ? "text-[#FFF6ED]/60 hover:text-[#FFF6ED]"
                      : "text-[#4A3725]/70 hover:text-[#4A3725]"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* 3D Canvas Visual */}
          <TechnologySystemScene
            theme={theme}
            activeNode={activeNode}
            autoRotate={autoRotate}
            interactive={true}
            className="size-full"
          />
        </div>
      </Container>
    </main>
  );
}
