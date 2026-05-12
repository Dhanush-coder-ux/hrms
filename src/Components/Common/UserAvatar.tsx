import React from "react";

/**
 * Shared palette for User Avatars across the HRMS.
 * Each entry provides a background, light background (for drawer soft areas), 
 * text color, and border color.
 */
export const AVATAR_PALETTE = [
  { 
    id: 'purple',
    bg: "bg-purple-600", 
    lightBg: "bg-purple-50", 
    text: "text-purple-600", 
    border: "border-purple-100", 
    soft: "bg-purple-600/10",
    tableBg: "bg-purple-100",
    tableText: "text-purple-700"
  },
  { 
    id: 'blue',
    bg: "bg-blue-600", 
    lightBg: "bg-blue-50", 
    text: "text-blue-600", 
    border: "border-blue-100", 
    soft: "bg-blue-600/10",
    tableBg: "bg-blue-100",
    tableText: "text-blue-700"
  },
  { 
    id: 'emerald',
    bg: "bg-emerald-600", 
    lightBg: "bg-emerald-50", 
    text: "text-emerald-600", 
    border: "border-emerald-100", 
    soft: "bg-emerald-600/10",
    tableBg: "bg-emerald-100",
    tableText: "text-emerald-700"
  },
  { 
    id: 'indigo',
    bg: "bg-indigo-600", 
    lightBg: "bg-indigo-50", 
    text: "text-indigo-600", 
    border: "border-indigo-100", 
    soft: "bg-indigo-600/10",
    tableBg: "bg-indigo-100",
    tableText: "text-indigo-700"
  },
  { 
    id: 'teal',
    bg: "bg-teal-600", 
    lightBg: "bg-teal-50", 
    text: "text-teal-600", 
    border: "border-teal-100", 
    soft: "bg-teal-600/10",
    tableBg: "bg-teal-100",
    tableText: "text-teal-700"
  },
  { 
    id: 'orange',
    bg: "bg-orange-500", 
    lightBg: "bg-orange-50", 
    text: "text-orange-600", 
    border: "border-orange-100", 
    soft: "bg-orange-500/10",
    tableBg: "bg-orange-100",
    tableText: "text-orange-700"
  },
  { 
    id: 'rose',
    bg: "bg-rose-600", 
    lightBg: "bg-rose-50", 
    text: "text-rose-600", 
    border: "border-rose-100", 
    soft: "bg-rose-600/10",
    tableBg: "bg-rose-100",
    tableText: "text-rose-700"
  },
  { 
    id: 'amber',
    bg: "bg-amber-500", 
    lightBg: "bg-amber-50", 
    text: "text-amber-600", 
    border: "border-amber-100", 
    soft: "bg-amber-500/10",
    tableBg: "bg-amber-100",
    tableText: "text-amber-700"
  },
  { 
    id: 'violet',
    bg: "bg-violet-600", 
    lightBg: "bg-violet-50", 
    text: "text-violet-600", 
    border: "border-violet-100", 
    soft: "bg-violet-600/10",
    tableBg: "bg-violet-100",
    tableText: "text-violet-700"
  },
  { 
    id: 'cyan',
    bg: "bg-cyan-600", 
    lightBg: "bg-cyan-50", 
    text: "text-cyan-600", 
    border: "border-cyan-100", 
    soft: "bg-cyan-600/10",
    tableBg: "bg-cyan-100",
    tableText: "text-cyan-700"
  },
  { 
    id: 'lime',
    bg: "bg-lime-600", 
    lightBg: "bg-lime-50", 
    text: "text-lime-700", 
    border: "border-lime-100", 
    soft: "bg-lime-600/10",
    tableBg: "bg-lime-100",
    tableText: "text-lime-800"
  },
  { 
    id: 'fuchsia',
    bg: "bg-fuchsia-600", 
    lightBg: "bg-fuchsia-50", 
    text: "text-fuchsia-600", 
    border: "border-fuchsia-100", 
    soft: "bg-fuchsia-600/10",
    tableBg: "bg-fuchsia-100",
    tableText: "text-fuchsia-700"
  },
];


export const getUserTheme = (name: string) => {
  if (!name) return AVATAR_PALETTE[0];
  // Use sum of char codes for better distribution across names
  const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const idx = charSum % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
};

/**
 * Returns initials for a given name (max 2 characters).
 */
export const getInitials = (name?: string) => {
  if (!name) return "??";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "table" | "solid";
}

/**
 * A reusable User Avatar component that uses the global theme system.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  size = "md", 
  className = "", 
  variant = "table" 
}) => {
  const theme = getUserTheme(name);
  const initials = getInitials(name);

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-[12px]",
    lg: "w-12 h-12 text-[16px]",
    xl: "w-14 h-14 text-[20px]"
  };

  const variantClasses = variant === "table" 
    ? `${theme.tableBg} ${theme.tableText}`
    : `${theme.bg} text-white`;

  return (
    <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center font-extrabold flex-shrink-0 tracking-tighter shadow-sm border ${variant === 'table' ? theme.border : 'border-white/10'} ${variantClasses} ${className}`}>
      {initials}
    </div>
  );
};
