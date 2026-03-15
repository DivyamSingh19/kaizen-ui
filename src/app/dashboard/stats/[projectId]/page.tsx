"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeftIcon,
  RefreshCwIcon,
  Loader2Icon,
  BarChart3Icon,
  ActivityIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ZapIcon,
  CoinsIcon
} from "lucide-react"
import { getProjectById } from "@/functions/api/projects"
import { getTimeSeries } from "@/functions/api/monitoring"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from "recharts"
import { motion } from "framer-motion"
import { toast } from "sonner"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] text-zinc-500 font-black uppercase mb-2 tracking-widest">{new Date(label).toLocaleTimeString()}</p>
        <div className="space-y-1">
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">{entry.name}:</span>
              <span className="text-xs font-black italic text-white">{entry.value.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function StatsDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const proj = await getProjectById(projectId);
      setProject(proj);

      if (proj?.contractAddress) {
        const tsData = await getTimeSeries(proj.contractAddress);
        // Format for Recharts
        const formatted = tsData.map((d: any) => ({
          ...d,
          time: new Date(d._time).getTime()
        })).sort((a: any, b: any) => a.time - b.time);
        setData(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch telemetry", err);
      toast.error("Telemetry sync failed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [projectId, fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2Icon className="size-8 text-primary animate-spin" />
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 italic">Decoding telemetry stream...</p>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="text-zinc-100 font-mono w-full pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <Link href="/dashboard/stats" className="hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeftIcon size={12} /> Hub
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="text-primary italic">Telemetry_{project.id.substring(0, 4)}</span>
        </div>
        <button 
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-white/5 bg-zinc-900/40 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <RefreshCwIcon size={12} className={refreshing ? "animate-spin text-primary" : ""} />
          {refreshing ? "Refreshing..." : "Sync Stream"}
        </button>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
          {project.title}
        </h1>
        <div className="flex items-center gap-4">
          <p className="text-[10px] text-zinc-500 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg select-all">
            {project.contractAddress}
          </p>
          <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.2em] px-2.5 py-1 rounded-md bg-primary/5 border border-primary/10">
            <ActivityIcon size={10} className="animate-pulse" />
            Live Feed
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Gas Dynamics */}
        <ChartCard 
          title="Gas Dynamics" 
          subtitle="Network Fee Ratios" 
          icon={<TrendingUpIcon size={16} />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AAFF00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#AAFF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="avg_gas_price" name="Avg Gas" stroke="#AAFF00" fillOpacity={1} fill="url(#colorGas)" strokeWidth={2} />
              <Area type="monotone" dataKey="gas_price_ratio_to_network" name="Net Ratio" stroke="#71717a" fillOpacity={0} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. User Interactions */}
        <ChartCard 
          title="Activity Profile" 
          subtitle="Call Density & Anomalies" 
          icon={<ActivityIcon size={16} />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calls_per_caller" name="Call Count" fill="#AAFF00" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="caller_zscore" name="Z-Score" stroke="#ff4444" dot={false} strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Asset Liquidity */}
        <ChartCard 
          title="Liquidity Flux" 
          subtitle="Net Flow Metrics" 
          icon={<ZapIcon size={16} />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line type="stepAfter" dataKey="net_flow" name="Net Flow" stroke="#AAFF00" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="inflow_outflow_ratio" name="I/O Ratio" stroke="#a855f7" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Threat Matrix */}
        <ChartCard 
          title="Security Scoring" 
          subtitle="Threat Vector Analysis" 
          icon={<ShieldCheckIcon size={16} />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="risk_score" name="Risk Score" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="reentrancy_threat" name="Threat Lvl" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Transfer Magnitude */}
        <ChartCard 
          title="Transfer Magnitude" 
          subtitle="Largest Single Moves" 
          icon={<CoinsIcon size={16} />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="largest_single_transfer" name="Largest Move" fill="#ffffff" fillOpacity={0.05} stroke="#ffffff" strokeOpacity={0.2} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children, className = "" }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-900/30 border border-white/[0.04] p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-zinc-900/50 transition-all duration-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-1">{title}</h3>
          <p className="text-[9px] text-zinc-800 font-bold uppercase">{subtitle}</p>
        </div>
        <div className="size-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-zinc-500 group-hover:text-primary group-hover:border-primary/20 border border-transparent transition-all duration-500">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>

      {/* Background Polish */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
        {React.cloneElement(icon, { size: 120 })}
      </div>
    </motion.div>
  );
}
