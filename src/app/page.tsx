'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Github,
  ArrowRight,
  Search,
  Code2,
  Map,
  BarChart3,
  ShieldAlert,
  Compass,
  CheckCircle2,
  AlertCircle,
  Folder,
  FileText,
  ChevronDown,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { CTASection } from '@/components/ui/hero-dithering-card';

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const supabase = createClient();

    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInitialAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Redirect to login or dashboard with the URL context
    const nextPath = user ? `/dashboard?url=${encodeURIComponent(url)}` : `/login?next=${encodeURIComponent(`/dashboard?url=${url}`)}`;
    router.push(nextPath);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen text-[#1A1A1A] font-sans selection:bg-[#FFBF78]/30">

      {/* Sticky Navigation Header */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#1A1A1A]/5 h-16' : 'bg-transparent h-20'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1A1A1A]">
            CheckBeforeCommit
          </Link>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-sm font-medium text-[#1A1A1A]/60 hover:text-[#FF7D29] transition-colors">How It Works</Link>
            <Link href="#who-it-is-for" className="text-sm font-medium text-[#1A1A1A]/60 hover:text-[#FF7D29] transition-colors">Who It's For</Link>
            <Link href="#pricing" className="text-sm font-medium text-[#1A1A1A]/60 hover:text-[#FF7D29] transition-colors">Pricing</Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            <Button
              onClick={() => {
                if (user) {
                  router.push('/dashboard');
                } else {
                  router.push('/login');
                }
              }}
              className="bg-[#FF7D29] hover:bg-[#FF7D29]/90 text-white px-6 h-11 text-sm font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Dynamic Hero Section */}
        <div ref={heroRef} className="px-6 pt-0 pb-24">
          <CTASection>
            <div className="w-full max-w-2xl mx-auto space-y-6">
              <form onSubmit={handleInitialAnalyze} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                  <Input
                    placeholder="https://github.com/owner/repository"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-14 pl-12 bg-white border-[#1A1A1A]/10 focus:border-[#FF7D29] focus:ring-[#FF7D29]/20 text-md rounded-xl shadow-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-14 px-8 bg-[#FF7D29] hover:bg-[#FF7D29]/90 text-white font-bold text-md rounded-xl shadow-md transition-all whitespace-nowrap"
                >
                  Analyze for Free
                </Button>
              </form>

              <div className="flex items-center justify-center gap-6 pt-4">
                <button
                  onClick={() => router.push('/dashboard/history')}
                  className="text-sm font-semibold flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                  View Sample Analysis <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CTASection>
        </div>

        {/* Problem Section: Problem-Driven Redesign */}
        <section className="py-24 bg-white border-y border-[#1A1A1A]/5">
          <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-[60%_40%] gap-12 items-center">

            {/* Left: Pain Statements */}
            <div className="space-y-12">
              <h2 className="text-[48px] md:text-[56px] font-bold tracking-tight text-[#1A1A1A] leading-[1.1]">
                Stop Wasting Hours Reading Code Blindly.
              </h2>

              <div className="relative pl-8 space-y-8">
                {/* Vertical Accent Line */}
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-neutral-300" />
                {[
                  "Untangling unfamiliar folder hierarchies without context.",
                  "Reading outdated READMEs that don’t match the system.",
                  "Tracing deep imports just to find the real entry point.",
                  "Building mental maps that disappear overnight.",
                  "Guessing the impact of changes in high-risk modules."
                ].map((item, idx) => (
                  <p key={idx} className="text-[18px] md:text-[20px] text-neutral-500 font-medium leading-[1.6]">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Subtle Visual Tension Element */}
            <div className="relative group flex justify-center md:justify-end">
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm aspect-[4/5] w-full max-w-[340px] flex flex-col blur-[4px] opacity-40 select-none pointer-events-none transition-all duration-700">
                {/* Minimal Mockup Header */}
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-neutral-200" />
                    <div className="w-2 h-2 rounded-full bg-neutral-200" />
                  </div>
                </div>

                {/* Mockup Tree - Architecture Only */}
                <div className="p-6 space-y-5">
                  {[0, 1, 2, 2, 1, 2, 2, 3, 0, 0].map((depth, i) => (
                    <div key={i} className="flex items-center gap-3" style={{ paddingLeft: `${depth * 20}px` }}>
                      <div className="w-4 h-4 rounded bg-neutral-100 shrink-0" />
                      <div className={`h-2 bg-neutral-100 rounded`} style={{ width: `${Math.random() * 40 + 40}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay Text */}
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 px-8 py-6 rounded-2xl shadow-xl">
                  <p className="text-xl md:text-2xl font-bold text-neutral-800 tracking-tight">
                    "Where do you even start?"
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Relief Section: What You Actually Get */}
        <section className="py-24 bg-white border-b border-[#1A1A1A]/5">
          <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-[1fr_1fr] gap-20 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">
                  What You Actually Get
                </h2>
                <p className="text-xl text-neutral-500 leading-relaxed">
                  A high-fidelity mental model of the codebase, generated in seconds. No more guessing.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { title: "Architectural Clarity", desc: "Understand high-level intent and core design patterns immediately." },
                  { title: "Risk Identification", desc: "Spot fragile modules and high-coupling hazards before they bite." },
                  { title: "Entry Point Discovery", desc: "Find exactly where the system starts and how data flows through it." }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <h3 className="text-lg font-bold text-[#1A1A1A]">{item.title}</h3>
                    <p className="text-neutral-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual: Clean Result Preview */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Analysis Preview</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-[60%] bg-neutral-200 rounded-md" />
                  <div className="h-3 w-[100%] bg-neutral-100 rounded-md" />
                  <div className="h-3 w-[90%] bg-neutral-100 rounded-md" />
                </div>
                <div className="pt-4 space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded bg-white border border-neutral-200" />
                      <div className="h-3 flex-1 bg-neutral-100 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works: SaaS Step Card Layout */}
        <section id="how-it-works" className="bg-white py-[140px] border-b border-[#1A1A1A]/5">
          <div className="max-w-[1200px] mx-auto px-6 space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">How It Works</h2>
              <p className="text-[#1A1A1A]/60 text-lg">From repository link to structured technical clarity.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Paste Repository Link",
                  desc: "Provide a public GitHub URL. No tokens or special permissions required for public code."
                },
                {
                  step: "02",
                  title: "Automated Structural Analysis",
                  desc: "Our engine scans folder structure, dependencies, and code patterns to understand architecture and complexity."
                },
                {
                  step: "03",
                  title: "Structured Technical Breakdown",
                  desc: "Receive a focused report highlighting architecture, risk areas, maintainability signals, and entry points."
                },
              ].map((item, i) => (
                <div key={i} className="relative bg-gradient-to-br from-white to-[#FFF5ED] rounded-xl p-10 shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col items-start gap-8 min-h-[320px] border border-[#FF782D]/10 group overflow-hidden">
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF782D]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#FF782D]/10 transition-colors" />

                  {/* Step Badge */}
                  <div className="w-10 h-10 bg-[#FF782D] rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>

                  <div className="space-y-4 text-[#1A1A1A] relative z-10">
                    <h3 className="text-xl font-bold text-[#1A1A1A]">{item.title}</h3>
                    <p className="text-[#1A1A1A]/70 leading-[1.7] text-md font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For: 3-Column Card Layout */}
        <section id="who-it-is-for" className="py-[140px] bg-[#F9FAFB] border-b border-[#1A1A1A]/5">
          <div className="max-w-[1200px] mx-auto px-6 space-y-20">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">Built for engineers who deal with unfamiliar code.</h2>
              <p className="text-[#1A1A1A]/60 text-lg">Understand architecture, structure, and real complexity — before you commit time to a repository.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* Left Card: OSS */}
              <div className="bg-white rounded-[24px] p-10 border border-[#1A1A1A]/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6 group">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Engineers Exploring Open Source</h3>
                <p className="text-[#1A1A1A]/70 leading-relaxed text-md">
                  Before adopting a new dependency, quickly understand structure, entry points, and architectural signals — without manually reading the entire repo.
                </p>
                <div className="mt-auto pt-4 flex items-center gap-2 text-[#FF782D] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Verify Architecture <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Center Card: Onboarding (Highlighted) */}
              <div className="relative bg-white rounded-[24px] p-10 border border-[#FF782D]/20 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col gap-6 ring-1 ring-[#FF782D]/5 -mt-4 md:-mt-8 mb-4 md:mb-8 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#FF782D] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md">
                  Core Use Case
                </div>

                <h3 className="text-xl font-bold text-[#1A1A1A]">Developers Onboarding to Existing Codebases</h3>
                <p className="text-[#1A1A1A]/70 leading-relaxed text-md">
                  When joining a new team or inheriting legacy code, identify core modules, patterns, and risk areas in minutes — not days.
                </p>

                {/* Abstract Repo Diagram Visual */}
                <div className="mt-4 h-24 w-full bg-[#FF782D]/5 rounded-xl border border-[#FF782D]/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col gap-2 p-4">
                    <div className="flex gap-2">
                      <div className="h-2 w-12 bg-[#FF782D]/20 rounded" />
                      <div className="h-2 w-20 bg-[#FF782D]/10 rounded" />
                    </div>
                    <div className="ml-4 h-2 w-16 bg-[#FF782D]/10 rounded" />
                    <div className="ml-8 flex gap-2">
                      <div className="h-2 w-8 bg-[#FF782D]/40 rounded" />
                      <div className="h-2 w-12 bg-[#FF782D]/10 rounded" />
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-2 text-[#FF782D] font-bold text-sm">
                  Speed up Onboarding <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Right Card: Senior Review */}
              <div className="bg-white rounded-[24px] p-10 border border-[#1A1A1A]/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6 group">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Senior Engineers Reviewing Technical Fit</h3>
                <p className="text-[#1A1A1A]/70 leading-relaxed text-md">
                  Before approving integrations or refactors, get a high-level architectural understanding without digging through every file.
                </p>
                <div className="mt-auto pt-4 flex items-center gap-2 text-[#FF782D] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Audit Systems <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing: Clean 2-Column SaaS Layout */}
        <section id="pricing" className="bg-[#F9FAFB] py-[140px] border-t border-[#1A1A1A]/5">
          <div className="max-w-[1200px] mx-auto px-6 space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">Simple, transparent pricing.</h2>
              <p className="text-[#1A1A1A]/60 text-lg font-medium">Cheaper than one hour of engineering time.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Free Tier Card */}
              <div className="bg-white border border-[#1A1A1A]/5 rounded-[32px] p-10 shadow-sm flex flex-col gap-8 transition-all hover:shadow-md">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#1A1A1A]">Free</h3>
                    <p className="text-sm font-medium text-[#1A1A1A]/50">For exploring and testing</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-[#1A1A1A]">$0</span>
                    <span className="text-sm font-medium text-[#1A1A1A]/40">/ forever</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <p className="text-sm font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Includes:</p>
                  <ul className="space-y-4">
                    {[
                      { included: true, text: "4 deep repo analyses (lifetime)" },
                      { included: true, text: "Architecture mapping & entry points" },
                      { included: true, text: "Basic structural overview" },
                      { included: false, text: "Analysis history" },
                      { included: false, text: "Large repository support" },
                      { included: false, text: "Priority processing" },
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-[#FF782D]" />
                        ) : (
                          <X className="w-4 h-4 text-[#1A1A1A]/20" />
                        )}
                        <span className={feature.included ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => router.push('/login')}
                  className="w-full h-14 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white font-bold rounded-2xl transition-all"
                >
                  Start Free
                </Button>
              </div>

              {/* Pro Tier Card (Highlighted) */}
              <div className="relative bg-white border-2 border-[#FF782D]/20 rounded-[32px] p-10 shadow-xl flex flex-col gap-8 transition-all hover:shadow-2xl ring-1 ring-[#FF782D]/5 scale-105 z-10">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#FF782D] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Recommended
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#1A1A1A]">Pro</h3>
                    <p className="text-sm font-medium text-[#1A1A1A]/50">For engineers evaluating code daily</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-[#1A1A1A]">$15</span>
                    <span className="text-sm font-medium text-[#1A1A1A]/40">/ month</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <p className="text-sm font-bold text-[#FF782D] uppercase tracking-widest">All Free features, plus:</p>
                  <ul className="space-y-4">
                    {[
                      { included: true, text: "Unlimited analyses (fair use)" },
                      { included: true, text: "Large repository support" },
                      { included: true, text: "Detailed architecture breakdown" },
                      { included: true, text: "Risk & complexity signals" },
                      { included: true, text: "Analysis history" },
                      { included: true, text: "Priority processing" },
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium">
                        <Check className="w-4 h-4 text-[#FF782D]" />
                        <span className="text-[#1A1A1A]">{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => router.push('/login')}
                  className="w-full h-14 bg-[#FF782D] hover:bg-[#FF782D]/90 text-white font-bold rounded-2xl shadow-lg transition-all"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* High-Impact Final CTA Hero Block */}
        <section className="py-[140px] px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="relative bg-gradient-to-br from-[#FF782D] to-[#F04B3E] rounded-[48px] p-12 md:p-24 text-center space-y-10 shadow-2xl overflow-hidden group">
              {/* Decorative Lighting Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />

              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-white">
                  Stop guessing. Start knowing.
                </h2>
                <p className="text-lg md:text-xl text-white/80 font-medium">
                  Get a structured technical breakdown of any GitHub repository in minutes.
                </p>
              </div>

              <div className="relative z-10 pt-4">
                <Button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="h-16 px-12 bg-white hover:bg-white/95 text-[#111] font-bold text-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0.5"
                >
                  Analyze Your First Repository
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative bg-[#F7F7F7] text-[#1A1A1A] pt-24 pb-12 px-6 overflow-hidden border-t border-[#1A1A1A]/5">
        {/* Brand Watermark */}
        <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 select-none pointer-events-none w-full text-center">
          <h2 className="text-[12vw] font-black text-[#1A1A1A] opacity-[0.02] tracking-[0.2em] uppercase leading-none">
            CheckBeforeCommit
          </h2>
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-24">
            {/* Column 1 - Brand */}
            <div className="col-span-2 md:col-span-1 space-y-6">
              <Link href="/" className="text-xl font-bold tracking-tight text-[#1A1A1A]">
                CheckBeforeCommit
              </Link>
              <p className="text-[#1A1A1A]/40 text-sm leading-relaxed max-w-xs">
                Structured technical insights for engineers working with unfamiliar codebases.
              </p>
            </div>

            {/* Column 2 - Product */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/90">Product</h4>
              <ul className="space-y-4 text-sm text-[#1A1A1A]/50">
                <li><Link href="#how-it-works" className="hover:text-[#FF7D29] transition-colors">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-[#FF7D29] transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-[#FF7D29] transition-colors">Docs</Link></li>
                <li><Link href="/changelog" className="hover:text-[#FF7D29] transition-colors">Changelog</Link></li>
              </ul>
            </div>

            {/* Column 3 - Legal */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/90">Legal</h4>
              <ul className="space-y-4 text-sm text-[#1A1A1A]/50">
                <li><Link href="/tos" className="hover:text-[#FF7D29] transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-[#FF7D29] transition-colors">Privacy Policy</Link></li>
                <li><Link href="mailto:support@checkbeforecommit.com" className="hover:text-[#FF7D29] transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#1A1A1A]/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/30">
            <div>
              &copy; 2026 CheckBeforeCommit
            </div>
            <div className="flex items-center gap-2">
              Made for engineers <Github className="w-3 h-3 text-[#1A1A1A]/40" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
