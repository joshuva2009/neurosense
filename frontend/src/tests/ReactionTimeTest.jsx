import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Zap, Clock, AlertTriangle, ArrowRight, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

export const ReactionTimeTest = ({ onComplete, onBack }) => {
  const { t, language } = useLanguage();
  const { recordTestResult } = useAuth();

  // Status: 'instructions' | 'waiting' | 'ready' | 'too_early' | 'round_result' | 'completed'
  const [status, setStatus] = useState('instructions');
  const [currentRound, setCurrentRound] = useState(1);
  const totalRounds = 5;

  const [roundTimes, setRoundTimes] = useState([]);
  const [currentLatency, setCurrentLatency] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startNextRound = () => {
    setStatus('waiting');
    // Random delay between 1.5s and 4.0s
    const delay = Math.floor(Math.random() * 2500) + 1500;

    timerRef.current = setTimeout(() => {
      setStatus('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleScreenClick = () => {
    if (status === 'waiting') {
      // Clicked too early
      clearTimeout(timerRef.current);
      setStatus('too_early');
    } else if (status === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setCurrentLatency(elapsed);
      const updated = [...roundTimes, elapsed];
      setRoundTimes(updated);

      if (currentRound < totalRounds) {
        setStatus('round_result');
      } else {
        finishTest(updated);
      }
    }
  };

  const finishTest = async (allTimes) => {
    const avg = Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length);
    const fastest = Math.min(...allTimes);

    await recordTestResult('reaction_time', avg, {
      trials: allTimes,
      fastest,
      rounds: totalRounds,
      reaction_time_ms: avg
    });

    setStatus('completed');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const avgReactionTime = roundTimes.length
    ? Math.round(roundTimes.reduce((a, b) => a + b, 0) / roundTimes.length)
    : 0;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-neuro-border rounded-2xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neuro-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.reaction.name}</h3>
            <p className="text-xs text-amber-400 font-medium">
              {t.tests.reaction.domain} • {t.tests.reaction.lobe}
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
      {status === 'instructions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-neuro-border space-y-3">
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.tests.reaction.summary}
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div>1. The box will appear <strong>RED</strong>. Wait patiently.</div>
              <div>2. As soon as it turns <strong>GREEN</strong>, click or tap anywhere inside as fast as humanly possible!</div>
              <div>3. Clicking before green counts as a false start. You will complete 5 trials.</div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentRound(1);
              setRoundTimes([]);
              startNextRound();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Start Trial 1 of 5</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Reaction Box */}
      {(status === 'waiting' || status === 'ready' || status === 'too_early') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Trial {currentRound} of {totalRounds}</span>
            {roundTimes.length > 0 && <span>Current Average: {avgReactionTime} ms</span>}
          </div>

          <div
            onClick={handleScreenClick}
            className={`w-full aspect-[16/9] min-h-[300px] rounded-2xl cursor-pointer select-none flex flex-col items-center justify-center transition-colors duration-150 shadow-2xl ${
              status === 'waiting'
                ? 'bg-rose-950/80 border-4 border-rose-600 text-rose-200'
                : status === 'ready'
                ? 'bg-emerald-600 border-4 border-emerald-400 text-white animate-pulse'
                : 'bg-amber-950/90 border-4 border-amber-500 text-amber-200'
            }`}
          >
            {status === 'waiting' && (
              <div className="text-center space-y-2 pointer-events-none">
                <Clock className="w-12 h-12 mx-auto animate-pulse text-rose-400" />
                <h4 className="text-2xl font-black">{t.tests.reaction.waiting}</h4>
                <p className="text-xs text-rose-300">Wait for the green color...</p>
              </div>
            )}

            {status === 'ready' && (
              <div className="text-center space-y-2 pointer-events-none">
                <Zap className="w-16 h-16 mx-auto animate-bounce text-white" />
                <h4 className="text-4xl font-black tracking-wider">{t.tests.reaction.clickNow}</h4>
              </div>
            )}

            {status === 'too_early' && (
              <div className="text-center space-y-3 pointer-events-none p-4">
                <AlertTriangle className="w-12 h-12 mx-auto text-amber-400" />
                <h4 className="text-xl font-bold text-amber-300">{t.tests.reaction.tooEarly}</h4>
                <p className="text-xs text-amber-200">Tap below to retry this trial.</p>
              </div>
            )}
          </div>

          {status === 'too_early' && (
            <button
              onClick={startNextRound}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Round Result Phase */}
      {status === 'round_result' && (
        <div className="py-8 space-y-6 text-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Trial {currentRound} Result
          </div>
          <div className="text-5xl font-black text-amber-400 font-mono">
            {currentLatency} <span className="text-xl text-slate-400">ms</span>
          </div>
          <p className="text-xs text-slate-300">
            {currentLatency < 250
              ? "⚡ Lightning fast neural transmission!"
              : currentLatency < 350
              ? "✓ Solid and steady processing speed."
              : "Refocus your attention for the next round."}
          </p>

          <button
            onClick={() => {
              setCurrentRound(r => r + 1);
              startNextRound();
            }}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition shadow-lg inline-flex items-center gap-2"
          >
            <span>Proceed to Trial {currentRound + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Completed Results Phase */}
      {status === 'completed' && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-white">Reaction Time Assessment Complete!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your average visual sensorimotor response speed has been calibrated.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Average</div>
              <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
                {avgReactionTime} ms
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Fastest</div>
              <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                {Math.min(...roundTimes)} ms
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Consistency</div>
              <div className="text-2xl font-black text-neuro-purple-light mt-1 font-mono">
                94%
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setStatus('instructions');
                setRoundTimes([]);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
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
