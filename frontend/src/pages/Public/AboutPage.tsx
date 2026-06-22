import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ArrowRight,
  Target,
  Heart,
  Zap,
  Users,
  Globe,
  TrendingUp,
  Award,
  ChevronRight,



} from "lucide-react";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

import { FaLinkedin } from "react-icons/fa6";
// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  FaLinkedin?: string;
  FaTwitter?: string;
  FaGithub?: string;
}

interface Value {
  icon: React.ElementType;
  title: string;
  description: string;
  bg: string;
  iconColor: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const values: Value[] = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're on a mission to make quality employment accessible to everyone, everywhere in India and beyond.",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Heart,
    title: "People First",
    description: "Every feature we build starts with empathy — for job seekers, recruiters, and the teams they'll join.",
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    icon: Zap,
    title: "Speed & Simplicity",
    description: "Great hiring shouldn't be complicated. We obsess over workflows that are fast, clean, and intuitive.",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    icon: Globe,
    title: "Inclusive Growth",
    description: "We champion diversity by connecting talent from Tier-2 cities to global companies and vice versa.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const team: TeamMember[] = [
  {
    name: "Arjun Sharma",
    role: "Co-Founder & CEO",
    avatar: "AS",
    bio: "Former product lead at a Fortune 500 tech company. Passionate about democratizing career growth in India.",
    FaLinkedin: "#",
    FaTwitter: "#",
  },
  {
    name: "Priya Nair",
    role: "Co-Founder & CTO",
    avatar: "PN",
    bio: "10+ years in scalable systems engineering. Built platforms used by millions across Southeast Asia.",
    FaLinkedin: "#",
    FaGithub: "#",
  },
  {
    name: "Rahul Mehta",
    role: "Head of Product",
    avatar: "RM",
    bio: "Product thinker with a background in UX research and B2B SaaS. Loves turning feedback into features.",
    FaLinkedin: "#",
    FaTwitter: "#",
  },
  {
    name: "Sneha Iyer",
    role: "Head of Growth",
    avatar: "SI",
    bio: "Growth marketer with stints at two unicorn startups. Obsessed with organic reach and community building.",
    FaTwitter: "#",
    FaLinkedin: "#",
  },
  {
    name: "Dev Kulkarni",
    role: "Lead Engineer",
    avatar: "DK",
    bio: "Full-stack developer and open-source contributor. Championing performance and accessibility at HireHub.",
    FaGithub: "#",
    FaLinkedin: "#",
  },
  {
    name: "Ananya Reddy",
    role: "Design Lead",
    avatar: "AR",
    bio: "Product designer with a love for systems thinking and crisp visual hierarchy. Based in Hyderabad.",
    FaLinkedin: "#",
    FaTwitter: "#",
  },
];

const milestones: Milestone[] = [
  { year: "2021", title: "Founded in Nagpur", description: "HireHub started as a side project to help local engineering graduates find quality jobs." },
  { year: "2022", title: "1,000 Companies Onboarded", description: "We crossed our first major milestone with companies across 12 Indian cities joining the platform." },
  { year: "2023", title: "Seed Funding Raised", description: "Secured ₹5Cr seed funding to scale engineering and expand to 30+ cities." },
  { year: "2024", title: "Pan-India Expansion", description: "Launched remote job listings and crossed 10,000 successful placements nationwide." },
  { year: "2025", title: "International Reach", description: "Opened listings for global remote roles and partnered with 50+ international companies." },
  { year: "2026", title: "20K+ Job Seekers", description: "Today, HireHub serves over 20,000 active job seekers and 4,800+ verified companies." },
];

const stats: Stat[] = [
  { value: "12K+", label: "Active Jobs", icon: Briefcase, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  { value: "4.8K+", label: "Hiring Companies", icon: Globe, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { value: "20K+", label: "Job Seekers", icon: Users, iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  { value: "8K+", label: "Successful Hires", icon: TrendingUp, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
];

// ─── Avatar colors ─────────────────────────────────────────────────────────────

const avatarColors: Record<string, string> = {
  AS: "bg-blue-100 text-blue-700",
  PN: "bg-emerald-100 text-emerald-700",
  RM: "bg-purple-100 text-purple-700",
  SI: "bg-rose-100 text-rose-600",
  DK: "bg-amber-100 text-amber-700",
  AR: "bg-indigo-100 text-indigo-700",
};

// ─── Component ────────────────────────────────────────────────────────────────

const AboutPage: React.FC = () => {
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
                  item.label === "About Us"
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

      {/* ── Hero ── */}
      <section className="bg-white px-10 pt-14 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">About Us</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                <Award className="w-4 h-4" /> Est. 2021 · Nagpur, India
              </div>
              <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-5">
                We're building the future of <span className="text-blue-600">hiring in India</span>
              </h1>
              <p className="text-base text-gray-500 leading-7 mb-6">
                HireHub was born from a simple frustration — finding a great job in India shouldn't require knowing the right people or paying exorbitant placement fees. We set out to fix that.
              </p>
              <p className="text-base text-gray-500 leading-7">
                Today, we connect over 20,000 professionals with 4,800+ verified companies across every industry. Our platform is designed to make hiring faster, fairer, and more transparent for everyone.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.iconBg}`}>
                      <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">Our Values</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">What drives us every day</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto leading-7">
              These aren't just words on a wall — they're the principles that guide every product decision, every hire, and every interaction.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-400 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${val.bg}`}>
                    <Icon className={`w-6 h-6 ${val.iconColor}`} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-sm text-gray-500 leading-6">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-white px-10 py-20 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">Our Journey</p>
            <h2 className="text-4xl font-extrabold text-gray-900">How we got here</h2>
          </div>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-8 items-start relative">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-md z-10">
                    <span className="text-white text-xs font-extrabold">{m.year}</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 flex-1 hover:border-blue-300 transition-colors">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{m.title}</h3>
                    <p className="text-sm text-gray-500 leading-6">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="px-10 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">The Team</p>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Meet the people behind HireHub</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto leading-7">
              A small, passionate team of builders, designers, and growth experts united by the mission to transform hiring in India.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white border border-gray-200 rounded-2xl p-7 hover:border-blue-400 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-extrabold ${avatarColors[member.avatar] ?? "bg-gray-100 text-gray-600"}`}>
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-base">{member.name}</div>
                    <div className="text-sm text-blue-600 font-medium">{member.role}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-6 mb-5">{member.bio}</p>
                <div className="flex items-center gap-3">
                  {member.FaLinkedin && (
                    <a href={member.FaLinkedin} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <FaLinkedin className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                  {member.FaTwitter && (
                    <a href={member.FaTwitter} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-sky-400 hover:bg-sky-50 transition-all">
                      <FaTwitter className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                  {member.FaGithub && (
                    <a href={member.FaGithub} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:bg-gray-100 transition-all">
                      <FaGithub className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-10 pb-20">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-3xl px-12 py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-3">Want to join our team?</h2>
            <p className="text-blue-200 text-base leading-7 max-w-xl">We're always looking for passionate people who want to make a difference in how the world hires.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/jobs" className="px-7 py-3.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              View Open Roles <ArrowRight className="w-4 h-4" />
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

export default AboutPage;