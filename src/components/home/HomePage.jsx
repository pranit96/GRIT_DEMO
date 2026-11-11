import React from 'react';
import { useGrit } from '../../context/GritContext';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  FileCheck,
  Send,
  Zap,
  Users,
  Layers,
  Sparkles,
  Trophy,
  Plane
} from 'lucide-react';

export default function HomePage() {
  const {
    setCurrentRole,
    students,
    slots,
    interviewers
  } = useGrit();

  const unbookedStudents = students.filter(s => s.bookingStatus === 'unbooked');
  const bookedStudents = students.filter(s => s.bookingStatus === 'booked');
  const completedReviewReady = students.filter(s => s.bookingStatus === 'completed');
  const evaluatedStudents = students.filter(s => s.bookingStatus === 'evaluated');
  const availableSlots = slots.filter(s => s.status === 'available');

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      {/* The 3 Main Interactive Launch Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-xl text-[#1E0404] tracking-tight">
            Launch an Interactive Mode
          </h2>
          <span className="text-xs text-stone-500 font-sans">
            Click any portal below to launch and test live actions
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Student Mode */}
          <div className="p-6 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow flex flex-col justify-between border-t-[10px] border-t-[#F4DF38] space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#F4DF38] border-2 border-[#1E0404] flex items-center justify-center font-bold text-[#1E0404] grit-shadow-sm">
                  <GraduationCap className="w-6 h-6 stroke-[2.5]" />
                </div>
                <GritBadge variant="yellow">Page 1</GritBadge>
              </div>

              <div>
                <h3 className="font-heading font-black text-xl text-[#1E0404]">
                  Student Portal
                </h3>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                Students clear offline invigilated skill contests. Once all skills for a Track Badge are cleared (5/5), they schedule their live online interview with our team of interviewers to officially earn their Track Badge.
              </p>

              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-[#1E0404]">
                  <span>Active Candidate:</span>
                  <span className="text-[#D74247]">Aarav Sharma</span>
                </div>
                <div className="flex items-center justify-between text-stone-600 text-[11px]">
                  <span>Status:</span>
                  <span>{unbookedStudents.find(s => s.id === 'std-1') ? 'Eligible (Not Booked)' : 'Slot Booked'}</span>
                </div>
              </div>
            </div>

            <GritButton
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => setCurrentRole('student')}
              className="w-full text-sm py-3"
            >
              Launch Student Mode ➔
            </GritButton>
          </div>

          {/* Card 2: Interviewer Mode */}
          <div className="p-6 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow flex flex-col justify-between border-t-[10px] border-t-[#4277FB] space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#4277FB] border-2 border-[#1E0404] flex items-center justify-center font-bold text-white grit-shadow-sm">
                  <Briefcase className="w-6 h-6 stroke-[2.5]" />
                </div>
                <GritBadge variant="blue">Page 2</GritBadge>
              </div>

              <div>
                <h3 className="font-heading font-black text-xl text-[#1E0404]">
                  Interviewer Portal
                </h3>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                Evaluators manage availability with full CRUD (Create, Modify, Delete, Pause). Launch live interview sandbox rooms with code editor and test runner, then fill out evaluation reports right in front of the student and send to the Interview Team.
              </p>

              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-[#1E0404]">
                  <span>Active Evaluator:</span>
                  <span className="text-[#4277FB]">Arjun Nair</span>
                </div>
                <div className="flex items-center justify-between text-stone-600 text-[11px]">
                  <span>Features:</span>
                  <span>Full Slot CRUD + Live Sandbox + Report Submission</span>
                </div>
              </div>
            </div>

            <GritButton
              variant="blue"
              size="lg"
              icon={ArrowRight}
              onClick={() => setCurrentRole('interviewer')}
              className="w-full text-sm py-3 text-white"
            >
              Launch Interviewer Mode ➔
            </GritButton>
          </div>

          {/* Card 3: Interview Team Mode */}
          <div className="p-6 rounded-2xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow flex flex-col justify-between border-t-[10px] border-t-[#D74247] space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#D74247] border-2 border-[#1E0404] flex items-center justify-center font-bold text-white grit-shadow-sm">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <GritBadge variant="red">Page 3</GritBadge>
              </div>

              <div>
                <h3 className="font-heading font-black text-xl text-[#1E0404]">
                  Interview Team Portal
                </h3>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                Track candidate skills completion across offline contests, verify live interview bookings, record official Track Badge decisions based on interviewer reviews, and nullify badges if malpractice is flagged later per Clause 5.3.2.
              </p>

              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-[#1E0404]">
                  <span>Admissions Lead:</span>
                  <span className="text-[#D74247]">Preeti Sundaram</span>
                </div>
                <div className="flex items-center justify-between text-stone-600 text-[11px]">
                  <span>Key Action:</span>
                  <span>Send Notification Emails & Record Final Decisions</span>
                </div>
              </div>
            </div>

            <GritButton
              variant="danger"
              size="lg"
              icon={ArrowRight}
              onClick={() => setCurrentRole('interviewTeam')}
              className="w-full text-sm py-3 text-white"
            >
              Launch Interview Team Mode ➔
            </GritButton>
          </div>
        </div>

        {/* 4. Qualiflyer Leaderboard & Immersion Trip Standings Card */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#1E0404] bg-[#1E0404] text-[#FFFEF7] grit-shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-[-40px] top-[-40px] w-56 h-56 rounded-full bg-[#F4DF38]/10 pointer-events-none"></div>

          <div className="space-y-2 relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#F4DF38] flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#F4DF38]" />
                NxtWave Qualiflyer Leaderboard • Clause 5.3
              </span>
              <GritBadge variant="yellow">Global Immersion Trip Selection</GritBadge>
            </div>
            <h3 className="font-heading font-black text-2xl text-white tracking-tight">
              Qualiflyer Leaderboard & Miles Standings
            </h3>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Track participant rankings across NIAT engineering cohorts based on cumulative GRIT Contest Miles and Platform Milestones. Top ranked participants qualify for consideration for the Global Immersion Trip.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1 font-mono text-stone-300">
              <span className="flex items-center gap-1">🥇 #1: Priya Patel (3,200 Miles)</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#F4DF38]">Track Badge Deadline: 31 Dec 2026</span>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <GritButton
              variant="primary"
              size="lg"
              icon={Trophy}
              onClick={() => setCurrentRole('leaderboard')}
              className="px-6 py-3.5 text-sm"
            >
              Launch Qualiflyer Leaderboard 🏆 ➔
            </GritButton>
          </div>
        </div>
      </div>
    </div>
  );
}

