import type { ReactNode } from "react";

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  size?: "md" | "sm";
}

export default function FilterChip({ active, onClick, children, size = "md" }: FilterChipProps) {
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full font-medium transition-all ${sizeClasses} ${
        active
          ? "bg-leaf-700 text-white shadow-sm shadow-leaf-900/15"
          : "bg-white text-bark-700 ring-1 ring-bark-200 hover:bg-leaf-50 hover:text-leaf-800"
      }`}
    >
      {children}
    </button>
  );
}
