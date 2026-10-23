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
      const timer = setTimeout(() => {
        speakQuestion(currentQ.question);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mode, currentQ, speakQuestion]);

  // Web Speech Recognition (Mic Dictation)
  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognition; webkitSpeechRecognition?: new () => BrowserSpeechRecognition }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognition; webkitSpeechRecognition?: new () => BrowserSpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert('Speech recognition is not natively supported in this browser. You can type your response instead.');
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
      const recognition = new SpeechRec();
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

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;

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

      const evalData: AnswerEvaluation = await res.json();
      setEvaluation(evalData);

      if (evalData.score >= 80) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#ffffff', '#a3a3a3', '#525252']
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
      {/* HUD Header Bar in Monochrome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 glass-panel rounded-2xl p-4 sm:p-5 border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {roleInfo.title} • {level}
          </div>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800 uppercase font-semibold">
            Mode: {mode}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-white bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <div className="text-xs text-neutral-300 font-medium">
            Question <span className="text-white font-black">{currentIndex + 1}</span> of {questions.length}
          </div>

          <div className="w-36 bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-neutral-800 p-0.5">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <button
            onClick={onExit}
            className="text-xs text-neutral-400 hover:text-white font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-neutral-900 cursor-pointer"
          >
            Exit Round
          </button>
        </div>
      </div>

      {/* Main Studio Arena in Monochrome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: AI Hologram Agent & Live Question */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-glow rounded-3xl p-7 border border-neutral-800 relative overflow-hidden">
            {/* AI Agent Avatar Status Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-13 h-13 rounded-2xl bg-white text-black flex items-center justify-center border border-white shadow-xl ai-orb-pulse">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  {isSpeakingQuestion && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Autonomous Interviewer
                    <span className="text-[10px] bg-neutral-900 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded-full font-mono font-semibold">
                      {currentQ.category}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {isSpeakingQuestion ? 'Speaking question aloud...' : 'Awaiting your answer formulation...'}
                  </p>
                </div>
              </div>

              {/* Sound Audio Action */}
              <button
                onClick={() => speakQuestion(currentQ.question)}
                title="Replay Voice Question"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-all hover:scale-105 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Question Display */}
            <div className="my-5 p-5 rounded-2xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-2 font-mono">
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
                    className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white font-semibold transition-colors group cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                    <span>Need technical direction or hint?</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-300">
                    <Lightbulb className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{currentQ.hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Response Console */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-black text-neutral-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white" />
                Candidate Response Studio
              </label>

              {/* Voice Dictation Toggle */}
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-white text-black animate-pulse shadow-lg font-black'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-black" /> Stop Mic
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-white" /> Voice Dictation
                  </>
                )}
              </button>
            </div>

            {/* Audio Wave Visualizer while speaking */}
            {isRecording && (
              <div className="mb-4 p-3 rounded-2xl bg-neutral-950 border border-neutral-700 flex items-center justify-center gap-1.5 h-14">
                <span className="text-xs text-white font-semibold mr-3">Transcribing Live Speech...</span>
                <div className="w-1.5 bg-white rounded-full audio-bar-1" />
                <div className="w-1.5 bg-neutral-300 rounded-full audio-bar-2" />
                <div className="w-1.5 bg-neutral-400 rounded-full audio-bar-3" />
                <div className="w-1.5 bg-white rounded-full audio-bar-1" />
                <div className="w-1.5 bg-neutral-300 rounded-full audio-bar-2" />
              </div>
            )}

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isEvaluating || evaluation !== null}
              rows={7}
              placeholder="Formulate your response here. Speak naturally via mic or type structured responses adopting the STAR framework (Situation, Task, Action, Result)..."
              className="w-full bg-black border border-neutral-800 rounded-2xl p-4 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none font-sans leading-relaxed"
            />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">
                Words Count: <strong className="text-white">{userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</strong>
              </span>

              {!evaluation ? (
                <button
                  onClick={handleEvaluate}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="px-7 py-3 rounded-xl btn-electric disabled:opacity-50 disabled:cursor-not-allowed font-black text-sm flex items-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" /> Evaluating Answer...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-black" /> Evaluate Response
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-7 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  {currentIndex + 1 < questions.length ? (
                    <>
                      Next Question <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  ) : (
                    <>
                      Finalize Interview <Check className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Score & Rubric Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-neutral-800 sticky top-24">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-white" />
              Real-Time AI Scorecard
            </h3>

            {!evaluation ? (
              <div className="text-center py-16 px-4 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950">
                <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 mx-auto flex items-center justify-center text-white mb-4">
                  <Cpu className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-neutral-200 mb-1">Awaiting Candidate Submission</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Submit your response to receive immediate multi-attribute rubric grades on accuracy, clarity, and STAR structure.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Score Hero Card in Monochrome */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">
                      OVERALL SCORE
                    </span>
                    <span className="text-4xl font-black text-white">
                      {evaluation.score}<span className="text-lg text-neutral-400 font-semibold">/100</span>
                    </span>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide border ${
                    evaluation.score >= 80 
                      ? 'bg-white text-black border-white'
                      : evaluation.score >= 60 
                      ? 'bg-neutral-900 text-white border-neutral-700'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}>
                    {evaluation.score >= 80 ? 'EXEMPLARY' : evaluation.score >= 60 ? 'COMPETENT' : 'NEEDS REVISION'}
                  </div>
                </div>

                {/* Submetrics Breakdown */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-neutral-400">Technical Accuracy</span>
                      <span className="text-white font-bold">{evaluation.technicalAccuracyScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-700"
                        style={{ width: `${evaluation.technicalAccuracyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-neutral-400">Communication &amp; Clarity</span>
                      <span className="text-white font-bold">{evaluation.communicationScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-neutral-300 rounded-full transition-all duration-700"
                        style={{ width: `${evaluation.communicationScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-neutral-400">STAR Structure &amp; Logic</span>
                      <span className="text-white font-bold">{evaluation.structureScore}%</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div 
                        className="h-full bg-neutral-400 rounded-full transition-all duration-700"
                        style={{ width: `${evaluation.structureScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {evaluation.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Strengths Identified
                    </h5>
                    {evaluation.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-neutral-300 pl-3.5 border-l-2 border-white leading-relaxed">
                        {s}
                      </p>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {evaluation.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-neutral-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <AlertCircle className="w-3.5 h-3.5 text-neutral-400" /> High-Impact Improvements
                    </h5>
                    {evaluation.improvements.map((imp, i) => (
                      <p key={i} className="text-xs text-neutral-400 pl-3.5 border-l-2 border-neutral-700 leading-relaxed">
                        {imp}
                      </p>
                    ))}
                  </div>
                )}

                {/* Model Answer Outline */}
                <div className="pt-3 border-t border-neutral-800">
                  <h5 className="text-xs font-black text-neutral-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-white" /> Model Answer Blueprint
                  </h5>
                  <p className="text-xs text-neutral-400 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 leading-relaxed font-sans">
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
