import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { MemoryRecallTest } from '../tests/MemoryRecallTest';
import { ReactionTimeTest } from '../tests/ReactionTimeTest';
import { AttentionConcentrationTest } from '../tests/AttentionConcentrationTest';
import { CognitiveFlexibilityTest } from '../tests/CognitiveFlexibilityTest';
import { FingerTappingTest } from '../tests/FingerTappingTest';
import { VisualRecognitionTest } from '../tests/VisualRecognitionTest';
import { LanguageFluencyTest } from '../tests/LanguageFluencyTest';
import { ProblemSolvingTest } from '../tests/ProblemSolvingTest';
import {
  Brain,
  Zap,
  Focus,
  Shuffle,
  Activity,
  Eye,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Play
} from 'lucide-react';

export const AssessmentHubPage = ({ initialTestKey = null, setActivePage }) => {
  const { t } = useLanguage();
  const { completedTests } = useAuth();
  const [activeTest, setActiveTest] = useState(initialTestKey);

  const testsList = [
    {
      id: 'memory_recall',
      key: 'memory',
      name: t.tests.memory.name,
      domain: t.tests.memory.domain,
      lobe: t.tests.memory.lobe,
      time: '1.5 min',
      icon: Brain,
      color: 'from-cyan-500 to-teal-500',
      textColor: 'text-neuro-teal',
      borderColor: 'border-neuro-teal/30',
      summary: t.tests.memory.summary
    },
    {
      id: 'reaction_time',
      key: 'reaction',
      name: t.tests.reaction.name,
      domain: t.tests.reaction.domain,
      lobe: t.tests.reaction.lobe,
      time: '1 min',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      summary: t.tests.reaction.summary
    },
    {
      id: 'attention_concentration',
      key: 'attention',
      name: t.tests.attention.name,
      domain: t.tests.attention.domain,
      lobe: t.tests.attention.lobe,
      time: '30 sec',
      icon: Focus,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      summary: t.tests.attention.summary
    },
    {
      id: 'cognitive_flexibility',
      key: 'flexibility',
      name: t.tests.flexibility.name,
      domain: t.tests.flexibility.domain,
      lobe: t.tests.flexibility.lobe,
      time: '1 min',
      icon: Shuffle,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-neuro-purple-light',
      borderColor: 'border-neuro-purple/30',
      summary: t.tests.flexibility.summary
    },
    {
      id: 'finger_tapping',
      key: 'tapping',
      name: t.tests.tapping.name,
      domain: t.tests.tapping.domain,
      lobe: t.tests.tapping.lobe,
      time: '10 sec',
      icon: Activity,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      summary: t.tests.tapping.summary
    },
    {
      id: 'visual_recognition',
      key: 'visual',
      name: t.tests.visual.name,
      domain: t.tests.visual.domain,
      lobe: t.tests.visual.lobe,
      time: '1 min',
      icon: Eye,
      color: 'from-teal-500 to-emerald-500',
      textColor: 'text-teal-400',
      borderColor: 'border-teal-500/30',
      summary: t.tests.visual.summary
    },
    {
      id: 'language_fluency',
      key: 'language',
      name: t.tests.language.name,
      domain: t.tests.language.domain,
      lobe: t.tests.language.lobe,
      time: '30 sec',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      summary: t.tests.language.summary
    },
    {
      id: 'problem_solving',
      key: 'problem',
      name: t.tests.problem.name,
      domain: t.tests.problem.domain,
      lobe: t.tests.problem.lobe,
      time: '1.5 min',
      icon: Lightbulb,
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-400',
      borderColor: 'border-violet-500/30',
      summary: t.tests.problem.summary
    }
  ];

  const completedCount = Object.keys(completedTests).length;

  const handleTestComplete = () => {
    // Find next uncompleted test in sequence
    const nextUncompleted = testsList.find(t => !completedTests[t.id]);
    if (nextUncompleted) {
      setActiveTest(nextUncompleted.key);
    } else {
      setActiveTest(null);
      setActivePage('report');
    }
  };

  // Mount specific active test if chosen
  if (activeTest) {
    switch (activeTest) {
      case 'memory':
        return <MemoryRecallTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      case 'reaction':
        return <ReactionTimeTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      case 'attention':
        return <AttentionConcentrationTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      case 'flexibility':
        return <CognitiveFlexibilityTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      case 'tapping':
        return <FingerTappingTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      case 'visual':
        return <VisualRecognitionTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      case 'language':
        return <LanguageFluencyTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      case 'problem':
        return <ProblemSolvingTest onComplete={handleTestComplete} onBack={() => setActiveTest(null)} />;
      default:
        break;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
      {/* Top Banner & Progress Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neuro-navy via-neuro-deep to-neuro-card border border-neuro-border shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-neuro-teal uppercase tracking-wider">
              {t.tests.overallProgress}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {t.tests.catalogTitle}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              {t.tests.catalogSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {completedCount > 0 && (
              <button
                onClick={() => setActivePage('report')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neuro-purple hover:bg-violet-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>View AI Brain Report ({completedCount}/8)</span>
              </button>
            )}

            <button
              onClick={() => {
                const first = testsList[0];
                setActiveTest(first.key);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-neuro-teal to-cyan-500 hover:from-cyan-400 hover:to-neuro-teal text-black font-extrabold text-xs shadow-lg shadow-neuro-teal/20 transition flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run Assessment Battery</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">
              Completed Modules: <strong className="text-neuro-teal">{completedCount} of 8</strong>
            </span>
            <span className="text-slate-400 font-mono">
              {Math.round((completedCount / 8) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-neuro-teal via-cyan-400 to-neuro-purple h-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / 8) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 8 Tests Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testsList.map((test) => {
          const Icon = test.icon;
          const isDone = !!completedTests[test.id];
          const result = completedTests[test.id];

          return (
            <div
              key={test.id}
              className={`p-6 rounded-2xl bg-slate-900 border transition-all duration-300 flex flex-col justify-between shadow-xl ${
                isDone
                  ? 'border-emerald-500/40 bg-slate-900/90'
                  : 'border-neuro-border hover:border-slate-600'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-slate-800/80 border ${test.borderColor} ${test.textColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {test.time}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{test.name}</h3>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {test.domain} • <span className={test.textColor}>{test.lobe}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {test.summary}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-3">
                {isDone ? (
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                    <span className="text-white font-mono font-bold">
                      Score: {result.normalizedScore}/100
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    Not yet completed in this session
                  </div>
                )}

                <button
                  onClick={() => setActiveTest(test.key)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    isDone
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-neuro-teal hover:bg-cyan-400 text-black shadow-md shadow-neuro-teal/20'
                  }`}
                >
                  <span>{isDone ? t.tests.retakeTest : t.tests.startTest}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
