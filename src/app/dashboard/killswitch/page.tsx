"use client"

import React, { useEffect, useState, useCallback } from "react"
import { 
  AlertTriangleIcon, 
  ZapIcon, 
  ShieldAlertIcon, 
  Loader2Icon,
  SearchIcon,
  ChevronRightIcon,
  RadiationIcon,
  PowerIcon
} from "lucide-react"
import { getAllProjects } from "@/functions/api/projects"
import { triggerTimelock, getIsLocked } from "@/functions/api/timelock"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Project {
  id: string;
  title: string;
  contractAddress: string;
  isLocked?: boolean;
}

export default function KillswitchPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [killing, setKilling] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getAllProjects();
      const list = Array.isArray(data?.projects ?? data) ? (data?.projects ?? data) : [];
      
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
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleKill = async () => {
    if (!selectedProject) return;
    setKilling(true);
    try {
      await triggerTimelock({
        target: selectedProject.contractAddress,
        callData: "0x" // Emergency pause generic
      });
      toast.error("PROTOCOL SHUTDOWN INITIATED", {
        style: { background: "#7f1d1d", color: "#fca5a5", border: "1px solid #991b1b" }
      });
      setConfirming(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Shutdown command failed");
    } finally {
      setKilling(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contractAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-zinc-100 font-mono w-full min-h-screen pb-20 overflow-hidden relative">
      {/* Background Alarm Pulse */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent animate-pulse" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="size-2 rounded-full bg-red-500 animate-ping shadow-[0_0_10px_rgba(239,68,68,1)]" />
            <p className="text-[10px] tracking-[0.4em] text-red-500 uppercase font-black">
              Emergency Override Terminal
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none italic">
            Kill Switch
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Left: Project Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Target Protocol Address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-red-500/10 rounded-2xl py-5 pl-12 pr-4 text-xs font-black focus:outline-none focus:border-red-500/40 focus:bg-zinc-950 transition-all uppercase tracking-widest text-white shadow-2xl"
            />
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-900/30 border border-white/5 rounded-3xl animate-pulse" />)
            ) : filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`w-full text-left p-8 rounded-3xl border transition-all relative overflow-hidden group ${
                  selectedProject?.id === project.id 
                    ? "bg-red-500/10 border-red-500/50" 
                    : "bg-zinc-900/30 border-white/[0.04] hover:border-red-500/20 hover:bg-zinc-900/50 shadow-lg shadow-black/20"
                }`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-6">
                     <div className={`size-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                       selectedProject?.id === project.id ? "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-zinc-800 border-white/5 text-zinc-600 group-hover:text-red-400"
                     }`}>
                        <ShieldAlertIcon size={24} />
                     </div>
                     <div>
                       <h4 className="text-lg font-black text-white italic tracking-tighter uppercase group-hover:text-red-400 transition-colors">{project.title}</h4>
                       <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{project.contractAddress.substring(0, 24)}...</p>
                     </div>
                  </div>
                  {project.isLocked && (
                    <span className="text-[10px] font-black bg-red-500/20 text-red-500 px-3 py-1.5 rounded-lg border border-red-500/20 tracking-widest ring-1 ring-red-500/30">LOCKED</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: The Button */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[600px] bg-zinc-900/20 border-2 border-dashed border-red-500/5 rounded-[4rem] p-12 relative overflow-hidden text-center">
            {selectedProject ? (
              <AnimatePresence mode="wait">
                {!confirming ? (
                  <motion.div 
                    key="initial"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center"
                  >
                     <div className="size-40 rounded-full bg-red-500/5 flex items-center justify-center mb-10 border border-red-500/10 shadow-[inset_0_0_40px_rgba(239,68,68,0.05)]">
                        <RadiationIcon size={64} className="text-red-500/80 animate-spin-slow" />
                     </div>
                     <h2 className="text-3xl font-black text-white uppercase italic tracking-[0.1em] mb-4">TARGET_RESOLUTION_PENDING</h2>
                     <p className="text-[11px] text-zinc-500 uppercase tracking-[0.3em] font-black max-w-md mb-12 leading-relaxed">
                       Contract state intervention sequence synchronized for <span className="text-red-500">{selectedProject.title}</span>. 
                       Payload injection is prepared at registry level.
                     </p>
                     <button 
                       onClick={() => setConfirming(true)}
                       className="group relative px-16 py-6 bg-red-500 hover:bg-red-600 text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_0_40px_rgba(239,68,68,0.2)] hover:shadow-[0_0_60px_rgba(239,68,68,0.4)] active:scale-95"
                     >
                       SYNC_LOCKDOWN_COMMAND
                     </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="confirm"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                     <div className="size-40 rounded-full bg-white text-black flex items-center justify-center mb-12 border-4 border-red-500 animate-[pulse_0.8s_infinite] shadow-[0_0_120px_rgba(255,255,255,0.15)]">
                        <PowerIcon size={80} fill="currentColor" strokeWidth={3} />
                     </div>
                     <h2 className="text-4xl font-black text-red-500 uppercase italic tracking-[0.05em] mb-6 shadow-red-500/10">CONFIRM_SHUTDOWN?</h2>
                     <p className="text-[11px] text-zinc-500 uppercase tracking-[0.3em] font-black max-w-[480px] mb-12 leading-relaxed">
                       CRITICAL: EMERGENCY_STOP_COMMAND IS IRREVERSIBLE VIA THIS CHANNEL. 
                       Registry re-calibration will be required for subsequent reactivation.
                     </p>
                     <div className="flex gap-8">
                        <button 
                          onClick={() => setConfirming(false)}
                          className="px-10 py-5 border border-white/10 text-zinc-600 hover:text-white hover:border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                        >
                          TERMINATE_SEQUENCE
                        </button>
                        <button 
                          onClick={handleKill}
                          disabled={killing}
                          className="px-16 py-5 bg-red-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                        >
                          {killing ? <Loader2Icon size={16} className="animate-spin" /> : "ENGAGE_EMERGENCY_OVERRIDE"}
                        </button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center opacity-20">
                <AlertTriangleIcon size={80} className="text-zinc-600 mb-8" />
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">NULL_TARGET_INDEX</h3>
                <p className="text-[11px] text-zinc-600 uppercase tracking-[0.4em] font-black mt-4">Select index from registry to resolve intervention target</p>
              </div>
            )}

            {/* Background Polish */}
            <div className="absolute top-0 left-0 p-8 text-8xl font-black text-white/[0.02] pointer-events-none italic select-none">
              KILL
            </div>
            <div className="absolute bottom-0 right-0 p-8 text-8xl font-black text-white/[0.02] pointer-events-none italic select-none">
              SWITCH
            </div>
        </div>
      </div>
    </div>
  );
}