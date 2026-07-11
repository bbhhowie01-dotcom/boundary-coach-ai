"use client";

type ProgressDotsProps = {
  current: number;
  total: number;
};

export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-1.5"
      aria-label={`第 ${current} 步，共 ${total} 步`}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <span
            key={step}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              active
                ? "w-5 bg-soft-blue-deep"
                : done
                  ? "w-2.5 bg-soft-green-deep/70"
                  : "w-2.5 bg-cream-deep"
            }`}
          />
        );
      })}
    </div>
  );
}
