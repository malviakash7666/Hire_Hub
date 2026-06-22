import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  Building2,
  CalendarDays,
  Users,
  // Mail,
  // Phone,
  FileText,
  // ExternalLink,
  RefreshCw,
  Search,
  ChevronRight,
  Eye,
  // Filter,
  ChevronDown,
  UserCheck,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  // ArrowLeft,
  Download,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationsByJob,
} from "../../service/jobApplication.service";
import type {
  JobApplication,
  JobApplicationStatus,
} from "../../service/jobApplication.service";

/* ================= TYPES ================= */

type JobStatus = "Open" | "Closed" | "Draft";

interface RecruiterJob {
  id: string;
  title: string;
  description?: string;
  companyName?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skills?: string[];
  requirements?: string;
  responsibilities?: string;
  deadline?: string;
  status?: JobStatus;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MyJobsResponse {
  success: boolean;
  message?: string;
  total?: number;
  currentPage?: number;
  totalPages?: number;
  data: RecruiterJob[];
}

/* ================= API ================= */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const jobsAPI = axios.create({
  baseURL: `${BACKEND_URL}/api/v1/jobs`,
  withCredentials: true,
});

const getMyJobs = async (): Promise<MyJobsResponse> => {
  const res = await jobsAPI.get<MyJobsResponse>("/my/jobs");
  return res.data;
};

/* ================= HELPERS ================= */

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

type TabStatus = JobApplicationStatus | "All";

const ALL_STATUSES: JobApplicationStatus[] = [
  "Applied",
  "Reviewed",
  "Shortlisted",
  // "Interview",
  "Rejected",
  "Hired",
];

const STATUS_CONFIG: Record<
  JobApplicationStatus,
  { label: string; bg: string; text: string; dot: string; pill: string; icon: React.ReactNode }
> = {
  Applied: {
    label: "Applied",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
    pill: "bg-sky-100 text-sky-700 border border-sky-200",
    icon: <Clock className="h-3 w-3" />,
  },
  Reviewed: {
    label: "Under Review",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    pill: "bg-amber-100 text-amber-700 border border-amber-200",
    icon: <Eye className="h-3 w-3" />,
  },
  Shortlisted: {
    label: "Shortlisted",
    bg: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-400",
    pill: "bg-teal-100 text-teal-700 border border-teal-200",
    icon: <UserCheck className="h-3 w-3" />,
  },
  // Interview: {
  //   label: "Interview",
  //   bg: "bg-violet-50",
  //   text: "text-violet-700",
  //   dot: "bg-violet-400",
  //   pill: "bg-violet-100 text-violet-700 border border-violet-200",
  //   icon: <Users className="h-3 w-3" />,
  // },
  Rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
    pill: "bg-red-100 text-red-700 border border-red-200",
    icon: <XCircle className="h-3 w-3" />,
  },
  Hired: {
    label: "Hired",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
    pill: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
};

const getJobStatusClasses = (status?: JobStatus) => {
  switch (status) {
    case "Open":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "Closed":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Draft":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
};

/* ================= STATUS BADGE ================= */

const StatusBadge: React.FC<{ status: JobApplicationStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    pill: "bg-slate-100 text-slate-600 border border-slate-200",
    icon: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.pill}`}
    >
      {config.label}
    </span>
  );
};

/* ================= STATUS DROPDOWN ================= */

interface StatusDropdownProps {
  applicationId: string;
  currentStatus: JobApplicationStatus;
  onStatusChange: (id: string, newStatus: JobApplicationStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  applicationId,
  currentStatus,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const config = STATUS_CONFIG[currentStatus];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-80 ${config?.pill}`}
      >
        {config?.label ?? currentStatus}
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            {ALL_STATUSES.map((status) => {
              const s = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(applicationId, status);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-xs font-medium transition hover:bg-slate-50 ${
                    status === currentStatus ? "bg-slate-50 font-semibold" : ""
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <span className={s.text}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/* ================= APPLICANT DETAIL MODAL ================= */

interface ApplicantDetailModalProps {
  application: JobApplication | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: JobApplicationStatus) => void;
}

const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({
  application,
  onClose,
  onStatusChange,
}) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-md">
              {application.fullName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{application.fullName}</h3>
              <p className="text-xs text-slate-500">ID: {application.applicantId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={application.status} />
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Email</p>
              <p className="mt-0.5 truncate font-medium text-slate-900">{application.email}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Phone</p>
              <p className="mt-0.5 font-medium text-slate-900">{application.phone || "—"}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Applied On</p>
              <p className="mt-0.5 font-medium text-slate-900">{formatDate(application.createdAt)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Update Status</p>
              <div className="mt-1">
                <StatusDropdown
                  applicationId={application.id}
                  currentStatus={application.status}
                  onStatusChange={onStatusChange}
                />
              </div>
            </div>
          </div>

          {application.coverLetter && (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cover Letter</p>
              <p className="text-sm leading-6 text-slate-600">{application.coverLetter}</p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {application.resumeUrl ? (
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            ) : (
              <div className="flex-1 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-center text-sm text-slate-400">
                No resume uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= AVATAR ================= */

const avatarColors = [
  "from-indigo-500 to-purple-600",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-cyan-600",
  "from-orange-500 to-amber-500",
  "from-blue-500 to-indigo-600",
];

const getAvatarGradient = (name: string) => {
  const code = (name?.charCodeAt(0) ?? 0) % avatarColors.length;
  return avatarColors[code];
};

/* ================= TABLE ROW ================= */

interface TableRowProps {
  application: JobApplication;
  index: number;
  onStatusChange: (id: string, newStatus: JobApplicationStatus) => void;
  onView: (application: JobApplication) => void;
}

const TableRow: React.FC<TableRowProps> = ({ application, index, onStatusChange, onView }) => {
  return (
    <tr
      className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
        index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
      }`}
    >
      {/* Applicant */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(
              application.fullName ?? ""
            )} text-sm font-bold text-white shadow-sm`}
          >
            {application.fullName?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{application.fullName}</p>
            <p className="truncate text-xs text-slate-500">{application.email}</p>
          </div>
        </div>
      </td>

      {/* Experience */}
      <td className="px-5 py-4">
        <span className="text-sm text-slate-700">
          {(application as any).experience ?? "—"}
        </span>
      </td>

      {/* Applied On */}
      <td className="px-5 py-4">
        <span className="text-sm text-slate-600">{formatDate(application.createdAt)}</span>
      </td>

      {/* Resume */}
      <td className="px-5 py-4">
        {application.resumeUrl ? (
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            <FileText className="h-3.5 w-3.5" />
            {(application as any).resumeOriginalName ?? "Resume.pdf"}
          </a>
        ) : (
          <span className="text-sm italic text-slate-400">No resume</span>
        )}
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusDropdown
          applicationId={application.id}
          currentStatus={application.status}
          onStatusChange={onStatusChange}
        />
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <button
          onClick={() => onView(application)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      </td>
    </tr>
  );
};

/* ================= MAIN COMPONENT ================= */

const RecruiterApplicantsPage: React.FC = () => {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState<boolean>(true);
  // const [ setJobsError] = useState<string>("");

  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const { jobId: routeJobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState<boolean>(false);
  const [applicationsError, setApplicationsError] = useState<string>("");

  const [applicantSearch, setApplicantSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabStatus>("All");

  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null);

  /* ---- Fetch jobs ---- */
  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      // setJobsError("");
      const response = await getMyJobs();
      const jobList = Array.isArray(response?.data) ? response.data : [];
      setJobs(jobList);
      if (routeJobId) {
        setSelectedJobId(routeJobId);
      } else if (jobList.length > 0) {
        setSelectedJobId((prev) => prev || jobList[0].id);
      }
    } catch (error: any) {
      // setJobsError(
      //   error?.response?.data?.message || error?.message || "Failed to load recruiter jobs."
      // );
      console.error("Failed to load recruiter jobs:", error);
    } finally {
      setJobsLoading(false);
    }
  };

  /* ---- Fetch applications ---- */
  const fetchApplications = async (jobId: string) => {
    try {
      setApplicationsLoading(true);
      setApplicationsError("");
      const response = await getApplicationsByJob(jobId);
      const list = Array.isArray(response?.data) ? response.data : [];
      setApplications(list);
    } catch (error: any) {
      setApplications([]);
      setApplicationsError(
        error?.response?.data?.message || error?.message || "Failed to load applicants."
      );
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications(selectedJobId);
      setActiveTab("All");
      setApplicantSearch("");
    } else {
      setApplications([]);
    }
  }, [selectedJobId]);

  /* ---- Handle status change ---- */
  const handleStatusChange = (id: string, newStatus: JobApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    if (viewingApplication?.id === id) {
      setViewingApplication((prev) => prev ? { ...prev, status: newStatus } : prev);
    }
    // TODO: call API to persist status change
  };

  /* ---- Derived data ---- */
  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId),
    [jobs, selectedJobId]
  );

  const stats = useMemo(() => ({
    total: applications.length,
    Applied: applications.filter((a) => a.status === "Applied").length,
    Reviewed: applications.filter((a) => a.status === "Reviewed").length,
    Shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    // Interview: applications.filter((a) => a.status === "Interview").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
    Hired: applications.filter((a) => a.status === "Hired").length,
  }), [applications]);

  const tabs: { label: string; value: TabStatus; count: number }[] = [
    { label: "All", value: "All", count: stats.total },
    { label: "Under Review", value: "Reviewed", count: stats.Reviewed },
    { label: "Shortlisted", value: "Shortlisted", count: stats.Shortlisted },
    // { label: "Interview", value: "Interview", count: stats.Interview },
    { label: "Rejected", value: "Rejected", count: stats.Rejected },
    { label: "Hired", value: "Hired", count: stats.Hired },
  ];

  const filteredApplications = useMemo(() => {
    const s = applicantSearch.trim().toLowerCase();
    return applications.filter((a) => {
      const matchesSearch =
        !s ||
        a.fullName?.toLowerCase().includes(s) ||
        a.email?.toLowerCase().includes(s) ||
        a.phone?.toLowerCase().includes(s);
      const matchesTab = activeTab === "All" || a.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [applications, applicantSearch, activeTab]);

  /* ---- If no job is selected yet, show job selection ---- */
  if (!jobsLoading && !selectedJob && jobs.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="mb-6 text-2xl font-bold text-slate-900">Select a Job</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900">{job.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getJobStatusClasses(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{job.companyName}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Applicant detail modal */}
      <ApplicantDetailModal
        application={viewingApplication}
        onClose={() => setViewingApplication(null)}
        onStatusChange={handleStatusChange}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ===== Breadcrumb ===== */}
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 transition hover:text-slate-800"
          >
            My Jobs
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-700 font-medium truncate max-w-[200px]">
            {selectedJob?.title ?? "..."}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Applicants</span>
        </nav>

        {/* ===== Job Title + Meta ===== */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {selectedJob?.title ?? "Loading..."}
            </h1>
            {selectedJob?.status && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getJobStatusClasses(selectedJob.status)}`}>
                {selectedJob.status}
              </span>
            )}
          </div>

          {selectedJob && (
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {selectedJob.companyName && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {selectedJob.companyName}
                </span>
              )}
              {selectedJob.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedJob.location}
                </span>
              )}
              {selectedJob.jobType && (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {selectedJob.jobType}
                </span>
              )}
              {selectedJob.deadline && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Deadline: {formatDate(selectedJob.deadline)}
                </span>
              )}
              <button
                onClick={fetchJobs}
                className="ml-auto flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* ===== Main Card ===== */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* ===== Tabs ===== */}
          <div className="border-b border-slate-200 px-5">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      activeTab === tab.value
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ===== Search Bar ===== */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={applicantSearch}
                onChange={(e) => setApplicantSearch(e.target.value)}
                placeholder="Search candidate by name or email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-50"
              />
            </div>
            <p className="ml-4 shrink-0 text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{filteredApplications.length}</span> applicant{filteredApplications.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* ===== Table ===== */}
          {applicationsLoading ? (
            <div className="p-8">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4 px-2">
                    <div className="h-9 w-9 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-1/4 rounded bg-slate-200" />
                      <div className="h-3 w-1/3 rounded bg-slate-200" />
                    </div>
                    <div className="h-3 w-16 rounded bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-200" />
                    <div className="h-6 w-24 rounded-full bg-slate-200" />
                    <div className="h-7 w-14 rounded-lg bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          ) : applicationsError ? (
            <div className="p-6">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {applicationsError}
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-200" />
              <h3 className="mt-4 text-base font-semibold text-slate-700">No applicants found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {applications.length === 0
                  ? "No one has applied for this job yet."
                  : "Try changing your search or tab filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Applicant
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Experience
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Applied On
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resume
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application, index) => (
                    <TableRow
                      key={application.id}
                      application={application}
                      index={index}
                      onStatusChange={handleStatusChange}
                      onView={(a) => setViewingApplication(a)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== Footer ===== */}
          {filteredApplications.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filteredApplications.length}</span> of{" "}
                <span className="font-semibold text-slate-700">{applications.length}</span> total applicants
              </p>
              <div className="flex gap-2 text-xs text-slate-500">
                {ALL_STATUSES.map((s) => {
                  const count = applications.filter((a) => a.status === s).length;
                  if (count === 0) return null;
                  return (
                    <span key={s} className={`rounded-full px-2.5 py-1 font-medium ${STATUS_CONFIG[s].pill}`}>
                      {STATUS_CONFIG[s].label}: {count}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ===== Change Job Button ===== */}
        {jobs.length > 1 && (
          <div className="mt-4 flex justify-end">
            <div className="relative">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} {job.status ? `(${job.status})` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RecruiterApplicantsPage;