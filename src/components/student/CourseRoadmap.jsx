import React from 'react';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import {
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  Calendar,
  ArrowRight,
  Play,
  AlertTriangle,
  UserX,
  ShieldAlert,
  Medal,
  Award
} from 'lucide-react';

export default function CourseRoadmap({ student, onBookSlotClick }) {
  const isMalpractice = student.trackBadgeStatus === 'nullified' || student.evaluation?.outcome === 'malpractice';
  const isIneligible = !isMalpractice && (student.allSkillsCleared === false || student.eligibilityStatus === 'Ineligible' || student.bookingStatus === 'ineligible');
  const isPassed = !isIneligible && !isMalpractice && student.evaluation?.outcome === 'pass';
  const isRetake = !isIneligible && !isMalpractice && student.evaluation?.outcome === 'retake';
  const isFailed = !isIneligible && !isMalpractice && student.evaluation?.outcome === 'fail';
  const isNoShow = !isIneligible && !isMalpractice && student.evaluation?.outcome === 'no_show';
  const isBooked = !isIneligible && !isMalpractice && student.bookingStatus === 'booked';
  const isUnbooked = !isIneligible && !isMalpractice && student.bookingStatus === 'unbooked';

  const clearedCount = student.clearedSkillsCount ?? (student.skills ? student.skills.filter(s => s.status === 'cleared').length : 5);
  const totalCount = student.totalSkillsRequired || 5;

  return (
    <GritCard header="GRIT Skilling Competition: Track Badge Progression Flow" accent="purple">
      <div className="space-y-6">
        <p className="text-xs text-stone-600 font-sans">
          NIAT Track Badge lifecycle: Students clear offline skill contests under invigilation. Once every required skill is cleared, a 1-on-1 live online interview is taken to earn the Track Badge. If caught doing malpractice and flagged later, the badge is nullified.
        </p>

        {/* Milestone Steps Timeline */}
        <div className="relative border-l-[3px] border-[#1E0404] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {/* Step 1: Skill Contests (Invigilated on Campus) */}
          <div className="relative">
            <div className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full border-2 border-[#1E0404] flex items-center justify-center grit-shadow-sm ${
              isMalpractice
                ? 'bg-stone-300 text-stone-600'
                : isIneligible
                ? 'bg-[#F4DF38] text-[#1E0404]'
                : 'bg-[#10B981] text-white'
            }`}>
              {isIneligible ? (
                <Clock className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>
            <div className={`p-4 rounded-xl border-2 border-[#1E0404] ${
              isIneligible
                ? 'bg-amber-50/80 border-l-[8px] border-l-[#F4DF38]'
                : 'bg-stone-50'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading font-black text-sm text-[#1E0404]">
                  Step 1: Skill Contests (Invigilated Campus Labs)
                </span>
                {isIneligible ? (
                  <GritBadge variant="yellow">In Progress ({clearedCount}/{totalCount} Skills Cleared)</GritBadge>
                ) : (
                  <GritBadge variant="green">All {totalCount} Skills Cleared (100%)</GritBadge>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                {isIneligible
                  ? `Cleared ${clearedCount} of ${totalCount} skill contests (DSA, React). Must clear remaining 3 contests (Concurrency, Microservices, System Design) before live interview unlocks.`
                  : `Successfully cleared all ${totalCount} required skill contests under campus invigilation with Gold/Silver honors.`}
              </p>
            </div>
          </div>

          {/* Step 2: Live Online Interview (THE GATE TO EARN BADGE) */}
          <div className="relative">
            <div className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full border-2 border-[#1E0404] flex items-center justify-center grit-shadow-sm ${
              isIneligible
                ? 'bg-stone-300 text-stone-600 border-stone-400'
                : isPassed
                ? 'bg-[#10B981] text-white'
                : isRetake
                ? 'bg-[#F4DF38] text-[#1E0404]'
                : isNoShow
                ? 'bg-[#F4DF38] text-[#1E0404]'
                : isMalpractice
                ? 'bg-[#D74247] text-white'
                : isFailed
                ? 'bg-[#D74247] text-white'
                : isBooked
                ? 'bg-[#4277FB] text-white'
                : 'bg-[#D74247] text-white'
            }`}>
              {isIneligible ? (
                <Lock className="w-4 h-4 stroke-[2.5]" />
              ) : isPassed ? (
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              ) : isRetake ? (
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              ) : isNoShow ? (
                <UserX className="w-4 h-4 stroke-[2.5]" />
              ) : isMalpractice ? (
                <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              ) : isBooked ? (
                <Calendar className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Clock className="w-4 h-4 stroke-[2.5]" />
              )}
            </div>

            <div className={`p-4 rounded-xl border-2 transition-all ${
              isIneligible
                ? 'bg-stone-100 border-stone-300 opacity-90'
                : isPassed
                ? 'bg-emerald-50/70 border-[#1E0404]'
                : isRetake
                ? 'bg-[#F4DF38]/20 border-[#1E0404]'
                : isNoShow
                ? 'bg-[#F4DF38]/20 border-l-[8px] border-l-[#F4DF38] border-[#1E0404]'
                : isMalpractice
                ? 'bg-rose-50/70 border-l-[8px] border-l-[#D74247] border-[#1E0404]'
                : isBooked
                ? 'bg-blue-50/70 border-[#1E0404]'
                : 'bg-rose-50/70 border-[#1E0404]'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading font-black text-sm text-[#1E0404]">
                  Step 2: Live Online Interview
                </span>

                {isIneligible && <GritBadge variant="yellow">Locked (Skills Pending: {clearedCount}/5)</GritBadge>}
                {isPassed && <GritBadge variant="green">Passed (Score: {student.evaluation.score}/100)</GritBadge>}
                {isRetake && <GritBadge variant="yellow">Retake Required (7 Days)</GritBadge>}
                {isNoShow && <GritBadge variant="yellow">Absence Recorded (48h Window)</GritBadge>}
                {isMalpractice && <GritBadge variant="red">Track Badge Nullified 🚫</GritBadge>}
                {isFailed && <GritBadge variant="red">Review Needed</GritBadge>}
                {isBooked && <GritBadge variant="blue">Slot Scheduled</GritBadge>}
                {isUnbooked && <GritBadge variant="red">Action Required: Book Slot</GritBadge>}
              </div>

              <p className="text-xs text-stone-700 mt-1">
                {isIneligible && "Requires clearing every skill contest (5/5) under campus invigilation before interview slots unlock."}
                {isPassed && "Verified competency across algorithms, concurrency, and distributed scalability. Full Stack Engineering Track Badge earned!"}
                {isRetake && "Completed evaluation. Additional practice recommended in graph traversals and React state before retake."}
                {isNoShow && "Candidate missed scheduled evaluation session. Reschedule within the 48-hour courtesy window."}
                {isMalpractice && "Flagged for malpractice post-evaluation audit. Track Badge has been nullified and all Miles forfeited per Clause 5.3.2."}
                {isFailed && "Fundamental review required in asynchronous patterns and database locks."}
                {isBooked && "Interview is confirmed. Please prepare your system design sandbox and join 5 minutes early."}
                {isUnbooked && "All skills cleared! Schedule your 45-minute live online interview with our team of interviewers to earn your badge."}
              </p>

              {isIneligible && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-200 text-stone-500 font-heading font-bold text-xs cursor-not-allowed">
                    <Lock className="w-3.5 h-3.5" />
                    Interview Booking Locked (Clear 5/5 Skills First)
                  </span>
                </div>
              )}

              {(isUnbooked || isNoShow) && (
                <div className="mt-3">
                  <GritButton
                    size="sm"
                    variant="primary"
                    onClick={onBookSlotClick}
                  >
                    {isNoShow ? "Reschedule Make-Up Slot ➔" : "Select Interview Slot to Earn Badge ➔"}
                  </GritButton>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Track Badge Earned & Capstone Apprenticeship */}
          <div className="relative">
            <div className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full border-2 border-[#1E0404] flex items-center justify-center grit-shadow-sm ${
              isPassed ? 'bg-[#F4DF38] text-[#1E0404] animate-bounce' : 'bg-stone-300 text-stone-600'
            }`}>
              {isPassed ? <Medal className="w-4 h-4 stroke-[2.5]" /> : <Lock className="w-4 h-4" />}
            </div>

            <div className={`p-4 rounded-xl border-2 transition-all ${
              isPassed
                ? 'border-[#1E0404] bg-[#FFFEF7] grit-shadow'
                : 'border-stone-300 bg-stone-100 opacity-70'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`font-heading font-black text-sm ${isPassed ? 'text-[#1E0404]' : 'text-stone-500'}`}>
                    Step 3: Track Badge Earned & Capstone Unlocked 🏅
                  </span>
                  {isPassed && (
                    <span className="text-[10px] font-bold bg-[#10B981] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Badge Earned!
                    </span>
                  )}
                </div>

                {isPassed ? (
                  <GritBadge variant="green">Badge Verified: {student.evaluation?.badgeCertificateId || 'NIAT-FSE-2026-0891'}</GritBadge>
                ) : (
                  <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <p className={`text-xs mt-1 ${isPassed ? 'text-stone-700' : 'text-stone-500'}`}>
                {isPassed
                  ? "Track Badge officially awarded. Eligible for Bonus Miles (Clause 5.3.4), Immersion Trip selection, and client Capstone projects."
                  : "Requires passing the live online interview after clearing all required skills."}
              </p>

              {isPassed && (
                <div className="mt-3 flex items-center gap-2">
                  <GritButton size="sm" variant="purple" icon={Play}>
                    Begin Capstone Project ➔
                  </GritButton>
                  <GritButton size="sm" variant="secondary">
                    View Verified Badge Credential
                  </GritButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GritCard>
  );
}
