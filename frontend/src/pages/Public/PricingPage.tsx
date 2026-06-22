import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ArrowRight,
  Check,
  X,
  Zap,
  Building2,
  Crown,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  icon: React.ElementType;
  name: string;
  badge?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: PlanFeature[];
  cta: string;
  highlight: boolean;
  iconBg: string;
  iconColor: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  avatarColor: string;
  quote: string;
  plan: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const plans: Plan[] = [
  {
    icon: Zap,
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for individuals and small teams just getting started with hiring.",
    highlight: false,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    cta: "Get Started Free",
    features: [
      { text: "Post up to 3 active jobs", included: true },
      { text: "Basic candidate search", included: true },
      { text: "Company profile page", included: true },
      { text: "Email support", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Priority job listing", included: false },
      { text: "Dedicated account manager", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    icon: Building2,
    name: "Professional",
    badge: "Most Popular",
    monthlyPrice: 2999,
    yearlyPrice: 1999,
    description: "Built for growing companies that need more visibility and hiring tools.",
    highlight: true,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    cta: "Start Free Trial",
    features: [
      { text: "Post up to 20 active jobs", included: true },
      { text: "Advanced candidate search & filters", included: true },
      { text: "Featured company profile", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Priority job listing", included: true },
      { text: "Dedicated account manager", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    icon: Crown,
    name: "Enterprise",
    monthlyPrice: 7999,
    yearlyPrice: 5999,
    description: "For large organizations with custom hiring workflows and volume needs.",
    highlight: false,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    cta: "Contact Sales",
    features: [
      { text: "Unlimited active job postings", included: true },
      { text: "Full candidate search & AI matching", included: true },
      { text: "Premium company branding page", included: true },
      { text: "24/7 priority support", included: true },
      { text: "Custom analytics & reports", included: true },
      { text: "Top-sponsored job listings", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Full API access & integrations", included: true },
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: "Can I change my plan later?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time from your account settings. Upgrades take effect immediately, and downgrades apply at the end of your billing cycle.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes — both Professional and Enterprise plans come with a 14-day free trial, no credit card required. You'll have full access to all features during the trial period.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit and debit cards, UPI, Net Banking, and wallets. For Enterprise plans, we also support invoicing and bank transfers.",
  },
  {
    question: "How are 'active jobs' counted?",
    answer: "An active job is any listing that is currently live and visible to candidates. Closed or paused listings don't count toward your limit.",
  },
  {
    question: "Can I get a refund?",
    answer: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team within 7 days of your first charge for a full refund.",
  },
  {
    question: "Do you offer discounts for startups or NGOs?",
    answer: "Yes. We have special pricing for early-stage startups, non-profits, and educational institutions. Reach out to our team at support@hirehub.in to learn more.",
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Kavya Joshi",
    role: "HR Manager",
    company: "NovaTech Solutions",
    avatar: "KJ",
    avatarColor: "bg-blue-100 text-blue-700",
    quote: "HireHub's Professional plan cut our time-to-hire by 40%. The candidate filters alone are worth every rupee.",
    plan: "Professional",
  },
  {
    name: "Rajan Pillai",
    role: "Talent Acquisition Lead",
    company: "Growify Inc.",
    avatar: "RP",
    avatarColor: "bg-emerald-100 text-emerald-700",
    quote: "We scaled from 5 to 50 hires per month after switching to Enterprise. The dedicated manager is a game changer.",
    plan: "Enterprise",
  },
  {
    name: "Meena Gupta",
    role: "Founder",
    company: "CodeCraft Studio",
    avatar: "MG",
    avatarColor: "bg-purple-100 text-purple-700",
    quote: "Started on Starter and upgraded within 2 weeks. The quality of applicants here is unlike any other platform.",
    plan: "Starter → Professional",
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

const FAQItem: React.FC<{ faq: FAQ }> = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden transition-all ${open ? "border-blue-300" : "border-gray-200"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-7 py-5 text-left gap-4"
      >
        <span className="text-sm font-semibold text-gray-900">{faq.question}</span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-blue-600 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 -rotate-90" />
        )}
      </button>
      {open && (
        <div className="px-7 pb-6 text-sm text-gray-500 leading-7 border-t border-gray-100 pt-4">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const PricingPage: React.FC = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const getPrice = (plan: Plan): number =>
    billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

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
                  item.label === "Pricing"
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
            <span className="text-gray-700 font-medium">Pricing</span>
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Zap className="w-4 h-4" /> Simple, Transparent Pricing
            </div>
            <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-5">
              Plans for every <span className="text-blue-600">stage of growth</span>
            </h1>
            <p className="text-base text-gray-500 leading-7 mb-8">
              Whether you're a solo founder or a large enterprise HR team, we have a plan that fits. No hidden fees. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  billing === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  billing === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Yearly
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  Save 33%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="px-10 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = getPrice(plan);
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl p-8 transition-all ${
                  plan.highlight
                    ? "border-2 border-blue-500 shadow-xl shadow-blue-100"
                    : "border border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    {plan.badge}
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${plan.iconBg}`}>
                  <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>

                <div className="text-lg font-extrabold text-gray-900 mb-1">{plan.name}</div>
                <p className="text-sm text-gray-400 mb-6 leading-6">{plan.description}</p>

                <div className="mb-6">
                  {price === 0 ? (
                    <div className="text-4xl font-extrabold text-gray-900">Free</div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-sm font-semibold text-gray-400 mb-1.5">₹</span>
                      <span className="text-4xl font-extrabold text-gray-900">
                        {price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-gray-400 mb-1.5">/mo</span>
                    </div>
                  )}
                  {billing === "yearly" && price > 0 && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      Billed annually · Save ₹{((plan.monthlyPrice - price) * 12).toLocaleString("en-IN")}/yr
                    </p>
                  )}
                </div>

                <Link
                  to="/signup"
                  className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-7 transition-all ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-3">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {f.included ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                      <span className={`text-sm leading-5 ${f.included ? "text-gray-700" : "text-gray-400"}`}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-white px-10 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">Customer Stories</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Trusted by hiring teams across India</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-7 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold ${t.avatarColor}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}, {t.company}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                      {t.plan}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-10 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <HelpCircle className="w-4 h-4" /> FAQs
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Common questions</h2>
            <p className="text-base text-gray-500 leading-7">
              Still have questions? Email us at{" "}
              <a href="mailto:support@hirehub.in" className="text-blue-600 hover:underline">
                support@hirehub.in
              </a>
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-10 pb-20">
        <div className="max-w-7xl mx-auto bg-blue-600 rounded-3xl px-12 py-16 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-3">Ready to start hiring smarter?</h2>
            <p className="text-blue-200 text-base leading-7 max-w-xl">
              Join 4,800+ companies already using HireHub. Start free, upgrade when you're ready.
            </p>
          </div>
          <div className="flex gap-3 shrink-0 flex-wrap">
            <Link to="/signup" className="px-7 py-3.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="px-7 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
              Talk to Sales
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

export default PricingPage;