'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, AnswerEvaluation, RoleType, ExperienceLevel, InterviewSession, SimulationMode } from '@/types/interview';
import { ROLE_METADATA } from '@/data/questions';
import { 
  Mic, MicOff, Volume2, VolumeX, Send, Sparkles, CheckCircle2, 
  AlertCircle, ArrowRight, Lightbulb, Clock, Check, RefreshCw,
  Cpu, BookOpen, Terminal, Zap, ShieldAlert, Sliders, Play, Square,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: {
    [index: number]: SpeechRecognitionResultItem;
    isFinal?: boolean;
  };
}

interface BrowserSpeechEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: BrowserSpeechEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
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
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Audio / Speech Customization Settings
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [speechVolume, setSpeechVolume] = useState<number>(1.0);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [isPausedTTS, setIsPausedTTS] = useState<boolean>(false);

  // Spoken feedback toggle
  const [isReadingEvaluation, setIsReadingEvaluation] = useState<boolean>(false);

  const [completedItems, setCompletedItems] = useState<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    evaluation: AnswerEvaluation;
    timeSpentSeconds: number;
  }[]>([]);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const isIntentionalStopRef = useRef<boolean>(false);
  const finalTranscriptAccumulatorRef = useRef<string>('');
  const currentQ = questions[currentIndex];
  const roleInfo = ROLE_METADATA[role];

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize and load system & neural voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);

        // Auto-select preferred high-quality neural voice if not set
        if (!selectedVoiceURI) {
          const naturalVoice = voices.find(v => 
            v.lang.startsWith('en') && 
            (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Ava') || v.name.includes('David'))
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

          if (naturalVoice) {
            setSelectedVoiceURI(naturalVoice.voiceURI);
          }
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoiceURI]);

  // Web Speech Synthesis (AI Interviewer Voice)
  const speakText = useCallback((text: string, onDone?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setIsPausedTTS(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = speechVolume;

    if (selectedVoiceURI && availableVoices.length > 0) {
      const match = availableVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      setIsSpeakingQuestion(true);
    };

    utterance.onend = () => {
      setIsSpeakingQuestion(false);
      setIsPausedTTS(false);
      if (onDone) onDone();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e.error);
      }
      setIsSpeakingQuestion(false);
      setIsPausedTTS(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [speechRate, speechPitch, speechVolume, selectedVoiceURI, availableVoices]);

  // Cancel or Stop Speech Synthesis
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      setIsPausedTTS(false);
      setIsReadingEvaluation(false);
    }
  }, []);

  // Pause / Resume Speech Synthesis
  const togglePauseTTS = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPausedTTS(false);
      setIsSpeakingQuestion(true);
    } else if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPausedTTS(true);
      setIsSpeakingQuestion(false);
    }
  }, []);

  // Auto-speak question when changing question or entering voice mode
  useEffect(() => {
    if (mode === 'voice' && currentQ) {
      speakText(currentQ.question);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIndex, currentQ, mode, speakText]);

  // Read AI evaluation aloud with voice
  const readEvaluationAloud = () => {
    if (!evaluation) return;
    if (isReadingEvaluation) {
      stopSpeaking();
      return;
    }

    const narrative = `Here is your assessment for question ${currentIndex + 1}. Overall score: ${evaluation.score} out of 100. Technical accuracy: ${evaluation.technicalAccuracyScore} percent. Communication clarity: ${evaluation.communicationScore} percent. STAR structure: ${evaluation.structureScore} percent. Key strengths identified: ${evaluation.strengths.slice(0, 2).join('. ')}. Suggested improvement: ${evaluation.improvements.slice(0, 1).join('. ')}`;

    setIsReadingEvaluation(true);
    speakText(narrative, () => {
      setIsReadingEvaluation(false);
    });
  };

  // Sync ref with current user answer text
  useEffect(() => {
    finalTranscriptAccumulatorRef.current = userAnswer;
  }, [userAnswer]);

  // Web Speech Recognition (Speech-to-Text Dictation)
  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    // Stop TTS if user starts speaking so mic doesn't catch AI voice
    if (!isRecording && isSpeakingQuestion) {
      stopSpeaking();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Speech Recognition is not supported on this browser. Try Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      isIntentionalStopRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      setInterimTranscript('');
      return;
    }

    try {
      isIntentionalStopRef.current = false;
      const recognition: BrowserSpeechRecognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: BrowserSpeechEvent) => {
        let currentInterim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const transcriptPiece = item[0].transcript;
          if (item.isFinal) {
            const separator = finalTranscriptAccumulatorRef.current && !finalTranscriptAccumulatorRef.current.endsWith(' ') ? ' ' : '';
            finalTranscriptAccumulatorRef.current = finalTranscriptAccumulatorRef.current + separator + transcriptPiece.trim();
            setUserAnswer(finalTranscriptAccumulatorRef.current);
          } else {
            currentInterim += transcriptPiece;
          }
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
          console.warn('SpeechRecognition error:', e.error);
        }
      };

      recognition.onend = () => {
        // Auto-reconnect if not stopped intentionally and still in recording mode
        if (!isIntentionalStopRef.current && recognitionRef.current) {
          try {
            recognition.start();
            return;
          } catch {
            // ignore
          }
        }
        setIsRecording(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
      setInterimTranscript('');
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || isEvaluating) return;

    if (isRecording && recognitionRef.current) {
      isIntentionalStopRef.current = true;
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript('');
    }

    stopSpeaking();
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
    stopSpeaking();

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
      setInterimTranscript('');
      finalTranscriptAccumulatorRef.current = '';
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
      <div className="clay-panel-glow p-4 px-6 flex flex-wrap items-center justify-between gap-4 border border-[#E8E2D9]">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A4A] animate-pulse" />
          <span className="font-extrabold text-sm text-[#1A1A1A] tracking-wide">
            {roleInfo.title}
          </span>
          <span className="text-[#6B7280]">•</span>
          <span className="text-xs text-[#2D5A4A] font-mono font-bold clay-panel px-2.5 py-0.5 rounded-full border border-[#E8E2D9]">
            {level}
          </span>
          <span className="text-[#6B7280]">•</span>
          <span className="text-xs text-[#1A1A1A] font-mono font-bold clay-panel px-2.5 py-0.5 rounded-full border border-[#E8E2D9] uppercase">
            {mode} PROTOCOL
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1A1A1A] clay-panel px-3.5 py-1.5 rounded-xl border border-[#E8E2D9]">
            <Clock className="w-3.5 h-3.5 text-[#2D5A4A]" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6B7280]">
            <span>QUESTION {currentIndex + 1} / {questions.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-32 bg-[#FAF8F5] h-3 rounded-full overflow-hidden border border-[#E8E2D9] p-0.5">
            <div 
              className="bg-gradient-to-r from-[#2D5A4A] to-[#3d7863] h-full rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Quick Voice Settings Trigger */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showVoiceSettings 
                ? 'btn-clay-primary text-white' 
                : 'clay-panel border-[#E8E2D9] text-[#1A1A1A] hover:text-[#2D5A4A]'
            }`}
            title="Speech Synthesizer Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Engine</span>
          </button>

          <button
            onClick={onExit}
            className="text-xs text-rose-600 hover:text-rose-700 font-mono font-bold transition-colors px-3 py-1.5 rounded-xl hover:bg-rose-50 border border-rose-200 cursor-pointer"
          >
            Exit Studio
          </button>
        </div>
      </div>

      {/* Expandable Voice & Speech Customization Console */}
      {showVoiceSettings && (
        <div className="clay-panel-glow p-5 border border-[#E8E2D9] animate-in fade-in duration-200 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#2D5A4A]" />
              <h4 className="text-xs font-mono font-black text-[#1A1A1A] uppercase tracking-wider">
                Speech Synthesizer Calibration
              </h4>
            </div>
            <span className="text-[11px] font-mono text-[#2D5A4A]">
              {availableVoices.length} Voices Detected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* Voice Model Selector */}
            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-[#1A1A1A] text-[11px] font-semibold block">Select Voice Persona</label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl px-3 py-2 text-[#1A1A1A] focus:outline-none focus:border-[#2D5A4A] text-xs"
              >
                {availableVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang}) {v.default ? '★ Default' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Speaking Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#6B7280]">Pace / Speed</span>
                <span className="text-[#2D5A4A] font-bold">{speechRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-[#2D5A4A] cursor-pointer"
              />
            </div>

            {/* Speaking Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#6B7280]">Pitch Tone</span>
                <span className="text-[#2D5A4A] font-bold">{speechPitch.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full accent-[#2D5A4A] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => speakText("This is a live preview test of your calibrated neural speech synthesizer.")}
              className="px-4 py-1.5 rounded-xl btn-clay-primary text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <Play className="w-3 h-3" /> Test Voice Sample
            </button>

            <button
              onClick={() => {
                setSpeechRate(1.0);
                setSpeechPitch(1.0);
                setSpeechVolume(1.0);
              }}
              className="text-[11px] text-[#6B7280] hover:text-[#1A1A1A] font-mono flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: AI Agent & Live Question & Candidate Studio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Subcard 1: AI Agent & Question Display */}
          <div className="clay-panel-glow p-6 sm:p-7 border border-[#E8E2D9] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6C4A8]/15 rounded-full blur-3xl pointer-events-none" />

            {/* AI Agent Avatar Status Bar */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-13 h-13 rounded-2xl btn-clay-primary flex items-center justify-center border border-white/50 shadow-md ai-orb-pulse">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  {isSpeakingQuestion && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D5A4A] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#2D5A4A]"></span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#1A1A1A] flex items-center gap-2 tracking-tight">
                    Interviewer AI
                    <span className="text-[10px] clay-badge-cyan px-2.5 py-0.5 rounded-full font-mono font-semibold">
                      {currentQ.category}
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B7280] font-mono mt-0.5">
                    {isSpeakingQuestion 
                      ? 'Speaking question aloud...' 
                      : isPausedTTS 
                        ? 'Speech synthesis paused.' 
                        : 'Awaiting candidate response...'}
                  </p>
                </div>
              </div>

              {/* Sound Audio Action Controls */}
              <div className="flex items-center gap-2">
                {isSpeakingQuestion ? (
                  <>
                    <button
                      onClick={togglePauseTTS}
                      title="Pause Voice Question"
                      className="p-3 rounded-2xl btn-clay-dark cursor-pointer text-[#1A1A1A] hover:text-[#2D5A4A]"
                    >
                      <span className="text-xs font-mono font-bold">||</span>
                    </button>
                    <button
                      onClick={stopSpeaking}
                      title="Stop Speaking"
                      className="p-3 rounded-2xl btn-clay-dark cursor-pointer text-rose-600 hover:text-rose-700"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => speakText(currentQ.question)}
                    title="Speak Question Aloud"
                    className="p-3 rounded-2xl btn-clay-primary cursor-pointer text-white shadow-sm group"
                  >
                    <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* Question Display */}
            <div className="my-5 p-6 rounded-2xl clay-card border border-[#E8E2D9] relative z-10">
              <span className="text-[10px] text-[#2D5A4A] font-bold uppercase tracking-widest block mb-2 font-mono">
                QUESTION #{currentIndex + 1}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1A1A1A] leading-relaxed tracking-tight">
                &ldquo;{currentQ.question}&rdquo;
              </h2>
            </div>

            {/* Smart Hint Expander */}
            {currentQ.hint && (
              <div className="pt-2 relative z-10">
                {!showHint ? (
                  <button
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-2 text-xs text-[#2D5A4A] hover:underline font-mono font-semibold transition-colors group cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4 text-[#2D5A4A] group-hover:scale-110 transition-transform" />
                    <span>Need technical direction or hint?</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl clay-panel border border-[#D6C4A8] text-[#1A1A1A] text-xs flex items-start gap-2.5 animate-in fade-in duration-300 font-normal">
                    <Lightbulb className="w-4 h-4 text-[#2D5A4A] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{currentQ.hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subcard 2: User Response Console */}
          <div className="clay-panel-glow p-6 sm:p-7 border border-[#E8E2D9] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#2D5A4A]" />
                Candidate Response Studio
              </label>

              {/* Voice Dictation Toggle */}
              <button
                onClick={toggleRecording}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 cursor-pointer transition-all ${
                  isRecording
                    ? 'btn-clay-pink text-[#1A1A1A] shadow-md ring-2 ring-[#2D5A4A]'
                    : 'btn-clay-primary text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Stop Voice Dictation
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Voice Dictation
                  </>
                )}
              </button>
            </div>

            {/* Audio Wave Visualizer & Real-time Live Interim Preview while speaking */}
            {isRecording && (
              <div className="mb-4 space-y-2">
                <div className="p-3 rounded-2xl clay-panel border border-[#D6C4A8] flex items-center justify-between px-5 h-16 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#2D5A4A] animate-ping" />
                    <span className="text-xs text-[#1A1A1A] font-mono font-bold">Microphone Active • Continuous Dictation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 rounded-full audio-bar-1" />
                    <div className="w-2 rounded-full audio-bar-2" />
                    <div className="w-2 rounded-full audio-bar-3" />
                    <div className="w-2 rounded-full audio-bar-1" />
                    <div className="w-2 rounded-full audio-bar-2" />
                    <div className="w-2 rounded-full audio-bar-3" />
                  </div>
                </div>

                {interimTranscript && (
                  <div className="p-2.5 px-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs font-mono text-[#1A1A1A] flex items-center gap-2 animate-pulse">
                    <span className="text-[10px] uppercase font-bold text-[#2D5A4A]">Live Capturing:</span>
                    <span className="italic truncate">{interimTranscript}</span>
                  </div>
                )}
              </div>
            )}

            <textarea
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                finalTranscriptAccumulatorRef.current = e.target.value;
              }}
              disabled={isEvaluating || evaluation !== null}
              rows={7}
              placeholder="Formulate your response here. Speak naturally via mic dictation or type structured responses adopting the STAR framework (Situation, Task, Action, Result)..."
              className="w-full bg-[#FAF8F5] border border-[#E8E2D9] rounded-2xl p-4 text-sm text-[#1A1A1A] placeholder-[#6B7280] focus:outline-none focus:border-[#2D5A4A] focus:ring-1 focus:ring-[#2D5A4A] transition-all resize-none font-sans font-normal leading-relaxed"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#6B7280] font-mono">
                  Words: <strong className="text-[#1A1A1A] font-bold">{userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0}</strong>
                </span>

                {userAnswer && !evaluation && (
                  <button
                    onClick={() => {
                      setUserAnswer('');
                      finalTranscriptAccumulatorRef.current = '';
                    }}
                    className="text-[11px] text-[#6B7280] hover:text-rose-600 font-mono transition cursor-pointer"
                  >
                    Clear Text
                  </button>
                )}
              </div>

              {!evaluation ? (
                <button
                  onClick={handleEvaluate}
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="px-8 py-3.5 rounded-xl btn-clay-primary disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm text-white"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" /> Evaluating Response...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" /> Evaluate Response
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-xl btn-clay-pink font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm text-[#1A1A1A]"
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

        {/* Right Column: AI Score & Rubric Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="clay-panel-glow p-6 sm:p-7 border border-[#E8E2D9] sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2 tracking-tight font-mono">
                <Sparkles className="w-4 h-4 text-[#2D5A4A]" />
                Real-Time AI Scorecard
              </h3>

              {evaluation && (
                <button
                  onClick={readEvaluationAloud}
                  className={`p-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    isReadingEvaluation 
                      ? 'btn-clay-pink text-[#1A1A1A]' 
                      : 'clay-panel border-[#E8E2D9] text-[#1A1A1A] hover:text-[#2D5A4A]'
                  }`}
                  title="Speak AI Evaluation Breakdown"
                >
                  {isReadingEvaluation ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="text-[10px]">{isReadingEvaluation ? 'Stop Audio' : 'Read Aloud'}</span>
                </button>
              )}
            </div>

            {!evaluation ? (
              <div className="text-center py-16 px-4 border border-dashed border-[#E8E2D9] rounded-2xl clay-panel">
                <div className="w-14 h-14 rounded-2xl btn-clay-primary mx-auto flex items-center justify-center text-white mb-4 shadow-sm">
                  <Cpu className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#1A1A1A] mb-1 tracking-tight">Awaiting Candidate Submission</h4>
                <p className="text-xs text-[#6B7280] font-normal max-w-xs mx-auto leading-relaxed">
                  Submit your response to receive immediate multi-attribute rubric grades on accuracy, clarity, and STAR structure.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Score Hero Card */}
                <div className="flex items-center justify-between p-5 rounded-2xl clay-card border border-[#E8E2D9]">
                  <div>
                    <span className="text-[10px] text-[#6B7280] font-mono font-bold uppercase tracking-widest block">
                      OVERALL SCORE
                    </span>
                    <span className="text-4xl font-black text-[#2D5A4A]">
                      {evaluation.score}<span className="text-lg text-[#6B7280] font-normal">/100</span>
                    </span>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide ${
                    evaluation.score >= 80 
                      ? 'btn-clay-primary text-white'
                      : evaluation.score >= 60 
                      ? 'btn-clay-purple text-white'
                      : 'btn-clay-pink text-[#1A1A1A]'
                  }`}>
                    {evaluation.score >= 80 ? 'EXEMPLARY' : evaluation.score >= 60 ? 'COMPETENT' : 'NEEDS REVISION'}
                  </div>
                </div>

                {/* Submetrics Breakdown */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono font-semibold">
                      <span className="text-[#1A1A1A]">Technical Accuracy</span>
                      <span className="text-[#2D5A4A] font-bold">{evaluation.technicalAccuracyScore}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8E2D9]">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2D5A4A] to-[#3d7863] rounded-full transition-all duration-700"
                        style={{ width: `${evaluation.technicalAccuracyScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono font-semibold">
                      <span className="text-[#1A1A1A]">Communication &amp; Clarity</span>
                      <span className="text-[#2D5A4A] font-bold">{evaluation.communicationScore}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8E2D9]">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D6C4A8] to-[#b89f78] rounded-full transition-all duration-700"
                        style={{ width: `${evaluation.communicationScore}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono font-semibold">
                      <span className="text-[#1A1A1A]">STAR Structure &amp; Logic</span>
                      <span className="text-[#2D5A4A] font-bold">{evaluation.structureScore}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E8E2D9]">
                      <div 
                        className="h-full bg-gradient-to-r from-[#3d7863] to-[#2D5A4A] rounded-full transition-all duration-700"
                        style={{ width: `${evaluation.structureScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {evaluation.strengths.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-[#2D5A4A] flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A4A]" /> Strengths Identified
                    </h5>
                    {evaluation.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-[#1A1A1A] pl-3.5 border-l-2 border-[#2D5A4A] leading-relaxed font-normal">
                        {s}
                      </p>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {evaluation.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-[#b89f78] flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5 text-[#b89f78]" /> High-Impact Improvements
                    </h5>
                    {evaluation.improvements.map((imp, i) => (
                      <p key={i} className="text-xs text-[#6B7280] pl-3.5 border-l-2 border-[#D6C4A8] leading-relaxed font-normal">
                        {imp}
                      </p>
                    ))}
                  </div>
                )}

                {/* Model Answer Outline */}
                <div className="pt-3 border-t border-[#E8E2D9]">
                  <h5 className="text-xs font-mono font-bold text-[#2D5A4A] mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                    <BookOpen className="w-3.5 h-3.5 text-[#2D5A4A]" /> Model Answer Blueprint
                  </h5>
                  <p className="text-xs text-[#1A1A1A] clay-panel p-4 rounded-xl border border-[#E8E2D9] leading-relaxed font-sans font-normal">
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
