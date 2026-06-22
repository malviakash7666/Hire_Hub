import React, { useEffect, useState, useCallback } from "react";

import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  SlidersHorizontal,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  MoreVertical,
  FileText,
  Timer,
} from "lucide-react";
import { getPublicJobPosts } from "../../service/jobPost.service";
import type { JobPost, JobType, ExperienceLevel } from "../../service/jobPost.service";
import { getMe, type User } from "../../service/auth.service";
import { applyForJob } from "../../service/jobApplication.service";

/* ================= TYPES ================= */
type SortOption = "Most Recent" | "Oldest" | "Salary High" | "Salary Low";
type TabFilter = "All Jobs" | "Active" | "Draft" | "Expired";

interface Filters {
  keyword: string;
  location: string;
  jobTypes: JobType[];
  experienceLevels: ExperienceLevel[];
  salaryMin: string;
  salaryMax: string;
}

/* ================= CONSTANTS ================= */
const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "Full-Time", label: "Full Time" },
  { value: "Part-Time", label: "Part Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Remote", label: "Remote" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: "Fresher", label: "Fresher" },
  { value: "Junior", label: "1-3 Years" },
  { value: "Mid", label: "3-5 Years" },
  { value: "Senior", label: "5+ Years" },
];

const SORT_OPTIONS: SortOption[] = ["Most Recent", "Oldest", "Salary High", "Salary Low"];

/* ================= HELPERS ================= */
const formatSalary = (min?: number | null, max?: number | null): string => {
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return "Not disclosed";
};

const timeAgo = (date?: string): string => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

const formatDate = (date?: string): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ================= COMPANY LOGO ================= */
const companyColors = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
];

const CompanyLogo: React.FC<{ name: string; size?: "sm" | "md" }> = ({ name, size = "md" }) => {
  const idx = (name?.charCodeAt(0) ?? 0) % companyColors.length;
  const color = companyColors[idx];
  const dim = size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  return (
    <div className={`${dim} shrink-0 flex items-center justify-center rounded-xl font-bold ${color.bg} ${color.text}`}>
      {name?.slice(0, 2).toUpperCase() ?? "JB"}
    </div>
  );
};

/* ================= STATUS BADGE ================= */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    Open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Draft: "bg-amber-50 text-amber-700 border border-amber-200",
    Expired: "bg-red-50 text-red-600 border border-red-200",
    Closed: "bg-slate-100 text-slate-600 border border-slate-200",
    Paused: "bg-amber-50 text-amber-700 border border-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? styles.Draft}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

/* ================= APPLY MODAL ================= */
interface ApplyModalProps { job: JobPost; user: User | null; onClose: () => void; }

const ApplyModal: React.FC<ApplyModalProps> = ({ job, user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ fullName: user?.name || "", email: user?.email || "", phone: "", coverLetter: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await applyForJob({ jobId: job.id, ...formData, resumeUrl: resumeFile ? resumeFile.name : undefined });
      setSuccess(true);
      setTimeout(onClose, 2500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit application.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-1 bg-indigo-600 w-full" />
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <CompanyLogo name={job.companyName} size="sm" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
              <p className="text-xs text-slate-500">{job.companyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {success ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Application Sent!</h3>
              <p className="mt-2 text-sm text-slate-500">Your application for <span className="font-semibold text-slate-700">{job.title}</span> has been submitted.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Full Name", key: "fullName", type: "text", required: true, placeholder: "John Doe" },
                { label: "Email Address", key: "email", type: "email", required: true, placeholder: "john@example.com" },
                { label: "Phone Number", key: "phone", type: "tel", required: false, placeholder: "+1 (555) 000-0000" },
              ].map(({ label, key, type, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{label}{required ? <span className="text-red-500 ml-1">*</span> : <span className="text-slate-400 ml-1">(Optional)</span>}</label>
                  <input required={required} type={type} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition" placeholder={placeholder} value={(formData as any)[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Resume <span className="text-slate-400">(Optional)</span></label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 hover:border-indigo-400 hover:bg-indigo-50 transition">
                  <span>📎</span>
                  <span className="truncate">{resumeFile ? resumeFile.name : "Click to upload PDF or DOCX"}</span>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Letter <span className="text-slate-400">(Optional)</span></label>
                <textarea rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 transition resize-none" placeholder="Tell us why you're a great fit…" value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} />
              </div>
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span>
                </div>
              )}
              <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-70">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= JOB DETAIL MODAL ================= */
interface JobDetailModalProps { job: JobPost | null; saved: boolean; user: User | null; onToggleSave: (id: string) => void; onClose: () => void; onApply: () => void; }

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, saved, user, onToggleSave, onClose, onApply }) => {
  useEffect(() => {
    if (!job) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [job]);
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <CompanyLogo name={job.companyName} />
            <div>
              <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
              <p className="text-sm text-slate-500">{job.companyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onToggleSave(job.id)} className={`rounded-lg border p-2 transition ${saved ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-400 hover:border-slate-300"}`}>
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button onClick={onClose} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            {[{ icon: <Briefcase className="h-3.5 w-3.5" />, label: job.jobType }, { icon: <MapPin className="h-3.5 w-3.5" />, label: job.location }, { icon: <Clock className="h-3.5 w-3.5" />, label: job.experienceLevel }, { icon: <DollarSign className="h-3.5 w-3.5" />, label: formatSalary(job.salaryMin, job.salaryMax) }].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">{item.icon}{item.label}</span>
            ))}
          </div>
          {job.description && <div><h3 className="mb-2 text-sm font-semibold text-slate-800">About the Role</h3><p className="text-sm leading-6 text-slate-600 whitespace-pre-line">{job.description}</p></div>}
          {job.requirements && <div><h3 className="mb-2 text-sm font-semibold text-slate-800">Requirements</h3><p className="text-sm leading-6 text-slate-600 whitespace-pre-line">{job.requirements}</p></div>}
          {job.responsibilities && <div><h3 className="mb-2 text-sm font-semibold text-slate-800">Responsibilities</h3><p className="text-sm leading-6 text-slate-600 whitespace-pre-line">{job.responsibilities}</p></div>}
          {job.skills && job.skills.length > 0 && (
            <div><h3 className="mb-2 text-sm font-semibold text-slate-800">Skills Required</h3>
              <div className="flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">{skill}</span>)}</div>
            </div>
          )}
          <button onClick={onApply} className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">{user ? "Apply Now" : "Login to Apply"}</button>
        </div>
      </div>
    </div>
  );
};

/* ================= FILTER CHECKBOX ================= */
const FilterCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-2.5 py-1.5 group">
    <div onClick={onChange} className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${checked ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white group-hover:border-indigo-400"}`}>
      {checked && <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </div>
    <span className="text-sm text-slate-700">{label}</span>
  </label>
);

/* ================= MAIN PAGE ================= */
const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabFilter>("All Jobs");
  const [filters, setFilters] = useState<Filters>({ keyword: "", location: "", jobTypes: [], experienceLevels: [], salaryMin: "", salaryMax: "" });
  const [pendingFilters, setPendingFilters] = useState<Filters>({ ...filters });
  const [sortBy, setSortBy] = useState<SortOption>("Most Recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [applyJob, setApplyJob] = useState<JobPost | null>(null);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const LIMIT = 10;

  useEffect(() => {
    const checkAuth = async () => {
      try { const res = await getMe(); if (res.success) setUser(res.user); } catch { setUser(null); }
    };
    checkAuth();
  }, []);

  const fetchJobs = useCallback(async (f: Filters, sort: SortOption, p: number) => {
    try {
      setLoading(true); setError("");
      const sortMap: Record<SortOption, { sortBy: string; sortOrder: "ASC" | "DESC" }> = {
        "Most Recent": { sortBy: "createdAt", sortOrder: "DESC" },
        "Oldest": { sortBy: "createdAt", sortOrder: "ASC" },
        "Salary High": { sortBy: "salaryMax", sortOrder: "DESC" },
        "Salary Low": { sortBy: "salaryMin", sortOrder: "ASC" },
      };
      const res = await getPublicJobPosts({ search: f.keyword || undefined, location: f.location || undefined, jobType: f.jobTypes.length === 1 ? f.jobTypes[0] : undefined, experienceLevel: f.experienceLevels.length === 1 ? f.experienceLevels[0] : undefined, ...sortMap[sort], page: p, limit: LIMIT });
      const list: JobPost[] = Array.isArray(res?.data) ? res.data : [];
      setJobs(list); setTotal(res?.total ?? list.length);
    } catch (err: any) { setError(err?.response?.data?.message || "Failed to load jobs."); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(filters, sortBy, page); }, [filters, sortBy, page, fetchJobs]);

  // Tab filtering (client-side on loaded data)
  const filteredJobs = jobs.filter((j) => {
    if (activeTab === "All Jobs") return true;
    if (activeTab === "Active") return j.status === "Open";
    if (activeTab === "Draft") return j.status === "Paused";
    if (activeTab === "Expired") return j.status === "Closed";
    return true;
  });

  const tabCounts = { "All Jobs": jobs.length, "Active": jobs.filter(j => j.status === "Open").length, "Draft": jobs.filter(j => j.status === "Paused").length, "Expired": jobs.filter(j => j.status === "Closed").length };

  const applyFilters = () => { setFilters({ ...pendingFilters }); setPage(1); setMobileFiltersOpen(false); };
  const clearAllFilters = () => {
    const empty: Filters = { keyword: "", location: "", jobTypes: [], experienceLevels: [], salaryMin: "", salaryMax: "" };
    setPendingFilters(empty); setFilters(empty); setPage(1);
  };
  const toggleJobType = (val: JobType) => setPendingFilters(f => ({ ...f, jobTypes: f.jobTypes.includes(val) ? f.jobTypes.filter(t => t !== val) : [...f.jobTypes, val] }));
  const toggleExperience = (val: ExperienceLevel) => setPendingFilters(f => ({ ...f, experienceLevels: f.experienceLevels.includes(val) ? f.experienceLevels.filter(e => e !== val) : [...f.experienceLevels, val] }));
  const toggleSave = (id: string) => setSavedJobs(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const handleApplyClick = () => {
    if (!user) { window.location.href = "/login"; return; }
    const jobToApply = selectedJob;
    setSelectedJob(null);
    setApplyJob(jobToApply);
  };

  const totalPages = Math.ceil(total / LIMIT);

  // Stats from data
  const stats = [
    { icon: <Briefcase className="h-5 w-5 text-indigo-600" />, bg: "bg-indigo-50", value: total, label: "Total Jobs" },
    { icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: "bg-emerald-50", value: tabCounts["Active"], label: "Active Jobs" },
    { icon: <FileText className="h-5 w-5 text-amber-600" />, bg: "bg-amber-50", value: tabCounts["Draft"], label: "Draft Jobs" },
    { icon: <Timer className="h-5 w-5 text-red-500" />, bg: "bg-red-50", value: tabCounts["Expired"], label: "Expired Jobs" },
  ];

  const FilterSidebar = () => (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Filters</h2>
        <button onClick={clearAllFilters} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition">Clear All</button>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Keyword</p>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input type="text" value={pendingFilters.keyword} onChange={(e) => setPendingFilters(f => ({ ...f, keyword: e.target.value }))} placeholder="Search keywords..." className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Location</p>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input type="text" value={pendingFilters.location} onChange={(e) => setPendingFilters(f => ({ ...f, location: e.target.value }))} placeholder="City or remote" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50" />
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Job Type</p>
        {JOB_TYPES.map((jt) => <FilterCheckbox key={jt.value} label={jt.label} checked={pendingFilters.jobTypes.includes(jt.value)} onChange={() => toggleJobType(jt.value)} />)}
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Experience Level</p>
        {EXPERIENCE_LEVELS.map((el) => <FilterCheckbox key={el.value} label={el.label} checked={pendingFilters.experienceLevels.includes(el.value)} onChange={() => toggleExperience(el.value)} />)}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Salary Range</p>
        <div className="flex items-center gap-2">
          <input type="number" value={pendingFilters.salaryMin} onChange={(e) => setPendingFilters(f => ({ ...f, salaryMin: e.target.value }))} placeholder="Min" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-indigo-300" />
          <span className="shrink-0 text-xs text-slate-400">to</span>
          <input type="number" value={pendingFilters.salaryMax} onChange={(e) => setPendingFilters(f => ({ ...f, salaryMax: e.target.value }))} placeholder="Max" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-indigo-300" />
        </div>
      </div>
      <button onClick={applyFilters} className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">Apply Filters</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      

      <JobDetailModal job={selectedJob} user={user} saved={selectedJob ? savedJobs.has(selectedJob.id) : false} onToggleSave={toggleSave} onClose={() => setSelectedJob(null)} onApply={handleApplyClick} />
      {applyJob && <ApplyModal job={applyJob} user={user} onClose={() => setApplyJob(null)} />}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track all your job postings</p>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md" style={{ animationDelay: `${i * 60}ms` }}>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>{s.icon}</div>
                <div>
                  <p className="text-xl font-black text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Desktop */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filters */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-40 flex lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="relative ml-auto h-full w-80 overflow-y-auto bg-white p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)}><X className="h-5 w-5 text-slate-500" /></button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            {/* Tabs + Sort bar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Tabs */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 overflow-x-auto">
                {(["All Jobs", "Active", "Draft", "Expired"] as TabFilter[]).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${activeTab === tab ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}>
                    {tab}
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{tabCounts[tab]}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setMobileFiltersOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />Filters
                </button>
                <div className="relative">
                  <button onClick={() => setSortOpen(p => !p)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Sort by: <span className="font-semibold text-slate-900">{sortBy}</span><ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>
                  {sortOpen && (
                    <><div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                      <div className="absolute right-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        {SORT_OPTIONS.map((opt) => (
                          <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); setPage(1); }} className={`flex w-full px-4 py-2.5 text-sm transition hover:bg-slate-50 ${sortBy === opt ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-600"}`}>{opt}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Active Chips */}
            {(filters.jobTypes.length > 0 || filters.experienceLevels.length > 0 || filters.keyword || filters.location) && (
              <div className="mb-4 flex flex-wrap gap-2">
                {filters.keyword && <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">"{filters.keyword}"<button onClick={() => { setFilters(f => ({ ...f, keyword: "" })); setPendingFilters(f => ({ ...f, keyword: "" })); }}><X className="h-3 w-3" /></button></span>}
                {filters.location && <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">📍 {filters.location}<button onClick={() => { setFilters(f => ({ ...f, location: "" })); setPendingFilters(f => ({ ...f, location: "" })); }}><X className="h-3 w-3" /></button></span>}
                {filters.jobTypes.map(jt => <span key={jt} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{jt}<button onClick={() => { setFilters(f => ({ ...f, jobTypes: f.jobTypes.filter(t => t !== jt) })); setPendingFilters(f => ({ ...f, jobTypes: f.jobTypes.filter(t => t !== jt) })); }}><X className="h-3 w-3" /></button></span>)}
                {filters.experienceLevels.map(el => <span key={el} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{el}<button onClick={() => { setFilters(f => ({ ...f, experienceLevels: f.experienceLevels.filter(e => e !== el) })); setPendingFilters(f => ({ ...f, experienceLevels: f.experienceLevels.filter(e => e !== el) })); }}><X className="h-3 w-3" /></button></span>)}
              </div>
            )}

            {/* Table Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Search row inside table */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                <p className="text-sm font-medium text-slate-700"><span className="font-bold text-slate-900">{loading ? "…" : filteredJobs.length}</span> {filteredJobs.length === 1 ? "job" : "jobs"} found</p>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search your jobs..." value={pendingFilters.keyword} onChange={e => { setPendingFilters(f => ({ ...f, keyword: e.target.value })); setFilters(f => ({ ...f, keyword: e.target.value })); }} className="h-9 w-44 sm:w-56 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 transition" />
                </div>
              </div>

              {/* Table Header — Desktop */}
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span>Job Details</span>
                <span>Applicants</span>
                <span>Views</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {/* Rows */}
              {loading ? (
                <div className="space-y-0 divide-y divide-slate-100">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex animate-pulse gap-4 px-5 py-4">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />
                      <div className="flex-1 space-y-2"><div className="h-4 w-1/3 rounded bg-slate-200" /><div className="h-3 w-1/4 rounded bg-slate-200" /></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 m-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>
              ) : filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Briefcase className="h-12 w-12 text-slate-200 mb-4" />
                  <h3 className="text-base font-semibold text-slate-700">No jobs found</h3>
                  <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
                  <button onClick={clearAllFilters} className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition">Clear Filters</button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="group transition-colors hover:bg-slate-50/70">
                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-3.5">
                        {/* Job Details */}
                        <div className="flex items-center gap-3 min-w-0">
                          <CompanyLogo name={job.companyName} size="sm" />
                          <div className="min-w-0">
                            <button onClick={() => setSelectedJob(job)} className="text-sm font-semibold text-slate-900 hover:text-indigo-700 transition truncate block max-w-full text-left">{job.title}</button>
                            <p className="text-xs text-slate-500 truncate">{job.companyName} • {job.location}</p>
                          </div>
                        </div>
                        {/* Applicants — placeholder, real data would come from API */}
                        <span className="text-sm font-semibold text-slate-700">—</span>
                        {/* Views */}
                        <span className="text-sm font-semibold text-slate-700">—</span>
                        {/* Status */}
                        <StatusBadge status={job.status === "Open" ? "Active" : job.status === "Paused" ? "Draft" : "Expired"} />
                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-400 mr-2">{formatDate(job.createdAt)}</span>
                          <button onClick={() => setSelectedJob(job)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition">
                            <Eye className="h-3 w-3" />View
                          </button>
                          <button onClick={() => toggleSave(job.id)} className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${savedJobs.has(job.id) ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-400 hover:text-slate-600"}`}>
                            {savedJobs.has(job.id) ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 transition">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile row */}
                      <div className="flex sm:hidden items-start gap-3 px-4 py-3.5">
                        <CompanyLogo name={job.companyName} size="sm" />
                        <div className="flex-1 min-w-0">
                          <button onClick={() => setSelectedJob(job)} className="text-sm font-semibold text-slate-900 text-left truncate w-full">{job.title}</button>
                          <p className="text-xs text-slate-500">{job.companyName} • {job.location}</p>
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <StatusBadge status={job.status === "Open" ? "Active" : job.status === "Paused" ? "Draft" : "Expired"} />
                            <span className="text-xs text-slate-400">{timeAgo(job.createdAt)}</span>
                          </div>
                        </div>
                        <button onClick={() => setSelectedJob(job)} className="shrink-0 rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-100"><Eye className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
                  <p className="text-xs text-slate-500">Showing {((page - 1) * LIMIT) + 1} to {Math.min(page * LIMIT, total)} of {total} results</p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">‹</button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return <button key={pageNum} onClick={() => setPage(pageNum)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${page === pageNum ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{pageNum}</button>;
                    })}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">›</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
