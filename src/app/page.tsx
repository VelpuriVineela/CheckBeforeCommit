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

    const checkUserAndRedirect = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        router.push('/dashboard');
      }
      setUser(currentUser);
    };
    checkUserAndRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.push('/dashboard');
      }
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
  }, [router]);

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

        {/* Impactful Problem/Context Section */}
        <section className="py-[120px] border-y border-[#1A1A1A]/5 bg-[#FAFAFA]">
          <div className="max-w-[1100px] mx-auto px-6 text-center space-y-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] max-w-3xl mx-auto leading-tight">
              Built for Engineers Who Don't Have Time to Guess
            </h2>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                {
                  title: "Adopting a new repo?",
                  text: "Identify architectural risks and coupling hotspots before committing your time."
                },
                {
                  title: "Joining a team?",
                  text: "Understand the system structure and entry points before your first PR."
                },
                {
                  title: "Planning a refactor?",
                  text: "Measure blast radius and dependency gravity to move with confidence."
                }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white border border-[#1A1A1A]/5 shadow-sm space-y-4">
                  <h3 className="text-xl font-bold text-[#1A1A1A]">{item.title}</h3>
                  <p className="text-[#1A1A1A]/60 leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Actual Output Alignment Section */}
        <section className="py-[120px] bg-white border-b border-[#1A1A1A]/5">
          <div className="max-w-[1100px] mx-auto px-6 space-y-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A] text-center">
              What You Actually Get
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Architecture Map",
                  desc: "Core modules, dependency flow, and critical entry points mapped in seconds."
                },
                {
                  title: "Risk Analysis",
                  desc: "Identify coupling hotspots and measure the blast radius of potential changes."
                },
                {
                  title: "Quality Benchmarks",
                  desc: "Engineering Maturity Index, maintainability scores, and modularity assessments."
                },
                {
                  title: "15-Min Onboarding",
                  desc: "A verified path: where to start reading and what to avoid in unfamiliar code."
                }
              ].map((card, idx) => (
                <div key={idx} className="p-8 rounded-3xl border border-[#1A1A1A]/5 bg-[#FAFAFA] flex flex-col justify-between hover:border-[#FF7D29]/20 transition-colors group">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#FF7D29] transition-colors">{card.title}</h3>
                    <p className="text-sm text-[#1A1A1A]/60 leading-relaxed font-medium">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
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
        <section className="py-20 md:py-[140px] px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="relative bg-gradient-to-br from-[#FF782D] to-[#F04B3E] rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-center space-y-10 shadow-2xl overflow-hidden group">
              {/* Decorative Lighting Effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />

              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-6xl font-bold tracking-tight leading-tight text-white">
                  Stop guessing. Start knowing.
                </h2>
                <p className="text-base md:text-xl text-white/80 font-medium">
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

      <footer className="bg-[#F7F7F7] pt-24 pb-12 px-6 border-t border-[#1A1A1A]/5">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold tracking-tight text-[#1A1A1A]">
              CheckBeforeCommit
            </Link>
            <p className="text-[#1A1A1A]/40 text-sm">
              © 2026 CheckBeforeCommit<br />
              A codebase understanding engine for engineers.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-[#1A1A1A]/60">
            <Link href="mailto:support@checkbeforecommit.com" className="hover:text-[#FF7D29] transition-colors">Contact</Link>
            <Link href="https://github.com/VelpuriVineela/CheckBeforeCommit" target="_blank" className="hover:text-[#FF7D29] transition-colors flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
