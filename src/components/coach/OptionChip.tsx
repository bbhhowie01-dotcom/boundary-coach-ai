"use client";

type OptionChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function OptionChip({ label, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2.5 text-left text-sm transition duration-200 ${
        selected
          ? "border-soft-green-deep/40 bg-soft-green/70 text-warm-ink shadow-sm"
          : "border-cream-deep bg-white/50 text-warm-gray hover:border-soft-blue/60 hover:bg-white/80"
      }`}
    >
      {label}
    </button>
  );
}
