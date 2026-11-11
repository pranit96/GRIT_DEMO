import React, { useState } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import { FileText, Send, CheckCircle2, AlertTriangle, XCircle, User, Star, UserX, ShieldAlert } from 'lucide-react';

export default function InterviewerReportModal({
  isOpen,
  onClose,
  slot,
  student
}) {
  const { submitInterviewerReport } = useGrit();

  const [recommendedOutcome, setRecommendedOutcome] = useState('pass');
  const [recommendedScore, setRecommendedScore] = useState(88);
  const [problemSolving, setProblemSolving] = useState(4.5);
  const [systemDesign, setSystemDesign] = useState(4.5);
  const [codeQuality, setCodeQuality] = useState(4);
  const [communication, setCommunication] = useState(5);
  const [observations, setObservations] = useState(
    'Candidate demonstrated strong algorithmic reasoning during the live coding exercise. Articulated trade-offs clearly between latency and consistency, and wrote clean modular code.'
  );
  const [strengths, setStrengths] = useState('Algorithmic clarity, system decomposition, proactive communication');
  const [areasToWatch, setAreasToWatch] = useState('Explore distributed transaction rollback patterns (Saga)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNoShowOrMalpractice = recommendedOutcome === 'no_show' || recommendedOutcome === 'malpractice';

  const handleOutcomePreset = (outcome) => {
    setRecommendedOutcome(outcome);
    if (outcome === 'pass') {
      setRecommendedScore(88);
      setProblemSolving(4.5);
      setSystemDesign(4.5);
      setCodeQuality(4);
      setCommunication(5);
      setObservations('Candidate demonstrated strong algorithmic reasoning during the live coding exercise. Articulated trade-offs clearly between latency and consistency, and wrote clean modular code.');
      setStrengths('Algorithmic clarity, system decomposition, proactive communication');
      setAreasToWatch('Explore distributed transaction rollback patterns (Saga)');
    } else if (outcome === 'retake') {
      setRecommendedScore(66);
      setProblemSolving(3);
      setSystemDesign(3.5);
      setCodeQuality(3);
      setCommunication(4);
      setObservations('Good communication and high-level architectural diagramming. However, struggled with recursive graph traversal time complexities (O(V+E) vs exponential) and state mutation bugs.');
      setStrengths('Engaging verbal articulation, high-level system diagrams');
      setAreasToWatch('Deepen knowledge of DFS/BFS cycle detection, practice React immutable state');
    } else if (outcome === 'no_show') {
      setRecommendedScore(null);
      setProblemSolving(0);
      setSystemDesign(0);
      setCodeQuality(0);
      setCommunication(0);
      setObservations('Candidate did not connect to the video meeting room. Evaluator remained in room for 15 minutes past start time with no prior notice received.');
      setStrengths('Milestone 1 completed in good standing');
      setAreasToWatch('Recommend 48-hour courtesy reschedule window before cohort forfeiture');
    } else if (outcome === 'malpractice') {
      setRecommendedScore(null);
      setProblemSolving(0);
      setSystemDesign(0);
      setCodeQuality(0);
      setCommunication(0);
      setObservations('Evaluation session terminated due to detected academic integrity violation. Automated telemetry flagged clipboard injection from unauthorized process, and candidate was observed receiving external prompting (Incident Ref: SEC-2026-904).');
      setStrengths('N/A — Evaluation invalidated for honor code violation');
      setAreasToWatch('Urgent: Academic Integrity Board hearing required');
    } else {
      setRecommendedScore(42);
      setProblemSolving(2);
      setSystemDesign(2);
      setCodeQuality(2);
      setCommunication(2.5);
      setObservations('Candidate struggled with fundamental data structures, variable scoping, and async promise handling. Recommend returning to foundational coursework before attempting re-evaluation.');
      setStrengths('Honest about knowledge gaps, positive attitude');
      setAreasToWatch('Complete Core JavaScript Algorithms module, Review Async/Await');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!student || !slot) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitInterviewerReport({
        slotId: slot.id,
        studentId: student.id,
        report: {
          recommendedOutcome,
          recommendedScore: isNoShowOrMalpractice ? null : Number(recommendedScore),
          rubric: isNoShowOrMalpractice
            ? { problemSolving: 0, systemDesign: 0, codeQuality: 0, communication: 0 }
            : {
                problemSolving,
                systemDesign,
                codeQuality,
                communication
              },
          observations,
          strengths: strengths.split(',').map(s => s.trim()).filter(Boolean),
          areasToWatch: areasToWatch.split(',').map(s => s.trim()).filter(Boolean)
        }
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  if (!isOpen || !student || !slot) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fill Out Interviewer Evaluation Report"
      subtitle={`Candidate: ${student.name} • Session Conducted by ${slot.interviewerName}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Student and Slot Header Banner */}
        <div className="p-3.5 rounded-xl border-2 border-[#1E0404] bg-[#4277FB]/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-10 h-10 rounded-xl border-2 border-[#1E0404] object-cover"
            />
            <div>
              <p className="font-heading font-black text-sm text-[#1E0404]">
                {student.name} ({student.cohort.split('—')[0].trim()})
              </p>
              <p className="text-xs text-stone-600 font-sans">
                Conducted on {slot.date} at {slot.startTime} EST • 45 Min Session
              </p>
            </div>
          </div>
          <GritBadge variant="blue">Interviewer Report</GritBadge>
        </div>

        {/* Recommended Outcome Presets */}
        <div>
          <label className="block text-xs font-heading font-black uppercase tracking-wider text-[#1E0404] mb-1.5">
            Evaluator Recommendation for Interview Team:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => handleOutcomePreset('pass')}
              className={`p-2.5 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                recommendedOutcome === 'pass'
                  ? 'border-[#1E0404] bg-[#10B981] text-white grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>PASS</span>
              <span className="text-[9px] font-normal opacity-90">Ready for Capstone</span>
            </button>

            <button
              type="button"
              onClick={() => handleOutcomePreset('retake')}
              className={`p-2.5 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                recommendedOutcome === 'retake'
                  ? 'border-[#1E0404] bg-[#F4DF38] text-[#1E0404] grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>RETAKE</span>
              <span className="text-[9px] font-normal opacity-90">7-Day Revision</span>
            </button>

            <button
              type="button"
              onClick={() => handleOutcomePreset('fail')}
              className={`p-2.5 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                recommendedOutcome === 'fail'
                  ? 'border-[#1E0404] bg-[#D74247] text-white grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>FAIL</span>
              <span className="text-[9px] font-normal opacity-90">Foundations Gaps</span>
            </button>

            <button
              type="button"
              onClick={() => handleOutcomePreset('no_show')}
              className={`p-2.5 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                recommendedOutcome === 'no_show'
                  ? 'border-[#1E0404] bg-[#1E0404] text-[#F4DF38] grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <UserX className="w-4 h-4" />
              <span>NO SHOW</span>
              <span className="text-[9px] font-normal opacity-90">Absent / Missed</span>
            </button>

            <button
              type="button"
              onClick={() => handleOutcomePreset('malpractice')}
              className={`p-2.5 rounded-xl border-2 font-heading font-black text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                recommendedOutcome === 'malpractice'
                  ? 'border-[#1E0404] bg-[#D74247] text-white grit-shadow scale-[1.02]'
                  : 'border-stone-300 bg-white text-stone-700 hover:border-[#1E0404]'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>MALPRACTICE</span>
              <span className="text-[9px] font-normal opacity-90">Flag Violation</span>
            </button>
          </div>
        </div>

        {/* Score & Rubric sliders (Omitted for No-Show and Malpractice) */}
        {isNoShowOrMalpractice ? (
          <div className="p-4 rounded-xl border-2 border-dashed border-[#1E0404] bg-[#F4DF38]/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {recommendedOutcome === 'no_show' ? (
                <UserX className="w-6 h-6 text-[#1E0404]" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-[#D74247]" />
              )}
              <div>
                <p className="font-heading font-black text-xs uppercase tracking-wider text-[#1E0404]">
                  Recommended Score: Not Applicable (N/A)
                </p>
                <p className="text-[11px] text-stone-700 font-sans mt-0.5">
                  {recommendedOutcome === 'no_show'
                    ? 'Score omitted due to candidate absence. Transferred to Interview Team to initiate 48-hour make-up slot.'
                    : 'Numerical scoring suspended due to Honor Code violation. Referred immediately to Academic Integrity Board.'}
                </p>
              </div>
            </div>
            <GritBadge variant={recommendedOutcome === 'no_show' ? 'yellow' : 'red'}>
              SCORE: N/A
            </GritBadge>
          </div>
        ) : (
          <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-[#FFFEF7] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-black uppercase tracking-wider text-[#1E0404]">
                Recommended Score
              </label>
              <span className="font-heading font-black text-lg text-[#1E0404]">
                {recommendedScore} <span className="text-xs font-normal text-stone-500">/ 100</span>
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={recommendedScore || 80}
              onChange={(e) => setRecommendedScore(Number(e.target.value))}
              className="w-full accent-[#1E0404]"
            />

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
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
                  className="w-full accent-[#4277FB]"
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
                  className="w-full accent-[#4277FB]"
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
                  className="w-full accent-[#4277FB]"
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
                  className="w-full accent-[#4277FB]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Observations & Debrief Notes */}
        <div>
          <label className="block text-xs font-heading font-black uppercase tracking-wider text-[#1E0404] mb-1">
            Interviewer Observations from Live Coding Session:
          </label>
          <textarea
            rows={3}
            required
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
            placeholder="Document candidate's problem-solving approach, edge-case coverage, and code cleanliness..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Demonstrated Strengths</label>
            <input
              type="text"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#1E0404] bg-white text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">Areas to Watch / Practice</label>
            <input
              type="text"
              value={areasToWatch}
              onChange={(e) => setAreasToWatch(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#1E0404] bg-white text-xs"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
          <GritButton variant="secondary" onClick={onClose}>
            Cancel
          </GritButton>
          <GritButton
            type="submit"
            variant="blue"
            disabled={isSubmitting}
            icon={Send}
            className="px-6"
          >
            {isSubmitting ? 'Submitting Report...' : 'Send Report to Interview Team ➔'}
          </GritButton>
        </div>
      </form>
    </Modal>
  );
}

