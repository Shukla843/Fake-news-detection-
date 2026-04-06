// =============================================
// src/pages/AnalyzePage.jsx
// =============================================
// Core feature page. User pastes news text,
// clicks analyze, and sees AI result with GSAP
// reveal animation.

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import ResultBadge from "../components/ResultBadge";
import ConfidenceMeter from "../components/ConfidenceMeter";

// Sample news texts users can try quickly
const SAMPLE_TEXTS = [
  {
    label: "Try: Fake example",
    text: "BREAKING: Scientists have discovered that drinking lemon water with baking soda CURES cancer overnight. The pharmaceutical industry is desperately trying to hide this miracle remedy that doctors don't want you to know about. Share before this gets deleted!",
  },
  {
    label: "Try: Real example",
    text: "According to a study published in the New England Journal of Medicine, researchers found that regular physical exercise reduces the risk of cardiovascular disease by approximately 35%. The study followed 10,000 participants over 5 years and controlled for various lifestyle factors.",
  },
  {
    label: "Try: Suspicious example",
    text: "Sources say the government is planning secret economic reforms that will affect millions. An anonymous insider confirmed the changes are imminent but refused to provide details. Market analysts are divided on the potential impact.",
  },
];

const AnalyzePage = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  // Animate result card in when it appears
  useEffect(() => {
    if (result && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.2)",
        }
      );
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (inputText.trim().length < 20) {
      toast.error("Please enter at least 20 characters of news text");
      return;
    }

    setIsLoading(true);
    setResult(null); // Clear previous result

    try {
      const res = await axiosInstance.post("/news/analyze", { inputText });
      setResult(res.data.result);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
  };

  // Color for result background glow
  const glowColor = {
    Fake: "rgba(239, 68, 68, 0.08)",
    Real: "rgba(34, 197, 94, 0.08)",
    Suspicious: "rgba(245, 158, 11, 0.08)",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-bold text-white mb-3">
          Analyze News
        </h1>
        <p className="text-slate-400">
          Paste any news article, headline, or text below and let AI verify it.
        </p>
      </div>

      <div ref={formRef}>
        {/* ── Input Section ── */}
        <div className="glass-card rounded-2xl p-6 mb-5">
          {/* Quick sample buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.label}
                onClick={() => setInputText(sample.text)}
                className="text-xs px-3 py-1.5 bg-panel border border-border rounded-lg text-slate-400 hover:text-white hover:border-accent/40 transition-all"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your news article, headline, or text here...

Example: 'Scientists announce that drinking 8 glasses of water per day reduces cancer risk by 50%, according to a Harvard study published this week...'"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent transition-colors text-sm leading-relaxed resize-none"
            rows={8}
          />

          {/* Character count */}
          <div className="flex justify-between items-center mt-2 mb-4">
            <span
              className={`text-xs ${
                inputText.length < 20 ? "text-red-400" : "text-slate-500"
              }`}
            >
              {inputText.length} characters{" "}
              {inputText.length < 20 && inputText.length > 0
                ? "(minimum 20)"
                : ""}
            </span>
            {inputText && (
              <button
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors"
              >
                Clear ✕
              </button>
            )}
          </div>

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={isLoading || inputText.trim().length < 20}
            className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-accent/20 hover:-translate-y-0.5 disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Analyzing with AI...
              </>
            ) : (
              <>
                🧠 Analyze News
              </>
            )}
          </button>
        </div>

        {/* ── Loading indicator ── */}
        {isLoading && (
          <div className="glass-card rounded-2xl p-8 text-center mb-5 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            </div>
            <p className="text-slate-400 text-sm">
              AI is analyzing the news article...
            </p>
            <p className="text-slate-600 text-xs mt-1">
              Checking language patterns, credibility signals, and factual consistency
            </p>
          </div>
        )}

        {/* ── Result Card ── */}
        {result && !isLoading && (
          <div
            ref={resultRef}
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: glowColor[result.label],
              borderColor:
                result.label === "Fake"
                  ? "rgba(239,68,68,0.3)"
                  : result.label === "Real"
                  ? "rgba(34,197,94,0.3)"
                  : "rgba(245,158,11,0.3)",
            }}
          >
            {/* Result header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">
                  Analysis Result
                </p>
                <ResultBadge label={result.label} size="lg" />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Analysis ID</p>
                <p className="text-xs text-slate-400 font-mono">
                  #{result._id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Confidence meter */}
            <div className="mb-6">
              <ConfidenceMeter
                confidence={result.confidence}
                label={result.label}
              />
            </div>

            {/* Explanation */}
            <div className="bg-ink/40 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                🧠 AI Explanation
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.explanation}
              </p>
            </div>

            {/* Analyze another button */}
            <button
              onClick={handleClear}
              className="mt-5 w-full border border-white/10 hover:border-white/20 text-slate-400 hover:text-white py-2.5 rounded-xl transition-all text-sm"
            >
              Analyze Another Article →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;
