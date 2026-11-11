import React, { useState } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import { Plus, Calendar, Clock, Video, Info, CheckCircle2 } from 'lucide-react';

export default function AddAvailabilityModal({ isOpen, onClose }) {
  const { currentInterviewer, addAvailabilitySlot } = useGrit();

  // Form state
  const [date, setDate] = useState('2026-11-18');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('14:45');
  const [track, setTrack] = useState('Full Stack Engineering');
  const [generateBatch, setGenerateBatch] = useState(false);
  const [batchSlotsCount, setBatchSlotsCount] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (generateBatch) {
        // Generate multiple 45-minute slots starting from startTime
        let currentHour = parseInt(startTime.split(':')[0], 10);
        let currentMin = parseInt(startTime.split(':')[1], 10);

        for (let i = 0; i < batchSlotsCount; i++) {
          const sHourStr = String(currentHour).padStart(2, '0');
          const sMinStr = String(currentMin).padStart(2, '0');

          let eMin = currentMin + 45;
          let eHour = currentHour;
          if (eMin >= 60) {
            eHour += Math.floor(eMin / 60);
            eMin = eMin % 60;
          }
          const eHourStr = String(eHour).padStart(2, '0');
          const eMinStr = String(eMin).padStart(2, '0');

          addAvailabilitySlot({
            interviewerId: currentInterviewer.id,
            date,
            startTime: `${sHourStr}:${sMinStr}`,
            endTime: `${eHourStr}:${eMinStr}`,
            track
          });

          // advance by 60 mins (45 min slot + 15 min buffer)
          currentHour += 1;
        }
      } else {
        addAvailabilitySlot({
          interviewerId: currentInterviewer.id,
          date,
          startTime,
          endTime,
          track
        });
      }

      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Interviewer Availability Slots"
      subtitle={`Interviewer: ${currentInterviewer.name} • ${currentInterviewer.title}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-[#4277FB]/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#4277FB]" />
            <div>
              <p className="font-heading font-bold text-sm text-[#1E0404]">
              Set Availability
              </p>
              <p className="text-xs text-stone-600 font-sans">
                Slots added here will become immediately visible in the student booking portal.
              </p>
            </div>
          </div>
          <GritBadge variant="blue">Action</GritBadge>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1.5">
            Interview Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
          />
        </div>

        {/* Time Window */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1.5">
              Start Time (EST)
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1.5">
              End Time (EST)
            </label>
            <input
              type="time"
              required
              disabled={generateBatch}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={`w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#4277FB] ${
                generateBatch ? 'bg-stone-100 text-stone-400' : ''
              }`}
            />
          </div>
        </div>

        {/* Track / Specialization */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-[#1E0404] mb-1.5">
            Technical Track
          </label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="w-full p-2.5 rounded-lg border-2 border-[#1E0404] bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#4277FB]"
          >
            <option value="Full Stack Engineering">Full Stack Engineering (React, Node, Systems)</option>
            <option value="Backend & Cloud Systems">Backend & Cloud Systems (Go, Distributed, Databases)</option>
            <option value="AI & Machine Learning">AI & Machine Learning (Python, PyTorch, LLMs)</option>
          </select>
        </div>

        {/* Batch Slots Option */}
        <div className="p-4 rounded-xl border border-stone-300 bg-stone-50 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={generateBatch}
              onChange={(e) => setGenerateBatch(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-[#1E0404] text-[#4277FB] focus:ring-[#4277FB]"
            />
            <span className="font-heading font-bold text-xs text-[#1E0404]">
              Generate consecutive 45-min slots with 15-min buffers
            </span>
          </label>

          {generateBatch && (
            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="text-stone-600">Number of slots to generate:</span>
              <select
                value={batchSlotsCount}
                onChange={(e) => setBatchSlotsCount(Number(e.target.value))}
                className="p-1.5 rounded border border-[#1E0404] bg-white font-bold"
              >
                <option value={2}>2 slots (2 hours total)</option>
                <option value={3}>3 slots (3 hours total)</option>
                <option value={4}>4 slots (4 hours total)</option>
              </select>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <GritButton variant="secondary" onClick={onClose}>
            Cancel
          </GritButton>
          <GritButton
            type="submit"
            variant="blue"
            disabled={isSubmitting}
            className="px-6"
            icon={Plus}
          >
            {isSubmitting ? 'Adding...' : generateBatch ? `Create ${batchSlotsCount} Availability Slots` : 'Create Availability Slot'}
          </GritButton>
        </div>
      </form>
    </Modal>
  );
}

