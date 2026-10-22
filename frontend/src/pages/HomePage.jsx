import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Brain3DVisualizer } from '../components/Brain3DVisualizer';
import {
  Brain,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  Stethoscope,
  ShieldAlert,
  Zap,
  Clock,
  Play,
  HeartPulse,
  Award
} from 'lucide-react';

export const HomePage = ({ setActivePage, setSelectedTestKey }) => {
  const { t } = useLanguage();
  const { user, loginGuest } = useAuth();

  const handleStartAssessment = async () => {
    if (!user) {
      await loginGuest();
    }
    setActivePage('tests');
  };

  const handleLobeSelectTest = (testKey) => {
    if (setSelectedTestKey) {
      setSelectedTestKey(testKey);
    }
    setActivePage('tests');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neuro-teal/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-neuro-purple/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-neuro-teal/30 shadow-md">
              <Sparkles className="w-4 h-4 text-neuro-teal animate-pulse" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {t.hero.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              {t.hero.titleStart}{' '}
              <span className="bg-gradient-to-r from-neuro-teal via-cyan-400 to-neuro-purple bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={handleStartAssessment}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-neuro-teal via-cyan-400 to-neuro-teal hover:bg-cyan-300 text-slate-950 font-extrabold text-base shadow-xl shadow-neuro-teal/25 hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2.5"
              >
                <span>{t.hero.startAssessment}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('brain-3d-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-base border border-neuro-border transition flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5 text-neuro-purple-light" />
                <span>{t.hero.exploreBrain3D}</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-black text-white">8</div>
                <div className="text-xs text-slate-400 mt-0.5">Screening Modules</div>
              </div>
              <div>
                <div className="text-2xl font-black text-neuro-teal">6</div>
                <div className="text-xs text-slate-400 mt-0.5">Cognitive Domains</div>
              </div>
              <div>
                <div className="text-2xl font-black text-neuro-purple-light">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Free & Accessible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Brain Anatomy Explorer */}
      <section id="brain-3d-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.brain3D.title}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {t.brain3D.subtitle}
          </p>
        </div>

        <Brain3DVisualizer onSelectTest={handleLobeSelectTest} />
      </section>

      {/* Why Early Neurological Screening Matters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.whyScreening.title}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            {t.whyScreening.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.whyScreening.cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/90 border border-neuro-border hover:border-slate-700 transition shadow-xl space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-neuro-teal/20 to-neuro-purple/20 border border-neuro-teal/30 flex items-center justify-center text-neuro-teal">
                {idx === 0 && <ShieldAlert className="w-6 h-6" />}
                {idx === 1 && <TrendingUp className="w-6 h-6" />}
                {idx === 2 && <Stethoscope className="w-6 h-6" />}
                {idx === 3 && <Activity className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-bold text-white">{card.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8 Screening Activities Grid Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-neuro-navy via-neuro-deep to-neuro-card border border-neuro-border relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
                Comprehensive Assessment Suite
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                8 Evidence-Informed Brain Screening Activities
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Each module tests specific neural pathways and can be completed in just 1 to 2 minutes.
              </p>
            </div>

            <button
              onClick={() => setActivePage('tests')}
              className="px-6 py-3 rounded-xl bg-neuro-teal hover:bg-cyan-400 text-black font-extrabold text-sm transition flex items-center gap-2 shadow-lg shadow-neuro-teal/20 shrink-0"
            >
              <span>Explore All Modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Memory Recall", lobe: "Temporal Lobe", time: "1 min", key: "memory", desc: "Short-term verbal retention & delayed retrieval." },
              { name: "Reaction Time", lobe: "Visual & Thalamus", time: "1 min", key: "reaction", desc: "Sensorimotor visual latency over 5 trials." },
              { name: "Attention & Focus", lobe: "Prefrontal Cortex", time: "30s", key: "attention", desc: "Target cancellation amidst visual distractors." },
              { name: "Cognitive Flexibility", lobe: "Dorsolateral Prefrontal", time: "1 min", key: "flexibility", desc: "Alternating Trail Making set-shifting." },
              { name: "Finger Tapping", lobe: "Motor Strip & Basal Ganglia", time: "10s", key: "tapping", desc: "Rapid fine motor pacing and rhythm stability." },
              { name: "Visual Recognition", lobe: "Occipital Cortex", time: "1 min", key: "visual", desc: "Complex geometric pattern discrimination." },
              { name: "Language Fluency", lobe: "Left Language Cortex", time: "30s", key: "language", desc: "Category lexical search and verbal speed." },
              { name: "Problem Solving", lobe: "Frontoparietal Network", time: "1.5 min", key: "problem", desc: "Inductive sequence logic and fluid reasoning." },
            ].map((m, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (setSelectedTestKey) setSelectedTestKey(m.key);
                  setActivePage('tests');
                }}
                className="p-4 rounded-xl bg-slate-950/70 border border-neuro-border hover:border-neuro-teal/60 cursor-pointer transition-all hover:scale-[1.02] space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neuro-teal font-semibold">0{idx + 1}</span>
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {m.time}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm group-hover:text-neuro-teal transition">
                  {m.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {m.desc}
                </p>
                <div className="text-[11px] text-neuro-purple-light font-medium pt-1">
                  ● {m.lobe}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Design Thinking Showcase Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-neuro-card to-slate-900 border border-neuro-purple/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-neuro-purple/20 text-neuro-purple-light border border-neuro-purple/40 shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
                University Academic Presentation
              </span>
              <h3 className="text-lg font-bold text-white">
                Human-Centered Design Thinking Project
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Empathize ➔ Define ➔ Ideate ➔ Prototype ➔ Test. Built for accessible, non-threatening cognitive screening.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition shrink-0"
          >
            Explore Dashboard & Trends
          </button>
        </div>
      </section>
    </div>
  );
};
