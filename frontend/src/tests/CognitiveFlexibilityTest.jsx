import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Shuffle, Clock, CheckCircle2, RotateCcw, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const TRAIL_SEQUENCE = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E', '6', 'F'];

// Fixed randomized coordinates for consistent trial layout
const NODE_COORDINATES = [
  { id: '1', x: 20, y: 35 },
  { id: 'A', x: 45, y: 20 },
  { id: '2', x: 75, y: 30 },
  { id: 'B', x: 80, y: 65 },
  { id: '3', x: 55, y: 50 },
  { id: 'C', x: 30, y: 75 },
  { id: '4', x: 15, y: 60 },
  { id: 'D', x: 40, y: 85 },
  { id: '5', x: 65, y: 80 },
  { id: 'E', x: 85, y: 40 },
  { id: '6', x: 60, y: 15 },
  { id: 'F', x: 35, y: 40 }
];

export const CognitiveFlexibilityTest = ({ onComplete, onBack }) => {
  const { t } = useLanguage();
  const { recordTestResult } = useAuth();

  const [phase, setPhase] = useState('instructions'); // 'instructions' | 'active' | 'completed'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState([]);
  const [errors, setErrors] = useState(0);
  const [errorFeedback, setErrorFeedback] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [resultData, setResultData] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => {
        setTimeElapsed(Math.round((Date.now() - startTime) / 1000));
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, startTime]);

  const handleStart = () => {
    setCurrentStepIndex(0);
    setCompletedLines([]);
    setErrors(0);
    setErrorFeedback(null);
    setStartTime(Date.now());
    setTimeElapsed(0);
    setPhase('active');
  };

  const handleNodeClick = (clickedId) => {
    if (phase !== 'active') return;

    const expectedId = TRAIL_SEQUENCE[currentStepIndex];

    if (clickedId === expectedId) {
      setErrorFeedback(null);

      // Add line from previous node to this node
      if (currentStepIndex > 0) {
        const prevId = TRAIL_SEQUENCE[currentStepIndex - 1];
        const prevCoord = NODE_COORDINATES.find(n => n.id === prevId);
        const currCoord = NODE_COORDINATES.find(n => n.id === clickedId);
        setCompletedLines(prev => [...prev, { x1: prevCoord.x, y1: prevCoord.y, x2: currCoord.x, y2: currCoord.y }]);
      }

      if (currentStepIndex === TRAIL_SEQUENCE.length - 1) {
        // Test completed!
        finishTest(errors);
      } else {
        setCurrentStepIndex(curr => curr + 1);
      }
    } else {
      // Wrong node clicked
      setErrors(e => e + 1);
      setErrorFeedback(`Incorrect! Expected target is '${expectedId}'. Alternate Number ➔ Letter!`);
      setTimeout(() => setErrorFeedback(null), 2500);
    }
  };

  const finishTest = async (finalErrors) => {
    const totalTime = Math.max(8, Math.round((Date.now() - startTime) / 1000));
    setPhase('completed');

    const submission = await recordTestResult('cognitive_flexibility', totalTime, {
      errors: finalErrors,
      time_seconds: totalTime,
      total_nodes: TRAIL_SEQUENCE.length
    });

    setResultData({
      timeSeconds: totalTime,
      errors: finalErrors,
      normalizedScore: submission?.test_result?.normalized_score || 85,
      accuracy: Math.max(0, 100 - (finalErrors * 12))
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const nextExpectedTarget = TRAIL_SEQUENCE[currentStepIndex];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-neuro-border rounded-2xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neuro-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neuro-purple/20 text-neuro-purple-light border border-neuro-purple/30">
            <Shuffle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.flexibility.name}</h3>
            <p className="text-xs text-neuro-purple-light font-medium">
              {t.tests.flexibility.domain} • {t.tests.flexibility.lobe}
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
            <h4 className="font-bold text-sm text-neuro-purple-light uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.tests.flexibility.summary}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Alternating Trail Rule:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-mono font-bold text-neuro-teal">
                <span>1</span> ➔ <span>A</span> ➔ <span>2</span> ➔ <span>B</span> ➔ <span>3</span> ➔ <span>C</span> ➔ <span>4</span> ➔ <span>D</span>...
              </div>
              <p className="text-xs text-slate-400 pt-1">
                Alternate between numbers in ascending order and letters in alphabetical order as fast as possible without mistakes.
              </p>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neuro-purple to-indigo-600 text-white font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Start Trail Making Activity</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Trail Canvas */}
      {phase === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-neuro-border text-xs font-bold">
            <div className="flex items-center gap-2 text-neuro-purple-light">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Time: {timeElapsed}s</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neuro-teal/20 text-neuro-teal border border-neuro-teal/40">
              <span>Next Expected: </span>
              <strong className="text-base text-white">{nextExpectedTarget}</strong>
            </div>
            <div className="text-rose-400">
              Errors: {errors}
            </div>
          </div>

          {errorFeedback && (
            <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs text-center font-bold animate-shake">
              {errorFeedback}
            </div>
          )}

          {/* Interactive SVG Stage */}
          <div className="relative w-full aspect-[4/3] max-h-[460px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner select-none">
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {completedLines.map((line, idx) => (
                <line
                  key={idx}
                  x1={`${line.x1}%`}
                  y1={`${line.y1}%`}
                  x2={`${line.x2}%`}
                  y2={`${line.y2}%`}
                  stroke="#22D3EE"
                  strokeWidth="3.5"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
              ))}
            </svg>

            {/* Interactive Nodes */}
            {NODE_COORDINATES.map((node) => {
              const nodeIdx = TRAIL_SEQUENCE.indexOf(node.id);
              const isPast = nodeIdx < currentStepIndex;
              const isCurrent = node.id === nextExpectedTarget;

              return (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-sm sm:text-base flex items-center justify-center transition-all duration-200 border-2 shadow-lg ${
                    isPast
                      ? 'bg-neuro-teal text-black border-white scale-95 shadow-neuro-teal/40'
                      : isCurrent
                      ? 'bg-neuro-purple text-white border-cyan-400 scale-110 animate-bounce shadow-neuro-purple/60'
                      : 'bg-slate-800 text-slate-200 border-slate-600 hover:border-slate-400 hover:scale-105'
                  }`}
                >
                  {node.id}
                </button>
              );
            })}
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
            <h4 className="text-2xl font-black text-white">Cognitive Flexibility Assessment Complete!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your task switching and executive set-shifting latency have been recorded.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Completion Time</div>
              <div className="text-2xl font-black text-neuro-teal mt-1 font-mono">
                {resultData.timeSeconds}s
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Errors</div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {resultData.errors}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Norm Score</div>
              <div className="text-2xl font-black text-neuro-purple-light mt-1">
                {resultData.normalizedScore}/100
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPhase('instructions');
                setCurrentStepIndex(0);
                setCompletedLines([]);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neuro-purple hover:bg-violet-600 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-neuro-purple/25"
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
