"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "SECURITY", href: "#security" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "FEATURES", href: "#features" },
  { label: "DASHBOARD", href: "/dashboard" },
];

export default function KaizenNavbar() {
  const [active, setActive] = useState("DASHBOARD");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const ctaButton = user
    ? { label: "DASHBOARD", href: "/dashboard" }
    : { label: "SIGN IN", href: "/register" };

  return (
    <nav className="w-full bg-[#0d0d0d] border-b border-white/5 px-6 py-3 flex items-center justify-between rounded-full max-w-6xl mx-auto mt-4 shadow-lg shadow-black/40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 group">
        <Image
          src="/Kaizen-Logo.png"
          alt="Kaizen Logo"
          width={20}
          height={20}
          className="object-contain"
        />
        <span className="text-white font-extrabold tracking-widest text-sm">
          Kaizen
        </span>
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex items-center gap-1">
        {navLinks.map(({ label, href }) => {
          const isActive = active === label;
          return (
            <li key={label} className="relative">
              <Link
                href={href}
                onClick={() => setActive(label)}
                className={`relative px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors duration-200
                  ${isActive ? "text-white" : "text-white/40 hover:text-white/80"}`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#aaff00] rounded-full" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* CTA Button */}
      <Link
        href={ctaButton.href}
        className="hidden md:inline-flex items-center px-5 py-2 bg-[#aaff00] text-black text-xs font-extrabold tracking-widest uppercase rounded-full hover:bg-[#c8ff40] active:scale-95 transition-all duration-150"
      >
        {ctaButton.label}
      </Link>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
        <span className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#111] border border-white/10 rounded-2xl p-4 flex flex-col gap-2 z-50 shadow-2xl md:hidden">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => { setActive(label); setMenuOpen(false); }}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors
                ${active === label ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href={ctaButton.href}
            className="mt-2 text-center px-5 py-2 bg-[#aaff00] text-black text-xs font-extrabold tracking-widest uppercase rounded-full hover:bg-[#c8ff40] transition-colors"
          >
            {ctaButton.label}
          </Link>
        </div>
      )}
    </nav>
  );
}