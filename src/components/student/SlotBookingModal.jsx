import React, { useState } from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { useGrit } from '../../context/GritContext';
import { Calendar, Clock, User, Filter, CheckCircle2, Video, Code, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SlotBookingModal({ isOpen, onClose }) {
  const { currentStudent, slots, bookSlot, interviewers } = useGrit();
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [interviewerFilter, setInterviewerFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available slots
  const availableSlots = slots.filter(s => s.status === 'available');

  // Filter options
  const uniqueDates = [...new Set(availableSlots.map(s => s.date))].sort();

  // Filtered slots
  const filteredSlots = availableSlots.filter(s => {
    if (dateFilter !== 'all' && s.date !== dateFilter) return false;
    if (interviewerFilter !== 'all' && s.interviewerId !== interviewerFilter) return false;
    if (timeFilter !== 'all') {
      const hour = parseInt(s.startTime.split(':')[0], 10);
      if (timeFilter === 'morning' && hour >= 12) return false;
      if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) return false;
      if (timeFilter === 'evening' && hour < 17) return false;
    }
    return true;
  });

  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  const handleConfirm = () => {
    if (!selectedSlotId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      bookSlot(currentStudent.id, selectedSlotId);
      setIsSubmitting(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // confetti fallback
      }
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Your Technical Evaluation Slot"
      subtitle={`Student: ${currentStudent.name} • ${currentStudent.cohort}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Eligibility Notice Card */}
        <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-[#F4DF38]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/assets/icons/Icon01.png" alt="Badge" className="w-10 h-10 object-contain" />
            <div>
              <p className="font-heading font-bold text-sm text-[#1E0404]">
                Eligibility Confirmed: Milestone 2 Technical Evaluation
              </p>
              <p className="text-xs text-stone-700 font-sans">
                Select an open 45-minute technical slot with a GRIT lead evaluator. Code sandbox & video call link included.
              </p>
            </div>
          </div>
          <GritBadge variant="yellow" className="hidden sm:inline-flex">
            Action Step
          </GritBadge>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-[#FFFEF7] space-y-3">
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#1E0404] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Available Slots</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Date Filter */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#1E0404] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4DF38]"
              >
                <option value="all">All Available Dates ({uniqueDates.length})</option>
                {uniqueDates.map(d => (
                  <option key={d} value={d}>
                    {new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>

            {/* Time of Day Filter */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Time of Day</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#1E0404] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4DF38]"
              >
                <option value="all">Any Time</option>
                <option value="morning">Morning (Before 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM – 5 PM)</option>
                <option value="evening">Evening (After 5 PM)</option>
              </select>
            </div>

            {/* Interviewer Filter */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Evaluator</label>
              <select
                value={interviewerFilter}
                onChange={(e) => setInterviewerFilter(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#1E0404] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F4DF38]"
              >
                <option value="all">Any Senior Evaluator</option>
                {interviewers.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Slot Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-heading font-bold text-[#1E0404]">
              Available Slots ({filteredSlots.length})
            </span>
            <span className="text-stone-500">Duration: 45 minutes</span>
          </div>

          {filteredSlots.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-stone-300 rounded-xl bg-stone-50">
              <Clock className="w-8 h-8 mx-auto text-stone-400 mb-2" />
              <p className="font-heading font-bold text-sm text-[#1E0404]">No matching slots found</p>
              <p className="text-xs text-stone-500 mt-1">Try resetting the filters or check back tomorrow for newly opened availability.</p>
              <button
                onClick={() => { setDateFilter('all'); setTimeFilter('all'); setInterviewerFilter('all'); }}
                className="mt-3 text-xs font-bold text-[#4277FB] underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredSlots.map(slot => {
                const isSelected = selectedSlotId === slot.id;
                const formattedDate = new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#1E0404] bg-[#F4DF38] grit-shadow'
                        : 'border-[#1E0404] bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-heading font-bold text-sm text-[#1E0404]">
                          <Calendar className="w-4 h-4 text-[#1E0404]" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot.startTime} – {slot.endTime} EST</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-600 pt-1">
                          <User className="w-3 h-3 text-[#1E0404]" />
                          <span>Evaluator: <strong>{slot.interviewerName}</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-[#1E0404] text-[#FFFEF7] flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-[#F4DF38]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-stone-300"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Slot Preview & Confirmation CTA */}
        {selectedSlot && (
          <div className="p-4 rounded-xl border-2 border-[#1E0404] bg-[#FFFEF7] grit-shadow-sm space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-stone-500">
                Selected Booking Summary
              </span>
              <GritBadge variant="blue">Ready to Confirm</GritBadge>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <div>
                <p className="font-heading font-black text-[#1E0404]">
                  {new Date(selectedSlot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedSlot.startTime} EST
                </p>
                <p className="text-xs text-stone-600">With {selectedSlot.interviewerName} • 45 min Technical Interview</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <GritButton
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </GritButton>
          <GritButton
            variant="primary"
            disabled={!selectedSlotId || isSubmitting}
            onClick={handleConfirm}
            className="px-6"
          >
            {isSubmitting ? 'Confirming Booking...' : 'Confirm Interview Slot ➔'}
          </GritButton>
        </div>
      </div>
    </Modal>
  );
}

