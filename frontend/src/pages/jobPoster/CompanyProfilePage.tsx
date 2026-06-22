import { useState, useRef, useEffect } from "react";
import {
  Building2,
  MapPin,
  Link2,
  Users,
  Calendar,
  Globe,
  Upload,
  Eye,
  CheckCircle2,
  ChevronDown,
  Info,
  Pencil,
} from "lucide-react";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

import { companyService } from "../../service/companyPage.service";

/* ─── Types ─────────────────────────────────────────────── */
interface FormData {
  logo: string | null;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  websiteUrl: string;
  industry: string;
  companySize: string;
  foundedYear: string;
  aboutCompany: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  fullAddress: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  github: string;
}

const INDUSTRY_OPTIONS = [
  "Information Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Retail & E-commerce",
  "Manufacturing",
  "Media & Entertainment",
  "Real Estate",
  "Logistics & Supply Chain",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
];

const COUNTRY_OPTIONS = ["India", "United States", "United Kingdom", "Canada", "Australia"];
const STATE_OPTIONS: Record<string, string[]> = {
  India: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana", "Gujarat"],
  "United States": ["California", "New York", "Texas", "Florida", "Washington"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  Canada: ["Ontario", "British Columbia", "Quebec", "Alberta"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
};

type NavItem = "basic" | "details" | "location" | "social";

const NAV_ITEMS: { id: NavItem; label: string; icon: React.ReactNode }[] = [
  { id: "basic", label: "Basic Information", icon: <Building2 size={15} /> },
  { id: "details", label: "Company Details", icon: <Info size={15} /> },
  { id: "location", label: "Location", icon: <MapPin size={15} /> },
  { id: "social", label: "Social Links", icon: <Link2 size={15} /> },
];

/* ─── Select Component ───────────────────────────────────── */
function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-9 cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

/* ─── Input Component ────────────────────────────────────── */
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pr-9"
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Profile Preview Card ───────────────────────────────── */
function ProfilePreview({ form }: { form: FormData }) {
  const highlights = ["Great Work Culture", "Learning & Growth", "Innovative Projects", "Work-Life Balance"];
  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-400 relative">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="px-5 pb-5">
          {/* Logo */}
          <div className="w-14 h-14 rounded-xl bg-white border-2 border-white shadow-md -mt-7 mb-3 flex items-center justify-center overflow-hidden">
            {form.logo ? (
              <img src={form.logo} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                {form.companyName?.[0] || "C"}
              </div>
            )}
          </div>

          <h3 className="font-bold text-slate-800 text-lg leading-tight">
            {form.companyName || "Company Name"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {form.industry || "Industry"} & Services
          </p>

          <div className="mt-3 space-y-1.5">
            {form.companySize && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users size={12} className="text-violet-400" />
                <span>{form.companySize}</span>
              </div>
            )}
            {form.foundedYear && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={12} className="text-violet-400" />
                <span>Founded in {form.foundedYear}</span>
              </div>
            )}
            {(form.city || form.state || form.country) && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin size={12} className="text-violet-400" />
                <span>
                  {[form.city, form.state, form.country].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {form.websiteUrl && (
              <div className="flex items-center gap-2 text-xs text-violet-500">
                <Globe size={12} />
                <span className="truncate">{form.websiteUrl}</span>
              </div>
            )}
          </div>

          {form.aboutCompany && (
            <>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  About Company
                </p>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
                  {form.aboutCompany}
                </p>
              </div>
            </>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Company Highlights
            </p>
            <div className="flex flex-wrap gap-1.5">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="text-xs bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full font-medium border border-violet-100"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          {(form.linkedin || form.twitter || form.facebook || form.instagram || form.github) && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Follow Us
              </p>
              <div className="flex gap-3">
                {form.linkedin && (
                  <a href={form.linkedin} className="text-blue-600 hover:scale-110 transition-transform">
                    <FaLinkedin size={18} />
                  </a>
                )}
                {form.twitter && (
                  <a href={form.twitter} className="text-sky-400 hover:scale-110 transition-transform">
                    <FaTwitter size={18} />
                  </a>
                )}
                {form.facebook && (
                  <a href={form.facebook} className="text-blue-500 hover:scale-110 transition-transform">
                    <FaFacebook size={18} />
                  </a>
                )}
                {form.instagram && (
                  <a href={form.instagram} className="text-pink-500 hover:scale-110 transition-transform">
                    <FaInstagram size={18} />
                  </a>
                )}
                {form.github && (
                  <a href={form.github} className="text-slate-700 hover:scale-110 transition-transform">
                    <FaGithub size={18} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl p-4 flex gap-3">
        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info size={12} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-violet-700">Why is this important?</p>
          <p className="text-xs text-violet-500 mt-0.5 leading-relaxed">
            A complete company profile helps you attract better candidates and builds trust.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function CompanyProfile() {
  const [activeTab, setActiveTab] = useState<NavItem>("basic");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [companyId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    logo: null,
    companyName: "TechNova Solutions",
    companyEmail: "hello@technovasolutions.com",
    companyPhone: "+91 98765 43210",
    websiteUrl: "https://www.technovasolutions.com",
    industry: "Information Technology",
    companySize: "51-200 employees",
    foundedYear: "2020",
    aboutCompany:
      "TechNova Solutions is a forward-thinking IT company focused on building innovative software solutions. We help businesses grow with technology and empower our team to learn, build and succeed together.",
    country: "India",
    state: "Maharashtra",
    city: "Nagpur",
    pincode: "440001",
    fullAddress: "123, IT Park, Wardha Road, Nagpur, Maharashtra, India",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    github: "https://github.com",
  });

  const set = (key: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const charCount = form.aboutCompany.length;

  /* Completion % */
  const fields = Object.values(form);
  const filled = fields.filter((v) => v && v !== "").length;
  const completion = Math.round((filled / fields.length) * 100);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("logo")(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (companyId) {
        await companyService.updateCompanyProfile(companyId, payload);
      } else {
        await companyService.createCompanyProfile(payload);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      companyService.getSingleCompanyProfile(companyId).then((data) => {
        if (data) setForm((f) => ({ ...f, ...data }));
      });
    }
  }, [companyId]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Company Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your company information. This will be visible to job seekers.
            </p>
          </div>

          <div className="flex items-center gap-5">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Profile Completion
              </span>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-xs font-bold text-violet-600 whitespace-nowrap">
                {completion}% Complete
              </span>
            </div>

            <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors font-medium">
              <Eye size={14} />
              View Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-7">
          {/* Sidebar Nav */}
          <aside className="w-52 flex-shrink-0">
            <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all text-left border-l-2 ${
                    activeTab === item.id
                      ? "bg-violet-50 text-violet-700 border-violet-500"
                      : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span className={activeTab === item.id ? "text-violet-500" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Form */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              {/* ── Basic Information ── */}
              {activeTab === "basic" && (
                <div className="p-8">
                  <h2 className="text-base font-bold text-slate-800">Basic Information</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Add your company basic information.
                  </p>

                  {/* Logo */}
                  <div className="mb-6">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">
                      Company Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 relative overflow-hidden cursor-pointer group"
                        onClick={() => fileRef.current?.click()}
                      >
                        {form.logo ? (
                          <>
                            <img
                              src={form.logo}
                              alt="logo"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Pencil size={16} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="text-slate-300 flex flex-col items-center gap-1">
                            <Upload size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-2">JPG, PNG or SVG. Max size 2MB.</p>
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="text-sm font-medium text-violet-600 border border-violet-200 rounded-lg px-4 py-2 hover:bg-violet-50 transition-colors"
                        >
                          Upload Logo
                        </button>
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <Input
                      label="Company Name"
                      value={form.companyName}
                      onChange={set("companyName")}
                      required
                      placeholder="e.g. TechNova Solutions"
                    />
                    <Input
                      label="Company Email"
                      value={form.companyEmail}
                      onChange={set("companyEmail")}
                      required
                      type="email"
                      placeholder="hello@company.com"
                    />
                    <Input
                      label="Company Phone"
                      value={form.companyPhone}
                      onChange={set("companyPhone")}
                      placeholder="+91 98765 43210"
                    />
                    <Input
                      label="Website URL"
                      value={form.websiteUrl}
                      onChange={set("websiteUrl")}
                      placeholder="https://www.company.com"
                      icon={<Globe size={14} />}
                    />
                  </div>
                </div>
              )}

              {/* ── Company Details ── */}
              {activeTab === "details" && (
                <div className="p-8">
                  <h2 className="text-base font-bold text-slate-800">Company Details</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Tell job seekers more about your company.
                  </p>

                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Industry <span className="text-rose-500">*</span>
                      </label>
                      <Select
                        value={form.industry}
                        onChange={set("industry")}
                        options={INDUSTRY_OPTIONS}
                        placeholder="Select industry"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Company Size <span className="text-rose-500">*</span>
                      </label>
                      <Select
                        value={form.companySize}
                        onChange={set("companySize")}
                        options={COMPANY_SIZE_OPTIONS}
                        placeholder="Select size"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1.5">
                      Founded Year
                    </label>
                    <div className="relative w-1/2">
                      <input
                        type="number"
                        value={form.foundedYear}
                        onChange={(e) => set("foundedYear")(e.target.value)}
                        min="1800"
                        max={new Date().getFullYear()}
                        placeholder="e.g. 2020"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent pl-9"
                      />
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      About Company <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={form.aboutCompany}
                      onChange={(e) => set("aboutCompany")(e.target.value)}
                      rows={5}
                      maxLength={500}
                      placeholder="Describe your company..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-slate-400 text-right">{charCount}/500</p>
                  </div>
                </div>
              )}

              {/* ── Location ── */}
              {activeTab === "location" && (
                <div className="p-8">
                  <h2 className="text-base font-bold text-slate-800">Location</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Add your company location details.
                  </p>

                  <div className="grid grid-cols-2 gap-5 mb-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <Select
                        value={form.country}
                        onChange={(v) => {
                          set("country")(v);
                          set("state")("");
                        }}
                        options={COUNTRY_OPTIONS}
                        placeholder="Select country"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <Select
                        value={form.state}
                        onChange={set("state")}
                        options={STATE_OPTIONS[form.country] || []}
                        placeholder="Select state"
                      />
                    </div>
                    <Input
                      label="City"
                      value={form.city}
                      onChange={set("city")}
                      required
                      placeholder="e.g. Nagpur"
                    />
                    <Input
                      label="Pincode"
                      value={form.pincode}
                      onChange={set("pincode")}
                      required
                      placeholder="e.g. 440001"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Full Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.fullAddress}
                      onChange={(e) => set("fullAddress")(e.target.value)}
                      placeholder="123, Street Name, City, State, Country"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* ── Social Links ── */}
              {activeTab === "social" && (
                <div className="p-8">
                  <h2 className="text-base font-bold text-slate-800">Social Links</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Connect your company's social media profiles.
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        key: "linkedin" as keyof FormData,
                        label: "LinkedIn",
                        icon: <FaLinkedin size={16} className="text-blue-600" />,
                        placeholder: "https://linkedin.com/company/yourcompany",
                      },
                      {
                        key: "twitter" as keyof FormData,
                        label: "Twitter / X",
                        icon: <FaTwitter size={16} className="text-sky-400" />,
                        placeholder: "https://twitter.com/yourcompany",
                      },
                      {
                        key: "facebook" as keyof FormData,
                        label: "Facebook",
                        icon: <FaFacebook size={16} className="text-blue-500" />,
                        placeholder: "https://facebook.com/yourcompany",
                      },
                      {
                        key: "instagram" as keyof FormData,
                        label: "Instagram",
                        icon: <FaInstagram size={16} className="text-pink-500" />,
                        placeholder: "https://instagram.com/yourcompany",
                      },
                      {
                        key: "github" as keyof FormData,
                        label: "GitHub",
                        icon: <FaGithub size={16} className="text-slate-700" />,
                        placeholder: "https://github.com/yourcompany",
                      },
                    ].map(({ key, label, icon, placeholder }) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          {label}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
                          <input
                            type="url"
                            value={form[key] as string}
                            onChange={(e) => set(key)(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between">
                <button className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 active:scale-95"
                  } disabled:opacity-60`}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 size={15} />
                      Saved!
                    </>
                  ) : saving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </main>

          {/* Right Preview Panel */}
          <aside className="w-72 flex-shrink-0">
            <div className="mb-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Profile Preview
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                This is how job seekers will see your company.
              </p>
            </div>
            <ProfilePreview form={form} />
          </aside>
        </div>
      </div>
    </div>
  );
}