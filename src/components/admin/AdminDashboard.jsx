import React, { useState } from 'react';
import { useGrit } from '../../context/GritContext';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import RecordOutcomeModal from './RecordOutcomeModal';
import SendEmailNotificationModal from './SendEmailNotificationModal';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Clock,
  Send,
  User,
  Bell,
  Eye,
  FileCheck,
  Mail,
  Check,
  Sparkles,
  UserX,
  ShieldAlert,
  Medal,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    interviewTeamUser,
    students,
    slots,
    setCurrentRole,
    setCurrentStudentId,
    sendStudentNotificationEmail,
    nullifyStudentBadge
  } = useGrit();

  // State
  const [bookingFilter, setBookingFilter] = useState('all');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [cohortFilter, setCohortFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState(null);
  const [emailModalStudent, setEmailModalStudent] = useState(null);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);

  // Stats
  const isIneligible = (std) => std.eligibilityStatus === 'Ineligible' || std.bookingStatus === 'ineligible' || std.allSkillsCleared === false;
  const eligibleStudents = students.filter(s => !isIneligible(s));
  const ineligibleStudents = students.filter(s => isIneligible(s));
  const totalEligible = eligibleStudents.length;
  const bookedStudents = eligibleStudents.filter(s => s.bookingStatus === 'booked' || s.bookingStatus === 'completed');
  const unbookedStudents = eligibleStudents.filter(s => s.bookingStatus === 'unbooked');
  const awaitingDecisionStudents = eligibleStudents.filter(s => s.bookingStatus === 'completed' || (s.interviewerReview && !s.evaluation));
  const evaluatedStudents = students.filter(s => s.bookingStatus === 'evaluated' && s.evaluation);
  const passedStudents = evaluatedStudents.filter(s => s.evaluation.outcome === 'pass');
  const retakeStudents = evaluatedStudents.filter(s => s.evaluation.outcome === 'retake');
  const failedStudents = evaluatedStudents.filter(s => s.evaluation.outcome === 'fail');
  const noShowStudents = evaluatedStudents.filter(s => s.evaluation.outcome === 'no_show');
  const malpracticeStudents = students.filter(s => s.trackBadgeStatus === 'nullified' || s.evaluation?.outcome === 'malpractice');

  const bookingPercentage = Math.round(((totalEligible - unbookedStudents.length) / (totalEligible || 1)) * 100);

  // Filtered roster
  const filteredStudents = students.filter(std => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = std.name.toLowerCase().includes(q);
      const matchEmail = std.email.toLowerCase().includes(q);
      if (!matchName && !matchEmail) return false;
    }

    // Cohort
    if (cohortFilter !== 'all') {
      if (!std.cohort.includes(cohortFilter)) return false;
    }

    // Booking Status filter
    if (bookingFilter === 'ineligible' && !isIneligible(std)) return false;
    if (bookingFilter === 'unbooked' && (isIneligible(std) || std.bookingStatus !== 'unbooked')) return false;
    if (bookingFilter === 'booked' && (isIneligible(std) || (std.bookingStatus !== 'booked' && std.bookingStatus !== 'completed'))) return false;
    if (bookingFilter === 'awaiting_decision' && (isIneligible(std) || (std.bookingStatus !== 'completed' && !(std.interviewerReview && !std.evaluation)))) return false;
    if (bookingFilter === 'evaluated' && (std.bookingStatus !== 'evaluated' || !std.evaluation)) return false;
    if (bookingFilter === 'nullified' && std.trackBadgeStatus !== 'nullified' && std.evaluation?.outcome !== 'malpractice') return false;

    // Outcome filter
    if (outcomeFilter !== 'all') {
      if (!std.evaluation || std.evaluation.outcome !== outcomeFilter) return false;
    }

    return true;
  });

  // Switch to student view for instant preview
  const handleInspectStudent = (studentId) => {
    setCurrentStudentId(studentId);
    setCurrentRole('student');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Interview Team Operations & Header */}
      <div className="bg-[#1E0404] text-[#FFFEF7] p-6 sm:p-8 rounded-2xl grit-border grit-shadow-lg relative overflow-hidden">
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#D74247]/15 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#D74247]">
                Page 3 • Interview Team Portal
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-stone-300 text-xs font-mono">
                Track Badge Authority & Verification Flow
              </span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#FFFEF7] tracking-tight">
              Interview Team Management & Decisions
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-2xl">
              Monitor candidate progression through offline invigilated skill contests. Once every skill required for a Track Badge is cleared, verify live online interview bookings, record official outcomes (Award Track Badge, Retake, No Show, Fail), and nullify badges if malpractice is flagged later per Clause 5.3.2.
            </p>
          </div>

          {/* Primary CTA in Header: Send Notification Email to All Unbooked Candidates */}
          <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
            <GritButton
              variant="primary"
              size="lg"
              icon={Mail}
              onClick={() => setIsBulkEmailModalOpen(true)}
              disabled={unbookedStudents.length === 0}
            >
              Send Notification Email ({unbookedStudents.length} Unbooked) ➔
            </GritButton>
            <span className="text-[11px] text-stone-400 font-sans">
              Primary Cohort CTA • Candidate Notification
            </span>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics (VIEW Requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Eligible (5/5 Skills Cleared) */}
        <GritCard className="p-5 bg-white" accent="dark">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-stone-500 block">
            Skills Cleared (5/5)
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#1E0404] my-1">
            {totalEligible}
          </div>
          <div className="text-[11px] text-stone-600 font-sans flex items-center justify-between">
            <span>Interview Unlocked</span>
            <span className="font-bold font-mono">{bookingPercentage}% Actioned</span>
          </div>
        </GritCard>

        {/* Booked Students */}
        <GritCard className="p-5 bg-white" accent="blue">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#4277FB] block">
            Live Interviews Booked
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#4277FB] my-1">
            {bookedStudents.length}
          </div>
          <span className="text-[11px] text-stone-500">
            {Math.round((bookedStudents.length / (totalEligible || 1)) * 100)}% of interview-ready cohort
          </span>
        </GritCard>

        {/* Unbooked / Haven't Booked */}
        <GritCard className="p-5 bg-white" accent="red">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#D74247] block">
            Haven't Booked (Action Req)
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#D74247] my-1">
            {unbookedStudents.length}
          </div>
          <span className="text-[11px] text-stone-500">
            Can receive booking reminder emails
          </span>
        </GritCard>

        {/* Track Badges Awarded vs Nullified */}
        <GritCard className="p-5 bg-white" accent="yellow">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-stone-700 block">
            Track Badges Awarded 🏅
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#1E0404] my-1">
            {passedStudents.length}
          </div>
          <div className="text-[10px] flex flex-wrap gap-2 font-mono">
            <span className="text-green-700 font-bold">{passedStudents.length} Earned</span>
            <span className="text-amber-700 font-bold">{retakeStudents.length} Retake</span>
            <span className="text-rose-700 font-bold">{malpracticeStudents.length} Nullified 🚫</span>
          </div>
        </GritCard>
      </div>

      {/* Cohort Booking Health Progress Bar */}
      <div className="p-5 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between text-xs font-heading font-bold">
          <span className="text-[#1E0404] uppercase tracking-wider">
            Track Badge Interview Scheduling Progress (Eligible Candidates)
          </span>
          <span className="text-stone-600 font-mono">
            {totalEligible - unbookedStudents.length} of {totalEligible} Scheduled ({bookingPercentage}%)
          </span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-3.5 border border-[#1E0404] overflow-hidden flex">
          <div
            className="bg-[#10B981] h-full transition-all duration-300"
            style={{ width: `${(passedStudents.length / (totalEligible || 1)) * 100}%` }}
            title={`Badge Earned: ${passedStudents.length}`}
          />
          <div
            className="bg-[#4277FB] h-full transition-all duration-300"
            style={{ width: `${(bookedStudents.length / (totalEligible || 1)) * 100}%` }}
            title={`Booked: ${bookedStudents.length}`}
          />
          <div
            className="bg-[#F4DF38] h-full transition-all duration-300"
            style={{ width: `${(retakeStudents.length / (totalEligible || 1)) * 100}%` }}
            title={`Retake: ${retakeStudents.length}`}
          />
          <div
            className="bg-orange-500 h-full transition-all duration-300"
            style={{ width: `${(noShowStudents.length / (totalEligible || 1)) * 100}%` }}
            title={`No Show: ${noShowStudents.length}`}
          />
          <div
            className="bg-[#70449C] h-full transition-all duration-300"
            style={{ width: `${(malpracticeStudents.length / (totalEligible || 1)) * 100}%` }}
            title={`Malpractice / Nullified: ${malpracticeStudents.length}`}
          />
          <div
            className="bg-[#D74247] h-full transition-all duration-300"
            style={{ width: `${(unbookedStudents.length / (totalEligible || 1)) * 100}%` }}
            title={`Not Booked: ${unbookedStudents.length}`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-sans text-stone-600 pt-1">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Badge Earned ({passedStudents.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4277FB]"></span> Booked ({bookedStudents.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F4DF38]"></span> Retake ({retakeStudents.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> No Show ({noShowStudents.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#70449C]"></span> Nullified / Hold ({malpracticeStudents.length})</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D74247]"></span> Haven't Booked ({unbookedStudents.length})</span>
        </div>
      </div>

      {/* Roster Controls: Search & Segmented Status Filters */}
      <div className="p-6 rounded-2xl grit-border grit-shadow bg-[#FFFEF7] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-stone-200">
          <div>
            <h2 className="font-heading font-bold text-xl text-[#1E0404]">
              Track Badge Candidate Roster & Decisions
            </h2>
            <p className="text-xs text-stone-600 font-sans mt-0.5">
              Review who has cleared all skills, check interview bookings, record official badge awards based on interviewer reviews, or nullify badges if malpractice is flagged later.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D74247]"
            />
          </div>
        </div>

        {/* SEGMENTED BOOKING STATUS TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading font-bold text-[#1E0404] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter State:
            </span>

            {[
              { id: 'all', label: `All Candidates (${students.length})` },
              { id: 'unbooked', label: `Haven't Booked (${unbookedStudents.length})`, alert: true },
              { id: 'booked', label: `Have Booked (${bookedStudents.length})` },
              { id: 'awaiting_decision', label: `Interviewer Review Ready (${awaitingDecisionStudents.length})`, highlight: true },
              { id: 'evaluated', label: `Decisions Published (${evaluatedStudents.length})` },
              { id: 'ineligible', label: `Skills Incomplete (${ineligibleStudents.length})` },
              { id: 'nullified', label: `Badge Nullified (${malpracticeStudents.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setBookingFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-heading font-bold text-xs transition-all border ${
                  bookingFilter === tab.id
                    ? 'bg-[#1E0404] text-[#FFFEF7] border-[#1E0404]'
                    : tab.alert
                    ? 'bg-rose-50 text-[#D74247] border-[#D74247] hover:bg-rose-100'
                    : tab.highlight
                    ? 'bg-blue-50 text-[#4277FB] border-[#4277FB] hover:bg-blue-100'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-[#1E0404]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Outcome Filter */}
          <div className="flex items-center gap-2">
            <label className="text-stone-500 font-bold">Outcome Decision:</label>
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="p-1.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-bold focus:outline-none"
            >
              <option value="all">All Outcomes</option>
              <option value="pass">Badge Awarded (Pass)</option>
              <option value="retake">Retake Required</option>
              <option value="no_show">No Show</option>
              <option value="malpractice">Malpractice (Nullified)</option>
              <option value="fail">Fail</option>
            </select>
          </div>
        </div>
      </div>

      {/* ROSTER TABLE */}
      <div className="bg-white rounded-2xl grit-border grit-shadow overflow-hidden">
        <div className="overflow-x-auto lg:overflow-x-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1E0404] text-[#FFFEF7] font-heading font-bold text-[11px] uppercase tracking-wider border-b-2 border-[#1E0404]">
              <tr>
                <th className="py-3 px-3 w-[19%]">Candidate</th>
                <th className="py-3 px-3 w-[15%]">Track Badge & Skills</th>
                <th className="py-3 px-3 w-[15%]">Live Interview Status</th>
                <th className="py-3 px-3 w-[15%]">Schedule / Evaluator</th>
                <th className="py-3 px-3 w-[15%]">Track Badge Outcome</th>
                <th className="py-3 px-4 text-right w-[21%] whitespace-nowrap">Actions & Controls</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500 font-sans">
                    No candidates match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(std => {
                  const isNullifiedStudent = std.trackBadgeStatus === 'nullified' || std.evaluation?.outcome === 'malpractice';
                  const isStudentIneligible = !isNullifiedStudent && (isIneligible(std) || !std.allSkillsCleared);
                  const hasBooked = !isStudentIneligible && !isNullifiedStudent && (std.bookingStatus === 'booked' || std.bookingStatus === 'completed');
                  const isUnbooked = !isStudentIneligible && !isNullifiedStudent && std.bookingStatus === 'unbooked';
                  const isEvaluated = !isStudentIneligible && std.bookingStatus === 'evaluated' && std.evaluation;
                  const hasInterviewerReview = Boolean(std.interviewerReview);
                  const slotObj = slots.find(s => s.id === std.bookedSlotId);

                  const clearedSkills = std.clearedSkillsCount ?? (std.skills ? std.skills.filter(s => s.status === 'cleared').length : 5);
                  const totalSkills = std.totalSkillsRequired || 5;

                  // Check if candidate has appeared for the interview
                  const hasAppearedForInterview = Boolean(
                    std.bookingStatus === 'completed' ||
                    (std.bookingStatus === 'evaluated' && std.evaluation) ||
                    std.interviewerReview
                  );

                  return (
                    <tr
                      key={std.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        isNullifiedStudent ? 'bg-rose-50/30' : isUnbooked ? 'bg-rose-50/15' : isStudentIneligible ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* 1. Candidate Profile */}
                      <td className="py-3 px-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-8 h-8 rounded-full border border-[#1E0404] object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-heading font-bold text-[#1E0404] block text-xs leading-tight truncate">
                              {std.name}
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono font-normal block truncate">
                              {std.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Track Badge & Skills Progress */}
                      <td className="py-3 px-3 align-middle font-sans">
                        <div className="space-y-1">
                          <span className="font-heading font-bold text-xs text-[#1E0404] block leading-tight">
                            {std.trackBadgeName ? 'Full Stack Track' : 'Full Stack Track'}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <GritBadge
                              variant={clearedSkills === totalSkills ? 'green' : isNullifiedStudent ? 'red' : 'yellow'}
                              className="text-[10px] py-0.5 px-2"
                            >
                              {isNullifiedStudent ? 'Revoked 🚫' : `${clearedSkills}/${totalSkills} Cleared`}
                            </GritBadge>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {clearedSkills === totalSkills ? 'Eligible' : 'Incomplete'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Live Interview Status Badge */}
                      <td className="py-3 px-3 align-middle">
                        {isNullifiedStudent && (
                          <GritBadge variant="red" className="text-[10px] py-0.5 px-2">
                            Academic Hold 🚫
                          </GritBadge>
                        )}
                        {!isNullifiedStudent && isStudentIneligible && (
                          <div className="space-y-1">
                            <GritBadge variant="yellow" className="text-[10px] py-0.5 px-2">
                              Interview Locked 🔒
                            </GritBadge>
                            <span className="text-[10px] text-amber-900 block font-bold font-mono">
                              {totalSkills - clearedSkills} Skills Pending
                            </span>
                          </div>
                        )}
                        {!isNullifiedStudent && isUnbooked && (
                          <div className="space-y-1">
                            <GritBadge variant="red" className="text-[10px] py-0.5 px-2">
                              Haven't Booked ({std.deadlineDaysRemaining}d)
                            </GritBadge>
                            {std.notificationEmailSentAt && (
                              <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-bold">
                                <Check className="w-3 h-3" /> Sent
                              </span>
                            )}
                          </div>
                        )}
                        {!isNullifiedStudent && hasBooked && (
                          <GritBadge variant="blue" className="text-[10px] py-0.5 px-2">
                            Slot Booked
                          </GritBadge>
                        )}
                        {!isNullifiedStudent && isEvaluated && (
                          <GritBadge
                            variant={
                              std.evaluation.outcome === 'no_show'
                                ? 'yellow'
                                : std.evaluation.outcome === 'pass'
                                ? 'green'
                                : 'purple'
                            }
                            className="text-[10px] py-0.5 px-2"
                          >
                            {std.evaluation.outcome === 'no_show'
                              ? 'Absence Logged'
                              : std.evaluation.outcome === 'pass'
                              ? 'Interview Cleared'
                              : 'Decision Recorded'}
                          </GritBadge>
                        )}
                      </td>

                      {/* 4. Schedule / Interviewer Review */}
                      <td className="py-3 px-3 align-middle">
                        {isNullifiedStudent ? (
                          <span className="text-rose-700 font-mono text-[11px] block">
                            Flagged for Malpractice
                          </span>
                        ) : isStudentIneligible ? (
                          <div className="space-y-0.5">
                            <span className="font-heading font-bold text-amber-900 block text-xs">
                              Contests Pending
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              DBS-401, SYS-402, ARC-501
                            </span>
                          </div>
                        ) : hasInterviewerReview && !isEvaluated ? (
                          <div className="space-y-0.5">
                            <span className="font-heading font-bold text-[#4277FB] block text-xs">
                              Review Ready ({std.interviewerReview.interviewerName.split(' ')[0]})
                            </span>
                            <span className="text-[10px] text-stone-600">
                              PASS ({std.interviewerReview.recommendedScore || 90}/100)
                            </span>
                          </div>
                        ) : slotObj ? (
                          <div className="space-y-0.5">
                            <span className="font-heading font-bold text-[#1E0404] block text-xs">
                              {slotObj.date} at {slotObj.startTime}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {slotObj.interviewerName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic font-sans text-[11px]">No slot reserved</span>
                        )}
                      </td>

                      {/* 5. Track Badge Decision Outcome */}
                      <td className="py-3 px-3 align-middle">
                        {isNullifiedStudent ? (
                          <div className="space-y-0.5">
                            <GritBadge variant="red" className="text-[10px] py-0.5 px-2">
                              BADGE NULLIFIED 🚫
                            </GritBadge>
                            <span className="text-[10px] text-rose-800 block font-mono">
                              Malpractice Flagged Later
                            </span>
                          </div>
                        ) : isStudentIneligible ? (
                          <span className="text-stone-500 font-mono text-[10px] bg-stone-100 px-2 py-0.5 rounded border border-stone-200 inline-block">
                            🔒 Skills Incomplete
                          </span>
                        ) : isEvaluated ? (
                          <div className="space-y-0.5">
                            <GritBadge
                              variant={
                                std.evaluation.outcome === 'pass'
                                  ? 'green'
                                  : std.evaluation.outcome === 'retake'
                                  ? 'yellow'
                                  : std.evaluation.outcome === 'no_show'
                                  ? 'yellow'
                                  : 'red'
                              }
                              className="text-[10px] py-0.5 px-2"
                            >
                              {std.evaluation.outcome === 'pass'
                                ? `BADGE EARNED 🏅 (${std.evaluation.score}/100)`
                                : std.evaluation.outcome === 'no_show'
                                ? 'NO SHOW (48h Grace)'
                                : std.evaluation.outcome === 'retake'
                                ? `RETAKE (${std.evaluation.score}/100)`
                                : `FAIL (${std.evaluation.score}/100)`}
                            </GritBadge>
                            <span className="text-[10px] text-stone-500 block font-sans">
                              By {std.evaluation.evaluatorName || std.evaluation.evaluatedBy || 'Preeti Sundaram'}
                            </span>
                          </div>
                        ) : hasInterviewerReview ? (
                          <span className="text-blue-700 font-bold text-[10px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                            Awaiting Badge Sign-Off
                          </span>
                        ) : (
                          <span className="text-stone-400 font-mono text-[10px]">
                            Pending Live Interview
                          </span>
                        )}
                      </td>

                      {/* 6. Actions & Controls */}
                      <td className="py-3 px-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                          {/* If ineligible: Skills Nudge */}
                          {isStudentIneligible && (
                            <button
                              onClick={() => {
                                sendStudentNotificationEmail(std.id);
                                alert(`Skills Nudge dispatched to ${std.email}: 'Reminder: Clear remaining 3 skill contests under campus invigilation to unlock your live online interview for the Full Stack Engineering Track Badge.'`);
                              }}
                              className="px-2 py-1 rounded-lg border border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-950 font-heading font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0"
                              title="Send skill contest completion reminder"
                            >
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>Skills Nudge</span>
                            </button>
                          )}

                          {/* If unbooked: Send Notification Email CTA */}
                          {isUnbooked && (
                            <GritButton
                              size="sm"
                              variant="danger"
                              onClick={() => setEmailModalStudent(std)}
                              icon={Mail}
                              className="whitespace-nowrap shrink-0 text-[11px] px-2 py-1"
                            >
                              Send Email ✉️
                            </GritButton>
                          )}

                          {/* If No Show: Send 48h Grace Nudge Email */}
                          {isEvaluated && std.evaluation.outcome === 'no_show' && (
                            <button
                              onClick={() => {
                                sendStudentNotificationEmail(std.id);
                                alert(`Courtesy reschedule notice dispatched to ${std.email} with replacement slot booking links.`);
                              }}
                              className="px-2 py-1 rounded-lg border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 font-heading font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0"
                              title="Send 48h courtesy make-up booking notice"
                            >
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>Nudge 48h</span>
                            </button>
                          )}

                          {/* If Malpractice: View Security Dossier */}
                          {isNullifiedStudent && (
                            <button
                              onClick={() => alert(`Academic Security Incident Ref: ${std.evaluation?.incidentRef || 'SEC-2026-904'}\nViolation: ${std.evaluation?.violationType || 'External Assistance / Malpractice'}\nStatus: Track Badge Nullified & Revoked\nAppeal Window: 48 Hours`)}
                              className="px-2 py-1 rounded-lg border border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-900 font-heading font-bold text-[11px] flex items-center gap-1 transition-colors shrink-0"
                              title="View Security Incident Dossier"
                            >
                              <ShieldAlert className="w-3 h-3 shrink-0" />
                              <span>Dossier</span>
                            </button>
                          )}

                          {/* CRITICAL FEATURE: Nullify Badge Button (Disabled if candidate has yet to appear for interview) */}
                          {!isNullifiedStudent && (
                            <button
                              disabled={!hasAppearedForInterview}
                              onClick={() => {
                                if (!hasAppearedForInterview) return;
                                if (confirm(`Flag malpractice and NULLIFY Track Badge for ${std.name}?\n\nRule: Under NIAT Skilling Regulations & Qualiflyer Clause 5.3.2, any candidate caught doing malpractice and flagged later has their Track Badge permanently nullified and all Miles forfeited.`)) {
                                  nullifyStudentBadge(std.id, 'Candidate was caught doing malpractice and flagged post-evaluation audit.');
                                }
                              }}
                              className={`px-2 py-1 rounded-lg font-heading font-bold text-[11px] flex items-center gap-1 transition-colors border whitespace-nowrap shrink-0 ${
                                !hasAppearedForInterview
                                  ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-50'
                                  : 'border-rose-300 hover:border-[#D74247] bg-white hover:bg-rose-50 text-stone-700 hover:text-[#D74247] cursor-pointer'
                              }`}
                              title={
                                !hasAppearedForInterview
                                  ? 'Disabled: Candidate has yet to appear for the interview'
                                  : 'Flag Malpractice: Nullifies Track Badge and forfeits all Miles (Clause 5.3.2)'
                              }
                            >
                              <ShieldAlert className={`w-3 h-3 shrink-0 ${!hasAppearedForInterview ? 'text-stone-400' : 'text-[#D74247]'}`} />
                              <span>Nullify Badge 🚫</span>
                            </button>
                          )}

                          {/* Preview Student Screen */}
                          <button
                            onClick={() => handleInspectStudent(std.id)}
                            className="p-1 rounded-lg border border-stone-300 hover:border-[#1E0404] bg-white text-stone-600 hover:text-[#1E0404] transition-colors shrink-0"
                            title="Preview Candidate Portal"
                          >
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          {/* Record Outcome Button (Only for candidates who have booked or appeared) */}
                          {!isStudentIneligible && !isNullifiedStudent && !isUnbooked && (
                            <GritButton
                              size="sm"
                              variant={hasInterviewerReview && !isEvaluated ? 'primary' : isEvaluated ? 'secondary' : 'primary'}
                              onClick={() => setSelectedStudentForGrading(std)}
                              icon={FileCheck}
                              className="whitespace-nowrap shrink-0 text-[11px] px-2 py-1"
                            >
                              {isEvaluated ? 'Edit Decision' : hasInterviewerReview ? 'Award Badge ➔' : 'Record Outcome'}
                            </GritButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Outcome Evaluation Modal */}
      <RecordOutcomeModal
        isOpen={Boolean(selectedStudentForGrading)}
        onClose={() => setSelectedStudentForGrading(null)}
        student={selectedStudentForGrading}
        slot={selectedStudentForGrading ? slots.find(s => s.id === selectedStudentForGrading.bookedSlotId) : null}
      />

      {/* Send Notification Email to Single Student */}
      <SendEmailNotificationModal
        isOpen={Boolean(emailModalStudent)}
        onClose={() => setEmailModalStudent(null)}
        targetStudent={emailModalStudent}
      />

      {/* Send Bulk Notification Email to All Unbooked Students */}
      <SendEmailNotificationModal
        isOpen={isBulkEmailModalOpen}
        onClose={() => setIsBulkEmailModalOpen(false)}
        unbookedStudents={unbookedStudents}
      />
    </div>
  );
}
