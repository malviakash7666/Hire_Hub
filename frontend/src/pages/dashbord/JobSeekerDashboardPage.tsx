import { useEffect, useState, useCallback, useRef } from "react";
import {
  getPublicJobPosts,
  type JobPost,
  type GetJobsParams,
} from "../../service/jobPost.service";
import {
  applyForJob,
  type ApplyForJobPayload,
} from "../../service/jobApplication.service";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Briefcase,
  LayoutDashboard,
  ClipboardList,
  Bookmark,
  User,
  FileText,
  Settings,
  LogOut,
  Bell,
  X,
  Upload,
  Trash2,
  Link,
  Calendar,
  Heart,
  Gift,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────── */
type ResumeMode = "file" | "url";

/* ─── Helpers ───────────────────────────────────── */
const CARD_COLORS = [
  { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
  { bg: "bg-teal-50",   text: "text-teal-600",   border: "border-teal-100" },
  { bg: "bg-rose-50",   text: "text-rose-600",   border: "border-rose-100" },
  { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-100" },
  { bg: "bg-sky-50",    text: "text-sky-600",    border: "border-sky-100" },
];

const getColor = (seed: string) =>
  CARD_COLORS[(seed?.charCodeAt(0) ?? 0) % CARD_COLORS.length];

const getInitials = (title: string) =>
  title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  Applied:     { label: "Applied",      className: "bg-blue-50 text-blue-600 border border-blue-100" },
  Reviewed:    { label: "Under Review", className: "bg-amber-50 text-amber-600 border border-amber-100" },
  Shortlisted: { label: "Shortlisted",  className: "bg-teal-50 text-teal-600 border border-teal-100" },
  Interview:   { label: "Interview",    className: "bg-violet-50 text-violet-600 border border-violet-100" },
  Rejected:    { label: "Rejected",     className: "bg-red-50 text-red-600 border border-red-100" },
  Hired:       { label: "Hired",        className: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
};

/* ─── Resume Uploader ───────────────────────────── */
interface ResumeUploaderProps {
  resumeUrl: string;
  onResumeUrlChange: (url: string) => void;
  resumeFile: File | null;
  onResumeFileChange: (file: File | null) => void;
  mode: ResumeMode;
  onModeChange: (mode: ResumeMode) => void;
}

const ResumeUploader = ({
  resumeUrl, onResumeUrlChange, resumeFile, onResumeFileChange, mode, onModeChange,
}: ResumeUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    const allowed = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) { alert("Only PDF or Word files are supported."); return; }
    if (file.size > 5 * 1024 * 1024) { alert("File must be smaller than 5 MB."); return; }
    onResumeFileChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragOver(false);
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
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Resume</label>
      <div className="mb-3 flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button type="button" onClick={() => { onModeChange("file"); onResumeUrlChange(""); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${mode === "file" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
          <Upload className="h-3 w-3" /> Upload File
        </button>
        <button type="button" onClick={() => { onModeChange("url"); onResumeFileChange(null); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all ${mode === "url" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
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
              <p className="truncate text-xs font-semibold text-slate-800">{resumeFile.name}</p>
              <p className="text-xs text-slate-400">{formatSize(resumeFile.size)}</p>
            </div>
            <button type="button"
              onClick={() => { onResumeFileChange(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-all ${dragOver ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <Upload className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-700">Drop your resume here or <span className="text-indigo-600 underline underline-offset-2">browse</span></p>
              <p className="mt-0.5 text-xs text-slate-400">PDF, DOC, DOCX · Max 5 MB</p>
            </div>
            <input ref={fileInputRef} type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }} />
          </div>
        )
      ) : (
        <input type="url" value={resumeUrl} onChange={(e) => onResumeUrlChange(e.target.value)}
          placeholder="https://drive.google.com/file/..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-50" />
      )}
    </div>
  );
};

/* ─── Apply Modal ───────────────────────────────── */
interface ApplyModalProps {
  job: JobPost;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
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
    if (!form.fullName.trim() || !form.email.trim()) { setError("Full name and email are required."); return; }
    let resolvedResumeUrl: string | undefined;
    if (resumeMode === "file" && resumeFile) {
      try { resolvedResumeUrl = await fileToBase64(resumeFile); }
      catch { setError("Failed to process resume file."); return; }
    } else if (resumeMode === "url" && resumeUrl.trim()) {
      resolvedResumeUrl = resumeUrl.trim();
    }
    const payload: ApplyForJobPayload = {
      jobId: job.id, fullName: form.fullName.trim(), email: form.email.trim(),
      ...(form.phone && { phone: form.phone.trim() }),
      ...(resolvedResumeUrl && { resumeUrl: resolvedResumeUrl }),
      ...(form.coverLetter && { coverLetter: form.coverLetter.trim() }),
    };
    try {
      setLoading(true);
      await applyForJob(payload);
      onSuccess(job.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{job.companyName}</p>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}
            {[
              { label: "Full name *", name: "fullName", type: "text", placeholder: "Your full name" },
              { label: "Email *", name: "email", type: "email", placeholder: "you@email.com" },
              { label: "Phone", name: "phone", type: "tel", placeholder: "+91 9876543210" },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
                <input name={name} type={type} value={form[name as keyof typeof form]} onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-50" />
              </div>
            ))}
            <ResumeUploader resumeUrl={resumeUrl} onResumeUrlChange={setResumeUrl}
              resumeFile={resumeFile} onResumeFileChange={setResumeFile} mode={resumeMode} onModeChange={setResumeMode} />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Cover letter</label>
              <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange}
                placeholder="Brief note about yourself..." rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-50" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-[2] rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────── */
const JobSeekerDashboardPage = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [appliedIds, setAppliedIds] = useState<Set<string>>(
    () => new Set(JSON.parse(localStorage.getItem("appliedJobIds") || "[]"))
  );
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobPost | null>(null);

  const isJobsPage = location.pathname === "/jobs";

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetJobsParams = { page: 1, limit: 50 };
      const data = await getPublicJobPosts(params);
      const list: JobPost[] = Array.isArray(data) ? data : data.data ?? data.jobs ?? [];
      setJobs(list);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const userName = (user as any)?.name || (user as any)?.fullName || "User";
  const firstName = userName.split(" ")[0];
  const userInitial = firstName.charAt(0).toUpperCase();
  const appliedJobs = jobs.filter((j) => appliedIds.has(j.id));

  /* ── Sidebar nav config ── */
  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard",       path: "/dashboard",              exact: true },
    { icon: ClipboardList,   label: "My Applications", path: "/dashboard/applications", exact: false },
    { icon: Bookmark,        label: "Saved Jobs",      path: "/dashboard/saved",        exact: false },
    { icon: User,            label: "Profile",         path: "/dashboard/profile",      exact: false },
    { icon: FileText,        label: "Resume",          path: "/dashboard/resume",       exact: false },
    { icon: Settings,        label: "Settings",        path: "/dashboard/settings",     exact: false },
  ];

  const isNavActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6fa] font-sans text-slate-900">

      {/* ══ SIDEBAR ══ */}
      <aside className="flex w-52 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5">
        {/* Logo */}
        <div className="mb-7 flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">JobPortal</span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label, path, exact }) => {
            const active = isNavActive(path, exact);
            return (
              <button key={path} onClick={() => navigate(path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-indigo-50 font-semibold text-indigo-700"
                    : "font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}>
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                {label}
              </button>
            );
          })}

          {/* Job Postings → /jobs page */}
          <button
            onClick={() => navigate("/jobs")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
              isJobsPage
                ? "bg-indigo-50 font-semibold text-indigo-700"
                : "font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}>
            <ClipboardList className={`h-4 w-4 shrink-0 ${isJobsPage ? "text-indigo-600" : "text-slate-400"}`} />
            Job Postings
          </button>
        </nav>

        {/* Logout */}
        <div className="mt-auto border-t border-slate-100 pt-4">
          <button
            onClick={async () => { try { await logout(); } finally { navigate("/login"); } }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-500">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar — minimal, just icons */}
        <header className="flex h-14 shrink-0 items-center justify-end border-b border-slate-200 bg-white px-6 gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700 border border-indigo-100">
            {userInitial}
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7">

          {/* Welcome heading */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {firstName}! 👋</h1>
            <p className="mt-1 text-sm text-slate-500">Here's what's happening with your job search</p>
          </div>

          {/* ── Stats row ── */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Briefcase, label: "Applications", value: appliedIds.size, bg: "bg-indigo-50",  iconColor: "text-indigo-500",  border: "border-indigo-100" },
              { icon: Calendar,  label: "Interviews",   value: 0,               bg: "bg-teal-50",    iconColor: "text-teal-500",    border: "border-teal-100" },
              { icon: Heart,     label: "Shortlisted",  value: 0,               bg: "bg-emerald-50", iconColor: "text-emerald-500", border: "border-emerald-100" },
              { icon: Gift,      label: "Offers",       value: 0,               bg: "bg-violet-50",  iconColor: "text-violet-500",  border: "border-violet-100" },
            ].map(({ icon: Icon, label, value, bg, iconColor, border }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${bg} ${border}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none text-slate-900">{value}</p>
                  <p className="mt-1 text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Two-column section ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Recent Applications (2/3) */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-900">Recent Applications</h2>
                  <button
                    onClick={() => navigate("/jobs")}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">
                    View All <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-px p-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl p-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 w-1/3 rounded bg-slate-200" />
                          <div className="h-3 w-1/4 rounded bg-slate-200" />
                        </div>
                        <div className="h-6 w-24 rounded-full bg-slate-200" />
                      </div>
                    ))}
                  </div>
                ) : appliedJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Briefcase className="h-5 w-5 text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No applications yet</p>
                    <p className="mt-1 text-xs text-slate-400">Apply to jobs to track them here</p>
                    <button onClick={() => navigate("/jobs")}
                      className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition">
                      Browse Jobs
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {appliedJobs.slice(0, 6).map((job) => {
                      const color = getColor(job.companyName);
                      const statusCfg = STATUS_CONFIG["Applied"];
                      return (
                        <div key={job.id}
                          className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${color.bg} ${color.border} ${color.text}`}>
                            {getInitials(job.title) || "J"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">{job.title}</p>
                            <p className="truncate text-xs text-slate-400">{job.companyName}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.className}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions (1/3) */}
            <div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
                </div>
                <div className="p-3 space-y-1">
                  {[
                    {
                      icon: Briefcase, bg: "bg-indigo-50", border: "border-indigo-100", iconColor: "text-indigo-600",
                      title: "Browse Jobs", desc: "Find new opportunities",
                      action: () => navigate("/jobs"),
                    },
                    {
                      icon: User, bg: "bg-teal-50", border: "border-teal-100", iconColor: "text-teal-600",
                      title: "Update Profile", desc: "Keep your profile updated",
                      action: () => navigate("/dashboard/profile"),
                    },
                    {
                      icon: Upload, bg: "bg-violet-50", border: "border-violet-100", iconColor: "text-violet-600",
                      title: "Upload Resume", desc: "Upload your latest resume",
                      action: () => navigate("/dashboard/resume"),
                    },
                  ].map(({ icon: Icon, bg, border, iconColor, title, desc, action }) => (
                    <button key={title} onClick={action}
                      className="group flex w-full items-center gap-4 rounded-xl p-3.5 text-left transition hover:bg-slate-50">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${bg} ${border}`}>
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">{title}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={(jobId) => {
            setAppliedIds((prev) => {
              const updated = new Set(prev);
              updated.add(jobId);
              localStorage.setItem("appliedJobIds", JSON.stringify(Array.from(updated)));
              return updated;
            });
          }}
        />
      )}
    </div>
  );
};

export default JobSeekerDashboardPage;