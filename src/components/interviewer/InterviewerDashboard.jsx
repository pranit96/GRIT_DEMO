import React, { useState } from 'react';
import { useGrit } from '../../context/GritContext';
import GritCard from '../common/GritCard';
import GritBadge from '../common/GritBadge';
import GritButton from '../common/GritButton';
import AddAvailabilityModal from './AddAvailabilityModal';
import ModifySlotModal from './ModifySlotModal';
import InterviewerReportModal from './InterviewerReportModal';
import SimulatedCallModal from '../common/SimulatedCallModal';
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  Trash2,
  Video,
  User,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  Edit3,
  Copy,
  Check,
  Search,
  FileText,
  Play,
  UserX,
  ShieldAlert
} from 'lucide-react';

export default function InterviewerDashboard() {
  const {
    currentInterviewer,
    setCurrentInterviewerId,
    interviewers,
    slots,
    students,
    deleteSlot,
    toggleSlotStatus,
    markSlotNoShow,
    flagSlotMalpractice
  } = useGrit();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [activeCallSlot, setActiveCallSlot] = useState(null);
  const [reportModalSlot, setReportModalSlot] = useState(null);

  // Filters state
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlotId, setCopiedSlotId] = useState(null);

  // Slots belonging to this interviewer
  const mySlots = slots.filter(s => s.interviewerId === currentInterviewer.id);

  // Stats
  const totalSlots = mySlots.length;
  const bookedSlots = mySlots.filter(s => s.status === 'booked');
  const availableSlots = mySlots.filter(s => s.status === 'available');
  const completedSlots = mySlots.filter(s => s.status === 'completed');
  const noShowSlots = mySlots.filter(s => s.status === 'no_show');
  const malpracticeSlots = mySlots.filter(s => s.status === 'malpractice');

  // Filter logic
  const filteredSlots = mySlots.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDate = s.date.toLowerCase().includes(q);
      const matchStudent = (s.bookedByStudentName || '').toLowerCase().includes(q);
      const matchTrack = (s.track || '').toLowerCase().includes(q);
      if (!matchDate && !matchStudent && !matchTrack) return false;
    }

    if (dateFilter !== 'all') {
      const todayStr = '2026-11-10';
      if (dateFilter === 'today' && s.date !== todayStr) return false;
      if (dateFilter === 'thisWeek') {
        const slotD = new Date(s.date);
        const startWeek = new Date('2026-11-09');
        const endWeek = new Date('2026-11-16');
        if (slotD < startWeek || slotD > endWeek) return false;
      }
      if (dateFilter === 'upcoming') {
        if (s.date < todayStr) return false;
      }
    }
    return true;
  });

  const handleCopyLink = (link, slotId) => {
    navigator.clipboard.writeText(link);
    setCopiedSlotId(slotId);
    setTimeout(() => setCopiedSlotId(null), 2000);
  };

  // Find candidate for a slot
  const getCandidateForSlot = (slot) => {
    if (!slot || !slot.bookedByStudentId) return null;
    return students.find(s => s.id === slot.bookedByStudentId) || {
      id: slot.bookedByStudentId,
      name: slot.bookedByStudentName,
      cohort: 'Cohort 4 — Full Stack Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Interviewer Welcome & Flow Header */}
      <div className="bg-[#1E0404] text-[#FFFEF7] p-6 sm:p-8 rounded-2xl grit-border grit-shadow-lg relative overflow-hidden">
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#4277FB]/15 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#FFFEF7] tracking-tight">
              Welcome, {currentInterviewer.name}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-sans">
              Set availability slots, launch live video sandbox sessions, and fill out candidate evaluation reports in real time.
            </p>
          </div>

          {/* Quick Account Switcher & Primary Action */}
          <div className="flex flex-wrap items-center gap-3">
            <GritButton
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
              className="shrink-0"
            >
              Add Availability Slots ➔
            </GritButton>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GritCard className="p-5 bg-white" accent="dark">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-stone-500 block">
            Total Slots Created
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#1E0404] my-1">
            {totalSlots}
          </div>
          <span className="text-[11px] text-stone-500">Scheduled 45-min blocks</span>
        </GritCard>

        <GritCard className="p-5 bg-white" accent="blue">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#4277FB] block">
            Booked by Candidates
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#4277FB] my-1">
            {bookedSlots.length}
          </div>
          <span className="text-[11px] text-stone-500">Upcoming live interviews</span>
        </GritCard>

        <GritCard className="p-5 bg-white" accent="yellow">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-stone-700 block">
            Open / Available
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#1E0404] my-1">
            {availableSlots.length}
          </div>
          <span className="text-[11px] text-stone-500">Ready for student booking</span>
        </GritCard>

        <GritCard className="p-5 bg-white" accent="purple">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#70449C] block">
            Completed Evaluations
          </span>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#70449C] my-1">
            {completedSlots.length}
          </div>
          <span className="text-[11px] text-stone-500">Reports sent to Interview Team</span>
        </GritCard>
      </div>

      {/* Filter and Management Bar */}
      <div className="p-5 rounded-2xl grit-border grit-shadow bg-[#FFFEF7] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-stone-600 font-sans mt-0.5">
              Manage interview slots effortlessly — add, edit, pause, or remove schedules. Launch live coding sessions and complete candidate evaluation reports in real time.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by date, student, track..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-heading font-bold text-[#1E0404] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status Filter:
            </span>

            {[
              { id: 'all', label: `All Slots (${mySlots.length})` },
              { id: 'available', label: `Open / Available (${availableSlots.length})` },
              { id: 'booked', label: `Booked by Students (${bookedSlots.length})` },
              { id: 'completed', label: `Completed (${completedSlots.length})` },
              { id: 'no_show', label: `No Show (${noShowSlots.length})` },
              { id: 'malpractice', label: `Flagged (${malpracticeSlots.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-lg font-heading font-bold text-xs transition-all border ${
                  statusFilter === tab.id
                    ? 'bg-[#1E0404] text-[#FFFEF7] border-[#1E0404]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-[#1E0404]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-stone-500 font-bold">Date Window:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-1 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-bold focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today (Nov 10)</option>
              <option value="thisWeek">This Week (Nov 9 – Nov 16)</option>
              <option value="upcoming">Upcoming Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* OPTIMIZED LIST OF SLOTS WITH FULL CRUD, LAUNCH CALL, AND FILL OUT REPORT BUTTON */}
      <div className="bg-white rounded-2xl grit-border grit-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1E0404] text-[#FFFEF7] font-heading font-bold text-xs uppercase tracking-wider border-b-2 border-[#1E0404]">
              <tr>
                <th className="py-3.5 px-4">Date & Schedule</th>
                <th className="py-3.5 px-4">Track</th>
                <th className="py-3.5 px-4">Slot Status</th>
                <th className="py-3.5 px-4">Student Candidate</th>
                <th className="py-3.5 px-4">Live Session / Room</th>
                <th className="py-3.5 px-4 text-right">Actions (CRUD & Reports)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-200">
              {filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500 font-sans">
                    No availability slots match your filters.{' '}
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="font-bold text-[#4277FB] underline ml-1"
                    >
                      Add new slots
                    </button>
                  </td>
                </tr>
              ) : (
                filteredSlots.map(slot => {
                  const isBooked = slot.status === 'booked';
                  const isAvailable = slot.status === 'available';
                  const isCompleted = slot.status === 'completed';
                  const isCancelled = slot.status === 'cancelled';
                  const isNoShow = slot.status === 'no_show';
                  const isMalpractice = slot.status === 'malpractice';
                  const candidate = getCandidateForSlot(slot);

                  const formattedDate = new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <tr
                      key={slot.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        isBooked
                          ? 'bg-blue-50/20'
                          : isCompleted
                          ? 'bg-purple-50/20'
                          : isNoShow
                          ? 'bg-amber-50/20'
                          : isMalpractice
                          ? 'bg-rose-50/20'
                          : ''
                      }`}
                    >
                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border border-[#1E0404] ${
                            isBooked
                              ? 'bg-[#4277FB] text-white'
                              : isCompleted
                              ? 'bg-[#70449C] text-white'
                              : isNoShow
                              ? 'bg-[#F4DF38] text-[#1E0404]'
                              : isMalpractice
                              ? 'bg-[#D74247] text-white'
                              : 'bg-[#F4DF38] text-[#1E0404]'
                          }`}>
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-heading font-black text-sm text-[#1E0404] block">
                              {formattedDate}
                            </span>
                            <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-500" />
                              {slot.startTime} – {slot.endTime} EST ({slot.durationMinutes}m)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Track */}
                      <td className="py-3.5 px-4">
                        <span className="font-sans font-medium text-stone-700 block">
                          {slot.track}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <GritBadge
                          variant={
                            isBooked
                              ? 'blue'
                              : isCompleted
                              ? 'purple'
                              : isNoShow
                              ? 'yellow'
                              : isMalpractice
                              ? 'red'
                              : isCancelled
                              ? 'neutral'
                              : 'yellow'
                          }
                        >
                          {isBooked
                            ? 'Booked'
                            : isCompleted
                            ? 'Completed'
                            : isNoShow
                            ? 'No Show'
                            : isMalpractice
                            ? 'Malpractice'
                            : isCancelled
                            ? 'Inactive'
                            : 'Available'}
                        </GritBadge>
                      </td>

                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        {isBooked ? (
                          <div className="space-y-0.5">
                            <span className="font-heading font-bold text-sm text-[#1E0404] flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-[#4277FB]" />
                              {slot.bookedByStudentName}
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono block">
                              Student ID: {slot.bookedByStudentId}
                            </span>
                          </div>
                        ) : isCompleted ? (
                          <div className="space-y-0.5">
                            <span className="font-heading font-bold text-xs text-stone-700">
                              {slot.bookedByStudentName || 'Conducted'}
                            </span>
                            <span className="text-[10px] text-emerald-700 block font-bold">
                              ✓ Report Sent to Team
                            </span>
                          </div>
                        ) : isNoShow ? (
                          <div className="space-y-0.5">
                            <span className="font-heading font-bold text-xs text-[#1E0404] flex items-center gap-1.5">
                              <UserX className="w-3.5 h-3.5 text-amber-600" />
                              {slot.bookedByStudentName}
                            </span>
                            <span className="text-[10px] text-amber-700 block font-bold">
                              Absent • 48h Grace Window
                            </span>
                          </div>
                        ) : isMalpractice ? (
                          <div className="space-y-0.5">
                            <span className="font-heading font-bold text-xs text-[#1E0404] flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5 text-[#D74247]" />
                              {slot.bookedByStudentName}
                            </span>
                            <span className="text-[10px] text-[#D74247] block font-bold">
                              Flagged: Academic Hold
                            </span>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">
                            Open for student booking
                          </span>
                        )}
                      </td>

                      {/* Meeting Room / Launch */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isBooked ? (
                            <button
                              onClick={() => setActiveCallSlot(slot)}
                              className="grit-btn bg-[#4277FB] text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5"
                              title="Launch live interactive sandbox interview"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Launch Interview</span>
                            </button>
                          ) : (
                            <span className="text-stone-500 text-[11px] font-mono truncate max-w-[130px] block">
                              {slot.meetingLink.replace('https://', '')}
                            </span>
                          )}

                          <button
                            onClick={() => handleCopyLink(slot.meetingLink, slot.id)}
                            className="p-1 rounded hover:bg-stone-100 text-stone-500"
                            title="Copy meeting link"
                          >
                            {copiedSlotId === slot.id ? (
                              <Check className="w-3.5 h-3.5 text-green-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Actions: Fill Out Report in front of student, Modify, Pause, Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. FILL OUT REPORT BUTTON IN FRONT OF STUDENT */}
                          {isBooked && (
                            <>
                              <button
                                onClick={() => setReportModalSlot(slot)}
                                className="px-2.5 py-1 rounded-lg border-2 border-[#1E0404] bg-[#F4DF38] text-[#1E0404] font-heading font-black text-[11px] hover:bg-[#ebd322] transition-all grit-shadow-sm flex items-center gap-1"
                                title="Fill out assessment report and send to Interview Team"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Fill Out Report 📝</span>
                              </button>

                              <button
                                onClick={() => markSlotNoShow(slot.id, slot.bookedByStudentId)}
                                className="px-2 py-1 rounded-lg border border-stone-300 hover:border-[#1E0404] bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors font-heading font-bold text-[11px] flex items-center gap-1"
                                title="Mark candidate as absent / no show"
                              >
                                <UserX className="w-3 h-3 text-amber-700" />
                                <span>No Show?</span>
                              </button>
                            </>
                          )}

                          {(isCompleted || isNoShow || isMalpractice) && (
                            <button
                              onClick={() => setReportModalSlot(slot)}
                              className="px-2 py-1 rounded-lg border border-stone-300 hover:border-[#1E0404] bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors font-heading font-bold text-[11px] flex items-center gap-1"
                              title="View or update submitted report"
                            >
                              <FileText className="w-3 h-3" />
                              <span>{isNoShow ? 'Absence Report' : isMalpractice ? 'Security Report' : 'Edit Report'}</span>
                            </button>
                          )}

                          {/* 2. MODIFY SLOT (CRUD: UPDATE) */}
                          <button
                            onClick={() => setEditingSlot(slot)}
                            className="p-1.5 rounded-lg border border-stone-300 hover:border-[#1E0404] bg-white text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1 font-heading font-bold text-[11px]"
                            title="Modify slot details (date, time, track)"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Modify</span>
                          </button>

                          {/* 3. PAUSE / ACTIVATE TOGGLE */}
                          {!isBooked && !isCompleted && !isNoShow && !isMalpractice && (
                            <button
                              onClick={() => toggleSlotStatus(slot.id)}
                              className="px-2 py-1 rounded-lg border border-stone-300 hover:border-[#1E0404] bg-white text-stone-600 hover:text-[#1E0404] transition-colors text-[11px] font-bold"
                              title="Toggle active status"
                            >
                              {isCancelled ? 'Activate' : 'Pause'}
                            </button>
                          )}

                          {/* 4. DELETE SLOT (CRUD: DELETE) */}
                          {!isBooked && !isCompleted && !isNoShow && !isMalpractice ? (
                            <button
                              onClick={() => deleteSlot(slot.id)}
                              className="p-1.5 rounded-lg border border-stone-300 hover:border-[#D74247] hover:bg-rose-50 text-stone-400 hover:text-[#D74247] transition-colors"
                              title="Delete availability slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : null}
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

      {/* CRUD: Add Availability Modal (CREATE) */}
      <AddAvailabilityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* CRUD: Modify Slot Modal (UPDATE) */}
      <ModifySlotModal
        isOpen={Boolean(editingSlot)}
        onClose={() => setEditingSlot(null)}
        slot={editingSlot}
      />

      {/* Interactive Live Interview Sandbox */}
      <SimulatedCallModal
        isOpen={Boolean(activeCallSlot)}
        onClose={() => setActiveCallSlot(null)}
        slot={activeCallSlot}
        student={getCandidateForSlot(activeCallSlot)}
        onCompleteAndReview={() => {
          setReportModalSlot(activeCallSlot);
          setActiveCallSlot(null);
        }}
      />

      {/* Fill Out Report Modal (Send to Interview Team) */}
      <InterviewerReportModal
        isOpen={Boolean(reportModalSlot)}
        onClose={() => setReportModalSlot(null)}
        slot={reportModalSlot}
        student={getCandidateForSlot(reportModalSlot)}
      />
    </div>
  );
}
