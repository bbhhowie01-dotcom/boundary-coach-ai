"use client";

type ReferencePanelProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function ReferencePanel({
  label,
  children,
  className = "",
}: ReferencePanelProps) {
  return (
    <div
      className={`rounded-3xl border border-soft-blue/35 bg-soft-blue/15 px-4 py-4 ${className}`}
    >
      <p className="mb-2 text-xs font-semibold tracking-wide text-warm-gray">
        {label}
      </p>
      <div className="text-sm leading-7 text-warm-ink whitespace-pre-line">
        {children}
      </div>
    </div>
  );
}
