"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ComfortSoundId =
  | "none"
  | "rain"
  | "ocean"
  | "spa-bamboo"
  | "soft-piano";

export type SoundOption = {
  id: ComfortSoundId;
  label: string;
  category?: "自然聲音" | "柔和音樂";
  src?: string;
};

export const SOUND_OPTIONS: SoundOption[] = [
  { id: "none", label: "不需要聲音" },
  {
    id: "rain",
    label: "雨聲",
    category: "自然聲音",
    src: "/audio/rain.mp3",
  },
  {
    id: "ocean",
    label: "海浪聲",
    category: "自然聲音",
    src: "/audio/ocean.mp3",
  },
  {
    id: "spa-bamboo",
    label: "Spa 竹樂",
    category: "柔和音樂",
    src: "/audio/spa-bamboo.mp3",
  },
  {
    id: "soft-piano",
    label: "柔和鋼琴",
    category: "柔和音樂",
    src: "/audio/soft-piano.mp3",
  },
];

const DEFAULT_VOLUME = 0.3;
const FADE_MS = 350;
const LOAD_TIMEOUT_MS = 10000;

type ComfortSoundContextValue = {
  selected: ComfortSoundId;
  isPlaying: boolean;
  volume: number;
  playError: boolean;
  switching: boolean;
  selectSound: (soundId: ComfortSoundId) => Promise<void>;
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => void;
  stopAndReset: () => Promise<void>;
};

const ComfortSoundContext = createContext<ComfortSoundContextValue | null>(
  null,
);

function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  duration: number,
  shouldAbort: () => boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      if (shouldAbort()) {
        resolve();
        return;
      }
      const progress = Math.min(1, (now - start) / duration);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * progress));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(tick);
  });
}

function waitForCanPlay(
  audio: HTMLAudioElement,
  shouldAbort: () => boolean,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (shouldAbort()) {
      resolve();
      return;
    }
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      resolve();
      return;
    }

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("音檔載入逾時"));
    }, LOAD_TIMEOUT_MS);

    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("音檔載入失敗"));
    };

    function cleanup() {
      window.clearTimeout(timer);
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("loadeddata", onReady);
      audio.removeEventListener("error", onError);
    }

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("loadeddata", onReady);
    audio.addEventListener("error", onError);
  });
}

export function ComfortSoundProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generationRef = useRef(0);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const isPlayingRef = useRef(false);
  const selectedRef = useRef<ComfortSoundId>("none");

  const [selected, setSelected] = useState<ComfortSoundId>("none");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [playError, setPlayError] = useState(false);
  const [switching, setSwitching] = useState(false);

  const setPlayingState = useCallback((next: boolean) => {
    isPlayingRef.current = next;
    setIsPlaying(next);
  }, []);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const stopPlayback = useCallback(async () => {
    const generation = ++generationRef.current;
    setSwitching(false);
    const audio = audioRef.current;
    if (!audio) {
      setPlayingState(false);
      return;
    }

    if (!audio.paused) {
      await fadeVolume(
        audio,
        audio.volume,
        0,
        FADE_MS,
        () => generation !== generationRef.current,
      );
      if (generation !== generationRef.current) return;
      audio.pause();
    }

    setPlayingState(false);
  }, [setPlayingState]);

  const startPlayback = useCallback(
    async (soundId: ComfortSoundId) => {
      const option = SOUND_OPTIONS.find((item) => item.id === soundId);
      if (!option?.src) return;

      const generation = ++generationRef.current;
      const isStale = () => generation !== generationRef.current;

      setPlayError(false);
      setSwitching(true);

      const audio = ensureAudio();

      try {
        if (!audio.paused) {
          await fadeVolume(audio, audio.volume, 0, FADE_MS, isStale);
          if (isStale()) return;
          audio.pause();
        }

        if (isStale()) return;

        audio.removeAttribute("src");
        audio.load();
        audio.src = option.src;
        audio.load();

        await waitForCanPlay(audio, isStale);
        if (isStale()) return;

        audio.volume = 0;
        try {
          audio.currentTime = 0;
        } catch {
          // ignore
        }

        await audio.play();
        if (isStale()) {
          audio.pause();
          return;
        }

        setPlayingState(true);
        await fadeVolume(audio, 0, volumeRef.current, FADE_MS, isStale);

        if (!isStale() && !audio.paused) {
          audio.volume = volumeRef.current;
        }
      } catch (error) {
        console.warn("[ComfortSound] play failed", soundId, error);
        if (!isStale()) {
          setPlayError(true);
          setPlayingState(false);
        }
      } finally {
        if (!isStale()) {
          setSwitching(false);
        }
      }
    },
    [ensureAudio, setPlayingState],
  );

  const selectSound = useCallback(
    async (soundId: ComfortSoundId) => {
      setPlayError(false);
      selectedRef.current = soundId;
      setSelected(soundId);

      if (soundId === "none") {
        await stopPlayback();
        return;
      }

      if (isPlayingRef.current) {
        await startPlayback(soundId);
      }
    },
    [startPlayback, stopPlayback],
  );

  const togglePlay = useCallback(async () => {
    const current = selectedRef.current;
    if (current === "none") return;

    if (isPlayingRef.current) {
      await stopPlayback();
      return;
    }

    await startPlayback(current);
  }, [startPlayback, stopPlayback]);

  const setVolume = useCallback((next: number) => {
    volumeRef.current = next;
    setVolumeState(next);
    const audio = audioRef.current;
    if (audio && isPlayingRef.current && !audio.paused) {
      audio.volume = next;
    }
  }, []);

  const stopAndReset = useCallback(async () => {
    selectedRef.current = "none";
    setSelected("none");
    setPlayError(false);
    await stopPlayback();
  }, [stopPlayback]);

  // Provider 存活於整個旅程：只在 App 真正卸載時才釋放音訊
  useEffect(() => {
    return () => {
      generationRef.current += 1;
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, []);

  const value = useMemo<ComfortSoundContextValue>(
    () => ({
      selected,
      isPlaying,
      volume,
      playError,
      switching,
      selectSound,
      togglePlay,
      setVolume,
      stopAndReset,
    }),
    [
      selected,
      isPlaying,
      volume,
      playError,
      switching,
      selectSound,
      togglePlay,
      setVolume,
      stopAndReset,
    ],
  );

  return (
    <ComfortSoundContext.Provider value={value}>
      {children}
    </ComfortSoundContext.Provider>
  );
}

export function useComfortSound() {
  const ctx = useContext(ComfortSoundContext);
  if (!ctx) {
    throw new Error("useComfortSound 必須在 ComfortSoundProvider 內使用");
  }
  return ctx;
}
