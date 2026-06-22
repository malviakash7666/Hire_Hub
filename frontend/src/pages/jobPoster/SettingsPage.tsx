import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, ChevronDown, Lock, Shield,
  Trash2, Save, Loader2, CheckCircle2, Eye, EyeOff, AlertTriangle,
  User,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";




/* ─── TOGGLE ─── */
const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button onClick={onChange} className={`flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-200"}`}>
    <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
  </button>
);

/* ─── SECTION CARD ─── */
const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; accent?: string }> = ({ title, subtitle, children, accent = "bg-blue-600" }) => (
  <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
    <div className={`h-0.5 w-full ${accent}`} />
    <div className="p-6">
      <div className="mb-5">
        <h2 className="text-sm font-black text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

/* ─── MAIN PAGE ─── */
const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  const userInitial = (user as any)?.name?.charAt(0)?.toUpperCase() || "U";

  // Account
  const [accountForm, setAccountForm] = useState({ name: (user as any)?.name || "", email: (user as any)?.email || "" });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);

  // Password
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  // Notifications
  const [notifs, setNotifs] = useState({ newApplications: true, statusUpdates: true, jobExpiry: false, weeklyDigest: true, marketingEmails: false });

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const handleAccountSave = async () => {
    setAccountSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setAccountSaving(false); setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 3000);
  };

  const handlePasswordSave = async () => {
    setPwError("");
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    if (pwForm.newPw.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    setPwSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setPwSaving(false); setPwSaved(true); setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  };

  const toggleNotif = (key: keyof typeof notifs) => setNotifs(n => ({ ...n, [key]: !n[key] }));



  const PasswordInput: React.FC<{ label: string; field: "current" | "newPw" | "confirm" }> = ({ label, field }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
      <div className="relative">
        <input type={showPw[field] ? "text" : "password"} value={pwForm[field]} onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
          className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 pr-10 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPw[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-white px-4 sm:px-5">
          <div className="flex-1" />
          <button className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white" /></button>
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">{userInitial}</div>
            <span className="hidden sm:inline">{(user as any)?.name || "User"}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Settings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your account preferences and security</p>
          </div>

          <div className="max-w-2xl space-y-5">
            {/* Account Info */}
            <SectionCard title="Account Information" subtitle="Update your name and email address">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Full Name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={accountForm.name} onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                  <input type="email" value={accountForm.email} onChange={e => setAccountForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button onClick={handleAccountSave} disabled={accountSaving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60">
                  {accountSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : accountSaved ? <><CheckCircle2 className="h-3.5 w-3.5" />Saved!</> : <><Save className="h-3.5 w-3.5" />Save</>}
                </button>
              </div>
            </SectionCard>

            {/* Password */}
            <SectionCard title="Change Password" subtitle="Use a strong password that you don't use elsewhere" accent="bg-violet-600">
              <div className="space-y-4">
                <PasswordInput label="Current Password" field="current" />
                <PasswordInput label="New Password" field="newPw" />
                <PasswordInput label="Confirm New Password" field="confirm" />
              </div>
              {pwError && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />{pwError}
                </div>
              )}
              <div className="mt-4">
                <button onClick={handlePasswordSave} disabled={pwSaving} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700 disabled:opacity-60">
                  {pwSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Updating…</> : pwSaved ? <><CheckCircle2 className="h-3.5 w-3.5" />Updated!</> : <><Lock className="h-3.5 w-3.5" />Update Password</>}
                </button>
              </div>
            </SectionCard>

            {/* Notifications */}
            <SectionCard title="Notification Preferences" subtitle="Choose what emails you want to receive" accent="bg-teal-500">
              <div className="space-y-4">
                {[
                  { key: "newApplications" as const, label: "New Applications", desc: "Get notified when someone applies to your job" },
                  { key: "statusUpdates" as const, label: "Status Updates", desc: "Notifications when application statuses change" },
                  { key: "jobExpiry" as const, label: "Job Expiry Alerts", desc: "Alert before your job listing expires" },
                  { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "A weekly summary of your job performance" },
                  { key: "marketingEmails" as const, label: "Marketing Emails", desc: "Product updates, tips, and offers from JobPortal" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <Toggle enabled={notifs[item.key]} onChange={() => toggleNotif(item.key)} />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Security */}
            <SectionCard title="Security" subtitle="Manage your login sessions and 2FA" accent="bg-amber-500">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400">Add extra security to your account</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-500">Coming soon</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Active Sessions</p>
                      <p className="text-xs text-gray-400">1 active session — this browser</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-red-500 hover:text-red-700 transition">Sign out all</button>
                </div>
              </div>
            </SectionCard>

            {/* Danger Zone */}
            <SectionCard title="Danger Zone" subtitle="Irreversible and destructive actions" accent="bg-red-500">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-red-700">Delete Account</p>
                    <p className="text-xs text-red-500 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                  </div>
                  <button onClick={() => setDeleteConfirm(true)} className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />Delete Account
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(false)} />
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ type: "spring", damping: 30, stiffness: 280 }} className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                <div className="h-1 bg-red-500" />
                <div className="px-6 py-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
                    <div>
                      <h2 className="text-base font-black text-gray-900">Delete Account</h2>
                      <p className="mt-1 text-sm text-gray-500">Type <span className="font-bold text-red-600">DELETE</span> to confirm. This action is permanent and cannot be undone.</p>
                    </div>
                  </div>
                  <input type="text" value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder="Type DELETE to confirm" className="mt-5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition" />
                </div>
                <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                  <button disabled={deleteText !== "DELETE"} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Trash2 className="h-4 w-4" />Permanently Delete
                  </button>
                  <button onClick={() => { setDeleteConfirm(false); setDeleteText(""); }} className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
