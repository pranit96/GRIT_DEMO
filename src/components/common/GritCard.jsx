import React from 'react';

export default function GritCard({
  children,
  className = '',
  accent = null, // 'yellow', 'red', 'purple', 'blue', 'dark'
  header = null,
  headerBadge = null,
  headerAction = null,
  onClick = null
}) {
  const accentBorders = {
    yellow: "border-t-[8px] border-t-[#F4DF38]",
    red: "border-t-[8px] border-t-[#D74247]",
    purple: "border-t-[8px] border-t-[#70449C]",
    blue: "border-t-[8px] border-t-[#4277FB]",
    dark: "border-t-[8px] border-t-[#1E0404]"
  };

  return (
    <div
      onClick={onClick}
      className={`grit-card rounded-xl overflow-hidden ${accent ? accentBorders[accent] : ''} ${className}`}
    >
      {(header || headerBadge || headerAction) && (
        <div className="px-6 py-4 border-b-[2.5px] border-[#1E0404] bg-[#FFFEF7] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {header && <h3 className="font-heading font-bold text-lg text-[#1E0404]">{header}</h3>}
            {headerBadge}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

