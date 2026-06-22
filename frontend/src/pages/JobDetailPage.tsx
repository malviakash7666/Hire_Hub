import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  X,
  FileText,
  Link,
  Upload,
  Trash2,

  Sparkles,
  Building2,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";
import { getSingleJobPost, type JobPost } from "../service/jobPost.service";
import { applyForJob, type ApplyForJobPayload } from "../service/jobApplication.service";

/* ─── Resume Upload Component ─────────────────────────────────────────────── */
type ResumeMode = "file" | "url";

interface ResumeUploaderProps {
  resumeUrl: string;
  onResumeUrlChange: (url: string) => void;
  resumeFile: File | null;
  onResumeFileChange: (file: File | null) => void;
  mode: ResumeMode;
  onModeChange: (mode: ResumeMode) => void;
}

const ResumeUploader = ({
  resumeUrl,
  onResumeUrlChange,
  resumeFile,
  onResumeFileChange,
  mode,
  onModeChange,
}: ResumeUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      alert("Only PDF or Word (.doc / .docx) files are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be smaller than 5 MB.");
      return;
    }
    onResumeFileChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">
        Resume
      </label>
      <div className="mb-3 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => { onModeChange("file"); onResumeUrlChange(""); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
            mode === "file" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Upload className="h-3 w-3" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => { onModeChange("url"); onResumeFileChange(null); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
            mode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Link className="h-3 w-3" /> Paste URL
        </button>
      </div>

      {mode === "file" ? (
        resumeFile ? (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">{resumeFile.name}</p>
              <p className="text-xs text-slate-400">{formatSize(resumeFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => { onResumeFileChange(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-all ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Upload className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-700">
                Drop your resume here or{" "}
                <span className="text-blue-600 underline underline-offset-2">browse</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-400">PDF, DOC, DOCX · Max 5 MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }}
            />
          </div>
        )
      ) : (
        <input
          type="url"
          value={resumeUrl}
          onChange={(e) => onResumeUrlChange(e.target.value)}
          placeholder="https://drive.google.com/file/..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      )}
    </div>
  );
};

/* ─── Apply Modal ─────────────────────────────────────────────────────────── */
interface ApplyModalProps {
  job: JobPost;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyModal = ({ job, onClose, onSuccess }: ApplyModalProps) => {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", coverLetter: "" });
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeMode, setResumeMode] = useState<ResumeMode>("file");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    setError(null);
    if (!form.fullName.trim() || !form.email.trim()) {
      setError("Full name and email are required.");
      return;
    }
    let resolvedResumeUrl: string | undefined;
    if (resumeMode === "file" && resumeFile) {
      try { resolvedResumeUrl = await fileToBase64(resumeFile); }
      catch { setError("Failed to process resume file. Please try again."); return; }
    } else if (resumeMode === "url" && resumeUrl.trim()) {
      resolvedResumeUrl = resumeUrl.trim();
    }

    const payload: ApplyForJobPayload = {
      jobId: job.id,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      ...(form.phone && { phone: form.phone.trim() }),
      ...(resolvedResumeUrl && { resumeUrl: resolvedResumeUrl }),
      ...(form.coverLetter && { coverLetter: form.coverLetter.trim() }),
    };

    try {
      setLoading(true);
      await applyForJob(payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ boxShadow: "0 25px 60px -10px rgba(0,0,0,0.25)" }}
      >
        {/* Gradient top bar */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed, #db2777)" }} />

        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900">{job.title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{job.companyName}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            {[
              { label: "Full name *", name: "fullName", type: "text", placeholder: "Your full name" },
              { label: "Email *", name: "email", type: "email", placeholder: "you@email.com" },
              { label: "Phone", name: "phone", type: "tel", placeholder: "+91 9876543210" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
            <ResumeUploader
              resumeUrl={resumeUrl}
              onResumeUrlChange={setResumeUrl}
              resumeFile={resumeFile}
              onResumeFileChange={setResumeFile}
              mode={resumeMode}
              onModeChange={setResumeMode}
            />
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-400">Cover letter</label>
              <textarea
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Brief note about yourself..."
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] rounded-xl py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #7c3aed)" }}
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Tag Badge ───────────────────────────────────────────────────────────── */
const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "blue" | "emerald" | "violet" | "amber" }) => {
  const styles = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};

/* ─── Section Block ───────────────────────────────────────────────────────── */
const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
    <div className="mb-4 flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-4 w-4 text-blue-600" />
      </div>
      <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">{title}</h2>
    </div>
    {children}
  </div>
);

/* ─── Animated Stat ───────────────────────────────────────────────────────── */
const StatPill = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center ${color}`}>
    <p className="text-lg font-black leading-none">{value}</p>
    <p className="mt-1 text-xs font-semibold opacity-70">{label}</p>
  </div>
);

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) { setError("Job ID not found"); setLoading(false); return; }
      try {
        setLoading(true);
        const data = await getSingleJobPost(jobId);
        setJob(data?.data || data);
        const appliedIds = JSON.parse(localStorage.getItem("appliedJobIds") || "[]");
        setApplied(appliedIds.includes(jobId));
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
        setTimeout(() => setMounted(true), 50);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleApplySuccess = () => {
    setApplied(true);
    const appliedIds = JSON.parse(localStorage.getItem("appliedJobIds") || "[]");
    if (!appliedIds.includes(jobId)) {
      appliedIds.push(jobId);
      localStorage.setItem("appliedJobIds", JSON.stringify(appliedIds));
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <div className="absolute inset-2 animate-ping rounded-full bg-blue-200 opacity-40" />
          </div>
          <p className="text-sm font-semibold text-slate-400">Loading job details…</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-4 flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-red-50">
            <X className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-base font-bold text-slate-700 mb-1">Oops, something went wrong</p>
          <p className="text-sm text-red-500 mb-5">{error || "Job not found"}</p>
          <button
            onClick={() => navigate("/jobseeker")}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const salaryLabel =
    job.salaryMin && job.salaryMax
      ? `₹${job.salaryMin.toLocaleString()} – ₹${job.salaryMax.toLocaleString()}`
      : job.salaryMin ? `From ₹${job.salaryMin.toLocaleString()}` : null;

  const deadline = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const initials = job.title.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("");

  const typeVariant: Record<string, "blue" | "violet" | "amber" | "emerald"> = {
    "Full-Time": "blue",
    "Part-Time": "amber",
    Internship: "emerald",
    Contract: "violet",
    Remote: "emerald",
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-slate-900"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.05s; }
        .delay-2 { transition-delay: 0.1s; }
        .delay-3 { transition-delay: 0.15s; }
        .delay-4 { transition-delay: 0.2s; }
        .delay-5 { transition-delay: 0.25s; }
      `}</style>

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <button
            onClick={() => navigate("/jobseeker")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Jobs
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Briefcase className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-black text-slate-900">Job Portal</span>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)",
        }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
          <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-10">
          {/* Breadcrumb */}
          <div className={`mb-5 flex items-center gap-1.5 text-xs text-blue-300 fade-up ${mounted ? "visible" : ""}`}>
            <span className="cursor-pointer hover:text-white transition" onClick={() => navigate("/jobseeker")}>Jobs</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-semibold">{job.title}</span>
          </div>

          <div className={`flex items-start gap-5 fade-up delay-1 ${mounted ? "visible" : ""}`}>
            {/* Company Logo Placeholder */}
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black shadow-lg"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "white" }}
            >
              {initials || "J"}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black text-white leading-tight">{job.title}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-blue-200">
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <Building2 className="h-3.5 w-3.5" />{job.companyName}
                </span>
                <span className="text-blue-400">·</span>
                <span className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3.5 w-3.5" />{job.location}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={typeVariant[job.jobType] ?? "default"}>{job.jobType}</Badge>
                <Badge variant="default">{job.experienceLevel}</Badge>
                {salaryLabel && <Badge variant="emerald">💰 {salaryLabel}</Badge>}
                {deadline && <Badge variant="amber">⏰ Closes {deadline}</Badge>}
              </div>
            </div>

            {/* CTA */}
            <div className="hidden md:block shrink-0">
              {applied ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" /> Applied
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="group flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl active:scale-95"
                  style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                >
                  <Zap className="h-4 w-4 group-hover:animate-pulse" />
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Quick stats row */}
          <div className={`mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 fade-up delay-2 ${mounted ? "visible" : ""}`}>
            <StatPill label="Job Type" value={job.jobType} color="border-blue-700/30 bg-blue-900/30 text-blue-200" />
            <StatPill label="Experience" value={job.experienceLevel} color="border-violet-700/30 bg-violet-900/30 text-violet-200" />
            {salaryLabel ? (
              <StatPill label="Salary" value={salaryLabel} color="border-emerald-700/30 bg-emerald-900/30 text-emerald-200" />
            ) : (
              <StatPill label="Salary" value="Negotiable" color="border-slate-700/30 bg-slate-900/30 text-slate-400" />
            )}
            {deadline ? (
              <StatPill label="Deadline" value={deadline} color="border-amber-700/30 bg-amber-900/30 text-amber-200" />
            ) : (
              <StatPill label="Deadline" value="Open" color="border-slate-700/30 bg-slate-900/30 text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Description */}
            {job.description && (
              <div className={`fade-up delay-2 ${mounted ? "visible" : ""}`}>
                <Section title="About this role" icon={Briefcase}>
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{job.description}</p>
                </Section>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className={`fade-up delay-3 ${mounted ? "visible" : ""}`}>
                <Section title="Responsibilities" icon={CheckCircle2}>
                  <div className="space-y-2">
                    {job.responsibilities.split("\n").filter(Boolean).map((line, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        <p className="text-sm leading-6 text-slate-600">{line.replace(/^[-•*]\s*/, "")}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className={`fade-up delay-4 ${mounted ? "visible" : ""}`}>
                <Section title="Requirements" icon={Star}>
                  <div className="space-y-2">
                    {job.requirements.split("\n").filter(Boolean).map((line, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                        <p className="text-sm leading-6 text-slate-600">{line.replace(/^[-•*]\s*/, "")}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className={`fade-up delay-5 ${mounted ? "visible" : ""}`}>
                <Section title="Required Skills" icon={Sparkles}>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="group relative rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-4">

            {/* Applied Banner */}
            {applied && (
              <div
                className={`rounded-2xl p-5 text-white fade-up delay-1 ${mounted ? "visible" : ""}`}
                style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-black">Application Sent!</p>
                </div>
                <p className="text-sm opacity-90">
                  We'll review your application and reach out soon.
                </p>
              </div>
            )}

            {/* Apply CTA */}
            {!applied && (
              <div className={`fade-up delay-1 ${mounted ? "visible" : ""}`}>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="group w-full rounded-2xl py-4 text-sm font-black text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl active:scale-95"
                  style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4 group-hover:animate-pulse" />
                    Apply for this Job
                  </span>
                </button>
                <p className="mt-2 text-center text-xs text-slate-400">Takes less than 2 minutes</p>
              </div>
            )}

            {/* Job Details Card */}
            <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm fade-up delay-2 ${mounted ? "visible" : ""}`}>
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Job Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Company</p>
                    <p className="text-sm font-bold text-slate-900">{job.companyName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                    <Users className="h-3.5 w-3.5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Experience Level</p>
                    <p className="text-sm font-bold text-slate-900">{job.experienceLevel}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Location</p>
                    <p className="text-sm font-bold text-slate-900">{job.location}</p>
                  </div>
                </div>
                {salaryLabel && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Salary</p>
                      <p className="text-sm font-bold text-emerald-700">{salaryLabel}</p>
                    </div>
                  </div>
                )}
                {deadline && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                      <Calendar className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Application Deadline</p>
                      <p className="text-sm font-bold text-slate-900">{deadline}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Share / Save card */}
            <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm fade-up delay-3 ${mounted ? "visible" : ""}`}>
              <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/jobseeker")}
                  className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Browse More Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showApplyModal && (
        <ApplyModal job={job} onClose={() => setShowApplyModal(false)} onSuccess={handleApplySuccess} />
      )}
    </div>
  );
};

export default JobDetailPage;