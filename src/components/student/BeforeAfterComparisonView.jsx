import React, { useState } from 'react';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Calendar,
  Award,
  Video,
  Play,
  Clock,
  Columns
} from 'lucide-react';

export default function BeforeAfterComparisonView() {
  const [outcomeVariant, setOutcomeVariant] = useState('pass'); // 'pass' | 'retake'

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <div className="bg-[#1E0404] text-[#FFFEF7] p-6 rounded-2xl grit-border grit-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Columns className="w-5 h-5 text-[#F4DF38]" />
            <h2 className="font-heading font-black text-xl text-[#FFFEF7]">
              Before & After Result Screen Comparison
            </h2>
          </div>
          <p className="text-xs text-stone-300 font-sans max-w-2xl">
            Side-by-side design audit showing how the student home screen and downstream milestone access dynamically adapt before and after the interview result is published.
          </p>
        </div>

        {/* Toggle Outcome Variant */}
        <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded-xl border border-stone-700 text-xs">
          <span className="text-stone-400 font-bold px-2">Compare Outcome:</span>
          <button
            onClick={() => setOutcomeVariant('pass')}
            className={`px-3 py-1 rounded-lg font-heading font-bold text-xs transition-all ${
              outcomeVariant === 'pass'
                ? 'bg-[#10B981] text-white grit-shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Passed (88/100)
          </button>
          <button
            onClick={() => setOutcomeVariant('retake')}
            className={`px-3 py-1 rounded-lg font-heading font-bold text-xs transition-all ${
              outcomeVariant === 'retake'
                ? 'bg-[#F4DF38] text-[#1E0404] grit-shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Retake Recommended
          </button>
        </div>
      </div>

      {/* Screen 1 Comparison: Student Home Screen */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-lg text-[#1E0404] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1E0404] text-[#FFFEF7] text-xs flex items-center justify-center font-bold">
              1
            </span>
            <span>Screen 1: Student Home Screen (Dashboard Hero & Primary CTA)</span>
          </h3>
          <GritBadge variant="yellow">Visual State Comparison</GritBadge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BEFORE RESULT */}
          <div className="p-6 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm space-y-4 border-t-[8px] border-t-[#D74247]">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D74247]"></span>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#D74247]">
                  BEFORE RESULT (Unbooked / Booked State)
                </span>
              </div>
              <GritBadge variant="red">Action Required</GritBadge>
            </div>

            <div className="p-4 rounded-xl border border-stone-300 bg-white space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-bold uppercase">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D74247]" />
                <span>5 Days Remaining to Schedule</span>
              </div>
              <h4 className="font-heading font-black text-base text-[#1E0404]">
                Action Required: Book Milestone 2 Technical Interview
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                You have passed the Core Systems Curriculum and unlocked the 45-minute live technical evaluation. Schedule your session to avoid progression delay.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button className="grit-btn bg-[#F4DF38] text-[#1E0404] px-4 py-2 rounded-lg text-xs font-bold">
                  Select Interview Slot ➔
                </button>
              </div>
            </div>

            {/* Sub-card: Checklist */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2 text-xs">
              <span className="font-heading font-bold text-stone-700 uppercase tracking-wider block text-[11px]">
                Pre-Interview Checklist:
              </span>
              <div className="space-y-1.5 text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Review Systems Architecture notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Test code sandbox environment</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <span className="w-3.5 h-3.5 rounded border border-stone-400 inline-block"></span>
                  <span>Audio & video connection test</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 italic bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              💡 <strong>UX Rationale:</strong> Urgency-driven UI emphasizing the 5-day deadline and low friction to open the slot picker modal.
            </div>
          </div>

          {/* AFTER RESULT */}
          <div className={`p-6 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm space-y-4 border-t-[8px] ${
            outcomeVariant === 'pass' ? 'border-t-[#10B981]' : 'border-t-[#F4DF38]'
          }`}>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${outcomeVariant === 'pass' ? 'bg-[#10B981]' : 'bg-[#F4DF38]'}`}></span>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#1E0404]">
                  AFTER RESULT ({outcomeVariant === 'pass' ? 'Passed Verdict' : 'Retake Verdict'})
                </span>
              </div>
              <GritBadge variant={outcomeVariant === 'pass' ? 'green' : 'yellow'}>
                {outcomeVariant === 'pass' ? 'Outcome: Pass (88/100)' : 'Outcome: Retake in 7d'}
              </GritBadge>
            </div>

            {outcomeVariant === 'pass' ? (
              <div className="p-4 rounded-xl border border-stone-300 bg-[#F4DF38]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-700 font-bold uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#1E0404]" /> Evaluation Cleared
                  </span>
                  <span className="font-heading font-black text-lg text-[#1E0404]">88/100</span>
                </div>
                <h4 className="font-heading font-black text-base text-[#1E0404]">
                  Congratulations, Maya! You Passed Your Technical Interview 🎉
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  The evaluation panel approved your performance. You have unlocked Milestone 3: Capstone Apprenticeship.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button className="grit-btn bg-[#70449C] text-white px-4 py-2 rounded-lg text-xs font-bold">
                    Enter Capstone Project ➔
                  </button>
                  <button className="grit-btn bg-white text-[#1E0404] px-3 py-2 rounded-lg text-xs font-bold">
                    Download PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-800 font-bold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" /> Retake Recommended
                  </span>
                  <span className="font-heading font-black text-lg text-amber-900">66/100</span>
                </div>
                <h4 className="font-heading font-black text-base text-[#1E0404]">
                  Interview Outcome: Retake Recommended in 7 Days ⚠
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed font-sans">
                  Booking window unlocks Nov 21. Review your mentor feedback and targeted study modules below.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button className="grit-btn bg-[#F4DF38] text-[#1E0404] px-4 py-2 rounded-lg text-xs font-bold">
                    View Targeted Study Plan
                  </button>
                </div>
              </div>
            )}

            {/* Rubric Breakdown Grid */}
            <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
              <span className="font-heading font-bold text-stone-700 uppercase tracking-wider block text-[11px]">
                Scorecard Breakdown:
              </span>
              <div className="grid grid-cols-2 gap-2 text-stone-700">
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="block text-[10px] text-stone-500">Problem Solving</span>
                  <span className="font-bold">{outcomeVariant === 'pass' ? '4.5 / 5' : '3.0 / 5'}</span>
                </div>
                <div className="p-2 bg-stone-50 rounded border border-stone-200">
                  <span className="block text-[10px] text-stone-500">System Architecture</span>
                  <span className="font-bold">{outcomeVariant === 'pass' ? '4.5 / 5' : '3.5 / 5'}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 italic bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              💡 <strong>UX Rationale:</strong> Shifts from action anxiety to celebration or clear restorative guidance with exact rubric scores and next steps.
            </div>
          </div>
        </div>
      </div>

      {/* Screen 2 Comparison: Curriculum Progression & Milestone Unlock */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-lg text-[#1E0404] flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1E0404] text-[#FFFEF7] text-xs flex items-center justify-center font-bold">
              2
            </span>
            <span>Screen 2: Curriculum Progression & Milestone Unlock Roadmap</span>
          </h3>
          <GritBadge variant="purple">Prerequisite Gate Impact</GritBadge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestone State: BEFORE RESULT */}
          <div className="p-6 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-stone-600">
                Milestone 3 State: BEFORE RESULT
              </span>
              <GritBadge variant="neutral">Padlock Locked</GritBadge>
            </div>

            <div className="p-4 rounded-xl border-2 border-stone-300 bg-stone-100 opacity-75 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-stone-600 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-stone-500" /> Milestone 3: Capstone Apprenticeship
                </span>
                <span className="text-[11px] font-mono text-stone-500">LOCKED</span>
              </div>
              <p className="text-xs text-stone-500">
                Requires passing the Milestone 2 Technical Evaluation to unlock repository access and client brief.
              </p>
              <div className="pt-2">
                <button disabled className="px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-200 text-stone-400 text-xs font-bold cursor-not-allowed">
                  🔒 Locked until interview passed
                </button>
              </div>
            </div>
          </div>

          {/* Milestone State: AFTER RESULT (PASS) */}
          <div className="p-6 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#70449C]">
                Milestone 3 State: AFTER RESULT (PASS)
              </span>
              <GritBadge variant="purple">Unlocked & Active</GritBadge>
            </div>

            <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-white grit-shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-black text-sm text-[#1E0404] flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-[#70449C] stroke-[2.5]" /> Milestone 3: Capstone Apprenticeship
                </span>
                <span className="text-[10px] font-bold bg-[#70449C] text-white px-2 py-0.5 rounded-full uppercase">
                  Newly Unlocked
                </span>
              </div>
              <p className="text-xs text-stone-700">
                Build and deploy an enterprise-grade distributed microservices architecture alongside industry mentors.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button className="grit-btn bg-[#70449C] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Begin Capstone Project ➔</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

