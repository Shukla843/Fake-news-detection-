// =============================================
// src/pages/LandingPage.jsx
// =============================================
// Public homepage. Animated hero section with
// feature highlights and CTA to sign up.

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const LandingPage = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);

  // ── GSAP Entrance Animation ─────────────────
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headlineRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9 }
    )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      )
      .fromTo(
        featuresRef.current?.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
        "-=0.2"
      );
  }, []);

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Analysis",
      desc: "Advanced language models analyze news patterns, language style, and factual consistency.",
    },
    {
      icon: "⚡",
      title: "Instant Results",
      desc: "Get a Fake / Real / Suspicious verdict with confidence score in seconds.",
    },
    {
      icon: "📊",
      title: "Personal Dashboard",
      desc: "Track your analysis history, see stats, and review past results anytime.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      desc: "JWT authentication with HTTP-only cookies. Your data stays yours.",
    },
  ];

  return (
    <div ref={heroRef} className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Hero Section ── */}
      <section className="relative max-w-5xl mx-auto px-4 pt-20 pb-24 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-xs text-accent-light font-medium tracking-wide">
            AI-Powered Fact Checking
          </span>
        </div>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl font-display font-extrabold text-white leading-[1.05] mb-6"
        >
          Stop Spreading
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
            Fake News
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Paste any news article or text and get an instant AI analysis.
          Know if it's <span className="text-green-400 font-medium">Real</span>,{" "}
          <span className="text-red-400 font-medium">Fake</span>, or{" "}
          <span className="text-yellow-400 font-medium">Suspicious</span> — with
          a detailed explanation and confidence score.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/signup"
            className="group relative bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5"
          >
            <span className="relative z-10">Start Detecting Free →</span>
          </Link>
          <Link
            to="/login"
            className="text-slate-400 hover:text-white border border-border hover:border-slate-500 px-8 py-3.5 rounded-xl transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Demo Preview ── */}
      <section className="max-w-3xl mx-auto px-4 mb-24">
        <div className="glass-card rounded-2xl p-6 border border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500 ml-2">TruthScan Analysis</span>
          </div>
          <div className="bg-surface rounded-xl p-4 text-sm text-slate-400 mb-4 border border-border font-mono">
            "Scientists discover that drinking coffee every morning can cure all
            diseases. The mainstream media is hiding this revolutionary
            breakthrough from the public..."
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="badge-fake px-3 py-1 rounded-full text-sm font-semibold font-display flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ⚠️ Fake
              </span>
              <span className="text-slate-400 text-sm">92% confidence</span>
            </div>
            <div className="text-xs text-slate-500">Analyzed in 1.2s</div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <h2 className="text-center text-3xl font-display font-bold text-white mb-2">
          Why TruthScan?
        </h2>
        <p className="text-center text-slate-500 mb-12">
          Built for clarity. Designed for trust.
        </p>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card rounded-xl p-6 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-accent-light transition-colors">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-2xl mx-auto px-4 pb-24 text-center">
        <div className="glass-card rounded-2xl p-10 border border-accent/20">
          <h2 className="text-3xl font-display font-bold text-white mb-3">
            Ready to fact-check?
          </h2>
          <p className="text-slate-400 mb-6">
            Join thousands fighting misinformation with AI.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-accent/25 hover:-translate-y-0.5"
          >
            Create Free Account →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
