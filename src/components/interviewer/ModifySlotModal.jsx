import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import { Calendar, Clock, Edit3, Video, CheckCircle2 } from 'lucide-react';

export default function ModifySlotModal({ isOpen, onClose, slot }) {
  const { modifySlot } = useGrit();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [track, setTrack] = useState('Full Stack Engineering');
  const [meetingLink, setMeetingLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slot) {
      setDate(slot.date || '');
      setStartTime(slot.startTime || '');
      setEndTime(slot.endTime || '');
      setTrack(slot.track || 'Full Stack Engineering');
      setMeetingLink(slot.meetingLink || '');
    }
  }, [slot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!slot) return;

    setIsSubmitting(true);
    setTimeout(() => {
      modifySlot(slot.id, {
        date,
        startTime,
        endTime,
        track,
        meetingLink
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  if (!slot) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modify Availability Slot"
      subtitle={`Slot ID: ${slot.id} • Status: ${slot.status.toUpperCase()}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {slot.status === 'booked' && (
          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-xs text-blue-900">
            <strong>Note:</strong> This slot is booked by <strong>{slot.bookedByStudentName}</strong>. Modifying the time will automatically update their student calendar invite.
          </div>
        )}

        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1">
              Start Time (EST)
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1">
              End Time (EST)
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1">
            Technical Track
          </label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
          >
            <option value="Full Stack Engineering">Full Stack Engineering</option>
            <option value="Backend & Cloud Systems">Backend & Cloud Systems</option>
            <option value="AI & Machine Learning">AI & Machine Learning</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1">
            Meeting Link
          </label>
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
            placeholder="https://meet.grit.edu/..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
          <GritButton variant="secondary" onClick={onClose}>
            Cancel
          </GritButton>
          <GritButton
            type="submit"
            variant="blue"
            disabled={isSubmitting}
            icon={CheckCircle2}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes ➔'}
          </GritButton>
        </div>
      </form>
    </Modal>
  );
}

