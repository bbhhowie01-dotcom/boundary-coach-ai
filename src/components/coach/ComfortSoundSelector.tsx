"use client";

import {
  SOUND_OPTIONS,
  useComfortSound,
  type ComfortSoundId,
  type SoundOption,
} from "@/components/coach/ComfortSoundContext";
import { SoftButton } from "@/components/coach/SoftButton";

export type { ComfortSoundId };

export function ComfortSoundSelector() {
  const {
    selected,
    isPlaying,
    volume,
    playError,
    switching,
    selectSound,
    togglePlay,
    setVolume,
  } = useComfortSound();

  const naturalSounds = SOUND_OPTIONS.filter(
    (item) => item.category === "自然聲音",
  );
  const musicSounds = SOUND_OPTIONS.filter(
    (item) => item.category === "柔和音樂",
  );

  return (
    <div className="rounded-2xl border border-cream-deep/80 bg-white/50 px-4 py-4">
      <p className="text-sm leading-7 text-warm-gray">
        如果你願意，
        <br />
        也可以讓一段安定的背景聲陪你慢下來。
        <br />
        不用急著選，
        <br />
        也不用一定要播放。
        <br />
        你可以只是先停在這裡。
      </p>

      <p className="mt-4 text-sm font-semibold text-warm-ink">
        你想讓什麼聲音陪你一下？
      </p>
      <p className="mt-1 text-xs leading-6 text-warm-gray">
        先選一種聲音，再按「讓聲音陪我一下」才會播放。
      </p>

      <div className="mt-3 space-y-3">
        <SoundGroup
          options={[SOUND_OPTIONS[0]]}
          selected={selected}
          onSelect={selectSound}
        />
        <SoundGroup
          title="自然聲音"
          options={naturalSounds}
          selected={selected}
          onSelect={selectSound}
        />
        <SoundGroup
          title="柔和音樂"
          options={musicSounds}
          selected={selected}
          onSelect={selectSound}
        />
      </div>

      {selected !== "none" && (
        <div className="mt-4 space-y-3 border-t border-cream-deep/60 pt-4">
          <p className="text-sm leading-7 text-warm-ink">
            選好聲音後，請按「讓聲音陪我一下」才會開始播放。
            <br />
            <span className="text-warm-gray">
              只選聲音還不會自動播出，你可以決定什麼時候開始。
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <SoftButton
              variant={isPlaying ? "ghost" : "primary"}
              onClick={() => void togglePlay()}
              className="text-sm"
            >
              {switching
                ? "正在載入聲音…"
                : isPlaying
                  ? "先暫停一下"
                  : "讓聲音陪我一下"}
            </SoftButton>
            <SoftButton
              variant="ghost"
              onClick={() => void selectSound("none")}
              className="text-sm"
            >
              不需要聲音
            </SoftButton>
          </div>

          <label className="flex items-center gap-3 text-xs text-warm-gray">
            <span className="shrink-0">音量</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-1.5 w-full max-w-xs accent-soft-blue-deep"
              aria-label="背景聲音量"
            />
          </label>
        </div>
      )}

      {playError && (
        <p className="mt-3 text-sm leading-7 text-warm-gray">
          目前無法播放背景聲，
          <br />
          你仍然可以先做三次深呼吸。
        </p>
      )}
    </div>
  );
}

/** 換頁後仍可輕觸暫停／關閉，不干擾閱讀 */
export function ComfortSoundMiniBar() {
  const { selected, isPlaying, switching, togglePlay, selectSound } =
    useComfortSound();

  if (selected === "none" || (!isPlaying && !switching)) {
    return null;
  }

  const label =
    SOUND_OPTIONS.find((item) => item.id === selected)?.label ?? "背景聲";

  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-md items-center gap-2 rounded-full border border-cream-deep/90 bg-white/90 px-3 py-2 shadow-[0_8px_30px_-12px_rgba(90,110,120,0.45)] backdrop-blur-sm">
        <span className="max-w-[9rem] truncate text-xs text-warm-gray sm:max-w-none">
          {switching ? "載入中…" : `${label}陪著你`}
        </span>
        <button
          type="button"
          onClick={() => void togglePlay()}
          className="rounded-full px-2.5 py-1 text-xs text-soft-blue-deep hover:bg-soft-blue/30"
        >
          {isPlaying ? "暫停" : "繼續"}
        </button>
        <button
          type="button"
          onClick={() => void selectSound("none")}
          className="rounded-full px-2.5 py-1 text-xs text-warm-gray hover:bg-mist/80"
        >
          關閉
        </button>
      </div>
    </div>
  );
}

type SoundGroupProps = {
  title?: string;
  options: SoundOption[];
  selected: ComfortSoundId;
  onSelect: (id: ComfortSoundId) => void;
};

function SoundGroup({ title, options, selected, onSelect }: SoundGroupProps) {
  return (
    <div>
      {title && (
        <p className="mb-1.5 text-xs font-medium text-warm-gray/90">{title}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => void onSelect(option.id)}
              className={`rounded-2xl border px-3.5 py-2 text-sm transition duration-200 ${
                active
                  ? "border-soft-blue-deep/40 bg-soft-blue/35 text-warm-ink"
                  : "border-cream-deep bg-white/60 text-warm-gray hover:border-soft-blue/40 hover:bg-white/85"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
