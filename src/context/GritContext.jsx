import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_INTERVIEWERS, INITIAL_SLOTS, INITIAL_ADMIN } from '../data/initialMockData';

const GritContext = createContext(null);

const STORAGE_KEY = 'grit_niat_app_state_v10';

export function GritProvider({ children }) {
  // Load from localStorage or use initial mock data
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [interviewers, setInterviewers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_interviewers`);
      return saved ? JSON.parse(saved) : INITIAL_INTERVIEWERS;
    } catch {
      return INITIAL_INTERVIEWERS;
    }
  });

  const [slots, setSlots] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_slots`);
      return saved ? JSON.parse(saved) : INITIAL_SLOTS;
    } catch {
      return INITIAL_SLOTS;
    }
  });

  // Navigation & Role states: 'home' | 'student' | 'interviewer' | 'interviewTeam' | 'leaderboard'
  const normalizeRole = (r) => {
    if (r === 'interviewTeam' || r === 'admin' || r === 'ops') return 'interviewTeam';
    if (r === 'interviewer') return 'interviewer';
    if (r === 'student') return 'student';
    if (r === 'leaderboard') return 'leaderboard';
    return 'home';
  };

  const [currentRole, setCurrentRoleState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return normalizeRole(params.get('role'));
  });

  const setCurrentRole = (role) => {
    const normalized = normalizeRole(role);
    setCurrentRoleState(normalized);
    const url = new URL(window.location);
    if (normalized === 'home') {
      url.searchParams.delete('role');
    } else {
      url.searchParams.set('role', normalized);
    }
    window.history.replaceState({}, '', url);
  };

  const [currentStudentId, setCurrentStudentIdState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const sId = params.get('student');
    return sId && sId.startsWith('std-') ? sId : 'std-1';
  });

  const setCurrentStudentId = (id) => {
    setCurrentStudentIdState(id);
    const url = new URL(window.location);
    if (id === 'std-1') {
      url.searchParams.delete('student');
    } else {
      url.searchParams.set('student', id);
    }
    window.history.replaceState({}, '', url);
  };

  const [currentInterviewerId, setCurrentInterviewerId] = useState('int-1'); // Arjun Nair

  // Evaluator quick toggle for Student "Before / After Result" states:
  // 'auto' | 'ineligible' | 'unbooked' | 'booked' | 'completed' | 'passed' | 'retake' | 'failed' | 'no_show' | 'malpractice'
  const [studentStateOverride, setStudentStateOverrideState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('state');
    return s && ['auto', 'ineligible', 'unbooked', 'booked', 'completed', 'passed', 'retake', 'failed', 'no_show', 'malpractice'].includes(s) ? s : 'auto';
  });

  const setStudentStateOverride = (stateVal) => {
    setStudentStateOverrideState(stateVal);
    const url = new URL(window.location);
    if (stateVal === 'auto') {
      url.searchParams.delete('state');
    } else {
      url.searchParams.set('state', stateVal);
    }
    window.history.replaceState({}, '', url);
  };

  // Notification toast state
  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_interviewers`, JSON.stringify(interviewers));
      localStorage.setItem(`${STORAGE_KEY}_slots`, JSON.stringify(slots));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [students, interviewers, slots]);

  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Student Actions
  const bookSlot = (studentId, slotId) => {
    const student = students.find(s => s.id === studentId);
    const slot = slots.find(s => s.id === slotId);
    if (!student || !slot) return false;

    if (student.eligibilityStatus === 'Ineligible' || student.bookingStatus === 'ineligible' || student.allSkillsCleared === false) {
      showToast(
        'Live Interview Locked 🔒',
        `You have only cleared ${student.clearedSkillsCount || 2} of ${student.totalSkillsRequired || 5} required skills for the ${student.trackBadgeName || 'Track Badge'}. Please clear all skills first.`,
        'warning'
      );
      return false;
    }

    // Update slot
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          status: 'booked',
          bookedByStudentId: student.id,
          bookedByStudentName: student.name
        };
      }
      return s;
    }));

    // Update student
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          bookingStatus: 'booked',
          bookedSlotId: slotId,
          milestones: {
            ...s.milestones,
            interview: 'booked'
          }
        };
      }
      return s;
    }));

    // Update interviewer count
    setInterviewers(prev => prev.map(inv => {
      if (inv.id === slot.interviewerId) {
        return {
          ...inv,
          bookedSlots: inv.bookedSlots + 1
        };
      }
      return inv;
    }));

    showToast(
      'Slot Confirmed! 🚀',
      `Your interview is confirmed with ${slot.interviewerName} on ${slot.date} at ${slot.startTime}.`,
      'success'
    );
    return true;
  };

  const cancelSlotBooking = (studentId, slotId) => {
    const slot = slots.find(s => s.id === slotId);

    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          status: 'available',
          bookedByStudentId: null,
          bookedByStudentName: null
        };
      }
      return s;
    }));

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          bookingStatus: 'unbooked',
          bookedSlotId: null,
          milestones: {
            ...s.milestones,
            interview: 'pending'
          }
        };
      }
      return s;
    }));

    if (slot) {
      setInterviewers(prev => prev.map(inv => {
        if (inv.id === slot.interviewerId) {
          return {
            ...inv,
            bookedSlots: Math.max(0, inv.bookedSlots - 1)
          };
        }
        return inv;
      }));
    }

    showToast('Booking Cancelled', 'Your interview slot was released and is open again.', 'warning');
  };

  // Interviewer Actions
  const addAvailabilitySlot = ({ interviewerId, date, startTime, endTime, track }) => {
    const inv = interviewers.find(i => i.id === interviewerId);
    const newSlotId = `slot-${Date.now()}`;
    const newSlot = {
      id: newSlotId,
      interviewerId,
      interviewerName: inv ? inv.name : 'Interviewer',
      date,
      startTime,
      endTime,
      durationMinutes: 45,
      status: 'available',
      bookedByStudentId: null,
      bookedByStudentName: null,
      meetingLink: `https://meet.grit.edu/eval-${newSlotId}`,
      track: track || 'Full Stack Engineering'
    };

    setSlots(prev => [newSlot, ...prev]);
    setInterviewers(prev => prev.map(i => {
      if (i.id === interviewerId) {
        return { ...i, totalSlots: i.totalSlots + 1 };
      }
      return i;
    }));

    showToast('Availability Added', `New slot created for ${date} at ${startTime}.`, 'success');
    return newSlot;
  };

  const deleteSlot = (slotId) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || slot.status === 'booked') {
      showToast('Cannot Delete', 'Booked slots cannot be deleted directly.', 'error');
      return false;
    }

    setSlots(prev => prev.filter(s => s.id !== slotId));
    setInterviewers(prev => prev.map(i => {
      if (i.id === slot.interviewerId) {
        return { ...i, totalSlots: Math.max(0, i.totalSlots - 1) };
      }
      return i;
    }));

    showToast('Slot Removed', 'Availability slot deleted successfully.', 'info');
    return true;
  };

  const modifySlot = (slotId, updatedFields) => {
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, ...updatedFields };
      }
      return s;
    }));
    showToast('Slot Modified ✓', 'Availability slot updated successfully.', 'success');
  };

  const toggleSlotStatus = (slotId) => {
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        const nextStatus = s.status === 'available' ? 'cancelled' : 'available';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  // Interviewer Submits Report to Interview Team
  const submitInterviewerReport = ({ slotId, studentId, report }) => {
    const student = students.find(s => s.id === studentId);
    const slot = slots.find(s => s.id === slotId);

    // Update slot status to completed
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          status: 'completed'
        };
      }
      return s;
    }));

    // Update student with interviewerReview and status = 'completed'
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          bookingStatus: 'completed',
          interviewerReview: {
            interviewerId: slot ? slot.interviewerId : 'int-1',
            interviewerName: slot ? slot.interviewerName : 'Arjun Nair',
            conductedAt: new Date().toISOString(),
            recommendedOutcome: report.recommendedOutcome,
            recommendedScore: report.recommendedScore,
            rubric: report.rubric,
            observations: report.observations,
            strengths: report.strengths,
            areasToWatch: report.areasToWatch
          },
          milestones: {
            ...s.milestones,
            interview: 'completed'
          }
        };
      }
      return s;
    }));

    showToast(
      'Interviewer Report Sent 📢',
      `Assessment for ${student ? student.name : 'Candidate'} sent to the Interview Team for final outcome decision.`,
      'success'
    );
  };

  // Interview Team / Admin Actions
  const recordOutcome = ({
    studentId,
    slotId,
    outcome, // 'pass' | 'retake' | 'fail'
    score,
    rubric,
    feedback,
    strengths,
    improvements
  }) => {
    const student = students.find(s => s.id === studentId);
    const currentAdmin = INITIAL_ADMIN;

    const isNullScoreOutcome = outcome === 'no_show' || outcome === 'malpractice' || score === null;
    const certId = outcome === 'pass' ? `NIAT-FSE-2026-${Math.floor(1000 + Math.random() * 9000)}` : null;
    const evaluationObj = {
      outcome,
      score: isNullScoreOutcome ? null : Number(score),
      maxScore: 100,
      badgeAwarded: outcome === 'pass',
      badgeCertificateId: certId,
      badgeName: student?.trackBadgeName || 'Full Stack Engineering Track Badge',
      evaluatedAt: new Date().toISOString(),
      evaluatorId: currentAdmin.id,
      evaluatorName: currentAdmin.name,
      rubric: rubric || {
        problemSolving: 4,
        systemDesign: 4,
        codeQuality: 4,
        communication: 4
      },
      feedback,
      strengths: strengths || ['Good code clarity'],
      improvements: improvements || ['Practice advanced algorithmic edge cases']
    };

    // Update student
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        let interviewMilestone = 'passed';
        let capstoneMilestone = 'locked';
        let badgeStatus = s.trackBadgeStatus || 'pending_interview';
        let qualiflyerUpdate = s.qualiflyer;

        if (outcome === 'pass') {
          interviewMilestone = 'passed';
          capstoneMilestone = 'unlocked';
          badgeStatus = 'earned';
          if (qualiflyerUpdate) {
            qualiflyerUpdate = {
              ...qualiflyerUpdate,
              trackBadge: {
                ...qualiflyerUpdate.trackBadge,
                status: 'earned',
                earnedAt: new Date().toISOString().split('T')[0]
              },
              immersionTripEligibility: 'Qualified (Immersion Trip Contender)'
            };
          }
        } else if (outcome === 'retake') {
          interviewMilestone = 'retake';
          capstoneMilestone = 'locked';
          badgeStatus = 'retake_required';
        } else if (outcome === 'no_show') {
          interviewMilestone = 'no_show';
          capstoneMilestone = 'locked';
          badgeStatus = 'no_show_hold';
        } else if (outcome === 'malpractice') {
          interviewMilestone = 'malpractice';
          capstoneMilestone = 'locked';
          badgeStatus = 'nullified';
          if (qualiflyerUpdate) {
            qualiflyerUpdate = {
              ...qualiflyerUpdate,
              totalMiles: 0,
              rank: 'DQ',
              isDisqualified: true,
              disqualificationReason: 'Candidate caught doing malpractice and flagged post-evaluation. Track Badge nullified and Miles forfeited per Clause 5.3.2.',
              immersionTripEligibility: 'Disqualified (Badge Nullified & Miles Forfeited)'
            };
          }
        } else {
          interviewMilestone = 'failed';
          capstoneMilestone = 'locked';
          badgeStatus = 'failed';
        }

        return {
          ...s,
          bookingStatus: 'evaluated',
          trackBadgeStatus: badgeStatus,
          trackBadgeNotice: outcome === 'malpractice'
            ? 'Track Badge Nullified & Revoked: Candidate was caught doing malpractice and flagged later. All earned credentials, Miles, and Immersion Trip entitlements have been permanently nullified.'
            : s.trackBadgeNotice,
          evaluation: evaluationObj,
          milestones: {
            ...s.milestones,
            interview: interviewMilestone,
            capstone: capstoneMilestone
          },
          qualiflyer: qualiflyerUpdate
        };
      }
      return s;
    }));

    // Update slot
    if (slotId) {
      setSlots(prev => prev.map(s => {
        if (s.id === slotId) {
          return {
            ...s,
            status: outcome === 'no_show' ? 'no_show' : outcome === 'malpractice' ? 'malpractice' : 'completed'
          };
        }
        return s;
      }));
    }

    showToast(
      'Outcome Recorded & Published! 📢',
      `Result [${outcome.toUpperCase()}] published for ${student ? student.name : 'Student'}. Student dashboard updated.`,
      outcome === 'pass' ? 'success' : outcome === 'retake' || outcome === 'no_show' ? 'warning' : 'error'
    );
  };

  // Quick Action: Mark No Show (Absent)
  const markSlotNoShow = (slotId, studentId) => {
    const student = students.find(s => s.id === studentId);
    const slot = slots.find(s => s.id === slotId);

    const evaluationObj = {
      outcome: 'no_show',
      score: null,
      maxScore: 100,
      evaluatedAt: new Date().toISOString(),
      evaluatorId: slot?.interviewerId || 'int-1',
      evaluatorName: slot?.interviewerName || 'Arjun Nair',
      rubric: { problemSolving: 0, systemDesign: 0, codeQuality: 0, communication: 0 },
      feedback: 'Interview Absence Recorded: Candidate did not attend scheduled technical evaluation session with Arjun Nair. 1st Notice: You have 48 hours to request an authorized make-up slot before Milestone 2 forfeiture.',
      reason: 'Unexcused Absence / Failure to Connect',
      gracePeriodDeadline: '48 Hours from Notice',
      canReschedule: true,
      strengths: ['Eligible for one courtesy make-up evaluation'],
      improvements: ['Select new slot within 48-hour grace window']
    };

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          bookingStatus: 'evaluated',
          evaluation: evaluationObj,
          milestones: { ...s.milestones, interview: 'no_show', capstone: 'locked' }
        };
      }
      return s;
    }));

    if (slotId) {
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'no_show' } : s));
    }

    showToast(
      'Candidate Marked as No Show 🚫',
      `${student ? student.name : 'Candidate'} marked absent. 48-hour reschedule window activated.`,
      'warning'
    );
  };

  // Quick Action: Flag Malpractice
  const flagSlotMalpractice = (slotId, studentId, notes) => {
    const student = students.find(s => s.id === studentId);
    const slot = slots.find(s => s.id === slotId);

    const evaluationObj = {
      outcome: 'malpractice',
      score: null,
      maxScore: 100,
      evaluatedAt: new Date().toISOString(),
      evaluatorId: slot?.interviewerId || 'int-1',
      evaluatorName: slot?.interviewerName || 'Arjun Nair',
      rubric: { problemSolving: 0, systemDesign: 0, codeQuality: 0, communication: 0 },
      feedback: notes || 'Academic Integrity Board Action: Evaluation invalidated due to detected unauthorized external assistance during the live coding component (Incident Ref: SEC-2026-904).',
      incidentRef: 'SEC-2026-904',
      violationType: 'Unauthorized External Assistance / Code Injection',
      evidence: 'Automated IDE telemetry detected paste stream from non-whitelisted external process and audio feed registered secondary prompter.',
      appealDeadline: '48 Hours from Notice',
      hearingDate: 'Nov 18, 2026',
      strengths: ['Right to submit written appeal to integrity@grit.edu within 48 hours'],
      improvements: ['Adhere strictly to GRIT Honor Code Section 4.2']
    };

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          bookingStatus: 'evaluated',
          trackBadgeStatus: 'nullified',
          trackBadgeNotice: 'Track Badge Nullified: Flagged for malpractice. Progression and credentials revoked.',
          evaluation: evaluationObj,
          milestones: { ...s.milestones, interview: 'malpractice', capstone: 'locked' },
          qualiflyer: s.qualiflyer ? {
            ...s.qualiflyer,
            totalMiles: 0,
            rank: 'DQ',
            isDisqualified: true,
            disqualificationReason: 'Flagged for malpractice per Clause 5.3.2. All Miles and Track Badges nullified.',
            immersionTripEligibility: 'Disqualified (Badge Nullified & Miles Forfeited)'
          } : undefined
        };
      }
      return s;
    }));

    if (slotId) {
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'malpractice' } : s));
    }

    showToast(
      'Flagged for Malpractice 🚨',
      `${student ? student.name : 'Candidate'} evaluation flagged. Track Badge nullified and submitted to Academic Integrity Board.`,
      'error'
    );
  };

  // Dedicated Action: Post-Audit Nullify Badge (e.g. if caught doing malpractice and flagged later)
  const nullifyStudentBadge = (studentId, reason = 'Caught doing malpractice and flagged post-evaluation audit.') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          bookingStatus: 'evaluated',
          trackBadgeStatus: 'nullified',
          clearedSkillsCount: 0,
          allSkillsCleared: false,
          eligibilityStatus: 'Ineligible',
          trackBadgeNotice: `Track Badge Nullified & Revoked: Candidate was caught doing malpractice and flagged later (${reason}). All earned credentials, Qualiflyer Miles, and Immersion Trip entitlements have been permanently nullified.`,
          evaluation: {
            outcome: 'malpractice',
            score: null,
            maxScore: 100,
            evaluatedAt: new Date().toISOString(),
            evaluatorId: 'team-1',
            evaluatorName: 'Academic Integrity Committee',
            feedback: `Track Badge Nullified: ${reason}`,
            incidentRef: `SEC-2026-${Math.floor(100 + Math.random() * 900)}`,
            violationType: 'Honor Code Violation / Post-Audit Malpractice Flag'
          },
          milestones: {
            ...s.milestones,
            interview: 'malpractice',
            capstone: 'locked',
            placement: 'locked'
          },
          qualiflyer: s.qualiflyer ? {
            ...s.qualiflyer,
            totalMiles: 0,
            rank: 'DQ',
            isDisqualified: true,
            disqualificationReason: `Track Badge Nullified per Clause 5.3.2 & 5.3.5: ${reason}`,
            immersionTripEligibility: 'Disqualified (Badge Nullified & Miles Forfeited)'
          } : undefined
        };
      }
      return s;
    }));

    showToast(
      'Track Badge Nullified 🚫',
      `${student.name}'s Track Badge has been nullified and Qualiflyer Miles revoked due to flagged malpractice.`,
      'error'
    );
  };

  const sendReminders = (studentIds) => {
    showToast(
      'Reminders Dispatched 📨',
      `Booking reminders sent to ${studentIds.length} candidate(s) via email and dashboard alerts.`,
      'info'
    );
  };

  const sendStudentNotificationEmail = (studentId, customNote = '') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const now = new Date().toISOString();
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          notificationEmailSentAt: now
        };
      }
      return s;
    }));

    showToast(
      'Notification Email Sent ✉️',
      `Booking notification dispatched to ${student.name} (${student.email}).`,
      'success'
    );
  };

  const sendBulkNotificationEmails = (studentIds, customNote = '') => {
    const now = new Date().toISOString();
    setStudents(prev => prev.map(s => {
      if (studentIds.includes(s.id)) {
        return {
          ...s,
          notificationEmailSentAt: now
        };
      }
      return s;
    }));

    showToast(
      'Notification Emails Dispatched ✉️',
      `Booking reminders sent to ${studentIds.length} candidate(s).`,
      'success'
    );
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_interviewers`);
    localStorage.removeItem(`${STORAGE_KEY}_slots`);
    setStudents(INITIAL_STUDENTS);
    setInterviewers(INITIAL_INTERVIEWERS);
    setSlots(INITIAL_SLOTS);
    setStudentStateOverride('auto');
    showToast('State Reset', 'Mock database restored to initial clean benchmark.', 'info');
  };

  // Helper: Get active student with override if set
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];
  const currentInterviewer = interviewers.find(i => i.id === currentInterviewerId) || interviewers[0];

  // Compute effective student state based on override
  let effectiveStudent = { ...currentStudent };
  if (studentStateOverride !== 'auto') {
    if (studentStateOverride === 'ineligible') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Ineligible',
        bookingStatus: 'ineligible',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'skills_in_progress',
        clearedSkillsCount: 2,
        totalSkillsRequired: 5,
        allSkillsCleared: false,
        bookedSlotId: null,
        interviewerReview: null,
        evaluation: null,
        deadlineDaysRemaining: null,
        milestones: {
          skills: 'in_progress',
          interview: 'locked',
          badge: 'locked',
          capstone: 'locked'
        }
      };
    } else if (studentStateOverride === 'unbooked') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Eligible',
        bookingStatus: 'unbooked',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'ready_for_interview',
        clearedSkillsCount: 5,
        totalSkillsRequired: 5,
        allSkillsCleared: true,
        bookedSlotId: null,
        interviewerReview: null,
        evaluation: null,
        deadlineDaysRemaining: 5,
        milestones: { ...effectiveStudent.milestones, skills: 'completed', interview: 'pending', badge: 'pending', capstone: 'locked' }
      };
    } else if (studentStateOverride === 'booked') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Eligible',
        bookingStatus: 'booked',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'interview_booked',
        clearedSkillsCount: 5,
        totalSkillsRequired: 5,
        allSkillsCleared: true,
        bookedSlotId: 'slot-102',
        interviewerReview: null,
        evaluation: null,
        milestones: { ...effectiveStudent.milestones, skills: 'completed', interview: 'booked', badge: 'pending', capstone: 'locked' }
      };
    } else if (studentStateOverride === 'completed') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Eligible',
        bookingStatus: 'completed',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'interview_completed',
        clearedSkillsCount: 5,
        totalSkillsRequired: 5,
        allSkillsCleared: true,
        bookedSlotId: 'slot-104',
        interviewerReview: {
          interviewerId: 'int-1',
          interviewerName: 'Arjun Nair',
          conductedAt: '2026-11-10T16:45:00Z',
          recommendedOutcome: 'pass',
          recommendedScore: 90,
          rubric: { problemSolving: 4.5, systemDesign: 5, codeQuality: 4, communication: 4.5 },
          observations: 'Demonstrated outstanding clarity during the system design challenge. Proactively discussed concurrency and cache trade-offs. Recommended to award Track Badge.',
          strengths: ['System scalability intuition', 'Concurrency & caching knowledge'],
          areasToWatch: ['Explore automated Canary deployment rollback patterns']
        },
        evaluation: null,
        milestones: { ...effectiveStudent.milestones, skills: 'completed', interview: 'completed', badge: 'pending_review', capstone: 'locked' }
      };
    } else if (studentStateOverride === 'passed') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Eligible',
        bookingStatus: 'evaluated',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'earned',
        clearedSkillsCount: 5,
        totalSkillsRequired: 5,
        allSkillsCleared: true,
        bookedSlotId: 'slot-101',
        evaluation: {
          outcome: 'pass',
          score: 92,
          maxScore: 100,
          badgeAwarded: true,
          badgeName: 'Full Stack Engineering Track Badge',
          badgeCertificateId: 'NIAT-FSE-2026-0891',
          evaluatedAt: '2026-11-10T14:30:00Z',
          evaluatorId: 'team-1',
          evaluatorName: 'Preeti Sundaram',
          rubric: { problemSolving: 5, systemDesign: 4.5, codeQuality: 4.5, communication: 5 },
          feedback: 'Exceptional performance across all 5 skills. Cleanly articulated distributed concurrency trade-offs and reactive architecture. Track Badge officially earned and verified!',
          strengths: ['High-level architectural partitioning', 'Clean REST/gRPC boundary modeling', 'Proactive communication'],
          improvements: ['Consider deeper exploration of distributed transaction compensation sagas']
        },
        milestones: { ...effectiveStudent.milestones, skills: 'completed', interview: 'passed', badge: 'earned', capstone: 'unlocked' }
      };
    } else if (studentStateOverride === 'retake') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Eligible',
        bookingStatus: 'evaluated',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'retake_required',
        clearedSkillsCount: 5,
        totalSkillsRequired: 5,
        allSkillsCleared: true,
        bookedSlotId: 'slot-103',
        evaluation: {
          outcome: 'retake',
          score: 64,
          maxScore: 100,
          badgeAwarded: false,
          evaluatedAt: '2026-11-10T11:00:00Z',
          evaluatorId: 'team-1',
          evaluatorName: 'Preeti Sundaram',
          rubric: { problemSolving: 3, systemDesign: 3.5, codeQuality: 3, communication: 4 },
          feedback: 'Good high-level communication and architectural intuition. Retake recommended in 7 days to earn the Track Badge.',
          strengths: ['Engaging verbal communication', 'Good high-level system diagrams'],
          improvements: ['Deepen knowledge of DFS/BFS cycle detection', 'Practice immutable state patterns in React']
        },
        milestones: { ...effectiveStudent.milestones, skills: 'completed', interview: 'retake', badge: 'pending_retake', capstone: 'locked' }
      };
    } else if (studentStateOverride === 'failed') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Eligible',
        bookingStatus: 'evaluated',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'failed',
        clearedSkillsCount: 5,
        totalSkillsRequired: 5,
        allSkillsCleared: true,
        bookedSlotId: 'slot-204',
        evaluation: {
          outcome: 'fail',
          score: 42,
          maxScore: 100,
          badgeAwarded: false,
          evaluatedAt: '2026-11-07T11:00:00Z',
          evaluatorId: 'team-1',
          evaluatorName: 'Preeti Sundaram',
          rubric: { problemSolving: 2, systemDesign: 2, codeQuality: 2, communication: 2.5 },
          feedback: 'Candidate struggled with fundamental data structures and async concurrency patterns. Recommend reviewing skill contests before reattempting.',
          strengths: ['Honest about knowledge gaps', 'Positive demeanor'],
          improvements: ['Review core algorithms', 'Async/Await & Event Loop fundamentals']
        },
        milestones: { ...effectiveStudent.milestones, skills: 'completed', interview: 'failed', badge: 'locked', capstone: 'locked' }
      };
    } else if (studentStateOverride === 'no_show') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Eligible',
        bookingStatus: 'evaluated',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'no_show_hold',
        clearedSkillsCount: 5,
        totalSkillsRequired: 5,
        allSkillsCleared: true,
        bookedSlotId: 'slot-107',
        evaluation: {
          outcome: 'no_show',
          score: null,
          maxScore: 100,
          badgeAwarded: false,
          evaluatedAt: '2026-11-09T15:00:00Z',
          evaluatorId: 'team-1',
          evaluatorName: 'Preeti Sundaram',
          rubric: { problemSolving: 0, systemDesign: 0, codeQuality: 0, communication: 0 },
          feedback: 'Interview Absence Recorded: Candidate did not attend scheduled technical evaluation session with Arjun Nair. 1st Notice: You have 48 hours to request an authorized make-up slot before Track Badge interview forfeiture.',
          reason: 'Unexcused Absence / Failure to Connect',
          incidentRef: 'ABS-2026-109',
          gracePeriodDeadline: 'Thursday, Nov 12 at 5:00 PM EST',
          canReschedule: true,
          strengths: ['Eligible for one courtesy make-up evaluation'],
          improvements: ['Select new slot within 48-hour grace window']
        },
        milestones: { ...effectiveStudent.milestones, skills: 'completed', interview: 'no_show', badge: 'on_hold', capstone: 'locked' }
      };
    } else if (studentStateOverride === 'malpractice') {
      effectiveStudent = {
        ...effectiveStudent,
        eligibilityStatus: 'Ineligible',
        bookingStatus: 'evaluated',
        bookedSlotId: 'slot-108',
        trackBadgeName: 'Full Stack Engineering Track Badge',
        trackBadgeStatus: 'nullified',
        clearedSkillsCount: 0,
        totalSkillsRequired: 5,
        allSkillsCleared: false,
        trackBadgeNotice: 'Track Badge Nullified & Revoked: Candidate was caught doing malpractice and flagged later (Ref: SEC-2026-904). All earned credentials, Miles, and Immersion Trip entitlements have been permanently nullified.',
        evaluation: {
          outcome: 'malpractice',
          score: null,
          maxScore: 100,
          badgeAwarded: false,
          evaluatedAt: '2026-11-08T18:00:00Z',
          evaluatorId: 'team-1',
          evaluatorName: 'Preeti Sundaram',
          rubric: { problemSolving: 0, systemDesign: 0, codeQuality: 0, communication: 0 },
          feedback: 'Academic Integrity Board Action: Evaluation invalidated due to detected unauthorized external assistance and proscribed tool injection during the live coding component (Incident Ref: SEC-2026-904). Candidate placed on academic hold. Track Badge has been nullified.',
          incidentRef: 'SEC-2026-904',
          violationType: 'Unauthorized External Assistance / Code Injection',
          evidence: 'Automated IDE telemetry detected paste stream from non-whitelisted external process and audio feed registered secondary prompter.',
          appealDeadline: '48 Hours from Notice',
          hearingDate: 'Nov 18, 2026',
          strengths: ['Right to submit written appeal to integrity@grit.edu within 48 hours'],
          improvements: ['Adhere strictly to GRIT Honor Code Section 4.2']
        },
        milestones: { skills: 'locked', interview: 'malpractice', badge: 'revoked', capstone: 'locked' },
        qualiflyer: effectiveStudent.qualiflyer ? {
          ...effectiveStudent.qualiflyer,
          totalMiles: 0,
          rank: 'DQ',
          isDisqualified: true,
          disqualificationReason: 'Disqualified per Clause 5.3.2. Track Badge nullified and Miles forfeited.',
          immersionTripEligibility: 'Disqualified (Badge Nullified)'
        } : undefined
      };
    }
  }

  return (
    <GritContext.Provider
      value={{
        students,
        setStudents,
        interviewers,
        slots,
        currentRole,
        setCurrentRole,
        currentStudentId,
        setCurrentStudentId,
        currentInterviewerId,
        setCurrentInterviewerId,
        currentStudent: effectiveStudent,
        currentInterviewer,
        studentStateOverride,
        setStudentStateOverride,
        toast,
        showToast,
        bookSlot,
        cancelSlotBooking,
        addAvailabilitySlot,
        deleteSlot,
        toggleSlotStatus,
        recordOutcome,
        markSlotNoShow,
        flagSlotMalpractice,
        nullifyStudentBadge,
        sendReminders,
        modifySlot,
        submitInterviewerReport,
        sendStudentNotificationEmail,
        sendBulkNotificationEmails,
        resetAllData,
        interviewTeamUser: INITIAL_ADMIN,
        adminUser: INITIAL_ADMIN
      }}
    >
      {children}
    </GritContext.Provider>
  );
}

export function useGrit() {
  const context = useContext(GritContext);
  if (!context) {
    throw new Error('useGrit must be used within a GritProvider');
  }
  return context;
}
