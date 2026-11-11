import React, { useState } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import { Bell, Send, CheckCircle2, Mail, AlertTriangle } from 'lucide-react';

export default function BulkReminderModal({ isOpen, onClose, unbookedStudents }) {
  const { sendReminders } = useGrit();
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      sendReminders(unbookedStudents.map(s => s.id));
      setIsSending(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dispatch Milestone 2 Booking Reminders"
      subtitle={`Targeting ${unbookedStudents.length} eligible students who have not yet scheduled an interview`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-[#F4DF38]/20 flex items-center gap-3">
          <Bell className="w-8 h-8 text-[#1E0404] shrink-0" />
          <div className="text-xs">
            <p className="font-heading font-black text-sm text-[#1E0404]">
              Cohort Action: Automated Multi-Channel Nudge
            </p>
            <p className="text-stone-700 mt-0.5">
              This will send high-priority email alerts and pin an action-required banner to the dashboard of every candidate listed below.
            </p>
          </div>
        </div>

        {/* Unbooked Candidate List */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-stone-600 mb-2">
            Recipients ({unbookedStudents.length} candidates):
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {unbookedStudents.map(std => (
              <div
                key={std.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 bg-white text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={std.avatar}
                    alt={std.name}
                    className="w-7 h-7 rounded-full border border-[#1E0404] object-cover"
                  />
                  <div>
                    <span className="font-heading font-bold text-[#1E0404] block">{std.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{std.email}</span>
                  </div>
                </div>
                <GritBadge variant="red">
                  {std.deadlineDaysRemaining}d remaining
                </GritBadge>
              </div>
            ))}
          </div>
        </div>

        {/* Message Preview */}
        <div className="p-4 rounded-xl border border-stone-300 bg-stone-50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-stone-700">
            <Mail className="w-3.5 h-3.5" />
            <span>Automated Email & In-App Notification Preview:</span>
          </div>
          <div className="p-3 rounded-lg border border-stone-200 bg-white text-xs text-stone-700 space-y-1 font-sans">
            <p className="font-bold text-[#1E0404]">Subject: [Action Required] Book your Milestone 2 Technical Evaluation</p>
            <p className="text-stone-600">
              "Hi [Student Name], you are eligible to book your Milestone 2 evaluation. Slots are currently open with GRIT lead evaluators for this week. Please schedule your session now to ensure timely progression into Capstone Apprenticeship."
            </p>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <GritButton variant="secondary" onClick={onClose}>
            Cancel
          </GritButton>
          <GritButton
            variant="primary"
            onClick={handleSend}
            disabled={isSending || unbookedStudents.length === 0}
            icon={Send}
            className="px-6"
          >
            {isSending ? 'Dispatching Reminders...' : `Send Reminders (${unbookedStudents.length} Students) ➔`}
          </GritButton>
        </div>
      </div>
    </Modal>
  );
}

