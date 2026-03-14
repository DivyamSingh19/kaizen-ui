"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { 
  PlusIcon, 
  ActivityIcon, 
  FolderIcon, 
  ZapIcon, 
  ClockIcon, 
  ArrowUpRightIcon,
  SearchIcon,
  ShieldCheckIcon
} from "lucide-react"
import { getAllProjects } from "@/functions/api/projects"
import { AuthProvider } from "@/context/AuthContext"

interface Project {
  id: string;
  title: string;
  status: string;
  createdAt?: string;
}

export default function DashboardOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAllProjects();
        const list = data?.projects ?? data;
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Total Projects", value: projects.length, icon: <FolderIcon className="size-4" />, change: "+12%", trend: "up" },
    { label: "Active Nodes", value: "24", icon: <ZapIcon className="size-4" />, change: "+2", trend: "up" },
    { label: "Monitoring Alerts", value: "0", icon: <ActivityIcon className="size-4" />, change: "0", trend: "neutral" },
    { label: "Uptime", value: "99.9%", icon: <ShieldCheckIcon className="size-4" />, change: "Stable", trend: "neutral" },
  ];

  return (
    <AuthProvider> 
    <div className="text-zinc-100 font-mono w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4 leading-none font-bold">
            System Overview
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              className="bg-zinc-900/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all w-[240px]"
            />
          </div>
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-2 bg-white px-5 py-3 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all text-black rounded-lg shadow-xl shadow-white/5"
          >
            <PlusIcon size={14} strokeWidth={3} />
            <span>New Action</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="group relative overflow-hidden bg-zinc-900/40 border border-white/[0.04] p-6 rounded-2xl hover:bg-zinc-900/60 hover:border-white/[0.1] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/[0.03] text-zinc-400 group-hover:text-white transition-colors">
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`}>
                {stat.change}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{stat.label}</span>
              <span className="text-2xl font-black text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Recent Projects</h3>
            <Link href="/dashboard/projects" className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors underline underline-offset-4">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-20 bg-zinc-900/50 border border-white/5 rounded-xl animate-pulse" />)
            ) : projects.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl text-zinc-600 bg-zinc-900/20">
                <FolderIcon className="size-8 mb-3 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No active projects</p>
              </div>
            ) : (
              projects.slice(0, 5).map((project, i) => (
                <Link 
                  key={project.id}
                  href={`/dashboard/project/${project.id}`}
                  className="group flex items-center justify-between p-4 bg-zinc-900/40 border border-white/[0.04] rounded-xl hover:bg-zinc-900/60 hover:border-white/[0.08] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <FolderIcon className="size-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-0.5">{project.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono italic">ID: {project.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-white/5 rounded bg-zinc-800/50 text-zinc-400">
                      {project.status}
                    </span>
                    <ArrowUpRightIcon className="size-4 text-zinc-700 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Activity</h3>
          </div>
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-6">
            {[
              { type: "deployment", text: "New node deployed in US-East", time: "2m ago" },
              { type: "security", text: "Auth token rotated for user_01", time: "15m ago" },
              { type: "project", text: "Project 'Nexus-7' status updated", time: "1h ago" },
              { type: "alert", text: "Storage capacity at 85%", time: "3h ago" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative">
                  <div className="size-2 rounded-full bg-primary mt-1 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                  {i !== 3 && <div className="absolute top-4 left-1 w-px h-full bg-white/5" />}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-zinc-300 font-medium leading-tight mb-1">{activity.text}</p>
                  <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                    <ClockIcon className="size-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white border border-white/5 rounded-lg hover:bg-white/5 transition-all">
              View Full Logs
            </button>
          </div>
        </div>
      </div>
    </div>
    </AuthProvider>
  )
}
