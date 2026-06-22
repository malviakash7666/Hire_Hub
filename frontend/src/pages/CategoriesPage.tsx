import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Code2,
  Palette,
  BarChart2,
  Smartphone,
  Megaphone,
  Lock,
  Cloud,
  Bot,
  PenTool,
  DollarSign,
  HeartPulse,
  GraduationCap,
  Wrench,
  Globe,
  Search,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  icon: React.ElementType;
  name: string;
  count: string;
  description: string;
  bg: string;
  iconColor: string;
  tags: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const allCategories: Category[] = [
  {
    icon: Code2,
    name: "Development",
    count: "2,340",
    description: "Frontend, backend, full-stack, and everything in between.",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    tags: ["React", "Node.js", "Python", "TypeScript"],
  },
  {
    icon: Palette,
    name: "UI/UX Design",
    count: "1,180",
    description: "Create beautiful, user-centered digital experiences.",
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
    tags: ["Figma", "Prototyping", "Research", "Branding"],
  },
  {
    icon: BarChart2,
    name: "Data Science",
    count: "980",
    description: "Turn data into decisions with analytics and ML.",
    bg: "bg-green-50",
    iconColor: "text-green-600",
    tags: ["Python", "SQL", "ML", "Tableau"],
  },
  {
    icon: Smartphone,
    name: "Mobile Apps",
    count: "760",
    description: "Build iOS and Android apps that people love.",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    tags: ["Flutter", "React Native", "Swift", "Kotlin"],
  },
  {
    icon: Megaphone,
    name: "Marketing",
    count: "1,450",
    description: "Drive growth through creative and digital strategies.",
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
    tags: ["SEO", "Content", "Paid Ads", "Email"],
  },
  {
    icon: Lock,
    name: "Cybersecurity",
    count: "620",
    description: "Protect systems and data from evolving threats.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    tags: ["Penetration Testing", "SOC", "IAM", "Cloud Security"],
  },
  {
    icon: Cloud,
    name: "Cloud & DevOps",
    count: "890",
    description: "Scale infrastructure with modern cloud platforms.",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    icon: Bot,
    name: "AI / ML",
    count: "540",
    description: "Build intelligent systems that learn and adapt.",
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
    tags: ["LLMs", "Computer Vision", "NLP", "PyTorch"],
  },
  {
    icon: PenTool,
    name: "Content Writing",
    count: "670",
    description: "Craft compelling stories, blogs, and copy.",
    bg: "bg-pink-50",
    iconColor: "text-pink-500",
    tags: ["Copywriting", "Technical Writing", "Editing", "SEO"],
  },
  {
    icon: DollarSign,
    name: "Finance",
    count: "510",
    description: "Roles in banking, accounting, and financial planning.",
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
    tags: ["Accounting", "CFO", "Fintech", "Auditing"],
  },
  {
    icon: HeartPulse,
    name: "Healthcare",
    count: "430",
    description: "Medical, wellness, and health-tech opportunities.",
    bg: "bg-red-50",
    iconColor: "text-red-500",
    tags: ["Telemedicine", "Health IT", "Nursing", "Research"],
  },
  {
    icon: GraduationCap,
    name: "Education",
    count: "380",
    description: "Teaching, EdTech, and training professionals.",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    tags: ["Curriculum", "EdTech", "Tutoring", "LMS"],
  },
  {
    icon: Wrench,
    name: "Engineering",
    count: "720",
    description: "Mechanical, civil, electrical and more.",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    tags: ["CAD", "Civil", "Electrical", "Mechanical"],
  },
  {
    icon: Globe,
    name: "Remote & Freelance",
    count: "1,920",
    description: "Work from anywhere with flexible remote roles.",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    tags: ["Full Remote", "Part-time", "Contract", "Freelance"],
  },
];

const filters: string[] = [
  "All",
  "Tech",
  "Design",
  "Marketing",
  "Finance",
  "Healthcare",
  "Remote",
];

// ─── Component ────────────────────────────────────────────────────────────────

const CategoriesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const filtered = allCategories.filter((cat) => {
    const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[68px] gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">HireHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Find Jobs", to: "/" },
              { label: "Companies", to: "/" },
              { label: "Categories", to: "/categories" },
              { label: "About Us", to: "/about" },
              { label: "Pricing", to: "/pricing" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-sm font-medium transition-colors ${
                  item.label === "Categories"
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:inline-flex px-5 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors">Login</Link>
            <Link to="/signup" className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="bg-white px-10 pt-14 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Categories</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                <BarChart2 className="w-4 h-4" /> 14 Job Categories
              </div>
              <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-4">
                Explore Jobs by <span className="text-blue-600">Category</span>
              </h1>
              <p className="text-base text-gray-500 leading-7 max-w-lg">
                Browse thousands of open positions across every industry and
                discipline. Find the category that matches your skills and
                passion.
              </p>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a category…"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap mt-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeFilter === f
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="px-10 py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400 font-medium mb-8">
            Showing <span className="text-gray-900 font-bold">{filtered.length}</span> categories
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.bg}`}>
                    <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-1">{cat.name}</div>
                  <div className="text-sm text-gray-400 font-medium mb-3">{cat.count} open positions</div>
                  <p className="text-sm text-gray-500 leading-6 mb-4">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-500 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-10 pb-20">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-3xl px-12 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Can't find your category?</h2>
            <p className="text-blue-200 text-base">Post a job or browse all open positions across every field.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/jobs" className="px-7 py-3.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Browse All Jobs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/signup" className="px-7 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 px-10 py-6 text-center text-sm text-gray-400">
        © 2026 HireHub · Modern Job Portal Platform · All rights reserved.
      </footer>
    </div>
  );
};

export default CategoriesPage;