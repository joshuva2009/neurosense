import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Brain, ShieldCheck, Heart, ExternalLink, Sparkles, AlertTriangle } from 'lucide-react';

export const Footer = ({ onOpenEmergency, onOpenDesignThinking, setActivePage }) => {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-neuro-border/60 bg-neuro-dark/90 text-slate-400 text-sm">
      {/* Top Disclaimer Highlight Box */}
      <div className="bg-amber-950/30 border-b border-amber-500/20 px-4 py-4 text-xs text-amber-200/90">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white font-semibold">Medical Safety & Educational Notice: </strong>
            NeuroSense is a university Design Thinking research prototype for preliminary screening and longitudinal awareness.
            It is <strong className="text-amber-300">not a clinical diagnostic device</strong> and cannot independently diagnose,
            confirm, or rule out Alzheimer's disease, Parkinson's disease, dementia, or any neurological disorder.
            Always seek formal clinical evaluation from a licensed healthcare provider or neurologist for medical concerns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neuro-teal to-neuro-purple p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-neuro-teal" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white">NeuroSense</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.tagline}
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenDesignThinking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neuro-purple/20 text-neuro-purple-light border border-neuro-purple/30 text-xs font-semibold hover:bg-neuro-purple/30 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-neuro-teal" />
                Design Thinking Framework
              </button>
            </div>
          </div>

          {/* Quick Screening Tests */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Screening Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('tests')} className="hover:text-neuro-teal transition">
                  Memory Recall Test
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tests')} className="hover:text-neuro-teal transition">
                  Reaction Time Latency
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tests')} className="hover:text-neuro-teal transition">
                  Finger Tapping Motor Test
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tests')} className="hover:text-neuro-teal transition">
                  Cognitive Flexibility (Trail Making)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tests')} className="hover:text-neuro-teal transition">
                  Visual Pattern Recognition
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Education & Guides
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('disorders')} className="hover:text-neuro-teal transition">
                  Alzheimer's Disease Guide
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('disorders')} className="hover:text-neuro-teal transition">
                  Parkinson's Motor Biomarkers
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('disorders')} className="hover:text-neuro-teal transition">
                  Mild Cognitive Impairment (MCI)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('lifestyle')} className="hover:text-neuro-teal transition">
                  Sleep & Glymphatic Clearance
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('doctor')} className="hover:text-neuro-teal transition">
                  Questions for Your Neurologist
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3">
              Emergency & Safety
            </h4>
            <p className="text-xs text-slate-300 mb-3">
              Sudden facial droop, arm weakness, or slurred speech require urgent emergency medical care.
            </p>
            <button
              onClick={onOpenEmergency}
              className="w-full py-2 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Emergency F.A.S.T. Guide</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-neuro-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} NeuroSense • University Design Thinking Project Presentation</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neuro-teal" />
              Privacy-First Architecture
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Built for Accessible Healthcare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
