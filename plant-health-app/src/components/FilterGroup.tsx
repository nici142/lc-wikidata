import FilterChip from "./FilterChip";

interface FilterGroupProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; icon?: string }[];
}

export default function FilterGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: FilterGroupProps<T>) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-bark-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <FilterChip key={o.value} size="sm" active={value === o.value} onClick={() => onChange(o.value)}>
            {o.icon && <span aria-hidden>{o.icon}</span>} {o.label}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}
