"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { 
  BarChart3Icon, 
  SearchIcon, 
  LineChartIcon, 
  ArrowRightIcon,
  ActivityIcon,
  DatabaseIcon
} from "lucide-react"
import { getAllProjects } from "@/functions/api/projects"
import { motion } from "framer-motion"

interface Project {
  id: string;
  title: string;
  contractAddress: string;
}

export default function StatsProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        const list = Array.isArray(data?.projects ?? data) ? (data?.projects ?? data) : [];
        setProjects(list);
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
            Analytics Engine
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none italic">
            Telemetry Hub
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Filter protocol registry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all w-[260px]"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 bg-zinc-900/40 border border-white/[0.04] rounded-3xl p-6 animate-pulse" />
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl text-zinc-600 bg-zinc-900/10">
            <DatabaseIcon className="size-10 mb-4 opacity-10" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">No monitored protocols indexed</p>
          </div>
        ) : (
          filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                href={`/dashboard/stats/${project.id}`}
                className="group relative block overflow-hidden bg-zinc-900/40 border border-white/[0.04] p-8 rounded-[2.5rem] hover:bg-zinc-900/60 hover:border-primary/20 transition-all duration-500 h-full"
              >
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="size-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-600 group-hover:text-primary transition-all duration-500 border border-white/[0.02]">
                      <BarChart3Icon size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic group-hover:text-primary transition-colors">Analytical_Stream</span>
                       <ActivityIcon size={12} className="text-primary animate-pulse" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2 group-hover:text-white transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-[10px] text-zinc-600 font-mono mb-8 truncate opacity-60">
                    ADR: {project.contractAddress}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/[0.02]">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">
                      <LineChartIcon size={14} className="text-zinc-700" />
                      <span>Deep Analysis</span>
                    </div>
                    <div className="size-8 rounded-xl bg-white/[0.02] flex items-center justify-center group-hover:bg-primary transition-all">
                      <ArrowRightIcon size={14} className="text-zinc-800 group-hover:text-black" />
                    </div>
                  </div>
                </div>
                
                {/* Visual Flair */}
                <div className="absolute -bottom-8 -right-8 size-40 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-700" />
                <div className="absolute top-0 right-0 p-8 text-6xl font-black text-white/[0.01] pointer-events-none italic select-none group-hover:text-white/[0.02] transition-colors">
                  0{i+1}
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}