import React from 'react';
import { useGrit } from '../../context/GritContext';
import { User, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';
import GritBadge from './GritBadge';

export default function Header() {
  const {
    currentRole,
    setCurrentRole,
    currentStudent,
    currentInterviewer,
    interviewTeamUser
  } = useGrit();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFEF7] border-b-[2.5px] border-[#1E0404] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Tagline */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setCurrentRole('home')} title="Go to Platform Home">
              <img
                src="/assets/logo-dark.png"
                alt="GRIT Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="hidden sm:block pl-3 border-l-2 border-[#1E0404]">
                <span className="font-heading font-black text-xs tracking-wider uppercase block text-[#1E0404]">
                  Interview & Evaluation
                </span>
                <span className="text-[10px] text-stone-500 font-sans block">
                  NIAT Assessment Platform
                </span>
              </div>
            </div>
          </div>

          {/* Active Context Banner / Current Mode Indicator */}
          {/* <div className="hidden md:flex items-center gap-2">
            <GritBadge
              variant={
                currentRole === 'home'
                  ? 'yellow'
                  : currentRole === 'student'
                  ? 'yellow'
                  : currentRole === 'interviewer'
                  ? 'blue'
                  : 'red'
              }
              className="text-xs font-black px-3 py-1"
            >
              {currentRole === 'home' && 'Platform Home • Tri-Portal Launcher'}
              {currentRole === 'student' && 'Student Portal (Page 1)'}
              {currentRole === 'interviewer' && 'Interviewer Portal (Page 2)'}
              {currentRole === 'interviewTeam' && 'Interview Team Portal (Page 3)'}
            </GritBadge>
          </div> */}

          {/* User Profile / Context Pill */}
          <div className="flex items-center gap-3">
            {currentRole === 'home'}

            {currentRole === 'student' && (
              <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1E0404] grit-shadow-sm">
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-8 h-8 rounded-full border border-[#1E0404] object-cover"
                />
                <div className="text-left">
                  <p className="font-heading font-bold text-xs text-[#1E0404] leading-tight">
                    {currentStudent.name}
                  </p>
                  <p className="text-[10px] text-stone-600 font-sans">
                    {currentStudent.cohort.split('—')[0].trim()}
                  </p>
                </div>
              </div>
            )}

            {currentRole === 'interviewer' && (
              <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1E0404] grit-shadow-sm">
                <img
                  src={currentInterviewer.avatar}
                  alt={currentInterviewer.name}
                  className="w-8 h-8 rounded-full border border-[#1E0404] object-cover"
                />
                <div className="text-left">
                  <p className="font-heading font-bold text-xs text-[#1E0404] leading-tight">
                    {currentInterviewer.name}
                  </p>
                  <p className="text-[10px] text-[#4277FB] font-heading font-bold">
                    Lead Evaluator
                  </p>
                </div>
              </div>
            )}

            {currentRole === 'interviewTeam' && (
              <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1E0404] grit-shadow-sm">
                <img
                  src={interviewTeamUser.avatar}
                  alt={interviewTeamUser.name}
                  className="w-8 h-8 rounded-full border border-[#1E0404] object-cover"
                />
                <div className="text-left">
                  <p className="font-heading font-bold text-xs text-[#1E0404] leading-tight">
                    {interviewTeamUser.name}
                  </p>
                  <p className="text-[10px] text-[#D74247] font-heading font-bold">
                    Interview Team Lead
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
