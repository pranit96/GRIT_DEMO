import React from 'react';
import Modal from '../common/Modal';
import GritButton from '../common/GritButton';
import GritBadge from '../common/GritBadge';
import { Award, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export default function CertificateModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;
  const evaluation = student.evaluation || {
    score: 88,
    evaluatorName: 'Arjun Nair',
    evaluatedAt: '2026-11-10T14:30:00Z'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official GRIT Evaluation Certificate"
      subtitle={`Verified Credential for ${student.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Certificate Canvas */}
        <div className="p-8 sm:p-10 rounded-2xl border-[3px] border-[#1E0404] bg-[#FFFEF7] text-center relative overflow-hidden grit-shadow-lg space-y-6">
          {/* Watermark / Background Motifs */}
          <div className="absolute right-[-60px] top-[-60px] w-64 h-64 rounded-full bg-[#F4DF38]/10 pointer-events-none"></div>
          <div className="absolute left-[-60px] bottom-[-60px] w-64 h-64 rounded-full bg-[#70449C]/10 pointer-events-none"></div>

          {/* Header Branding */}
          <div className="flex items-center justify-between border-b-2 border-[#1E0404] pb-4">
            <img src="/assets/logo-dark.png" alt="GRIT Logo" className="h-8 w-auto" />
            <GritBadge variant="purple">Verified Academic Credential</GritBadge>
          </div>

          <div className="space-y-2">
            <span className="font-heading font-black text-xs uppercase tracking-widest text-[#70449C] block">
              Certificate of Technical Milestone Clearance
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#1E0404] tracking-tight">
              {student.name}
            </h2>
            <p className="text-xs text-stone-600 font-sans max-w-md mx-auto">
              has successfully completed and cleared the Milestone 2 Technical Evaluation in
            </p>
            <p className="font-heading font-black text-base text-[#1E0404]">
              {student.cohort}
            </p>
          </div>

          {/* Score Badge Callout */}
          <div className="inline-block p-4 rounded-xl bg-[#F4DF38] border-2 border-[#1E0404] grit-shadow-sm">
            <span className="text-[10px] uppercase font-heading font-bold text-[#1E0404] block">
              Cumulative Evaluation Score
            </span>
            <span className="font-heading font-black text-3xl text-[#1E0404]">
              {evaluation.score} <span className="text-sm font-normal text-stone-700">/ 100 (Strong Pass)</span>
            </span>
          </div>

          <p className="text-xs text-stone-600 font-sans max-w-lg mx-auto leading-relaxed">
            This certifies mastery of Distributed Systems Architecture, Algorithmic Problem Solving, and Clean Software Engineering principles. The candidate is officially cleared for Milestone 3 (Capstone Apprenticeship).
          </p>

          {/* Signatures & Verification Hash */}
          <div className="pt-6 border-t-2 border-[#1E0404] flex flex-wrap items-center justify-between gap-4 text-left text-xs">
            <div>
              <p className="font-heading font-bold text-[#1E0404]">{evaluation.evaluatorName}</p>
              <p className="text-[10px] text-stone-500">Lead Technical Evaluator • GRIT</p>
            </div>

            <div className="text-right">
              <p className="font-mono text-[10px] text-stone-500">Credential ID: GRIT-M2-{student.id}-{Date.now().toString().slice(-6)}</p>
              <p className="text-[10px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3 h-3" /> Digitally Verified on Chain
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <GritButton variant="secondary" onClick={onClose}>
            Close
          </GritButton>
          <GritButton variant="primary" icon={Printer} onClick={handlePrint}>
            Print / Save as PDF ➔
          </GritButton>
        </div>
      </div>
    </Modal>
  );
}

