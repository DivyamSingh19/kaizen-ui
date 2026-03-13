"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectById,editProject } from "@/functions/api/projects";
interface FormData {
  title: string;
  description: string;
  contractAddress: string;
  abi: string;
}

interface FormErrors {
  abi?: string;
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    contractAddress: "",
    abi: "",
  });
  const [originalTitle, setOriginalTitle] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjectById(id);
        const project = data?.project || data;
        const abiStr = typeof project.abi === "string"
          ? project.abi
          : JSON.stringify(project.abi, null, 2);
        setForm({
          title: project.title || "",
          description: project.description || "",
          contractAddress: project.contractAddress || "",
          abi: abiStr,
        });
        setOriginalTitle(project.title || "");
      } catch (err: unknown) {
        const e = err as { message?: string };
        setApiError(e?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (form.abi.trim()) {
      try {
        JSON.parse(form.abi);
      } catch {
        newErrors.abi = "ABI must be valid JSON";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const payload: Record<string, unknown> = {};
      if (form.title.trim()) payload.title = form.title.trim();
      if (form.description.trim() !== undefined) payload.description = form.description.trim();
      if (form.contractAddress.trim()) payload.contractAddress = form.contractAddress.trim();
      if (form.abi.trim()) payload.abi = JSON.parse(form.abi);

      await editProject(id, payload);
      router.push(`/dashboard/project/${id}`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setApiError(e?.message || "Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "abi" && errors.abi) {
      setErrors((prev) => ({ ...prev, abi: undefined }));
    }
  };

  const formatAbi = () => {
    try {
      const parsed = JSON.parse(form.abi);
      setForm((prev) => ({ ...prev, abi: JSON.stringify(parsed, null, 2) }));
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 bg-zinc-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-zinc-100 font-mono">
      <div className="w-full px-6 py-6 font-mono">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-10">
          <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
          <span className="text-zinc-800">/</span>
          <Link href={`/dashboard/project/${id}`} className="hover:text-white transition-colors">Registry_{id.substring(0, 4)}</Link>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-400">Configuration_Terminal</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4 leading-none font-bold italic">
            Maintenance Mode
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none italic">
            Edit Project
          </h1>
        </div>

        {apiError && (
          <div className="mb-8 border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm flex justify-between items-center">
            <span>{apiError}</span>
            <button onClick={() => setApiError(null)} className="text-red-500 hover:text-red-300">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {/* Title */}
          <div className="group relative border border-white/[0.04] bg-zinc-900/40 focus-within:bg-zinc-900/60 focus-within:border-white/[0.1] transition-all duration-300 p-8 rounded-2xl">
            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 leading-none">
              Project Title <span className="text-zinc-800 ml-2">/ required</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Project name"
              className="w-full bg-transparent text-white placeholder-zinc-800 text-lg font-bold border-0 outline-none p-0 focus:ring-0"
            />
          </div>

          {/* Description */}
          <div className="group relative border border-white/[0.04] bg-zinc-900/40 focus-within:bg-zinc-900/60 focus-within:border-white/[0.1] transition-all duration-300 p-8 rounded-2xl">
            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 leading-none">
              Overview <span className="text-zinc-800 ml-2">/ optional</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Update project description..."
              className="w-full bg-transparent text-zinc-300 placeholder-zinc-800 text-sm font-medium border-0 outline-none p-0 focus:ring-0 resize-none leading-relaxed"
            />
          </div>

          {/* Contract Address */}
          <div className="group relative border border-white/[0.04] bg-zinc-900/40 focus-within:bg-zinc-900/60 focus-within:border-white/[0.1] transition-all duration-300 p-8 rounded-2xl">
            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 leading-none">
              Deployment Address <span className="text-zinc-800 ml-2">/ constant_ref</span>
            </label>
            <input
              type="text"
              value={form.contractAddress}
              onChange={(e) => handleChange("contractAddress", e.target.value)}
              className="w-full bg-transparent text-zinc-400 placeholder-zinc-800 text-sm font-mono border-0 outline-none p-0 focus:ring-0"
            />
          </div>

          {/* ABI */}
          <div className={`group relative border bg-zinc-900/40 focus-within:bg-zinc-900/60 transition-all duration-300 p-8 rounded-2xl ${errors.abi ? "border-red-500/20" : "border-white/[0.04] focus-within:border-white/[0.1]"}`}>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 leading-none">
                ABI Specification <span className="text-zinc-800 ml-2">/ re-parse_json</span>
              </label>
              <button
                type="button"
                onClick={formatAbi}
                className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors"
              >
                Auto_Format
              </button>
            </div>
            <textarea
              value={form.abi}
              onChange={(e) => handleChange("abi", e.target.value)}
              rows={8}
              className="w-full bg-zinc-950/50 text-zinc-400 placeholder-zinc-900 text-[11px] font-mono border border-white/[0.02] p-6 rounded-xl outline-none resize-y focus:border-white/[0.08] transition-all leading-relaxed"
            />
            {errors.abi && (
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-red-500/80">{errors.abi}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-12">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.34em] hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-xl shadow-2xl shadow-white/5"
          >
            {submitting ? "Synchronizing_Changes..." : "Apply_Configuration"}
          </button>
          <Link
            href={`/dashboard/project/${id}`}
            className="px-10 py-5 border border-white/[0.04] bg-zinc-900/20 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white hover:border-white/[0.1] transition-all rounded-xl"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}