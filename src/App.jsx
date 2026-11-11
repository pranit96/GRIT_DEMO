import React from 'react';
import { GritProvider, useGrit } from './context/GritContext';
import StateSwitcherBar from './components/common/StateSwitcherBar';
import Header from './components/common/Header';
import HomePage from './components/home/HomePage';
import StudentDashboard from './components/student/StudentDashboard';
import InterviewerDashboard from './components/interviewer/InterviewerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import QualiflyerLeaderboardView from './components/qualiflyer/QualiflyerLeaderboardView';
import Footer from './components/common/Footer';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

function Toast() {
  const { toast } = useGrit();
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#10B981] text-white',
    warning: 'bg-[#F4DF38] text-[#1E0404]',
    error: 'bg-[#D74247] text-white',
    info: 'bg-[#1E0404] text-[#FFFEF7]'
  };

  const IconComp =
    toast.type === 'success'
      ? CheckCircle2
      : toast.type === 'warning'
      ? AlertTriangle
      : toast.type === 'error'
      ? XCircle
      : Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`p-4 rounded-xl grit-border grit-shadow-lg flex items-start gap-3 max-w-md ${bgStyles[toast.type]}`}>
        <IconComp className="w-5 h-5 shrink-0 mt-0.5 stroke-[2.5]" />
        <div>
          <h4 className="font-heading font-black text-sm tracking-tight">{toast.title}</h4>
          <p className="text-xs font-sans mt-0.5 leading-relaxed opacity-90">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}

function MainLayout() {
  const { currentRole } = useGrit();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEF7] text-[#1E0404] selection:bg-[#F4DF38] selection:text-[#1E0404]">
      {/* Evaluator Controls Switcher Bar */}
      <StateSwitcherBar />

      {/* Main Brand Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'home' && <HomePage />}
        {currentRole === 'student' && <StudentDashboard />}
        {currentRole === 'interviewer' && <InterviewerDashboard />}
        {(currentRole === 'interviewTeam' || currentRole === 'admin') && <AdminDashboard />}
        {currentRole === 'leaderboard' && <QualiflyerLeaderboardView />}
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <GritProvider>
      <MainLayout />
    </GritProvider>
  );
}
