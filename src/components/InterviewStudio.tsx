'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, AnswerEvaluation, RoleType, ExperienceLevel, InterviewSession, SimulationMode } from '@/types/interview';
import { ROLE_METADATA } from '@/data/questions';
import { 
  Mic, MicOff, Volume2, Send, Sparkles, CheckCircle2, 
  AlertCircle, ArrowRight, Lightbulb, Clock, Check, RefreshCw,
  Cpu, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
  };
}

interface BrowserSpeechEvent {
  results: SpeechRecognitionResultList;
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: BrowserSpeechEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

interface InterviewStudioProps {
  questions: Question[];
  role: RoleType;
  level: ExperienceLevel;
  mode: SimulationMode;
  onComplete: (session: InterviewSession) => void;
  onExit: () => void;
}

export const InterviewStudio: React.FC<InterviewStudioProps> = ({
  questions,
  role,
  level,
  mode,
  onComplete,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const [completedItems, setCompletedItems] = useState<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    evaluation: AnswerEvaluation;
    timeSpentSeconds: number;
  }[]>([]);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const currentQ = questions[currentIndex];
  const roleInfo = ROLE_METADATA[role];

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Speech Synthesis (AI Interviewer Voice)
  const speakQuestion = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Speak question automatically in voice mode
  useEffect(() => {
    if (mode === 'voice' && currentQ) {
      speakQuestion(currentQ.question);
    }
  }, [currentIndex, mode, currentQ, speakQuestion]);

  // Voice Recognition (Speech to Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as {
        SpeechRecognition?: new () => BrowserSpeechRecognition;
        webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
      };
      const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: BrowserSpeechEvent) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          setUserAnswer(transcript);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer or use Chrome/Edge.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          userAnswer
        })
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
        if (data.evaluation.score >= 80) {
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.75 }
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (!evaluation) return;

    const newCompleted = [
      ...completedItems,
      {
        questionId: currentQ.id,
        questionText: currentQ.question,
        userAnswer,
        evaluation,
        timeSpentSeconds: timerSeconds
      }
    ];

    setCompletedItems(newCompleted);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setEvaluation(null);
      setShowHint(false);
    } else {
      const totalScore = Math.round(
        newCompleted.reduce((acc, curr) => acc + curr.evaluation.score, 0) / newCompleted.length
      );
      const techAvg = Math.round(
        newCompleted.reduce((acc, curr) => acc + curr.evaluation.technicalAccuracyScore, 0) / newCompleted.length
      );
      const commAvg = Math.round(
        newCompleted.reduce((acc, curr) => acc + curr.evaluation.communicationScore, 0) / newCompleted.length
      );
      const structAvg = Math.round(
        newCompleted.reduce((acc, curr) => acc + curr.evaluation.structureScore, 0) / newCompleted.length
      );

      const finalSession: InterviewSession = {
        id: 'session-' + Date.now(),
        role,
        level,
        mode,
        startedAt: new Date(Date.now() - timerSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        items: newCompleted,
        overallScore: totalScore,
        technicalAccuracyAverage: techAvg,
        communicationAverage: commAvg,
        structureAverage: structAvg,
        summaryFeedback: `Demonstrated solid analytical fundamentals with an overall score of ${totalScore}%. Continue practicing STAR frameworks for complex scenarios.`
      };

      onComplete(finalSession);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* HUD Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/20 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {roleInfo.title} • {level}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-xs text-slate-300 font-medium">
            Question <span className="text-cyan-400 font-black">{currentIndex + 1}</span> of {questions.length}
          </div>

          <div className="w-36 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-cyan-400/50"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-rose-400 font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
          >
            Exit Round
          </button>
        </div>
      </div>

      {/* Main Studio Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: AI Hologram Agent & Live Question */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-glow rounded-3xl p-7 border border-cyan-500/30 relative overflow-hidden">
            {/* Background glowing orb element */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* AI Agent Avatar Status Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center border border-cyan-300/40 shadow-xl shadow-cyan-500/25 ai-orb-pulse">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  {isSpeakingQuestion && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400"></span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Autonomous Interviewer
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                      {currentQ.category}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isSpeakingQuestion ? 'Speaking question aloud...' : 'Awaiting your answer formulation...'}
                  </p>
                </div>
              </div>

              {/* Sound Audio Action */}
              <button
                onClick={() => speakQuestion(currentQ.question)}
                title="Replay Voice Question"
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-slate-700 transition-all hover:scale-105"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Question Display */}
            <div className="my-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-2 font-mono">
                QUESTION #{currentIndex + 1}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                &ldquo;{currentQ.question}&rdquo;
              </h2>
            </div>

            {/* Smart Hint Expander */}
            {currentQ.hint && (
              <div className="pt-2">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Need technical direction or hint?</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-300">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{currentQ.hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Response Console */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Candidate Response Studio
              </label>

              {/* Voice Dictation Toggle */}
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Stop Mic
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-cyan-400" /> Voice Dictation
                  </>
                )}
              </button>
            </div>

            {/* Audio Wave Visualizer while speaking */}
            {isRecording && (
              <div className="mb-4 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center gap-1.5 h-14">
                <span className="text-xs text-cyan-300 font-semibold mr-3">Transcribing Live Speech...</span>
                <div className="w-1.5 bg-cyan-400 rounded-full audio-bar-1" />
                <div className="w-1.5 bg-cyan-300 rounded-full audio-bar-2" />
                <div className="w-1.5 bg-sky-400 rounded-full audio-bar-3" />
                <div className="w-1.5 bg-cyan-400 rounded-full audio-bar-1" />
                <div className="w-1.5 bg-indigo-400 rounded-full audio-bar-2" />
              </div>
            )}

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isEvaluating || evaluation !== null}
              rows={7}
              placeholder="Formulate your response here. Speak naturally via mic or type structured responses adopting the STAR framework (Situation, Task, Action, Result)..."
              className="w-full bg-[#030611]/90 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none font-sans leading-relaxed"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                Words Count: <strong className="text-white">{userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</strong>
              </span>

              {!evaluation ? (
                <button
                  onClick={handleEvaluate}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="px-7 py-3 rounded-xl btn-electric disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm flex items-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating Answer...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Evaluate Response
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  {currentIndex + 1 < questions.length ? (
                    <>
                      Next Question <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Finalize Interview <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time AI Score & Rubric Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/20 sticky top-24">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Real-Time AI Scorecard
            </h3>

            {!evaluation ? (
              <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 mb-4">
                  <Cpu className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">Awaiting Candidate Submission</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Submit your response to receive immediate multi-attribute rubric grades on accuracy, clarity, and STAR structure.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Score Hero Card */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-sky-950/40 to-slate-900/60 border border-cyan-400/40 shadow-inner">
                  <div>
                    <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block font-mono">
                      OVERALL SCORE
                    </span>
                    <span className="text-4xl font-black text-white">
                      {evaluation.score}<span className="text-lg text-cyan-400 font-semibold">/100</span>
                    </span>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide ${
                    evaluation.score >= 80 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                      : evaluation.score >= 60 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                  }`}>
                    {evaluation.score >= 80 ? 'EXEMPLARY' : evaluation.score >= 60 ? 'COMPETENT' : 'NEEDS REVISION'}
                  </div>
                </div>

                {/* Submetrics Breakdown */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-slate-400">Technical Accuracy</span>
                      <span className="text-cyan-300 font-bold">{evaluation.technicalAccuracyScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-cyan-400 rounded-full transition-all duration-700 shadow-sm shadow-cyan-400/50"
                        style={{ width: `${evaluation.technicalAccuracyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-slate-400">Communication &amp; Clarity</span>
                      <span className="text-sky-300 font-bold">{evaluation.communicationScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-sky-400 rounded-full transition-all duration-700 shadow-sm shadow-sky-400/50"
                        style={{ width: `${evaluation.communicationScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-slate-400">STAR Structure &amp; Logic</span>
                      <span className="text-indigo-300 font-bold">{evaluation.structureScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-indigo-400 rounded-full transition-all duration-700 shadow-sm shadow-indigo-400/50"
                        style={{ width: `${evaluation.structureScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {evaluation.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths Identified
                    </h5>
                    {evaluation.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-slate-300 pl-3.5 border-l-2 border-emerald-500/40 leading-relaxed">
                        {s}
                      </p>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {evaluation.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <AlertCircle className="w-3.5 h-3.5" /> High-Impact Improvements
                    </h5>
                    {evaluation.improvements.map((imp, i) => (
                      <p key={i} className="text-xs text-slate-300 pl-3.5 border-l-2 border-amber-500/40 leading-relaxed">
                        {imp}
                      </p>
                    ))}
                  </div>
                )}

                {/* Model Answer Outline */}
                <div className="pt-3 border-t border-slate-800/80">
                  <h5 className="text-xs font-black text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Model Answer Blueprint
                  </h5>
                  <p className="text-xs text-slate-400 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-sans">
                    {evaluation.suggestedAnswer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
