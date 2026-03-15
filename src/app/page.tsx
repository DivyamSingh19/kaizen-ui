"use client"

import React, { useEffect, useState } from 'react'
import Navbar from '@/components/core/navbar'
import SignInButton from '@/components/buttons/secondary'
import HowItWorks from '@/components/core/how-it-works'
import Footer from '@/components/core/footer'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheckIcon,
  ActivityIcon,
  ZapIcon,
  LockIcon,
  SearchIcon,
  CpuIcon,
  BellIcon,
  BarChart3Icon
} from 'lucide-react'

const FEATURES = [
  {
    title: "Autonomous Defense",
    desc: "Immediate intervention logic triggered by on-chain anomalies.",
    icon: <ZapIcon className="size-6" />,
    color: "text-primary"
  },
  {
    title: "Mempool Forensics",
    desc: "Sub-second transaction analysis before they hit the block.",
    icon: <SearchIcon className="size-6" />,
    color: "text-blue-400"
  },
  {
    title: "ML Threat Models",
    desc: "Neural networks trained on exploit patterns and flash loans.",
    icon: <CpuIcon className="size-6" />,
    color: "text-purple-400"
  },
  {
    title: "Timelock Governance",
    desc: "Secure delay mechanisms for critical protocol upgrades.",
    icon: <LockIcon className="size-6" />,
    color: "text-emerald-400"
  },
  {
    title: "Real-time Alerting",
    desc: "Instant synchronization with Discord and Slack webhooks.",
    icon: <BellIcon className="size-6" />,
    color: "text-amber-400"
  },
  {
    title: "Advanced Telemetry",
    desc: "Deep forensic data visualization for post-mortem analysis.",
    icon: <BarChart3Icon className="size-6" />,
    color: "text-rose-400"
  }
];

const LandingPage = () => {
  const [stats, setStats] = useState({
    blocks: 19482031,
    gas: 12,
    mempool: 423
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        blocks: prev.blocks + 1,
        gas: Math.floor(Math.random() * 5) + 10,
        mempool: prev.mempool + (Math.random() > 0.5 ? 1 : -1)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col font-mono text-zinc-100 overflow-x-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="p-4 relative z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex-col items-center justify-center pt-20 pb-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          System Status: Operational / Secure
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-[0.1em] text-white uppercase italic leading-none mb-8"
        >
          Kaizen <span className="text-zinc-800">Protocol</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-500 max-w-2xl mx-auto mb-12 text-sm md:text-base uppercase font-bold tracking-widest leading-relaxed"
        >
          Continuous Protection for Smart Contracts.
          From Real-time <span className="text-white">Telemetry</span> to Autonomous <span className="text-white">Intervention</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SignInButton href="/register" label="Initiate Protocol" />
        </motion.div>
      </main>

      {/* Security Marquee */}
      <div className="relative z-10 w-full bg-zinc-900/50 border-y border-white/5 py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-12">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 font-black uppercase">Block_Height:</span>
                <span className="text-[10px] text-primary font-black uppercase tracking-tighter">{stats.blocks.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 font-black uppercase">Network_Gas:</span>
                <span className="text-[10px] text-white font-black uppercase tracking-tighter">{stats.gas} GWEI</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 font-black uppercase">Mempool_Flux:</span>
                <span className="text-[10px] text-primary font-black uppercase tracking-tighter">{stats.mempool} PENDING</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 font-black uppercase">Registry_Status:</span>
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter">ALL_SYSTEMS_GO</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4 ml-1">Analytical_Modules</h2>
          <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-[2.5rem] bg-zinc-900/20 border border-white/[0.04] hover:bg-zinc-900/40 hover:border-white/10 transition-all duration-500"
            >
              <div className={`mb-6 ${f.color} opacity-40 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{f.title}</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed tracking-wide group-hover:text-zinc-400 transition-colors">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto bg-primary text-black rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-8 relative z-10">
            Secure Your <br /> Protocol Logic
          </h2>
          <p className="text-sm font-black uppercase tracking-[0.2em] mb-12 opacity-60 relative z-10">
            Join the registry and deploy autonomous defense today.
          </p>
          <div className="relative z-10">
            <SignInButton href="/register" label="Initiate Onboarding" />
          </div>
        </div>
      </section>

      <section id='footer'>
        <Footer />
      </section>
    </div>
  )
}

export default LandingPage
