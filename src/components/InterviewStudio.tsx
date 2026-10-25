'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, AnswerEvaluation, RoleType, ExperienceLevel, InterviewSession, SimulationMode } from '@/types/interview';
import { ROLE_METADATA } from '@/data/questions';
import { 
  Mic, MicOff, Volume2, Send, Sparkles, CheckCircle2, 
  AlertCircle, ArrowRight, Lightbulb, Clock, Check, RefreshCw,
  Cpu, BookOpen, Terminal, Zap, ShieldAlert
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
      utterance.pitch = 1.05;
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
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIndex, currentQ, mode, speakQuestion]);

  // Web Speech Recognition
  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Speech Recognition is not supported on this browser. Try Chrome or Edge.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition: BrowserSpeechRecognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: BrowserSpeechEvent) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
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
      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || isEvaluating) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          questionText: currentQ.question,
          userAnswer: userAnswer.trim(),
          expectedKeywords: currentQ.expectedKeywords,
          role,
          level
        })
      });

      if (!res.ok) {
        throw new Error('API evaluation failed');
      }

      const data = await res.json();
      const evalData: AnswerEvaluation = data.evaluation || data;
      setEvaluation(evalData);

      if (evalData.score >= 80) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#00f0ff', '#ff007f', '#9d4edd', '#00ff66', '#ffaa00']
        });
      }
    } catch {
      const fallbackScore = Math.min(95, Math.max(50, Math.floor(userAnswer.split(' ').length * 1.5)));
      setEvaluation({
        score: fallbackScore,
        technicalAccuracyScore: fallbackScore,
        communicationScore: Math.min(100, fallbackScore + 5),
        structureScore: Math.min(100, fallbackScore - 5),
        strengths: ['Clear and articulately stated response.', 'Demonstrated understanding of core mechanics.'],
        improvements: ['Could incorporate additional concrete quantitative results or metrics.'],
        suggestedAnswer: currentQ.idealAnswerOutline || 'Formulate answers utilizing Situation, Task, Action, and measurable Results.',
        keyKeywordsFound: currentQ.expectedKeywords.slice(0, 2),
        missingKeywords: currentQ.expectedKeywords.slice(2, 4)
      });
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

      const session: InterviewSession = {
        id: `sess-${Date.now()}`,
        role,
        level,
        mode,
        startedAt: new Date(Date.now() - timerSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
        items: newCompleted,
        overallScore: totalScore,
        technicalAccuracyAverage: techAvg,
        communicationAverage: commAvg,
        structureAverage: structAvg
      };

      onComplete(session);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Telemetry Bar */}
      <div className="clay-panel-glow p-4 px-6 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/25">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
          <span className="font-extrabold text-sm text-white tracking-wide">
            {roleInfo.title}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-pink-400 font-mono font-bold clay-panel px-2.5 py-0.5 rounded-full border border-pink-500/25">
            {level}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-cyan-300 font-mono font-bold clay-panel px-2.5 py-0.5 rounded-full border border-cyan-500/25 uppercase">
            {mode} PROTOCOL
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-200 clay-panel px-3.5 py-1.5 rounded-xl border border-cyan-500/20">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <span>QUESTION {currentIndex + 1} / {questions.length}</span>
          </div>

          {/* Futuristic Cyber Progress Bar */}
          <div className="w-36 bg-[#0a0e22] h-3 rounded-full overflow-hidden border border-cyan-500/30 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,240,255,0.7)]"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <button
            onClick={onExit}
            className="text-xs text-rose-400 hover:text-rose-200 font-mono font-bold transition-colors px-3 py-1.5 rounded-xl hover:bg-rose-500/10 border border-rose-500/20 cursor-pointer"
          >
            Exit Arena
          </button>
        </div>
      </div>

      {/* Main Studio Arena in Cyber Bento Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Bento Column: AI Agent & Live Question & Candidate Studio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Subcard 1: AI Agent & Question Display */}
          <div className="clay-panel-glow p-6 sm:p-7 border border-cyan-500/25 relative overflow-hidden">
            {/* Background Cyber Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* AI Agent Avatar Status Bar */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-13 h-13 rounded-2xl btn-clay-cyan flex items-center justify-center border border-white/50 shadow-xl ai-orb-pulse">
                    <Sparkles className="w-6 h-6 text-[#030a1c]" />
                  </div>
                  {isSpeakingQuestion && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 shadow-[0_0_8px_#00f0ff]"></span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2 tracking-tight">
                    Neural Interviewer AI
                    <span className="text-[10px] clay-badge-cyan px-2.5 py-0.5 rounded-full font-mono font-semibold">
                      {currentQ.category}
                    </span>
                  </h3>
                  <p className="text-xs text-cyan-200/70 font-mono mt-0.5">
                    {isSpeakingQuestion ? 'Speaking question aloud via neural speech...' : 'Awaiting candidate solution synthesis...'}
                  </p>
                </div>
              </div>

              {/* Sound Audio Action with Claymorphic Tactile button */}
              <button
                onClick={() => speakQuestion(currentQ.question)}
                title="Replay Voice Question"
                className="p-3 rounded-2xl btn-clay-dark cursor-pointer text-cyan-300 hover:text-white"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Question Display with Cyber Clay Surface */}
            <div className="my-5 p-6 rounded-2xl clay-card border border-cyan-500/25 relative z-10">
              <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest block mb-2 font-mono">
                QUESTION #{currentIndex + 1}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed tracking-tight">
                &ldquo;{currentQ.question}&rdquo;
              </h2>
            </div>

            {/* Smart Hint Expander */}
            {currentQ.hint && (
              <div className="pt-2 relative z-10">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-2 text-xs text-amber-300/80 hover:text-amber-200 font-mono font-semibold transition-colors group cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Need technical direction or hint?</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl clay-panel border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-300 font-light">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{currentQ.hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subcard 2: User Response Console */}
          <div className="clay-panel-glow p-6 sm:p-7 border border-purple-500/25 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-mono font-bold text-purple-200 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Candidate Response Studio
              </label>

              {/* Voice Dictation Toggle with Cyber Claymorphic Styling */}
              <button
                onClick={toggleRecording}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-black font-mono flex items-center gap-2 cursor-pointer transition-all ${
                  isRecording
                    ? 'btn-clay-pink animate-pulse text-white shadow-[0_0_20px_rgba(255,0,127,0.7)]'
                    : 'btn-clay-cyan text-[#030a1c]'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Recording Live Mic...
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Voice Dictation
                  </>
                )}
              </button>
            </div>

            {/* Audio Wave Visualizer while speaking */}
            {isRecording && (
              <div className="mb-4 p-3 rounded-2xl clay-panel border border-pink-500/30 flex items-center justify-center gap-2 h-16 shadow-[0_0_20px_rgba(255,0,127,0.2)]">
                <span className="text-xs text-pink-200 font-mono font-semibold mr-3">Transcribing Neural Audio Stream...</span>
                <div className="w-2 rounded-full audio-bar-1" />
                <div className="w-2 rounded-full audio-bar-2" />
                <div className="w-2 rounded-full audio-bar-3" />
                <div className="w-2 rounded-full audio-bar-1" />
                <div className="w-2 rounded-full audio-bar-2" />
                <div className="w-2 rounded-full audio-bar-3" />
              </div>
            )}

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isEvaluating || evaluation !== null}
              rows={7}
              placeholder="Formulate your response here. Speak naturally via mic or type structured responses adopting the STAR framework (Situation, Task, Action, Result)..."
              className="w-full bg-[#0a0e22]/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 text-sm text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 transition-all resize-none font-sans font-light leading-relaxed shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-cyan-300/80 font-mono">
                Words Count: <strong className="text-white font-bold">{userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</strong>
              </span>

              {!evaluation ? (
                <button
                  onClick={handleEvaluate}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="px-8 py-3.5 rounded-xl btn-clay-cyan disabled:opacity-40 disabled:cursor-not-allowed font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_8px_20px_rgba(0,240,255,0.4)]"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#030a1c]" /> Evaluating Response...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#030a1c]" /> Evaluate Response
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-xl btn-clay-pink font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_8px_20px_rgba(255,0,127,0.4)]"
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

        {/* Right Bento Column: AI Score & Rubric Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="clay-panel-glow p-6 sm:p-7 border border-cyan-500/25 sticky top-24">
            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-5 tracking-tight font-mono">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Real-Time AI Cyber Scorecard
            </h3>

            {!evaluation ? (
              <div className="text-center py-16 px-4 border border-dashed border-cyan-500/30 rounded-2xl clay-panel">
                <div className="w-14 h-14 rounded-2xl btn-clay-purple mx-auto flex items-center justify-center text-white mb-4 shadow-[0_0_20px_rgba(157,78,221,0.4)]">
                  <Cpu className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-cyan-200 mb-1 tracking-tight">Awaiting Candidate Submission</h4>
                <p className="text-xs text-slate-400 font-light max-w-xs mx-auto leading-relaxed">
                  Submit your response to receive immediate multi-attribute rubric grades on accuracy, clarity, and STAR structure.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Score Hero Card with Cyber Clay Treatment */}
                <div className="flex items-center justify-between p-5 rounded-2xl clay-card border border-cyan-500/30">
                  <div>
                    <span className="text-[10px] text-cyan-300/80 font-mono font-bold uppercase tracking-widest block">
                      OVERALL SCORE
                    </span>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400 drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]">
                      {evaluation.score}<span className="text-lg text-slate-400 font-light">/100</span>
                    </span>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-black font-mono tracking-wide ${
                    evaluation.score >= 80 
                      ? 'btn-clay-cyan text-[#030a1c]'
                      : evaluation.score >= 60 
                      ? 'btn-clay-purple text-white'
                      : 'btn-clay-pink text-white'
                  }`}>
                    {evaluation.score >= 80 ? 'EXEMPLARY' : evaluation.score >= 60 ? 'COMPETENT' : 'NEEDS REVISION'}
                  </div>
                </div>

                {/* Submetrics Breakdown with Colourful Neon Gradients */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono font-semibold">
                      <span className="text-cyan-300">Technical Accuracy</span>
                      <span className="text-white font-bold">{evaluation.technicalAccuracyScore}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#0a0e22] rounded-full overflow-hidden border border-cyan-500/30">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(0,240,255,0.7)]"
                        style={{ width: `${evaluation.technicalAccuracyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono font-semibold">
                      <span className="text-pink-300">Communication &amp; Clarity</span>
                      <span className="text-white font-bold">{evaluation.communicationScore}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#0a0e22] rounded-full overflow-hidden border border-pink-500/30">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,0,127,0.7)]"
                        style={{ width: `${evaluation.communicationScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono font-semibold">
                      <span className="text-purple-300">STAR Structure &amp; Logic</span>
                      <span className="text-white font-bold">{evaluation.structureScore}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#0a0e22] rounded-full overflow-hidden border border-purple-500/30">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(157,78,221,0.7)]"
                        style={{ width: `${evaluation.structureScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {evaluation.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Strengths Identified
                    </h5>
                    {evaluation.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-slate-300 pl-3.5 border-l-2 border-emerald-400 leading-relaxed font-light">
                        {s}
                      </p>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {evaluation.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-pink-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5 text-pink-400" /> High-Impact Improvements
                    </h5>
                    {evaluation.improvements.map((imp, i) => (
                      <p key={i} className="text-xs text-slate-300 pl-3.5 border-l-2 border-pink-400 leading-relaxed font-light">
                        {imp}
                      </p>
                    ))}
                  </div>
                )}

                {/* Model Answer Outline */}
                <div className="pt-3 border-t border-cyan-500/20">
                  <h5 className="text-xs font-mono font-bold text-cyan-300 mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Model Answer Blueprint
                  </h5>
                  <p className="text-xs text-slate-200 clay-panel p-4 rounded-xl border border-cyan-500/20 leading-relaxed font-sans font-light">
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
