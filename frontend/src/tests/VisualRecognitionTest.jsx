import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Eye, CheckCircle2, RotateCcw, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

const PUZZLES = [
  {
    id: 1,
    target: { shape: 'polygon', inner: 'star', color: '#06B6D4' },
    options: [
      { id: 'A', shape: 'polygon', inner: 'star', color: '#06B6D4', isCorrect: true },
      { id: 'B', shape: 'polygon', inner: 'circle', color: '#06B6D4', isCorrect: false },
      { id: 'C', shape: 'square', inner: 'star', color: '#06B6D4', isCorrect: false },
      { id: 'D', shape: 'polygon', inner: 'star', color: '#F43F5E', isCorrect: false },
    ]
  },
  {
    id: 2,
    target: { shape: 'diamond_split', inner: 'dots_horizontal', color: '#8B5CF6' },
    options: [
      { id: 'A', shape: 'diamond_split', inner: 'dots_vertical', color: '#8B5CF6', isCorrect: false },
      { id: 'B', shape: 'diamond_solid', inner: 'dots_horizontal', color: '#8B5CF6', isCorrect: false },
      { id: 'C', shape: 'diamond_split', inner: 'dots_horizontal', color: '#8B5CF6', isCorrect: true },
      { id: 'D', shape: 'square_split', inner: 'dots_horizontal', color: '#8B5CF6', isCorrect: false },
    ]
  },
  {
    id: 3,
    target: { shape: 'nested_circles', inner: 'cross_diagonal', color: '#10B981' },
    options: [
      { id: 'A', shape: 'nested_circles', inner: 'cross_diagonal', color: '#10B981', isCorrect: true },
      { id: 'B', shape: 'single_circle', inner: 'cross_diagonal', color: '#10B981', isCorrect: false },
      { id: 'C', shape: 'nested_circles', inner: 'cross_straight', color: '#10B981', isCorrect: false },
      { id: 'D', shape: 'nested_squares', inner: 'cross_diagonal', color: '#10B981', isCorrect: false },
    ]
  },
  {
    id: 4,
    target: { shape: 'hexagon_grid', inner: 'center_triangle', color: '#F59E0B' },
    options: [
      { id: 'A', shape: 'hexagon_grid', inner: 'center_square', color: '#F59E0B', isCorrect: false },
      { id: 'B', shape: 'circle_grid', inner: 'center_triangle', color: '#F59E0B', isCorrect: false },
      { id: 'C', shape: 'hexagon_grid', inner: 'center_triangle', color: '#06B6D4', isCorrect: false },
      { id: 'D', shape: 'hexagon_grid', inner: 'center_triangle', color: '#F59E0B', isCorrect: true },
    ]
  },
  {
    id: 5,
    target: { shape: 'concentric_arc', inner: 'two_arrows', color: '#EC4899' },
    options: [
      { id: 'A', shape: 'concentric_arc', inner: 'two_arrows', color: '#EC4899', isCorrect: true },
      { id: 'B', shape: 'concentric_arc', inner: 'one_arrow', color: '#EC4899', isCorrect: false },
      { id: 'C', shape: 'single_arc', inner: 'two_arrows', color: '#EC4899', isCorrect: false },
      { id: 'D', shape: 'concentric_arc', inner: 'two_arrows', color: '#8B5CF6', isCorrect: false },
    ]
  }
];

export const VisualRecognitionTest = ({ onComplete, onBack }) => {
  const { t } = useLanguage();
  const { recordTestResult } = useAuth();

  const [phase, setPhase] = useState('instructions');
  const [currentRound, setCurrentRound] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [roundFeedback, setRoundFeedback] = useState(null);
  const [resultData, setResultData] = useState(null);

  const currentPuzzle = PUZZLES[currentRound];

  const handleStart = () => {
    setCurrentRound(0);
    setCorrectAnswers(0);
    setSelectedOption(null);
    setRoundFeedback(null);
    setPhase('active');
  };

  const handleSelectOption = (opt) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt.id);

    const isCorrect = opt.isCorrect;
    if (isCorrect) {
      setCorrectAnswers(c => c + 1);
      setRoundFeedback('correct');
    } else {
      setRoundFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentRound < PUZZLES.length - 1) {
        setCurrentRound(r => r + 1);
        setSelectedOption(null);
        setRoundFeedback(null);
      } else {
        finishTest(correctAnswers + (isCorrect ? 1 : 0));
      }
    }, 1200);
  };

  const finishTest = async (finalCorrect) => {
    setPhase('completed');
    const total = PUZZLES.length;
    const accuracy = Math.round((finalCorrect / total) * 100);

    const submission = await recordTestResult('visual_recognition', finalCorrect, {
      total_trials: total,
      accuracy
    });

    setResultData({
      correct: finalCorrect,
      total,
      accuracy,
      normalizedScore: submission?.test_result?.normalized_score || accuracy
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  // Helper to render geometric icons
  const renderPattern = (pat, size = 'w-16 h-16') => {
    return (
      <div className={`${size} rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center p-2 relative shadow-inner`}>
        <div
          className="w-full h-full rounded-lg border-2 flex items-center justify-center"
          style={{ borderColor: pat.color, color: pat.color }}
        >
          <span className="text-xl font-black font-mono">
            {pat.shape.includes('polygon') ? '⎔' : pat.shape.includes('diamond') ? '◆' : pat.shape.includes('nested') ? '◎' : pat.shape.includes('hexagon') ? '⬢' : '⌒'}
          </span>
          <span className="absolute text-xs font-bold text-white">
            {pat.inner.includes('star') ? '★' : pat.inner.includes('dots') ? '••' : pat.inner.includes('cross') ? '✕' : pat.inner.includes('triangle') ? '▲' : '→'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-neuro-border rounded-2xl shadow-2xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neuro-border/60 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.visual.name}</h3>
            <p className="text-xs text-emerald-400 font-medium">
              {t.tests.visual.domain} • {t.tests.visual.lobe}
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
            <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.tests.visual.summary}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div>• You will be shown a <strong>Target Pattern</strong> at the top.</div>
              <div>• Inspect the 4 choice cards below carefully.</div>
              <div>• Select the one choice that <strong>identically matches</strong> shape, color, and internal geometric configuration.</div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Start Pattern Recognition</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Phase */}
      {phase === 'active' && currentPuzzle && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Puzzle {currentRound + 1} of {PUZZLES.length}</span>
            <span>Score: {correctAnswers}</span>
          </div>

          {/* Target Pattern Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 flex flex-col items-center justify-center shadow-lg">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              TARGET PATTERN
            </span>
            {renderPattern(currentPuzzle.target, 'w-24 h-24')}
          </div>

          <div className="text-center text-xs text-slate-300 font-semibold">
            {t.tests.visual.selectMatch}
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-4">
            {currentPuzzle.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              let borderStyle = 'border-slate-800 hover:border-slate-600 bg-slate-800/80';
              if (isSelected) {
                borderStyle = opt.isCorrect
                  ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/30'
                  : 'border-rose-500 bg-rose-500/20 shadow-lg shadow-rose-500/30';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOption !== null}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all ${borderStyle}`}
                >
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Option {opt.id}
                  </span>
                  {renderPattern(opt, 'w-16 h-16')}
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
            <h4 className="text-2xl font-black text-white">Visual Recognition Complete!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your visuospatial pattern discrimination performance has been recorded.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Correct</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {resultData.correct} / {resultData.total}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Accuracy</div>
              <div className="text-2xl font-black text-neuro-teal mt-1">
                {resultData.accuracy}%
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
                setCurrentRound(0);
                setCorrectAnswers(0);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
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
