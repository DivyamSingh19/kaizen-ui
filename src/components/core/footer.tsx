"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS: Record<string, { label: string; url: string }[]> = {
  Product: [
    { label: "How It Works", url: "#" },
    { label: "Features", url: "#" },
    { label: "Pricing", url: "#" },
    { label: "Changelog", url: "#" },
    { label: "Roadmap", url: "#" },
  ],
  Developers: [
    { label: "Documentation", url: "#" },
    { label: "API Reference", url: "#" },
    { label: "SDK", url: "#" },
    { label: "Github", url: "https://github.com/DivyamSingh19/anton-ui" },
    { label: "Status", url: "#" },
  ],
  Company: [
    { label: "About", url: "#" },
    { label: "Blog", url: "#" },
    { label: "Careers", url: "#" },
    { label: "Contact", url: "#" },
    { label: "Security", url: "#" },
  ],
};

const SOCIAL = [
  { icon: "X", url: "https://twitter.com" },
  { icon: "GH", url: "https://github.com/DivyamSingh19/anton-ui" },
  { icon: "DC", url: "#" },
  { icon: "DS", url: "#" },
] as const;

function CornerDot({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const pos: Record<string, string> = {
    tl: "-top-[3px] -left-[3px]",
    tr: "-top-[3px] -right-[3px]",
    bl: "-bottom-[3px] -left-[3px]",
    br: "-bottom-[3px] -right-[3px]",
  };
  return (
    <span
      className={`absolute w-[7px] h-[7px] bg-[#a3e635] ${pos[position]}`}
    />
  );
}

function NavLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target={url.startsWith("http") ? "_blank" : "_self"}
      rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group relative flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-[#555] hover:text-[#c4b5fd] transition-colors duration-200 mb-3"
    >
      <span className="text-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        ›
      </span>
      {label}
    </a>
  );
}

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative bg-black font-mono overflow-hidden"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
        }}
      />

      {/* Purple glow */}
      <div
        className="pointer-events-none absolute left-1/2 -top-32 -translate-x-1/2 w-[900px] h-[500px] z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.26) 0%, rgba(168,85,247,0.09) 40%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Top border with lime accent squares */}
        <div className="relative border-t border-[#2a2a2a]">
          <span className="absolute -top-[3px] -left-[1px] w-[7px] h-[7px] bg-[#a3e635]" />
          <span className="absolute -top-[3px] -right-[1px] w-[7px] h-[7px] bg-[#a3e635]" />
        </div>

        {/* Hero row */}
        <div
          className={`flex flex-col md:flex-row items-start justify-between gap-8 py-8 border-b border-[#1a1a1a]
            transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Wordmark */}
          <div className="text-[clamp(40px,8vw,80px)] font-bold tracking-[-0.03em] leading-[0.9] text-white select-none">
            KAI<span className="text-[#a855f7]">ZEN</span>
          </div>

          {/* Tagline + CTA */}
          <div className="flex flex-col items-start md:items-end gap-5 md:max-w-[340px]">
            <p className="text-[11px] tracking-[0.18em] text-[#555] uppercase leading-[1.9] md:text-right">
              Continuous protection
              <br />
              for smart contracts —<br />
              from monitoring
              <br />
              to autonomous defense.
            </p>

            {/* CTA button */}
            <a
              href="#"
              className="relative inline-flex items-center gap-2.5 border border-[#7c3aed] px-5 py-2.5
                text-[11px] tracking-[0.15em] uppercase text-[#a855f7]
                hover:bg-[#7c3aed]/10 hover:text-[#c084fc] transition-colors duration-300"
            >
              <CornerDot position="tl" />
              <CornerDot position="br" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                />
              </svg>
              Start Monitoring
            </a>
          </div>
        </div>

        {/* Columns */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-[#1a1a1a]
            transition-all duration-700 delay-150 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Brand column */}
          <div className="py-6 pr-0 lg:pr-10 border-b sm:border-b-0 sm:border-r border-[#1a1a1a] flex flex-col gap-4">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 border border-[#a3e635]/20 bg-[#a3e635]/5 px-3 py-1.5 w-fit">
              <span className="w-[5px] h-[5px] rounded-full bg-[#a3e635] animate-pulse" />
              <span className="text-[9px] tracking-[0.15em] uppercase text-[#a3e635]">
                All systems operational
              </span>
            </div>

            <p className="text-[11px] leading-[1.9] text-[#555]">
              Real-time smart contract security —
              <br />
              powered by machine learning
              <br />
              and on-chain intelligence.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 flex-wrap mt-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.icon}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : "_self"}
                  rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-center w-8 h-8 border border-[#222] text-[#555] text-[10px] tracking-[0.05em]
                    hover:border-[#7c3aed] hover:text-[#a855f7] transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(NAV_LINKS).map(([heading, links], i) => (
            <div
              key={heading}
              className={`py-6 lg:px-8 border-b sm:border-b-0 border-[#1a1a1a]
                ${i < Object.keys(NAV_LINKS).length - 1 ? "sm:border-r" : ""}`}
            >
              {/* Column label */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#a3e635]">
                  {heading}
                </span>
                <span className="h-px w-6 bg-[#a3e635]/30" />
              </div>

              {links.map((link) => (
                <NavLink key={link.label} label={link.label} url={link.url} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-5
            transition-all duration-700 delay-300 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <span className="text-[9px] tracking-[0.15em] uppercase text-[#333]">
            © 2025 Kaizen Security. All rights reserved.
          </span>

          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[9px] tracking-[0.12em] uppercase text-[#333] hover:text-[#a855f7] transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          <span className="text-[9px] tracking-[0.12em] uppercase text-[#2a2a2a]">
            v1.0.0 — Build 2025
          </span>
        </div>
      </div>
    </footer>
  );
}