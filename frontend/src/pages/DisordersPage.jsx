import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Brain,
  Activity,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Stethoscope,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const DisordersPage = ({ onOpenEmergency, setActivePage }) => {
  const { t, language } = useLanguage();
  const [selectedDisorder, setSelectedDisorder] = useState('alzheimer');
  const [screenerAnswers, setScreenerAnswers] = useState({});
  const [screenerSubmitted, setScreenerSubmitted] = useState(false);

  const disorders = [
    {
      id: 'alzheimer',
      name: language === 'ta' ? "அல்சைமர் நோய் (Alzheimer's Disease)" : "Alzheimer's Disease",
      subtitle: "Progressive neurodegenerative condition affecting memory and cognition",
      color: "from-cyan-500 to-teal-500",
      textColor: "text-neuro-teal",
      overview: "Alzheimer's disease is the leading cause of progressive dementia. It develops over years with cellular accumulation of extracellular beta-amyloid plaques and intracellular tau tangles, disrupting synaptic communication in the hippocampus and neocortex.",
      symptoms: [
        "Disruptive short-term memory loss (e.g., repeatedly asking the same question)",
        "Challenges in planning, budgeting, or following familiar recipes",
        "Disorientation with time, dates, seasons, or familiar locations",
        "Trouble finding words or substituting inappropriate words during conversations",
        "Misplacing everyday items in bizarre places and being unable to retrace steps"
      ],
      biology: "Loss of cholinergic transmission, synaptic degradation starting in the entorhinal cortex and hippocampus, later spreading to temporal and parietal association cortices.",
      prevention: "Adherence to the MIND/Mediterranean diet, 150 minutes of weekly aerobic exercise, high sleep quality for glymphatic clearance, and lifelong mental challenges.",
      whenToConsult: "When memory slips begin interfering with work, bill payments, or driving, or when family members notice repeated disorientation."
    },
    {
      id: 'parkinson',
      name: language === 'ta' ? "பார்கின்சன் நோய் (Parkinson's Disease)" : "Parkinson's Disease",
      subtitle: "Movement disorder caused by dopaminergic neuron degeneration",
      color: "from-rose-500 to-pink-500",
      textColor: "text-rose-400",
      overview: "Parkinson's disease primarily stems from progressive degeneration of dopamine-producing neurons in the substantia nigra. It is characterized by motor dysfunction as well as prominent early non-motor warning signals.",
      symptoms: [
        "Unilateral resting tremor (often described as 'pill-rolling' of fingers)",
        "Bradykinesia: slowness in initiating and executing voluntary movements",
        "Rigidity: muscle stiffness or resistance throughout passive limb motion",
        "Postural instability: impaired balance, forward stooped posture, and shuffling gait",
        "Early non-motor signs: loss of sense of smell (hyposmia), constipation, and REM sleep behavior disorder"
      ],
      biology: "Loss of neuromelanin-pigmented dopaminergic neurons in the substantia nigra pars compacta and abnormal aggregates of alpha-synuclein protein (Lewy bodies).",
      prevention: "Intense cardiovascular exercise (cycling, boxing, Tai Chi), maintaining healthy gut microbiome, and environmental toxin avoidance.",
      whenToConsult: "Any unexplained resting hand tremor, persistent limb stiffness, or noticeable reduction in handwriting size (micrographia)."
    },
    {
      id: 'mci',
      name: language === 'ta' ? "லேசான அறிவாற்றல் குறைபாடு (Mild Cognitive Impairment)" : "Mild Cognitive Impairment (MCI)",
      subtitle: "Intermediate transitional stage between healthy aging and dementia",
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-400",
      overview: "MCI represents a measurable objective cognitive decline beyond expected age-related norms, yet daily functional independence (managing medications, banking, shopping) remains preserved. Early screening at this stage provides the greatest clinical window for intervention.",
      symptoms: [
        "More frequent memory lapses or difficulty remembering recent events",
        "Struggling to follow complex conversations or train of thought",
        "Mild delays in task switching, multi-step planning, or problem-solving",
        "Full preservation of everyday independence and personal self-care"
      ],
      biology: "Early microvascular or subclinical neurodegenerative perturbations that have not yet caused extensive widespread cortical synaptic loss.",
      prevention: "Strict management of cardiovascular risk factors (blood pressure < 120/80, blood sugar, lipids), social engagement, and treating hearing loss.",
      whenToConsult: "Because early MCI can sometimes be stabilized or reversed, medical evaluation should be scheduled promptly when changes are first recognized."
    },
    {
      id: 'dementia',
      name: language === 'ta' ? "மறதி நோய் வகைகள் (Dementia Spectrum)" : "Dementia Spectrum",
      subtitle: "Overarching clinical syndrome compromising independent daily living",
      color: "from-purple-500 to-indigo-500",
      textColor: "text-neuro-purple-light",
      overview: "Dementia is not a single disease, but an umbrella term for conditions causing progressive decline in cognitive function severe enough to disrupt independent life. Types include Alzheimer's, Vascular Dementia (post-stroke or small-vessel disease), Lewy Body Dementia, and Frontotemporal Dementia.",
      symptoms: [
        "Significant impairment in two or more cognitive domains (memory, language, judgment, visual perception)",
        "Personality shifts, apathy, emotional lability, or behavioral disinhibition",
        "Progressive inability to manage finances, medications, or travel independently"
      ],
      biology: "Various etiologies including amyloid/tau cascades, multiple cerebral ischemic micro-infarcts, alpha-synuclein inclusions, or TDP-43 protein accumulation.",
      prevention: "Comprehensive vascular risk control, cognitive reserve building, smoking cessation, and Mediterranean-style nutrition.",
      whenToConsult: "Whenever safety, nutritional intake, or medication adherence becomes compromised."
    },
    {
      id: 'stroke',
      name: language === 'ta' ? "பக்கவாதம் மற்றும் அவசர எச்சரிக்கை (Acute Stroke)" : "Acute Stroke & Warning Signs",
      subtitle: "Medical emergency caused by disrupted cerebral blood supply",
      color: "from-red-600 to-rose-600",
      textColor: "text-red-400",
      overview: "A stroke occurs when blood flow to an area of the brain is cut off (ischemic) or when a cerebral blood vessel bursts (hemorrhagic). Millions of brain cells die every minute without oxygen. Immediate emergency treatment (thrombolysis within 4.5 hours) can prevent permanent disability.",
      symptoms: [
        "Face Drooping: One side of the face sags or goes numb; uneven smile",
        "Arm Weakness: Sudden weakness or numbness in one arm; cannot keep both arms raised",
        "Speech Difficulty: Slurred words, difficulty repeating a simple sentence, or total inability to speak",
        "Time to Call Emergency Services (911 / 108 / 112) IMMEDIATELY without hesitation"
      ],
      biology: "Acute vascular occlusion or intracranial hemorrhage starving focal neuronal populations of glucose and oxygen.",
      prevention: "Aggressive blood pressure control, treating atrial fibrillation, cholesterol reduction, smoking cessation, and healthy weight maintenance.",
      whenToConsult: "IMMEDIATELY. Never delay or wait to see if acute stroke symptoms improve."
    }
  ];

  const screenerQuestions = [
    {
      id: 'q1',
      text: "Have you or family members noticed more frequent difficulty recalling recent conversations or appointments?"
    },
    {
      id: 'q2',
      text: "Do you experience unexplained hesitation or trouble finding everyday words during conversations?"
    },
    {
      id: 'q3',
      text: "Have you noticed any subtle tremors, shaking in your hands at rest, or stiffness in your arms or legs?"
    },
    {
      id: 'q4',
      text: "Do complex tasks like managing monthly bills, taxes, or following multi-step cooking recipes take noticeably more effort?"
    },
    {
      id: 'q5',
      text: "Have you or loved ones noticed subtle changes in your walking pace, balance, or posture?"
    }
  ];

  const handleScreenerAnswer = (qId, answer) => {
    setScreenerAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const currentDisorder = disorders.find(d => d.id === selectedDisorder) || disorders[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
          Evidence-Based Educational Resource
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Neurological Disorder Awareness
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Understanding the biological markers, early behavioral warning signs, and prevention science for major neurological conditions.
        </p>
      </div>

      {/* Disorder Tab Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-neuro-border pb-4">
        {disorders.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDisorder(d.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedDisorder === d.id
                ? 'bg-slate-800 text-white border-2 border-neuro-teal shadow-lg shadow-neuro-teal/20 scale-105'
                : 'bg-slate-900/80 text-slate-400 border border-neuro-border hover:text-white hover:bg-slate-800'
            }`}
          >
            {d.name.split('(')[0]}
          </button>
        ))}
      </div>

      {/* Selected Disorder In-Depth Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-neuro-border shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neuro-teal">
              Condition Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {currentDisorder.name}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {currentDisorder.subtitle}
            </p>
          </div>

          {currentDisorder.id === 'stroke' && (
            <button
              onClick={onOpenEmergency}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-900/40 transition flex items-center gap-2 animate-pulse"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Open F.A.S.T. Guide</span>
            </button>
          )}
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {currentDisorder.overview}
        </p>

        {/* Symptoms & Underlying Biology */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 ${currentDisorder.textColor}`} />
              Primary Symptoms & Warning Signs
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentDisorder.symptoms.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neuro-teal shrink-0 mt-1.5"></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-neuro-purple-light" />
                Underlying Neurobiology
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentDisorder.biology}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-900">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Evidence-Based Lifestyle Protection
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentDisorder.prevention}
              </p>
            </div>
          </div>
        </div>

        {/* When to Consult a Specialist */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-neuro-navy via-slate-900 to-neuro-card border border-neuro-border flex items-start gap-3">
          <Stethoscope className="w-5 h-5 text-neuro-teal shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-white">When to Consult a Neurologist: </strong>
            {currentDisorder.whenToConsult}
          </div>
        </div>
      </div>

      {/* Interactive Self-Reflection Questionnaire */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-neuro-border shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neuro-teal/20 text-neuro-teal text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Educational Self-Reflection Tool
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Informal Brain Health Checklist
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Answer these 5 self-reflection questions to help organize your observations before speaking with a physician.
          </p>
        </div>

        <div className="space-y-4">
          {screenerQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="text-xs sm:text-sm text-slate-200">
                <strong className="text-neuro-teal font-mono mr-2">0{idx + 1}.</strong>
                {q.text}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleScreenerAnswer(q.id, 'yes')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${
                    screenerAnswers[q.id] === 'yes'
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleScreenerAnswer(q.id, 'no')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${
                    screenerAnswers[q.id] === 'no'
                      ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        {!screenerSubmitted ? (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setScreenerSubmitted(true)}
              className="px-6 py-2.5 rounded-xl bg-neuro-teal hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition"
            >
              Submit Checklist Observations
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-950 border border-neuro-teal/40 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-neuro-teal text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Observations Recorded
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You marked "Yes" to {Object.values(screenerAnswers).filter(v => v === 'yes').length} of 5 items.
              Sharing these concrete observations with your primary care provider or neurologist can provide valuable diagnostic context.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActivePage('doctor')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold border border-slate-700 transition"
              >
                View Doctor Discussion Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
