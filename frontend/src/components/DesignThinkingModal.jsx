import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Sparkles, HeartHandshake, Target, Lightbulb, Cpu, CheckCircle2 } from 'lucide-react';

export const DesignThinkingModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const stages = [
    {
      num: "01",
      name: "Empathize",
      icon: HeartHandshake,
      color: "from-rose-500 to-pink-600",
      textColor: "text-rose-400",
      description: "Conducted interviews with older adults, adult children, and caregivers. Identified significant fear around clinical memory testing ('white-coat hypertension') and reluctance to seek early help due to stigma.",
      insight: "Key User Insight: Screening must feel non-judgmental, accessible at home, and clearly framed as preventive fitness rather than an ominous dementia test."
    },
    {
      num: "02",
      name: "Define",
      icon: Target,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-400",
      description: "Formulated the core Point-of-View (POV) & How Might We (HMW) challenge: 'How might we enable individuals and families to monitor cognitive and motor micro-trends objectively, without panic or unvalidated diagnostic labels?'",
      insight: "Design Goal: A multi-modal digital screening tool combining memory, reaction time, attention, and fine motor rhythm."
    },
    {
      num: "03",
      name: "Ideate",
      icon: Lightbulb,
      color: "from-teal-500 to-emerald-600",
      textColor: "text-teal-400",
      description: "Brainstormed 8 gamified cognitive tasks derived from established neuropsychological paradigms (Trail Making, Stroop, Verbal Fluency, Finger Tapping). Decided on an interactive 3D brain map to demystify lobe functions.",
      insight: "Key Feature: Explain WHICH brain lobe each activity evaluates to foster neuro-literacy and self-efficacy."
    },
    {
      num: "04",
      name: "Prototype",
      icon: Cpu,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-400",
      description: "Built this responsive web application utilizing React, Tailwind CSS, an interactive HTML5 3D Brain canvas, and a FastAPI scoring & analytics engine. Integrated dual-language (English & Tamil) for cultural inclusivity.",
      insight: "Accessibility First: Large fonts, high-contrast, speech narration, and guest demo access without login barriers."
    },
    {
      num: "05",
      name: "Test & Refine",
      icon: CheckCircle2,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-400",
      description: "Tested task latency calibration, elderly finger-tap ergonomics, and medical safety guardrails. Ensured the AI assistant enforces non-diagnostic ethics while immediately flagging acute stroke warning signs.",
      insight: "Outcome: A trustworthy, engaging bridge between home awareness and professional neurological consultation."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-slate-900 border border-neuro-border p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-neuro-purple/20 text-neuro-purple-light border border-neuro-purple/40">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
              {t.designThinking.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t.designThinking.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          NeuroSense was developed following the standard 5-stage <strong>Design Thinking Methodology</strong> for a university healthcare innovation project.
          Below is our step-by-step design trajectory from problem exploration to working interactive prototype.
        </p>

        {/* 5 Stages Accordion / Cards */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {stages.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="p-4 rounded-xl bg-slate-800/80 border border-neuro-border hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${st.color} text-white font-black text-sm flex items-center justify-center shadow-md`}>
                    {st.num}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${st.textColor}`} />
                    <h4 className="font-bold text-base text-white">
                      Stage {st.num}: {st.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
                  {st.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-neuro-border/60 text-xs text-neuro-teal font-medium">
                  {st.insight}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-neuro-border flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-gradient-to-r from-neuro-teal to-cyan-500 text-black font-bold text-sm shadow-md transition hover:scale-105 active:scale-95"
          >
            Close Framework
          </button>
        </div>
      </div>
    </div>
  );
};
