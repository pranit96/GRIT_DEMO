import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E0404]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className={`relative w-full ${maxWidth} bg-[#FFFEF7] grit-border grit-shadow-lg rounded-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-150`}>
        {/* Header */}
        <div className="bg-[#1E0404] text-[#FFFEF7] px-6 py-4 flex items-center justify-between border-b-[2.5px] border-[#1E0404]">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight text-[#FFFEF7]">{title}</h2>
            {subtitle && <p className="text-xs text-stone-300 font-sans mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#FFFEF7] text-[#1E0404] border-[2px] border-[#1E0404] flex items-center justify-center hover:bg-[#F4DF38] transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

