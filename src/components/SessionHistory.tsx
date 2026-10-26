'use client';

import React, { useState } from 'react';
import { InterviewSession } from '@/types/interview';
import { Calendar, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';

interface SessionHistoryProps {
  sessions: InterviewSession[];
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full clay-panel border border-[#E8E2D9] text-[#2D5A4A] text-xs font-mono font-bold mb-3 shadow-sm">
          <Terminal className="w-3.5 h-3.5 text-[#2D5A4A]" />
          <span className="tracking-wide uppercase">Audit &amp; Transcripts Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-3">
          Interview Session Archives
        </h1>
        <p className="text-sm text-[#6B7280] font-mono mt-1">
          Review your previous mock interview attempts, rubric breakdowns, and AI feedback.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="clay-panel-glow p-14 text-center">
          <p className="text-[#6B7280] text-sm font-mono">No completed interview sessions yet. Initialize your first round to generate archive records.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;
            return (
              <div 
                key={session.id} 
                className="clay-card overflow-hidden transition-all duration-300"
              >
                <div 
                  onClick={() => toggleExpand(session.id)}
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F5] transition-colors select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-2xl btn-clay-primary flex items-center justify-center text-white font-bold text-sm uppercase font-mono shadow-sm">
                      {session.role.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#1A1A1A] capitalize flex items-center gap-2.5 tracking-tight">
                        {session.role.replace('-', ' ')} Session
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full clay-badge-cyan font-mono font-bold">
                          {session.mode.toUpperCase()}
                        </span>
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-1 font-mono">
                        <span className="flex items-center gap-1.5 text-[#2D5A4A] font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(session.completedAt || session.startedAt).toLocaleDateString()}
                        </span>
                        <span>Level: {session.level}</span>
                        <span>{session.items.length} Questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#2D5A4A]">
                        {session.overallScore || 0}%
                      </span>
                      <span className="block text-[10px] text-[#6B7280] font-mono font-bold uppercase tracking-wider">Overall Score</span>
                    </div>

                    <div className="w-9 h-9 rounded-xl clay-panel border border-[#E8E2D9] flex items-center justify-center text-[#2D5A4A] transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E2D9] space-y-6">
                    {/* Performance Summary Metrics */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl clay-panel border border-[#E8E2D9] text-center font-mono">
                      <div>
                        <span className="text-xs text-[#2D5A4A] block font-semibold">Technical Accuracy</span>
                        <span className="text-xl font-black text-[#1A1A1A]">{session.technicalAccuracyAverage || 0}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#1A1A1A] block font-semibold">Communication</span>
                        <span className="text-xl font-black text-[#1A1A1A]">{session.communicationAverage || 0}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-[#2D5A4A] block font-semibold">STAR Structure</span>
                        <span className="text-xl font-black text-[#1A1A1A]">{session.structureAverage || 0}%</span>
                      </div>
                    </div>

                    {/* Question Items Breakdown */}
                    <div className="space-y-4">
                      {session.items.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl clay-card space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs font-mono font-bold text-[#1A1A1A]">
                              Q#{idx + 1}: {item.questionText}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#2D5A4A] clay-panel px-2.5 py-0.5 rounded-full border border-[#E8E2D9] shrink-0">
                              {item.evaluation?.score ?? 0}% SCORE
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] text-xs text-[#1A1A1A] font-sans">
                            <strong className="text-[#2D5A4A] block font-mono text-[11px] mb-1">Your Stated Answer:</strong>
                            <p className="italic font-normal">{item.userAnswer}</p>
                          </div>

                          {item.evaluation && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="p-3 rounded-xl clay-panel border border-[#E8E2D9] space-y-1">
                                <span className="text-[#2D5A4A] font-mono font-bold flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A4A]" /> Key Strengths
                                </span>
                                {item.evaluation.strengths.slice(0, 2).map((s, i) => (
                                  <p key={i} className="text-[#1A1A1A] font-normal pl-2 border-l-2 border-[#2D5A4A]">{s}</p>
                                ))}
                              </div>

                              <div className="p-3 rounded-xl clay-panel border border-[#E8E2D9] space-y-1">
                                <span className="text-[#1A1A1A] font-mono font-bold flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-[#b89f78]" /> High-Impact Improvements
                                </span>
                                {item.evaluation.improvements.slice(0, 2).map((imp, i) => (
                                  <p key={i} className="text-[#6B7280] font-normal pl-2 border-l-2 border-[#D6C4A8]">{imp}</p>
                                ))}
                              </div>
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
