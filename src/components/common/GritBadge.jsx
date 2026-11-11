import React from 'react';

export default function GritBadge({
  children,
  variant = 'yellow', // 'yellow', 'red', 'purple', 'blue', 'green', 'neutral'
  className = '',
  icon: Icon = null
}) {
  const variantStyles = {
    yellow: "bg-[#F4DF38] text-[#1E0404]",
    red: "bg-[#D74247] text-white",
    purple: "bg-[#70449C] text-white",
    blue: "bg-[#4277FB] text-white",
    green: "bg-[#10B981] text-white",
    neutral: "bg-[#FFFEF7] text-[#1E0404]",
    dark: "bg-[#1E0404] text-[#FFFEF7]"
  };

  return (
    <span className={`grit-badge whitespace-nowrap shrink-0 text-center justify-center ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="leading-none">{children}</span>
    </span>
  );
}

