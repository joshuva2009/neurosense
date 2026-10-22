import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Moon,
  Activity,
  Heart,
  Brain,
  CheckCircle2,
  Sparkles,
  Coffee,
  Sun,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const LifestyleTrackerPage = () => {
  const { t } = useLanguage();
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [exerciseMinutes, setExerciseMinutes] = useState(90);
  const [dietChecklist, setDietChecklist] = useState({
    berries: true,
    greens: true,
    nuts: true,
    oliveOil: true,
    fish: false,
    wholeGrains: true
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDietItem = (key) => {
    setDietChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddExercise = (mins) => {
    setExerciseMinutes(prev => Math.min(300, prev + mins));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
          Evidence-Based Neuroprotection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Brain Health Lifestyle & Sleep Tracker
        </h1>
        <p className="text-sm text-slate-300">
          Monitor the four lifestyle pillars shown by clinical trials to strengthen cognitive reserve and preserve neural architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Sleep & Glymphatic Clearance */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-neuro-border shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sleep & Glymphatic Waste Flow</h3>
              <p className="text-xs text-slate-400">Target: 7 to 8.5 hours of restorative sleep</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Average Sleep Duration:</span>
              <span className="text-xl font-black text-indigo-400 font-mono">{sleepHours} hrs</span>
            </div>

            <input
              type="range"
              min="4"
              max="11"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Quality:</span>
              <div className="flex gap-2">
                {['poor', 'fair', 'good', 'optimal'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSleepQuality(q)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase transition ${
                      sleepQuality === q
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed space-y-1.5 border-t border-slate-800/80 pt-4">
            <p className="font-semibold text-slate-200">Scientific Context:</p>
            <p>
              During slow-wave non-REM sleep, the brain interstitial space expands by 60%, allowing cerebrospinal fluid to wash away accumulated metabolic waste products, including amyloid-beta.
            </p>
          </div>
        </div>

        {/* 2. Cardiovascular Aerobic Activity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-neuro-border shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Aerobic Exercise & BDNF</h3>
              <p className="text-xs text-slate-400">Weekly Target: 150 minutes of moderate movement</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Weekly Progress:</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {exerciseMinutes} / 150 min
              </span>
            </div>

            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (exerciseMinutes / 150) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs text-slate-400">Log activity:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddExercise(15)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> 15 min
                </button>
                <button
                  onClick={() => handleAddExercise(30)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> 30 min
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed space-y-1.5 border-t border-slate-800/80 pt-4">
            <p className="font-semibold text-slate-200">Scientific Context:</p>
            <p>
              Aerobic exercise enhances hippocampal cerebral blood volume and triggers release of Brain-Derived Neurotrophic Factor (BDNF), encouraging new dendritic spines.
            </p>
          </div>
        </div>

        {/* 3. MIND Diet Nutrition Checklist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-neuro-border shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">MIND Diet Neuroprotective Foods</h3>
              <p className="text-xs text-slate-400">Mediterranean-DASH Diet Intervention for Neurodegenerative Delay</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { key: 'berries', label: 'Dark Berries (Blueberries/Strawberries)' },
              { key: 'greens', label: 'Leafy Green Vegetables (Spinach/Kale)' },
              { key: 'nuts', label: 'Walnuts & Raw Nuts (Omega-3)' },
              { key: 'oliveOil', label: 'Extra Virgin Olive Oil' },
              { key: 'fish', label: 'Fatty Fish (Salmon / Sardines)' },
              { key: 'wholeGrains', label: 'Whole Grains & Pulses' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => toggleDietItem(item.key)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition ${
                  dietChecklist[item.key]
                    ? 'bg-neuro-teal/15 border-neuro-teal text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${dietChecklist[item.key] ? 'text-neuro-teal' : 'text-slate-600'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-4">
            Clinical trials report up to a 53% lower rate of Alzheimer's disease in individuals strictly adhering to the MIND diet protocol.
          </p>
        </div>

        {/* 4. Cognitive Reserve Challenge Log */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-neuro-border shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-neuro-purple/20 text-neuro-purple-light border border-neuro-purple/30">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cognitive Reserve Building</h3>
              <p className="text-xs text-slate-400">Lifelong neuroplasticity & mental novelty</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neuro-purple-light"></span>
              <span>Practicing a foreign language (Dual-Language practice: English & Tamil)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neuro-purple-light"></span>
              <span>Engaging in strategic logic puzzles and Trail Making sequence tests</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neuro-purple-light"></span>
              <span>Learning a new musical instrument or fine motor rhythm pattern</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neuro-purple-light"></span>
              <span>Active social connectivity and community volunteering</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold">
              {savedSuccess ? "✓ Lifestyle Log Saved!" : "Continuous tracker active"}
            </span>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              Save Daily Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
