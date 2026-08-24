// Global Singleton Music Manager for Hollyland Theme
// Target Path: /public/audio/hollyland-theme.mp3 (served at /audio/hollyland-theme.mp3)

export type MusicPreference = 'needed' | 'not-needed' | null;

export interface AudioState {
    isPlaying: boolean;
    isMuted: boolean;
    volume: number; // 0.0 to 1.0
    isLoaded: boolean;
    error: string | null;
    preference: MusicPreference;
}

class HollylandAudioManager {
    private static instance: HollylandAudioManager | null = null;
    private audio: HTMLAudioElement | null = null;
    private targetVolume = 0.35; // Default volume: 35%
    private fadeInterval: any = null;
    private subscribers = new Set<(state: AudioState) => void>();
    private audioSrc = '/audio/hollyland-theme.mp3';

    private state: AudioState = {
        isPlaying: false,
        isMuted: false,
        volume: 0.35,
        isLoaded: false,
        error: null,
        preference: null,
    };

    private constructor() {
        if (typeof window !== 'undefined') {
            try {
                const savedPref = localStorage.getItem('sfa_music_preference') as MusicPreference;
                if (savedPref === 'needed' || savedPref === 'not-needed') {
                    this.state.preference = savedPref;
                }
            } catch (e) {}
        }
    }

    public static getInstance(): HollylandAudioManager {
        if (typeof window === 'undefined') {
            return new HollylandAudioManager();
        }
        const globalAny = window as any;
        if (!globalAny.__sfaHollylandAudioManager) {
            globalAny.__sfaHollylandAudioManager = new HollylandAudioManager();
        }
        return globalAny.__sfaHollylandAudioManager;
    }

    private initAudio() {
        if (this.audio || typeof window === 'undefined') return;

        try {
            this.audio = new Audio();
            this.audio.src = this.audioSrc;
            this.audio.loop = true;
            this.audio.volume = this.targetVolume;
            this.audio.preload = 'auto';

            this.audio.addEventListener('canplaythrough', () => {
                this.state.isLoaded = true;
                this.state.error = null;
                this.notifySubscribers();
            });

            this.audio.addEventListener('play', () => {
                this.state.isPlaying = true;
                this.notifySubscribers();
            });

            this.audio.addEventListener('pause', () => {
                this.state.isPlaying = false;
                this.notifySubscribers();
            });

            this.audio.addEventListener('error', () => {
                const errDetail = this.audio?.error ? `Code ${this.audio.error.code}: ${this.audio.error.message}` : 'Audio load error';
                console.warn(`[Hollyland Theme] Audio file at '${this.audioSrc}' not available or could not be loaded:`, errDetail);
                this.state.error = 'Theme audio unavailable';
                this.state.isPlaying = false;
                this.notifySubscribers();
            });
        } catch (err) {
            console.warn('[Hollyland Theme] Audio initialization notice:', err);
        }
    }

    public subscribe(callback: (state: AudioState) => void): () => void {
        this.subscribers.add(callback);
        callback({ ...this.state });
        return () => {
            this.subscribers.delete(callback);
        };
    }

    private notifySubscribers() {
        const snapshot = { ...this.state };
        this.subscribers.forEach((cb) => cb(snapshot));
    }

    /**
     * Sets the user's music preference ('needed' | 'not-needed')
     */
    public setPreference(pref: 'needed' | 'not-needed') {
        this.state.preference = pref;
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('sfa_music_preference', pref);
            }
        } catch (e) {}
        this.notifySubscribers();
    }

    /**
     * Clears the user's music preference on logout
     */
    public clearPreference() {
        this.state.preference = null;
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('sfa_music_preference');
            }
        } catch (e) {}
        this.notifySubscribers();
    }

    /**
     * Starts playback of hollyland-theme.mp3 from 0:00 with smooth fade-in to 35% over ~1s
     * Triggered strictly when user selects "NEED MUSIC" and clicks "ENTER SMART FARM →"
     */
    public async playHollylandTheme(): Promise<void> {
        if (typeof window === 'undefined') return;
        this.setPreference('needed');
        this.initAudio();
        if (!this.audio) return;

        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }

        try {
            // 1. Begin playback from the beginning
            this.audio.currentTime = 0;
            this.audio.volume = 0;
            this.state.volume = 0;
            this.state.isMuted = false;
            this.audio.muted = false;

            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                await playPromise;
            }

            this.state.isPlaying = true;
            this.notifySubscribers();

            // 2. Smoothly fade in volume from 0 to 35% (0.35) over ~1000ms
            const stepCount = 20;
            const target = 0.35;
            const stepDuration = 50; // ms
            const increment = target / stepCount;
            let currentVol = 0;

            this.fadeInterval = setInterval(() => {
                currentVol = Math.min(target, currentVol + increment);
                if (this.audio) {
                    this.audio.volume = currentVol;
                }
                this.state.volume = currentVol;
                this.notifySubscribers();

                if (currentVol >= target) {
                    clearInterval(this.fadeInterval);
                    this.fadeInterval = null;
                }
            }, stepDuration);
        } catch (err: any) {
            console.warn('[Hollyland Theme] Playback notice:', err);
            this.state.isPlaying = false;
            this.state.error = err?.message || 'Autoplay prevented or file missing';
            this.notifySubscribers();
        }
    }

    /**
     * Toggles play/pause state
     */
    public togglePlay(): void {
        if (this.state.preference === 'not-needed') {
            // If user clicked play while music was off, enable preference
            this.playHollylandTheme();
            return;
        }

        this.initAudio();
        if (!this.audio) return;

        try {
            if (this.audio.paused) {
                this.audio.play().catch((err) => {
                    console.warn('[Hollyland Theme] Resume error:', err);
                });
            } else {
                this.audio.pause();
            }
        } catch (e) {
            console.warn('[Hollyland Theme] togglePlay error:', e);
        }
    }

    /**
     * Toggles mute state
     */
    public toggleMute(): void {
        if (!this.audio) return;
        this.audio.muted = !this.audio.muted;
        this.state.isMuted = this.audio.muted;
        this.notifySubscribers();
    }

    /**
     * Sets volume level between 0 and 1
     */
    public setVolume(val: number): void {
        if (!this.audio) {
            this.initAudio();
        }
        const clamped = Math.max(0, Math.min(1, val));
        if (this.audio) {
            this.audio.volume = clamped;
        }
        this.targetVolume = clamped;
        this.state.volume = clamped;
        if (clamped > 0 && this.audio && this.audio.muted) {
            this.audio.muted = false;
            this.state.isMuted = false;
        }
        this.notifySubscribers();
    }

    /**
     * Fades the volume out over ~700ms, stops playback, and resets position for logout
     */
    public fadeAndStop(durationMs = 700): Promise<void> {
        this.clearPreference();

        return new Promise((resolve) => {
            if (!this.audio || this.audio.paused) {
                if (this.audio) {
                    this.audio.currentTime = 0;
                }
                this.state.isPlaying = false;
                this.notifySubscribers();
                resolve();
                return;
            }

            if (this.fadeInterval) {
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }

            const currentVol = this.audio.volume;
            const stepCount = 14;
            const stepDuration = Math.max(20, Math.floor(durationMs / stepCount));
            const decrement = currentVol / stepCount;
            let vol = currentVol;

            this.fadeInterval = setInterval(() => {
                vol = Math.max(0, vol - decrement);
                if (this.audio) {
                    this.audio.volume = vol;
                }
                this.state.volume = vol;
                this.notifySubscribers();

                if (vol <= 0.01) {
                    clearInterval(this.fadeInterval);
                    this.fadeInterval = null;
                    if (this.audio) {
                        this.audio.pause();
                        this.audio.currentTime = 0;
                        this.audio.volume = 0.35; // reset default for next session
                    }
                    this.state.isPlaying = false;
                    this.state.volume = 0.35;
                    this.notifySubscribers();
                    resolve();
                }
            }, stepDuration);
        });
    }

    public getState(): AudioState {
        return { ...this.state };
    }
}

export const audioManager = HollylandAudioManager.getInstance();
