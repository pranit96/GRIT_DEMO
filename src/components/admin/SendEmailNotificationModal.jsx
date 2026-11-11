import React, { useState } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import { Mail, Send, CheckCircle2, User, Clock, AlertTriangle } from 'lucide-react';

export default function SendEmailNotificationModal({
  isOpen,
  onClose,
  targetStudent = null, // if null, sends to all unbooked students
  unbookedStudents = []
}) {
  const { sendStudentNotificationEmail, sendBulkNotificationEmails } = useGrit();

  const isSingle = Boolean(targetStudent);
  const recipients = isSingle ? [targetStudent] : unbookedStudents;

  const [subject, setSubject] = useState(
    '[Action Required] Book your Milestone 2 Technical Evaluation Slot — GRIT'
  );
  const [customNote, setCustomNote] = useState(
    'Please schedule your 45-minute technical evaluation slot with a GRIT lead evaluator this week to maintain cohort progression into the Capstone Apprenticeship.'
  );
  const [isSending, setIsSending] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      if (isSingle) {
        sendStudentNotificationEmail(targetStudent.id, customNote);
      } else {
        sendBulkNotificationEmails(recipients.map(s => s.id), customNote);
      }
      setIsSending(false);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSingle ? `Send Notification Email to ${targetStudent.name}` : `Send Notification Email to ${recipients.length} Unbooked Candidates`}
      subtitle="Interview Team • Candidate Booking Nudge"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSend} className="space-y-4">
        {/* Recipient summary */}
        <div className="p-3.5 rounded-xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D74247] text-white flex items-center justify-center font-bold">
              <Mail className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-[#1E0404] block">
                {isSingle ? targetStudent.name : `${recipients.length} Eligible Unbooked Candidates`}
              </span>
              <span className="text-xs text-stone-600 font-mono">
                {isSingle ? targetStudent.email : recipients.map(s => s.email).slice(0, 2).join(', ') + (recipients.length > 2 ? ` +${recipients.length - 2} more` : '')}
              </span>
            </div>
          </div>
          <GritBadge variant="red">Action Required</GritBadge>
        </div>

        {/* Email Subject */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1">
            Email Subject Line
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D74247]"
          />
        </div>

        {/* Custom Body Note */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1">
            Message Body / Instructions
          </label>
          <textarea
            rows={4}
            required
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#D74247]"
          />
        </div>

        {/* Email Preview Box */}
        <div className="p-3.5 rounded-xl border border-stone-300 bg-stone-50 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-heading font-bold text-stone-700">
            <Clock className="w-3.5 h-3.5" />
            <span>Email Template Preview:</span>
          </div>
          <div className="p-3 rounded-lg border border-stone-200 bg-white space-y-1 font-sans text-stone-700">
            <p className="font-bold text-[#1E0404]">From: admissions@grit.edu</p>
            <p className="text-stone-600">
              "Hi {isSingle ? targetStudent.name : '[Student Name]'}, you have successfully qualified for the Milestone 2 Technical Evaluation. {customNote}"
            </p>
            <div className="pt-2">
              <span className="font-heading font-bold text-[11px] px-3 py-1 bg-[#F4DF38] text-[#1E0404] rounded-md border border-[#1E0404] inline-block">
                [ Schedule Your 45-Min Interview Slot ➔ ]
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
          <GritButton variant="secondary" onClick={onClose}>
            Cancel
          </GritButton>
          <GritButton
            type="submit"
            variant="danger"
            disabled={isSending}
            icon={Send}
            className="px-6"
          >
            {isSending ? 'Sending Email...' : isSingle ? 'Send Notification Email ➔' : `Send to ${recipients.length} Candidates ➔`}
          </GritButton>
        </div>
      </form>
    </Modal>
  );
}

