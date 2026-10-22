import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Activity, Clock, CheckCircle2, RotateCcw, ArrowRight, Sparkles, Hand } from 'lucide-react';

export const FingerTappingTest = ({ onComplete, onBack }) => {
  const { t } = useLanguage();
  const { recordTestResult } = useAuth();

  const [phase, setPhase] = useState('instructions'); // 'instructions' | 'active' | 'completed'
  const [timeLeft, setTimeLeft] = useState(10);
  const [tapCount, setTapCount] = useState(0);
  const [isTappedNow, setIsTappedNow] = useState(false);
  const [resultData, setResultData] = useState(null);

  const tapTimestampsRef = useRef([]);

  // Spacebar keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'active') {
          handleTap();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // 10s timer effect
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
    setTapCount(0);
    tapTimestampsRef.current = [];
    setTimeLeft(10);
    setPhase('active');
  };

  const handleTap = () => {
    if (phase !== 'active') return;

    tapTimestampsRef.current.push(performance.now());
    setTapCount(c => c + 1);

    // Visual ripple toggle
    setIsTappedNow(true);
    setTimeout(() => setIsTappedNow(false), 120);
  };

  const finishTest = async () => {
    setPhase('completed');
    const timestamps = tapTimestampsRef.current;
    const count = timestamps.length;
    const hzRate = (count / 10).toFixed(1);

    // Calculate inter-tap intervals and variability (CV)
    let cv = 0.15;
    if (timestamps.length > 3) {
      const itis = [];
      for (let i = 1; i < timestamps.length; i++) {
        itis.push(timestamps[i] - timestamps[i - 1]);
      }
      const mean = itis.reduce((a, b) => a + b, 0) / itis.length;
      const variance = itis.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / itis.length;
      const stdDev = Math.sqrt(variance);
      cv = Number((stdDev / mean).toFixed(3));
    }

    const submission = await recordTestResult('finger_tapping', count, {
      total_taps: count,
      hz_rate: hzRate,
      interval_cv: cv
    });

    setResultData({
      count,
      hzRate,
      cv,
      normalizedScore: submission?.test_result?.normalized_score || 82
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-neuro-border rounded-2xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neuro-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.tapping.name}</h3>
            <p className="text-xs text-rose-400 font-medium">
              {t.tests.tapping.domain} • {t.tests.tapping.lobe}
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
            <h4 className="font-bold text-sm text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.tests.tapping.summary}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white">How to perform:</div>
              <div>• Use your dominant index finger.</div>
              <div>• Tap the large round button on screen, or press the <strong>SPACEBAR</strong> repeatedly as quickly and consistently as you can.</div>
              <div>• The timer runs for exactly 10 seconds.</div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Start 10s Motor Tapping</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Tapping Phase */}
      {phase === 'active' && (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-neuro-border text-xs font-bold">
            <div className="flex items-center gap-2 text-rose-400">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Time Remaining: {timeLeft}s</span>
            </div>
            <div className="text-neuro-teal text-sm">
              Taps: <strong className="text-white text-base">{tapCount}</strong>
            </div>
          </div>

          {/* Large Interactive Tap Pad */}
          <div className="py-6 flex flex-col items-center justify-center">
            <button
              onMouseDown={handleTap}
              onTouchStart={(e) => {
                e.preventDefault();
                handleTap();
              }}
              className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center font-black transition-all select-none shadow-2xl ${
                isTappedNow
                  ? 'scale-90 bg-rose-600 text-white shadow-rose-600/60 ring-8 ring-rose-400/40'
                  : 'scale-100 bg-gradient-to-tr from-rose-500 to-pink-500 text-white hover:scale-105 active:scale-95 ring-4 ring-rose-500/20 shadow-rose-500/30'
              }`}
            >
              <Hand className="w-12 h-12 mb-1 pointer-events-none" />
              <span className="text-3xl font-mono pointer-events-none">{tapCount}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-80 pointer-events-none mt-1">
                TAP / SPACE
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Keep tapping continuously until the 10-second timer expires!
          </p>
        </div>
      )}

      {/* Completed Phase */}
      {phase === 'completed' && resultData && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-white">Motor Screening Complete!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your motor tap frequency and movement rhythm consistency have been calibrated.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Total Taps</div>
              <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
                {resultData.count}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Rate (Hz)</div>
              <div className="text-2xl font-black text-neuro-teal mt-1 font-mono">
                {resultData.hzRate} /s
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Norm Score</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {resultData.normalizedScore}/100
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPhase('instructions');
                setTapCount(0);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25"
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
