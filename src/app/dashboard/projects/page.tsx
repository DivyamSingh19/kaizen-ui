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
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-mono">
      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-3">
              Smart Contract Registry
            </p>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              PROJECTS
            </h1>
            <div className="mt-3 h-px w-24 bg-gradient-to-r from-white to-transparent" />
          </div>
          <Link
            href="/projects/new"
            className="group flex items-center gap-3 border border-zinc-700 px-5 py-3 text-sm tracking-widest uppercase hover:border-white hover:text-white transition-all duration-200 text-zinc-400"
          >
            <span className="text-lg leading-none">+</span>
            New Project
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
          <div className="space-y-px">
            {projects.map((project, i) => (
              <div
                key={project._id}
                className="group border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-150 p-6"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-5 min-w-0">
                    <span className="text-xs text-zinc-600 mt-1 w-6 shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link
                          href={`/projects/${project._id}`}
                          className="text-lg font-semibold text-white hover:text-zinc-300 transition-colors tracking-tight"
                        >
                          {project.title}
                        </Link>
                        <span className={`text-[10px] tracking-widest uppercase border px-2 py-0.5 ${STATUS_COLORS[project.status] || STATUS_COLORS.inactive}`}>
                          {project.status || "unknown"}
                        </span>
                      </div>
                      {project.description && (
                        <p className="mt-1 text-sm text-zinc-500 truncate max-w-lg">{project.description}</p>
                      )}
                      <p className="mt-2 text-xs text-zinc-600 font-mono truncate max-w-xs">
                        {project.contractAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <select
                      value={project.status || ""}
                      onChange={(e) => handleStatusChange(project._id, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-2 py-1.5 focus:outline-none focus:border-zinc-500 cursor-pointer"
                    >
                      {["active", "inactive", "pending", "deprecated"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Link
                      href={`/projects/${project._id}/edit`}
                      className="px-3 py-1.5 text-xs border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deletingId === project._id}
                      className="px-3 py-1.5 text-xs border border-zinc-800 text-zinc-600 hover:border-red-500/50 hover:text-red-400 transition-colors uppercase tracking-widest disabled:opacity-30"
                    >
                      {deletingId === project._id ? "..." : "Del"}
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