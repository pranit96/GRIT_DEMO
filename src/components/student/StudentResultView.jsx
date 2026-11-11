import React from 'react';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  ArrowRight,
  Download,
  BookOpen,
  Calendar,
  HelpCircle,
  User,
  UserX,
  ShieldAlert,
  FileText,
  Clock,
  AlertOctagon,
  Info
} from 'lucide-react';

export default function StudentResultView({ student, onBookAgainClick }) {
  const { evaluation } = student;
  if (!evaluation) return null;

  const isPass = evaluation.outcome === 'pass';
  const isRetake = evaluation.outcome === 'retake';
  const isFail = evaluation.outcome === 'fail';
  const isNoShow = evaluation.outcome === 'no_show';
  const isMalpractice = evaluation.outcome === 'malpractice';

  return (
    <div className="space-y-6">
      {/* Result Hero Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl grit-border grit-shadow-lg text-[#1E0404] ${
        isPass
          ? 'bg-[#F4DF38]'
          : isRetake
          ? 'bg-[#FFFEF7] border-l-[12px] border-l-[#F4DF38]'
          : isNoShow
          ? 'bg-[#FFFEF7] border-l-[12px] border-l-[#F4DF38]'
          : isMalpractice
          ? 'bg-[#1E0404] text-[#FFFEF7] border-l-[12px] border-l-[#D74247]'
          : 'bg-[#FFFEF7] border-l-[12px] border-l-[#D74247]'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl border-[2.5px] border-[#1E0404] flex items-center justify-center shrink-0 grit-shadow-sm ${
              isPass
                ? 'bg-[#FFFEF7] text-[#1E0404]'
                : isRetake
                ? 'bg-[#F4DF38] text-[#1E0404]'
                : isNoShow
                ? 'bg-[#F4DF38] text-[#1E0404]'
                : isMalpractice
                ? 'bg-[#D74247] text-white'
                : 'bg-[#D74247] text-white'
            }`}>
              {isPass && <Award className="w-8 h-8 stroke-[2.5]" />}
              {isRetake && <AlertTriangle className="w-8 h-8 stroke-[2.5]" />}
              {isNoShow && <UserX className="w-8 h-8 stroke-[2.5]" />}
              {isMalpractice && <ShieldAlert className="w-8 h-8 stroke-[2.5]" />}
              {isFail && <XCircle className="w-8 h-8 stroke-[2.5]" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`font-heading font-black text-xs uppercase tracking-widest ${isMalpractice ? 'text-stone-300' : 'text-[#1E0404]/70'}`}>
                  Official Assessment Verdict
                </span>
                <GritBadge
                  variant={
                    isPass
                      ? 'green'
                      : isRetake
                      ? 'yellow'
                      : isNoShow
                      ? 'yellow'
                      : isMalpractice
                      ? 'red'
                      : 'red'
                  }
                >
                  {isPass && 'Evaluation Cleared'}
                  {isRetake && 'Action Required'}
                  {isNoShow && 'Notice: Absence Recorded'}
                  {isMalpractice && 'Disciplinary Hold (Malpractice)'}
                  {isFail && 'Review Needed'}
                </GritBadge>
              </div>

              <h2 className={`font-heading font-black text-2xl sm:text-3xl tracking-tight ${isMalpractice ? 'text-[#FFFEF7]' : 'text-[#1E0404]'}`}>
                {isPass && `Congratulations, ${student.name.split(' ')[0]}! You Passed Your Live Interview & Earned Your Track Badge 🏅`}
                {isRetake && "Interview Outcome: Retake Recommended in 7 Days ⚠"}
                {isNoShow && "Interview Absence: No Show Recorded on Technical Evaluation"}
                {isMalpractice && "Academic Integrity Notice: Track Badge Nullified for Malpractice 🚨"}
                {isFail && "Evaluation Outcome: Foundational Review Required"}
              </h2>

              <p className={`text-xs sm:text-sm font-sans max-w-2xl leading-relaxed ${isMalpractice ? 'text-stone-300' : 'text-stone-800'}`}>
                {isPass && `The interview panel has approved your evaluation with a score of ${evaluation.score}/${evaluation.maxScore} (Distinction Pass). You have officially cleared all requirements and EARNED the ${student.trackBadgeName || 'Full Stack Engineering Track Badge'} 🏅 (Certificate ID: ${evaluation.badgeCertificateId || 'NIAT-FSE-2026-0891'}). Capstone Apprenticeship unlocked and Immersion Trip contender standing verified.`}
                {isRetake && "Thank you for your effort in the technical evaluation. The panel noted strong architectural intuition but recommends further mastery of Graph Traversal and Time Complexity optimizations before advancing. Your retake booking window unlocks on Thursday, Nov 21 at 9:00 AM EST. Please review your evaluator’s detailed study plan below and attend open mentor office hours this Tuesday."}
                {isNoShow && `You were scheduled for a 45-minute technical evaluation with ${evaluation.evaluatorName}, but our logs confirm you did not connect to the room. Cohort policy allows a 48-hour courtesy grace period (${evaluation.gracePeriodDeadline || '48 hours remaining'}) to reschedule a replacement session without penalty.`}
                {isMalpractice && `Candidate was caught doing malpractice and flagged later during post-evaluation audit (Incident Ref: ${evaluation.incidentRef || 'SEC-2026-904'}). In accordance with GRIT Program Regulations and Clause 5.3.2, your Track Badge has been nullified, evaluation credentials revoked, all accrued Qualiflyer Miles forfeited, and progression suspended.`}
                {isFail && "Thank you for completing the technical evaluation. The panel identified foundational gaps in asynchronous programming and promise handling. You have been enrolled in Core Module refreshers with academic coaching."}
              </p>
            </div>
          </div>

          {/* Score Badge */}
          <div className="bg-[#1E0404] text-[#FFFEF7] p-4 sm:p-5 rounded-2xl grit-border grit-shadow-sm text-center shrink-0 min-w-[140px]">
            <span className="text-[10px] uppercase font-heading font-bold text-stone-300 block">
              {isNoShow ? 'Attendance Status' : isMalpractice ? 'Session Verdict' : 'Cumulative Score'}
            </span>
            <div className={`font-heading font-black text-2xl sm:text-3xl my-0.5 ${
              isPass ? 'text-[#F4DF38]' : isNoShow ? 'text-[#F4DF38]' : isMalpractice ? 'text-[#D74247]' : 'text-[#D74247]'
            }`}>
              {isNoShow ? 'NO SHOW' : isMalpractice ? 'HOLD' : evaluation.score}
              {!isNoShow && !isMalpractice && (
                <span className="text-sm font-normal text-stone-400">/{evaluation.maxScore}</span>
              )}
            </div>
            <span className="text-[10px] font-mono text-stone-300 block">
              {isNoShow ? '48h Grace Window' : isMalpractice ? 'Disciplinary Hold' : `Evaluated ${new Date(evaluation.evaluatedAt).toLocaleDateString()}`}
            </span>
          </div>
        </div>

        {/* Action CTAs in Banner */}
        <div className={`mt-6 pt-5 border-t-2 flex flex-wrap items-center justify-between gap-4 ${isMalpractice ? 'border-white/20' : 'border-[#1E0404]/20'}`}>
          <div className={`flex items-center gap-2 text-xs font-heading font-bold ${isMalpractice ? 'text-[#FFFEF7]' : 'text-[#1E0404]'}`}>
            <User className="w-4 h-4" />
            <span>Assigned Evaluator: <strong>{evaluation.evaluatorName}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isPass && (
              <>
                <GritButton variant="purple" size="md" icon={ArrowRight}>
                  Enter Capstone Project
                </GritButton>
                <GritButton variant="secondary" size="md" icon={Download}>
                  Download Evaluation PDF
                </GritButton>
              </>
            )}

            {isRetake && (
              <>
                <GritButton variant="primary" size="md" icon={BookOpen}>
                  View Targeted Study Plan
                </GritButton>
                <GritButton
                  variant="secondary"
                  size="md"
                  onClick={onBookAgainClick}
                  icon={Calendar}
                >
                  Book Retake Slot (Opens Nov 21)
                </GritButton>
              </>
            )}

            {isNoShow && (
              <>
                <GritButton
                  variant="primary"
                  size="md"
                  onClick={onBookAgainClick}
                  icon={Calendar}
                >
                  Reschedule Make-Up Slot (48h Window) ➔
                </GritButton>
                <GritButton
                  variant="secondary"
                  size="md"
                  icon={HelpCircle}
                  onClick={() => alert('Absence documentation request submitted to Student Support.')}
                >
                  Submit Absence Documentation
                </GritButton>
              </>
            )}

            {isMalpractice && (
              <>
                <GritButton
                  variant="danger"
                  size="md"
                  icon={FileText}
                  onClick={() => alert('Formal statement portal opened: Send statement and logs to integrity@grit.edu within 48h.')}
                >
                  Submit Formal Appeal (48h Window) ➔
                </GritButton>
                <GritButton
                  variant="secondary"
                  size="md"
                  icon={HelpCircle}
                  onClick={() => alert('GRIT Honor Code Section 4.2: Unauthorized external assistance or clipboard injection during evaluation constitutes gross malpractice.')}
                >
                  Review Honor Code Policy
                </GritButton>
              </>
            )}

            {isFail && (
              <>
                <GritButton variant="danger" size="md" icon={BookOpen}>
                  Access Foundation Modules
                </GritButton>
                <GritButton variant="secondary" size="md" icon={HelpCircle}>
                  Speak to Academic Advisor
                </GritButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SPECIALIZED BODY FOR NO SHOW */}
      {isNoShow && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GritCard header="Absence Incident Details" className="md:col-span-2" accent="yellow">
            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-stone-800 space-y-2">
                <div className="flex items-center gap-2 font-heading font-black text-sm text-[#1E0404]">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Official Attendance Notice Ref: {evaluation.incidentRef || 'ABS-2026-109'}</span>
                </div>
                <p>
                  Evaluator <strong>{evaluation.evaluatorName}</strong> opened the meeting room at the scheduled time and waited for 15 minutes. Candidate did not join or reach out to reschedule prior to the session start.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-stone-600">
                  <span>Grace Period Expires: <strong>{evaluation.gracePeriodDeadline || 'Thursday, Nov 12 at 5:00 PM EST'}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="font-heading font-bold text-[#1E0404] block mb-1">Courtesy Reschedule Policy</span>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Students are granted 1 courtesy reschedule for legitimate emergencies without academic penalty if claimed within 48 hours.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="font-heading font-bold text-[#1E0404] block mb-1">Consequences of Inaction</span>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    If no replacement slot is claimed before the grace period expires, Milestone 2 will be graded as Incomplete and postponed to next cohort.
                  </p>
                </div>
              </div>
            </div>
          </GritCard>

          <GritCard header="Next Steps for Candidate" accent="dark">
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-stone-700">
                <span className="w-5 h-5 rounded-full bg-[#F4DF38] text-[#1E0404] font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                <span>Click <strong>Reschedule Make-Up Slot</strong> to choose an available time window this week.</span>
              </div>
              <div className="flex items-start gap-2 text-stone-700">
                <span className="w-5 h-5 rounded-full bg-[#F4DF38] text-[#1E0404] font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                <span>If absence was due to medical or technical failure, submit supporting documentation.</span>
              </div>
              <div className="flex items-start gap-2 text-stone-700">
                <span className="w-5 h-5 rounded-full bg-[#F4DF38] text-[#1E0404] font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                <span>Attend pre-session camera/mic test 10 minutes prior to your new scheduled interview.</span>
              </div>
            </div>
          </GritCard>
        </div>
      )}

      {/* SPECIALIZED BODY FOR MALPRACTICE */}
      {isMalpractice && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GritCard header="Academic Security Incident Report" className="md:col-span-2" accent="red">
            <div className="space-y-4 text-xs font-sans">
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-[#D74247] text-stone-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-sm text-[#D74247] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Security Case Ref: {evaluation.incidentRef || 'SEC-2026-904'}
                  </span>
                  <GritBadge variant="red">Disciplinary Hold Active</GritBadge>
                </div>

                <div className="space-y-1 text-xs pt-1">
                  <p><strong>Violation Category:</strong> {evaluation.violationType || 'Unauthorized External Assistance / Code Injection'}</p>
                  <p><strong>Telemetry Evidence:</strong> {evaluation.evidence || 'Automated IDE telemetry detected paste stream from non-whitelisted external process and audio feed registered secondary prompter.'}</p>
                  <p><strong>Evaluation Status:</strong> Terminated at minute 18 • Result invalidated</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="font-heading font-bold text-[#1E0404] block mb-1">Academic Standards Hearing</span>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Formal hearing scheduled for <strong>{evaluation.hearingDate || 'Nov 18, 2026'}</strong> before the Academic Standards Committee.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-stone-200 bg-white">
                  <span className="font-heading font-bold text-[#1E0404] block mb-1">Student Rights & Appeals</span>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    You have the right to inspect technical logs and submit a written statement within 48 hours to <strong>integrity@grit.edu</strong>.
                  </p>
                </div>
              </div>
            </div>
          </GritCard>

          <GritCard header="Program Access Status" accent="dark">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-100 border border-stone-300 space-y-2">
                <div className="flex items-center justify-between text-[#1E0404] font-bold">
                  <span>Milestone 2 Interview:</span>
                  <span className="text-[#D74247]">Invalidated</span>
                </div>
                <div className="flex items-center justify-between text-[#1E0404] font-bold">
                  <span>Milestone 3 Capstone:</span>
                  <span className="text-[#D74247]">Locked (Hold)</span>
                </div>
                <div className="flex items-center justify-between text-[#1E0404] font-bold">
                  <span>Code Repositories:</span>
                  <span className="text-[#D74247]">Read-Only</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Academic holds can only be lifted following formal resolution by the Academic Integrity Board.
              </p>
            </div>
          </GritCard>
        </div>
      )}

      {/* STANDARD RUBRIC SCORING GRID (FOR PASS, RETAKE, FAIL) */}
      {!isNoShow && !isMalpractice && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Problem Solving",
                score: evaluation.rubric?.problemSolving || 4,
                desc: "Algorithm design, trade-offs, edge-case coverage"
              },
              {
                name: "System Architecture",
                score: evaluation.rubric?.systemDesign || 4.5,
                desc: "Decoupling, scalability, database selection"
              },
              {
                name: "Code Cleanliness",
                score: evaluation.rubric?.codeQuality || 4,
                desc: "Modularity, naming, linting, error handling"
              },
              {
                name: "Communication",
                score: evaluation.rubric?.communication || 5,
                desc: "Clarity of explanation, active listening"
              }
            ].map((rub, rIdx) => (
              <GritCard key={rIdx} className="p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-xs text-[#1E0404] uppercase tracking-wider">
                    {rub.name}
                  </span>
                  <span className="font-heading font-black text-base text-[#1E0404]">
                    {rub.score}<span className="text-xs font-normal text-stone-500">/5</span>
                  </span>
                </div>

                {/* Rating Stars Bar */}
                <div className="w-full bg-stone-100 rounded-full h-2.5 border border-[#1E0404] overflow-hidden mb-2">
                  <div
                    className="bg-[#F4DF38] h-full"
                    style={{ width: `${(rub.score / 5) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-stone-500 font-sans leading-tight">
                  {rub.desc}
                </p>
              </GritCard>
            ))}
          </div>

          {/* Evaluator Written Feedback & Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GritCard header="Evaluator Feedback Notes" className="md:col-span-2" accent="dark">
              <p className="text-sm font-sans text-stone-800 leading-relaxed italic bg-stone-50 p-4 rounded-xl border border-stone-200">
                "{evaluation.feedback}"
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                <span>Signed by: <strong>{evaluation.evaluatorName}</strong></span>
                <span>Recorded via GRIT Interview Team Evaluation Console</span>
              </div>
            </GritCard>

            <GritCard header="Focus Breakdown" accent="yellow">
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-heading font-bold text-[#1E0404] uppercase tracking-wider block mb-2 text-[11px]">
                    Demonstrated Strengths
                  </span>
                  <div className="space-y-1.5">
                    {(evaluation.strengths || ['System Partitioning', 'Clear Communication']).map((s, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-stone-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-heading font-bold text-[#1E0404] uppercase tracking-wider block mb-2 text-[11px]">
                    Targeted Improvements
                  </span>
                  <div className="space-y-1.5">
                    {(evaluation.improvements || ['Practice cycle detection']).map((imp, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-stone-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GritCard>
          </div>
        </>
      )}
    </div>
  );
}

