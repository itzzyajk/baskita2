// Web Audio API pure synthesizer for tactile papercraft sounds & notifications
// Plus Web Speech API speech synthesizer for distraction-free driver announcements

class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Soft tactile paper crease / snap sound
  playPaperFold() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Soft paper friction burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.05); // 50ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(1.8, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(t);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Dual tone school bus horn
  playBusHorn() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Two honk pulses: 349Hz (F4) + 440Hz (A4)
      [0, 0.22].forEach((delay) => {
        [349.23, 440.0].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t + delay);

          gain.gain.setValueAtTime(0.12, t + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.16);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t + delay);
          osc.stop(t + delay + 0.17);
        });
      });
    } catch {
      // ignore
    }
  }

  // Star collect chime in Paper Bus Runner
  playStarCollect() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      [1318.5, 1760.0].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0.15, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.26);
      });
    } catch {
      // ignore
    }
  }

  // Paper crumple / crash sound in games
  playCrashFold() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const bufferSize = Math.floor(ctx.sampleRate * 0.18);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.linearRampToValueAtTime(200, t + 0.18);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(t);
    } catch {
      // ignore
    }
  }

  // Drift tire screech synth
  playDrift() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.15);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // ignore
    }
  }

  // Cheerful chime when parent sends an update or when bus arrives
  playChime(type: 'arrival' | 'alert' | 'success' = 'alert') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      if (type === 'alert') {
        // Two-tone friendly chime: G5 -> C6
        [783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + i * 0.12);

          gain.gain.setValueAtTime(0.12, t + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t + i * 0.12);
          osc.stop(t + i * 0.12 + 0.36);
        });
      } else if (type === 'arrival') {
        // Three ascending tones: C5 -> E5 -> G5
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + i * 0.1);

          gain.gain.setValueAtTime(0.15, t + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t + i * 0.1);
          osc.stop(t + i * 0.1 + 0.41);
        });
      } else {
        // Success stamp / paper clip pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(440, t + 0.1);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.13);
      }
    } catch {
      // Ignore if user hasn't interacted yet
    }
  }

  // Web Speech API Voice Announcement (Driver Cockpit & Safety Prompts)
  speakAnnouncement(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'ms-MY'; // Malay or fallback
      if (onEnd) {
        utterance.onend = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // speech not permitted or blocked
    }
  }
}

export const sounds = new SoundManager();
