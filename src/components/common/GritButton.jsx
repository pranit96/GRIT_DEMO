import React from 'react';

export default function GritButton({
  children,
  onClick,
  variant = 'primary', // 'primary' (yellow), 'secondary' (cream), 'danger' (red), 'purple' (violet), 'blue' (cobalt), 'dark' (espresso)
  size = 'md',        // 'sm', 'md', 'lg'
  disabled = false,
  className = '',
  icon: Icon = null,
  type = 'button'
}) {
  const baseStyles = "grit-btn font-heading transition-all duration-150 inline-flex items-center justify-center gap-1.5 text-center rounded-lg whitespace-nowrap shrink-0";

  const sizeStyles = {
    sm: "px-2 py-1 text-[11px] font-bold",
    md: "px-4 py-2 text-sm font-bold",
    lg: "px-6 py-3 text-base font-bold"
  };

  const variantStyles = {
    primary: "bg-[#F4DF38] text-[#1E0404] hover:bg-[#ebd322]",
    secondary: "bg-[#FFFEF7] text-[#1E0404] hover:bg-[#f2efe6]",
    danger: "bg-[#D74247] text-white hover:bg-[#c63439]",
    purple: "bg-[#70449C] text-white hover:bg-[#603787]",
    blue: "bg-[#4277FB] text-white hover:bg-[#2f65ee]",
    dark: "bg-[#1E0404] text-[#FFFEF7] hover:bg-[#320808]"
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed transform-none shadow-none pointer-events-none"
    : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' ? "w-5 h-5" : "w-4 h-4"} />}
      <span>{children}</span>
    </button>
  );
}

