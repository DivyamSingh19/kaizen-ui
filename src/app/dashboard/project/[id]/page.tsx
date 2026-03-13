"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectById,deleteProject } from "@/functions/api/projects";
interface Project {
  _id: string;
  title: string;
  description?: string;
  contractAddress: string;
  abi: object;
  status: string;
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
        setProject(data?.project || data);
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
    <div className="text-zinc-100 font-mono">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 tracking-widest uppercase mb-10">
          <Link href="/dashboard/projects" className="hover:text-zinc-400 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-zinc-400">{project.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-white tracking-tight">{project.title}</h1>
              <span className={`text-[10px] tracking-widest uppercase border px-2 py-0.5 ${STATUS_COLORS[project.status] || STATUS_COLORS.inactive}`}>
                {project.status}
              </span>
            </div>
            {project.description && (
              <p className="text-zinc-400 text-sm max-w-lg">{project.description}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/dashboard/project/${id}/edit`}
              className="px-4 py-2 text-xs border border-zinc-700 text-zinc-400 hover:border-white hover:text-white transition-all uppercase tracking-widest"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-xs border border-zinc-800 text-zinc-600 hover:border-red-500/50 hover:text-red-400 transition-all uppercase tracking-widest disabled:opacity-30"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-px mb-px border border-zinc-800">
          <div className="bg-zinc-900 p-5 border-b border-r border-zinc-800">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Contract Address</p>
            <p className="text-sm text-zinc-200 break-all">{project.contractAddress}</p>
          </div>
          <div className="bg-zinc-900 p-5 border-b border-zinc-800">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Project ID</p>
            <p className="text-sm text-zinc-200 break-all">{project._id}</p>
          </div>
          {project.createdAt && (
            <div className="bg-zinc-900 p-5 border-r border-zinc-800">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Created</p>
              <p className="text-sm text-zinc-200">
                {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          )}
          {project.updatedAt && (
            <div className="bg-zinc-900 p-5">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Last Updated</p>
              <p className="text-sm text-zinc-200">
                {new Date(project.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          )}
        </div>

        {/* ABI Section */}
        <div className="mt-px border border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setAbiExpanded(!abiExpanded)}
            className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/50 transition-colors"
          >
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Contract ABI</span>
            <span className="text-zinc-600 text-sm">{abiExpanded ? "−" : "+"}</span>
          </button>
          {abiExpanded && (
            <div className="border-t border-zinc-800 p-5">
              <pre className="text-xs text-zinc-400 overflow-auto max-h-96 leading-relaxed">
                {JSON.stringify(project.abi, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}