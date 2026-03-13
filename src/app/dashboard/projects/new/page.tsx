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
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 tracking-widest uppercase mb-10">
          <Link href="/dashboard/projects" className="hover:text-zinc-400 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-zinc-400">New</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase mb-3">Deploy</p>
          <h1 className="text-4xl font-bold text-white tracking-tight">NEW PROJECT</h1>
          <div className="mt-3 h-px w-16 bg-gradient-to-r from-white to-transparent" />
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-8 border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm flex justify-between items-center">
            <span>{apiError}</span>
            <button onClick={() => setApiError(null)} className="text-red-500 hover:text-red-300">✕</button>
          </div>
        )}

        <div className="space-y-0">
          {/* Title */}
          <div className="border border-zinc-800 bg-zinc-900/50 p-6">
            <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
              Title <span className="text-zinc-700">/ required</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="My Smart Contract Project"
              className="w-full bg-transparent text-white placeholder-zinc-700 text-sm border-0 outline-none focus:text-white"
            />
            {errors.title && (
              <p className="mt-2 text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="border border-t-0 border-zinc-800 bg-zinc-900/50 p-6">
            <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
              Description <span className="text-zinc-700">/ optional</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of this contract..."
              rows={3}
              className="w-full bg-transparent text-white placeholder-zinc-700 text-sm border-0 outline-none resize-none focus:text-white"
            />
          </div>

          {/* Contract Address */}
          <div className={`border border-t-0 bg-zinc-900/50 p-6 ${errors.contractAddress ? "border-red-500/30" : "border-zinc-800"}`}>
            <label className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
              Contract Address <span className="text-zinc-700">/ required</span>
            </label>
            <input
              type="text"
              value={form.contractAddress}
              onChange={(e) => handleChange("contractAddress", e.target.value)}
              placeholder="0x0000000000000000000000000000000000000000"
              className="w-full bg-transparent text-zinc-300 placeholder-zinc-700 text-sm border-0 outline-none focus:text-white font-mono"
            />
            {errors.contractAddress && (
              <p className="mt-2 text-xs text-red-400">{errors.contractAddress}</p>
            )}
          </div>

          {/* ABI */}
          <div className={`border border-t-0 bg-zinc-900/50 p-6 ${errors.abi ? "border-red-500/30" : "border-zinc-800"}`}>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] text-zinc-500 uppercase tracking-widest">
                ABI <span className="text-zinc-700">/ required · JSON</span>
              </label>
              <button
                type="button"
                onClick={formatAbi}
                className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
              >
                Format
              </button>
            </div>
            <textarea
              value={form.abi}
              onChange={(e) => handleChange("abi", e.target.value)}
              placeholder={`[\n  {\n    "type": "function",\n    "name": "...",\n    ...\n  }\n]`}
              rows={10}
              className="w-full bg-zinc-950/80 text-zinc-300 placeholder-zinc-800 text-xs border border-zinc-800 p-3 outline-none resize-y focus:border-zinc-600 transition-colors font-mono"
            />
            {errors.abi && (
              <p className="mt-2 text-xs text-red-400">{errors.abi}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Deploying..." : "Deploy Project"}
          </button>
          <Link
            href="/projects"
            className="px-6 py-3.5 border border-zinc-700 text-xs uppercase tracking-widest text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 transition-all text-center"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}