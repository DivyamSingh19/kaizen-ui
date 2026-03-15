"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import { 
  PlusIcon, 
  ActivityIcon, 
  FolderIcon, 
  ZapIcon, 
  ClockIcon, 
  ArrowUpRightIcon,
  SearchIcon,
  ShieldCheckIcon,
  GlobeIcon,
  CpuIcon,
  HistoryIcon
} from "lucide-react"
import { getAllProjects } from "@/functions/api/projects"
import { ethers } from "ethers"
import { motion, AnimatePresence } from "framer-motion"

interface Project {
  id: string;
  title: string;
  status: string;
  monitoringStatus?: string;
  createdAt?: string;
}

interface NetworkStats {
  gasPrice: string;
  blockNumber: number;
  blockSpeed: string;
  status: "ONLINE" | "DELAYED" | "OFFLINE";
}

export default function DashboardOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    gasPrice: "0",
    blockNumber: 0,
    blockSpeed: "12s",
    status: "ONLINE"
  });
  
  const lastBlockTimeRef = useRef<number>(Date.now());

  const fetchNetworkStats = useCallback(async () => {
    try {
      // Use a more reliable public RPC
      const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth", undefined, {
        staticNetwork: true // Faster and avoids extra requests
      });
      
      const [feeData, blockNumber] = await Promise.all([
        provider.getFeeData(),
        provider.getBlockNumber()
      ]);

      const now = Date.now();
      const diff = Math.round((now - lastBlockTimeRef.current) / 1000);
      lastBlockTimeRef.current = now;

      setNetworkStats({
        gasPrice: feeData.gasPrice ? (Number(ethers.formatUnits(feeData.gasPrice, "gwei"))).toFixed(1) : "0",
        blockNumber: blockNumber,
        blockSpeed: `${Math.max(1, diff)}s`,
        status: "ONLINE"
      });
    } catch (err) {
      console.warn("Network telemetry sync failed (RPC Issue):", err);
      setNetworkStats(prev => ({ ...prev, status: "DELAYED" }));
    }
  }, []);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const data = await getAllProjects();
        const list = data?.projects ?? data;
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
    fetchNetworkStats();

    const interval = setInterval(fetchNetworkStats, 15000); // Pulse every 15s
    return () => clearInterval(interval);
  }, [fetchNetworkStats]);

  const stats = [
    { label: "Total Projects", value: projects.length, icon: <FolderIcon className="size-4" />, change: "+12%", trend: "up" },
    { label: "Network Block", value: networkStats.blockNumber.toLocaleString() || "Syncing...", icon: <GlobeIcon className="size-4" />, change: networkStats.blockSpeed, trend: "neutral" },
    { label: "Base Gas Fee", value: `${networkStats.gasPrice} Gwei`, icon: <ZapIcon className="size-4" />, change: "Live", trend: "up" },
    { label: "Uptime", value: "99.99%", icon: <ShieldCheckIcon className="size-4" />, change: "Elite", trend: "neutral" },
  ];

  return (
    <div className="text-zinc-100 font-mono w-full pb-10">
      {/* Live Ticker Marquee */}
      <div className="w-full bg-zinc-900/40 border-y border-white/[0.04] py-2 mb-8 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary" /> ETH_MAINNET: <span className="text-white">{networkStats.gasPrice} GWEI</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                <span className="size-1 rounded-full bg-purple-500" /> FINALITY: <span className="text-white">64 SLOTS</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                <span className="size-1 rounded-full bg-emerald-500" /> B_SPEED: <span className="text-white">{networkStats.blockSpeed}</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary" /> STATUS: <span className="text-primary font-black">STABLE</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-zinc-500 uppercase tracking-widest">v2.4.0_Stable</span>
            <span className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(170,255,0,0.5)]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary italic">All Systems Operational</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
            Command <span className="text-primary">Center.</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group min-w-[300px]">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-primary transition-colors duration-300" />
            <input 
              type="text" 
              placeholder="Query protocol registry..." 
              className="bg-zinc-900/50 border border-white/[0.06] rounded-xl py-4 pl-12 pr-6 text-xs font-bold uppercase tracking-tight focus:outline-none focus:border-primary/40 focus:bg-zinc-900 text-white placeholder:text-zinc-700 transition-all w-full"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-700 font-black border border-white/5 px-1.5 py-0.5 rounded leading-none">⌘ K</div>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-3 px-8 py-4 text-[11px] font-black tracking-[0.2em] uppercase transition-all rounded-xl shadow-2xl shadow-primary/5 border border-primary/20 text-primary hover:text-black bg-primary/5 hover:bg-primary"
          >
            <PlusIcon size={16} strokeWidth={4} />
            <span>New Build</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden bg-zinc-900/30 border border-white/[0.04] p-8 rounded-3xl hover:bg-zinc-900/60 hover:border-white/[0.1] transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 64, strokeWidth: 1 })}
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="size-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors border border-white/[0.02]">
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg ${stat.trend === "up" ? "bg-primary/10 text-primary border border-primary/20" : "bg-zinc-800 text-zinc-500 border border-white/5"}`}>
                {stat.change}
              </span>
            </div>
            
            <div className="flex flex-col relative z-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black mb-2 italic">0{i+1} // {stat.label}</span>
              <span className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</span>
            </div>
            
            {/* Animated background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Projects */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 leading-none">Active Protocols</h3>
              <p className="text-[9px] text-zinc-800 font-bold uppercase mt-2">Latest verified security signatures</p>
            </div>
            <Link href="/dashboard/projects" className="text-[10px] font-black text-zinc-600 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2 group">
              View All Registry <ArrowUpRightIcon size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-24 bg-zinc-900/30 border border-white/[0.04] rounded-3xl animate-pulse" />)
            ) : projects.length === 0 ? (
              <div className="h-60 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.02] rounded-[2.5rem] text-zinc-700 bg-zinc-900/10">
                <FolderIcon className="size-12 mb-4 opacity-5" />
                <p className="text-[11px] font-black uppercase tracking-[0.3em]">No deployment signatures found</p>
                <Link href="/dashboard/projects/new" className="text-[10px] text-primary mt-4 font-bold border-b border-primary/20 hover:border-primary transition-all pb-1 uppercase tracking-widest">Connect First Project</Link>
              </div>
            ) : (
              projects.slice(0, 4).map((project, i) => (
                <Link 
                  key={project.id}
                  href={`/dashboard/project/${project.id}`}
                  className="group relative flex items-center justify-between p-6 bg-zinc-900/30 border border-white/[0.04] rounded-[2rem] hover:bg-zinc-900/60 hover:border-primary/20 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="size-14 rounded-2xl bg-zinc-800/50 border border-white/[0.04] flex items-center justify-center text-zinc-600 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all duration-500">
                      <CpuIcon className="size-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white italic tracking-tight group-hover:text-primary transition-colors">{project.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] text-zinc-600 font-mono tracking-tighter uppercase font-black">ID: {project.id.substring(0, 8)}</p>
                        <span className="size-1 rounded-full bg-zinc-800" />
                        <p className="text-[10px] text-zinc-600 font-mono tracking-tighter uppercase font-black">SIG: 0x{project.id.substring(8, 14)}...</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="hidden sm:flex flex-col items-end mr-4">
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest mb-1">Status_Check</span>
                      <div className="flex items-center gap-2">
                         <div className="h-1 w-8 rounded-full bg-white/[0.04] overflow-hidden">
                           <div className="h-full bg-primary w-full shadow-[0_0_8px_rgba(170,255,0,0.5)]" />
                         </div>
                      </div>
                    </div>

                    {project.monitoringStatus === "ACTIVE" ? (
                      <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border border-primary/20 rounded-lg bg-primary/10 text-primary shadow-lg shadow-primary/5">
                        <ActivityIcon className="size-3 animate-pulse" />
                        SECURED
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border border-white/5 rounded-lg bg-zinc-800/50 text-zinc-600">
                         STANDBY
                      </span>
                    )}
                    
                    <div className="size-10 rounded-xl bg-white/[0.02] flex items-center justify-center group-hover:bg-primary transition-all">
                      <ArrowUpRightIcon className="size-4 text-zinc-700 group-hover:text-black" />
                    </div>
                  </div>
                  
                  {/* Subtle background number */}
                  <div className="absolute -left-4 -bottom-8 text-9xl font-black text-white/[0.01] pointer-events-none italic select-none">
                    0{i+1}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Access Console */}
        <div className="lg:col-span-4 space-y-6">
          <div className="px-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 leading-none">Quick_Access</h3>
            <p className="text-[9px] text-zinc-800 font-bold uppercase mt-2">Protocol management console</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {[
              { 
                title: "Monitoring Hub", 
                desc: "Live protocol metrics & logs", 
                href: "/dashboard/monitoring", 
                icon: <ActivityIcon className="size-5" />, 
                color: "group-hover:text-emerald-400",
                border: "group-hover:border-emerald-500/20",
                bg: "group-hover:bg-emerald-500/5"
              },
              { 
                title: "Timelock Portal", 
                desc: "Governance & lock controls", 
                href: "/dashboard/timelock", 
                icon: <ClockIcon className="size-5" />, 
                color: "group-hover:text-purple-400",
                border: "group-hover:border-purple-500/20",
                bg: "group-hover:bg-purple-500/5"
              },
              { 
                title: "Killswitch Hub", 
                desc: "Emergency shutdown protocols", 
                href: "/dashboard/killswitch", 
                icon: <ZapIcon className="size-5" />, 
                color: "group-hover:text-red-400",
                border: "group-hover:border-red-500/20",
                bg: "group-hover:bg-red-500/5"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
              >
                <Link 
                  href={item.href}
                  className={`group block p-6 bg-zinc-900/40 border border-white/[0.04] rounded-[2rem] transition-all duration-300 ${item.border} ${item.bg}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`size-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-600 transition-all duration-500 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white italic tracking-tight uppercase group-hover:text-white transition-colors">{item.title}</h4>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            <div className="pt-4 px-4">
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] relative overflow-hidden">
                <ShieldCheckIcon className="absolute -right-4 -bottom-4 size-24 text-primary opacity-5 -rotate-12" />
                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Protocol Status: Secure</h5>
                <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase">
                  All security modules are synchronized with the latest network state. No immediate intervention required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
