import React, { useState } from 'react';
import { useGrit } from '../../context/GritContext';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import SlotBookingModal from './SlotBookingModal';
import StudentResultView from './StudentResultView';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  User,
  ShieldCheck,
  Award,
  Sparkles,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Trophy,
  ShieldAlert,
  Flame,
  Check,
  Lock,
  Layers,
  Medal,
  ChevronRight,
  Target
} from 'lucide-react';

export default function StudentDashboard() {
  const {
    currentStudent,
    slots,
    cancelSlotBooking,
    setCurrentRole
  } = useGrit();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Look up booked slot details if student has one
  const bookedSlot = slots.find(s => s.id === currentStudent.bookedSlotId) || {
    id: 'slot-102',
    interviewerName: 'Arjun Nair',
    date: '2026-11-14',
    startTime: '14:00',
    endTime: '14:45',
    meetingLink: 'https://meet.grit.edu/eval-arjun-102'
  };

  const isNullified = currentStudent.trackBadgeStatus === 'nullified' || currentStudent.evaluation?.outcome === 'malpractice';
  const isIneligible = !isNullified && (currentStudent.allSkillsCleared === false || currentStudent.eligibilityStatus === 'Ineligible' || currentStudent.bookingStatus === 'ineligible');
  const isEvaluated = !isIneligible && currentStudent.bookingStatus === 'evaluated' && currentStudent.evaluation;
  const isCompleted = !isIneligible && !isEvaluated && currentStudent.bookingStatus === 'completed';
  const isBooked = !isIneligible && !isEvaluated && currentStudent.bookingStatus === 'booked';
  const isUnbooked = !isIneligible && !isEvaluated && !isCompleted && !isBooked;

  const clearedSkillsCount = currentStudent.clearedSkillsCount ?? (currentStudent.skills ? currentStudent.skills.filter(s => s.status === 'cleared').length : 5);
  const totalSkillsRequired = currentStudent.totalSkillsRequired || 5;
  const skillsProgressPct = Math.round((clearedSkillsCount / totalSkillsRequired) * 100);

  // Simple information status descriptor
  const getSimpleStatusInfo = () => {
    if (isNullified) {
      return {
        badgeText: 'Track Badge Nullified & Revoked 🚫',
        badgeVariant: 'red',
        headline: 'Track Badge Nullified for Malpractice',
        meaning: 'A post-evaluation audit flagged unauthorized assistance. Your Track Badge has been nullified and contest Miles have been forfeited per Clause 5.3.2.',
        nextStep: 'You may submit a formal appeal to the Academic Integrity Committee within 48 hours.',
        ctaText: null,
        ctaAction: null,
        accentColor: 'border-l-[#D74247] bg-rose-50/40'
      };
    }
    if (isIneligible) {
      return {
        badgeText: `Skills In Progress (${clearedSkillsCount}/${totalSkillsRequired} Cleared)`,
        badgeVariant: 'yellow',
        headline: `Clear ${totalSkillsRequired - clearedSkillsCount} More Skill Contests to Unlock Interview`,
        meaning: `You have cleared ${clearedSkillsCount} of ${totalSkillsRequired} skills. In GRIT, you must clear all 5 skill contests on campus before taking your live online interview to earn the Track Badge.`,
        nextStep: 'Register and attempt the remaining contests (Database Concurrency, Microservices, System Design) at the NIAT campus lab.',
        ctaText: 'Register for Next Campus Contest ➔',
        ctaAction: () => alert('Registering for upcoming DBS-401 Database Concurrency Contest at NIAT Campus Lab 4!'),
        accentColor: 'border-l-[#F4DF38] bg-amber-50/40'
      };
    }
    if (isEvaluated) {
      const outcome = currentStudent.evaluation.outcome;
      if (outcome === 'pass') {
        return {
          badgeText: 'Track Badge Earned 🏅',
          badgeVariant: 'green',
          headline: 'Congratulations! You Earned Your Track Badge 🏅',
          meaning: `You passed your live online interview with distinction (Score: ${currentStudent.evaluation.score}/100). Your Full Stack Engineering Track Badge has been officially issued.`,
          nextStep: 'Your verified credentials are active, your Capstone Apprenticeship is unlocked, and your Immersion Trip contender standing is verified.',
          ctaText: 'View Badge Certificate',
          ctaAction: () => alert(`Verified Certificate ID: ${currentStudent.evaluation.badgeCertificateId || 'NIAT-FSE-2026-0891'}\nIssued by: NIAT GRIT Assessment Board`),
          accentColor: 'border-l-[#10B981] bg-emerald-50/40'
        };
      }
      if (outcome === 'retake') {
        return {
          badgeText: 'Interview Verdict: Retake Required',
          badgeVariant: 'yellow',
          headline: 'Interview Completed: Retake in 7 Days to Earn Badge',
          meaning: `Your interview was completed (Score: ${currentStudent.evaluation.score}/100). The evaluator recommends brushing up on graph traversals and React state before badge award.`,
          nextStep: 'Your 7-day retake window opens on Nov 21. Review the study plan and reschedule.',
          ctaText: 'Reschedule Retake Slot ➔',
          ctaAction: () => setIsBookingModalOpen(true),
          accentColor: 'border-l-[#F4DF38] bg-amber-50/40'
        };
      }
      if (outcome === 'no_show') {
        return {
          badgeText: 'Interview Absence: No Show Logged',
          badgeVariant: 'yellow',
          headline: 'Interview Missed: 48-Hour Reschedule Window Active',
          meaning: 'You did not connect to your scheduled interview session. You have a courtesy 48-hour window to reschedule without losing eligibility.',
          nextStep: 'Select a replacement slot before your 48-hour window expires.',
          ctaText: 'Reschedule Make-Up Slot ➔',
          ctaAction: () => setIsBookingModalOpen(true),
          accentColor: 'border-l-[#F4DF38] bg-amber-50/40'
        };
      }
    }
    if (isCompleted) {
      return {
        badgeText: 'Interview Conducted • Review Ready',
        badgeVariant: 'blue',
        headline: 'Interview Done: Awaiting Official Track Badge Award',
        meaning: `Your 45-minute live interview with ${currentStudent.interviewerReview?.interviewerName || 'Arjun Nair'} was completed. The evaluator recommended PASS (${currentStudent.interviewerReview?.recommendedScore || 90}/100).`,
        nextStep: 'The Interview Team is reviewing the evaluator rubric to issue your official Track Badge and certificate.',
        ctaText: null,
        ctaAction: null,
        accentColor: 'border-l-[#4277FB] bg-blue-50/40'
      };
    }
    if (isBooked) {
      return {
        badgeText: 'Live Interview Scheduled',
        badgeVariant: 'blue',
        headline: 'Live Online Interview Confirmed to Earn Track Badge',
        meaning: `Your interview is scheduled with ${bookedSlot.interviewerName} for ${new Date(bookedSlot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at ${bookedSlot.startTime} EST.`,
        nextStep: 'Test your webcam and code editor, and join the video meeting link 5 minutes before start time.',
        ctaText: 'Join Video Meeting ➔',
        ctaAction: () => window.open(bookedSlot.meetingLink, '_blank'),
        accentColor: 'border-l-[#4277FB] bg-blue-50/40'
      };
    }
    // Default: Eligible & Unbooked
    return {
      badgeText: 'All Skills Cleared • Action Required',
      badgeVariant: 'green',
      headline: 'All 5 Skills Cleared! Schedule Your Live Interview to Earn Badge 🚀',
      meaning: `You have cleared every skill contest required for the ${currentStudent.trackBadgeName || 'Full Stack Engineering Track Badge'}!`,
      nextStep: 'Schedule your 45-minute live online interview with an evaluator to officially earn and verify your Track Badge.',
      ctaText: 'Schedule Interview ➔',
      ctaAction: () => setIsBookingModalOpen(true),
      accentColor: 'border-l-[#10B981] bg-emerald-50/40'
    };
  };

  const statusInfo = getSimpleStatusInfo();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Clean Top Header Banner with Schedule Interview CTA */}
      <div className="bg-[#1E0404] text-[#FFFEF7] p-6 sm:p-8 rounded-2xl grit-border grit-shadow-lg relative overflow-hidden">
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#F4DF38]/10 pointer-events-none"></div>
        <div className="absolute right-24 bottom-[-60px] w-36 h-36 rounded-full bg-[#D74247]/10 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#F4DF38]">
                GRIT @ NIAT • Student Portal
              </span>
              <span className="text-stone-400">|</span>
              <GritBadge variant={statusInfo.badgeVariant}>
                {statusInfo.badgeText}
              </GritBadge>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#FFFEF7] tracking-tight">
              Welcome back, {currentStudent.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-sans">
              {currentStudent.cohort} • Track: <strong className="text-[#F4DF38]">{currentStudent.trackBadgeName || 'Full Stack Engineering Track Badge'}</strong>
            </p>
          </div>

          {/* Right Box: Track Badge Status + Schedule Interview CTA (Requirement 2) */}
          <div className="flex flex-col items-start sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block font-mono">
              Track Badge Status
            </span>
            <span className="font-heading font-black text-lg text-[#F4DF38]">
              {isNullified
                ? 'Badge Nullified 🚫'
                : isIneligible
                ? `Skills Incomplete (${clearedSkillsCount}/${totalSkillsRequired})`
                : isEvaluated && currentStudent.evaluation.outcome === 'pass'
                ? 'Track Badge Earned 🏅'
                : isEvaluated && currentStudent.evaluation.outcome === 'retake'
                ? 'Retake Required'
                : isEvaluated && currentStudent.evaluation.outcome === 'no_show'
                ? 'On Hold (No Show)'
                : isCompleted
                ? 'Awaiting Badge Decision'
                : isBooked
                ? 'Interview Scheduled'
                : 'Eligible to Earn Badge 🚀'}
            </span>

            {/* REQUIREMENT 2: If eligible, add Schedule Interview CTA below Track Badge Status */}
            {isUnbooked && (
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F4DF38] text-[#1E0404] font-heading font-black text-xs grit-shadow-sm hover:scale-[1.03] transition-all cursor-pointer border-2 border-[#1E0404]"
                title="You have cleared all skills. Schedule your live interview to earn your Track Badge"
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>Schedule Interview ➔</span>
              </button>
            )}

            {isBooked && (
              <a
                href={bookedSlot.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#4277FB] text-white font-heading font-bold text-xs hover:scale-[1.03] transition-all cursor-pointer border border-[#1E0404]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Meeting Link</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. SIMPLE, INFORMATION-ORIENTED "YOUR CURRENT STATUS" HERO CARD (Requirement 4) */}
      <div className={`p-6 rounded-2xl border-2 border-[#1E0404] bg-white grit-shadow-md border-l-[12px] space-y-4 ${statusInfo.accentColor}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-xs uppercase tracking-widest text-stone-700 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#1E0404]" />
              Current Status Overview
            </span>
          </div>
          <GritBadge variant={statusInfo.badgeVariant}>
            {statusInfo.badgeText}
          </GritBadge>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1E0404] tracking-tight">
            {statusInfo.headline}
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed max-w-3xl">
            {statusInfo.meaning}
          </p>
        </div>

        {/* Clear What To Do Next Box */}
        <div className="p-3.5 rounded-xl border border-stone-300 bg-white/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-stone-500 block">
              What you need to do next:
            </span>
            <span className="text-xs sm:text-sm font-sans font-medium text-[#1E0404]">
              {statusInfo.nextStep}
            </span>
          </div>

          {statusInfo.ctaText && (
            <div className="shrink-0">
              <GritButton
                size="md"
                variant={isUnbooked ? 'primary' : 'purple'}
                onClick={statusInfo.ctaAction}
                icon={Calendar}
                className="text-xs px-4 py-2"
              >
                {statusInfo.ctaText}
              </GritButton>
            </div>
          )}
        </div>
      </div>

      {/* 3. Qualiflyer Standing & Miles Card */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-[10px] border-l-[#F4DF38]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F4DF38] border-2 border-[#1E0404] flex items-center justify-center font-bold text-[#1E0404] grit-shadow-sm shrink-0">
            <Trophy className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E0404]">
                Qualiflyer Standing & Miles
              </span>
              <GritBadge variant={currentStudent.qualiflyer?.isDisqualified ? 'red' : 'yellow'}>
                {currentStudent.qualiflyer?.isDisqualified ? 'Disqualified (Badge Nullified)' : `Rank #${currentStudent.qualiflyer?.rank || '—'}`}
              </GritBadge>
            </div>
            <p className="text-xs text-stone-600 font-sans mt-0.5">
              {currentStudent.qualiflyer?.isDisqualified
                ? 'All contest Miles permanently forfeited due to detected malpractice (Clause 5.3.2).'
                : `Total: ${currentStudent.qualiflyer?.totalMiles?.toLocaleString() || 0} Miles (${currentStudent.qualiflyer?.contestMiles || 0} Contest + ${currentStudent.qualiflyer?.bonusMiles || 0} Bonus) • ${currentStudent.qualiflyer?.immersionTripEligibility || 'Contender'}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentRole('leaderboard')}
          className="grit-btn bg-[#F4DF38] text-[#1E0404] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0"
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>View Qualiflyer Leaderboard ➔</span>
        </button>
      </div>

      {/* 4. TRACK BADGE SKILLS PROGRESS (5 REQUIRED SKILLS) */}
      <div className="p-6 sm:p-8 rounded-2xl grit-border grit-shadow-lg bg-[#FFFEF7] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-[#F4DF38] stroke-[2.5]" />
              <span className="font-heading font-black text-xs uppercase tracking-widest text-stone-600">
                Required Skills Checklist
              </span>
            </div>
            <h2 className="font-heading font-black text-2xl text-[#1E0404] tracking-tight mt-0.5">
              {currentStudent.trackBadgeName || 'Full Stack Engineering Track Badge'}
            </h2>
            <p className="text-xs text-stone-600 font-sans mt-1 max-w-2xl">
              Rule: Clear all 5 skill contests on campus ➔ Schedule live online interview ➔ Earn Track Badge.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-stone-500">
              Skills Completed:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl text-[#1E0404]">
                {clearedSkillsCount} / {totalSkillsRequired}
              </span>
              <GritBadge variant={clearedSkillsCount === totalSkillsRequired ? 'green' : 'yellow'}>
                {clearedSkillsCount === totalSkillsRequired ? '100% Cleared • Eligible' : `${skillsProgressPct}% Cleared`}
              </GritBadge>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5 bg-stone-50 p-4 rounded-xl border border-stone-300">
          <div className="flex items-center justify-between text-xs font-heading font-bold text-[#1E0404]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1E0404]" />
              Live Interview Gate
            </span>
            <span className="font-mono text-xs font-black">
              {clearedSkillsCount === totalSkillsRequired
                ? '✅ 5/5 Skills Cleared — Live Online Interview Unlocked'
                : `🔒 ${totalSkillsRequired - clearedSkillsCount} Skill(s) Remaining to Unlock Live Interview`}
            </span>
          </div>
          <div className="w-full bg-stone-200 h-3.5 rounded-full border border-[#1E0404] overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full border border-[#1E0404] transition-all duration-500 ${
                clearedSkillsCount === totalSkillsRequired ? 'bg-[#10B981]' : 'bg-[#F4DF38]'
              }`}
              style={{ width: `${skillsProgressPct}%` }}
            ></div>
          </div>
        </div>

        {/* 5 Required Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(currentStudent.skills || []).map((skill, idx) => {
            const isCleared = skill.status === 'cleared';
            const isInProgress = skill.status === 'in_progress';
            const isNotStarted = skill.status === 'not_started';
            const gradeBadgeColor =
              isNotStarted
                ? 'bg-stone-100 text-stone-500 border-stone-300'
                : skill.bestGrade === 'gold'
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : skill.bestGrade === 'silver'
                ? 'bg-stone-100 text-stone-800 border-stone-300'
                : skill.bestGrade === 'try_again'
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-stone-100 text-stone-400 border-stone-200';

            return (
              <div
                key={skill.skillId || idx}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCleared
                    ? 'border-[#1E0404] bg-white shadow-sm'
                    : isInProgress
                    ? 'border-amber-400 bg-amber-50/50'
                    : 'border-stone-300 bg-stone-100/70 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg border border-[#1E0404] flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCleared
                          ? 'bg-[#10B981] text-white'
                          : isInProgress
                          ? 'bg-[#F4DF38] text-[#1E0404]'
                          : 'bg-stone-300 text-stone-600'
                      }`}
                    >
                      {isCleared ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>
                    <div>
                      <span className="font-heading font-bold text-xs text-[#1E0404] block leading-snug">
                        {skill.skillName}
                      </span>
                      <span className="text-[10px] font-mono text-stone-500 block">
                        {skill.code} • {skill.domain}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${gradeBadgeColor}`}
                  >
                    {isNotStarted ? 'NOT ATTEMPTED' : skill.bestGrade ? `${skill.bestGrade.toUpperCase()} (${skill.finalMiles}m)` : 'LOCKED'}
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 font-sans line-clamp-2 mb-3">
                  {skill.desc}
                </p>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-stone-500">
                    <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                    Invigilated Campus Lab
                  </span>
                  <span
                    className={`font-bold ${
                      isCleared
                        ? 'text-emerald-700'
                        : isInProgress
                        ? 'text-amber-800'
                        : 'text-stone-400'
                    }`}
                  >
                    {isCleared ? 'Cleared ✓' : isInProgress ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Detailed Result View (if evaluated: pass/retake/noshow/malpractice) */}
      {isEvaluated && (
        <StudentResultView
          student={currentStudent}
          onBookAgainClick={() => setIsBookingModalOpen(true)}
        />
      )}

      {/* Booking Slot Modal */}
      <SlotBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}
