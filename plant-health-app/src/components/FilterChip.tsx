import type { ReactNode } from "react";

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-leaf-700 text-white shadow-sm shadow-leaf-900/15"
          : "bg-white text-bark-700 ring-1 ring-bark-200 hover:bg-leaf-50 hover:text-leaf-800"
      }`}
    >
      {children}
    </button>
  );
}
