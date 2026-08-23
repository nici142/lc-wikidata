import type { ReactNode } from "react";

const toneStyles = {
  leaf: "bg-leaf-100 text-leaf-800",
  clay: "bg-clay-100 text-clay-600",
} as const;

interface PageHeaderProps {
  icon: string;
  title: string;
  description: string;
  tone?: keyof typeof toneStyles;
  action?: ReactNode;
}

export default function PageHeader({ icon, title, description, tone = "leaf", action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${toneStyles[tone]}`}
        >
          {icon}
        </span>
        <div>
          <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-bark-900">
            {title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[0.95rem] text-bark-500">{description}</p>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
