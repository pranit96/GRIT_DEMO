import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import {
  Award,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Star,
  Send,
  ShieldCheck,
  User,
  FileText,
  Clock,
  Sparkles,
  UserX,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecordOutcomeModal({
  isOpen,
  onClose,
  student,
  slot
}) {
  const { recordOutcome } = useGrit();

  // Look up interviewer review if present, or provide realistic defaults
  const interviewerReview = student?.interviewerReview || {
    interviewerName: slot?.interviewerName || 'Arjun Nair',
    conductedAt: '2026-11-10T16:00:00Z',
    recommendedOutcome: 'pass',
    recommendedScore: 88,
    rubric: {
      problemSolving: 4.5,
      systemDesign: 4.5,
      codeQuality: 4,
      communication: 5
    },
    observations: 'Candidate demonstrated clear architectural reasoning during the distributed system design problem. Proactively identified cache eviction edge cases and wrote clean, modular code.',
    strengths: ['Algorithmic reasoning', 'Clear system diagrams', 'Proactive trade-off discussion'],
    areasToWatch: ['Explore distributed saga rollback handling in production']
  };

  // Outcome state: 'pass' | 'retake' | 'fail' | 'no_show' | 'malpractice'
  const [outcome, setOutcome] = useState('pass');
  const [score, setScore] = useState(88);
  const [problemSolving, setProblemSolving] = useState(4.5);
  const [systemDesign, setSystemDesign] = useState(4.5);
  const [codeQuality, setCodeQuality] = useState(4);
  const [communication, setCommunication] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNoShowOrMalpractice = outcome === 'no_show' || outcome === 'malpractice';

  // Initialize from interviewer review on open
  useEffect(() => {
    if (student) {
      if (student.evaluation) {
        setOutcome(student.evaluation.outcome);
        setScore(student.evaluation.score);
        setProblemSolving(student.evaluation.rubric?.problemSolving || 4);
        setSystemDesign(student.evaluation.rubric?.systemDesign || 4);
        setCodeQuality(student.evaluation.rubric?.codeQuality || 4);
        setCommunication(student.evaluation.rubric?.communication || 4);
        setFeedback(student.evaluation.feedback || '');
        setStrengths((student.evaluation.strengths || []).join(', '));
        setImprovements((student.evaluation.improvements || []).join(', '));
      } else {
        // Default to interviewer's review
        setOutcome(interviewerReview.recommendedOutcome);
        setScore(interviewerReview.recommendedScore != null ? interviewerReview.recommendedScore : null);
        setProblemSolving(interviewerReview.rubric?.problemSolving || 0);
        setSystemDesign(interviewerReview.rubric?.systemDesign || 0);
        setCodeQuality(interviewerReview.rubric?.codeQuality || 0);
        setCommunication(interviewerReview.rubric?.communication || 0);
        setFeedback(interviewerReview.observations || '');
        setStrengths(interviewerReview.strengths?.join(', ') || '');
        setImprovements(interviewerReview.areasToWatch?.join(', ') || '');
      }
    }
  }, [student, isOpen]);

  const handleOutcomeChange = (newOutcome) => {
    setOutcome(newOutcome);
    if (newOutcome === 'pass') {
      setScore(88);
      setProblemSolving(4.5);
      setSystemDesign(4.5);
      setCodeQuality(4);
      setCommunication(5);
      setFeedback('Demonstrated clear architectural reasoning and proactive discussion of trade-offs. Solved the problem cleanly and wrote structured modular code.');
      setStrengths('System decomposition, concurrency control, clear communication');
      setImprovements('Deepen knowledge of distributed transaction sagas');
    } else if (newOutcome === 'retake') {
      setScore(66);
      setProblemSolving(3);
      setSystemDesign(3.5);
      setCodeQuality(3);
      setCommunication(4);
      setFeedback('Good high-level communication and architecture diagramming. However, struggled with recursive graph traversal time complexities (O(V+E) vs exponential) and state mutation bugs.');
      setStrengths('Engaging verbal articulation, high-level system diagrams');
      setImprovements('Practice graph traversal algorithms (DFS/BFS), state immutability in React');
    } else if (newOutcome === 'no_show') {
      setScore(null);
      setProblemSolving(0);
      setSystemDesign(0);
      setCodeQuality(0);
      setCommunication(0);
      setFeedback('Interview Absence Recorded: Candidate did not attend scheduled technical evaluation session. 1st Notice: You have 48 hours to request an authorized make-up slot before Milestone 2 forfeiture.');
      setStrengths('Eligible for one courtesy make-up evaluation');
      setImprovements('Select new slot within 48-hour grace window');
    } else if (newOutcome === 'malpractice') {
      setScore(null);
      setProblemSolving(0);
      setSystemDesign(0);
      setCodeQuality(0);
      setCommunication(0);
      setFeedback('Academic Integrity Notice: Candidate caught doing malpractice and flagged post-evaluation (Ref: SEC-2026-904). Track Badge has been nullified and all Qualiflyer Miles permanently forfeited per Clause 5.3.2.');
      setStrengths('Right to submit written appeal to integrity@grit.edu within 48 hours');
      setImprovements('Adhere strictly to GRIT Honor Code Section 4.2');
    } else {
      setScore(42);
      setProblemSolving(2);
      setSystemDesign(2);
      setCodeQuality(2);
      setCommunication(2.5);
      setFeedback('Candidate struggled with fundamental data structures, variable scoping, and asynchronous promise handling. Recommend returning to foundational Module 1 & 2 coursework before attempting re-evaluation.');
      setStrengths('Honest about knowledge gaps, positive demeanor');
      setImprovements('Complete Core JavaScript Algorithms module, Review Async/Await & Event Loop');
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!student) return;

    setIsSubmitting(true);
    setTimeout(() => {
      recordOutcome({
        studentId: student.id,
        slotId: slot ? slot.id : student.bookedSlotId,
        outcome,
        score: isNoShowOrMalpractice ? null : Number(score),
        rubric: isNoShowOrMalpractice
          ? { problemSolving: 0, systemDesign: 0, codeQuality: 0, communication: 0 }
          : {
              problemSolving,
              systemDesign,
              codeQuality,
              communication
            },
        feedback,
        strengths: strengths.split(',').map(s => s.trim()).filter(Boolean),
        improvements: improvements.split(',').map(s => s.trim()).filter(Boolean)
      });

      if (outcome === 'pass') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record & Publish Outcome (Interview Team Decision)"
      subtitle={`Student: ${student.name} • Based on Interviewer Review`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handlePublish} className="space-y-6">
        {/* Candidate & Slot Information */}
        <div className="p-3.5 rounded-xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-xl border-2 border-[#1E0404] object-cover"
            />
            <div>
              <h3 className="font-heading font-black text-sm text-[#1E0404]">
                {student.name}
              </h3>
              <p className="text-xs text-stone-600 font-sans">
                {student.email} • {student.cohort}
              </p>
            </div>
          </div>
          <GritBadge variant="dark">Admissions Review</GritBadge>
        </div>

        {/* 1. INTERVIEWER'S REVIEW & OBSERVATIONS BOX (Crucial Requirement) */}
        <div className="p-4 rounded-xl border-2 border-[#4277FB] bg-blue-50/70 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#4277FB]" />
              <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E0404]">
                Interviewer Review by: <strong>{interviewerReview.interviewerName}</strong>
              </span>
            </div>

            <GritBadge
              variant={
                interviewerReview.recommendedOutcome === 'pass'
                  ? 'green'
                  : interviewerReview.recommendedOutcome === 'retake'
                  ? 'yellow'
                  : 'red'
              }
            >
              Interviewer Recommendation: {interviewerReview.recommendedOutcome?.toUpperCase()}
              {interviewerReview.recommendedScore != null
                ? ` (${interviewerReview.recommendedScore}/100)`
                : ' (Score: N/A)'}
            </GritBadge>
          </div>

          <p className="text-xs font-sans text-stone-800 leading-relaxed italic bg-white p-3 rounded-lg border border-blue-200">
            "{interviewerReview.observations}"
          </p>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-2">
            <div>
              <strong>Strengths noted:</strong> {interviewerReview.strengths?.join(', ')}
            </div>
            <div>
              <strong>Areas to watch:</strong> {interviewerReview.areasToWatch?.join(', ')}
            </div>
          </div>
        </div>

        {/* 2. INTERVIEW TEAM FINAL OUTCOME DECISION */}
        <div className="space-y-3">
          <label className="block text-xs font-heading font-black uppercase tracking-wider text-[#1E0404]">
            Interview Team Official Outcome Decision:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {/* PASS */}
            <button
              type="button"
              onClick={() => handleOutcomeChange('pass')}
              className={`p-3 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                outcome === 'pass'
                  ? 'border-[#1E0404] bg-[#10B981] text-white grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>PASS</span>
              <span className={`text-[9px] font-normal ${outcome === 'pass' ? 'text-white/90' : 'text-stone-500'}`}>
                Earns Track Badge 🏅
              </span>
            </button>

            {/* RETAKE LATER */}
            <button
              type="button"
              onClick={() => handleOutcomeChange('retake')}
              className={`p-3 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                outcome === 'retake'
                  ? 'border-[#1E0404] bg-[#F4DF38] text-[#1E0404] grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              <span>RETAKE LATER</span>
              <span className={`text-[9px] font-normal ${outcome === 'retake' ? 'text-[#1E0404]/80' : 'text-stone-500'}`}>
                7-Day Revision
              </span>
            </button>

            {/* FAIL */}
            <button
              type="button"
              onClick={() => handleOutcomeChange('fail')}
              className={`p-3 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                outcome === 'fail'
                  ? 'border-[#1E0404] bg-[#D74247] text-white grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <XCircle className="w-4 h-4 stroke-[2.5]" />
              <span>FAIL</span>
              <span className={`text-[9px] font-normal ${outcome === 'fail' ? 'text-white/90' : 'text-stone-500'}`}>
                Foundations
              </span>
            </button>

            {/* NO SHOW */}
            <button
              type="button"
              onClick={() => handleOutcomeChange('no_show')}
              className={`p-3 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                outcome === 'no_show'
                  ? 'border-[#1E0404] bg-[#1E0404] text-[#F4DF38] grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <UserX className="w-4 h-4 stroke-[2.5]" />
              <span>NO SHOW</span>
              <span className={`text-[9px] font-normal ${outcome === 'no_show' ? 'text-[#F4DF38]/90' : 'text-stone-500'}`}>
                48h Grace Period
              </span>
            </button>

            {/* MALPRACTICE */}
            <button
              type="button"
              onClick={() => handleOutcomeChange('malpractice')}
              className={`p-3 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                outcome === 'malpractice'
                  ? 'border-[#1E0404] bg-[#D74247] text-white grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              <span>MALPRACTICE</span>
              <span className={`text-[9px] font-normal ${outcome === 'malpractice' ? 'text-white/90' : 'text-stone-500'}`}>
                Badge Nullified 🚫
              </span>
            </button>
          </div>
        </div>

        {/* CUMULATIVE SCORE & RUBRIC SLIDERS (Omitted for No-Show and Malpractice) */}
        {isNoShowOrMalpractice ? (
          <div className="p-4 rounded-xl border-2 border-dashed border-[#1E0404] bg-[#F4DF38]/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {outcome === 'no_show' ? (
                <UserX className="w-6 h-6 text-[#1E0404]" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-[#D74247]" />
              )}
              <div>
                <p className="font-heading font-black text-xs uppercase tracking-wider text-[#1E0404]">
                  Final Recorded Score: Not Applicable (N/A)
                </p>
                <p className="text-[11px] text-stone-700 font-sans mt-0.5">
                  {outcome === 'no_show'
                    ? 'Numerical score omitted due to candidate absence. 48-hour make-up reservation window granted.'
                    : 'Numerical score withheld due to Academic Dishonesty investigation (Incident SEC-2026-904).'}
                </p>
              </div>
            </div>
            <GritBadge variant={outcome === 'no_show' ? 'yellow' : 'red'}>
              SCORE: N/A
            </GritBadge>
          </div>
        ) : (
          <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-[#FFFEF7] space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-black uppercase tracking-wider text-[#1E0404]">
                Final Recorded Assessment Score
              </label>
              <div className="font-heading font-black text-xl text-[#1E0404]">
                {score} <span className="text-xs font-normal text-stone-500">/ 100</span>
              </div>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={score || 80}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1E0404]"
            />

            {/* 4 Rubric areas */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>Problem Solving</span>
                  <span>{problemSolving}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={problemSolving}
                  onChange={(e) => setProblemSolving(Number(e.target.value))}
                  className="w-full accent-[#F4DF38]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>System Design</span>
                  <span>{systemDesign}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={systemDesign}
                  onChange={(e) => setSystemDesign(Number(e.target.value))}
                  className="w-full accent-[#F4DF38]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>Code Quality</span>
                  <span>{codeQuality}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={codeQuality}
                  onChange={(e) => setCodeQuality(Number(e.target.value))}
                  className="w-full accent-[#F4DF38]"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span>Communication</span>
                  <span>{communication}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={communication}
                  onChange={(e) => setCommunication(Number(e.target.value))}
                  className="w-full accent-[#F4DF38]"
                />
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK PUBLISHED TO STUDENT DASHBOARD */}
        <div>
          <label className="block text-xs font-heading font-black uppercase tracking-wider text-[#1E0404] mb-1">
            Official Feedback Published to Student Dashboard:
          </label>
          <textarea
            rows={3}
            required
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#D74247]"
            placeholder="Feedback message that the candidate will view upon logging in..."
          />
        </div>

        {/* PRIMARY CTA */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <GritButton variant="secondary" onClick={onClose}>
            Cancel
          </GritButton>
          <GritButton
            type="submit"
            variant={outcome === 'pass' ? 'primary' : outcome === 'retake' ? 'primary' : 'danger'}
            disabled={isSubmitting}
            className="px-6"
            icon={Send}
          >
            {isSubmitting ? 'Recording & Publishing...' : 'Record Outcome & Notify Student ➔'}
          </GritButton>
        </div>
      </form>
    </Modal>
  );
}
