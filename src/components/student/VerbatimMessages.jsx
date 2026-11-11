import React, { useState } from 'react';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import { Copy, Check, MessageSquareQuote, Calendar, Award, AlertTriangle } from 'lucide-react';

export default function VerbatimMessages() {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messages = [
    {
      id: 1,
      title: "Message 1: Slot Booking Confirmation",
      badge: "Pre-Interview State",
      badgeVariant: "blue",
      icon: Calendar,
      trigger: "Triggered immediately when student selects and confirms an available slot.",
      placement: "Prominent confirmation banner + calendar invite modal on Student Dashboard.",
      headline: "Slot Confirmed: Technical Evaluation Interview",
      body: "Your 45-minute technical interview is booked with Arjun Nair for Thursday, Nov 14 at 2:00 PM EST. We’ve sent a calendar invite and Google Meet link to your student email. Please review your system design prep notes and join the call 5 minutes early with your code editor ready.",
      actions: ["[ Join Video Meeting ]", "[ Add to Google Calendar ]", "[ Reschedule Slot ]"]
    },
    {
      id: 2,
      title: "Message 2: Result Available — Passed (Advancement)",
      badge: "After Result: Passed",
      badgeVariant: "green",
      icon: Award,
      trigger: "Triggered when the Interview Team records and publishes a 'Pass' evaluation outcome.",
      placement: "Hero celebration card with animated confetti & unlocked Milestone 3 badge on Student Home Screen.",
      headline: "Congratulations, Aarav! You Passed Your Technical Interview 🎉",
      body: "The interview panel has approved your evaluation with a score of 88/100 (Strong Pass). You have officially cleared Milestone 2 and unlocked Milestone 3: Capstone Apprenticeship. Your detailed rubric feedback and project briefing are now accessible below.",
      actions: ["[ Begin Capstone Project ➔ ]", "[ Download Evaluation Certificate (PDF) ]"]
    },
    {
      id: 3,
      title: "Message 3: Result Available — Retake Recommended",
      badge: "After Result: Retake",
      badgeVariant: "yellow",
      icon: AlertTriangle,
      trigger: "Triggered when the Interview Team records a 'Retake Later' evaluation outcome.",
      placement: "High-priority amber coaching card with 7-day countdown clock on Student Dashboard.",
      headline: "Interview Outcome: Retake Recommended in 7 Days ⚠",
      body: "Thank you for your effort in the technical evaluation. The panel noted strong architectural intuition but recommends further mastery of Graph Traversal and Time Complexity optimizations before advancing. Your retake booking window unlocks on Thursday, Nov 21 at 9:00 AM EST. Please review your evaluator’s detailed study plan below and attend open mentor office hours this Tuesday.",
      actions: ["[ Review Study Plan & Rubric ]", "[ Book Mentor Office Hours ]"]
    }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1E0404] text-[#FFFEF7] p-6 rounded-2xl grit-border grit-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#F4DF38] text-[#1E0404] grit-border flex items-center justify-center">
            <MessageSquareQuote className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-[#FFFEF7]">
              The 3 Most Important Student Messages
            </h2>
            <p className="text-stone-300 text-xs font-sans mt-0.5">
              Exact verbatim copy designed for high clarity, psychological encouragement, and definitive next steps.
            </p>
          </div>
        </div>
        <GritBadge variant="yellow" className="text-xs">
          Verbatim Copy Reference
        </GritBadge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((m, idx) => {
          const IconComp = m.icon;
          const fullMessageText = `${m.headline}\n\n${m.body}\n\nActions:\n${m.actions.join('  ')}`;

          return (
            <GritCard
              key={m.id}
              accent={m.id === 1 ? 'blue' : m.id === 2 ? 'yellow' : 'red'}
              className="relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#1E0404] text-[#FFFEF7] font-heading font-bold text-xs flex items-center justify-center">
                    0{m.id}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#1E0404]">
                    {m.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <GritBadge variant={m.badgeVariant}>
                    {m.badge}
                  </GritBadge>
                  <button
                    onClick={() => handleCopy(fullMessageText, idx)}
                    className="p-1.5 rounded-lg border border-[#1E0404] bg-[#FFFEF7] hover:bg-[#F4DF38] transition-colors text-xs flex items-center gap-1 font-heading font-bold"
                    title="Copy verbatim message"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-700 stroke-[3]" />
                        <span className="text-green-800 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Message Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                <div>
                  <span className="font-bold text-[#1E0404]">Trigger:</span>{' '}
                  <span className="text-stone-600">{m.trigger}</span>
                </div>
                <div>
                  <span className="font-bold text-[#1E0404]">Placement:</span>{' '}
                  <span className="text-stone-600">{m.placement}</span>
                </div>
              </div>

              {/* Actual Message Mock Card (As it appears in UI) */}
              <div className="mt-4 p-5 rounded-xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 border-[#1E0404] shrink-0 ${
                    m.id === 1 ? 'bg-[#4277FB] text-white' : m.id === 2 ? 'bg-[#F4DF38] text-[#1E0404]' : 'bg-[#D74247] text-white'
                  }`}>
                    <IconComp className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-heading font-black text-base text-[#1E0404] tracking-tight">
                      {m.headline}
                    </h4>
                    <p className="text-sm font-sans text-stone-700 leading-relaxed">
                      {m.body}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {m.actions.map((act, aIdx) => (
                        <span
                          key={aIdx}
                          className="font-heading font-bold text-xs px-3 py-1 rounded-md bg-[#1E0404] text-[#FFFEF7] grit-shadow-sm"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GritCard>
          );
        })}
      </div>
    </div>
  );
}

