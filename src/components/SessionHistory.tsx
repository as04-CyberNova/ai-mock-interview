'use client';

import React, { useState } from 'react';
import { InterviewSession } from '@/types/interview';
import { Calendar, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface SessionHistoryProps {
  sessions: InterviewSession[];
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-7">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5 text-white" />
          <span>Detailed Audit &amp; Transcripts</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          Interview Session Archives
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Review your previous mock interview attempts, rubric breakdowns, and AI feedback.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="glass-panel rounded-3xl p-14 text-center border border-neutral-800">
          <p className="text-neutral-400 text-sm">No completed interview sessions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;
            return (
              <div 
                key={session.id} 
                className="glass-panel rounded-3xl border border-neutral-800 overflow-hidden transition-all duration-200"
              >
                <div 
                  onClick={() => toggleExpand(session.id)}
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-900/60 transition-colors select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-neutral-900 border border-neutral-700 text-white font-black text-sm flex items-center justify-center uppercase font-mono shadow-sm">
                      {session.role.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white capitalize flex items-center gap-2.5">
                        {session.role.replace('-', ' ')} Mock Session
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-700 font-mono font-bold">
                          {session.mode.toUpperCase()}
                        </span>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-white" />
                          {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
                        </span>
                        <span>Level: {session.level}</span>
                        <span>{session.items.length} Questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">
                        {session.overallScore || 0}%
                      </span>
                      <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Overall Score</span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-6 bg-black border-t border-neutral-800 space-y-6">
                    {/* Performance Summary Metrics */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                      <div>
                        <span className="text-xs text-neutral-400 block font-medium">Technical Accuracy</span>
                        <span className="text-xl font-black text-white">{session.technicalAccuracyAverage || 0}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block font-medium">Communication</span>
                        <span className="text-xl font-black text-neutral-300">{session.communicationAverage || 0}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-400 block font-medium">STAR Structure</span>
                        <span className="text-xl font-black text-neutral-400">{session.structureAverage || 0}%</span>
                      </div>
                    </div>

                    {/* Question items */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-neutral-300 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        Questions &amp; Candidate Transcripts:
                      </h4>

                      {session.items.map((item, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <h5 className="text-sm font-bold text-white leading-relaxed">
                              Q{idx + 1}: {item.questionText}
                            </h5>
                            {item.evaluation && (
                              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-neutral-900 text-white border border-neutral-700 whitespace-nowrap">
                                {item.evaluation.score} / 100
                              </span>
                            )}
                          </div>

                          <div className="p-4 rounded-xl bg-black text-xs text-neutral-300 border border-neutral-850 leading-relaxed">
                            <span className="text-neutral-400 font-bold block mb-1 uppercase tracking-wider text-[10px] font-mono">
                              Your Spoken / Typed Response:
                            </span>
                            {item.userAnswer}
                          </div>

                          {item.evaluation && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                              <div className="space-y-1.5">
                                <span className="font-bold text-white flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Strengths
                                </span>
                                {item.evaluation.strengths.map((st, i) => (
                                  <p key={i} className="text-neutral-300 pl-3 border-l-2 border-white leading-relaxed">{st}</p>
                                ))}
                              </div>

                              <div className="space-y-1.5">
                                <span className="font-bold text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                  <AlertCircle className="w-3.5 h-3.5 text-neutral-400" /> Focus Areas
                                </span>
                                {item.evaluation.improvements.map((imp, i) => (
                                  <p key={i} className="text-neutral-400 pl-3 border-l-2 border-neutral-700 leading-relaxed">{imp}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.evaluation && (
                            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                              <span className="text-neutral-400 font-bold block uppercase tracking-wider text-[10px] mb-1">
                                Ideal Model Outline:
                              </span>
                              <p className="text-neutral-300 leading-relaxed font-sans">{item.evaluation.suggestedAnswer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
