interface ProgressBarProps {
  value: number;
  label: string;
  colorClassName?: string;
}

export function ProgressBar({
  value,
  label,
  colorClassName = "bg-gradient-to-r from-sky-400 to-violet-500",
}: ProgressBarProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-4 rounded-full bg-slate-200">
        <div
          className={`h-4 rounded-full transition-all duration-500 ${colorClassName}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
