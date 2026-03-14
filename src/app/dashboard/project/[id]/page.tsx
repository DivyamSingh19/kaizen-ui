"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectById,deleteProject } from "@/functions/api/projects";
interface Project {
  id: string;
  title: string;
  description?: string;
  contractAddress: string;
  abi: object;
  status: string;
  monitoringStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  inactive: "text-zinc-400 border-zinc-600 bg-zinc-800/50",
  pending: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  deprecated: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [abiExpanded, setAbiExpanded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Permanently delete this project?")) return;
    setDeleting(true);
    try {
      await deleteProject(id);
      router.push("/dashboard/projects");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Delete failed");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-zinc-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="font-mono flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">{error || "Project not found"}</p>
          <Link href="/dashboard/projects" className="text-xs text-zinc-500 border-b border-zinc-700 hover:text-white hover:border-white transition-colors pb-px">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-zinc-100 font-mono w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-10">
          <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-400">Registry_{project.id.substring(0, 4)}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[9px] font-black tracking-[0.2em] uppercase italic border px-2.5 py-1 rounded-sm ${STATUS_COLORS[project.status] || STATUS_COLORS.inactive}`}>
                {project.status}
              </span>
              {project.monitoringStatus === "ACTIVE" ? (
                <span className="text-[9px] font-black tracking-[0.2em] uppercase border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  MONITORING ACTIVE
                </span>
              ) : (
                <span className="text-[9px] font-black tracking-[0.2em] uppercase border border-white/5 bg-zinc-800/50 text-zinc-500 px-2.5 py-1 rounded-sm">
                  MONITORING INACTIVE
                </span>
              )}
              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic ml-2">Live Interface</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-xl">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/dashboard/project/${id}/edit`}
              className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 rounded-xl shadow-xl shadow-white/5 border border-white/20 text-white hover:text-black hover:border-[#aaff00] bg-transparent hover:bg-[#aaff00]"
            >
              Configure
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-4 border border-white/[0.04] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-400 hover:border-red-500/20 transition-all rounded-xl"
            >
              {deleting ? "Deleting..." : "Terminate"}
            </button>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { label: "Execution Address", value: project.contractAddress, mono: true },
            { label: "Internal Identity", value: project.id, mono: true },
            { 
              label: "Genesis Date", 
              value: project.createdAt ? new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A" 
            },
            { 
              label: "Last Synchronization", 
              value: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A" 
            },
          ].map((item, i) => (
            <div key={i} className="group relative overflow-hidden bg-zinc-900/40 border border-white/[0.04] p-8 rounded-2xl hover:bg-zinc-900/60 transition-all">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">{item.label}</p>
              <p className={`text-sm text-zinc-300 font-medium break-all ${item.mono ? "font-mono" : ""}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* ABI Section */}
        <div className="relative overflow-hidden bg-zinc-900/40 border border-white/[0.04] rounded-2xl transition-all">
          <button
            onClick={() => setAbiExpanded(!abiExpanded)}
            className="w-full flex items-center justify-between p-8 hover:bg-zinc-900/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Contract ABI Interface</span>
              <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest px-2 py-0.5 border border-white/[0.02] rounded">JSON_STRUCT</span>
            </div>
            <div className={`size-6 rounded-lg border border-white/[0.04] flex items-center justify-center text-zinc-600 group-hover:text-[#aaff00] group-hover:border-[#aaff00]/50 transition-all ${abiExpanded ? "rotate-180" : ""}`}>
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {abiExpanded && (
            <div className="border-t border-white/[0.04] p-1 bg-black/20">
              <pre className="p-8 text-[11px] text-zinc-500 overflow-auto max-h-[600px] leading-relaxed font-mono custom-scrollbar">
                {JSON.stringify(project.abi, null, 2)}
              </pre>
            </div>
          )}
        </div>
    </div>
  );
}
