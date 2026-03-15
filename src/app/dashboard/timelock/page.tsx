"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { 
  LockIcon, 
  SearchIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon,
  TimerIcon
} from "lucide-react"
import { getAllProjects } from "@/functions/api/projects"
import { getIsLocked } from "@/functions/api/timelock"

interface Project {
  id: string;
  title: string;
  contractAddress: string;
  status: string;
  isLocked?: boolean;
}

export default function TimelockProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        const list = Array.isArray(data?.projects ?? data) ? (data?.projects ?? data) : [];
        
        // Fetch lock status for each contract
        const upgradedList = await Promise.all(list.map(async (p: any) => {
          try {
            const isLocked = await getIsLocked(p.contractAddress);
            return { ...p, isLocked };
          } catch {
            return p;
          }
        }));
        
        setProjects(upgradedList);
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contractAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-zinc-100 font-mono w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4 leading-none font-bold">
            Security Control
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
            Timelock Hub
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search registry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all w-[240px]"
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-zinc-900/40 border border-white/[0.04] rounded-2xl p-6 animate-pulse" />
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl text-zinc-600 bg-zinc-900/20">
            <LockIcon className="size-10 mb-4 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest text-primary">No projects found</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Link 
              key={project.id}
              href={`/dashboard/timelock/${project.id}`}
              className="group relative overflow-hidden bg-zinc-900/40 border border-white/[0.04] p-6 rounded-2xl hover:bg-zinc-900/60 hover:border-primary/30 transition-all duration-300"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-white/5 text-zinc-500 group-hover:text-primary transition-colors">
                    <ShieldCheckIcon size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{project.isLocked ? "LOCKED" : "OPERATIVE"}</span>
                     <div className={`size-1.5 rounded-full ${project.isLocked ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(170,255,0,0.5)]"}`} />
                  </div>
                </div>

                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono mb-6 truncate opacity-70">
                  {project.contractAddress}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.02]">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <TimerIcon size={12} />
                    <span>Manage Access</span>
                  </div>
                  <ArrowRightIcon size={14} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-6 -right-6 size-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}