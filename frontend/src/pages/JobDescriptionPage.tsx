import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Download,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  ChevronDown,
  Loader2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Star,
  Briefcase,
  X,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getApplicationsByJob,
  updateApplicationStatus,
  type JobApplication,
  type JobApplicationStatus,
} from "../service/jobApplication.service";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const ALL_STATUSES: JobApplicationStatus[] = [
  "Applied",
  "Reviewed",
  "Shortlisted",
  "Rejected",
  "Hired",
];

const STATUS_CONFIG: Record<
  JobApplicationStatus,
  { label: string; bg: string; text: string; border: string; dot: string; icon: React.ElementType }
> = {
  Applied: {
    label: "Applied",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-500",
    icon: Clock,
  },
  Reviewed: {
    label: "Reviewed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: Eye,
  },
  Shortlisted: {
    label: "Shortlisted",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: Star,
  },
  Rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    icon: XCircle,
  },
  Hired: {
    label: "Hired",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const formatDate = (val?: string | null) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const timeAgo = (val?: string | null) => {
  if (!val) return "—";
  const diff = Date.now() - new Date(val).getTime();
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(hours / 24);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(val);
};

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const AVATAR_PALETTE = [
  "bg-violet-200 text-violet-800",
  "bg-sky-200 text-sky-800",
  "bg-emerald-200 text-emerald-800",
  "bg-rose-200 text-rose-800",
  "bg-amber-200 text-amber-800",
  "bg-indigo-200 text-indigo-800",
];

const avatarColor = (id: string) =>
  AVATAR_PALETTE[
    id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PALETTE.length
  ];

/* ─────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────── */
const StatusBadge: React.FC<{ status: JobApplicationStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* ─────────────────────────────────────────
   STATUS DROPDOWN
───────────────────────────────────────── */
const StatusDropdown: React.FC<{
  current: JobApplicationStatus;
  onChange: (s: JobApplicationStatus) => void;
  loading: boolean;
}> = ({ current, onChange, loading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <StatusBadge status={current} />
        )}
        <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
          >
            {ALL_STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              return (
                <button
                  key={s}
                  onClick={() => { onChange(s); setOpen(false); }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-semibold transition hover:bg-gray-50 ${
                    s === current ? "bg-gray-50" : ""
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${cfg.text}`} />
                  <span className={cfg.text}>{cfg.label}</span>
                  {s === current && <CheckCircle2 className="ml-auto h-3 w-3 text-gray-400" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────
   APPLICANT DETAIL DRAWER
───────────────────────────────────────── */
const ApplicantDrawer: React.FC<{
  application: JobApplication | null;
  onClose: () => void;
  onStatusChange: (id: string, status: JobApplicationStatus) => void;
  updatingId: string | null;
}> = ({ application, onClose, onStatusChange, updatingId }) => {
  if (!application) return null;
  const app = application;
  const color = avatarColor(app.id);

  return (
    <AnimatePresence>
      {app && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-gray-900/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white px-6 pb-5 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${color}`}
                  >
                    {initials(app.fullName)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{app.fullName}</h2>
                    <p className="mt-0.5 text-sm text-gray-500">{app.email}</p>
                    {app.phone && (
                      <p className="text-sm text-gray-500">{app.phone}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Status updater */}
              <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Status</p>
                  <div className="mt-1">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
                <StatusDropdown
                  current={app.status}
                  onChange={(s) => onStatusChange(app.id, s)}
                  loading={updatingId === app.id}
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-5">
                {/* Applied for */}
                {app.job && (
                  <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Applied For</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {app.job.title || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app.job.companyName}
                          {app.job.location ? ` · ${app.job.location}` : ""}
                          {app.job.jobType ? ` · ${app.job.jobType}` : ""}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Contact */}
                <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Contact Info</p>
                  <div className="mt-3 space-y-2.5">
                    <a
                      href={`mailto:${app.email}`}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                      {app.email}
                      <ExternalLink className="ml-auto h-3.5 w-3.5 text-gray-300" />
                    </a>
                    {app.phone && (
                      <a
                        href={`tel:${app.phone}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                        {app.phone}
                        <ExternalLink className="ml-auto h-3.5 w-3.5 text-gray-300" />
                      </a>
                    )}
                  </div>
                </section>

                {/* Resume */}
                {app.resumeUrl && (
                  <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Resume</p>
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                    >
                      <FileText className="h-5 w-5 shrink-0" />
                      View Resume
                      <ExternalLink className="ml-auto h-4 w-4 text-blue-400" />
                    </a>
                  </section>
                )}

                {/* Cover Letter */}
                {app.coverLetter && (
                  <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cover Letter</p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                      {app.coverLetter}
                    </p>
                  </section>
                )}

                {/* Timeline */}
                <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Timeline</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-500">Applied on</span>
                      <span className="font-bold text-gray-800">{formatDate(app.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-500">Last updated</span>
                      <span className="font-bold text-gray-800">{formatDate(app.updatedAt)}</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              <a
                href={`mailto:${app.email}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                <Mail className="h-4 w-4" />
                Send Email
              </a>
              {app.resumeUrl && (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  iconColor: string;
  delay: number;
  active?: boolean;
  onClick?: () => void;
}> = ({ label, value, icon: Icon, accent, iconColor, delay, active, onClick }) => (
  <motion.button
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    onClick={onClick}
    className={`flex items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left shadow-sm transition ${
      active
        ? "border-blue-300 bg-blue-600 text-white shadow-blue-100"
        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
    }`}
  >
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white/20" : accent}`}
    >
      <Icon className={`h-4.5 w-4.5 ${active ? "text-white" : iconColor}`} />
    </div>
    <div>
      <p className={`text-xl font-black ${active ? "text-white" : "text-gray-900"}`}>
        {value}
      </p>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-blue-100" : "text-gray-400"}`}>
        {label}
      </p>
    </div>
  </motion.button>
);

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
const EmptyState: React.FC<{ filtered: boolean }> = ({ filtered }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
      <Users className="h-7 w-7 text-gray-400" />
    </div>
    <p className="mt-4 text-base font-bold text-gray-700">
      {filtered ? "No applicants match your filters" : "No applicants yet"}
    </p>
    <p className="mt-1 text-sm text-gray-400">
      {filtered
        ? "Try adjusting your search or status filter."
        : "Applicants will appear here once they apply for this role."}
    </p>
  </div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  /* ── State ── */
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | JobApplicationStatus>("All");

  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  /* ── Fetch ── */
  const fetchApplications = useCallback(async () => {
    if (!jobId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getApplicationsByJob(jobId);
      setApplications(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load applicants.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter((a) => a.status === "Applied").length,
    shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    hired: applications.filter((a) => a.status === "Hired").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  }), [applications]);

  /* ── Filtered list ── */
  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      const matchSearch =
        !q ||
        [a.fullName, a.email, a.phone, a.job?.title, a.job?.companyName]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q));
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, search, statusFilter]);

  /* ── Job info from first application ── */
  const jobInfo = applications[0]?.job;

  /* ── Status update ── */
  const handleStatusChange = async (id: string, status: JobApplicationStatus) => {
    try {
      setUpdatingId(id);
      const res = await updateApplicationStatus(id, { status });
      const updated = res?.data;
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: updated?.status ?? status } : a))
      );
      if (selectedApp?.id === id) {
        setSelectedApp((prev) => prev ? { ...prev, status: updated?.status ?? status } : prev);
      }
    } catch (err: any) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  /* ─── RENDER ─── */
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 font-sans text-gray-900">

      {/* ── TOP BAR ── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Jobs
          </button>
          {jobInfo && (
            <>
              <span className="text-gray-300">/</span>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-800">{jobInfo.title}</span>
                {jobInfo.companyName && (
                  <span className="text-sm text-gray-400">· {jobInfo.companyName}</span>
                )}
              </div>
            </>
          )}
        </div>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {/* ── MAIN SCROLL BODY ── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {/* Page heading */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900">Applicants</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Review, manage and update the status of all candidates.
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Total"
            value={stats.total}
            icon={Users}
            accent="bg-slate-100"
            iconColor="text-slate-600"
            delay={0.04}
            active={statusFilter === "All"}
            onClick={() => setStatusFilter("All")}
          />
          <StatCard
            label="Applied"
            value={stats.applied}
            icon={Clock}
            accent="bg-slate-100"
            iconColor="text-slate-600"
            delay={0.07}
            active={statusFilter === "Applied"}
            onClick={() => setStatusFilter("Applied")}
          />
          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            icon={Star}
            accent="bg-amber-50"
            iconColor="text-amber-600"
            delay={0.10}
            active={statusFilter === "Shortlisted"}
            onClick={() => setStatusFilter("Shortlisted")}
          />
          <StatCard
            label="Hired"
            value={stats.hired}
            icon={CheckCircle2}
            accent="bg-emerald-50"
            iconColor="text-emerald-600"
            delay={0.13}
            active={statusFilter === "Hired"}
            onClick={() => setStatusFilter("Hired")}
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={XCircle}
            accent="bg-red-50"
            iconColor="text-red-500"
            delay={0.16}
            active={statusFilter === "Rejected"}
            onClick={() => setStatusFilter("Rejected")}
          />
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button
              onClick={fetchApplications}
              className="ml-auto text-xs font-bold text-red-600 underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Table card ── */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Table toolbar */}
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Candidates</p>
              <p className="text-xs text-gray-400">
                {filteredApps.length} of {applications.length} applicant
                {applications.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email…"
                  className="h-9 w-52 rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              {/* Status filter */}
              <div className="relative flex items-center">
                <SlidersHorizontal className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-9 appearance-none rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-6 text-sm font-semibold text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All Status</option>
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["#", "Applicant", "Contact", "Applied For", "Applied On", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-24 text-center">
                      <div className="inline-flex flex-col items-center gap-3">
                        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
                        <p className="text-sm font-semibold text-gray-400">Loading applicants…</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState filtered={search.length > 0 || statusFilter !== "All"} />
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app, idx) => {
                    const color = avatarColor(app.id);
                    const isUpdating = updatingId === app.id;
                    return (
                      <motion.tr
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="group bg-white transition-colors hover:bg-blue-50/30"
                      >
                        {/* Index */}
                        <td className="px-5 py-4 text-sm font-semibold text-gray-400">
                          {idx + 1}.
                        </td>

                        {/* Applicant */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${color}`}
                            >
                              {initials(app.fullName)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{app.fullName}</p>
                              {app.applicant?.name && app.applicant.name !== app.fullName && (
                                <p className="text-xs text-gray-400">@{app.applicant.name}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <a
                                href={`mailto:${app.email}`}
                                className="hover:text-blue-600 hover:underline"
                              >
                                {app.email}
                              </a>
                            </div>
                            {app.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {app.phone}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Applied For */}
                        <td className="px-5 py-4">
                          {app.job ? (
                            <div>
                              <p className="font-semibold text-gray-800">
                                {app.job.title || "—"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {app.job.jobType}
                                {app.job.experienceLevel
                                  ? ` · ${app.job.experienceLevel}`
                                  : ""}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        {/* Applied On */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-700">
                            {timeAgo(app.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(app.createdAt)}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusDropdown
                            current={app.status}
                            onChange={(s) => handleStatusChange(app.id, s)}
                            loading={isUpdating}
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {/* View profile */}
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>

                            {/* Resume link */}
                            {app.resumeUrl ? (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                Resume
                              </a>
                            ) : (
                              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 text-xs font-semibold text-gray-300">
                                <FileText className="h-3.5 w-3.5" />
                                No Resume
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {!loading && filteredApps.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
              <p className="text-xs font-semibold text-gray-400">
                Showing {filteredApps.length} of {applications.length} applicants
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <TrendingUp className="h-3.5 w-3.5" />
                {stats.hired > 0
                  ? `${Math.round((stats.hired / stats.total) * 100)}% hire rate`
                  : "No hires yet"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── APPLICANT DETAIL DRAWER ── */}
      <ApplicantDrawer
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onStatusChange={handleStatusChange}
        updatingId={updatingId}
      />
    </div>
  );
};

export default JobApplicantsPage;