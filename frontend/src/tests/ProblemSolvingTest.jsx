import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Lightbulb, CheckCircle2, RotateCcw, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

const LOGIC_QUESTIONS_EN = [
  {
    id: 1,
    title: "Geometric Progression",
    question: "Identify the missing number in the sequence:",
    sequence: "3,   6,   12,   24,   48,   [  ?  ]",
    options: ["72", "96", "84", "108"],
    correctIndex: 1,
    explanation: "Each number is multiplied by 2 (doubled) to obtain the next term: 48 × 2 = 96."
  },
  {
    id: 2,
    title: "Fibonacci Summation",
    question: "What is the next number in this recursive series?",
    sequence: "1,   1,   2,   3,   5,   8,   [  ?  ]",
    options: ["11", "12", "13", "15"],
    correctIndex: 2,
    explanation: "Each term is the sum of the preceding two terms: 5 + 8 = 13."
  },
  {
    id: 3,
    title: "Relational Analogy",
    question: "Complete the conceptual relationship:",
    sequence: "OCEAN  is to  WATER  as  FOREST  is to  [  ?  ]",
    options: ["LEAF", "TREES", "RAIN", "DESERT"],
    correctIndex: 1,
    explanation: "An ocean is fundamentally composed of water; a forest is fundamentally composed of trees."
  },
  {
    id: 4,
    title: "Constant Difference Series",
    question: "Determine the missing value at the end of the line:",
    sequence: "4,   7,   10,   13,   16,   [  ?  ]",
    options: ["18", "19", "20", "21"],
    correctIndex: 1,
    explanation: "Constant difference of +3 between successive terms: 16 + 3 = 19."
  },
  {
    id: 5,
    title: "Abstract Rule Induction",
    question: "Which number replaces the question mark?",
    sequence: "2,   5,   11,   23,   47,   [  ?  ]",
    options: ["95", "91", "89", "99"],
    correctIndex: 0,
    explanation: "Rule is (n × 2) + 1: (47 × 2) + 1 = 95."
  }
];

const LOGIC_QUESTIONS_TA = [
  {
    id: 1,
    title: "பெருக்குத் தொடர் வரிசை",
    question: "வரிசையில் விடுபட்ட எண்ணைக் கண்டறியவும்:",
    sequence: "3,   6,   12,   24,   48,   [  ?  ]",
    options: ["72", "96", "84", "108"],
    correctIndex: 1,
    explanation: "ஒவ்வொரு எண்ணும் 2 ஆல் பெருக்கப்படுகிறது: 48 × 2 = 96."
  },
  {
    id: 2,
    title: "பிபனாச்சி தொடர்",
    question: "இந்தத் தொடரின் அடுத்த எண் என்ன?",
    sequence: "1,   1,   2,   3,   5,   8,   [  ?  ]",
    options: ["11", "12", "13", "15"],
    correctIndex: 2,
    explanation: "முந்தைய இரண்டு எண்களின் கூட்டுத்தொகை: 5 + 8 = 13."
  },
  {
    id: 3,
    title: "தொடர்பு ஒப்புமை",
    question: "சரியான சொல்லால் இணைக்கவும்:",
    sequence: "கடல் : நீர் :: காடு : [  ?  ]",
    options: ["இலை", "மரங்கள்", "மழை", "பாலைவனம்"],
    correctIndex: 1,
    explanation: "கடல் நீரால் ஆனது போல காடு மரங்களால் சூழப்பட்டது."
  },
  {
    id: 4,
    title: "கூட்டுத் தொடர் வரிசை",
    question: "அடுத்த எண்ணைக் கணக்கிடுங்கள்:",
    sequence: "4,   7,   10,   13,   16,   [  ?  ]",
    options: ["18", "19", "20", "21"],
    correctIndex: 1,
    explanation: "ஒவ்வொரு எண்ணுக்கும் இடையே +3 வித்தியாசம்: 16 + 3 = 19."
  },
  {
    id: 5,
    title: "தர்க்க விதி முறை",
    question: "கேள்விக்குறியை மாற்றும் சரியான எண் எது?",
    sequence: "2,   5,   11,   23,   47,   [  ?  ]",
    options: ["95", "91", "89", "99"],
    correctIndex: 0,
    explanation: "விதி: (n × 2) + 1: (47 × 2) + 1 = 95."
  }
];

export const ProblemSolvingTest = ({ onComplete, onBack }) => {
  const { t, language } = useLanguage();
  const { recordTestResult } = useAuth();

  const [phase, setPhase] = useState('instructions');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [resultData, setResultData] = useState(null);

  const questions = language === 'ta' ? LOGIC_QUESTIONS_TA : LOGIC_QUESTIONS_EN;
  const currentQ = questions[currentIndex];

  const handleStart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setPhase('active');
  };

  const handleSelectOption = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishTest(score);
    }
  };

  const finishTest = async (finalScore) => {
    setPhase('completed');
    const total = questions.length;
    const accuracy = Math.round((finalScore / total) * 100);

    const submission = await recordTestResult('problem_solving', finalScore, {
      total_puzzles: total,
      accuracy
    });

    setResultData({
      score: finalScore,
      total,
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
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t.tests.problem.name}</h3>
            <p className="text-xs text-indigo-400 font-medium">
              {t.tests.problem.domain} • {t.tests.problem.lobe}
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
            <h4 className="font-bold text-sm text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.tests.instructions}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t.tests.problem.summary}
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div>• You will answer 5 inductive reasoning questions.</div>
              <div>• Identify the hidden rule governing each sequence and select the correct missing term.</div>
              <div>• Take your time to think carefully before choosing an option.</div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Start Problem Solving Test</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active Phase */}
      {phase === 'active' && currentQ && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{t.tests.problem.question} {currentIndex + 1} {t.tests.problem.of} {questions.length}</span>
            <span>Score: {score}</span>
          </div>

          {/* Question Sequence Display */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {currentQ.title}
            </span>
            <p className="text-xs text-slate-300">
              {currentQ.question}
            </p>
            <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-widest py-3 bg-slate-900 rounded-xl border border-slate-800">
              {currentQ.sequence}
            </div>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOpt = idx === currentQ.correctIndex;

              let style = 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-200';
              if (showExplanation) {
                if (isCorrectOpt) {
                  style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  style = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-xl border text-sm sm:text-base font-bold transition-all text-center ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${selectedAnswer === currentQ.correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedAnswer === currentQ.correctIndex ? '✓ Correct Answer!' : '✗ Not Quite.'}
                </span>
              </div>
              <p className="text-slate-300">
                <strong>Logic Rule: </strong>{currentQ.explanation}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed Phase */}
      {phase === 'completed' && resultData && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-black text-white">Problem Solving Complete!</h4>
            <p className="text-sm text-slate-300 mt-1">
              Your fluid reasoning and inductive logic performance have been evaluated.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-800 border border-neuro-border">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Correct</div>
              <div className="text-2xl font-black text-indigo-400 mt-1">
                {resultData.score} / {resultData.total}
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
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {resultData.normalizedScore}/100
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setPhase('instructions');
                setCurrentIndex(0);
                setScore(0);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tests.retakeTest}</span>
            </button>

            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <span>View Assessment Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
