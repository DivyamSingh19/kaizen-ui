"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LockIcon, 
  UnlockIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  ArrowLeftIcon,
  Loader2Icon,
  TimerIcon,
  AlertTriangleIcon,
  SettingsIcon,
  PlayIcon,
  RefreshCwIcon
} from "lucide-react"
import { getProjectById } from "@/functions/api/projects"
import { 
  getTimelockStatus, 
  getIsLocked, 
  getLockDuration, 
  getLockedUntil,
  triggerTimelock,
  manualUnlock,
  setLockDuration,
  getTimelockOwner,
  getTimelockTriggeredEvents,
  getTimelockUnlockedEvents
} from "@/functions/api/timelock"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface Project {
  id: string;
  title: string;
  contractAddress: string;
}

export default function TimelockDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [lockDuration, setLockDurationVal] = useState<number | null>(null);
  const [lockedUntil, setLockedUntilVal] = useState<number | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [owner, setOwner] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [newDuration, setNewDuration] = useState<string>("");
  const [isEditingDuration, setIsEditingDuration] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const proj = await getProjectById(projectId);
      setProject(proj);

      if (proj?.contractAddress) {
        const [locked, duration, until, stat, ownerAddr, triggered, unlocked] = await Promise.all([
          getIsLocked(proj.contractAddress),
          getLockDuration(proj.contractAddress),
          getLockedUntil(proj.contractAddress),
          getTimelockStatus(proj.contractAddress),
          getTimelockOwner(proj.contractAddress),
          getTimelockTriggeredEvents(),
          getTimelockUnlockedEvents()
        ]);

        setIsLocked(locked);
        setLockDurationVal(duration);
        setLockedUntilVal(until);
        setStatus(stat);
        setOwner(ownerAddr);
        
        // Filter events for this contract and combine
        const combinedEvents = [
          ...(triggered || []).map((e: any) => ({ ...e, type: "TRIGGER" })),
          ...(unlocked || []).map((e: any) => ({ ...e, type: "UNLOCK" }))
        ]
        .filter((e: any) => (e.target || e.sender)?.toLowerCase() === proj.contractAddress.toLowerCase() || !e.target)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        setEvents(combinedEvents);
        if (duration) setNewDuration((duration / 60).toString());
      }
    } catch (err) {
      console.error("Failed to fetch timelock data", err);
      toast.error("Failed to sync timelock state");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [projectId, fetchData]);

  const handleUpdateDuration = async () => {
    if (!project?.contractAddress || !newDuration) return;
    setActionLoading("duration");
    try {
      const durationSeconds = parseInt(newDuration) * 60;
      await setLockDuration({
        target: project.contractAddress,
        duration: durationSeconds
      });
      toast.success("Lock duration updated successfully");
      setIsEditingDuration(false);
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to update duration");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTrigger = async () => {
    if (!project?.contractAddress) return;
    setActionLoading("trigger");
    try {
      await triggerTimelock({ 
        target: project.contractAddress, 
        callData: "0x" 
      });
      toast.success("Timelock activation sequence initiated");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Activation failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlock = async () => {
    if (!project?.contractAddress) return;
    setActionLoading("unlock");
    try {
      await manualUnlock({ 
        target: project.contractAddress, 
        callData: "0x" 
      });
      toast.success("Protocol manual unlock complete");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Unlock failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2Icon className="size-8 text-primary animate-spin" />
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 italic">Syncing security state...</p>
      </div>
    );
  }

  if (!project) return null;

  const getTimeRemaining = () => {
    if (!lockedUntil) return null;
    const now = Math.floor(Date.now() / 1000);
    const diff = lockedUntil - now;
    if (diff <= 0) return "Expired";
    
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m remaining`;
  };

  return (
    <div className="text-zinc-100 font-mono w-full pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <Link href="/dashboard/timelock" className="hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeftIcon size={12} /> Hub
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="text-primary italic">Control_{project.id.substring(0, 4)}</span>
        </div>
        <button 
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-white/5 bg-zinc-900/40 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <RefreshCwIcon size={12} className={refreshing ? "animate-spin text-primary" : ""} />
          {refreshing ? "Refreshing..." : "Re-sync"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Status and Info */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
               <span className={`size-2 rounded-full ${isLocked ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${isLocked ? "text-red-400" : "text-emerald-400"}`}>
                 {isLocked ? "System Locked" : "System Operative"}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[10px] text-zinc-500 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg select-all">
                {project.contractAddress}
              </p>
              {owner && (
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 uppercase font-black">
                  <span className="size-1 rounded-full bg-zinc-800" />
                  Authority: <span className="text-zinc-400">{owner.substring(0, 6)}...{owner.substring(38)}</span>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-zinc-900/40 border-white/[0.04]">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lock Window</CardTitle>
                 <TimerIcon size={14} className="text-zinc-700" />
               </CardHeader>
               <CardContent>
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-3xl font-black text-white italic">{lockDuration ? (lockDuration / 60).toFixed(0) : "0"}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-1">Minutes</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-tighter italic">Delay required for security interventions</p>
               </CardContent>
             </Card>

             <Card className="bg-zinc-900/40 border-white/[0.04]">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Time Execution</CardTitle>
                 <ClockIcon size={14} className="text-zinc-700" />
               </CardHeader>
               <CardContent>
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-2xl font-black text-white italic">{isLocked ? getTimeRemaining() : "N/A"}</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-tighter italic">
                    {isLocked ? "Time until unlock is possible" : "No active lock sequence"}
                  </p>
               </CardContent>
             </Card>
          </div>

          {/* History Feed */}
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 leading-none">Control_Logs</h3>
               <span className="text-[9px] text-zinc-800 font-bold uppercase">Last 10 Actions</span>
             </div>
             
             <div className="bg-zinc-900/20 border border-white/[0.04] rounded-3xl overflow-hidden">
                {events.length === 0 ? (
                  <div className="p-12 text-center text-zinc-700 uppercase font-black text-[10px] tracking-[0.2em]">
                    No historical logs found
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.02]">
                    {events.slice(0, 10).map((event, i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`size-8 rounded-lg flex items-center justify-center ${event.type === 'TRIGGER' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {event.type === 'TRIGGER' ? <LockIcon size={14} /> : <UnlockIcon size={14} />}
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">
                              {event.type === 'TRIGGER' ? 'Lock Triggered' : 'Protocol Unlocked'}
                            </p>
                            <p className="text-[9px] text-zinc-600 font-mono italic">
                              TX: {event.transactionHash?.substring(0, 12)}...
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                            {event.timestamp ? new Date(event.timestamp * 1000).toLocaleString() : 'Recent'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </section>

          <Card className="bg-zinc-900/20 border-white/[0.04] p-8 border-dashed border-2">
             <div className="flex items-start gap-4 text-zinc-400">
               <AlertTriangleIcon className="shrink-0 text-amber-500/50" />
               <div className="space-y-4">
                 <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Protocol Override Warning</h4>
                 <p className="text-xs leading-relaxed opacity-60 font-medium">
                   Timelock mechanisms are designed to prevent immediate malicious takeovers. 
                   Activating a lock will prevent any transactions from reaching the target contract for the duration of the window.
                 </p>
               </div>
             </div>
          </Card>
        </div>

        {/* Right Col: Controls */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-2 mb-4">Command Center</h3>
           
           <button 
             onClick={handleTrigger}
             disabled={!!isLocked || !!actionLoading}
             className="w-full flex items-center justify-between p-6 bg-zinc-900/40 border border-white/[0.04] rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all group disabled:opacity-30 disabled:hover:bg-zinc-900/40 disabled:hover:border-white/[0.04]"
           >
             <div className="text-left">
               <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Action_01</span>
               <span className="text-sm font-black text-white group-hover:text-red-400 uppercase italic">Trigger Lock</span>
             </div>
             {actionLoading === "trigger" ? <Loader2Icon className="animate-spin text-red-400" /> : <PlayIcon className="text-zinc-800 group-hover:text-red-400 transition-colors" />}
           </button>

           <button 
             onClick={handleUnlock}
             disabled={!isLocked || !!actionLoading}
             className="w-full flex items-center justify-between p-6 bg-zinc-900/40 border border-white/[0.04] rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group disabled:opacity-30 disabled:hover:bg-zinc-900/40 disabled:hover:border-white/[0.04]"
           >
             <div className="text-left">
               <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Action_02</span>
               <span className="text-sm font-black text-white group-hover:text-emerald-400 uppercase italic">Manual Unlock</span>
             </div>
             {actionLoading === "unlock" ? <Loader2Icon className="animate-spin text-emerald-400" /> : <UnlockIcon className="text-zinc-800 group-hover:text-emerald-400 transition-colors" />}
           </button>

           <div className="bg-zinc-900/40 border border-white/[0.04] rounded-2xl p-6 transition-all">
             <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Action_03</span>
                  <span className="text-sm font-black text-white uppercase italic">Config Window</span>
                </div>
                <SettingsIcon className="text-zinc-800" />
             </div>
             
             <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="number" 
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="Duration (min)"
                    className="w-full bg-zinc-950/50 border border-white/[0.06] rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary/40 transition-all text-white"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-700 uppercase">Min</span>
                </div>
                <button 
                  onClick={handleUpdateDuration}
                  disabled={actionLoading === "duration"}
                  className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  {actionLoading === "duration" ? <Loader2Icon size={12} className="animate-spin" /> : "Update Duration"}
                </button>
             </div>
           </div>

           <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2rem] mt-8 relative overflow-hidden">
              <ShieldCheckIcon className="absolute -right-4 -bottom-4 size-24 text-primary opacity-5 -rotate-12" />
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <ShieldCheckIcon className="text-primary size-4" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Security Status</span>
              </div>
              <p className="text-[10px] text-zinc-600 leading-relaxed uppercase font-black relative z-10">
                Hardware security module is online. All commands are cryptographically signed and logged for audit.
              </p>
           </div>
        </div>
      </div>
    </div>
   );
}