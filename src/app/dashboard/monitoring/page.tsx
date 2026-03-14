"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ActivityIcon, SearchIcon, FolderIcon, ZapIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react"
import { getAllProjects } from "@/functions/api/projects"
import { startMonitoring } from "@/functions/api/monitoring"

interface Project {
  id: string;
  title: string;
  contractAddress: string;
  status: string;
  monitoringStatus?: string;
}

export default function MonitoringPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingProjectId, setStartingProjectId] = useState<string | null>(null);
  const [startedProjects, setStartedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        // Handle varying response formats safely
        const list = data?.projects ?? data;
        setProjects(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleStartMonitoring = async (projectId: string) => {
    setStartingProjectId(projectId);
    try {
      await startMonitoring({ projectId });
      setStartedProjects(prev => new Set(prev).add(projectId));
    } catch (error) {
      console.error("Failed to start monitoring:", error);
      alert("Failed to start monitoring. Please try again.");
    } finally {
      setStartingProjectId(null);
    }
  };

  return (
    <div className="text-zinc-100 font-mono w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4 leading-none font-bold">
            Live Feed & Analysis
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
            Monitoring
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search by contract or title..." 
              className="bg-zinc-900/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all w-[240px]"
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // Skeletons
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-zinc-900/40 border border-white/[0.04] rounded-2xl p-6 animate-pulse flex flex-col justify-between">
              <div className="w-1/3 h-6 bg-white/5 rounded mb-4" />
              <div className="flex gap-4">
                <div className="w-32 h-10 bg-white/5 rounded-xl border border-white/10" />
                <div className="w-32 h-10 bg-white/5 rounded-xl border border-white/10" />
              </div>
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl text-zinc-600 bg-zinc-900/20">
            <ActivityIcon className="size-10 mb-4 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#a855f7]">0 active trackers</p>
            <p className="text-[10px] tracking-widest text-zinc-500 mt-2">Add a project to begin monitoring.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id} 
              className="group relative flex flex-col justify-between overflow-hidden bg-zinc-900/40 border border-white/[0.04] rounded-2xl p-6 hover:bg-zinc-900/60 hover:border-white/[0.1] transition-all duration-300 min-h-[260px]"
            >
              {/* Project Title and Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-white">{project.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest px-2 py-1 rounded bg-black/40 border border-white/5 text-zinc-400">
                    <span className="shrink-0 size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    {project.contractAddress 
                      ? `${project.contractAddress.substring(0, 6)}...${project.contractAddress.substring(project.contractAddress.length - 4)}` 
                      : "No address"}
                  </div>
                </div>
                {/* Optional description placeholder, mimicking wireframe space */}
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mt-3">
                  System monitoring initialization complete. Awaiting real-time transaction blocks.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-8">
                {project.monitoringStatus === "ACTIVE" || startedProjects.has(project.id) ? (
                  <button disabled className="flex items-center gap-2 px-6 py-2.5 text-xs font-black tracking-widest uppercase text-[#aaff00] border border-[#aaff00]/30 bg-[#aaff00]/10 rounded-xl transition-all duration-200">
                    <CheckCircle2Icon size={14} className="shrink-0" />
                    Monitoring Active
                  </button>
                ) : (
                  <button 
                    onClick={() => handleStartMonitoring(project.id)}
                    disabled={startingProjectId === project.id}
                    className="flex items-center gap-2 px-6 py-2.5 text-xs font-black tracking-widest uppercase text-white hover:text-black border border-white/20 hover:border-[#aaff00] bg-transparent hover:bg-[#aaff00] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/20 rounded-xl transition-all duration-200"
                  >
                    {startingProjectId === project.id ? (
                      <Loader2Icon size={14} className="shrink-0 animate-spin" />
                    ) : (
                      <ZapIcon size={14} className="shrink-0" />
                    )}
                    {startingProjectId === project.id ? "Starting..." : "Start monitoring"}
                  </button>
                )}
                <Link 
                  href={`/dashboard/monitoring/${project.id}`}
                  className="px-6 py-2.5 text-xs font-black tracking-widest uppercase text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  View status
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
