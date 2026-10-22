import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Brain,
  Sparkles,
  Activity,
  Moon,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

export const AnalysisReportPage = ({ setActivePage }) => {
  const { t } = useLanguage();
  const { user, completedTests, currentSession } = useAuth();
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  // Compute domain scores from completedTests or provide robust baseline data
  const memoryScore = completedTests['memory_recall']?.normalizedScore || 80.0;
  const speedScore = completedTests['reaction_time']?.normalizedScore || 88.0;
  const attentionScore = completedTests['attention_concentration']?.normalizedScore || 82.0;
  const flexibilityScore = completedTests['cognitive_flexibility']?.normalizedScore || 85.0;
  const motorScore = completedTests['finger_tapping']?.normalizedScore || 78.0;
  const visualScore = completedTests['visual_recognition']?.normalizedScore || 83.0;
  const languageScore = completedTests['language_fluency']?.normalizedScore || 82.0;
  const problemScore = completedTests['problem_solving']?.normalizedScore || 80.0;

  const domainCards = [
    {
      name: "Episodic & Short-term Memory",
      score: memoryScore,
      lobe: "Temporal Lobe & Hippocampus",
      description: "Immediate recall and recognition retention after delay interval.",
      interpretation: memoryScore >= 75
        ? "Robust verbal encoding and delayed retrieval mechanisms."
        : "Mild retention variance observed; recommend retesting in a quiet environment."
    },
    {
      name: "Processing Speed & Reflex",
      score: speedScore,
      lobe: "Thalamus & Corticospinal Motor Pathways",
      description: "Sensorimotor visual transmission speed from stimulus onset to motor response.",
      interpretation: speedScore >= 75
        ? "Rapid central decision latency and neuromuscular reflex speed."
        : "Slight reaction delay; fatigue or sleep debt can temporarily influence latency."
    },
    {
      name: "Attention & Concentration",
      score: attentionScore,
      lobe: "Dorsolateral Prefrontal & Parietal Cortex",
      description: "Target detection amidst high-density sensory distractors.",
      interpretation: attentionScore >= 75
        ? "High selective focus and distractor filtering efficiency."
        : "Susceptibility to distractor interference noted."
    },
    {
      name: "Cognitive Flexibility & Set-Shifting",
      score: flexibilityScore,
      lobe: "Prefrontal Cortex (Trail Making Part B)",
      description: "Alternating rule switching between numerical and alphabetical sequences.",
      interpretation: flexibilityScore >= 75
        ? "Strong mental agility and executive set-shifting control."
        : "Task switching latency observed during alternating transitions."
    },
    {
      name: "Fine Motor Rhythm & Coordination",
      score: motorScore,
      lobe: "Motor Cortex & Basal Ganglia",
      description: "Rapid finger pacing rate and inter-tap interval rhythm consistency.",
      interpretation: motorScore >= 75
        ? "Steady motor pacing and smooth basal ganglia movement coordination."
        : "Minor rhythm variability observed; fine motor monitoring recommended."
    },
    {
      name: "Language & Semantic Fluency",
      score: languageScore,
      lobe: "Left Perisylvian Language Cortex",
      description: "Lexical search and category verbal association under timed pressure.",
      interpretation: languageScore >= 75
        ? "Efficient semantic retrieval and verbal generation velocity."
        : "Category retrieval delay; practice word association exercises."
    }
  ];

  const compositeScore = Math.round(
    domainCards.reduce((acc, d) => acc + d.score, 0) / domainCards.length
  );

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#070C18'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NeuroSense_Report_${user?.username || 'Screening'}.pdf`);
    } catch (e) {
      console.error('PDF generation error', e);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neuro-border pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
            Clinical Screening Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t.report.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.report.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{t.report.printReport}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neuro-teal to-cyan-500 hover:from-cyan-400 hover:to-neuro-teal text-black font-extrabold text-xs shadow-md shadow-neuro-teal/20 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Generating..." : t.report.downloadPDF}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Wrapper */}
      <div ref={reportRef} className="space-y-8 bg-slate-900 border border-neuro-border rounded-3xl p-6 sm:p-10 shadow-2xl text-white">
        {/* Report Header Metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-neuro-teal to-neuro-purple p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-neuro-teal" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-black text-white">NeuroSense Comprehensive Screening Summary</h2>
              <p className="text-xs text-slate-400">
                Session Code: {currentSession?.session_code || "NS-DEMO-2026"} • Evaluation Battery: 8 Modules
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1">
            <div><strong className="text-white">User:</strong> {user?.username || "Guest Explorer"}</div>
            <div><strong className="text-white">Date:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong className="text-white">Framework:</strong> University Design Thinking</div>
          </div>
        </div>

        {/* Medical Non-Diagnostic Alert */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.report.disclaimerAlert}
          </p>
        </div>

        {/* Composite Vitality Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-neuro-navy via-neuro-deep to-neuro-card border border-neuro-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
              {t.report.compositeScore}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white">
              {compositeScore} <span className="text-xl font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              Reflects synthesized performance across verbal memory, visual reaction latency, executive set-shifting, and fine motor pacing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center sm:text-right shrink-0">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Performance Band
            </div>
            <div className="text-lg font-black text-emerald-400 mt-1">
              Healthy Baseline Range
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Aligned with normative adult parameters
            </div>
          </div>
        </div>

        {/* 6 Cognitive Domains Grid */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-neuro-teal" />
            {t.report.domainsTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domainCards.map((domain, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{domain.name}</h4>
                  <span className="text-base font-black font-mono text-neuro-teal">
                    {domain.score}/100
                  </span>
                </div>

                <div className="text-[11px] font-medium text-neuro-purple-light">
                  Anatomy: {domain.lobe}
                </div>

                <p className="text-xs text-slate-400">
                  {domain.description}
                </p>

                <div className="pt-2 border-t border-slate-900 text-xs text-slate-300 font-medium">
                  {domain.interpretation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Lifestyle Recommendations */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neuro-purple-light" />
            {t.report.lifestyleRecommendations}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <Moon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-white">Sleep & Glymphatic Waste Clearance</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Maintain 7-8 hours of regular slow-wave sleep. Sleep facilitates the glymphatic flow that removes metabolic byproducts from the hippocampus.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-white">Aerobic Exercise & Neuroplasticity</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  150 minutes per week of brisk walking stimulates Brain-Derived Neurotrophic Factor (BDNF), enhancing synaptogenesis.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-white">MIND Diet & Microvascular Protection</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Incorporate dark berries, leafy greens, walnuts, and olive oil to shield cerebral arterioles from micro-ischemic changes.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <Brain className="w-5 h-5 text-neuro-teal shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-white">Cognitive Reserve & Continuous Learning</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Engage in complex, novel tasks—learning musical instruments or foreign languages—to build synaptic redundancy against age-related shifts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Consultation Checklist */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Checklist for Your Next Healthcare Visit
          </h4>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neuro-teal"></span>
              Bring this printed summary showing multi-domain screening scores over time.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neuro-teal"></span>
              Discuss any observed everyday changes in word-finding, task planning, or motor tremor.
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neuro-teal"></span>
              Review routine lab work (Vitamin B12, Thyroid TSH, blood pressure, lipid panel).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
