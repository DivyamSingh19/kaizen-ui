"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ActivityIcon, 
  ZapIcon, 
  ArrowLeftIcon, 
  ClockIcon, 
  RefreshCwIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  Loader2Icon,
  TrendingUpIcon
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"
import { getProjectById } from "@/functions/api/projects"
import { getTimeSeries } from "@/functions/api/monitoring"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface Project {
  id: string;
  title: string;
  contractAddress: string;
  status: string;
}

export default function ProjectMonitoringPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  
  const [project, setProject] = useState<Project | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      // 1. Fetch Project Details
      const projData = await getProjectById(projectId);
      setProject(projData);

      if (projData?.contractAddress) {
        // 2. Fetch Time Series Data
        const series = await getTimeSeries(projData.contractAddress);
        // Process data: InfluxDB returns _time, we'll format it for the chart
        const formattedData = Array.isArray(series) ? series.map((item: any) => ({
          ...item,
          timestamp: new Date(item._time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          // Map InfluxDB fields to chart keys
          activity: Number(item.total_function_calls) || 0,
          gasUsed: Number(item.avg_gas_price) || 0,
          uniqueCallers: Number(item.unique_callers) || 0,
          ethInflow: Number(item.total_eth_inflow) || 0,
          txHash: item.txHash || item.hash || null,
        })) : [];
        setTimeSeriesData(formattedData);
      }
    } catch (err: any) {
      console.error("Failed to load monitoring data:", err);
      setError(err.message || "Failed to load monitoring dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [projectId]);

  const chartConfig = {
    activity: {
      label: "System Activity",
      color: "#aaff00",
    },
    gasUsed: {
      label: "Gas Used",
      color: "#a855f7",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2Icon className="size-8 text-[#aaff00] animate-spin" />
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 italic">Syncing live feed...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
          <ActivityIcon className="size-8 text-red-400 opacity-50" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Sync Error</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-6">{error || "Project metadata lookup failed."}</p>
          <Link 
            href="/dashboard/monitoring"
            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-white transition-all rounded-xl"
          >
            Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-zinc-100 font-mono w-full pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <Link href="/dashboard/monitoring" className="hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeftIcon size={12} /> Registry
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="text-primary italic">Live_Feed_{project.id.substring(0, 4)}</span>
        </div>
        <button 
          onClick={() => fetchAllData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-white/5 bg-zinc-900/40 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <RefreshCwIcon size={12} className={refreshing ? "animate-spin text-primary" : ""} />
          {refreshing ? "Refreshing..." : "Re-sync"}
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(170,255,0,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Monitoring Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
            {project.title}
          </h1>
          <p className="text-xs text-zinc-500 font-medium tracking-tight flex items-center gap-2">
            <span className="text-zinc-700">CONTRACT:</span> 
            <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-zinc-400 select-all">
              {project.contractAddress}
            </span>
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 shrink-0">
          {[
            { label: "Status", value: "ONLINE", icon: <ShieldCheckIcon size={14} />, color: "text-primary" },
            { label: "Alerts", value: "0", icon: <ActivityIcon size={14} />, color: "text-zinc-400" },
            { label: "Latency", value: "14ms", icon: <ClockIcon size={14} />, color: "text-zinc-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/40 border border-white/[0.04] p-4 rounded-xl min-w-[120px]">
              <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-2">
                {stat.icon} {stat.label}
              </div>
              <div className={`text-sm font-bold tracking-tight ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Activity Area Chart */}
        <Card className="bg-zinc-900/40 border-white/[0.04] shadow-none overflow-hidden">
          <CardHeader className="border-b border-white/[0.02]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <TrendingUpIcon size={14} className="text-primary" />
                  Transaction Activity
                </CardTitle>
                <CardDescription className="text-[10px] text-zinc-600 font-mono italic mt-1 uppercase">Live block activity (24H)</CardDescription>
              </div>
              <div className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">
                +12.5%
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-10">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData.length > 0 ? timeSeriesData : Array(10).fill({ activity: 0, timestamp: '--' })}>
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#aaff00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#aaff00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ffffff05" />
                  <XAxis 
                    dataKey="timestamp" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 700 }}
                    minTickGap={40}
                  />
                  <YAxis 
                    hide 
                    domain={['auto', 'auto']}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Area
                    type="monotone"
                    dataKey="activity"
                    stroke="#aaff00"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorActivity)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gas Consumption Area Chart */}
        <Card className="bg-zinc-900/40 border-white/[0.04] shadow-none overflow-hidden">
          <CardHeader className="border-b border-white/[0.02]">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <ZapIcon size={14} className="text-purple-500" />
                  Gas Consumption
                </CardTitle>
                <CardDescription className="text-[10px] text-zinc-600 font-mono italic mt-1 uppercase">Cumulative gas usage units</CardDescription>
              </div>
              <div className="text-[10px] font-black text-zinc-400 bg-zinc-800 border border-white/5 px-2 py-1 rounded">
                Stable
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-10">
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData.length > 0 ? timeSeriesData : Array(10).fill({ gasUsed: 0, timestamp: '--' })}>
                  <defs>
                    <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#ffffff05" />
                  <XAxis 
                    dataKey="timestamp" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#3f3f46', fontSize: 10, fontWeight: 700 }}
                    minTickGap={40}
                  />
                  <YAxis 
                    hide
                    domain={['auto', 'auto']}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Area
                    type="monotone"
                    dataKey="gasUsed"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorGas)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Data Feed / Events */}
      <div className="mt-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Raw Stream Data</h3>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="bg-zinc-900/20 border border-white/[0.04] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.04] bg-zinc-900/50">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Timestamp</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Transaction Hash</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Activity_Idx</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Gas_Metadata</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {timeSeriesData.length > 0 ? [...timeSeriesData].reverse().slice(0, 10).map((row, i) => (
                <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-[10px] text-zinc-400 font-mono">{row.timestamp}</td>
                  <td className="px-6 py-4 text-[10px] text-zinc-400 font-mono">
                    {row.txHash ? (
                      <span className="bg-white/5 border border-white/5 px-2 py-1 rounded text-primary hover:text-white transition-colors cursor-pointer select-all">
                        {row.txHash.substring(0, 10)}...{row.txHash.substring(row.txHash.length - 8)}
                      </span>
                    ) : (
                      <span className="text-zinc-700 italic">No_Hash_Logged</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[10px] text-white font-bold">{row.activity} units</td>
                  <td className="px-6 py-4 text-[10px] text-zinc-500">{(row.gasUsed * 1e9).toFixed(2)} GWEI</td>
                  <td className="px-6 py-4">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Synced</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-700 italic">
                    Waiting for next block synchronization...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}