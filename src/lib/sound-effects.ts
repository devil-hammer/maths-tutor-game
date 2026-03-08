"use client";

export type SoundEffectName =
  | "missionStart"
  | "tap"
  | "correct"
  | "wrong"
  | "celebrate"
  | "badge";

type WaveType = OscillatorType;

interface ToneStep {
  frequency: number;
  durationMs: number;
  delayMs: number;
  volume: number;
  type?: WaveType;
}

const soundPatterns: Record<SoundEffectName, ToneStep[]> = {
  missionStart: [
    { frequency: 392, durationMs: 80, delayMs: 0, volume: 0.03, type: "triangle" },
    { frequency: 523.25, durationMs: 110, delayMs: 95, volume: 0.04, type: "triangle" },
  ],
  tap: [{ frequency: 330, durationMs: 45, delayMs: 0, volume: 0.015, type: "sine" }],
  correct: [
    { frequency: 523.25, durationMs: 70, delayMs: 0, volume: 0.03, type: "triangle" },
    { frequency: 659.25, durationMs: 90, delayMs: 75, volume: 0.04, type: "triangle" },
  ],
  wrong: [
    { frequency: 240, durationMs: 90, delayMs: 0, volume: 0.025, type: "sawtooth" },
    { frequency: 180, durationMs: 120, delayMs: 70, volume: 0.02, type: "sawtooth" },
  ],
  celebrate: [
    { frequency: 523.25, durationMs: 80, delayMs: 0, volume: 0.03, type: "triangle" },
    { frequency: 659.25, durationMs: 90, delayMs: 90, volume: 0.04, type: "triangle" },
    { frequency: 783.99, durationMs: 120, delayMs: 190, volume: 0.045, type: "triangle" },
  ],
  badge: [
    { frequency: 698.46, durationMs: 90, delayMs: 0, volume: 0.03, type: "square" },
    { frequency: 880, durationMs: 120, delayMs: 100, volume: 0.035, type: "triangle" },
  ],
};

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass = window.AudioContext || (window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

export async function unlockSound() {
  const context = getAudioContext();

  if (!context) {
    return false;
  }

  if (context.state === "suspended") {
    await context.resume();
  }

  return true;
}

export async function playSoundEffect(effect: SoundEffectName, enabled: boolean) {
  if (!enabled) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  try {
    if (context.state === "suspended") {
      await context.resume();
    }

    const masterGain = context.createGain();
    masterGain.gain.value = 0.75;
    masterGain.connect(context.destination);

    const now = context.currentTime;

    for (const step of soundPatterns[effect]) {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const startAt = now + step.delayMs / 1000;
      const endAt = startAt + step.durationMs / 1000;

      oscillator.type = step.type ?? "sine";
      oscillator.frequency.setValueAtTime(step.frequency, startAt);

      gainNode.gain.setValueAtTime(0.0001, startAt);
      gainNode.gain.exponentialRampToValueAtTime(step.volume, startAt + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      oscillator.start(startAt);
      oscillator.stop(endAt);
    }
  } catch {
    // Audio is optional; failures should never interrupt the lesson flow.
  }
}
