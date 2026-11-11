import React from 'react';
import { useGrit } from '../../context/GritContext';
import {
  Home,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  UserX,
  ShieldAlert,
  Trophy
} from 'lucide-react';

export default function StateSwitcherBar() {
  const {
    currentRole,
    setCurrentRole,
    studentStateOverride,
    setStudentStateOverride,
    resetAllData,
    students,
    slots,
    currentStudentId,
    setCurrentStudentId,
    currentStudent
  } = useGrit();

  // Counts for role badges
  const unbookedCount = students.filter(s => s.bookingStatus === 'unbooked').length;
  const availableSlotsCount = slots.filter(s => s.status === 'available').length;

  // Active state of currently selected student
  const activeStudentState = (() => {
    if (studentStateOverride && studentStateOverride !== 'auto') {
      return studentStateOverride;
    }
    if (currentStudent.eligibilityStatus === 'Ineligible' || currentStudent.bookingStatus === 'ineligible') return 'ineligible';
    if (currentStudent.bookingStatus === 'unbooked') return 'unbooked';
    if (currentStudent.bookingStatus === 'booked') return 'booked';
    if (currentStudent.bookingStatus === 'completed') return 'completed';
    if (currentStudent.evaluation?.outcome === 'pass') return 'passed';
    if (currentStudent.evaluation?.outcome === 'retake') return 'retake';
    if (currentStudent.evaluation?.outcome === 'fail') return 'failed';
    if (currentStudent.evaluation?.outcome === 'no_show') return 'no_show';
    if (currentStudent.evaluation?.outcome === 'malpractice') return 'malpractice';
    return 'unbooked';
  })();

  return (
    <div className="bg-[#1E0404] text-[#FFFEF7] border-b-[2.5px] border-[#1E0404] px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Role Switcher (Student, Interviewer, Interview Team) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4DF38] animate-pulse"></span>
            <span className="font-heading font-black uppercase tracking-wider text-[#F4DF38]">
              Prototype Controls:
            </span>
          </div>

          {/* Prototype Home Launcher */}
          <button
            onClick={() => setCurrentRole('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-heading font-black text-xs transition-all border ${
              currentRole === 'home'
                ? 'bg-[#FFFEF7] text-[#1E0404] border-[#FFFEF7] grit-shadow-sm scale-[1.02]'
                : 'bg-stone-850 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Home</span>
          </button>

          {/* Role 1: Student */}
          <button
            onClick={() => setCurrentRole('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-heading font-black text-xs transition-all border ${
              currentRole === 'student'
                ? 'bg-[#F4DF38] text-[#1E0404] border-[#F4DF38] grit-shadow-sm scale-[1.02]'
                : 'bg-stone-850 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Student</span>
          </button>

          {/* Role 2: Interviewer */}
          <button
            onClick={() => setCurrentRole('interviewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-heading font-black text-xs transition-all border ${
              currentRole === 'interviewer'
                ? 'bg-[#4277FB] text-white border-[#4277FB] grit-shadow-sm scale-[1.02]'
                : 'bg-stone-850 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Interviewer</span>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {availableSlotsCount}
            </span>
          </button>

          {/* Role 3: Interview Team (Renamed instead of Ops Team) */}
          <button
            onClick={() => setCurrentRole('interviewTeam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-heading font-black text-xs transition-all border ${
              currentRole === 'interviewTeam'
                ? 'bg-[#D74247] text-white border-[#D74247] grit-shadow-sm scale-[1.02]'
                : 'bg-stone-850 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Interview Team</span>
            {unbookedCount > 0 && (
              <span className="bg-[#F4DF38] text-[#1E0404] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {unbookedCount} alert
              </span>
            )}
          </button>

          {/* Qualiflyer Leaderboard (Clause 5.3) */}
          <button
            onClick={() => setCurrentRole('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-heading font-black text-xs transition-all border ${
              currentRole === 'leaderboard'
                ? 'bg-[#F4DF38] text-[#1E0404] border-[#F4DF38] grit-shadow-sm scale-[1.02]'
                : 'bg-stone-850 text-[#F4DF38] border-amber-600/40 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Qualiflyer Leaderboard</span>
          </button>
        </div>

        {/* Right: State controls & reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* If Student role is active, show Persona Dropdown and Student State */}
          {currentRole === 'student' && (
            <div className="flex flex-wrap items-center gap-2 pl-2 border-l border-stone-700">
              {/* 1. Student Persona Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-[11px] font-bold whitespace-nowrap">
                  Student:
                </span>
                <select
                  value={currentStudentId}
                  onChange={(e) => {
                    setCurrentStudentId(e.target.value);
                    setStudentStateOverride('auto');
                  }}
                  className="bg-stone-850 text-white font-heading font-bold text-xs px-2.5 py-1 rounded-lg border border-stone-700 hover:border-[#F4DF38] focus:outline-none focus:border-[#F4DF38] cursor-pointer"
                >
                  {students.map((s) => {
                    const statusDesc =
                      s.trackBadgeStatus === 'nullified'
                        ? 'badge nullified 🚫'
                        : s.eligibilityStatus === 'Ineligible' || s.bookingStatus === 'ineligible' || !s.allSkillsCleared
                        ? `skills incomplete: ${s.clearedSkillsCount || 2}/5 cleared`
                        : s.bookingStatus === 'unbooked'
                        ? `unbooked: 5/5 cleared (${s.deadlineDaysRemaining}d left)`
                        : s.bookingStatus === 'booked'
                        ? 'interview booked'
                        : s.bookingStatus === 'completed'
                        ? 'review ready'
                        : s.evaluation?.outcome === 'pass'
                        ? 'track badge earned 🏅'
                        : s.evaluation?.outcome === 'retake'
                        ? 'retake required'
                        : s.evaluation?.outcome === 'no_show'
                        ? 'no show'
                        : s.evaluation?.outcome === 'malpractice'
                        ? 'malpractice 🚫'
                        : s.evaluation?.outcome || s.bookingStatus;

                    return (
                      <option key={s.id} value={s.id} className="bg-stone-900 text-white">
                        {s.name} ({statusDesc})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 2. Student State: reflects dynamic active state & allows switching */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-[11px] font-bold whitespace-nowrap">
                  Student State:
                </span>
                <select
                  value={activeStudentState}
                  onChange={(e) => setStudentStateOverride(e.target.value)}
                  className={`font-heading font-black text-xs px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer transition-all ${
                    activeStudentState === 'passed'
                      ? 'bg-[#10B981] text-white border-[#10B981]'
                      : activeStudentState === 'ineligible'
                      ? 'bg-amber-400 text-[#1E0404] border-amber-400'
                      : activeStudentState === 'retake'
                      ? 'bg-[#F4DF38] text-[#1E0404] border-[#F4DF38]'
                      : activeStudentState === 'unbooked'
                      ? 'bg-[#FFFEF7] text-[#1E0404] border-[#FFFEF7]'
                      : activeStudentState === 'booked'
                      ? 'bg-[#4277FB] text-white border-[#4277FB]'
                      : activeStudentState === 'completed'
                      ? 'bg-[#4277FB] text-white border-[#4277FB]'
                      : activeStudentState === 'no_show'
                      ? 'bg-[#1E0404] text-[#F4DF38] border-[#F4DF38]'
                      : activeStudentState === 'malpractice'
                      ? 'bg-[#D74247] text-white border-[#D74247]'
                      : 'bg-stone-850 text-stone-200 border-stone-700'
                  }`}
                >
                  <option value="ineligible" className="bg-stone-900 text-white">Before: Skills Incomplete (2/5 Cleared - Interview Locked)</option>
                  <option value="unbooked" className="bg-stone-900 text-white">Before: All Skills Cleared (Unbooked - Ready for Interview)</option>
                  <option value="booked" className="bg-stone-900 text-white">Before: Interview Booked</option>
                  <option value="completed" className="bg-stone-900 text-white">After: Interview Completed (Review Ready)</option>
                  <option value="passed" className="bg-stone-900 text-white">After: Track Badge Earned 🏅</option>
                  <option value="retake" className="bg-stone-900 text-white">After: Retake Required</option>
                  <option value="failed" className="bg-stone-900 text-white">After: Failed</option>
                  <option value="no_show" className="bg-stone-900 text-white">After: No Show</option>
                  <option value="malpractice" className="bg-stone-900 text-white">After: Track Badge Nullified (Malpractice) 🚫</option>
                </select>

                {studentStateOverride !== 'auto' && (
                  <button
                    onClick={() => setStudentStateOverride('auto')}
                    className="text-[10px] text-stone-400 hover:text-[#F4DF38] px-1.5 py-0.5 rounded bg-stone-850 border border-stone-700 hover:border-[#F4DF38] transition-colors font-bold"
                    title="Reset to selected student's natural state"
                  >
                    ↺ Reset
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reset Database Button */}
          <button
            onClick={resetAllData}
            className="flex items-center gap-1 text-stone-400 hover:text-[#F4DF38] transition-colors py-1 px-2.5 rounded hover:bg-stone-800 border border-transparent hover:border-stone-700"
            title="Reset database to benchmark mock state"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
