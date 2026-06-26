import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Search, Plus, MapPin, Filter, Pencil, Loader2, Users,
  X, Clock3, ClipboardList, UserCheck,
  Bell, ChevronDown, Trash2, AlertTriangle, Star, FileText, ChevronRight,
  ChevronLeft, Calendar,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  getAllJobPosts, getMyJobPosts, createJobPost, updateJobPost, deleteJobPost,
  bulkImportJobPosts,
  type JobPost, type JobStatus, type JobType, type ExperienceLevel,
  type CreateJobPostPayload, type UpdateJobPostPayload,
} from "../../service/jobPost.service";
import {
  getAllApplications, type JobApplication,
} from "../../service/jobApplication.service"; // ← import your real service
import { useNavigate } from "react-router-dom";

/* ─── TYPES ─── */
type ModalMode = "create" | "edit";

/* ─── HELPERS ─── */
const modalTransition: any = { type: "spring", damping: 32, stiffness: 280 };

const timeAgo = (value?: string | null): string => {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

const getStatusClasses = (status?: JobStatus) => {
  switch (status) {
    case "Open":   return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Paused": return "bg-amber-100 text-amber-700 border border-amber-200";
    case "Closed": return "bg-red-100 text-red-600 border border-red-200";
    default:       return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};



const JobTypeIcon: React.FC<{ type?: string }> = ({ type }) => {
  const base = "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white";
  switch (type) {
    case "Full-Time":  return <div className={`${base} bg-blue-500`}><Briefcase className="h-4 w-4" /></div>;
    case "Part-Time":  return <div className={`${base} bg-violet-500`}><Clock3 className="h-4 w-4" /></div>;
    case "Internship": return <div className={`${base} bg-amber-500`}><FileText className="h-4 w-4" /></div>;
    case "Contract":   return <div className={`${base} bg-teal-500`}><ClipboardList className="h-4 w-4" /></div>;
    case "Remote":     return <div className={`${base} bg-pink-500`}><MapPin className="h-4 w-4" /></div>;
    default:           return <div className={`${base} bg-red-400`}><Briefcase className="h-4 w-4" /></div>;
  }
};

/* ─── FORM STATE ─── */
interface JobFormState {
  title: string; description: string; companyName: string; location: string;
  jobType: JobType; experienceLevel: ExperienceLevel;
  salaryMin: string; salaryMax: string; skills: string;
  requirements: string; responsibilities: string; deadline: string; status: JobStatus;
}

const defaultJobForm: JobFormState = {
  title: "", description: "", companyName: "", location: "",
  jobType: "Full-Time", experienceLevel: "Fresher",
  salaryMin: "", salaryMax: "", skills: "", requirements: "",
  responsibilities: "", deadline: "", status: "Open",
};

const jobFromPost = (job: JobPost): JobFormState => ({
  title: job.title || "", description: job.description || "",
  companyName: job.companyName || "", location: job.location || "",
  jobType: job.jobType || "Full-Time", experienceLevel: job.experienceLevel || "Fresher",
  salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
  salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
  skills: (job.skills || []).join(", "),
  requirements: job.requirements || "", responsibilities: job.responsibilities || "",
  deadline: job.deadline ? job.deadline.substring(0, 10) : "",
  status: job.status || "Open",
});

/* ─── FIELD WRAPPER ─── */
const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; hint?: string }> = ({ label, required, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
      {label}{required && <span className="ml-1 text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const inputCls = "h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";
const textareaCls = "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none";
const selectCls = "h-10 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";



/* ─── DELETE MODAL ─── */
const DeleteConfirmModal: React.FC<{ job: JobPost; onConfirm: () => void; onCancel: () => void; isDeleting: boolean }> = ({ job, onConfirm, onCancel, isDeleting }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onCancel} className="fixed inset-0 z-[80] bg-gray-900/40 backdrop-blur-sm" />
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={modalTransition} onClick={e => e.stopPropagation()} className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="h-1 w-full bg-red-500" />
        <div className="px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
            <div>
              <h2 className="text-base font-black text-gray-900">Delete Job Posting</h2>
              <p className="mt-1 text-sm text-gray-500">Are you sure you want to delete <span className="font-bold text-gray-800">"{job.title}"</span>? This action cannot be undone.</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button onClick={onConfirm} disabled={isDeleting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60">
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
          <button onClick={onCancel} disabled={isDeleting} className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60">Cancel</button>
        </div>
      </motion.div>
    </div>
  </>
);

/* ─── MAIN PAGE ─── */
const MyJobsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = (user as any)?.role === "admin";

  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | JobStatus>("All");
  const [deleteModalJob, setDeleteModalJob] = useState<JobPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<ModalMode>("create");
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [jobForm, setJobForm] = useState<JobFormState>(defaultJobForm);
  const [jobFormErrors, setJobFormErrors] = useState<Partial<Record<keyof JobFormState, string>>>({});
  const [jobFormSubmitting, setJobFormSubmitting] = useState(false);
  const [jobFormError, setJobFormError] = useState<string | null>(null);
  const [applicantsLoadingRowId, setApplicantsLoadingRowId] = useState<string | null>(null);



  // ── CSV Bulk Import States & Handlers ──
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvDataText, setCsvDataText] = useState<string>("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setImportError("Please select a valid CSV file.");
      setCsvFile(null);
      return;
    }

    setCsvFile(file);
    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setCsvDataText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = async () => {
    if (!csvDataText) {
      setImportError("No CSV content loaded.");
      return;
    }

    setImporting(true);
    setImportError(null);
    setImportSuccess(null);

    try {
      const response = await bulkImportJobPosts(csvDataText);
      setImportSuccess(response.message || "Jobs imported successfully!");
      setCsvFile(null);
      setCsvDataText("");
      await loadJobs();
    } catch (err: any) {
      setImportError(err.response?.data?.message || err.message || "Failed to import jobs.");
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCSV = () => {
    const headers = "title,description,companyName,location,jobType,experienceLevel,salaryMin,salaryMax,skills,requirements,responsibilities,deadline,status";
    const sampleRow = "Senior React Developer,Build amazing user interfaces,Acme Corp,\"Mumbai, Remote\",Full-Time,Senior,1200000,1800000,\"React, TypeScript, Redux\",\"5+ years React, TypeScript experience\",\"Develop features, Mentoring, Code reviews\",2026-12-31,Open";
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + "\n" + sampleRow);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "job_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ── Loaders ── */
  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search: search || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
      };
      const res = isAdmin ? await getAllJobPosts(params) : await getMyJobPosts(params);
      const list = Array.isArray(res?.data) ? res.data : [];
      setJobs(list);
      setTotal(res?.total ?? list.length);
    } catch (err) {
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    loadJobs();
  }, [page, limit, search, statusFilter]);



  // Reset page when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  /* ── Derived stats ── */
  const stats = useMemo(() => ({
    active: jobs.filter(j => j.status === "Open").length,
    shortlisted: jobs.filter(j => j.status === "Paused").length,
    hired: jobs.filter(j => j.status === "Closed").length,
    total: jobs.length,
  }), [jobs]);



  /* ── Handlers ── */
  const handleDeleteConfirm = async () => {
    if (!deleteModalJob) return;
    setIsDeleting(true);
    try { await deleteJobPost(deleteModalJob.id); await loadJobs(); setDeleteModalJob(null); }
    catch (err) { console.error(err); } finally { setIsDeleting(false); }
  };

  const setJobField = <K extends keyof JobFormState>(key: K, value: JobFormState[K]) => {
    setJobForm(p => ({ ...p, [key]: value }));
    if (jobFormErrors[key]) setJobFormErrors(p => ({ ...p, [key]: undefined }));
  };

  const validateJobForm = (): boolean => {
    const e: Partial<Record<keyof JobFormState, string>> = {};
    if (!jobForm.title.trim()) e.title = "Title is required";
    if (!jobForm.description.trim()) e.description = "Description is required";
    if (!jobForm.companyName.trim()) e.companyName = "Company name is required";
    if (!jobForm.location.trim()) e.location = "Location is required";
    if (jobForm.salaryMin && isNaN(Number(jobForm.salaryMin))) e.salaryMin = "Must be a number";
    if (jobForm.salaryMax && isNaN(Number(jobForm.salaryMax))) e.salaryMax = "Must be a number";
    setJobFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildJobPayload = (): CreateJobPostPayload => ({
    title: jobForm.title.trim(), description: jobForm.description.trim(),
    companyName: jobForm.companyName.trim(), location: jobForm.location.trim(),
    jobType: jobForm.jobType, experienceLevel: jobForm.experienceLevel,
    salaryMin: jobForm.salaryMin ? Number(jobForm.salaryMin) : null,
    salaryMax: jobForm.salaryMax ? Number(jobForm.salaryMax) : null,
    skills: jobForm.skills ? jobForm.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
    requirements: jobForm.requirements.trim() || undefined,
    responsibilities: jobForm.responsibilities.trim() || undefined,
    deadline: jobForm.deadline || undefined,
    status: jobForm.status,
  });

  const handleJobFormSubmit = async () => {
    if (!validateJobForm()) return;
    setJobFormSubmitting(true); setJobFormError(null);
    try {
      const payload = buildJobPayload();
      if (formModalMode === "create") await createJobPost(payload);
      else if (editingJob) await updateJobPost(editingJob.id, payload as UpdateJobPostPayload);
      await loadJobs(); closeJobFormModal();
    } catch (err: any) { setJobFormError(err?.response?.data?.message || err?.message || "Something went wrong."); }
    finally { setJobFormSubmitting(false); }
  };

  const openCreateModal  = () => { setFormModalMode("create"); setEditingJob(null); setJobForm(defaultJobForm); setJobFormErrors({}); setJobFormError(null); setFormModalOpen(true); };
  const openEditModal    = (job: JobPost) => { setFormModalMode("edit"); setEditingJob(job); setJobForm(jobFromPost(job)); setJobFormErrors({}); setJobFormError(null); setFormModalOpen(true); };
  const closeJobFormModal = () => { setFormModalOpen(false); setTimeout(() => { setEditingJob(null); setJobFormError(null); }, 260); };
  const handleOpenApplicantsPage = (job: JobPost) => { setApplicantsLoadingRowId(job.id); navigate(`/dashboard/jobs/${job.id}`); };

  /* ── User-derived display values (fully dynamic) ── */
  const displayName  = (user as any)?.companyName || (user as any)?.name || "";
  const userInitial  = displayName.charAt(0).toUpperCase() || "?";





  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-white px-4 sm:px-5">
          <div className="flex-1" />
          <button className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white" />
          </button>
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">{userInitial}</div>
            {displayName && <span className="hidden sm:inline">{displayName}</span>}
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Centre scroll area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-6">

            {/* Header & Controls */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  My Jobs
                </h1>
                <p className="mt-0.5 text-sm text-gray-400">Manage and view all your posted roles.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setImportModalOpen(true);
                    setImportError(null);
                    setImportSuccess(null);
                    setCsvFile(null);
                    setCsvDataText("");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <FileText className="h-4 w-4 text-gray-500" />
                  Import CSV
                </button>
                <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 w-fit">
                  <Plus className="h-4 w-4" />Post New Job
                </button>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 px-6 py-4 gap-4 bg-gray-50/50">
                <div>
                  <p className="text-base font-black text-gray-900">All Jobs</p>
                  <p className="text-xs text-gray-500 mt-0.5">Showing {jobs.length} of {total} roles</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title…" className="h-8 w-36 sm:w-40 rounded-lg border border-gray-200 bg-gray-50 pl-7 pr-3 text-xs outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                  </div>
                  <div className="relative flex items-center">
                    <Filter className="pointer-events-none absolute left-2.5 h-3 w-3 text-gray-400" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="h-8 appearance-none rounded-lg border border-gray-200 bg-gray-50 pl-7 pr-5 text-xs font-semibold text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                      <option value="All">All</option>
                      <option value="Open">Open</option>
                      <option value="Paused">Paused</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /><p className="text-sm font-semibold text-gray-400">Loading jobs…</p></div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400"><Briefcase className="h-6 w-6" /></div>
                  <p className="text-sm font-bold text-gray-700">No roles found</p>
                  <p className="text-xs text-gray-400">Try adjusting filters, or <button onClick={openCreateModal} className="font-semibold text-blue-600 underline underline-offset-2">post a new role</button>.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {jobs.map((job, idx) => (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="group flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 transition-all hover:bg-blue-50/20">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <JobTypeIcon type={job.jobType} />
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-400" /> {job.location || "Remote"}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-gray-400" /> {timeAgo(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:gap-6 ml-13 sm:ml-0">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ${getStatusClasses(job.status)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          {job.status === "Open" ? "Active" : job.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenApplicantsPage(job)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                            {applicantsLoadingRowId === job.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Users className="h-3.5 w-3.5" />}
                            <span>Applicants</span>
                          </button>
                          <button onClick={() => openEditModal(job)} title="Edit" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"><Pencil className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setDeleteModalJob(job)} title="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {total > limit && (
                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                  <p className="text-xs font-medium text-gray-500">
                    Showing <span className="font-bold text-gray-900">{(page - 1) * limit + 1}</span> to <span className="font-bold text-gray-900">{Math.min(page * limit, total)}</span> of <span className="font-bold text-gray-900">{total}</span> roles
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
                      disabled={page >= Math.ceil(total / limit)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}


            </div>
          </div>


        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalJob && <DeleteConfirmModal job={deleteModalJob} onConfirm={handleDeleteConfirm} onCancel={() => !isDeleting && setDeleteModalJob(null)} isDeleting={isDeleting} />}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {formModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={closeJobFormModal} className="fixed inset-0 z-[80] bg-gray-900/40 backdrop-blur-sm" />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 lg:p-10">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 10 }} transition={modalTransition} onClick={e => e.stopPropagation()} className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                <div className="h-1 w-full bg-blue-600" />
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">{formModalMode === "create" ? <Plus className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}</div>
                      <div>
                        <h2 className="text-lg font-black text-gray-900">{formModalMode === "create" ? "Post a New Role" : `Edit: ${editingJob?.title || "Role"}`}</h2>
                        <p className="text-sm text-gray-400">{formModalMode === "create" ? "Fill in the details to publish a new job listing." : "Update the role details and save your changes."}</p>
                      </div>
                    </div>
                    <button onClick={closeJobFormModal} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Job Title" required>
                        <input type="text" value={jobForm.title} onChange={e => setJobField("title", e.target.value)} placeholder="e.g. Senior Frontend Engineer" className={`${inputCls} ${jobFormErrors.title ? "border-red-300" : ""}`} />
                        {jobFormErrors.title && <p className="mt-1 text-xs text-red-500">{jobFormErrors.title}</p>}
                      </Field>
                    </div>
                    <Field label="Company Name" required>
                      <input type="text" value={jobForm.companyName} onChange={e => setJobField("companyName", e.target.value)} placeholder="e.g. Acme Corp" className={`${inputCls} ${jobFormErrors.companyName ? "border-red-300" : ""}`} />
                      {jobFormErrors.companyName && <p className="mt-1 text-xs text-red-500">{jobFormErrors.companyName}</p>}
                    </Field>
                    <Field label="Location" required>
                      <input type="text" value={jobForm.location} onChange={e => setJobField("location", e.target.value)} placeholder="e.g. Mumbai, Remote" className={`${inputCls} ${jobFormErrors.location ? "border-red-300" : ""}`} />
                      {jobFormErrors.location && <p className="mt-1 text-xs text-red-500">{jobFormErrors.location}</p>}
                    </Field>
                    <Field label="Job Type">
                      <select value={jobForm.jobType} onChange={e => setJobField("jobType", e.target.value as JobType)} className={selectCls}>
                        {(["Full-Time", "Part-Time", "Internship", "Contract", "Remote"] as JobType[]).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Experience Level">
                      <select value={jobForm.experienceLevel} onChange={e => setJobField("experienceLevel", e.target.value as ExperienceLevel)} className={selectCls}>
                        {(["Fresher", "Junior", "Mid", "Senior"] as ExperienceLevel[]).map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Salary Min (₹)" hint="Leave blank to hide">
                      <input type="number" value={jobForm.salaryMin} onChange={e => setJobField("salaryMin", e.target.value)} placeholder="e.g. 500000" className={`${inputCls} ${jobFormErrors.salaryMin ? "border-red-300" : ""}`} />
                      {jobFormErrors.salaryMin && <p className="mt-1 text-xs text-red-500">{jobFormErrors.salaryMin}</p>}
                    </Field>
                    <Field label="Salary Max (₹)" hint="Leave blank to hide">
                      <input type="number" value={jobForm.salaryMax} onChange={e => setJobField("salaryMax", e.target.value)} placeholder="e.g. 900000" className={`${inputCls} ${jobFormErrors.salaryMax ? "border-red-300" : ""}`} />
                      {jobFormErrors.salaryMax && <p className="mt-1 text-xs text-red-500">{jobFormErrors.salaryMax}</p>}
                    </Field>
                    <Field label="Application Deadline">
                      <input type="date" value={jobForm.deadline} onChange={e => setJobField("deadline", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Status">
                      <select value={jobForm.status} onChange={e => setJobField("status", e.target.value as JobStatus)} className={selectCls}>
                        {(["Open", "Paused", "Closed"] as JobStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Skills" hint="Comma-separated, e.g. React, TypeScript, Node.js">
                        <input type="text" value={jobForm.skills} onChange={e => setJobField("skills", e.target.value)} placeholder="React, TypeScript, Node.js" className={inputCls} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Description" required>
                        <textarea rows={4} value={jobForm.description} onChange={e => setJobField("description", e.target.value)} placeholder="Describe the role, team, and impact…" className={`${textareaCls} ${jobFormErrors.description ? "border-red-300" : ""}`} />
                        {jobFormErrors.description && <p className="mt-1 text-xs text-red-500">{jobFormErrors.description}</p>}
                      </Field>
                    </div>
                    <div className="sm:col-span-2"><Field label="Requirements" hint="Optional – one per line"><textarea rows={3} value={jobForm.requirements} onChange={e => setJobField("requirements", e.target.value)} placeholder={"3+ years of React experience\nStrong TypeScript skills"} className={textareaCls} /></Field></div>
                    <div className="sm:col-span-2"><Field label="Responsibilities" hint="Optional – one per line"><textarea rows={3} value={jobForm.responsibilities} onChange={e => setJobField("responsibilities", e.target.value)} placeholder={"Build and maintain frontend features\nCollaborate with design team"} className={textareaCls} /></Field></div>
                  </div>
                  {jobFormError && (
                    <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /><p className="text-sm font-semibold text-red-600">{jobFormError}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                  <button onClick={handleJobFormSubmit} disabled={jobFormSubmitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60">
                    {jobFormSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {formModalMode === "create" ? "Publish Role" : "Save Changes"}
                  </button>
                  <button onClick={closeJobFormModal} disabled={jobFormSubmitting} className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60">Cancel</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Import CSV Modal */}
      <AnimatePresence>
        {importModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !importing && setImportModalOpen(false)}
              className="fixed inset-0 z-[80] bg-gray-900/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={modalTransition}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
              >
                <div className="h-1 w-full bg-blue-600" />
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-black text-gray-900">Bulk Import Jobs</h2>
                        <p className="text-xs text-gray-400">Upload a CSV file to post multiple roles at once.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => !importing && setImportModalOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {/* File Upload Area */}
                  <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center transition hover:bg-gray-100 hover:border-blue-300">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={importing}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:scale-110">
                      <FileText className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {csvFile ? csvFile.name : "Select a CSV file"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {csvFile
                        ? `${(csvFile.size / 1024).toFixed(2)} KB`
                        : "Drag & drop or click to browse files"}
                    </p>
                  </div>

                  {/* Template download & instructions */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                    <div className="text-[11px] text-gray-500 font-medium">
                      Need a formatting reference?
                    </div>
                    <button
                      onClick={downloadSampleCSV}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 shadow-sm"
                    >
                      Download Template
                    </button>
                  </div>

                  {/* Error & Success States */}
                  {importError && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <p className="text-xs font-semibold text-red-600">{importError}</p>
                    </div>
                  )}

                  {importSuccess && (
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 opacity-60 animate-pulse" />
                      <p className="text-xs font-semibold text-emerald-600">{importSuccess}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                  <button
                    onClick={handleImportSubmit}
                    disabled={importing || !csvFile}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importing…
                      </>
                    ) : (
                      "Import Jobs"
                    )}
                  </button>
                  <button
                    onClick={() => setImportModalOpen(false)}
                    disabled={importing}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyJobsPage;
