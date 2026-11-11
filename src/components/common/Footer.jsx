import React from 'react';

function InstagramIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-[#F4F9FD] py-10 px-4 sm:px-8 text-stone-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top row: GRIT Logo & Subtitle on left, Instagram Icon on right */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <img
              src="/assets/logo-dark.png"
              alt="GRIT"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <p className="text-xs sm:text-sm text-stone-400 font-sans font-medium tracking-tight">
              Global Readiness Immersion Trips Programme 2026-27
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="text-stone-900 hover:text-stone-600 transition-colors p-1"
          >
            <InstagramIcon className="w-6 h-6" />
          </a>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="border-t border-stone-200"></div>

        {/* 4-column Links Grid matching official design exactly */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3.5 gap-x-8 text-xs sm:text-sm font-sans font-normal text-stone-700">
          {/* Column 1 */}
          <div className="space-y-2.5">
            <a href="#terms-and-conditions" className="block hover:text-[#1E0404] transition-colors">
              Terms and Conditions
            </a>
            <a href="#bonus-miles" className="block hover:text-[#1E0404] transition-colors">
              Bonus Miles
            </a>
          </div>

          {/* Column 2 */}
          <div className="space-y-2.5">
            <a href="#tracks-badges" className="block hover:text-[#1E0404] transition-colors">
              Tracks & Badges
            </a>
            <a href="#privacy-policy" className="block hover:text-[#1E0404] transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Column 3 */}
          <div className="space-y-2.5">
            <a href="#skills-levels" className="block hover:text-[#1E0404] transition-colors">
              Skills & Levels
            </a>
            <a href="#terms-of-use" className="block hover:text-[#1E0404] transition-colors">
              Terms of use
            </a>
          </div>

          {/* Column 4 */}
          <div className="space-y-2.5">
            <a href="#ticket-to-finale" className="block hover:text-[#1E0404] transition-colors">
              Ticket to Finale
            </a>
            <a href="#brand-kit" className="block hover:text-[#1E0404] transition-colors">
              Brand Kit
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
