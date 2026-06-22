import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Code2,
  Palette,
  BarChart2,
  Smartphone,
  Megaphone,
  Lock,
  Cloud,
  Bot,
} from "lucide-react";


import Navbar from "../../components/Navbar";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stat {
  label: string;
  value: string;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Category {
  icon: React.ElementType;
  name: string;
  count: string;
  bg: string;
  iconColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats: Stat[] = [
  { label: "Active Jobs", value: "12K+" },
  { label: "Hiring Companies", value: "4.8K+" },
  { label: "Job Seekers", value: "20K+" },
  { label: "Successful Hires", value: "8K+" },
];

const features: Feature[] = [
  {
    icon: Search,
    title: "Smart Job Search",
    description:
      "Search jobs by role, location, skills, and experience with a clean and fast hiring experience built for modern professionals.",
  },
  {
    icon: Briefcase,
    title: "Top Career Opportunities",
    description:
      "Explore openings from startups, growing companies, and enterprise teams — all in one streamlined platform.",
  },
  {
    icon: Building2,
    title: "Verified Companies",
    description:
      "Apply with confidence using trusted company profiles, real hiring insights, and curated open positions verified by our team.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Built with a professional candidate and recruiter workflow for a reliable, safe, and compliant hiring experience.",
  },
];

const categories: Category[] = [
  {
    icon: Code2,
    name: "Development",
    count: "2,340 open positions",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Palette,
    name: "UI/UX Design",
    count: "1,180 open positions",
    bg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    icon: BarChart2,
    name: "Data Science",
    count: "980 open positions",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Smartphone,
    name: "Mobile Apps",
    count: "760 open positions",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Megaphone,
    name: "Marketing",
    count: "1,450 open positions",
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    icon: Lock,
    name: "Cybersecurity",
    count: "620 open positions",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Cloud,
    name: "Cloud & DevOps",
    count: "890 open positions",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    icon: Bot,
    name: "AI / ML",
    count: "540 open positions",
    bg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
];

const companies: string[] = [
  "Google",
  "Microsoft",
  "Amazon",
  "Infosys",
  "TCS",
  "Accenture",
];

const popularSearches: string[] = [
  "UI Designer",
  "Frontend Dev",
  "Remote Work",
  "Data Science",
  "Marketing",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FloatCard: React.FC<{
  className: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sub?: string;
}> = ({ className, icon, iconBg, label, value, sub }) => (
  <div
    className={`absolute bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 ${className}`}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-base font-bold text-gray-900 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans overflow-x-hidden">

      {/* ── Header ── */}
   <Navbar />

      {/* ── Hero ── */}
      <section className="bg-white px-10 pt-16 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 border border-amber-100">
              <Sparkles className="w-4 h-4 shrink-0" />
              #1 Job Portal Platform in India
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-4">
              Find Your Dream Job
              <br />
              <span className="text-blue-600">Build Your Future</span>
            </h1>

            <p className="text-base leading-7 text-gray-500 max-w-lg mb-8">
              Discover thousands of job opportunities with all the information
              you need. It's your future. Come find it. Deciding your career
              path is easiest here.
            </p>

            {/* Search box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-md grid md:grid-cols-[1fr_1fr_auto] gap-2 mb-5">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keyword, or skill"
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
              <Link to="/jobs" className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
                Search Jobs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Popular searches */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-400 font-medium">Popular:</span>
              {popularSearches.map((tag) => (
                <Link
                  key={tag}
                  to="/jobs"
                  className="px-3.5 py-1.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors bg-white"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-gray-500">
              {["Verified Companies", "Easy Applications", "Recruiter Dashboard"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right – illustration + float cards */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl aspect-square flex items-end justify-center overflow-visible">
              {/* Person emoji stand-in */}
              <span className="text-[160px] leading-none select-none pb-0 drop-shadow-lg">
                👨‍💼
              </span>

              {/* Float card – top right */}
              <FloatCard
                className="top-6 -right-5"
                iconBg="bg-emerald-100"
                icon={<Users className="w-4 h-4 text-emerald-600" />}
                label="New Applicants Today"
                value="2,540+"
              />

              {/* Float card – bottom left */}
              <FloatCard
                className="bottom-12 -left-5"
                iconBg="bg-amber-100"
                icon={<TrendingUp className="w-4 h-4 text-amber-600" />}
                label="Hiring Growth"
                value="+28.4%"
                sub="vs last month"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="bg-white border-y border-gray-200 px-10 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-4 py-2">
              <div className="text-3xl font-extrabold text-blue-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Companies ── */}
      <div className="px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Trusted by growing teams and global brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {companies.map((company) => (
              <div
                key={company}
                className="px-6 py-2.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-500 bg-white hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="px-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">
              Browse Categories
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Popular Job Categories
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto leading-7">
              Explore opportunities across the most in-demand fields and find
              the role that matches your skills and ambitions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to="/categories"
                  className="group relative bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${cat.iconColor}`} />
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-1">
                    {cat.name}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {cat.count}
                  </div>
                  {/* Hover arrow */}
                  <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">
              Why Choose HireHub
            </p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Everything needed for modern hiring
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto leading-7">
              A professional platform for candidates and recruiters with clean
              workflows, trusted companies, and better visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex gap-5 items-start bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-6">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 px-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-600 rounded-3xl px-12 py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">
                Build your future with
                <br />
                the right opportunity
              </h2>
              <p className="text-blue-200 text-base leading-7 max-w-xl">
                Create your profile, explore quality openings, and connect with
                companies that are actively hiring right now.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
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

export default HomePage;