import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Briefcase,
  ExternalLink,
  Download,
} from "lucide-react";
import type { JobApplication } from "../service/jobApplication.service";
import type { JobPost } from "../service/jobPost.service";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPost | null;
  applications: JobApplication[] | null;
  loadingApps: boolean;
  updatingId: string | null;
  onStatusUpdate: (id: string, status: any) => Promise<void>;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const formatDate = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAppStatusConfig = (status?: string) => {
  switch (status) {
    case "Accepted":
    case "accepted":
      return {
        label: "Accepted",
        icon: CheckCircle2,
        classes: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-500",
      };
    case "Rejected":
    case "rejected":
      return {
        label: "Rejected",
        icon: XCircle,
        classes: "bg-red-100 text-red-600 border border-red-200",
        dot: "bg-red-500",
      };
    case "Under Review":
    case "under_review":
    case "reviewing":
      return {
        label: "Under Review",
        icon: AlertCircle,
        classes: "bg-amber-100 text-amber-700 border border-amber-200",
        dot: "bg-amber-500",
      };
    case "In-Process":
    case "in_process":
      return {
        label: "In-Process",
        icon: Clock,
        classes: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        dot: "bg-yellow-500",
      };
    case "Interviewed":
    case "interviewed":
      return {
        label: "Interviewed",
        icon: CheckCircle2,
        classes: "bg-teal-100 text-teal-700 border border-teal-200",
        dot: "bg-teal-500",
      };
    default:
      return {
        label: status || "Pending",
        icon: Clock,
        classes: "bg-gray-100 text-gray-600 border border-gray-200",
        dot: "bg-gray-400",
      };
  }
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const AVATAR_COLORS = [
  "bg-blue-200 text-blue-700",
  "bg-violet-200 text-violet-700",
  "bg-rose-200 text-rose-700",
  "bg-amber-200 text-amber-700",
  "bg-teal-200 text-teal-700",
  "bg-emerald-200 text-emerald-700",
];

const getAvatarColor = (index: number) => AVATAR_COLORS[index % AVATAR_COLORS.length];

/* ─────────────────────────────────────────
   STATUS DROPDOWN
───────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Under Review", label: "Under Review" },
  { value: "In-Process", label: "In-Process" },
  { value: "Interviewed", label: "Interviewed" },
  { value: "Accepted", label: "Accepted" },
  { value: "Rejected", label: "Rejected" },
];

const StatusDropdown: React.FC<{
  currentStatus: string;
  appId: string;
  updating: boolean;
  onUpdate: (id: string, status: any) => Promise<void>;
}> = ({ currentStatus, appId, updating, onUpdate }) => {
  const config = getAppStatusConfig(currentStatus);

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={(e) => onUpdate(appId, e.target.value)}
        disabled={updating}
        className={`appearance-none rounded-full py-1 pl-2.5 pr-6 text-[11px] font-bold outline-none cursor-pointer transition-all disabled:opacity-60 ${config.classes}`}
        style={{ backgroundImage: "none" }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {updating ? (
        <Loader2 className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin opacity-60" />
      ) : (
        <ChevronRight className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-90 opacity-50" />
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   APPLICANT CARD
───────────────────────────────────────── */
const ApplicantCard: React.FC<{
  app: JobApplication;
  index: number;
  updating: boolean;
  onSelect: (app: JobApplication) => void;
  onStatusUpdate: (id: string, status: any) => Promise<void>;
}> = ({ app, index, updating, onSelect, onStatusUpdate }) => {
  const applicant = (app as any).applicant || (app as any).candidate || app;
  const name =
    applicant?.name ||
    applicant?.fullName ||
    `${applicant?.firstName || ""} ${applicant?.lastName || ""}`.trim() ||
    "Unknown Applicant";
  const email = applicant?.email || (app as any).email || "—";
  const appliedAt = (app as any).appliedAt || (app as any).createdAt || (app as any).created_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3.5 transition-all hover:border-blue-200 hover:shadow-sm"
    >
      {/* avatar */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${getAvatarColor(index)}`}>
        {getInitials(name)}
      </div>

      {/* info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">{name}</p>
            <p className="truncate text-xs text-gray-400">{email}</p>
          </div>
          <StatusDropdown
            currentStatus={(app as any).status || "Pending"}
            appId={app.id}
            updating={updating}
            onUpdate={onStatusUpdate}
          />
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-400">
          <Calendar className="h-3 w-3" />
          Applied {formatDate(appliedAt)}
        </div>
      </div>

      {/* arrow */}
      <button
        onClick={() => onSelect(app)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        title="View full profile"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   APPLICANT DETAIL VIEW
───────────────────────────────────────── */
const ApplicantDetail: React.FC<{
  app: JobApplication;
  index: number;
  updating: boolean;
  onBack: () => void;
  onStatusUpdate: (id: string, status: any) => Promise<void>;
}> = ({ app, index, updating, onBack, onStatusUpdate }) => {
  const applicant = (app as any).applicant || (app as any).candidate || app;
  const name =
    applicant?.name ||
    applicant?.fullName ||
    `${applicant?.firstName || ""} ${applicant?.lastName || ""}`.trim() ||
    "Unknown Applicant";
  const email = applicant?.email || (app as any).email || "—";
  const phone = applicant?.phone || applicant?.phoneNumber || (app as any).phone || "—";
  const resume = (app as any).resumeUrl || (app as any).resume || applicant?.resume || null;
  const coverLetter = (app as any).coverLetter || (app as any).cover_letter || null;
  const appliedAt = (app as any).appliedAt || (app as any).createdAt || (app as any).created_at;
  const experience = applicant?.experience || (app as any).experience || "—";
  const currentRole = applicant?.currentRole || applicant?.currentTitle || "—";

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col"
    >
      {/* back */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Applicant Profile</p>
          <h3 className="text-sm font-black text-gray-900">{name}</h3>
        </div>
      </div>

      {/* profile card */}
      <div className="mb-4 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-black ${getAvatarColor(index)}`}>
          {getInitials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-black text-gray-900">{name}</h4>
          {currentRole !== "—" && <p className="text-sm font-semibold text-blue-600">{currentRole}</p>}
          <div className="mt-2">
            <StatusDropdown
              currentStatus={(app as any).status || "Pending"}
              appId={app.id}
              updating={updating}
              onUpdate={onStatusUpdate}
            />
          </div>
        </div>
      </div>

      {/* detail sections */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Contact Info</p>
          <div className="space-y-2.5">
            {[
              { icon: Mail, value: email },
              { icon: Phone, value: phone },
              { icon: Calendar, value: `Applied ${formatDate(appliedAt)}` },
            ].map(({ icon: Icon, value }) => (
              <div key={value} className="flex items-center gap-3 text-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {experience !== "—" && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Experience</p>
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <Briefcase className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{experience}</span>
            </div>
          </div>
        )}

        {coverLetter && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Cover Letter</p>
            <p className="whitespace-pre-line text-sm leading-7 text-gray-600">{coverLetter}</p>
          </div>
        )}

        {resume && (
          <div className="rounded-xl border border-gray-100 bg-white p-4">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-gray-400">Resume</p>
            <div className="flex gap-2">
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Resume
              </a>
              <a
                href={resume}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   MAIN MODAL
───────────────────────────────────────── */
const ApplicantsModal: React.FC<ApplicantsModalProps> = ({
  isOpen,
  onClose,
  job,
  applications,
  loadingApps,
  updatingId,
  onStatusUpdate,
}) => {
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleSelect = (app: JobApplication, idx: number) => {
    setSelectedApp(app);
    setSelectedIndex(idx);
  };

  const handleClose = () => {
    setSelectedApp(null);
    onClose();
  };

  const totalApps = applications?.length ?? 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[80] bg-gray-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl"
              style={{ maxHeight: "90vh" }}
            >
              {/* top accent */}
              <div className="h-1 w-full shrink-0 bg-blue-600" />

              {/* Header */}
              <div className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-black text-gray-900">Applicants</h2>
                      {job && (
                        <p className="truncate text-sm font-semibold text-blue-600">
                          {job.title}{job.companyName ? ` · ${job.companyName}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!loadingApps && (
                      <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600 sm:inline">
                        {totalApps} {totalApps === 1 ? "applicant" : "applicants"}
                      </span>
                    )}
                    <button
                      onClick={handleClose}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {loadingApps ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="mb-3 h-6 w-6 animate-spin text-blue-500" />
                    <p className="text-sm font-semibold text-gray-400">Loading applicants…</p>
                  </div>
                ) : !applications || applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">No applicants yet</h3>
                    <p className="mt-1 text-xs text-gray-400">Applications will appear here once candidates apply.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {selectedApp ? (
                      <ApplicantDetail
                        key="detail"
                        app={selectedApp}
                        index={selectedIndex}
                        updating={updatingId === selectedApp.id}
                        onBack={() => setSelectedApp(null)}
                        onStatusUpdate={onStatusUpdate}
                      />
                    ) : (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {/* Stats strip */}
                        <div className="mb-4 grid grid-cols-3 gap-3">
                          {[
                            { label: "Total", count: applications.length, color: "bg-blue-50 text-blue-700 border border-blue-100" },
                            {
                              label: "Accepted",
                              count: applications.filter((a) => ["Accepted", "accepted"].includes((a as any).status)).length,
                              color: "bg-emerald-50 text-emerald-700 border border-emerald-100",
                            },
                            {
                              label: "Rejected",
                              count: applications.filter((a) => ["Rejected", "rejected"].includes((a as any).status)).length,
                              color: "bg-red-50 text-red-600 border border-red-100",
                            },
                          ].map(({ label, count, color }) => (
                            <div key={label} className={`rounded-xl px-4 py-3 text-center ${color}`}>
                              <p className="text-xl font-black">{count}</p>
                              <p className="mt-0.5 text-[10px] font-black uppercase tracking-wider opacity-70">{label}</p>
                            </div>
                          ))}
                        </div>

                        {applications.map((app, idx) => (
                          <ApplicantCard
                            key={app.id}
                            app={app}
                            index={idx}
                            updating={updatingId === app.id}
                            onSelect={(a) => handleSelect(a, idx)}
                            onStatusUpdate={onStatusUpdate}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400">
                    {selectedApp ? "Viewing applicant profile" : `${totalApps} applicant${totalApps !== 1 ? "s" : ""} for this role`}
                  </p>
                  <button
                    onClick={handleClose}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ApplicantsModal;