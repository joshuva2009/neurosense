import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Focus, Clock, CheckCircle2, RotateCcw, ArrowRight, Sparkles, Target, AlertCircle } from 'lucide-react';

export const AttentionConcentrationTest = ({ onComplete, onBack }) => {
  const { t } = useLanguage();
  const { recordTestResult } = useAuth();

  const [phase, setPhase] = useState('instructions'); // 'instructions' | 'active' | 'completed'
  const [timeLeft, setTimeLeft] = useState(30);
  const [gridItems, setGridItems] = useState([]);
  const [hits, setHits] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [totalTargets, setTotalTargets] = useState(16);
  const [resultData, setResultData] = useState(null);

  // Generate randomized distraction grid
  const generateGrid = () => {
    const items = [];
    let targetCount = 0;
    const totalSlots = 36; // 6x6 grid

    for (let i = 0; i < totalSlots; i++) {
      // 35% probability of being a target
      const isTarget = Math.random() < 0.38 && targetCount < 16;
      if (isTarget) targetCount++;

      items.push({
        id: i,
        isTarget,
        shape: isTarget ? 'hexagon' : ['square', 'circle', 'triangle', 'diamond'][Math.floor(Math.random() * 4)],
        dots: isTarget ? 2 : Math.floor(Math.random() * 3) + 1,
        clicked: false,
        wasCorrect: null
      });
    }

    setTotalTargets(targetCount);
    setGridItems(items);
  };

  useEffect(() => {
    let timer;
    if (phase === 'active') {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      } else {
        finishTest();
      }
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const handleStart = () => {
    generateGrid();
    setHits(0);
    setFalseAlarms(0);
    setTimeLeft(30);
    setPhase('active');
  };

  const handleItemClick = (id) => {
    if (phase !== 'active') return;

    setGridItems(prev => prev.map(item => {
      if (item.id === id && !item.clicked) {
        if (item.isTarget) {
          setHits(h => h + 1);
          return { ...item, clicked: true, wasCorrect: true };
        } else {
          setFalseAlarms(f => f + 1);
          return { ...item, clicked: true, wasCorrect: false };
        }
      }
      return item;
    }));
  };

  const finishTest = async () => {
    setPhase('completed');
    const netHits = Math.max(0, hits - (falseAlarms * 0.5));
    const accuracy = Math.round((netHits / Math.max(1, totalTargets)) * 100);

    const submission = await recordTestResult('attention_concentration', hits, {
      total_targets: totalTargets,
      false_alarms: falseAlarms,
      accuracy,
      netHits
    });

    setResultData({
      hits,
      totalTargets,
      falseAlarms,
      accuracy,
      normalizedScore: submission?.test_result?.normalized_score || accuracy
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-neuro-border rounded-2xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neuro-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/30">
            <Focus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.attention.name}</h3>
            <p className="text-xs text-neuro-teal font-medium">
              {t.tests.attention.domain} • {t.tests.attention.lobe}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition"
        >
          {t.tests.backToHub}
        </button>
      </div>

      {/* Instructions Phase */}
      {phase === 'instructions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-neuro-border space-y-4">
            <h4 className="font-bold text-sm text-neuro-teal uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.tests.attention.summary}
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-neuro-teal/20 border-2 border-neuro-teal flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-neuro-teal">TARGET</span>
                <span className="text-xs font-mono text-white">⬡ (2 dots)</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Target Specification:</p>
                <p>Click only the <strong>CYAN HEXAGONS</strong> with <strong>2 DOTS</strong> inside.</p>
                <p className="text-slate-400">Avoid tapping circles, squares, or shapes with 1 or 3 dots.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neuro-teal to-cyan-500 text-black font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Start 30s Attention Screening</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Cancellation Grid */}
      {phase === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-neuro-border text-xs font-bold">
            <div className="flex items-center gap-2 text-neuro-teal">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Time Remaining: {timeLeft}s</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400">Hits: {hits}</span>
              <span className="text-rose-400">False Alarms: {falseAlarms}</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
            {gridItems.map((item) => {
              let bgStyle = 'bg-slate-900 border-slate-800 hover:border-slate-600 text-slate-300';
              if (item.clicked) {
                bgStyle = item.wasCorrect
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 scale-95 shadow-md shadow-emerald-500/20'
                  : 'bg-rose-500/20 border-rose-500 text-rose-300 scale-95';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  disabled={item.clicked}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all ${bgStyle}`}
                >
                  <span className="text-lg sm:text-2xl font-black">
                    {item.shape === 'hexagon' ? '⬡' : item.shape === 'square' ? '□' : item.shape === 'circle' ? '○' : '△'}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest -mt-1 font-bold">
                    {item.dots === 2 ? '••' : item.dots === 1 ? '•' : '•••'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={finishTest}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700"
            >
              Finish Early
            </button>
          </div>
        </div>
      )}

      {/* Completed Phase */}
      {phase === 'completed' && resultData && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-white">Attention Screening Complete!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your sustained focus and target discrimination have been analyzed.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Targets Hit</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {resultData.hits} / {resultData.totalTargets}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">False Clicks</div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {resultData.falseAlarms}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Norm Score</div>
              <div className="text-2xl font-black text-neuro-teal mt-1">
                {resultData.normalizedScore}/100
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPhase('instructions');
                setHits(0);
                setFalseAlarms(0);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neuro-teal hover:bg-cyan-400 text-black font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-neuro-teal/20"
            >
              <span>{t.tests.nextTest}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
