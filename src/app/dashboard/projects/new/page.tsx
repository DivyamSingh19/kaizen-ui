"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addProject } from "@/functions/api/projects";
interface FormData {
  title: string;
  description: string;
  contractAddress: string;
  abi: string;
}

interface FormErrors {
  title?: string;
  contractAddress?: string;
  abi?: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    contractAddress: "",
    abi: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.contractAddress.trim()) newErrors.contractAddress = "Contract address is required";
    if (!form.abi.trim()) {
      newErrors.abi = "ABI is required";
    } else {
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
      const result = await addProject({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        contractAddress: form.contractAddress.trim(),
        abi: JSON.parse(form.abi),
      });
      const id = result?.project?._id || result?._id;
      router.push(id ? `/projects/${id}` : "/projects");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setApiError(e?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatAbi = () => {
    try {
      const parsed = JSON.parse(form.abi);
      setForm((prev) => ({ ...prev, abi: JSON.stringify(parsed, null, 2) }));
    } catch {
      // ignore
    }
  };

  return (
    <div className="text-zinc-100 font-mono">
      <div className="w-full px-6 py-6 font-mono">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-10">
          <Link href="/dashboard/projects" className="hover:text-white transition-colors">Projects</Link>
          <span className="text-zinc-800">/</span>
          <span className="text-zinc-400">Creation_Interface</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4 leading-none font-bold italic">
            Deployment Hub
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none italic">
            New Project
          </h1>
        </div>

        {/* API Error */}
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
              placeholder="e.g. Nexus Core Protocol"
              className="w-full bg-transparent text-white placeholder-zinc-800 text-lg font-bold border-0 outline-none p-0 focus:ring-0"
            />
            {errors.title && (
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-red-500/80">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="group relative border border-white/[0.04] bg-zinc-900/40 focus-within:bg-zinc-900/60 focus-within:border-white/[0.1] transition-all duration-300 p-8 rounded-2xl">
            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 leading-none">
              Overview <span className="text-zinc-800 ml-2">/ optional</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Briefly describe the purpose of this smart contract..."
              rows={3}
              className="w-full bg-transparent text-zinc-300 placeholder-zinc-800 text-sm font-medium border-0 outline-none p-0 focus:ring-0 resize-none leading-relaxed"
            />
          </div>

          {/* Contract Address */}
          <div className={`group relative border bg-zinc-900/40 focus-within:bg-zinc-900/60 transition-all duration-300 p-8 rounded-2xl ${errors.contractAddress ? "border-red-500/20" : "border-white/[0.04] focus-within:border-white/[0.1]"}`}>
            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4 leading-none">
              Mainnet Address <span className="text-zinc-800 ml-2">/ required</span>
            </label>
            <input
              type="text"
              value={form.contractAddress}
              onChange={(e) => handleChange("contractAddress", e.target.value)}
              placeholder="0x..."
              className="w-full bg-transparent text-zinc-400 placeholder-zinc-800 text-sm font-mono border-0 outline-none p-0 focus:ring-0 transition-colors focus:text-white"
            />
            {errors.contractAddress && (
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-red-500/80">{errors.contractAddress}</p>
            )}
          </div>

          {/* ABI */}
          <div className={`group relative border bg-zinc-900/40 focus-within:bg-zinc-900/60 transition-all duration-300 p-8 rounded-2xl ${errors.abi ? "border-red-500/20" : "border-white/[0.04] focus-within:border-white/[0.1]"}`}>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 leading-none">
                ABI Interface <span className="text-zinc-800 ml-2">/ required · valid_json</span>
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
              placeholder={`{\n  "interface": [...]\n}`}
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
            {submitting ? "Processing_Deployment..." : "Finalize_Registration"}
          </button>
          <Link
            href="/dashboard/projects"
            className="px-10 py-5 border border-white/[0.04] bg-zinc-900/20 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white hover:border-white/[0.1] transition-all rounded-xl"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}