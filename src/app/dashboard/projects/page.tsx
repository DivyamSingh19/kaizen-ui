"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProjects, deleteProject, updateProjectStatus } from "@/functions/api/projects";

interface Project {
  _id: string;
  title: string;
  description?: string;
  contractAddress: string;
  status: string;
  createdAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  inactive: "text-zinc-400 border-zinc-600 bg-zinc-800/50",
  pending: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  deprecated: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      const list = data?.projects ?? data;
      setProjects(Array.isArray(list) ? list : []);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project permanently?")) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (projectId: string, status: string) => {
    try {
      await updateProjectStatus({ projectId, status });
      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? { ...p, status } : p))
      );
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Status update failed");
    }
  };

  return (
    <div className="text-zinc-100 font-mono">
      <div className="w-full px-6 py-6 font-mono">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4 leading-none font-bold">
              Registry 01
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
              Projects
            </h1>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="group flex items-center justify-center gap-3 bg-white px-6 py-4 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all duration-200 text-black shadow-lg shadow-white/5"
          >
            Deploy New Project
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-300">✕</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-zinc-800 p-20 text-center">
            <p className="text-zinc-600 text-sm tracking-widest uppercase">No projects deployed</p>
            <Link href="/projects/new" className="inline-block mt-6 text-xs tracking-widest text-zinc-400 border-b border-zinc-600 pb-px hover:text-white hover:border-white transition-colors">
              Deploy your first →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project, i) => (
              <div
                key={project._id}
                className="group relative border border-white/[0.04] bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-white/[0.1] transition-all duration-300 p-5 md:p-8 rounded-xl overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-start gap-6 min-w-0">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-zinc-700 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="w-px h-8 bg-zinc-800 mt-2" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-4 flex-wrap mb-2">
                        <Link
                          href={`/dashboard/project/${project._id}`}
                          className="text-xl font-bold text-white hover:text-zinc-300 transition-colors tracking-tight"
                        >
                          {project.title}
                        </Link>
                        <span className={`text-[10px] font-black tracking-[0.2em] uppercase border px-2.5 py-1 rounded-sm ${STATUS_COLORS[project.status] || STATUS_COLORS.inactive}`}>
                          {project.status || "unknown"}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-sm text-zinc-400 line-clamp-2 max-w-xl mb-4 leading-relaxed font-medium">
                          {project.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold mb-1">Contract Address</span>
                          <span className="text-[11px] text-zinc-400 font-mono truncate max-w-[200px] md:max-w-xs block">
                            {project.contractAddress}
                          </span>
                        </div>
                        {project.createdAt && (
                          <div className="flex flex-col border-l border-white/5 pl-6">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 font-bold mb-1">Created</span>
                            <span className="text-[11px] text-zinc-400 font-sans font-medium">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <div className="relative group/select">
                      <select
                        value={project.status || ""}
                        onChange={(e) => handleStatusChange(project._id, e.target.value)}
                        className="appearance-none bg-zinc-800 border border-white/10 text-zinc-300 text-[10px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-lg focus:outline-none focus:border-white/20 cursor-pointer pr-10"
                      >
                        {["active", "inactive", "pending", "deprecated"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <Link
                      href={`/dashboard/project/${project._id}/edit`}
                      className="px-4 py-2.5 text-[10px] font-black border border-white/10 text-zinc-400 hover:border-white hover:text-white transition-all uppercase tracking-widest rounded-lg"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deletingId === project._id}
                      className="px-4 py-2.5 text-[10px] font-black border border-white/5 text-zinc-600 hover:border-red-500/30 hover:text-red-400 transition-all uppercase tracking-widest rounded-lg disabled:opacity-30"
                    >
                      {deletingId === project._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="mt-6 flex justify-between text-xs text-zinc-600 tracking-widest uppercase">
            <span>{projects.length} project{projects.length !== 1 ? "s" : ""} total</span>
          </div>
        )}
      </div>
    </div>
  );
}